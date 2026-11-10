"""
WhatsApp Notification Service using Twilio.
Sends ticket confirmations, status updates, and resolution messages to citizens.
Supports mock mode (logging instead of sending) when Twilio credentials are not set.
"""

import logging
from app.config import settings

logger = logging.getLogger(__name__)

# Bilingual message templates (Odia + English)
TEMPLATES = {
    "ticket_created": {
        "odia": "ନମସ୍କାର! ଆପଣଙ୍କ ଅଭିଯୋଗ ପଞ୍ଜୀୟନ ହୋଇଛି।",
        "english": "Your grievance has been registered successfully.",
        "template": (
            "🙏 ନମସ୍କାର! / Hello!\n\n"
            "ଆପଣଙ୍କ ଅଭିଯୋଗ ପଞ୍ଜୀୟନ ହୋଇଛି।\n"
            "Your complaint has been registered.\n\n"
            "🎫 Ticket ID: *{ticket_id}*\n"
            "📋 Category: {category}\n\n"
            "ଆପଣ ଏହି ନମ୍ବର ବ୍ୟବହାର କରି ଅଭିଯୋଗ ଟ୍ରାକ୍ କରିପାରିବେ।\n"
            "Use this ticket ID to track your complaint status.\n\n"
            "— GraamSeva AI 🏛️"
        ),
    },
    "status_update": {
        "template": (
            "📢 ଅଭିଯୋଗ ଅଦ୍ୟତନ / Complaint Update\n\n"
            "🎫 Ticket: *{ticket_id}*\n"
            "📊 New Status: *{new_status}*\n\n"
            "ଆପଣଙ୍କ ଅଭିଯୋଗ ଉପରେ କାର୍ଯ୍ୟ ଚାଲୁ ଅଛି।\n"
            "Action is being taken on your complaint.\n\n"
            "— GraamSeva AI 🏛️"
        ),
    },
    "resolved": {
        "template": (
            "✅ ଅଭିଯୋଗ ସମାଧାନ / Complaint Resolved!\n\n"
            "🎫 Ticket: *{ticket_id}*\n\n"
            "ଆପଣଙ୍କ ଅଭିଯୋଗ ସଫଳ ଭାବରେ ସମାଧାନ ହୋଇଛି।\n"
            "Your complaint has been successfully resolved.\n\n"
            "ଆପଣଙ୍କ ମତାମତ ଦିଅନ୍ତୁ: Reply with 1 (Satisfied) or 2 (Not Satisfied)\n\n"
            "— GraamSeva AI 🏛️"
        ),
    },
    "escalated": {
        "template": (
            "⚠️ ଅଭିଯୋଗ ଉଚ୍ଚ ଅଧିକାରୀଙ୍କ ନିକଟକୁ ପ୍ରେରଣ / Complaint Escalated\n\n"
            "🎫 Ticket: *{ticket_id}*\n\n"
            "ଆପଣଙ୍କ ଅଭିଯୋଗ ଊର୍ଦ୍ଧ୍ୱତନ ଅଧିକାରୀଙ୍କ ନିକଟକୁ ପ୍ରେରଣ ହୋଇଛି।\n"
            "Your complaint has been escalated to a higher authority.\n\n"
            "— GraamSeva AI 🏛️"
        ),
    },
}


def _get_twilio_client():
    """Lazily initialize and return Twilio client."""
    if settings.mock_whatsapp:
        return None
    try:
        from twilio.rest import Client
        return Client(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN)
    except Exception as e:
        logger.error(f"Failed to initialize Twilio client: {e}")
        return None


def _send_whatsapp(to_phone: str, message: str) -> bool:
    """
    Send a WhatsApp message via Twilio.
    Returns True on success, False on failure.
    """
    # Normalize phone number to WhatsApp format
    phone = to_phone.strip()
    if not phone.startswith("whatsapp:"):
        # Add country code if missing (default: India +91)
        digits = "".join(filter(str.isdigit, phone))
        if len(digits) == 10:
            digits = "91" + digits
        phone = f"whatsapp:+{digits}"

    if settings.mock_whatsapp:
        logger.info(f"[MOCK WhatsApp] To: {phone}\n{message}")
        return True

    client = _get_twilio_client()
    if not client:
        logger.error("Twilio client not available.")
        return False

    try:
        msg = client.messages.create(
            body=message,
            from_=settings.TWILIO_WHATSAPP_FROM,
            to=phone,
        )
        logger.info(f"WhatsApp sent: SID={msg.sid} To={phone}")
        return True
    except Exception as e:
        logger.error(f"WhatsApp send failed to {phone}: {e}")
        return False


def send_ticket_confirmation(phone: str, ticket_id: str, category: str) -> bool:
    """Send ticket creation confirmation to citizen."""
    message = TEMPLATES["ticket_created"]["template"].format(
        ticket_id=ticket_id,
        category=category.replace("_", " ").title(),
    )
    return _send_whatsapp(phone, message)


def send_status_update(phone: str, ticket_id: str, new_status: str) -> bool:
    """Send status update notification to citizen."""
    status_display = new_status.replace("_", " ").title()
    message = TEMPLATES["status_update"]["template"].format(
        ticket_id=ticket_id,
        new_status=status_display,
    )
    return _send_whatsapp(phone, message)


def send_resolution_message(phone: str, ticket_id: str) -> bool:
    """Send resolution notification to citizen."""
    message = TEMPLATES["resolved"]["template"].format(ticket_id=ticket_id)
    return _send_whatsapp(phone, message)


def send_escalation_message(phone: str, ticket_id: str) -> bool:
    """Send escalation notification to citizen."""
    message = TEMPLATES["escalated"]["template"].format(ticket_id=ticket_id)
    return _send_whatsapp(phone, message)


def send_custom_message(phone: str, message: str) -> bool:
    """Send a custom message to citizen."""
    return _send_whatsapp(phone, message)
