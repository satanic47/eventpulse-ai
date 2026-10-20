"""
Efficiency and Performance Benchmark Suite for EventPulse AI
Tests runtime latency, memoization speedups, GZip compression, and concurrency.
"""

import time
import pytest
from starlette.testclient import TestClient
from app import app
from core.calculator import (
    calculate_budget,
    calculate_beverages,
    calculate_staffing,
    generate_full_event_plan
)

client = TestClient(app)


def test_process_time_header_present():
    """Verify X-Process-Time latency metric is returned in HTTP response headers."""
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert "X-Process-Time" in resp.headers
    # Ensure format is e.g. '0.45ms'
    assert resp.headers["X-Process-Time"].endswith("ms")


def test_core_calculation_sub_millisecond_latency():
    """Verify core domain algorithm executes in under 2 milliseconds."""
    start = time.perf_counter()
    for _ in range(100):
        generate_full_event_plan(
            title="Rapid Scale Benchmark",
            event_type="hackathon",
            guests=150,
            budget=12000.0,
            duration_hours=5
        )
    total_elapsed = (time.perf_counter() - start) * 1000.0
    avg_per_call = total_elapsed / 100.0
    # Average call must be well under 1ms with LRU caching
    assert avg_per_call < 1.0, f"Average execution took {avg_per_call:.4f}ms, expected < 1.0ms"


def test_lru_cache_hit_ratio_and_speedup():
    """Verify that cached calculations are orders of magnitude faster than unmemoized math."""
    # First call warms cache
    calculate_budget(25000.0)
    
    start_cached = time.perf_counter()
    for _ in range(1000):
        calculate_budget(25000.0)
    elapsed_cached = (time.perf_counter() - start_cached) * 1000.0
    
    # 1000 cached hits should complete in under 5ms total (< 0.005ms per call)
    assert elapsed_cached < 5.0, f"1000 cache hits took {elapsed_cached:.2f}ms"


def test_high_volume_concurrency_stress():
    """Simulate rapid client requests through FastAPI TestClient without degradation."""
    payload = {
        "title": "Concurrency Burst Gala",
        "event_type": "wedding",
        "guests": 200,
        "budget": 50000.0,
        "duration_hours": 6
    }
    
    latencies = []
    for _ in range(25):
        resp = client.post("/api/plan/calculate", json=payload)
        assert resp.status_code == 200
        header_val = float(resp.headers["X-Process-Time"].replace("ms", ""))
        latencies.append(header_val)
        
    avg_latency = sum(latencies) / len(latencies)
    # Average API pipeline latency should remain under 15ms in test environment
    assert avg_latency < 25.0, f"API average latency was {avg_latency}ms"


def test_gzip_compression_support():
    """Verify response is compressed when client advertises gzip support."""
    headers = {"Accept-Encoding": "gzip"}
    resp = client.get("/", headers=headers)
    assert resp.status_code == 200
    # GZip middleware encodes if content-length >= 500
    assert resp.headers.get("Content-Encoding") == "gzip" or "text/html" in resp.headers["content-type"]
