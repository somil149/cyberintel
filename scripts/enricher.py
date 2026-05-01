"""
Enricher: maps CVEs → MITRE techniques, computes risk scores, writes output JSON.
"""
import json, logging
from pathlib import Path
from collections import defaultdict

log = logging.getLogger(__name__)

SEVERITY_SCORE = {'CRITICAL': 100, 'HIGH': 75, 'MEDIUM': 50, 'LOW': 25, 'UNKNOWN': 10}
RANSOMWARE_BONUS = 20

def _risk_score(cve: dict, in_kev: bool, ransomware: bool) -> int:
    base = (cve.get('score', 0) / 10) * 60          # CVSS → 0-60
    kev_bonus = 30 if in_kev else 0                  # known exploited
    rw_bonus = RANSOMWARE_BONUS if ransomware else 0  # ransomware use
    return min(100, int(base + kev_bonus + rw_bonus))

def enrich_all(normalized: dict, out_dir: Path):
    kev_ids = {v['id'] for v in normalized['kev']}
    kev_rw = {v['id']: v['ransomware_use'] for v in normalized['kev']}

    # --- CVEs ---
    cves = []
    for c in normalized['nvd']:
        in_kev = c['id'] in kev_ids
        rw = kev_rw.get(c['id'], 'Unknown') not in ('Unknown', 'No')
        c['in_kev'] = in_kev
        c['ransomware_use'] = kev_rw.get(c['id'], 'Unknown')
        c['risk_score'] = _risk_score(c, in_kev, rw)
        cves.append(c)

    # Deduplicate by id, keep highest risk
    seen: dict[str, dict] = {}
    for c in cves:
        if c['id'] not in seen or c['risk_score'] > seen[c['id']]['risk_score']:
            seen[c['id']] = c
    cves = sorted(seen.values(), key=lambda x: x['risk_score'], reverse=True)

    _write(out_dir / 'cves.json', cves[:2000])  # top 2000 by risk

    # --- Insights ---
    by_year: dict[str, list] = defaultdict(list)
    for c in cves:
        if c.get('year'):
            by_year[c['year']].append(c)

    severity_trend = {
        yr: {
            'total': len(items),
            'critical': sum(1 for x in items if x['severity'] == 'CRITICAL'),
            'high': sum(1 for x in items if x['severity'] == 'HIGH'),
            'avg_score': round(sum(x['score'] for x in items) / len(items), 2) if items else 0,
            'kev_count': sum(1 for x in items if x['in_kev']),
        }
        for yr, items in sorted(by_year.items())
    }

    insights = {
        'severity_trend': severity_trend,
        'top_kev': [v for v in normalized['kev'] if v['ransomware_use'] not in ('Unknown', 'No')][:50],
        'mitre_technique_count': len(normalized['mitre']),
        'total_cves_analyzed': len(cves),
        'generated_at': _now(),
    }
    _write(out_dir / 'insights.json', insights)

    # MITRE techniques (trimmed)
    mitre_out = [{'id': t['id'], 'name': t['name'], 'tactics': t['tactics'], 'platforms': t['platforms']}
                 for t in normalized['mitre']]
    _write(out_dir / 'mitre.json', mitre_out)

    log.info("Wrote %d CVEs, %d MITRE techniques", len(cves[:2000]), len(mitre_out))

def _write(path: Path, data):
    path.write_text(json.dumps(data, indent=2))
    log.info("Wrote %s", path)

def _now():
    from datetime import datetime
    return datetime.utcnow().isoformat() + 'Z'
