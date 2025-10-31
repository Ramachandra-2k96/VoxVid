import sib_api_v3_sdk
from sib_api_v3_sdk.rest import ApiException
from sib_api_v3_sdk.api.transactional_emails_api import TransactionalEmailsApi
from sib_api_v3_sdk.models.send_smtp_email import SendSmtpEmail
import secrets
import logging
from django.conf import settings

logger = logging.getLogger(__name__)


def generate_otp():
    """Generate a 6-digit OTP"""
    return ''.join(str(secrets.randbelow(10)) for _ in range(6))


def send_otp_email(receiver_email, otp):
    """
    Send OTP email using Brevo API
    
    Args:
        receiver_email (str): Email address to send OTP to
        otp (str): The OTP code to send
        
    Returns:
        bool: True if email sent successfully, False otherwise
    """
    try:
        api_key = settings.BREVO_API_KEY
        sender_email = settings.BREVO_API_EMAIL

        if not api_key or not sender_email:
            logger.error("Brevo API key or sender email not configured")
            return False

        html_content = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    background-color: #000000;
                    color: #ffffff;
                    padding: 20px;
                }}
                .container {{
                    max-width: 600px;
                    margin: 0 auto;
                    background: linear-gradient(135deg, rgba(34, 211, 238, 0.1) 0%, rgba(255, 92, 40, 0.1) 50%, rgba(255, 92, 157, 0.1) 100%);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                    padding: 40px;
                }}
                .logo {{
                    text-align: center;
                    font-size: 32px;
                    font-weight: bold;
                    background: linear-gradient(135deg, #22D3EE 0%, #FF5C28 50%, #FF5C9D 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                    margin-bottom: 30px;
                }}
                .otp-box {{
                    background: rgba(255, 255, 255, 0.1);
                    border: 2px solid #22D3EE;
                    border-radius: 8px;
                    padding: 30px;
                    text-align: center;
                    margin: 30px 0;
                }}
                .otp-code {{
                    font-size: 36px;
                    font-weight: bold;
                    letter-spacing: 8px;
                    color: #22D3EE;
                    margin: 20px 0;
                }}
                .message {{
                    color: rgba(255, 255, 255, 0.8);
                    line-height: 1.6;
                    margin: 20px 0;
                }}
                .footer {{
                    text-align: center;
                    color: rgba(255, 255, 255, 0.5);
                    font-size: 12px;
                    margin-top: 30px;
                }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="logo">VoxVid</div>
                <h2 style="text-align: center; color: #ffffff;">Password Reset Request</h2>
                <p class="message">
                    You have requested to reset your password. Use the verification code below to proceed:
                </p>
                <div class="otp-box">
                    <p style="margin: 0; color: rgba(255, 255, 255, 0.7);">Your verification code is:</p>
                    <div class="otp-code">{otp}</div>
                    <p style="margin: 0; color: rgba(255, 255, 255, 0.5); font-size: 14px;">
                        This code will expire in 10 minutes
                    </p>
                </div>
                <p class="message">
                    If you didn't request a password reset, please ignore this email or contact support if you have concerns.
                </p>
                <div class="footer">
                    <p>© 2025 VoxVid. All rights reserved.</p>
                    <p>This is an automated message, please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
        """

        configuration = sib_api_v3_sdk.Configuration()
        configuration.api_key['api-key'] = api_key
        api_instance = TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))

        email = SendSmtpEmail(
            sender={"email": sender_email, "name": "VoxVid"},
            to=[{"email": receiver_email}],
            subject="VoxVid - Password Reset Verification Code",
            html_content=html_content
        )

        response = api_instance.send_transac_email(email)
        logger.info(f"Password reset email sent successfully to {receiver_email}")
        return True

    except ApiException as e:
        logger.error(f"Brevo API error: {e}")
        return False
    except Exception as e:
        logger.error(f"Error sending email: {e}")
        return False
