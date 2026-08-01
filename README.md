# ⚡ SIGNAL HR — AI Resume Screening & Candidate Match Engine

> **Portfolio MVP Project** — Executive-grade precision intelligence console for automated resume ingestion, entity extraction, weighted criteria matching, and candidate ranking.

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.0-black.svg?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg?style=flat&logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-06B6D4.svg?style=flat&logo=tailwindcss)
![Prisma](https://img.shields.io/badge/Prisma-6.0-2D3748.svg?style=flat&logo=prisma)
![Neon PostgreSQL](https://img.shields.io/badge/Database-Neon--PostgreSQL-00E599.svg?style=flat&logo=postgresql)

---

## 🎨 Visual Identity — **SIGNAL HR**

Designed with an **Executive Precision Console** aesthetic (`#07090E` Deep Obsidian canvas with `#0E131F` panel surface and `#182238` grid borders).

- **High Match Signal (≥80%)**: Emerald Teal (`#10B981`) — High Confidence Fit
- **Good Fit Signal (60–79%)**: Cyan Azure (`#06B6D4`) — Strong Candidate Recommendation
- **Moderate Signal (40–59%)**: Warm Amber (`#F59E0B`) — Mixed Criteria (Requires HR Audit)
- **Low Match Signal (<40%)**: Subdued Crimson (`#F43F5E`) — Unmatched Criteria
- **Signature Element**: 5-Segment Micro Signal Meter `[▮▮▮▮▮]` + Monospace Tabular Figures (`95.4%`)

---

## 🚀 Key Modules & Capabilities

1. **Job Requisition Console (`/jobs`)**
   - Full CRUD lifecycle for job requisitions with target criteria matrix.
   - Skill weighting: **Mandatory (Weight 2x)** vs **Nice-to-Have (Weight 1x)**.

2. **Resume Ingestion Engine (`/candidates/upload`)**
   - Bulk drag-and-drop resume ingestion supporting PDF & DOCX file formats.
   - Automated regex & dictionary entity extraction (Full name, Email, Phone, LinkedIn, GitHub, Portfolio URLs, Skills, Education, and Work History).
   - High-fault-tolerance parsing status flags (`parsed`, `needs_review`, `failed`).

3. **Candidate Match Leaderboard (`/jobs/[id]/candidates`)**
   - Multi-sort candidate ranking (Match Score, Experience Years, GPA, Degree Level, Recency).
   - **Signature Match Matrix**: 5-segment micro-signal score badge.
   - Interactive expandable drawer detailing per-skill ratio score breakdown.

4. **Candidate Dossier & Resume Viewer (`/candidates/[id]`)**
   - Avatar pill with candidate initials and verified profile links.
   - 6-Tab View: Work Experience, Education History, Skill Inventory, Certifications, AI Executive Synthesis, and Inline PDF Resume Viewer.

5. **Recruitment Intelligence Overview (`/dashboard`)**
   - Real-time KPI Telemetry: Total Candidates, Uploaded Today, High Fit Candidates, Rejected Pipeline, Active Requisitions, and Mean Match Index.
   - Interactive Recharts Data Visualizations: Daily Applicant Velocity, Applicants per Position, Top Extracted Skills, and Candidate Funnel Stages.

---

## 🧮 AI Matching Formula

The matching engine calculates a deterministic **0–100 weighted fit score**:

$$\text{Score} = \left( \frac{\sum (\text{weight}_i \times \text{ratio}_i)}{\sum \text{weight}_i} \right) \times 100$$

Where $\text{ratio}_i$ is evaluated per skill requirement:
- **1.0**: Exact or partial keyword match.
- **0.5**: Synonym match (via built-in tech dictionary, e.g., `Golang` $\leftrightarrow$ `Go`, `Postgres` $\leftrightarrow$ `PostgreSQL`).
- **0.0**: No match detected.

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router, Server Actions, React 19) |
| **Language** | TypeScript (Strict Mode) |
| **Database** | Serverless PostgreSQL via [Neon](https://neon.tech) |
| **ORM** | Prisma ORM v6 |
| **Styling** | Tailwind CSS v4 + shadcn/ui + Lucide Icons |
| **Typography** | Plus Jakarta Sans + JetBrains Mono (`tabular-nums`) |
| **Charts** | Recharts v3 |
| **Parsing** | pdf-parse + mammoth (Server External Packages) |
| **Deployment** | Vercel |

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v18.0 or higher
- **Database**: Neon PostgreSQL connection string

### 2. Installation & Setup

```bash
# Clone the repository
git clone https://github.com/Faliqulxx/HR-TOOLS.git
cd HR-TOOLS/hr-tools-app

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
```

Edit `.env` and set your Neon connection string:
```env
DATABASE_URL="postgresql://neondb_owner:YOUR_KEY@ep-broad-lake-axsapssv-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require"
```

### 3. Database Migration & Seeding

```bash
# Push schema to database
npx prisma db push

# Seed 8 job requisitions, 12 candidate profiles & 50+ scored applications
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000/dashboard](http://localhost:3000/dashboard) to view the Signal HR dashboard.

---

## 📁 Repository Architecture

```
hr-tools-app/
├── prisma/
│   ├── schema.prisma       # Database schema models (Job, Candidate, Application)
│   └── seed.ts             # Seeding script with dummy jobs, candidates & matches
├── src/
│   ├── app/
│   │   ├── dashboard/      # Analytics overview & charts
│   │   ├── jobs/           # Job requisition CRUD & candidates leaderboard
│   │   ├── candidates/     # Resume upload, review parsing & candidate dossier
│   │   └── api/            # Resume upload route handler
│   ├── components/
│   │   ├── shared/         # Sidebar console navigation
│   │   ├── dashboard/      # KPI Cards, ApplicantsChart, SkillsChart, FunnelChart
│   │   ├── candidates/     # MatchScoreBar, CandidateTabs, ResumeViewer, UploadDropzone
│   │   └── jobs/           # JobTable, JobForm, RequirementInput
│   └── lib/
│       ├── ai/             # Core matching formula, parser regex, skill dictionary
│       ├── actions/        # Next.js Server Actions (matching, candidate, job, dashboard)
│       └── prisma.ts       # Prisma Client singleton
```

---

## 🏁 MVP Roadmap Status

- [x] **Phase 0**: Project Setup, Neon Database & Prisma Schema
- [x] **Phase 1**: Job Management CRUD & Skill Requirements Matrix
- [x] **Phase 2**: Bulk Resume Upload & Entity Extraction Parser
- [x] **Phase 3**: Weighted AI Matching Engine & Candidate Leaderboard
- [x] **Phase 4**: Candidate Dossier Detail Page & Inline Resume Viewer
- [x] **Phase 5**: Recruitment Telemetry Dashboard & Recharts Analytics
- [x] **Phase 6**: Visual Redesign (Signal HR Design System), Seed Script & Deployment

---

## 📜 License

Distributed under the MIT License. Built for portfolio & recruitment evaluation.
