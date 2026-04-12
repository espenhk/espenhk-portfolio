#!/usr/bin/env python3
"""
Scrape LinkedIn recent activity and update src/data/linkedInPosts.ts.

Usage:
    python scripts/scrape-linkedin.py

Requirements:
    pip install playwright
    playwright install chromium

The script opens a real Chromium window. If you are not already logged in to
LinkedIn, sign in when the browser opens — the script will wait for the page
to fully load before it starts collecting data.
"""

import json
import os
import re
import sys
import time
import urllib.parse
from datetime import datetime, timedelta, timezone
from pathlib import Path

try:
    from playwright.sync_api import sync_playwright, Page, TimeoutError as PWTimeout
except ImportError:
    sys.exit(
        "playwright is not installed.\n"
        "Run:  pip install playwright && playwright install chromium"
    )

ACTIVITY_URL = "https://www.linkedin.com/in/espenhk/recent-activity/all/"
COMMENTS_URL = "https://www.linkedin.com/in/espenhk/recent-activity/comments/"
SCRAPE_URLS = [ACTIVITY_URL, COMMENTS_URL]

OUT_FILE = Path(__file__).parent.parent / "src" / "data" / "linkedInPosts.ts"

# Scroll settings — smaller steps + longer pauses = more reliable lazy-loading
SCROLL_ROUNDS   = 30
SCROLL_STEP_PX  = 800   # pixels per step (one viewport ≈ 900px)
SCROLL_PAUSE_MS = 3000  # ms to wait after each step

# Discard anything older than this
MAX_AGE_DAYS = 90


# ── date helpers ──────────────────────────────────────────────────────────────


def parse_relative_datetime(raw: str) -> datetime:
    """
    Convert LinkedIn relative timestamps like "2w", "3mo", "1yr", "5d", "4h"
    to an aware UTC datetime.  Falls back to now if unparseable.
    """
    raw = raw.strip().lower()
    now = datetime.now(tz=timezone.utc)

    m = re.match(r"(\d+)\s*(s|m|h|d|w|mo|yr)", raw)
    if not m:
        return now

    n, unit = int(m.group(1)), m.group(2)

    if unit in ("s", "m", "h"):
        return now
    elif unit == "d":
        return now - timedelta(days=n)
    elif unit == "w":
        return now - timedelta(weeks=n)
    elif unit == "mo":
        return now - timedelta(days=n * 30)
    else:  # yr
        return now - timedelta(days=n * 365)


def dt_to_mm_yyyy(dt: datetime) -> str:
    return f"{dt.month:02d}.{dt.year}"


# ── TypeScript emitter ────────────────────────────────────────────────────────


def to_ts(posts: list[dict]) -> str:
    lines = [
        "export interface LinkedInPost {",
        "  type: 'post' | 'comment' | 'article';",
        "  text: string;",
        "  date: string;",
        "  url: string;",
        "  likes?: number;",
        "  comments?: number;",
        '  /** LinkedIn activity ID for embed, e.g. "urn:li:share:7123456789" — optional */',
        "  activityUrn?: string;",
        "}",
        "",
        "export const linkedInPosts: LinkedInPost[] = [",
    ]

    for p in posts:
        raw_text = (
            p["text"].replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
        )
        # Wrap comment text in typographic quotes
        text = f"\u201c{raw_text}\u201d" if p["type"] == "comment" else raw_text
        parts = [
            f"  {{",
            f"    type: '{p['type']}',",
            f"    text: `{text}`,",
            f"    date: '{p['date']}',",
            f"    url: '{p['url']}',",
        ]
        if p.get("likes") is not None:
            parts.append(f"    likes: {p['likes']},")
        if p.get("comments") is not None:
            parts.append(f"    comments: {p['comments']},")
        if p.get("activityUrn"):
            parts.append(f"    activityUrn: '{p['activityUrn']}',")
        parts.append("  },")
        lines.extend(parts)

    lines.append("];\n")
    return "\n".join(lines)


# ── number parser (handles "1,234" and "1.2K" etc.) ──────────────────────────


def parse_count(s: str) -> int | None:
    if not s:
        return None
    s = s.strip().replace(",", "")
    m = re.match(r"([\d.]+)\s*([KkMm]?)", s)
    if not m:
        return None
    val = float(m.group(1))
    suffix = m.group(2).upper()
    if suffix == "K":
        val *= 1_000
    elif suffix == "M":
        val *= 1_000_000
    return int(val)


# ── per-page scraper ──────────────────────────────────────────────────────────


