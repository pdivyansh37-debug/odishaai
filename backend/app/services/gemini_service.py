"""
Gemini AI Service for GraamSeva AI.
Handles intent classification, categorization, chat responses,
officer reply drafting, image description, and duplicate detection.
"""

import json
import logging
from typing import Optional
from app.config import settings

logger = logging.getLogger(__name__)

# Lazy-initialize Gemini client
_model = None


def _get_model():
    global _model
    if _model is None and not settings.mock_gemini:
        try:
            import google.generativeai as genai
            genai.configure(api_key=settings.GEMINI_API_KEY)
            _model = genai.GenerativeModel("gemini-1.5-flash")
            logger.info("Gemini model initialized successfully.")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini model: {e}")
            _model = None
    return _model


def _safe_generate(prompt: str, default: str = "") -> str:
    """Call Gemini safely; return default on error."""
    model = _get_model()
    if model is None:
        logger.warning("Gemini model not available — returning default.")
        return default
    try:
        response = model.generate_content(prompt)
        return response.text.strip()
    except Exception as e:
        logger.error(f"Gemini generate_content error: {e}")
        return default


def classify_intent(text: str) -> dict:
    """
    Classify the intent of a citizen's message.
    Returns dict: {intent: str, confidence: float, details: str}
    Intent types: scheme_query | grievance | general | legal | emergency
    """
    if settings.mock_gemini:
        # Heuristic mock classification
        text_lower = text.lower()
        if any(w in text_lower for w in ["scheme", "yojana", "pension", "benefit", "eligible", "apply"]):
            return {"intent": "scheme_query", "confidence": 0.9, "details": "Scheme related query"}
        if any(w in text_lower for w in ["complaint", "problem", "road", "water", "broken", "issue", "repair"]):
            return {"intent": "grievance", "confidence": 0.9, "details": "Civic grievance"}
        if any(w in text_lower for w in ["law", "legal", "court", "rights", "land dispute"]):
            return {"intent": "legal", "confidence": 0.8, "details": "Legal query"}
        return {"intent": "general", "confidence": 0.7, "details": "General query"}

    prompt = f"""You are an AI assistant for GraamSeva, an Odisha government grievance and scheme portal.
Classify the following citizen message into ONE intent category.
Categories:
- scheme_query: Asking about government schemes, eligibility, benefits
- grievance: Reporting a civic problem (road damage, water supply, ration, education, health, land dispute)
- legal: Asking about laws, rights, court matters
- emergency: Urgent situation needing immediate help
- general: General question or greeting

Message: "{text}"

Respond ONLY with valid JSON in this exact format:
{{"intent": "<category>", "confidence": <0.0-1.0>, "details": "<brief reason>"}}
"""
    raw = _safe_generate(prompt, '{"intent": "general", "confidence": 0.5, "details": "Could not classify"}')
    try:
        # Extract JSON from markdown code blocks if present
        if "```" in raw:
            raw = raw.split("```")[1].strip()
            if raw.startswith("json"):
                raw = raw[4:].strip()
        return json.loads(raw)
    except json.JSONDecodeError:
        logger.warning(f"Could not parse Gemini intent response: {raw}")
        return {"intent": "general", "confidence": 0.5, "details": raw[:200]}


def categorize_grievance(text: str) -> str:
    """
    Categorize a grievance description into one of the standard categories.
    Returns: road | water | ration | education | health | land | other
    """
    if settings.mock_gemini:
        text_lower = text.lower()
        mapping = {
            "road": ["road", "pothole", "bridge", "path", "street"],
            "water": ["water", "pipe", "tap", "drainage", "flood", "pond"],
            "ration": ["ration", "pds", "food", "grain", "rice", "wheat", "kerosene"],
            "education": ["school", "teacher", "midday", "book", "education", "student"],
            "health": ["hospital", "medicine", "doctor", "health", "ambulance", "vaccine"],
            "land": ["land", "property", "plot", "farm", "encroachment", "boundary"],
        }
        for cat, keywords in mapping.items():
            if any(kw in text_lower for kw in keywords):
                return cat
        return "other"

    prompt = f"""Categorize the following civic grievance description into ONE category.
Categories: road, water, ration, education, health, land, other

Grievance: "{text}"

Reply with ONLY the category name (one word, lowercase). No explanation.
"""
    result = _safe_generate(prompt, "other").lower().strip()
    valid = {"road", "water", "ration", "education", "health", "land", "other"}
    return result if result in valid else "other"


