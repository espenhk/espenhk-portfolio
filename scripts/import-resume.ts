#!/usr/bin/env npx tsx
/**
 * JSON Resume → experience.ts importer
 *
 * Reads a JSON Resume file (https://jsonresume.org/schema) and generates
 * the jobs, education, and certifications arrays for src/data/experience.ts.
 *
 * Usage:
 *   npx tsx scripts/import-resume.ts resume.json
 *   npx tsx scripts/import-resume.ts resume.json --out src/data/experience.ts
 *
 * Input format (JSON Resume standard):
 * {
 *   "work": [
 *     {
 *       "name": "PwC Norway",
 *       "position": "Manager",
 *       "startDate": "2025-08-01",
 *       "endDate": "",
 *       "summary": "Leading data engineering and AI initiatives.",
 *       "highlights": ["Data Engineering", "AI", "Leadership"]
 *     }
 *   ],
 *   "education": [
 *     {
 *       "institution": "University of Oslo",
 *       "area": "Mathematics, Informatics and Technology",
 *       "studyType": "Bachelor",
 *       "startDate": "2014-08-01",
 *       "endDate": "2018-06-01",
 *       "courses": []
 *     }
 *   ],
 *   "certificates": [
 *     {
 *       "name": "PL-300 Microsoft Certified: Power BI Data Analyst",
 *       "date": "2024-01-01",
 *       "issuer": "Microsoft"
 *     }
 *   ]
 * }
 */

import { readFileSync, writeFileSync } from 'fs';

const inputPath = process.argv[2];
if (!inputPath) {
  console.error('Usage: npx tsx scripts/import-resume.ts <resume.json> [--out <output.ts>]');
  process.exit(1);
}

const outIdx = process.argv.indexOf('--out');
const outputPath = outIdx !== -1 ? process.argv[outIdx + 1] : undefined;

const resume = JSON.parse(readFileSync(inputPath, 'utf-8'));

function fmtDate(iso: string | undefined | null): string {
  if (!iso) return 'ongoing';
  const d = new Date(iso);
  return `${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
}

// --- Jobs ---
interface WorkEntry {
  name: string;
  position: string;
  startDate: string;
  endDate?: string;
  summary?: string;
  highlights?: string[];
}

const jobs = (resume.work || []).map((w: WorkEntry) => ({
  company: w.name,
  role: w.position,
  period: `${fmtDate(w.startDate)} – ${fmtDate(w.endDate)}`,
  description: w.summary || '',
  tags: w.highlights || [],
}));

// --- Education ---
interface EduEntry {
  institution: string;
  area?: string;
  studyType?: string;
  startDate: string;
  endDate?: string;
  courses?: string[];
}

const education = (resume.education || []).map((e: EduEntry) => ({
  institution: e.institution,
  degree: [e.studyType, e.area].filter(Boolean).join(' '),
  period: `${fmtDate(e.startDate)} – ${fmtDate(e.endDate)}`,
  details: e.courses?.join(', ') || undefined,
}));

// --- Certifications ---
interface CertEntry {
  name: string;
  date?: string;
  issuer?: string;
}

const certifications = (resume.certificates || []).map((c: CertEntry) => ({
  name: c.name,
  date: fmtDate(c.date),
}));

// --- Generate output ---
const output = `// Auto-generated from JSON Resume — ${new Date().toISOString()}
// Source: ${inputPath}

export interface Job {
  company: string;
  role: string;
  period: string;
  description: string;
  tags?: string[];
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  details?: string;
}

export interface Certification {
  name: string;
  date: string;
}

export interface Publication {
  title: string;
  url: string;
  date: string;
  description: string;
  type: 'article' | 'video' | 'series';
  heroImage?: string;
  readTimeMin?: number;
  durationSec?: number;
}

export const jobs: Job[] = ${JSON.stringify(jobs, null, 2)};

export const education: Education[] = ${JSON.stringify(education, null, 2)};

export const certifications: Certification[] = ${JSON.stringify(certifications, null, 2)};

// Publications are fetched live — keep this array for fallback/manual entries
export const publications: Publication[] = [];
`;

if (outputPath) {
  writeFileSync(outputPath, output);
  console.log(`✅ Written to ${outputPath}`);
  console.log(`   ${jobs.length} jobs, ${education.length} education, ${certifications.length} certifications`);
} else {
  console.log(output);
}
