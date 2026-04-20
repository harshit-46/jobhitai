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
            "html": f"""
<div style="font-family: 'DM Sans', sans-serif; background: #0a0a0e; padding: 40px; max-width: 480px; margin: 0 auto; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08);">
    <h1 style="font-family: serif; color: #f0ede8; margin-bottom: 8px;">
        Career<span style="color: #E8FF47;">Crafter</span>
    </h1>
    <h2 style="color: #f0ede8; font-size: 1.2rem; margin-bottom: 8px;">Verify your email</h2>
    <p style="color: rgba(255,255,255,0.4); font-size: 0.9rem; margin-bottom: 24px;">
        Click the button below to verify your email address and activate your account.
    </p>
    <a href="{link}" style="display: inline-block; background: #E8FF47; color: #0a0a0e; padding: 12px 28px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 0.95rem;">
        Verify Email
    </a>
    <p style="color: rgba(255,255,255,0.2); font-size: 0.75rem; margin-top: 24px;">
        If you didn't create an account, you can ignore this email.
    </p>
</div>
""",
            "text": f"Verify your email: {link}"
        })
    except Exception as e:
        print("Email error:", str(e))
        raise