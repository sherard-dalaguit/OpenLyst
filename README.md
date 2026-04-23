# OpenLyst

> A remote job aggregation platform that pulls listings from across the web into a single, filterable feed — with saved-job tracking, application history, and email digest alerts.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)
![NextAuth](https://img.shields.io/badge/NextAuth-v5-purple)
![Deployed](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)

**Live:** [openlyst.io](https://www.openlyst.io)

---

## Overview

Finding remote work means checking a dozen job boards every day. OpenLyst solves that by aggregating listings from seven sources into one searchable, filterable feed — and keeping the database fresh automatically via a scheduled scraping pipeline that runs every 8 hours.

Users can bookmark jobs, mark applications, set category preferences, and subscribe to daily or weekly email digests of new listings in their areas of interest.

---

## Features

### Job Discovery
- Full-text search across job titles, companies, categories, and descriptions — with a custom relevance scoring pipeline (title match scores 5×, company 3×, category 2×, description 1×)
- Filter by job type (full-time, contract, internship), category, salary range, date posted, and sort order
- Pagination across the full live dataset

### Personal Tracking
- **Saved Jobs** — bookmark listings to review later
- **Applied Jobs** — track which jobs you've applied to
- **Saved Searches** — store filter combinations for repeated use

### Email Alerts
- Daily and weekly digest emails via SendGrid, scoped to each user's saved category preferences
- One-click unsubscribe via signed token URL
- Cron endpoints called by GitHub Actions on a schedule

### Authentication
- GitHub and Google OAuth sign-in (account linking supported)
- Email/password credentials with bcrypt hashing
- Session managed by NextAuth v5

---

## How It Works

### Scraping pipeline

Seven scrapers pull remote listings from across the web:

| Source | Method |
|--------|--------|
| RemoteOK | REST API (JSON) |
| Remotive | REST API (JSON) |
| WeWorkRemotely | RSS feed |
| WorkingNomads | RSS feed |
| SkipTheDrive | HTML (Cheerio) |
| Jobspresso | HTML (Cheerio) |
| JavaScriptJobs | HTML (Playwright headless browser) |

GitHub Actions runs `scripts/run-scraper.ts` every 8 hours via a scheduled workflow. Each scraper upserts jobs into MongoDB using a `(sourceJobId, sourceId)` compound unique index to prevent duplicates. A separate nightly cleanup workflow hits `/api/cron/cleanup` to remove stale listings.

### Search and filtering

The `getJobs` server action builds a MongoDB aggregation pipeline:

1. `$match` applies all active filters (job type, category, salary, date range)
2. If a search query is present, `$addFields` computes a relevance score per document
3. `$sort` orders by score + date (relevance mode) or pure date (newest/oldest mode)
4. `$skip` / `$limit` handles pagination

### Request flow

```
Browser → Next.js Server Component
  → lib/actions/*.ts   (Zod validation → Mongoose query)
  → MongoDB
  → ActionResponse<T>  { success, data?, error?, status? }
  → Page renders
```

Client-initiated requests (auth flows, settings updates) go through `lib/api.ts` → Next.js API routes.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router) + React 19 |
| Styling | Tailwind CSS v4, Radix UI primitives, shadcn/ui |
| Animations | Motion (Framer Motion) |
| Backend | Next.js API Routes (TypeScript) |
| Database | MongoDB Atlas + Mongoose |
| Auth | NextAuth v5 — GitHub, Google, credentials |
| Email | SendGrid |
| Scraping | Cheerio, Playwright, rss-parser |
| Forms | React Hook Form + Zod |
| Logging | Pino |
| Deployment | Vercel |
| CI/CD | GitHub Actions |

---

## Project Structure

```
remote_radar/
├── app/
│   ├── (auth)/                  # Sign-in and sign-up pages
│   ├── (root)/                  # Authenticated shell — navbar, sidebars
│   │   ├── jobs/                # Main listing feed (+ /jobs/[category])
│   │   ├── applied-jobs/        # Application history
│   │   ├── saved-jobs/          # Bookmarked listings
│   │   └── settings/[id]/       # User preferences and alert settings
│   └── api/
│       ├── auth/                # NextAuth handler + OAuth sign-in route
│       ├── users/               # User CRUD
│       ├── accounts/            # Provider account management
│       ├── settings/            # Preferences and alert toggles
│       ├── cron/                # daily | weekly digest | cleanup
│       ├── run-tests/           # Manual scraper trigger (dev)
│       └── unsubscribe/         # Email unsubscribe via signed token
├── components/                  # React components (UI, forms, cards, navigation)
├── database/                    # Mongoose models (Job, User, Account, Source, …)
├── lib/
│   ├── actions/                 # Server actions: job, saved, applied, auth, user
│   ├── handlers/                # action.ts, error.ts, fetch.ts — response normalization
│   ├── validations.ts           # Zod schemas for all inputs
│   ├── mongoose.ts              # Cached MongoDB connection
│   └── api.ts                   # Client-side fetch helper
├── scrapers/                    # One file per job source
├── scripts/
│   ├── run-scraper.ts           # Orchestrates all scrapers
│   ├── seed-sources.ts          # Initializes Source records in MongoDB
│   └── testScraper.ts           # Debug individual scrapers
├── constants/                   # Routes, filter definitions, app states
├── types/                       # TypeScript interfaces (ActionResponse, JobType, …)
└── .github/workflows/
    ├── scrape.yml               # Runs every 8 hours — seeds sources then scrapes
    └── cleanup.yml              # Runs nightly — calls /api/cron/cleanup
```

---

## Getting Started

**Prerequisites:** Node.js 20+, a MongoDB Atlas cluster, a SendGrid account, GitHub and Google OAuth apps

### 1. Clone and install

```bash
git clone https://github.com/your-username/remote-radar.git
cd remote_radar
npm install
```

### 2. Environment variables

Create `.env.local`:

```
AUTH_SECRET=<random string>

AUTH_GITHUB_ID=<github oauth app client id>
AUTH_GITHUB_SECRET=<github oauth app client secret>

AUTH_GOOGLE_ID=<google oauth client id>
AUTH_GOOGLE_SECRET=<google oauth client secret>

MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/RemoteRadar

SENDGRID_API_KEY=<sendgrid api key>
EMAIL_FROM=noreply@yourdomain.com
SITE_URL=http://localhost:3000
```

### 3. Seed the database and run

```bash
# Initialize source records (required before first scrape)
npx tsx scripts/seed-sources.ts

# Optional: run scrapers locally to populate jobs
npx tsx scripts/run-scraper.ts

# Start the dev server
npm run dev   # http://localhost:3000
```

---

## Database Schema

| Collection | Key Fields |
|-----------|-----------|
| `jobs` | `sourceJobId`, `title`, `companyName`, `category`, `jobType`, `salaryMin/Max`, `postedAt`, `sourceId` |
| `users` | `name`, `email`, `image`, `preferences` (categories, alert frequency) |
| `accounts` | `provider`, `providerAccountId`, `password` (hashed) |
| `sources` | Job board name, base URL, scraper identifier |
| `savedjobs` | `user` → `job` reference |
| `appliedjobs` | `user` → `job` reference |
| `savedsearches` | Serialized filter state per user |

Jobs are deduplicated via a compound unique index on `(sourceJobId, sourceId)`.

---

## Automation

| Workflow | Schedule | What it does |
|---------|---------|-------------|
| `scrape.yml` | Every 8 hours | Seeds sources → runs all 7 scrapers → logs insert counts |
| `cleanup.yml` | Daily at midnight | Calls `/api/cron/cleanup` to remove expired listings |

Both workflows can also be triggered manually via `workflow_dispatch`.

---

## Known Limitations

- **No real-time updates** — job listings are only as fresh as the last scraper run (up to 8 hours stale)
- **Source availability** — scrapers depend on third-party site structure; breaking changes upstream can silently drop a source until the scraper is updated
- **No full-text index** — relevance scoring uses `$regexMatch` inside an aggregation pipeline rather than a MongoDB Atlas Search index, which means it does not scale as efficiently under high load
- **No test suite** — scraper logic and server actions have no automated tests