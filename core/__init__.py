"""
EventPulse AI Core Domain Package
High-performance calculation, validation, and domain logic modules.
"""

from .calculator import (
    calculate_budget,
    calculate_beverages,
    calculate_staffing,
    generate_full_event_plan
)
from .models import (
    EventPlanRequest,
    EventPlanResponse,
    BudgetBreakdown,
    BeveragePlan,
    StaffingPlan,
    CopilotQueryRequest,
    CopilotQueryResponse,
    HealthResponse
)

__all__ = [
    "calculate_budget",
    "calculate_beverages",
    "calculate_staffing",
    "generate_full_event_plan",
    "EventPlanRequest",
    "EventPlanResponse",
    "BudgetBreakdown",
    "BeveragePlan",
    "StaffingPlan",
    "CopilotQueryRequest",
    "CopilotQueryResponse",
    "HealthResponse"
]
