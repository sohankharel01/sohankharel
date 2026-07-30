# Portfolio Contact API (FastAPI)

A tiny backend with one real job: receive the contact form submission,
validate it, block spam, and email it to you. No database.

## What's included
- `POST /api/contact` — validates input, rate-limits (5/hour per IP),
  drops honeypot spam silently, emails you via SMTP
- `GET /api/health` — uptime check
- CORS locked to the origins you list in `.env`
- Input validation via Pydantic (name/subject/message length limits, real
  email format)

## 1. Local setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# now edit .env with real values (see below)
```

### Getting SMTP credentials (Gmail example)
1. Turn on 2-Step Verification on your Google account.
2. Go to https://myaccount.google.com/apppasswords
3. Create an app password for "Mail" — you'll get a 16-character code.
4. Put that in `.env` as `SMTP_PASSWORD` (not your normal Gmail password).

Any SMTP provider works the same way (Outlook, Zoho, SendGrid's SMTP
relay, etc.) — just change `SMTP_HOST`/`SMTP_PORT`.

### Run it
```bash
uvicorn main:app --reload --port 8000
```

Test it:
```bash
curl http://localhost:8000/api/health

curl -X POST http://localhost:8000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"you@example.com","subject":"Hello","message":"Just testing the API."}'
```

## 2. Connect the frontend
In `index.html`, find `CONTACT_API_URL` near the bottom of the contact
form script and point it at wherever this backend ends up living, e.g.
`http://localhost:8000/api/contact` while testing locally, or your real
deployed URL in production. The form already falls back to opening the
visitor's email client if the API request fails, so nothing breaks if the
backend is ever down.

## 3. Deploying

### Option A — Render (free tier, easiest)
1. Push this `backend/` folder to a GitHub repo.
2. On render.com: New → Web Service → connect the repo.
3. Build command: `pip install -r requirements.txt`
4. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add your `.env` values under Render's "Environment" tab (never commit
   `.env` itself).
6. Once deployed you'll get a URL like `https://your-api.onrender.com` —
   use `https://your-api.onrender.com/api/contact` as `CONTACT_API_URL`.
7. Set `ALLOWED_ORIGINS` to your real portfolio domain.

### Option B — Railway
Same idea as Render: connect the repo, it auto-detects the `Procfile`,
add the same environment variables in the dashboard.

### Option C — Docker on any VPS
```bash
docker build -t portfolio-contact-api .
docker run -d -p 8000:8000 --env-file .env portfolio-contact-api
```
Put it behind Nginx/Caddy with HTTPS in front (Caddy is the easy path —
it gets you a free TLS cert automatically).

## 4. Security notes
- `.env` is already assumed to be gitignored — never commit real
  credentials.
- The rate limit (5/hour/IP) and honeypot field together stop almost all
  automated spam without needing a CAPTCHA. If you still get spam, add
  hCaptcha or Cloudflare Turnstile in front of the form.
- CORS is restricted to `ALLOWED_ORIGINS` — don't set it to `*` in
  production.
- Errors returned to the client are intentionally generic (no stack
  traces or internal details leak out); full details go to the server
  log via `logger.exception(...)`.
