"""
Unit Tests for EventPulse AI Dynamic Planning Engine
Validates budget allocations, beverage math, and staffing formulas using core domain modules.
"""

import pytest
from core.calculator import (
    calculate_budget,
    calculate_beverages,
    calculate_staffing,
    generate_full_event_plan
)


def test_budget_allocation_sums_to_total():
    """Verify itemized budget breakdown adds up to 100% of target budget."""
    for budget in [5000.0, 12000.0, 35000.0, 100000.0]:
        breakdown = calculate_budget(budget)
        total_allocated = sum(breakdown.values())
        assert abs(total_allocated - budget) < 0.01


def test_beverage_scaling_with_guests_and_duration():
    """Verify beverage formula scales proportionally with attendees and event hours."""
    base = calculate_beverages(guests=100, duration_hours=4)
    doubled_guests = calculate_beverages(guests=200, duration_hours=4)
    
    # Doubling guests should double total drink demand
    assert doubled_guests["total_drinks"] == base["total_drinks"] * 2
    assert doubled_guests["wine_bottles"] == base["wine_bottles"] * 2


def test_wedding_budget_pacing():
    """Verify luxury wedding archetype calculations."""
    wedding_budget = 35000.0
    breakdown = calculate_budget(wedding_budget)
    assert breakdown["catering"] == 12250.0   # 35%
    assert breakdown["venue"] == 10500.0      # 30%
    assert breakdown["contingency"] == 1750.0 # 5% emergency buffer


def test_staffing_minimum_thresholds():
    """Ensure small events still receive safe minimum staffing levels."""
    staff = calculate_staffing(guests=15)
    assert staff["bartenders"] >= 1
    assert staff["servers"] >= 2


def test_full_event_plan_generation():
    """Verify end-to-end plan generation output consistency."""
    plan = generate_full_event_plan(
        title="Community Celebration",
        event_type="community",
        guests=250,
        budget=18000.0,
        duration_hours=6
    )
    assert plan["title"] == "Community Celebration"
    assert plan["guests"] == 250
    assert plan["cost_per_guest"] == 72.0
    assert plan["budget_breakdown"]["venue_30pct"] == 5400.0
    assert plan["staffing_recommendations"]["bartenders"] >= 3
    assert plan["staffing_recommendations"]["av_technicians"] == 1
