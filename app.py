"""
═══════════════════════════════════════════════════════
  NILESH KUMAR — PORTFOLIO BACKEND (Flask)
  Handles contact form submissions + optional email
═══════════════════════════════════════════════════════

  SETUP:
    pip install flask flask-cors

  RUN:
    python app.py

  OPTIONAL EMAIL (Gmail):
    pip install secure-smtplib
    Set env vars:
      MAIL_USER = your_gmail@gmail.com
      MAIL_PASS = your_app_password   (16-char App Password, NOT your Gmail password)
      MAIL_TO   = where to receive messages (can be the same address)
"""

import os
import json
import smtplib
import logging
from datetime import datetime
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS

# ─── APP CONFIG ───────────────────────────────────────────────────────────────
app = Flask(__name__, static_folder='.', template_folder='.')
CORS(app)  # Allow requests from any origin (needed when testing locally)

logging.basicConfig(level=logging.INFO)
log = logging.getLogger(__name__)

# ─── EMAIL CONFIG (set via environment variables for security) ─────────────────
MAIL_USER = os.environ.get('MAIL_USER', '')       # Gmail sender address
MAIL_PASS = os.environ.get('MAIL_PASS', '')       # Gmail App Password
MAIL_TO   = os.environ.get('MAIL_TO', MAIL_USER)  # Destination address

# ─── SIMPLE IN-MEMORY LOG (replace with DB in production) ─────────────────────
messages_log = []


# ─── ROUTES ───────────────────────────────────────────────────────────────────

@app.route('/')
def index():
    """Serve the portfolio HTML file."""
    return send_from_directory('.', 'index.html')


@app.route('/style.css')
def serve_css():
    return send_from_directory('.', 'style.css')


@app.route('/script.js')
def serve_js():
    return send_from_directory('.', 'script.js')


@app.route('/contact', methods=['POST'])
def contact():
    """
    Handle contact form submission.
    Expects JSON: { name, email, message }
    Returns JSON: { success, message }
    """
    try:
        data = request.get_json(silent=True) or request.form.to_dict()

        # ── Validate ──────────────────────────────────────────────────────────
        name    = (data.get('name', '') or '').strip()
        email   = (data.get('email', '') or '').strip()
        message = (data.get('message', '') or '').strip()

        if not name or not email or not message:
            return jsonify({'error': 'All fields are required.'}), 400

        if '@' not in email or '.' not in email.split('@')[-1]:
            return jsonify({'error': 'Please enter a valid email address.'}), 400

        if len(message) < 10:
            return jsonify({'error': 'Message is too short.'}), 400

        if len(message) > 2000:
            return jsonify({'error': 'Message exceeds 2000 characters.'}), 400

        # ── Log message ───────────────────────────────────────────────────────
        entry = {
            'timestamp': datetime.utcnow().isoformat(),
            'name': name,
            'email': email,
            'message': message
        }
        messages_log.append(entry)
        log.info(f"[CONTACT] New message from {name} <{email}>")

        # ── Send email (optional) ─────────────────────────────────────────────
        if MAIL_USER and MAIL_PASS:
            try:
                _send_email(name, email, message)
                log.info(f"[MAIL] Email sent successfully to {MAIL_TO}")
            except Exception as mail_err:
                # Don't fail the whole request just because email failed
                log.warning(f"[MAIL] Failed to send email: {mail_err}")

        return jsonify({
            'success': True,
            'message': "Thanks for reaching out! I'll get back to you soon."
        }), 200

    except Exception as e:
        log.error(f"[CONTACT] Unexpected error: {e}")
        return jsonify({'error': 'Server error. Please try again later.'}), 500


@app.route('/admin/messages', methods=['GET'])
def admin_messages():
    """
    Simple endpoint to view all received messages.
    In production: protect with authentication!
    """
    return jsonify({
        'count': len(messages_log),
        'messages': messages_log
    })


# ─── EMAIL HELPER ─────────────────────────────────────────────────────────────

def _send_email(sender_name: str, sender_email: str, message_body: str):
    """Send a nicely formatted email notification via Gmail SMTP."""
    subject = f"[Portfolio] New message from {sender_name}"

    html_body = f"""
    <html>
    <body style="font-family: 'Segoe UI', sans-serif; background:#0a0a0f; color:#e8e8f0; padding:2rem;">
      <div style="max-width:560px; margin:0 auto; background:#14141f;
                  border:1px solid rgba(0,245,212,0.2); border-radius:12px; padding:2rem;">
        <h2 style="color:#00f5d4; margin:0 0 1.5rem; font-size:1.3rem;">
          📬 New Portfolio Message
        </h2>
        <table style="width:100%; border-collapse:collapse;">
          <tr>
            <td style="padding:0.6rem 0; color:#8888a8; font-size:0.85rem; width:80px;">Name</td>
            <td style="padding:0.6rem 0; font-size:0.9rem;">{sender_name}</td>
          </tr>
          <tr>
            <td style="padding:0.6rem 0; color:#8888a8; font-size:0.85rem;">Email</td>
            <td style="padding:0.6rem 0; font-size:0.9rem;">
              <a href="mailto:{sender_email}" style="color:#00f5d4;">{sender_email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:0.6rem 0; color:#8888a8; font-size:0.85rem;">Time</td>
            <td style="padding:0.6rem 0; font-size:0.9rem;">{datetime.utcnow().strftime('%d %b %Y, %H:%M UTC')}</td>
          </tr>
        </table>
        <hr style="border:none; border-top:1px solid rgba(255,255,255,0.06); margin:1.5rem 0;"/>
        <h3 style="color:#8888a8; font-size:0.8rem; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:0.75rem;">
          Message
        </h3>
        <p style="font-size:0.95rem; line-height:1.8; color:#c8c8e0;">
          {message_body.replace(chr(10), '<br>')}
        </p>
        <hr style="border:none; border-top:1px solid rgba(255,255,255,0.06); margin:1.5rem 0;"/>
        <p style="font-size:0.75rem; color:#555570; text-align:center;">
          Sent via Nilesh Kumar's portfolio — nileshkumar.dev
        </p>
      </div>
    </body>
    </html>
    """

    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From']    = MAIL_USER
    msg['To']      = MAIL_TO
    msg['Reply-To'] = sender_email

    msg.attach(MIMEText(message_body, 'plain'))
    msg.attach(MIMEText(html_body, 'html'))

    with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
        server.login(MAIL_USER, MAIL_PASS)
        server.sendmail(MAIL_USER, MAIL_TO, msg.as_string())


# ─── RUN ──────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    debug = os.environ.get('FLASK_DEBUG', 'true').lower() == 'true'
    log.info(f"🚀  Portfolio server starting on http://localhost:{port}")
    app.run(host='0.0.0.0', port=port, debug=debug)
