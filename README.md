# CyberIntel — 20 Years of Cybersecurity Intelligence

A production-ready static cybersecurity intelligence platform visualizing attack trends, vulnerabilities, and threat patterns from 2005 to 2025. Deployable on GitHub Pages with no backend.

## Live Demo

Deploy to GitHub Pages and access at `https://<username>.github.io/cyberintel/`

---

## Features

| Page | Description |
|------|-------------|
| **Overview** | Global stats, attack volume, financial impact, root cause distribution |
| **Timeline** | Interactive 2005–2025 incident timeline with drill-down |
| **Trends** | CVE severity evolution, KEV trends, time-to-exploit, predictions |
| **Incidents** | Filterable incident explorer with full RCA, MITRE/OWASP/NIST mappings |
| **Threat Map** | Leaflet.js world map with attack origin/target visualization |
| **CVE Intel** | Top exploited CVEs, CVSS trends, ransomware linkage tracking |
| **Root Cause** | Engine-driven RCA grouped by failure category with recommendations |
| **Story Mode** | Year-by-year narrative of cybersecurity evolution |

---

## Tech Stack

- **Frontend**: Next.js 14 (static export), TypeScript, Tailwind CSS
- **Charts**: Chart.js + react-chartjs-2
- **Maps**: Leaflet.js + react-leaflet
- **Data Pipeline**: Python 3.10+ (optional — sample data included)
- **Deployment**: GitHub Pages via `gh-pages`

---

## Quick Start

### Prerequisites

- Node.js 18+
- npm 9+

### Install & Run

```bash
cd cyberintel
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Build & Export

```bash
npm run build
```

This generates a fully static site in the `out/` directory.

---

## Deploy to GitHub Pages

### 1. Set the base path

Edit `.env.local`:

```env
NEXT_PUBLIC_BASE_PATH=/cyberintel
```

Replace `cyberintel` with your actual GitHub repository name.

### 2. Add `homepage` to package.json (optional)

```json
"homepage": "https://<username>.github.io/cyberintel"
```

### 3. Deploy

```bash
npm run deploy
```

This runs `next build && next export && gh-pages -d out`.

### 4. Enable GitHub Pages

In your repository settings:
- Go to **Settings → Pages**
- Set source to **gh-pages branch**
- Save

Your site will be live at `https://<username>.github.io/cyberintel/`

---

## Data Pipeline (Optional)

The site ships with curated sample data. To fetch live data from public sources:

### Setup

```bash
pip install requests feedparser
```

### Run

```bash
cd cyberintel
python scripts/ingest.py
```

This fetches from:
- **CISA KEV** — `cisa.gov/known_exploited_vulnerabilities.json`
- **NVD JSON feeds** — `nvd.nist.gov` (2022–2024)
- **MITRE ATT&CK STIX** — `github.com/mitre/cti`

Output is written to `public/data/`:
- `cves.json` — enriched CVE records with risk scores
- `insights.json` — aggregated analytics
- `mitre.json` — ATT&CK technique index

> **Note**: NVD feeds are large (~100MB each). The pipeline caches responses in `scripts/.cache/` for incremental updates.

---

## Project Structure

```
cyberintel/
├── public/
│   └── data/
│       ├── attacks.json      # 30 major incidents (2005–2025)
│       ├── cves.json         # 20 top exploited CVEs
│       ├── insights.json     # Aggregated analytics
│       └── story.json        # Year-by-year narratives
├── scripts/
│   ├── ingest.py             # Pipeline orchestrator
│   ├── fetcher.py            # HTTP fetcher with retry/cache
│   ├── normalizer.py         # Schema normalization
│   └── enricher.py           # Risk scoring + output writer
├── src/
│   ├── components/
│   │   ├── Nav.tsx
│   │   ├── Layout.tsx
│   │   ├── StatCard.tsx
│   │   ├── SeverityBadge.tsx
│   │   ├── RiskMeter.tsx
│   │   ├── BarChart.tsx
│   │   ├── LineChart.tsx
│   │   ├── DoughnutChart.tsx
│   │   ├── AttackCard.tsx
│   │   └── MapView.tsx
│   ├── lib/
│   │   ├── data.ts           # Data loaders + formatters
│   │   └── engine.ts         # Risk scoring + RCA engine
│   ├── pages/
│   │   ├── index.tsx         # Homepage
│   │   ├── timeline.tsx      # Attack timeline
│   │   ├── trends.tsx        # Trends dashboard
│   │   ├── incidents.tsx     # Incident explorer
│   │   ├── map.tsx           # Threat map
│   │   ├── cve.tsx           # CVE intelligence
│   │   ├── rca.tsx           # Root cause analysis
│   │   └── story.tsx         # Story mode
│   ├── styles/
│   │   └── globals.css
│   └── types/
│       └── index.ts
├── .env.local
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## Risk Scoring Model

The engine (`src/lib/engine.ts`) computes risk scores using:

```
Risk = (Severity Base × Industry Criticality × Sophistication Multiplier)
       + Records Bonus + Financial Bonus
```

| Factor | Weight |
|--------|--------|
| Severity (CRITICAL) | 80 base |
| Industry (Energy) | ×1.3 |
| Nation-State actor | ×1.2 |
| 100M+ records | +10 |
| $1B+ financial impact | +10 |
| CISA KEV status | +30 (CVE scoring) |

---

## Data Sources

All sources are public and require no authentication:

| Source | URL | Data |
|--------|-----|------|
| CISA KEV | cisa.gov/known_exploited_vulnerabilities.json | Actively exploited CVEs |
| NVD | nvd.nist.gov/feeds/json/cve/1.1/ | CVE details + CVSS scores |
| MITRE ATT&CK | github.com/mitre/cti | Techniques + tactics |
| Sample incidents | Curated from public breach reports | Attack details |

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_BASE_PATH` | `` (empty) | GitHub Pages repo path, e.g. `/cyberintel` |

---

## License

MIT — free for personal and commercial use.

Data is sourced from public domain sources (NVD, CISA, MITRE). Incident descriptions are based on publicly reported information for educational purposes.
