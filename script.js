/* ═══════════════════════════════════════════════════════
   NILESH KUMAR — PORTFOLIO JS
   Handles: loader, cursor, particles, typewriter,
   navbar, reveal, filters, skills, contact form
═══════════════════════════════════════════════════════ */

/* ──────────────────────────────────────────
   1. LOADER
────────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 2000);
});

/* ──────────────────────────────────────────
   2. CUSTOM CURSOR
────────────────────────────────────────── */
const cursorDot  = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

// Smooth trailing ring
function animateCursor() {
  const ease = 0.12;
  ringX += (mouseX - ringX) * ease;
  ringY += (mouseY - ringY) * ease;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Cursor interactions
document.querySelectorAll('a, button, .project-card, .ach-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursorRing.style.width  = '50px';
    cursorRing.style.height = '50px';
    cursorRing.style.borderColor = 'var(--accent2)';
    cursorDot.style.transform = 'translate(-50%,-50%) scale(2)';
  });
  el.addEventListener('mouseleave', () => {
    cursorRing.style.width  = '32px';
    cursorRing.style.height = '32px';
    cursorRing.style.borderColor = 'var(--accent)';
    cursorDot.style.transform = 'translate(-50%,-50%) scale(1)';
  });
});

/* ──────────────────────────────────────────
   3. PARTICLE CANVAS
────────────────────────────────────────── */
const canvas  = document.getElementById('particleCanvas');
const ctx     = canvas.getContext('2d');
let particles = [];
let W, H;

function resizeCanvas() {
  W = canvas.width  = canvas.offsetWidth;
  H = canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x     = Math.random() * W;
    this.y     = Math.random() * H;
    this.vx    = (Math.random() - 0.5) * 0.4;
    this.vy    = (Math.random() - 0.5) * 0.4;
    this.r     = Math.random() * 1.5 + 0.5;
    this.alpha = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '0,245,212' : '124,106,247';
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.alpha})`;
    ctx.fill();
  }
}

// Create particles
for (let i = 0; i < 100; i++) particles.push(new Particle());

// Draw connections
function drawConnections() {
  const rect = canvas.getBoundingClientRect();
  const mX = mouseX - rect.left;
  const mY = mouseY - rect.top;

  for (let i = 0; i < particles.length; i++) {
    if (mouseX > 0 || mouseY > 0) {
      const mdx = particles[i].x - mX;
      const mdy = particles[i].y - mY;
      const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mDist < 150) {
        const alpha = (1 - mDist / 150) * 0.3;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(mX, mY);
        ctx.strokeStyle = `rgba(0,245,212,${alpha})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
        
        if (mDist < 100) {
          particles[i].x += mdx * 0.03;
          particles[i].y += mdy * 0.03;
        }
      }
    }

    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const alpha = (1 - dist / 100) * 0.12;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(0,245,212,${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, W, H);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ──────────────────────────────────────────
   4. TYPEWRITER EFFECT
────────────────────────────────────────── */
const roles = [
  'Software Developer',
  'Problem Solver',
  'Tech Enthusiast',
  'Web Developer',
  'DSA Learner',
  'Open Source Fan'
];

let roleIdx = 0, charIdx = 0, deleting = false;
const typer = document.getElementById('typewriter');

function typeLoop() {
  const current = roles[roleIdx];
  if (!deleting) {
    typer.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 1800);
      return;
    }
  } else {
    typer.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
    }
  }
  setTimeout(typeLoop, deleting ? 60 : 100);
}
setTimeout(typeLoop, 2200); // Start after loader

