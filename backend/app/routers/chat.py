from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from typing import Optional

from app.database import get_db
from app.models.citizen import Citizen
from app.schemas.chat import ChatMessage, ChatResponse
from app.services.translator_service import detect_language, translate_to_english, translate_to_odia
from app.services.gemini_service import classify_intent, generate_chat_response
from app.services.eligibility_service import check_eligibility
from app.utils.file_upload import save_upload_file

router = APIRouter(prefix="/api/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
def chat_endpoint(message: ChatMessage, db: Session = Depends(get_db)):
    text = message.message.strip()
    if not text:
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Detect language or use declared language
    detected_lang = message.language
    if not detected_lang or detected_lang == "odia":
        detected_lang = detect_language(text)

    # Translate to English for NLP classification
    english_text = translate_to_english(text, source_lang=detected_lang)

    # Intent classification
    intent_data = classify_intent(english_text)
    intent = intent_data.get("intent", "general")

    matched_schemes = []
    # If scheme query, do lightweight keyword check against schemes
    if intent == "scheme_query":
        # Check basic match
        dummy_criteria = {"age": 30, "income": 100000, "caste": "OBC", "land_holding": 1.0, "occupation": "farmer"}
        matched_schemes = check_eligibility(dummy_criteria, db)[:3]

    # Generate response via Gemini
    ai_english_reply = generate_chat_response(
        user_message=english_text,
        intent=intent,
        context={"matched_schemes": matched_schemes},
    )

    # Translate response back to user's language if Odia or Hindi
    if detected_lang == "odia":
        final_reply = translate_to_odia(ai_english_reply)
    else:
        final_reply = ai_english_reply

    suggestions = [
        "ମୋ ପାଇଁ କେଉଁ ସରକାରୀ ଯୋଜନା ଅଛି?",
        "ପାନୀୟ ଜଳ ସମସ୍ୟା ଅଭିଯୋଗ ଦାଖଲ କରନ୍ତୁ",
        "ନିକଟସ୍ଥ ଜନ ସେବା କେନ୍ଦ୍ର କେଉଁଠି?",
    ]

    return ChatResponse(
        response=final_reply,
        intent=intent,
        language=detected_lang,
        matched_schemes=matched_schemes,
        suggestions=suggestions,
    )


@router.post("/voice")
async def voice_chat_endpoint(
    audio: UploadFile = File(...),
    session_id: str = Form("default"),
    phone: Optional[str] = Form(None),
    language: str = Form("odia"),
    db: Session = Depends(get_db),
):
    # Save audio file
    saved_path = await save_upload_file(audio, subfolder="voice")

    # Mock voice-to-text / Whisper transcriber fallback
    transcribed_text = "ମୁଁ କାଳିଆ ଯୋଜନା ଏବଂ ବିଏସକେୱାଇ ବିଷୟରେ ଜାଣିବାକୁ ଚାହୁଁଛି।"

    # Pass to standard chat pipeline
    msg = ChatMessage(
        message=transcribed_text,
        language=language,
        session_id=session_id,
        phone=phone,
    )
    return chat_endpoint(msg, db)

