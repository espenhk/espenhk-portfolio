"""Design tokens: validate a Claude Design `tokens.json`, generate CSS and check contrast.

Standard library only. This file is also copied verbatim into each consumer repo next to
its drift test, so the test regenerates the CSS with exactly the code that wrote it.
Keep it self-contained: no imports from the rest of the skill.

Format (the Design System artifact type):
  {"name", "version",
   "color": {"themes": [{"id", "name"}, ...], "tokens": [{"name", "value", "usage"}, ...]},
   "type": {"fonts": [...], "families": {key: stack}, "groups": [{"name", "family", "styles": [...]}]},
   "<family>": {"tokens": [...]}, ...}
A value is a string (all themes), a {theme_id: value} map (a missing theme inherits the first
theme's value) or an alias "{other-token}" of a token in the same family.
"""
from __future__ import annotations

import colorsys
import hashlib
import json
import re
from pathlib import Path

GENERATOR_VERSION = 1
NAME_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_.-]{0,63}$")
ALIAS_RE = re.compile(r"^\{([^{}]+)\}$")
HEX_RE = re.compile(r"^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$")
FUNC_RE = re.compile(r"^(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\([^()]*\)$", re.I)
LENGTH_RE = re.compile(r"^-?(?:\d+|\d*\.\d+)(?:px|rem|em|%)?$")
UNSAFE_RE = re.compile(r"[;{}<>\\]|/\*|\*/")
LENGTH_FAMILIES = {"spacing", "radius", "size"}
SKIP_KEYS = {"name", "version", "meta", "color", "type"}
BEGIN = "/* design-sync:begin */"
END = "/* design-sync:end */"


# ---------------------------------------------------------------- loading

def sha256_bytes(data: bytes) -> str:
    return hashlib.sha256(data).hexdigest()


def sha256_file(path: str | Path) -> str:
    return sha256_bytes(Path(path).read_bytes())


def load(path: str | Path) -> dict:
    return json.loads(Path(path).read_text(encoding="utf-8"))


def theme_ids(tokens: dict) -> list[str]:
    return [t.get("id") for t in (tokens.get("color") or {}).get("themes") or []]


def families(tokens: dict) -> list[tuple[str, list[dict]]]:
    """Every token family as (family, entries), color first, then the file's order. Type is separate."""
    out = []
    color = tokens.get("color")
    if isinstance(color, dict):
        out.append(("color", color.get("tokens") or []))
    for key, val in tokens.items():
        if key in SKIP_KEYS or not isinstance(val, dict) or "tokens" not in val:
            continue
        out.append((key, val.get("tokens") or []))
    return out


def _index(tokens: dict) -> dict[str, tuple[str, dict]]:
    idx = {}
    for fam, entries in families(tokens):
        for e in entries:
            if isinstance(e, dict) and isinstance(e.get("name"), str):
                idx.setdefault(e["name"], (fam, e))
    return idx


def _num(v) -> str:
    if isinstance(v, bool):
        raise ValueError(v)
    if isinstance(v, (int, float)):
        return repr(v) if isinstance(v, float) else str(v)
    return str(v)


# ---------------------------------------------------------------- validation

def _check_scalar(fam: str, v) -> str | None:
    """Return a problem with a single (non-alias) value, or None."""
    if isinstance(v, bool) or not isinstance(v, (str, int, float)):
        return f"value {v!r} must be a string or a number"
    s = _num(v).strip()
    if not s:
        return "empty value"
    if UNSAFE_RE.search(s):
        return f"value {s!r} contains characters that are not allowed in CSS values"
    if fam == "color":
        if not (HEX_RE.match(s) or FUNC_RE.match(s)):
            return f"bad color {s!r} (hex or rgb()/hsl()/oklch()-style without nested functions; no named colors, var() or color-mix())"
    elif fam in LENGTH_FAMILIES:
        if not LENGTH_RE.match(s):
            return f"bad length {s!r} (px, rem, em, % or a number)"
    elif fam == "opacity":
        try:
            f = float(s)
        except ValueError:
            return f"bad opacity {s!r} (a number from 0 to 1)"
        if not 0 <= f <= 1:
            return f"bad opacity {s!r} (a number from 0 to 1)"
    return None


