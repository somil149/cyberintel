"""
Fetcher: pulls raw data from public sources with retry + rate-limit handling.
Sources: NVD JSON feeds, CISA KEV, MITRE ATT&CK STIX, Abuse.ch URLhaus
"""
import json, logging, time
from pathlib import Path
import urllib.request, urllib.error

log = logging.getLogger(__name__)
CACHE_DIR = Path(__file__).parent / '.cache'
CACHE_DIR.mkdir(exist_ok=True)

SOURCES = {
    'cisa_kev': 'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json',
    'mitre_attack': 'https://raw.githubusercontent.com/mitre/cti/master/enterprise-attack/enterprise-attack.json',
    'nvd_2024': 'https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-2024.json.gz',
    'nvd_2023': 'https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-2023.json.gz',
    'nvd_2022': 'https://nvd.nist.gov/feeds/json/cve/1.1/nvdcve-1.1-2022.json.gz',
    'urlhaus': 'https://urlhaus-api.abuse.ch/v1/urls/recent/',
}

def _fetch_url(url: str, retries=3, delay=2) -> bytes:
    for attempt in range(retries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'CyberIntel/1.0'})
            with urllib.request.urlopen(req, timeout=30) as r:
                return r.read()
        except urllib.error.HTTPError as e:
            if e.code == 429:
                log.warning("Rate limited on %s, waiting %ds", url, delay * 2)
                time.sleep(delay * 2)
            elif attempt == retries - 1:
                raise
            time.sleep(delay)
    return b''

def _cached_fetch(key: str, url: str) -> dict | list | None:
    cache_file = CACHE_DIR / f'{key}.json'
    if cache_file.exists():
        log.info("Cache hit: %s", key)
        return json.loads(cache_file.read_text())
    log.info("Fetching: %s", url)
    try:
        raw = _fetch_url(url)
        if url.endswith('.gz'):
            import gzip
            raw = gzip.decompress(raw)
        data = json.loads(raw)
        cache_file.write_text(json.dumps(data))
        return data
    except Exception as e:
        log.error("Failed to fetch %s: %s", key, e)
        return None

def fetch_all() -> dict:
    results = {}
    for key, url in SOURCES.items():
        results[key] = _cached_fetch(key, url)
        time.sleep(0.5)  # polite rate limiting
    return results
