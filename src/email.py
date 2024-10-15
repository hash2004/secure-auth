import smtplib
from email.mime.text import MIMEText
import secrets
import string
from datetime import datetime, timedelta
from src.config import EMAIL_SENDER, EMAIL_PASSWORD, OTP_LENGTH, OTP_EXPIRATION_TIME
from src.constants import otp_message

def generate_otp(length=OTP_LENGTH):
    digits = string.digits
    otp = ''.join(secrets.choice(digits) for i in range(length))
    return otp

def send_otp(receiver_email, otp):
    # Create the message as a single MIMEText object
    message = MIMEText(otp_message.format(otp=otp, OTP_EXPIRATION_TIME=OTP_EXPIRATION_TIME), "html")
    message["Subject"] = "Your OTP Code"
    message["From"] = EMAIL_SENDER
    message["To"] = receiver_email

    try:
        server = smtplib.SMTP_SSL("smtp.gmail.com", 465)
        server.login(EMAIL_SENDER, EMAIL_PASSWORD)
        server.sendmail(EMAIL_SENDER, receiver_email, message.as_string())
        server.quit()
        print(f"OTP sent successfully to {receiver_email}")
    except Exception as e:
        print(f"Failed to send OTP. Error: {e}")

def is_otp_expired(otp_timestamp):
    current_time = datetime.now()
    if current_time > otp_timestamp + timedelta(minutes=OTP_EXPIRATION_TIME):
        return True
    return False


# Example usage:

otp = generate_otp()

recipient_email = "i211675@nu.edu.pk"  
send_otp(recipient_email, otp)

otp_generated_time = datetime.now()

if is_otp_expired(otp_generated_time):
    print("OTP has expired.")
else:
    print("OTP is still valid.")
