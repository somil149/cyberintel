# CyberIntel — Master Build Prompt

## Project Overview

Build a production-ready static cybersecurity intelligence platform covering major incidents, CVEs, and threat trends from 2005 to present. Deployable on GitHub Pages with no backend.

---

## Tech Stack

- **Framework**: Next.js (Pages Router, `output: 'export'` for static generation)
- **Styling**: Tailwind CSS with custom cyber theme (`bg-cyber-bg`, `text-cyber-accent`, etc.)
- **Charts**: Chart.js + react-chartjs-2 (wrapped in `dynamic(..., { ssr: false })` to prevent SSR crashes)
- **Maps**: Leaflet.js + react-leaflet (also `ssr: false`)
- **Data Pipeline**: Python scripts (optional — site ships with curated sample data)
- **Deployment**: `gh-pages` npm package

---

## Architecture

### Data Layer (`public/data/`)
Four static JSON files loaded client-side via `fetch()`:

- **`attacks.json`** — Array of incident objects with fields: `id, name, year, date, type, vector, actor, origin, target_country, target_industry, severity, risk_score, impact_score, sophistication, records_affected, financial_impact_usd, description, root_cause, mitre_techniques[], owasp_category, nist_control, lessons, lat, lng`
- **`cves.json`** — Array of CVE objects: `id, description, score, severity, published, year, attack_vector, in_kev, ransomware_use, risk_score, vendor, product`
- **`insights.json`** — Aggregated analytics object with keys: `severity_trend{year: {total,critical,high,avg_score,kev_count}}, attack_type_distribution, industry_impact, root_cause_distribution, yearly_attacks, financial_impact_by_year, top_failure_patterns[], time_to_exploit_trend, predictions`
- **`story.json`** — Array of year narratives: `year, era, title, summary, key_events[], paradigm_shift, dominant_attack, top_industry, risk_level, lesson, defensive_focus`

### Pages (`src/pages/`)
| Route | Purpose |
|-------|---------|
| `/` | Homepage — key stats, attack volume chart, financial impact, industry breakdown |
| `/timeline` | Vertical timeline sorted newest-first, click to expand each incident |
| `/trends` | CVE severity trends, KEV counts, time-to-exploit, financial impact, predictions |
| `/incidents` | Filterable table (year, severity, industry, type, search) with full RCA drill-down |
| `/map` | Leaflet world map with circle markers sized by risk score |
| `/cve` | CVE table with CVSS trends, KEV filter, ransomware linkage |
| `/rca` | Root cause analysis engine — groups incidents by failure category, maps to MITRE/OWASP/NIST |
| `/story` | Year-by-year narrative sidebar (newest first), paradigm shifts, lessons |

### Components (`src/components/`)
- `Layout.tsx` — Nav + footer wrapper; title uses template literal `` `${title} — CyberIntel` `` (NOT JSX expression — causes hydration failure)
- `Nav.tsx` — Sticky nav with active route highlighting
- `Charts.tsx` — Re-exports BarChart, LineChart, DoughnutChart all wrapped in `dynamic(..., { ssr: false })`
- `BarChart.tsx`, `LineChart.tsx`, `DoughnutChart.tsx` — Chart.js wrappers with dark cyber theme
- `MapView.tsx` — Leaflet map, client-only
- `AttackCard.tsx` — Expandable incident card with RCA, MITRE badges, framework mappings
- `RiskMeter.tsx` — SVG circular gauge (0–100)
- `SeverityBadge.tsx` — Color-coded CRITICAL/HIGH/MEDIUM/LOW badge
- `StatCard.tsx` — Metric display card

### Engine (`src/lib/engine.ts`)
Client-side risk scoring and RCA:
- `computeAttackRisk(attack)` — CVSS × industry criticality × sophistication multiplier
- `classifyRootCause(text)` — Regex pattern matching → category
- `analyzeAttack(attack)` → MITRE/OWASP/NIST mappings + recommendations
- `aggregateInsights(attacks[])` → top root causes, avg risk by year, high-risk years
- `linearRegression(data[])` → trend prediction

---

## Critical Implementation Notes

### 1. GitHub Pages requires `.nojekyll`
GitHub Pages uses Jekyll which **silently ignores `_next/` directory** (starts with underscore). Without `.nojekyll`, all JS/CSS is blocked and the page renders blank.

```json
"deploy": "npm run build && echo '' > out/.nojekyll && gh-pages -d out --dotfiles"
```