def validate(tokens: dict) -> list[str]:
    """All problems in a tokens object. Empty list = valid."""
    errs: list[str] = []
    if not isinstance(tokens, dict):
        return ["top level must be a JSON object"]
    if not isinstance(tokens.get("name"), str) or not tokens["name"].strip():
        errs.append("name: missing")
    color = tokens.get("color")
    if not isinstance(color, dict):
        return errs + ["color: missing"]
    themes = theme_ids(tokens)
    if not themes:
        errs.append("color.themes: at least one theme is required")
    if any(not isinstance(t, str) or not NAME_RE.match(t) for t in themes):
        errs.append(f"color.themes: bad theme id in {themes!r}")
    if len(set(themes)) != len(themes):
        errs.append(f"color.themes: duplicate theme id in {themes!r}")

    seen: dict[str, str] = {}
    for fam, entries in families(tokens):
        if not isinstance(entries, list):
            errs.append(f"{fam}.tokens: must be a list")
            continue
        for i, e in enumerate(entries):
            where = f"{fam}.tokens[{i}]"
            if not isinstance(e, dict):
                errs.append(f"{where}: must be an object")
                continue
            name = e.get("name")
            if not isinstance(name, str) or not NAME_RE.match(name):
                errs.append(f"{where}: bad name {name!r}")
                continue
            where = f"{fam}.{name}"
            if name in seen:
                errs.append(f"{where}: duplicate name (also in {seen[name]})")
                continue
            seen[name] = fam
            if "value" not in e:
                errs.append(f"{where}: no value")
                continue
            val = e["value"]
            if isinstance(val, dict):
                if not val:
                    errs.append(f"{where}: empty theme map")
                    continue
                unknown = [k for k in val if k not in themes]
                if unknown:
                    errs.append(f"{where}: unknown theme(s) {unknown} (themes: {themes})")
                if themes and themes[0] not in val:
                    errs.append(f"{where}: no value for the first theme {themes[0]!r}")
                items = list(val.items())
            else:
                items = [(None, val)]
            for th, v in items:
                tag = f"{where}[{th}]" if th else where
                if isinstance(v, str) and ALIAS_RE.match(v.strip()):
                    continue
                p = _check_scalar(fam, v)
                if p:
                    errs.append(f"{tag}: {p}")

    # aliases: target exists, same family, no cycles
    idx = _index(tokens)
    for name, (fam, e) in idx.items():
        for th in themes or [None]:
            target, chain = name, [name]
            while True:
                v = _raw(idx[target][1]["value"], th, themes)
                m = ALIAS_RE.match(v.strip()) if isinstance(v, str) else None
                if not m:
                    break
                nxt = m.group(1)
                if nxt not in idx:
                    errs.append(f"{fam}.{name}: alias to unknown token {{{nxt}}}")
                    break
                if idx[nxt][0] != fam:
                    errs.append(f"{fam}.{name}: alias {{{nxt}}} is a {idx[nxt][0]} token, not {fam}")
                    break
                if nxt in chain:
                    errs.append(f"{fam}.{name}: alias cycle {' -> '.join(chain + [nxt])}")
                    break
                chain.append(nxt)
                target = nxt
    errs = list(dict.fromkeys(errs))

    # type
    typ = tokens.get("type")
    if typ is not None:
        if not isinstance(typ, dict):
            errs.append("type: must be an object")
        else:
            fams = typ.get("families") or {}
            for k, stack in fams.items():
                if not NAME_RE.match(str(k)):
                    errs.append(f"type.families: bad key {k!r}")
                if not isinstance(stack, str) or not stack.strip() or UNSAFE_RE.search(stack):
                    errs.append(f"type.families.{k}: bad font stack {stack!r}")
            for g in typ.get("groups") or []:
                gname = g.get("name", "?")
                if g.get("family") and g["family"] not in fams:
                    errs.append(f"type.groups.{gname}: unknown family {g['family']!r}")
                for s in g.get("styles") or []:
                    sname = s.get("name")
                    if not isinstance(sname, str) or not NAME_RE.match(sname):
                        errs.append(f"type.groups.{gname}: bad style name {sname!r}")
                        continue
                    for key, _ in TYPE_PROPS:
                        if key in s and (isinstance(s[key], (dict, list, bool)) or UNSAFE_RE.search(_num(s[key]))):
                            errs.append(f"type.{sname}.{key}: bad value {s[key]!r}")

    # generated CSS variable names must not collide
    if not errs:
        names: dict[str, str] = {}
        for var, _, origin in _type_vars(tokens):
            if var in names or var in seen:
                errs.append(f"{origin}: CSS variable --{var} collides with {names.get(var) or seen.get(var)}")
            names[var] = origin
    return errs


