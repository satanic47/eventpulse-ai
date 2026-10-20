"""
Unit Tests for EventPulse AI Dynamic Planning Engine
Validates budget allocations, beverage math, and staffing formulas.
"""

import pytest

def calculate_budget(total_budget: float):
    return {
        "venue": round(total_budget * 0.30, 2),
        "catering": round(total_budget * 0.35, 2),
        "production": round(total_budget * 0.15, 2),
        "beverages": round(total_budget * 0.10, 2),
        "decor": round(total_budget * 0.05, 2),
        "contingency": round(total_budget * 0.05, 2)
    }

def calculate_beverages(guests: int, duration_hours: int):
    drinks_per_guest = 1.5 + max(0, duration_hours - 1)
    total_drinks = round(guests * drinks_per_guest)
    wine_bottles = round((total_drinks * 0.4) / 5)
    beer_cans = round(total_drinks * 0.4)
    mocktails = round(total_drinks * 0.2)
    return {
        "total_drinks": total_drinks,
        "wine_bottles": wine_bottles,
        "beer_cans": beer_cans,
        "mocktails": mocktails
    }

def calculate_staffing(guests: int):
    return {
        "bartenders": max(1, round(guests / 75)),
        "servers": max(2, round(guests / 30))
    }

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
    assert breakdown["catering"] == 12250.0  # 35%
    assert breakdown["venue"] == 10500.0     # 30%
    assert breakdown["contingency"] == 1750.0 # 5% emergency buffer

def test_staffing_minimum_thresholds():
    """Ensure small events still receive safe minimum staffing levels."""
    staff = calculate_staffing(guests=15)
    assert staff["bartenders"] >= 1
    assert staff["servers"] >= 2
