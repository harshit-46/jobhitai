import os
import smtplib
from email.mime.text import MIMEText

EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")


def send_verification_email(email: str, token: str, frontend_url: str):
    link = f"{frontend_url}/verify-email?token={token}"

    msg = MIMEText(f"""
    Hello,

    Please verify your email by clicking the link below:

    {link}

    If you didn't request this, ignore this email.
    """)

    msg["Subject"] = "Verify your email"
    msg["From"] = EMAIL_USER
    msg["To"] = email

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.send_message(msg)


def send_reset_email(email: str, token: str, frontend_url: str):
    link = f"{frontend_url}/reset-password?token={token}"

    msg = MIMEText(f"""
    Hello,

    Reset your password using the link below:

    {link}

    This link will expire soon.
    """)

    msg["Subject"] = "Reset your password"
    msg["From"] = EMAIL_USER
    msg["To"] = email

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(EMAIL_USER, EMAIL_PASS)
        server.send_message(msg)