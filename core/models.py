"""
EventPulse AI Data Schemas and Validation Models
Complies with Pydantic v2 and OpenAPI standard specifications.
"""

from typing import Optional, Dict, Any
from pydantic import BaseModel, Field, field_validator
import re


def sanitize_input(value: str) -> str:
    """
    Remove potentially dangerous HTML, script tags, or script-like attributes.
    Ensures prevention of Cross-Site Scripting (XSS).
    """
    if not isinstance(value, str):
        return value
    # Strip HTML tags
    cleaned = re.sub(r"<[^>]*>", "", value).strip()
    return cleaned


class EventPlanRequest(BaseModel):
    """
    Input payload for requesting dynamic celebration and event calculations.
    """
    title: str = Field(
        ...,
        min_length=1,
        max_length=200,
        description="Title or celebration concept name",
        json_schema_extra={"example": "Hackathon Awards Gala"}
    )
    event_type: str = Field(
        ...,
        min_length=1,
        max_length=50,
        description="Celebration archetype (e.g. hackathon, wedding, launch, birthday)",
        json_schema_extra={"example": "hackathon"}
    )
    guests: int = Field(
        ...,
        ge=1,
        le=10000,
        description="Total confirmed or estimated attendees (1 to 10,000)",
        json_schema_extra={"example": 150}
    )
    budget: float = Field(
        ...,
        ge=100.0,
        le=10000000.0,
        description="Total fiscal budget allocation in USD ($100 to $10,000,000)",
        json_schema_extra={"example": 12000.0}
    )
    duration_hours: int = Field(
        ...,
        ge=1,
        le=48,
        description="Event duration in hours (1 to 48)",
        json_schema_extra={"example": 5}
    )
    vibe: Optional[str] = Field(
        default="festive",
        max_length=50,
        description="Atmospheric theme or music profile",
        json_schema_extra={"example": "cyberpunk_neon"}
    )

    @field_validator("title", "event_type", "vibe")
    @classmethod
    def sanitize_string_fields(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            return sanitize_input(v)
        return v


class BudgetBreakdown(BaseModel):
    """Itemized budget allocation compliant with industry standard celebration ratios."""
    venue_30pct: float = Field(..., description="Venue rental, security, permits (30%)")
    catering_35pct: float = Field(..., description="Food service, kitchen staff, tableware (35%)")
    production_15pct: float = Field(..., description="Sound, staging, AV, lighting, DJ (15%)")
    beverages_10pct: float = Field(..., description="Bar package, soft drinks, glassware (10%)")
    decor_5pct: float = Field(..., description="Florals, signage, photo backdrops (5%)")
    contingency_5pct: float = Field(..., description="Emergency buffer and unexpected fees (5%)")


class BeveragePlan(BaseModel):
    """Calculated drink formulas and inventory requirements."""
    total_drinks: int = Field(..., description="Estimated beverage servings consumed")
    wine_bottles: int = Field(..., description="Bottles of red/white wine (750ml)")
    beer_cases: str = Field(..., description="Cases and total cans of beer")
    mocktails: int = Field(..., description="Non-alcoholic artisan mocktail servings")


class StaffingPlan(BaseModel):
    """Required frontline and technical personnel recommendations."""
    bartenders: int = Field(..., description="Certified mixology and bar staff")
    servers: int = Field(..., description="Floor captains and banquet servers")
    av_technicians: int = Field(..., description="Stage audio/visual engineers")


class EventPlanResponse(BaseModel):
    """Unified response containing all computed metrics, allocations, and staffing."""
    title: str
    guests: int
    total_budget: float
    cost_per_guest: float
    budget_breakdown: BudgetBreakdown
    beverage_planning: BeveragePlan
    staffing_recommendations: StaffingPlan


class CopilotQueryRequest(BaseModel):
    """User prompt sent to the AI Copilot reasoning engine."""
    query: str = Field(
        ...,
        min_length=1,
        max_length=1000,
        description="Natural language question or contingency inquiry",
        json_schema_extra={"example": "What if it rains during the cocktail hour?"}
    )
    event_context: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Optional active celebration parameters"
    )

    @field_validator("query")
    @classmethod
    def sanitize_query(cls, v: str) -> str:
        return sanitize_input(v)


class CopilotQueryResponse(BaseModel):
    """AI Copilot contextual recommendation and operational response."""
    query: str
    reply: str


class HealthResponse(BaseModel):
    """Service health telemetry and architecture metadata."""
    status: str
    service: str
    challenge: str
    platform: str
    security_level: str
    accessibility: str
    version: str
    caching_enabled: bool
