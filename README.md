# Secure-Auth

This repository hosts the codebase for the Information Security (CS3002) project on

# Secure Authentication System

This project implements a secure authentication system with FastAPI as the backend and Next.js as the frontend. Key features include user registration, OTP verification, secure login, and protected routes, all developed with security best practices in mind.

## Project Structure

The directory tree is organized as follows:

```
secure-auth/
├── README.md                  # Project documentation
├── assets/
│   └── logo.png               # Logo image for frontend
├── requirements.txt           # Backend dependencies
├── secureauth-frontend/       # Next.js frontend application
│   ├── public/
│   │   ├── logo.png           # Logo image for frontend display
│   │   └── brief.md           # Markdown file for dashboard content
│   ├── src/
│   │   ├── components/        # Shared frontend components
│   │   ├── pages/             # Frontend pages
│   │   ├── styles/            # Global styles for frontend
│   │   └── utils/             # Utility functions (e.g., API requests)
│   ├── package.json           # Frontend dependencies
│   └── .env.local             # Frontend environment variables
├── src/                       # FastAPI backend application
│   ├── app.py                 # Main FastAPI application
│   ├── config.py              # Configuration and constants
│   ├── database.py            # Database-related functions
│   ├── email_service.py       # Functions for email services and OTPs
└── venv/                      # Virtual environment for backend
```

## Prerequisites

Ensure the following are installed on your system:

- **Python 3.8+** (for FastAPI backend)
- **Node.js 14+ and npm** (for Next.js frontend)
- **Virtual Environment** (recommended for Python)

## Getting Started

---


### 1. Setting Up the Backend (FastAPI)

#### 1.1. Navigate to the Backend Directory

```bash
cd secure-auth/src
```

#### 1.2. Create and Activate a Virtual Environment

For Unix-based systems (Linux/macOS):

```bash
python3 -m venv ../venv
source ../venv/bin/activate
```

For Windows:

```bash
python -m venv ..\venv
.\venv\Scripts\activate
```

#### 1.3. Install Backend Dependencies

```bash
pip install -r ../requirements.txt
```


## Testing the FAST API
use the command "python -m src.app" to run the code from root dir after installing reqs.


#### 1.4. Configure Environment Variables

Create a `.env` file in the `src` directory and add the following environment variables:

```env
# src/.env

SECRET_KEY=your_secure_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
OTP_EXPIRATION_TIME=5  # in minutes
```

Replace the values of `your_secure_secret_key`, `your_supabase_url`, and `your_supabase_key` with actual secure keys.

#### 1.5. Running the FastAPI Backend Server

```bash
uvicorn app:app --reload
```

The FastAPI backend will now be running on `http://127.0.0.1:8000`.

### 2. Setting Up the Frontend (Next.js)

#### 2.1. Navigate to the Frontend Directory

In a separate terminal window:

```bash
cd secure-auth/secureauth-frontend
```

#### 2.2. Install Frontend Dependencies

```bash
npm install
```

#### 2.3. Configure Frontend Environment Variables

Create a `.env.local` file in the `secureauth-frontend` directory and add the following:

```env
# secureauth-frontend/.env.local

NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

This points the frontend API requests to the local FastAPI backend. Adjust this value if you’re running the backend on a different host or port.

#### 2.4. Running the Next.js Frontend Server

```bash
npm run dev
```

The Next.js frontend will now be running on `http://localhost:3000`.

## Project Overview

### FastAPI Backend

- **Registration**: Users register with a username, password, email, and name. Passwords are hashed before storage for security.
- **OTP Verification**: After registration, an OTP is sent via email for verification. OTPs are time-limited for added security.
- **JWT Authentication**: Upon successful login, a JWT token is generated to authenticate subsequent requests. Protected routes are accessible only with valid tokens.
- **Environment Security**: Secret keys and sensitive information are stored in environment variables, not in the source code.

### Next.js Frontend

- **Responsive Design**: Utilizes Tailwind CSS for clean and responsive design.
- **Dashboard with Markdown Content**: Displays project brief and security measures by rendering `brief.md` on the protected dashboard page.
- **Reusable Components**: Components like the header (with logo) and layout wrapper ensure consistency across pages.
- **Protected Routes**: The dashboard is a protected route, accessible only to authenticated users with a valid JWT token.

## Additional Information

### Security Measures

1. **Password Hashing**: Uses bcrypt hashing to securely store passwords.
2. **JWT Tokens**: Signed with a secure secret key and have expiration times to limit risks associated with token theft.
3. **Environment Variables**: Sensitive information is stored securely outside the codebase.
4. **CORS Configuration**: Backend is configured to accept requests only from authorized origins.
5. **HTTPS**: Ensure HTTPS is enabled in production to protect data in transit.

### Testing Endpoints with Postman

- **Base URL**: `http://127.0.0.1:8000`
- **Endpoints**:
  - **POST `/signup`**: Register a new user
  - **POST `/verify-otp`**: Verify OTP for user activation
  - **POST `/login`**: Authenticate user and receive JWT token
  - **GET `/protected-route`**: Access a protected route (requires valid JWT)

### Deployment Tips

- Use a secure HTTPS connection for production environments.
- Replace environment variables with production secrets.
- Consider using Docker for containerized deployment.

---

## License

This project is licensed under the MIT License.