def generate_chat_response(message: str, context: dict) -> str:
    """
    Generate a full chatbot response for a citizen message.
    context dict may include: language, intent, matched_schemes, citizen_name
    """
    language = context.get("language", "english")
    intent = context.get("intent", "general")
    schemes = context.get("matched_schemes", [])
    citizen_name = context.get("citizen_name", "")

    if settings.mock_gemini:
        name_part = f" {citizen_name}" if citizen_name else ""
        if intent == "scheme_query":
            if schemes:
                scheme_names = ", ".join(s.get("name_en", "") for s in schemes[:3])
                return (
                    f"Hello{name_part}! Based on your profile, you may be eligible for: {scheme_names}. "
                    "Please visit your nearest Block office or use our portal to apply."
                )
            return (
                f"Hello{name_part}! I can help you find government schemes. "
                "Please share your age, income, and category to check eligibility."
            )
        if intent == "grievance":
            return (
                f"Hello{name_part}! I've noted your concern. Please describe the problem clearly "
                "and I'll register a complaint ticket for you. You can also share a photo."
            )
        return (
            f"Hello{name_part}! I am GraamSeva AI, here to assist you with government schemes "
            "and civic complaints in Odisha. How can I help you today?"
        )

    scheme_context = ""
    if schemes:
        scheme_names = ", ".join(s.get("name_en", "Unknown") for s in schemes[:5])
        scheme_context = f"\nRelevant schemes found: {scheme_names}"

    prompt = f"""You are GraamSeva AI, a helpful assistant for citizens of Odisha, India.
Your role is to assist with government schemes, civic grievances, and general government queries.
Be warm, respectful, and use simple language appropriate for rural citizens.
Respond in {language} language.
{f'Citizen name: {citizen_name}' if citizen_name else ''}
Message intent: {intent}
{scheme_context}

Citizen message: "{message}"

Provide a helpful, concise response (2-4 sentences). If the citizen needs to file a complaint,
guide them. If asking about schemes, mention available schemes. Keep the tone warm and supportive.
"""
    return _safe_generate(prompt, "I'm here to help you. Please tell me more about your concern.")


def draft_officer_reply(grievance_desc: str, status: str) -> str:
    """
    Generate a draft reply from an officer to a citizen about their grievance.
    Returns text in both Odia and English.
    """
    if settings.mock_gemini:
        return (
            f"ପ୍ରିୟ ନାଗରିକ,\n\nଆପଣଙ୍କ ଅଭିଯୋଗ ଆମ ଦ୍ୱାରା ପ୍ରାପ୍ତ ହୋଇଛି। ବର୍ତ୍ତମାନ ସ୍ଥିତି: {status}।\n"
            "ଆମେ ଶୀଘ୍ର ଆପଣଙ୍କ ସମସ୍ୟା ସମାଧାନ କରିବୁ।\n\nଧନ୍ୟବାଦ,\nGraamSeva ଦଳ\n\n"
            f"Dear Citizen,\n\nYour grievance has been received. Current status: {status}.\n"
            "We will resolve your issue at the earliest.\n\nThank you,\nGraamSeva Team"
        )

    prompt = f"""You are a government officer responding to a citizen grievance in Odisha.
Write a professional but empathetic reply to the citizen about their complaint.
The reply should:
1. Acknowledge the complaint
2. State current status: {status}
3. Mention expected timeline/next steps
4. Be in BOTH Odia (first) and English (second), separated by a blank line.
Keep each section to 3-4 sentences.

Grievance description: "{grievance_desc}"
"""
    return _safe_generate(prompt, "Your grievance is being processed. We will update you shortly.")


