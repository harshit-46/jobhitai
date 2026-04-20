import os
import resend

resend.api_key = os.getenv("RESEND_API_KEY")

EMAIL_FROM = os.getenv("EMAIL_FROM")


def send_verification_email(email: str, token: str, frontend_url: str):
    link = f"{frontend_url}/verify-email?token={token}"

    resend.Emails.send({
        "from": f"CareerCrafter <{EMAIL_FROM}>",
        "to": email,
        "subject": "Verify your email",
        "html": f"""
        <div style="font-family: Arial; padding: 20px;">
            <h2>Verify your email</h2>
            <p>Click the button below to verify your account:</p>
            
            <a href="{link}" 
               style="
                   display:inline-block;
                   padding:12px 20px;
                   background:#E8FF47;
                   color:#000;
                   text-decoration:none;
                   border-radius:8px;
                   font-weight:bold;
               ">
               Verify Email
            </a>

            <p style="margin-top:20px; color:#888;">
                If you didn’t sign up, ignore this email.
            </p>
        </div>
        """
    })