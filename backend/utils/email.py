import os
import resend

resend.api_key = os.getenv("RESEND_API_KEY")
EMAIL_FROM = os.getenv("EMAIL_FROM", "onboarding@resend.dev")

def send_verification_email(email: str, token: str, frontend_url: str):
    link = f"{frontend_url}/verify-email?token={token}"

    try:
        resend.Emails.send({
            "from": f"CareerCrafter <{EMAIL_FROM}>",
            "to": [email],
            "subject": "Verify your email",
            "html": f"""...""",
            "text": f"Verify your email: {link}"
        })
    except Exception as e:
        print("Email error:", str(e))
        raise