def scrape_page(page: Page, url: str, seen_urls: set[str]) -> list[dict]:
    """Scrape one LinkedIn activity page and return new posts (deduped via seen_urls)."""
    posts: list[dict] = []

    FEED_SELECTOR = (
        "div[data-urn], li[data-urn], "
        "div.profile-creator-shared-feed-update__container"
    )
    LOGIN_SELECTOR = (
        "input[name='session_password'], "
        "form[action*='login'], "
        "[class*='sign-in'], "
        "[data-test-id='sign-in-form']"
    )

    def _is_login_wall() -> bool:
        try:
            if "/login" in page.url or "/authwall" in page.url or "/checkpoint" in page.url:
                return True
            return page.query_selector(LOGIN_SELECTOR) is not None
        except Exception:
            return False

    def _has_feed_content() -> bool:
        try:
            return page.query_selector(FEED_SELECTOR) is not None
        except Exception:
            return False

    def _navigate_and_wait_for_login(target_url: str) -> None:
        """Navigate to target_url and wait until feed content is visible."""
        page.goto(target_url, wait_until="domcontentloaded", timeout=60_000)
        time.sleep(2)
        was_login_wall = False
        # Wait up to 10 minutes for login + content load
        for i in range(120):
            if _has_feed_content():
                return
            if _is_login_wall():
                was_login_wall = True
                if i % 6 == 0:  # print every 30 s
                    print("Please log in to LinkedIn in the browser window…")
                time.sleep(5)
                continue
            # Not on login wall, no feed — if we just logged in, re-navigate
            if was_login_wall:
                print("Login detected, navigating to target page…")
                page.goto(target_url, wait_until="domcontentloaded", timeout=60_000)
                was_login_wall = False
                time.sleep(4)
                continue
            time.sleep(5)
        # Last-ditch re-navigate
        if not _has_feed_content():
            page.goto(target_url, wait_until="domcontentloaded", timeout=60_000)
            time.sleep(5)

    print(f"\nOpening {url} …")
    _navigate_and_wait_for_login(url)

    print("Waiting for activity feed to load…")
    if not _has_feed_content():
        print("Warning: activity cards not found — LinkedIn may have changed its markup.")

    print(f"Scrolling {SCROLL_ROUNDS} times to load more posts…")
    for i in range(SCROLL_ROUNDS):
        try:
            page.evaluate(f"window.scrollBy(0, {SCROLL_STEP_PX})")
            page.wait_for_timeout(SCROLL_PAUSE_MS)
        except Exception:
            # Page navigated mid-scroll (e.g. login redirect) — wait for login then retry
            print(
                f"\n  Scroll interrupted at {i+1}/{SCROLL_ROUNDS}, checking for login redirect…"
            )
            time.sleep(3)
            if (
                "/login" in page.url
                or "/authwall" in page.url
                or "/checkpoint" in page.url
            ):
                print("  Login required — waiting…")
                try:
                    page.wait_for_url("**/recent-activity/**", timeout=120_000)
                except PWTimeout:
                    pass
            # Re-navigate to target if needed
            if "recent-activity" not in page.url:
                _navigate_and_wait_for_login(url)
                try:
                    page.wait_for_selector(
                        "div[data-urn], li[data-urn]", timeout=10_000
                    )
                except PWTimeout:
                    pass
            continue
        sys.stdout.write(f"\r  scroll {i+1}/{SCROLL_ROUNDS}")
        sys.stdout.flush()
    print()

    print("Extracting posts…")
    items = page.query_selector_all(
        "div[data-urn], "
        "li[data-urn], "
        "div.profile-creator-shared-feed-update__container"
    )
    print(f"Found {len(items)} candidate elements.")

    cutoff = datetime.now(tz=timezone.utc) - timedelta(days=MAX_AGE_DAYS)

    for el in items:
        try:
            urn = el.get_attribute("data-urn") or ""

            # ── URL (collected early so we can decode comment timestamp) ────
            is_comments_page = "comments" in url
            raw_href = ""
            post_url = ""
            for selector in [
                "a[href*='/posts/']",
                "a[href*='/feed/update/']",
                "a[href*='activity-']",
            ]:
                a = el.query_selector(selector)
                if a:
                    raw_href = a.get_attribute("href") or ""
                    if raw_href:
                        post_url = raw_href.split("?")[0]
                        break
            if not post_url and urn:
                post_url = f"https://www.linkedin.com/feed/update/{urn}/"

            # ── date ────────────────────────────────────────────────────────
            post_dt: datetime | None = None
            epoch_min = datetime(2010, 1, 1, tzinfo=timezone.utc)
            epoch_max = datetime.now(tz=timezone.utc) + timedelta(days=1)

            def _ts_from_id(numeric_id: str) -> datetime | None:
                try:
                    ms = int(numeric_id) >> 22
                    dt = datetime.fromtimestamp(ms / 1000, tz=timezone.utc)
                    return dt if epoch_min <= dt <= epoch_max else None
                except (ValueError, OSError):
                    return None

            # Strategy 1: on comments page, decode timestamp from commentUrn in href.
            # The commentUrn encodes WHEN I commented, not when the original post
            # was written — so this is the right timestamp to use.
            if is_comments_page and raw_href:
                qs = urllib.parse.parse_qs(urllib.parse.urlparse(raw_href).query)
                comment_urn = qs.get("commentUrn", [None])[0]
                if comment_urn:
                    comment_urn = urllib.parse.unquote(comment_urn)
                    # format: urn:li:comment:(activity:POST_ID,COMMENT_ID)
                    m = re.search(r",(\d{15,})\)", comment_urn)
                    if m:
                        post_dt = _ts_from_id(m.group(1))

            # Strategy 2: <time datetime="ISO…"> attribute
            if post_dt is None:
                time_el = el.query_selector("time[datetime]")
                if time_el:
                    dt_attr = time_el.get_attribute("datetime") or ""
                    try:
                        post_dt = datetime.fromisoformat(dt_attr.replace("Z", "+00:00"))
                    except ValueError:
                        pass

            # Strategy 3: decode timestamp from the card's data-urn integer.
            # For the /all/ page this is our post's URN — correct.
            # For /comments/ page this is the original post's URN — may be old,
            # but it's the best fallback if we couldn't get the commentUrn above.
            if post_dt is None and urn:
                id_match = re.search(r":(\d{15,})", urn)
                if id_match:
                    post_dt = _ts_from_id(id_match.group(1))

            # Strategy 4: relative text walk ("2w", "3mo" …)
            if post_dt is None:
                raw_date = el.evaluate("""el => {
                    const TS = /\\b(\\d+)\\s*(s|m|h|d|w|mo|yr)\\b/i;
                    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
                    let node;
                    while ((node = walker.nextNode())) {
                        const t = node.textContent.trim();
                        if (TS.test(t)) return t;
                    }
                    return '';
                }""") or ""
                raw_date = raw_date.split("•")[-1].strip()
                post_dt = parse_relative_datetime(raw_date) if raw_date else datetime.now(tz=timezone.utc)

            # Drop anything older than MAX_AGE_DAYS
            if post_dt < cutoff:
                continue

            date_str = dt_to_mm_yyyy(post_dt)

            # ── type ────────────────────────────────────────────────────────
            header_el = el.query_selector(
                ".feed-shared-update-v2__content-wrapper "
                ".update-components-header__text-view, "
                "[class*='actor'] [class*='description'], "
                "[class*='social-activity-header']"
            )
            header_txt = (header_el.inner_text() if header_el else "").lower()

            if "commented" in header_txt or "replied" in header_txt or is_comments_page:
                kind = "comment"
            elif "published an article" in header_txt or "wrote an article" in header_txt:
                kind = "article"
            else:
                kind = "post"

            # ── text ────────────────────────────────────────────────────────
            if is_comments_page:
                # The card shows: original post → (parent comment) → my comment.
                # My text is the LAST commentary/text block in the card.
                # Strip @-mention link elements so we don't capture the tagged name.
                text = el.evaluate("""el => {
                    const blocks = [
                        ...el.querySelectorAll('[class*="commentary"]'),
                        ...el.querySelectorAll('.update-components-text'),
                    ];
                    const seen = new Set();
                    const ordered = [];
                    for (const b of blocks) {
                        if (!seen.has(b)) { seen.add(b); ordered.push(b); }
                    }
                    if (ordered.length === 0) return '';
                    const block = ordered[ordered.length - 1];
                    // Clone and strip @-mention elements (links to LinkedIn profiles)
                    const clone = block.cloneNode(true);
                    clone.querySelectorAll(
                        'a[href*="/in/"], [class*="mention"], [data-entity-type]'
                    ).forEach(n => n.replaceWith(document.createTextNode(' ')));
                    return clone.innerText.replace(/\\s+/g, ' ').trim();
                }""") or ""
            else:
                # For posts and articles: find the first content block,
                # ignoring the actor header area at the top of the card.
                text = el.evaluate("""el => {
                    // Remove the actor/header section from consideration
                    const actor = el.querySelector(
                        '[class*="actor__container"], [class*="update-components-actor"], header'
                    );

                    const selectors = [
                        '[class*="commentary"]',
                        '.feed-shared-update-v2__description',
                        '.update-components-text',
                    ];
                    for (const sel of selectors) {
                        for (const node of el.querySelectorAll(sel)) {
                            if (actor && actor.contains(node)) continue;
                            const t = node.innerText.trim();
                            if (t) return t;
                        }
                    }
                    // Last resort: span[dir='ltr'] with enough text to not be a name
                    for (const s of el.querySelectorAll('span[dir="ltr"]')) {
                        if (actor && actor.contains(s)) continue;
                        const t = s.innerText.trim();
                        if (t.length > 60) return t;
                    }
                    return '';
                }""") or ""

            # ── clean text ───────────────────────────────────────────────────
            # Reject strings that look like a duplicated name ("Foo Bar\nFoo Bar")
            if text:
                lines = text.splitlines()
                if len(lines) == 2 and lines[0].strip() == lines[1].strip():
                    text = ""
            # Fallback name-strip: if @-mention wasn't a link, the name may still
            # be plain text at the start.  Scan words: while they look like a person
            # name (Title Case, no sentence punctuation), collect them.  If we
            # collected 2-3 such words AND the remainder starts lowercase (or with
            # a quote), strip them.
            if text and kind == "comment":
                words = text.split()
                i = 0
                while i < min(len(words), 4):
                    w = words[i]
                    bare = w.rstrip(".")
                    is_name_word = (
                        bare
                        and bare[0].isupper()
                        and (len(bare) == 1 or bare[1:].islower())
                        and not any(c in w for c in '!?,;:()\'"«»')
                    )
                    if is_name_word:
                        i += 1
                    else:
                        break
                if 2 <= i <= 3 and i < len(words):
                    remainder = " ".join(words[i:])
                    # Only strip if remainder starts lowercase or a quote
                    if remainder and (remainder[0].islower() or remainder[0] in "«\"'"):
                        text = remainder
            if not text:
                continue
            if not post_url:
                post_url = url  # last-resort fallback

            # ── likes / comments ─────────────────────────────────────────────
            likes: int | None = None
            num_comments: int | None = None

            for cnt_el in el.query_selector_all(
                "[class*='social-action-bar'] button span, "
                "[class*='reactions-count'], "
                "[aria-label*='reaction']"
            ):
                txt = cnt_el.inner_text().strip()
                n = parse_count(txt)
                if n is None:
                    continue
                label = (cnt_el.get_attribute("aria-label") or "").lower()
                if "comment" in label:
                    num_comments = n
                elif likes is None:
                    likes = n

            # ── dedup ────────────────────────────────────────────────────────
            # Key on URL when we have a real one; also key on text snippet to
            # catch the same comment appearing in multiple thread cards.
            text_key = text[:120].strip()
            url_key = post_url if post_url != url else None
            if (url_key and url_key in seen_urls) or text_key in seen_urls:
                continue
            if url_key:
                seen_urls.add(url_key)
            seen_urls.add(text_key)

            post: dict = {
                "type": kind,
                "text": text[:500],
                "date": date_str,
                "_sort_ts": post_dt.isoformat(),  # removed before writing
                "url": post_url,
            }
            if likes is not None:
                post["likes"] = likes
            if num_comments is not None:
                post["comments"] = num_comments
            if urn:
                post["activityUrn"] = urn

            posts.append(post)

        except Exception as exc:
            print(f"  skipping element: {exc}")
            continue

    return posts