def _raw(value, theme, themes):
    if isinstance(value, dict):
        if theme in value:
            return value[theme]
        return value.get(themes[0]) if themes else None
    return value


# ---------------------------------------------------------------- CSS

TYPE_PROPS = [("fontSize", "font-size"), ("lineHeight", "line-height"),
              ("fontWeight", "font-weight"), ("letterSpacing", "letter-spacing")]


def _type_vars(tokens: dict) -> list[tuple[str, str, str]]:
    """(var name, value, origin) for every type variable."""
    typ = tokens.get("type") or {}
    out = []
    for k, stack in (typ.get("families") or {}).items():
        out.append((f"font-{k}", stack, f"type.families.{k}"))
    for g in typ.get("groups") or []:
        for s in g.get("styles") or []:
            if g.get("family"):
                out.append((f"{s['name']}-font-family", f"var(--font-{g['family']})", f"type.{s['name']}"))
            for key, prop in TYPE_PROPS:
                if key in s:
                    out.append((f"{s['name']}-{prop}", _num(s[key]), f"type.{s['name']}"))
    return out


def _css_value(v) -> str:
    s = _num(v).strip()
    m = ALIAS_RE.match(s)
    return f"var(--{m.group(1)})" if m else s


def _is_themed(name: str, idx: dict, depth: int = 0) -> bool:
    val = idx[name][1]["value"]
    if isinstance(val, dict):
        return True
    m = ALIAS_RE.match(val.strip()) if isinstance(val, str) else None
    return bool(m and depth < 64 and m.group(1) in idx and _is_themed(m.group(1), idx, depth + 1))


def generate_css(tokens: dict, prefers_dark: bool = False) -> str:
    """CSS custom properties for a VALID tokens object (run validate() first).

    Plain tokens go in :root. Themed tokens, and plain aliases of themed tokens, go in one
    block per theme: the first theme on `:root, [data-theme="<first>"]`, the others on
    `[data-theme="<id>"]`, so a theme can be set on <html> or on any subtree.
    prefers_dark also applies the "dark" theme under prefers-color-scheme: dark unless the
    page sets data-theme="<first>".
    """
    themes = theme_ids(tokens)
    idx = _index(tokens)
    plain, themed = [], []
    for fam, entries in families(tokens):
        for e in entries:
            (themed if _is_themed(e["name"], idx) else plain).append(e)

    def block(selector: str, lines: list[str], indent: str = "") -> list[str]:
        if not lines:
            return []
        return [f"{indent}{selector} {{", *(f"{indent}  {ln}" for ln in lines), f"{indent}}}"]

    def theme_lines(th: str) -> list[str]:
        lines = [f"color-scheme: {th};"] if th in ("light", "dark") else []
        for e in themed:
            lines.append(f"--{e['name']}: {_css_value(_raw(e['value'], th, themes))};")
        return lines

    name = tokens.get("name", "Design system")
    ver = tokens.get("version")
    out = [f"/* {name}{f' v{ver}' if ver is not None else ''} — generated from tokens.json by design-sync. Do not edit. */"]
    root = [f"--{e['name']}: {_css_value(e['value'])};" for e in plain]
    root += [f"--{var}: {val};" for var, val, _ in _type_vars(tokens)]
    out += block(":root", root)
    if themes:
        out += block(f':root, [data-theme="{themes[0]}"]', theme_lines(themes[0]))
        for th in themes[1:]:
            out += block(f'[data-theme="{th}"]', theme_lines(th))
        if prefers_dark and "dark" in themes[1:]:
            out.append("@media (prefers-color-scheme: dark) {")
            out += block(f':root:not([data-theme="{themes[0]}"])', theme_lines("dark"), "  ")
            out.append("}")
    return "\n".join(out) + "\n"


