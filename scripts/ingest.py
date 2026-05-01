#!/usr/bin/env python3
"""
CyberIntel Data Ingestion Pipeline
Fetches, normalizes, enriches, and caches cybersecurity data from public sources.
"""
import json, logging, os, sys
from pathlib import Path

logging.basicConfig(level=logging.INFO, format='%(asctime)s [%(levelname)s] %(message)s')
log = logging.getLogger(__name__)

DATA_DIR = Path(__file__).parent.parent / 'public' / 'data'
DATA_DIR.mkdir(parents=True, exist_ok=True)

def run():
    from fetcher import fetch_all
    from normalizer import normalize_all
    from enricher import enrich_all

    log.info("=== CyberIntel Ingestion Pipeline ===")
    raw = fetch_all()
    normalized = normalize_all(raw)
    enrich_all(normalized, DATA_DIR)
    log.info("=== Pipeline complete. Data written to %s ===", DATA_DIR)

if __name__ == '__main__':
    sys.path.insert(0, str(Path(__file__).parent))
    run()
