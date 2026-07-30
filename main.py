"""
Portfolio contact form backend.

Receives POSTs from the site's contact form, validates + sanitizes the
input, blocks obvious spam, rate-limits by IP, and emails you the message
via SMTP. No database — this is intentionally minimal.

Run locally:
    uvicorn main:app --reload --port 8000

Env vars (see .env.example):
    SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, CONTACT_TO_EMAIL,
    ALLOWED_ORIGINS
"""

import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.utils import formataddr

from fastapi import FastAPI, Request, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, field_validator
from dotenv import load_dotenv

from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("contact-backend")

# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------
SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "465"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
CONTACT_TO_EMAIL = os.getenv("CONTACT_TO_EMAIL", SMTP_USER)
ALLOWED_ORIGINS = [
    o.strip() for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:5500").split(",") if o.strip()
]

REQUIRED_ENV = ["SMTP_HOST", "SMTP_USER", "SMTP_PASSWORD"]
missing = [v for v in REQUIRED_ENV if not os.getenv(v)]
if missing:
    logger.warning(
        "Missing env vars: %s — email sending will fail until these are set in .env",
        ", ".join(missing),
    )

# ---------------------------------------------------------------------------
# App + rate limiting + CORS
# ---------------------------------------------------------------------------
limiter = Limiter(key_func=get_remote_address)

app = FastAPI(title="Portfolio Contact API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=False,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["Content-Type"],
)


# ---------------------------------------------------------------------------
# Request schema
# ---------------------------------------------------------------------------
class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str
    website: str = ""  # honeypot — real users never fill this in

    @field_validator("name")
    @classmethod
    def name_len(cls, v: str) -> str:
        v = v.strip()
        if not (2 <= len(v) <= 100):
            raise ValueError("Name must be between 2 and 100 characters.")
        return v

    @field_validator("subject")
    @classmethod
    def subject_len(cls, v: str) -> str:
        v = v.strip()
        if not (2 <= len(v) <= 150):
            raise ValueError("Subject must be between 2 and 150 characters.")
        return v

    @field_validator("message")
    @classmethod
    def message_len(cls, v: str) -> str:
        v = v.strip()
        if not (10 <= len(v) <= 5000):
            raise ValueError("Message must be between 10 and 5000 characters.")
        return v


class ContactResponse(BaseModel):
    success: bool
    detail: str = ""


# ---------------------------------------------------------------------------
# Email
# ---------------------------------------------------------------------------
def send_email(form: ContactForm) -> None:
    body = (
        f"New message from your portfolio contact form.\n\n"
        f"Name:    {form.name}\n"
        f"Email:   {form.email}\n"
        f"Subject: {form.subject}\n\n"
        f"Message:\n{form.message}\n"
    )
    msg = MIMEText(body, "plain", "utf-8")
    msg["Subject"] = f"[Portfolio] {form.subject}"
    msg["From"] = formataddr(("Portfolio Contact Form", SMTP_USER))
    msg["To"] = CONTACT_TO_EMAIL
    msg["Reply-To"] = form.email

    with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
        server.login(SMTP_USER, SMTP_PASSWORD)
        server.sendmail(SMTP_USER, [CONTACT_TO_EMAIL], msg.as_string())


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/contact", response_model=ContactResponse)
@limiter.limit("5/hour")
def contact(request: Request, form: ContactForm):
    # Honeypot: bots fill every field, humans never see/fill this one.
    if form.website:
        logger.info("Honeypot triggered — silently dropping submission.")
        return ContactResponse(success=True)

    if not SMTP_HOST or not SMTP_USER or not SMTP_PASSWORD:
        logger.error("SMTP is not configured — refusing to send.")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Email is not configured on the server yet.",
        )

    try:
        send_email(form)
    except Exception:
        logger.exception("Failed to send contact email")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not send your message right now. Please try again later.",
        )

    return ContactResponse(success=True, detail="Message sent.")