def replace_block(text: str, css: str) -> str:
    """Put css between the design-sync markers in a template. Raises ValueError without them."""
    b, e = text.find(BEGIN), text.find(END)
    if b < 0 or e < b or text.count(BEGIN) != 1 or text.count(END) != 1:
        raise ValueError(f"needs exactly one {BEGIN} ... {END} pair")
    return text[: b + len(BEGIN)] + "\n" + css + text[e:]


def extract_block(text: str) -> str | None:
    b, e = text.find(BEGIN), text.find(END)
    if b < 0 or e < b:
        return None
    return text[b + len(BEGIN) + 1 : e]


# ---------------------------------------------------------------- contrast

def parse_color(s: str) -> tuple[float, float, float, float] | None:
    """(r, g, b, a) with r, g, b in 0..255, for hex, rgb(a)() and hsl(a)(). None = can't check."""
    s = s.strip()
    if HEX_RE.match(s):
        h = s[1:]
        if len(h) in (3, 4):
            h = "".join(c * 2 for c in h)
        a = int(h[6:8], 16) / 255 if len(h) == 8 else 1.0
        return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), a
    m = re.match(r"^(rgba?|hsla?)\(([^()]*)\)$", s, re.I)
    if not m:
        return None
    parts = [p for p in re.split(r"[\s,/]+", m.group(2).strip()) if p]
    if len(parts) not in (3, 4):
        return None

    def num(p, scale):
        return float(p[:-1]) * scale / 100 if p.endswith("%") else float(p)

    try:
        a = num(parts[3], 1) if len(parts) == 4 else 1.0
        if m.group(1).lower().startswith("rgb"):
            r, g, b = (num(p, 255) for p in parts[:3])
        else:
            hue = float(parts[0].removesuffix("deg")) % 360 / 360
            sat = float(parts[1].rstrip("%")) / 100
            light = float(parts[2].rstrip("%")) / 100
            r, g, b = (c * 255 for c in colorsys.hls_to_rgb(hue, light, sat))
    except ValueError:
        return None
    return r, g, b, a


def _over(fg, bg):
    a = fg[3]
    return tuple(fg[i] * a + bg[i] * (1 - a) for i in range(3)) + (1.0,)


def _lum(c) -> float:
    def ch(v):
        v /= 255
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * ch(c[0]) + 0.7152 * ch(c[1]) + 0.0722 * ch(c[2])


def contrast_ratio(fg, bg) -> float:
    a, b = _lum(fg), _lum(bg)
    return (max(a, b) + 0.05) / (min(a, b) + 0.05)


def resolve(tokens: dict, name: str, theme: str) -> str | None:
    """A token's final value in a theme, aliases followed."""
    idx, themes = _index(tokens), theme_ids(tokens)
    for _ in range(64):
        if name not in idx:
            return None
        v = _num(_raw(idx[name][1]["value"], theme, themes)).strip()
        m = ALIAS_RE.match(v)
        if not m:
            return v
        name = m.group(1)
    return None