def describe_image(image_bytes: bytes) -> str:
    """
    Use Gemini Vision to describe an uploaded grievance photo.
    Returns a description of the civic issue visible in the image.
    """
    if settings.mock_gemini:
        return "Image received. The photo appears to show a civic infrastructure issue that requires attention."

    try:
        import google.generativeai as genai
        genai.configure(api_key=settings.GEMINI_API_KEY)
        vision_model = genai.GenerativeModel("gemini-1.5-flash")

        import PIL.Image
        import io
        image = PIL.Image.open(io.BytesIO(image_bytes))

        prompt = (
            "This is a photo uploaded as part of a civic grievance complaint in Odisha, India. "
            "Describe what civic issue or problem you can see in this image. "
            "Be specific about: type of damage, severity, location context, and any safety concerns. "
            "Keep the description to 2-3 sentences."
        )
        response = vision_model.generate_content([prompt, image])
        return response.text.strip()
    except Exception as e:
        logger.error(f"Image description error: {e}")
        return "Unable to process image. Manual review required."


def check_duplicate(new_desc: str, existing_descriptions: list[str]) -> dict:
    """
    Check if a new grievance is a duplicate of existing ones.
    Returns: {is_duplicate: bool, similar_ticket_id: str, similarity_score: float}
    """
    if not existing_descriptions:
        return {"is_duplicate": False, "similar_ticket_id": None, "similarity_score": 0.0}

    if settings.mock_gemini:
        # Simple keyword overlap check as mock
        new_words = set(new_desc.lower().split())
        for i, desc in enumerate(existing_descriptions):
            existing_words = set(desc.lower().split())
            overlap = len(new_words & existing_words) / max(len(new_words | existing_words), 1)
            if overlap > 0.6:
                return {"is_duplicate": True, "similar_ticket_id": f"existing_{i}", "similarity_score": overlap}
        return {"is_duplicate": False, "similar_ticket_id": None, "similarity_score": 0.0}

    # Format up to 10 recent descriptions to check against
    formatted = "\n".join(
        f"{i+1}. {desc[:200]}" for i, desc in enumerate(existing_descriptions[:10])
    )
    prompt = f"""You are checking if a new civic grievance complaint is a duplicate of existing ones.

New complaint: "{new_desc[:300]}"

Existing complaints in the system:
{formatted}

Is the new complaint describing the SAME issue (same location, same problem) as any existing one?
Consider duplicates only if they describe the exact same physical problem at the same location.

Reply ONLY with valid JSON:
{{"is_duplicate": true/false, "similar_index": <1-based index or null>, "similarity_score": <0.0-1.0>, "reason": "<brief>"}}
"""
    raw = _safe_generate(prompt, '{"is_duplicate": false, "similar_index": null, "similarity_score": 0.0, "reason": "No match"}')
    try:
        if "```" in raw:
            raw = raw.split("```")[1].strip()
            if raw.startswith("json"):
                raw = raw[4:].strip()
        result = json.loads(raw)
        similar_index = result.get("similar_index")
        ticket_id = None
        if similar_index and 1 <= similar_index <= len(existing_descriptions):
            ticket_id = f"existing_{similar_index - 1}"
        return {
            "is_duplicate": result.get("is_duplicate", False),
            "similar_ticket_id": ticket_id,
            "similarity_score": result.get("similarity_score", 0.0),
        }
    except json.JSONDecodeError:
        logger.warning(f"Could not parse duplicate check response: {raw}")
        return {"is_duplicate": False, "similar_ticket_id": None, "similarity_score": 0.0}
