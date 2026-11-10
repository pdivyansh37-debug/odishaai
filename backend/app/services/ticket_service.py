"""
Ticket Management Service for GraamSeva AI.
Handles ticket ID generation, SLA deadlines, breach detection, and department routing.
"""

import random
import string
from datetime import datetime, timedelta, timezone
from typing import List, Optional
from app.models.grievance import GrievanceCategory, GrievanceStatus

# SLA in days per category
SLA_DAYS: dict[str, int] = {
    "road": 15,
    "water": 7,
    "ration": 3,
    "education": 10,
    "health": 5,
    "land": 21,
    "other": 10,
}

# Department mapping per category
DEPT_MAPPING: dict[str, str] = {
    "road": "Works Department",
    "water": "Housing & Urban Development / Panchayati Raj",
    "ration": "Food Supplies & Consumer Welfare",
    "education": "School & Mass Education Department",
    "health": "Health & Family Welfare",
    "land": "Revenue & Disaster Management",
    "other": "General Administration Department",
}

# Counters (in-memory; in production use DB sequence)
_ticket_counters: dict[str, int] = {}


def generate_ticket_id(category: str) -> str:
    """
    Generate a unique ticket ID in the format: GS-ROAD-2024-001234
    Category is uppercased; 6-digit zero-padded sequence + 2 random chars for uniqueness.
    """
    cat_upper = category.upper()
    year = datetime.now().year
    # Increment counter
    key = f"{cat_upper}-{year}"
    _ticket_counters[key] = _ticket_counters.get(key, 0) + 1
    seq = _ticket_counters[key]
    # Add 3 random uppercase chars to make it unique across server restarts
    suffix = "".join(random.choices(string.ascii_uppercase, k=3))
    return f"GS-{cat_upper}-{year}-{seq:06d}{suffix}"


def get_sla_deadline(category: str) -> datetime:
    """
    Return the SLA deadline datetime for a grievance category.
    Defaults to 10 days for unknown categories.
    """
    days = SLA_DAYS.get(category.lower(), 10)
    return datetime.now(timezone.utc) + timedelta(days=days)


def get_dept_for_category(category: str) -> str:
    """Return the government department responsible for a grievance category."""
    return DEPT_MAPPING.get(category.lower(), DEPT_MAPPING["other"])


def check_sla_breach(grievances: list) -> list:
    """
    Given a list of Grievance ORM objects, return those that have breached SLA.
    A grievance is overdue if: sla_deadline < now AND status not in (resolved,).
    """
    now = datetime.now(timezone.utc)
    overdue = []
    for g in grievances:
        if g.status in (GrievanceStatus.resolved,):
            continue
        if g.sla_deadline and g.sla_deadline < now:
            overdue.append(g)
    return overdue


def get_sla_days(category: str) -> int:
    """Return SLA in days for a given category."""
    return SLA_DAYS.get(category.lower(), 10)


def is_overdue(grievance) -> bool:
    """Check if a single grievance is overdue."""
    if grievance.status == GrievanceStatus.resolved:
        return False
    if grievance.sla_deadline is None:
        return False
    now = datetime.now(timezone.utc)
    sla = grievance.sla_deadline
    # Make timezone-aware if naive
    if sla.tzinfo is None:
        sla = sla.replace(tzinfo=timezone.utc)
    return sla < now


def get_resolution_time_hours(grievance) -> Optional[float]:
    """Return resolution time in hours if resolved, else None."""
    if grievance.resolved_at and grievance.created_at:
        resolved = grievance.resolved_at
        created = grievance.created_at
        if resolved.tzinfo is None:
            resolved = resolved.replace(tzinfo=timezone.utc)
        if created.tzinfo is None:
            created = created.replace(tzinfo=timezone.utc)
        delta = resolved - created
        return round(delta.total_seconds() / 3600, 2)
    return None
