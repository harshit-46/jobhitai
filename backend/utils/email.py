import os
import resend

resend.api_key = os.getenv("RESEND_API_KEY")
frontend_url = os.getenv("FRONTEND_URL")

def send_verification_email(email: str, token: str, frontend_url: str):
    link = f"{frontend_url}/verify-email?token={token}"

    resend.Emails.send({
        "from": "onboarding@resend.dev",
        "to": email,
        "subject": "Verify your email",
        "html": f"""
        <h2>Verify your email</h2>
        <p>Click below to verify your account:</p>
        <a href="{link}">Verify Email</a>
        """
    })


def send_reset_email(email: str, token: str, frontend_url: str):
    link = f"{frontend_url}/reset-password?token={token}"

    resend.Emails.send({
        "from": "onboarding@resend.dev",
        "to": email,
        "subject": "Reset your password",
        "html": f"""
        <h2>Reset Password</h2>
        <p>Click below to reset your password:</p>
        <a href="{link}">Reset Password</a>
        """
    })