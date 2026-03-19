# Nilesh Kumar — Portfolio Website

A modern, animated, dark-themed portfolio built with **HTML + CSS + JS** (frontend) and **Python Flask** (backend).

---

## 📁 File Structure

```
portfolio/
├── index.html      ← Main HTML (all sections)
├── style.css       ← All styles (dark theme, glass, animations)
├── script.js       ← Interactivity (particles, typewriter, filter, etc.)
├── app.py          ← Flask backend (contact form)
└── README.md       ← This file
```

---

## 🚀 Quick Start

### Option A — Static (no backend needed)
Just open `index.html` in your browser. Everything works except the contact form (it shows a demo message instead).

### Option B — Full Stack with Flask

**1. Install dependencies:**
```bash
pip install flask flask-cors
```

**2. (Optional) Enable email notifications:**
```bash
# Set these environment variables before running
export MAIL_USER="your_gmail@gmail.com"
export MAIL_PASS="your_16_char_app_password"
export MAIL_TO="where_to_receive@email.com"
```
> Get a Gmail App Password: Google Account → Security → 2-Step Verification → App Passwords

**3. Run the server:**
```bash
python app.py
```

**4. Open:** `http://localhost:5000`

---

## ✨ Features

| Feature | Status |
|---|---|
| Dark / Light mode toggle | ✅ |
| Particle canvas background | ✅ |
| Typewriter role animation | ✅ |
| Custom cursor | ✅ |
| Smooth scroll + active nav | ✅ |
| Scroll reveal animations | ✅ |
| Animated skill progress bars | ✅ |
| Project filter (All / C++ / Web / Python / DBMS) | ✅ |
| Glassmorphism cards | ✅ |
| Contact form with Flask | ✅ |
| Email notification (optional) | ✅ |
| Scroll-to-top button | ✅ |
| Loading animation | ✅ |
| Fully responsive (mobile + desktop) | ✅ |

---

## 🎨 Customization

- **Name / links:** Edit `index.html` — search for `nilesh`, `#`, and placeholder text
- **Projects:** Update the `.project-card` blocks in `index.html`
- **Colors:** Change `--accent`, `--accent2`, `--accent3` in `:root` inside `style.css`
- **Resume link:** Find `window.open('#','_blank')` in the navbar button and replace `#` with your PDF URL
- **Social links:** Replace all `href="#"` anchors in the about, achievements, and contact sections

---

## 🛠 Tech Stack

- **Frontend:** HTML5, CSS3 (custom properties, glassmorphism, keyframes), Vanilla JS
- **Backend:** Python 3, Flask, smtplib
- **Icons:** Font Awesome 6
- **Fonts:** Syne (headings), DM Mono (code/labels), Epilogue (body)

---

Built by Nilesh Kumar · BCA 2023–2026
