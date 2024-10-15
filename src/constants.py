otp_message = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {{
      font-family: Arial, sans-serif;
      background-color: #f4f4f9;
      margin: 0;
      padding: 0;
      text-align: center;
    }}
    .container {{
      background-color: white;
      padding: 20px;
      border-radius: 10px;
      margin: 50px auto;
      max-width: 400px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
    }}
    .header {{
      font-size: 24px;
      font-weight: bold;
      color: #2a9d8f;
    }}
    .otp {{
      font-size: 40px;
      font-weight: bold;
      color: #e76f51;
      margin: 20px 0;
    }}
    .expiration {{
      font-size: 16px;
      color: #555;
      margin-top: 10px;
    }}
    .svg-icon {{
      margin-bottom: 20px;
    }}
    .footer {{
      margin-top: 20px;
      font-size: 14px;
      color: #999;
    }}
  </style>
</head>
<body>
  <div class="container">
    <div class="svg-icon">
      <img src="/home/hashim/secure-auth/logo.png" alt="LOGIC Logo" width="100" />
    </div>
    <div class="header">
      Welcome to LOGIC!
    </div>
    <p>Your One-Time Password (OTP) is:</p>
    <div class="otp">{otp}</div>
    <p class="expiration">This OTP is valid for {OTP_EXPIRATION_TIME} minutes.</p>
    <div class="footer">
      Thank you for using LOGIC. If you didn't request this, please ignore this message.
    </div>
  </div>
</body>
</html>
"""
