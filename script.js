/* ================================================================
   7X Portfolio — Vanilla JS
   ================================================================ */

'use strict';

/* ── DOM Ready ─────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initParticles();
  initScrollReveal();
  initTicker();
  initMagneticBtn();
  initForm();
  initSkillBars();
  initSmoothScroll();
  initTypewriter();
  initBottomNav();
});

/* ── 1. STICKY HEADER ──────────────────────────────────────── */
function initHeader() {
  const header = document.getElementById('header');

  // Glassmorphism on scroll only — mobile nav replaced by bottom-nav
  window.addEventListener('scroll', () => {
    header.classList.toggle('header--scrolled', window.scrollY > 60);
  }, { passive: true });
}


/* ── 2. PARTICLE CANVAS ────────────────────────────────────── */
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  const COLORS = ['#00d4ff', '#a855f7', '#818cf8'];
  const COUNT = 70;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.r = Math.random() * 1.5 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
      this.alpha = Math.random() * 0.6 + 0.2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function buildParticles() {
    particles = Array.from({ length: COUNT }, () => new Particle());
  }

  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 120) * 0.15;
          ctx.strokeStyle = '#00d4ff';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => { resize(); buildParticles(); }, { passive: true });
  resize();
  buildParticles();
  loop();
}

/* ── 3. SCROLL REVEAL ──────────────────────────────────────── */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 5) * 80}ms`;
    observer.observe(el);
  });
}

/* ── 4. INFINITE TICKER ────────────────────────────────────── */
function initTicker() {
  const track = document.getElementById('tickerTrack');
  if (!track) return;
  const clone = track.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  track.parentElement.appendChild(clone);
}

/* ── 5. MAGNETIC BUTTON ────────────────────────────────────── */
function initMagneticBtn() {
  const btn = document.getElementById('submitBtn');
  if (!btn) return;

  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) * 0.35;
    const dy = (e.clientY - cy) * 0.35;
    btn.style.transform = `translate(${dx}px, ${dy}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0,0)';
  });
}

/* ── 6. CONTACT FORM ───────────────────────────────────────── */
function initForm() {
  const form = document.getElementById('contactForm');
  const successEl = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.classList.add('loading');
    btn.disabled = true;

    setTimeout(() => {
      btn.classList.remove('loading');
      btn.disabled = false;
      successEl.textContent = '✓ Message sent! I\'ll get back to you shortly.';
      successEl.classList.add('visible');
      form.reset();
      setTimeout(() => successEl.classList.remove('visible'), 5000);
    }, 1400);
  });
}

/* ── 7. SKILL BARS ─────────────────────────────────────────── */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar__fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.width = entry.target.style.getPropertyValue('--pct') || '0%';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  bars.forEach(bar => {
    bar.style.width = '0%';
    observer.observe(bar);
  });
}

/* ── 8. SMOOTH SCROLL ──────────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── 9. TYPEWRITER ─────────────────────────────────────────── */
function initTypewriter() {
  const el = document.getElementById('typedName');
  if (!el) return;

  const PHRASES = ['SOULAYMAN 7X', 'Full Stack Dev', 'SOULAYMAN 7X'];
  const TYPE_SPEED = 80;   // ms per character
  const DELETE_SPEED = 40;   // ms per character
  const PAUSE_END = 2200; // ms pause after fully typed
  const PAUSE_START = 400;  // ms pause before re-typing

  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function tick() {
    const phrase = PHRASES[phraseIdx % PHRASES.length];

    if (!deleting) {
      // Typing
      el.textContent = phrase.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === phrase.length) {
        deleting = true;
        setTimeout(tick, PAUSE_END);
        return;
      }
      setTimeout(tick, TYPE_SPEED);
    } else {
      // Deleting
      el.textContent = phrase.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx++;
        // Always land on "SOULAYMAN 7X" (index 0 and 2)
        if (phraseIdx >= PHRASES.length) phraseIdx = 0;
        setTimeout(tick, PAUSE_START);
        return;
      }
      setTimeout(tick, DELETE_SPEED);
    }
  }

  // Small delay before starting so reveal animation plays first
  setTimeout(tick, 600);
}

/* ── 10. BOTTOM NAV ────────────────────────────────────────── */
function initBottomNav() {
  const nav = document.getElementById('bottomNav');
  if (!nav) return;

  const items = nav.querySelectorAll('.bottom-nav__item');
  const sections = ['hero', 'stack', 'projects', 'contact'];

  // Set active item based on which section is in view
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        items.forEach(item => {
          item.classList.toggle('active', item.dataset.section === id);
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  // Click: smooth scroll + tap ripple
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      // Ripple animation
      item.classList.add('tapped');
      setTimeout(() => item.classList.remove('tapped'), 300);
    });
  });
}

// ═══════════════════════ PROJECT SHOWCASE PARALLAX ═══════════════════════
function initShowcaseParallax() {
  const cards = document.querySelectorAll('.showcase-card');
  
  cards.forEach(card => {
    const floatImg = card.querySelector('.parallax-img');
    if (!floatImg) return;
    
    const speed = parseFloat(floatImg.getAttribute('data-speed')) || 0.05;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Calculate translation based on mouse position relative to center
      const moveX = x * speed;
      const moveY = y * speed;

      floatImg.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
    });

    card.addEventListener('mouseleave', () => {
      // Reset position with smooth transition
      floatImg.style.transform = 'translate(0, 0) scale(1)';
    });
  });
}
document.addEventListener('DOMContentLoaded', initShowcaseParallax);