### 2. Base path configuration
```js
// next.config.js
const isProd = process.env.NODE_ENV === 'production'
const basePath = isProd ? (process.env.NEXT_PUBLIC_BASE_PATH || '') : ''
```

```ts
// src/lib/data.ts
const base = process.env.NODE_ENV === 'production'
  ? (process.env.NEXT_PUBLIC_BASE_PATH || '')
  : ''
```

Set `NEXT_PUBLIC_BASE_PATH=/your-repo-name` in `.env.local` for GitHub Pages.

### 3. Chart components must be SSR-disabled
`'use client'` is App Router only — it does nothing in Pages Router. Wrap all Chart.js components:
```ts
// src/components/Charts.tsx
export const BarChart = dynamic(() => import('./BarChart'), { ssr: false })
export const LineChart = dynamic(() => import('./LineChart'), { ssr: false })
export const DoughnutChart = dynamic(() => import('./DoughnutChart'), { ssr: false })
```

### 4. Title tag must use template literal
```tsx
// WRONG — causes hydration failure (array of children in <title>)
<title>{title} — CyberIntel</title>

// CORRECT
<title>{`${title} — CyberIntel`}</title>
```

### 5. TypeScript target must be es2017+
For `Set` iteration (`Array.from(new Set(...))` not `[...new Set(...)]`):
```json
{ "compilerOptions": { "target": "es2017" } }
```

### 6. Leaflet must be client-only
```tsx
const MapView = dynamic(() => import('@/components/MapView'), { ssr: false })
```

### 7. Year dropdowns — newest first
```ts
const YEARS = Array.from({ length: 22 }, (_, i) => 2026 - i)  // 2026 down to 2005
```

---

## Data Coverage
- **Incidents**: 46 real incidents (2005–2026) including Stuxnet, WannaCry, SolarWinds, Log4Shell, MOVEit, Bybit, Stryker, Checkmarx/Bitwarden CI/CD attack
- **CVEs**: 20 top exploited CVEs with CVSS scores, KEV status, ransomware linkage
- **Story**: 22 year narratives (2005–2026) with era classification, paradigm shifts, lessons
- **Insights**: Aggregated analytics including CVE severity trends, financial impact, time-to-exploit trend (45 days in 2015 → near-zero in 2026)

---

## Setup & Deployment

```bash
# Install
npm install

# Dev (local, no base path)
npm run dev
# → http://localhost:3000

# Deploy to GitHub Pages
# 1. Set .env.local:  NEXT_PUBLIC_BASE_PATH=/your-repo-name
# 2. Run:
npm run deploy
# 3. Enable GitHub Pages on gh-pages branch in repo settings
# → https://username.github.io/your-repo-name/
```

---

## Python Data Pipeline (optional refresh)

```bash
pip install requests
python scripts/ingest.py
```

Fetches from: CISA KEV, NVD JSON feeds (2022–2024), MITRE ATT&CK STIX.
Outputs enriched JSON to `public/data/`. Includes retry logic, rate limiting, local cache.

---

## Risk Scoring Formula

```
Attack Risk = (Severity Base × Industry Criticality × Sophistication Multiplier) + Bonuses

Severity Base:    CRITICAL=80, HIGH=60, MEDIUM=40, LOW=20
Industry:         Energy×1.3, Healthcare×1.25, Finance×1.2, Government×1.15
Sophistication:   Nation-State×1.2, Advanced×1.1, Intermediate×1.0, Low×0.85
Bonuses:          100M+ records=+10, $1B+ impact=+10
CVE Risk:         (CVSS/10)×60 + KEV=+30 + Ransomware=+10
```

---

## Root Cause Categories → Framework Mappings

| Category | MITRE | OWASP | NIST |
|----------|-------|-------|------|
| Unpatched System | T1190, T1210 | A06 Vulnerable Components | SI-2 |
| Credential Compromise | T1078, T1110 | A07 Auth Failures | IA-2, IA-5 |
| Supply Chain | T1195, T1072 | A08 Integrity Failures | SA-12 |
| Misconfiguration | T1190, T1083 | A05 Misconfiguration | CM-6 |
| Social Engineering | T1566, T1621 | A07 Auth Failures | AT-2, IA-2 |
| Zero-Day | T1190, T1203 | A06 Vulnerable Components | SI-3 |
| Insider Threat | T1078, T1005 | A01 Broken Access Control | AC-6 |
