# HR Tools — AI Resume Screening System

> **Portfolio Project (MVP)** — AI-powered resume screening and candidate ranking system for modern HR teams.

## 🚀 Features

- **Job Management** — Create and manage job postings with skill requirements (mandatory & nice-to-have)
- **Resume Upload** — Drag-and-drop bulk upload for PDF/DOCX resumes
- **AI Resume Parser** — Rule-based extraction of candidate data (name, email, skills, education, experience)
- **AI Candidate Matching** — Automatic score calculation based on skill match against job requirements
- **Candidate Ranking** — Sortable ranking table with score breakdown per skill
- **Candidate Detail** — Full profile view with AI summary, experience timeline, and resume viewer
- **Dashboard** — KPI cards and charts for HR analytics

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router, TypeScript) |
| Database | PostgreSQL via [Neon](https://neon.tech) |
| ORM | Prisma |
| Styling | Tailwind CSS + shadcn/ui |
| AI Engine | Rule-based (no LLM API) |
| Deployment | Vercel |

## ⚡ Getting Started

### Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database

### Local Setup

```bash
# 1. Clone the repo
git clone https://github.com/Faliqulxx/HR-TOOLS.git
cd HR-TOOLS

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env
# Edit .env and fill in your DATABASE_URL from Neon

# 4. Run database migrations
npx prisma migrate dev

# 5. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Seed Database (optional)

```bash
npx prisma db seed
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/          # Dashboard with KPI & charts
│   ├── jobs/               # Job management (CRUD)
│   └── candidates/         # Resume upload & candidate detail
├── components/
│   ├── shared/             # Shared UI (Sidebar, etc.)
│   ├── jobs/               # Job-specific components
│   ├── candidates/         # Candidate-specific components
│   └── dashboard/          # Dashboard charts & cards
└── lib/
    ├── ai/                 # AI engine (parser, matching, summary)
    ├── actions/            # Next.js Server Actions
    ├── validations/        # Zod schemas
    └── prisma.ts           # Prisma client singleton
```

## 🗺 Roadmap

- [ ] Phase 1: Job Management CRUD
- [ ] Phase 2: Resume Upload & AI Parser
- [ ] Phase 3: AI Candidate Matching & Ranking
- [ ] Phase 4: Candidate Detail Page
- [ ] Phase 5: Dashboard Analytics
- [ ] Phase 6: Polish, Seed Data & Deploy

## 📄 License

MIT
