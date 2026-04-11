#!/usr/bin/env python3
"""
CV PDF → JSON Resume converter.

Extracts text from a PDF CV and uses AI to produce structured JSON
matching the schema in scripts/resume-schema.json.

Usage:
    python scripts/parse-cv.py path/to/cv.pdf
    python scripts/parse-cv.py path/to/cv.pdf --out resume.json

The output can be fed directly into the TypeScript importer:
    npx tsx scripts/import-resume.ts resume.json --out src/data/experience.ts
"""

import sys
import os
import json
import argparse
import subprocess
import tempfile

def extract_text_from_pdf(pdf_path: str) -> str:
    """Extract text from PDF using pdftotext (poppler), falling back to pypdf."""
    # Try pdftotext first (better layout preservation)
    try:
        result = subprocess.run(
            ["pdftotext", "-layout", pdf_path, "-"],
            capture_output=True, text=True, timeout=30
        )
        if result.returncode == 0 and result.stdout.strip():
            return result.stdout
    except (FileNotFoundError, subprocess.TimeoutExpired):
        pass

    # Fallback to pypdf
    try:
        from pypdf import PdfReader
        reader = PdfReader(pdf_path)
        pages = []
        for i, page in enumerate(reader.pages):
            text = page.extract_text() or ""
            pages.append(f"--- Page {i+1} ---\n{text}")
        return "\n\n".join(pages)
    except ImportError:
        print("ERROR: Install pypdf (`pip install pypdf`) or ensure pdftotext is available.", file=sys.stderr)
        sys.exit(1)


SYSTEM_PROMPT = """You are a CV parser. You receive raw text extracted from a PDF CV/resume.
Extract structured data and return ONLY valid JSON matching this exact schema:

{
  "work": [
    {
      "name": "Company Name",
      "position": "Job Title",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD or null if current",
      "summary": "1-3 sentence role description",
      "highlights": ["Skill1", "Skill2"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "studyType": "Bachelor/Master/etc",
      "area": "Field of Study",
      "startDate": "YYYY-MM-DD",
      "endDate": "YYYY-MM-DD or null",
      "courses": ["Course1", "Course2"]
    }
  ],
  "certificates": [
    {
      "name": "Certification Name",
      "date": "YYYY-MM-DD",
      "issuer": "Issuing Organization"
    }
  ]
}

Rules:
- Dates: Use YYYY-MM-DD. If only month/year, use the 1st of the month. If only year, use January 1st.
- For current/ongoing roles, set endDate to null.
- Extract highlights/tags from bullet points, tech stacks, and key responsibilities.
- Preserve the original language of job titles and descriptions.
- If a section is missing from the CV, return an empty array for it.
- Return ONLY the JSON object, no markdown fences, no explanation."""


def call_ai(cv_text: str) -> dict:
    """Call Lovable AI to parse CV text into structured JSON."""
    sys.path.insert(0, "/tmp")
    from lovable_ai import call_ai_json

    prompt = f"Parse this CV:\n\n{cv_text}"
    result = call_ai_json(prompt, system=SYSTEM_PROMPT)
    return result


def main():
    parser = argparse.ArgumentParser(description="Parse a CV PDF into JSON Resume format")
    parser.add_argument("pdf", help="Path to CV PDF file")
    parser.add_argument("--out", "-o", help="Output JSON file (default: stdout)")
    args = parser.parse_args()

    if not os.path.exists(args.pdf):
        print(f"ERROR: File not found: {args.pdf}", file=sys.stderr)
        sys.exit(1)

    print(f"📄 Extracting text from {args.pdf}...", file=sys.stderr)
    cv_text = extract_text_from_pdf(args.pdf)

    if not cv_text.strip():
        print("ERROR: No text extracted from PDF. It may be a scanned/image-only PDF.", file=sys.stderr)
        sys.exit(1)

    print(f"   Extracted {len(cv_text)} characters from PDF", file=sys.stderr)
    print(f"🤖 Parsing with AI...", file=sys.stderr)

    result = call_ai(cv_text)

    # Validate structure
    for key in ("work", "education", "certificates"):
        if key not in result:
            result[key] = []

    output = json.dumps(result, indent=2, ensure_ascii=False)

    if args.out:
        with open(args.out, "w", encoding="utf-8") as f:
            f.write(output)
        print(f"✅ Written to {args.out}", file=sys.stderr)
        print(f"   {len(result['work'])} jobs, {len(result['education'])} education, {len(result['certificates'])} certifications", file=sys.stderr)
        print(f"\nNext step: npx tsx scripts/import-resume.ts {args.out} --out src/data/experience.ts", file=sys.stderr)
    else:
        print(output)


if __name__ == "__main__":
    main()