def auto_pairs(tokens: dict, base: str) -> list[list[str]]:
    """Pairs implied by names: on-X on X (and X-hover); X-ink on X-bg, else on the base."""
    names = [e["name"] for e in (tokens.get("color") or {}).get("tokens") or []]
    have = set(names)
    pairs = []
    for n in names:
        if n.startswith("on-") and n[3:] in have:
            pairs.append([n, n[3:]])
            if f"{n[3:]}-hover" in have:
                pairs.append([n, f"{n[3:]}-hover"])
        elif n.endswith("-ink"):
            stem = n[: -len("-ink")]
            pairs.append([n, f"{stem}-bg" if f"{stem}-bg" in have else base])
    return pairs


def contrast_report(tokens: dict, pairs=(), base: str = "background", minimum: float = 4.5,
                    waive=(), auto: bool = True) -> list[dict]:
    """One row per (pair, theme): fg, bg, theme, ratio (None = unchecked), min, ok, waived.

    A translucent background is composited over `base`, a translucent foreground over the
    result. A base that is itself translucent sits on white.
    """
    themes = theme_ids(tokens)
    all_pairs = [list(p[:2]) + [p[2] if len(p) > 2 else minimum] for p in pairs]
    if auto:
        all_pairs += [p + [minimum] for p in auto_pairs(tokens, base)]
    waived = {(w[0], w[1]) for w in waive}
    rows, done = [], set()
    for fg, bg, need in all_pairs:
        if (fg, bg) in done:
            continue
        done.add((fg, bg))
        for th in themes:
            row = {"fg": fg, "bg": bg, "theme": th, "min": need, "ratio": None,
                   "waived": (fg, bg) in waived, "ok": True, "note": ""}
            vals = [resolve(tokens, n, th) for n in (fg, bg, base)]
            if vals[0] is None or vals[1] is None:
                row.update(ok=False, note="unknown token")
            else:
                cols = [parse_color(v) if v else None for v in vals]
                if cols[0] is None or cols[1] is None:
                    row["note"] = "unchecked (color format)"
                else:
                    ground = _over(cols[2], (255, 255, 255, 1.0)) if cols[2] else (255, 255, 255, 1.0)
                    b = _over(cols[1], ground)
                    f = _over(cols[0], b)
                    row["ratio"] = round(contrast_ratio(f, b), 2)
                    row["ok"] = row["ratio"] >= need
            rows.append(row)
    return rows


def contrast_failures(rows: list[dict]) -> list[str]:
    return [f"{r['fg']} on {r['bg']} [{r['theme']}]: "
            + (f"{r['ratio']}:1 < {r['min']}:1" if r["ratio"] is not None else r["note"])
            for r in rows if not r["ok"] and not r["waived"]]


# ---------------------------------------------------------------- diff

def token_diff(old: dict | None, new: dict) -> list[str]:
    """Human-readable token changes, one line each."""
    if not old:
        return ["(first sync)"]

    def flat(t):
        out = {f"{fam}.{e['name']}": e.get("value") for fam, es in families(t) for e in es if isinstance(e, dict)}
        for var, val, _ in _type_vars(t):
            out[f"type.{var}"] = val
        return out

    a, b = flat(old), flat(new)
    lines = []
    if old.get("version") != new.get("version"):
        lines.append(f"version: {old.get('version')} -> {new.get('version')}")
    lines += [f"+ {k}: {json.dumps(b[k], ensure_ascii=False)}" for k in b if k not in a]
    lines += [f"- {k}" for k in a if k not in b]
    lines += [f"~ {k}: {json.dumps(a[k], ensure_ascii=False)} -> {json.dumps(b[k], ensure_ascii=False)}"
              for k in b if k in a and a[k] != b[k]]
    return lines or ["(no token changes)"]