/* ──────────────────────────────────────────
   5. NAVBAR — SCROLL & ACTIVE
────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
  // Scrolled class
  navbar.classList.toggle('scrolled', window.scrollY > 60);

  // Scroll-to-top button
  document.getElementById('scrollTop').classList.toggle('visible', window.scrollY > 400);

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    if (window.scrollY >= sec.offsetTop - 150) current = sec.id;
  });
  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
});

// Hamburger
const hamburger = document.getElementById('hamburger');
const navLinksList = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinksList.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  navLinksList.classList.contains('open')
    ? (spans[0].style.transform='rotate(45deg) translate(5px,5px)',
       spans[1].style.opacity='0',
       spans[2].style.transform='rotate(-45deg) translate(5px,-5px)')
    : (spans[0].style.transform='',spans[1].style.opacity='',spans[2].style.transform='');
});
navLinks.forEach(l => l.addEventListener('click', () => navLinksList.classList.remove('open')));

/* ──────────────────────────────────────────
   6. SCROLL TO TOP
────────────────────────────────────────── */
document.getElementById('scrollTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ──────────────────────────────────────────
   7. DARK / LIGHT MODE
────────────────────────────────────────── */
const themeToggle = document.getElementById('themeToggle');
const themeIcon   = document.getElementById('themeIcon');
let isDark = true;

themeToggle.addEventListener('click', () => {
  isDark = !isDark;
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  themeIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
});

/* ──────────────────────────────────────────
   8. REVEAL ON SCROLL (Intersection Observer)
────────────────────────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ──────────────────────────────────────────
   9. SKILL BARS ANIMATION
────────────────────────────────────────── */
const skillObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-fill').forEach((fill, i) => {
          setTimeout(() => fill.classList.add('animated'), i * 150 + 300);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);
document.querySelectorAll('.skill-category').forEach(el => skillObserver.observe(el));

/* ──────────────────────────────────────────
   10. PROJECT FILTER
────────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Update active button
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    projectCards.forEach(card => {
      const tags = card.getAttribute('data-tags') || '';
      const show = filter === 'all' || tags.includes(filter);

      if (show) {
        card.classList.remove('hidden');
        card.style.animation = 'filterIn 0.4s ease forwards';
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// Add filter animation keyframes dynamically
const style = document.createElement('style');
style.textContent = `
  @keyframes filterIn {
    from { opacity: 0; transform: translateY(20px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }
`;
document.head.appendChild(style);

/* ──────────────────────────────────────────
   11. CONTACT FORM
────────────────────────────────────────── */
const form        = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');
const btnText     = form.querySelector('.btn-text');
const btnSending  = form.querySelector('.btn-sending');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Show loading
  btnText.style.display    = 'none';
  btnSending.style.display = 'inline-flex';
  formMessage.textContent  = '';
  formMessage.className    = 'form-message';

  const data = {
    name:    form.name.value.trim(),
    email:   form.email.value.trim(),
    message: form.message.value.trim()
  };

  try {
    const res = await fetch('/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();

    if (res.ok) {
      formMessage.textContent = '✓ Message sent! I\'ll get back to you soon.';
      formMessage.classList.add('success');
      form.reset();
    } else {
      throw new Error(json.error || 'Something went wrong.');
    }
  } catch (err) {
    // Fallback for when backend isn't running (demo mode)
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      formMessage.textContent = '✓ Demo mode — message noted! Connect the Flask backend to send real emails.';
      formMessage.classList.add('success');
      form.reset();
    } else {
      formMessage.textContent = '✗ ' + err.message;
      formMessage.classList.add('error');
    }
  } finally {
    btnText.style.display    = 'inline-flex';
    btnSending.style.display = 'none';
  }
});

/* ──────────────────────────────────────────
   12. SMOOTH SCROLL FOR ALL ANCHOR LINKS
────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ──────────────────────────────────────────
   13. STAGGER ANIMATIONS FOR GRIDS
────────────────────────────────────────── */
function staggerCards(containerSelector, delay = 100) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const cards = entry.target.querySelectorAll(':scope > *');
        cards.forEach((card, i) => {
          card.style.transitionDelay = `${i * delay}ms`;
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(containerSelector).forEach(el => observer.observe(el));
}
staggerCards('.ach-grid', 80);
staggerCards('.skills-grid', 100);

console.log('%c Nilesh Kumar Portfolio ', 'background: #00f5d4; color: #000; font-size: 14px; font-weight: bold; padding: 6px 12px; border-radius: 4px;');
console.log('%c Built with HTML + CSS + JS + Flask ', 'color: #7c6af7; font-size: 11px;');
