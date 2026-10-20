"""
EventPulse AI High-Efficiency Calculation & Pacing Engine
Optimized with memoization (LRU cache) for sub-millisecond runtime performance.
"""

from functools import lru_cache
from typing import Dict, Any


@lru_cache(maxsize=4096)
def calculate_budget(total_budget: float) -> Dict[str, float]:
    """
    Compute itemized celebration budget distribution across standard event categories.
    
    Uses memoization to achieve O(1) instantaneous lookup on identical budget requests.
    
    Args:
        total_budget: Total target event budget in USD.
        
    Returns:
        Dict containing rounded allocations for venue (30%), catering (35%),
        production (15%), beverages (10%), decor (5%), and contingency (5%).
    """
    budget_float = float(total_budget)
    venue = round(budget_float * 0.30, 2)
    catering = round(budget_float * 0.35, 2)
    production = round(budget_float * 0.15, 2)
    beverages = round(budget_float * 0.10, 2)
    decor = round(budget_float * 0.05, 2)
    contingency = round(budget_float * 0.05, 2)

    return {
        "venue": venue,
        "catering": catering,
        "production": production,
        "beverages": beverages,
        "decor": decor,
        "contingency": contingency
    }


@lru_cache(maxsize=4096)
def calculate_beverages(guests: int, duration_hours: int) -> Dict[str, Any]:
    """
    Calculate beverage inventory requirements based on crowd size and event duration.
    
    Standard event industry formula:
    - 1.5 drinks per person during peak initial hour
    - 1.0 drink per person per subsequent hour
    - Alcohol split: 40% wine (5 glasses/bottle), 40% beer, 20% mocktail/soft
    
    Args:
        guests: Total attendee count.
        duration_hours: Total event duration in hours.
        
    Returns:
        Dict with total drinks, wine bottles, beer cans, beer cases, and mocktails.
    """
    g = int(guests)
    h = int(duration_hours)
    
    drinks_per_guest = 1.5 + max(0, h - 1)
    total_drinks = round(g * drinks_per_guest)
    wine_bottles = round((total_drinks * 0.4) / 5)
    beer_cans = round(total_drinks * 0.4)
    beer_cases_count = round(beer_cans / 24, 1)
    mocktails = round(total_drinks * 0.2)

    return {
        "total_drinks": total_drinks,
        "wine_bottles": wine_bottles,
        "beer_cans": beer_cans,
        "beer_cases": f"{beer_cases_count} cases ({beer_cans} cans)",
        "mocktails": mocktails
    }


@lru_cache(maxsize=4096)
def calculate_staffing(guests: int) -> Dict[str, int]:
    """
    Calculate optimal hospitality and engineering staff counts for safe operations.
    
    Ratios:
    - 1 Bartender per 75 guests (minimum 1)
    - 1 Server per 30 guests (minimum 2)
    - 1 Dedicated AV technician if guests > 100
    
    Args:
        guests: Total attendee count.
        
    Returns:
        Dict with bartender, server, and av_technician counts.
    """
    g = int(guests)
    bartenders = max(1, round(g / 75))
    servers = max(2, round(g / 30))
    av_technicians = 1 if g > 100 else 0

    return {
        "bartenders": bartenders,
        "servers": servers,
        "av_technicians": av_technicians
    }


def generate_full_event_plan(
    title: str,
    event_type: str,
    guests: int,
    budget: float,
    duration_hours: int,
    vibe: str = "festive"
) -> Dict[str, Any]:
    """
    Assemble complete verified event plan object utilizing memoized domain engines.
    
    Args:
        title: Event title.
        event_type: Category archetype.
        guests: Total attendees.
        budget: Total budget.
        duration_hours: Event duration.
        vibe: Tone/atmosphere.
        
    Returns:
        Structured response dictionary matching EventPlanResponse model.
    """
    cost_per_guest = round(budget / max(1, guests), 2)
    budget_alloc = calculate_budget(budget)
    bev_plan = calculate_beverages(guests, duration_hours)
    staff_plan = calculate_staffing(guests)

    return {
        "title": title,
        "guests": guests,
        "total_budget": budget,
        "cost_per_guest": cost_per_guest,
        "budget_breakdown": {
            "venue_30pct": budget_alloc["venue"],
            "catering_35pct": budget_alloc["catering"],
            "production_15pct": budget_alloc["production"],
            "beverages_10pct": budget_alloc["beverages"],
            "decor_5pct": budget_alloc["decor"],
            "contingency_5pct": budget_alloc["contingency"]
        },
        "beverage_planning": {
            "total_drinks": bev_plan["total_drinks"],
            "wine_bottles": bev_plan["wine_bottles"],
            "beer_cases": bev_plan["beer_cases"],
            "mocktails": bev_plan["mocktails"]
        },
        "staffing_recommendations": staff_plan
    }