# ── main scraper ──────────────────────────────────────────────────────────────


def scrape() -> list[dict]:
    all_posts: list[dict] = []
    seen_urls: set[str] = set()

    with sync_playwright() as pw:
        browser = pw.chromium.launch(headless=False, slow_mo=50)
        ctx = browser.new_context(
            viewport={"width": 1280, "height": 900},
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/124.0.0.0 Safari/537.36"
            ),
        )
        page = ctx.new_page()

        for url in SCRAPE_URLS:
            page_posts = scrape_page(page, url, seen_urls)
            print(f"  → {len(page_posts)} new items from {url}")
            all_posts.extend(page_posts)

        browser.close()

    return all_posts


# ── entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    posts = scrape()

    if not posts:
        print(
            "No posts found. The page structure may have changed, or you were not logged in."
        )
        sys.exit(1)

    # Sort newest-first using the stored ISO timestamp
    posts.sort(key=lambda p: p.get("_sort_ts", ""), reverse=True)

    # Strip internal sort key before writing
    for p in posts:
        p.pop("_sort_ts", None)

    print(f"\nExtracted {len(posts)} posts/comments (last {MAX_AGE_DAYS} days).")

    ts_content = to_ts(posts)
    OUT_FILE.write_text(ts_content, encoding="utf-8")
    print(f"Written → {OUT_FILE}")

    json_path = OUT_FILE.with_suffix(".json")
    json_path.write_text(
        json.dumps(posts, indent=2, ensure_ascii=False), encoding="utf-8"
    )
    print(f"Raw JSON → {json_path}")
