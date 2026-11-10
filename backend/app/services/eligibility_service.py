"""
Eligibility Matching Engine for GraamSeva AI.
Matches citizen profile against Odisha government scheme rules.
"""

import logging
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.scheme import Scheme

logger = logging.getLogger(__name__)


def _evaluate_rule(criteria: Dict[str, Any], rules: Dict[str, Any]) -> tuple[bool, float]:
    """
    Evaluate if a citizen's criteria matches a scheme's rules.
    Returns (is_eligible: bool, match_score: float 0-100)
    """
    if not rules:
        return True, 100.0

    checks = []
    score_weights = []

    # Age checks
    if "age_min" in rules:
        checks.append(("age_min", criteria.get("age", 0) >= rules["age_min"]))
        score_weights.append(10)
    if "age_max" in rules:
        checks.append(("age_max", criteria.get("age", 999) <= rules["age_max"]))
        score_weights.append(10)

    # Income check
    if "income_max" in rules:
        checks.append(("income_max", criteria.get("income", 999999) <= rules["income_max"]))
        score_weights.append(25)

    # Caste check
    if "caste" in rules:
        allowed_castes = rules["caste"]
        citizen_caste = criteria.get("caste", "").upper()
        if isinstance(allowed_castes, list):
            # Empty list means all castes eligible
            caste_ok = not allowed_castes or any(c.upper() == citizen_caste for c in allowed_castes)
        else:
            caste_ok = allowed_castes.upper() == citizen_caste
        checks.append(("caste", caste_ok))
        score_weights.append(20)

    # Land holding check
    if "land_max" in rules:
        checks.append(("land_max", criteria.get("land_holding", 0) <= rules["land_max"]))
        score_weights.append(15)
    if "land_min" in rules:
        checks.append(("land_min", criteria.get("land_holding", 0) >= rules["land_min"]))
        score_weights.append(10)

    # Gender check
    if "gender" in rules:
        allowed_genders = rules["gender"] if isinstance(rules["gender"], list) else [rules["gender"]]
        citizen_gender = criteria.get("gender", "").lower()
        gender_ok = not allowed_genders or any(g.lower() == citizen_gender for g in allowed_genders)
        checks.append(("gender", gender_ok))
        score_weights.append(15)

    # BPL check
    if "is_bpl" in rules and rules["is_bpl"] is True:
        checks.append(("is_bpl", criteria.get("is_bpl", False) is True))
        score_weights.append(20)

    # Occupation check
    if "occupation" in rules:
        allowed_occupations = rules["occupation"] if isinstance(rules["occupation"], list) else [rules["occupation"]]
        citizen_occ = criteria.get("occupation", "").lower()
        occ_ok = not allowed_occupations or any(o.lower() == citizen_occ for o in allowed_occupations)
        checks.append(("occupation", occ_ok))
        score_weights.append(15)

    # Disability check
    if "has_disability" in rules and rules["has_disability"] is True:
        checks.append(("has_disability", criteria.get("has_disability", False) is True))
        score_weights.append(20)

    # Widow check
    if "is_widow" in rules and rules["is_widow"] is True:
        checks.append(("is_widow", criteria.get("is_widow", False) is True))
        score_weights.append(20)

    if not checks:
        return True, 100.0

    # All mandatory checks must pass
    all_pass = all(result for _, result in checks)

    # Calculate weighted score
    total_weight = sum(score_weights)
    if total_weight == 0:
        return all_pass, 100.0 if all_pass else 0.0

    passed_weight = sum(w for (_, ok), w in zip(checks, score_weights) if ok)
    score = round((passed_weight / total_weight) * 100, 1)

    return all_pass, score


def check_eligibility(criteria: Dict[str, Any], db: Session) -> List[Dict[str, Any]]:
    """
    Match citizen criteria against all active schemes.
    Returns list of matched scheme dicts with match_score.
    
    criteria keys: age, income, caste, land_holding, occupation,
                   district, gender, is_bpl, has_disability, is_widow,
                   num_children, education_level
    """
    schemes: List[Scheme] = db.query(Scheme).filter(Scheme.is_active == True).all()
    matched = []

    for scheme in schemes:
        rules = scheme.rules_json or {}
        is_eligible, score = _evaluate_rule(criteria, rules)

        if is_eligible:
            matched.append({
                "id": scheme.id,
                "name_en": scheme.name_en,
                "name_odia": scheme.name_odia,
                "dept": scheme.dept,
                "benefits": scheme.benefits,
                "eligibility_criteria": scheme.eligibility_criteria,
                "documents_required": scheme.documents_required or [],
                "match_score": score,
            })
            logger.debug(f"Scheme '{scheme.name_en}' matched with score {score}")

    # Sort by match score descending
    matched.sort(key=lambda x: x["match_score"], reverse=True)
    logger.info(f"Eligibility check: {len(matched)}/{len(schemes)} schemes matched.")
    return matched


def get_eligibility_summary(criteria: Dict[str, Any], matched_count: int) -> str:
    """Generate a human-readable summary of the eligibility check."""
    caste = criteria.get("caste", "unknown")
    income = criteria.get("income", 0)
    age = criteria.get("age", 0)

    return (
        f"Based on your profile (Age: {age}, Income: ₹{income:,.0f}/year, Category: {caste}), "
        f"you are eligible for {matched_count} government scheme(s)."
    )
