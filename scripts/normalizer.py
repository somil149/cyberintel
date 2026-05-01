"""
Normalizer: transforms raw API responses into unified schema.
"""
import logging, re
from datetime import datetime

log = logging.getLogger(__name__)

ATTACK_TYPE_MAP = {
    'ransomware': 'Ransomware', 'phish': 'Phishing', 'supply chain': 'Supply Chain',
    'zero-day': 'Zero-Day', 'ddos': 'DDoS', 'sql injection': 'SQL Injection',
    'credential': 'Credential Theft', 'misconfigur': 'Misconfiguration',
    'malware': 'Malware', 'apt': 'APT', 'ics': 'ICS/SCADA',
}

INDUSTRY_MAP = {
    'health': 'Healthcare', 'hospital': 'Healthcare', 'bank': 'Finance',
    'financ': 'Finance', 'energy': 'Energy', 'power': 'Energy',
    'gov': 'Government', 'federal': 'Government', 'retail': 'Retail',
    'tech': 'Technology', 'telecom': 'Telecom', 'education': 'Education',
    'transport': 'Transportation', 'manufactur': 'Manufacturing',
}

def _classify(text: str, mapping: dict, default='Other') -> str:
    t = text.lower()
    for k, v in mapping.items():
        if k in t:
            return v
    return default

def _parse_date(s: str) -> str:
    for fmt in ('%Y-%m-%dT%H:%M:%S', '%Y-%m-%d', '%m/%d/%Y'):
        try:
            return datetime.strptime(s[:len(fmt)], fmt).strftime('%Y-%m-%d')
        except Exception:
            continue
    return s[:10] if s else ''

def normalize_kev(raw: dict) -> list[dict]:
    if not raw or 'vulnerabilities' not in raw:
        return []
    out = []
    for v in raw['vulnerabilities']:
        out.append({
            'id': v.get('cveID', ''),
            'name': v.get('vulnerabilityName', ''),
            'vendor': v.get('vendorProject', ''),
            'product': v.get('product', ''),
            'date_added': _parse_date(v.get('dateAdded', '')),
            'due_date': _parse_date(v.get('dueDate', '')),
            'description': v.get('shortDescription', ''),
            'ransomware_use': v.get('knownRansomwareCampaignUse', 'Unknown'),
            'source': 'CISA_KEV',
        })
    return out

def normalize_nvd(raw: dict) -> list[dict]:
    if not raw or 'CVE_Items' not in raw:
        return []
    out = []
    for item in raw['CVE_Items']:
        cve = item.get('cve', {})
        cve_id = cve.get('CVE_data_meta', {}).get('ID', '')
        desc = next((d['value'] for d in cve.get('description', {}).get('description_data', [])
                     if d.get('lang') == 'en'), '')
        impact = item.get('impact', {})
        cvss3 = impact.get('baseMetricV3', {}).get('cvssV3', {})
        cvss2 = impact.get('baseMetricV2', {}).get('cvssV2', {})
        score = cvss3.get('baseScore') or cvss2.get('baseScore') or 0
        severity = cvss3.get('baseSeverity') or impact.get('baseMetricV2', {}).get('severity', 'UNKNOWN')
        pub_date = _parse_date(item.get('publishedDate', ''))
        out.append({
            'id': cve_id,
            'description': desc[:300],
            'score': float(score),
            'severity': severity.upper(),
            'published': pub_date,
            'year': pub_date[:4] if pub_date else '',
            'attack_vector': cvss3.get('attackVector') or cvss2.get('accessVector', ''),
            'source': 'NVD',
        })
    return out

def normalize_mitre(raw: dict) -> list[dict]:
    if not raw or 'objects' not in raw:
        return []
    techniques = []
    for obj in raw['objects']:
        if obj.get('type') != 'attack-pattern':
            continue
        ext = obj.get('external_references', [])
        tid = next((r['external_id'] for r in ext if r.get('source_name') == 'mitre-attack'), '')
        techniques.append({
            'id': tid,
            'name': obj.get('name', ''),
            'description': (obj.get('description', '') or '')[:200],
            'tactics': [p['phase_name'] for p in obj.get('kill_chain_phases', [])],
            'platforms': obj.get('x_mitre_platforms', []),
            'source': 'MITRE_ATTACK',
        })
    return techniques

def normalize_all(raw: dict) -> dict:
    return {
        'kev': normalize_kev(raw.get('cisa_kev') or {}),
        'nvd': (normalize_nvd(raw.get('nvd_2024') or {}) +
                normalize_nvd(raw.get('nvd_2023') or {}) +
                normalize_nvd(raw.get('nvd_2022') or {})),
        'mitre': normalize_mitre(raw.get('mitre_attack') or {}),
    }
