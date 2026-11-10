"""
Translation Service for GraamSeva AI.
Supports Odia, Hindi, and English using Gemini API.
Includes mock/fallback mode for hackathon/dev environments.
"""

import logging
from app.config import settings
from app.services import gemini_service

logger = logging.getLogger(__name__)

# Common Odia script indicators
ODIA_UNICODE_RANGE = (0x0B00, 0x0B7F)
DEVANAGARI_RANGE = (0x0900, 0x097F)


def detect_language(text: str) -> str:
    """
    Detect the language of a given text.
    Returns: 'odia' | 'hindi' | 'english'
    """
    if not text or not text.strip():
        return "english"

    # Check Unicode characters for script detection
    odia_count = sum(1 for c in text if ODIA_UNICODE_RANGE[0] <= ord(c) <= ODIA_UNICODE_RANGE[1])
    hindi_count = sum(1 for c in text if DEVANAGARI_RANGE[0] <= ord(c) <= DEVANAGARI_RANGE[1])
    ascii_count = sum(1 for c in text if ord(c) < 128 and c.isalpha())

    total = odia_count + hindi_count + ascii_count
    if total == 0:
        total = 1

    if odia_count / total > 0.3:
        return "odia"
    if hindi_count / total > 0.3:
        return "hindi"

    if settings.mock_gemini:
        return "english"

    # Use Gemini for ambiguous cases
    prompt = f"""Detect the language of the following text. Reply with ONLY one word: odia, hindi, or english.
Text: "{text[:200]}"
"""
    result = gemini_service._safe_generate(prompt, "english").lower().strip()
    return result if result in {"odia", "hindi", "english"} else "english"


def translate_to_english(text: str, source_lang: str = "odia") -> str:
    """
    Translate text from source_lang to English.
    source_lang: 'odia' | 'hindi'
    """
    if source_lang == "english":
        return text

    if settings.mock_gemini:
        logger.info(f"[MOCK] Would translate from {source_lang} to English: {text[:50]}...")
        return text  # Return as-is in mock mode

    prompt = f"""Translate the following {source_lang} text to English. 
Provide ONLY the translation, no explanation.
Text: "{text}"
"""
    result = gemini_service._safe_generate(prompt, text)
    return result if result else text


def translate_to_odia(text: str) -> str:
    """
    Translate English/Hindi text to Odia.
    """
    if settings.mock_gemini:
        logger.info(f"[MOCK] Would translate to Odia: {text[:50]}...")
        return text  # Return as-is in mock mode

    prompt = f"""Translate the following text to Odia (ଓଡ଼ିଆ) language.
Provide ONLY the Odia translation, no explanation.
Text: "{text}"
"""
    result = gemini_service._safe_generate(prompt, text)
    return result if result else text


def translate_to_hindi(text: str) -> str:
    """
    Translate English/Odia text to Hindi.
    """
    if settings.mock_gemini:
        logger.info(f"[MOCK] Would translate to Hindi: {text[:50]}...")
        return text

    prompt = f"""Translate the following text to Hindi (हिन्दी) language.
Provide ONLY the Hindi translation, no explanation.
Text: "{text}"
"""
    result = gemini_service._safe_generate(prompt, text)
    return result if result else text


def translate_response(text: str, target_lang: str) -> str:
    """
    Translate a response text to the target language.
    target_lang: 'odia' | 'hindi' | 'english'
    """
    if target_lang == "english":
        return text
    if target_lang == "odia":
        return translate_to_odia(text)
    if target_lang == "hindi":
        return translate_to_hindi(text)
    return text
