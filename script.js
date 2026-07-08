

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
  initHeroCardTilt();
  initStatCounters();
});

/* ── 1. STICKY HEADER + SLIDING NAV INDICATOR ─────────────── */
function initHeader() {
  const header = document.getElementById('header');
  const slider = document.getElementById('navSlider');
  const navLinks = document.querySelectorAll('.nav__island-inner .nav__link');
  const sections = ['stack', 'services', 'projects', 'contact'];

  // Glassmorphism on scroll
  window.addEventListener('scroll', () => {
    header.classList.toggle('header--scrolled', window.scrollY > 60);
  }, { passive: true });

  // Move slider to a specific link
  function moveSlider(link) {
    if (!slider || !link) return;
    const parent = link.parentElement;
    const parentRect = parent.getBoundingClientRect();
    const linkRect = link.getBoundingClientRect();

    slider.style.left = (linkRect.left - parentRect.left) + 'px';
    slider.style.width = linkRect.width + 'px';
    slider.classList.add('visible');
  }

  // Clear slider
  function hideSlider() {
    if (!slider) return;
    slider.classList.remove('visible');
  }

  // Track active section
  let activeLink = null;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const isActive = link.getAttribute('data-section') === id;
          link.classList.toggle('active', isActive);
          if (isActive) {
            activeLink = link;
            moveSlider(link);
          }
        });
      }
    });
  }, { threshold: 0.3 });

  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el) observer.observe(el);
  });

  // Initially hide slider (no section in view at top)
  if (slider) {
    window.addEventListener('scroll', () => {
      if (window.scrollY < 200) {
        navLinks.forEach(l => l.classList.remove('active'));
        hideSlider();
        activeLink = null;
      }
    }, { passive: true });
  }

  // Hover effect: temporarily move slider, return on leave
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      moveSlider(link);
    });
    link.addEventListener('mouseleave', () => {
      if (activeLink) {
        moveSlider(activeLink);
      } else {
        hideSlider();
      }
    });
  });

  // Recalculate on resize
  window.addEventListener('resize', () => {
    if (activeLink) moveSlider(activeLink);
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
  // Stack chips — no progress bars to animate
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
        // Always land on "SOULAYMAN" (index 0 and 2)
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
  const sections = ['hero', 'stack', 'services', 'projects', 'contact'];

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
      const moveX = x * speed;
      const moveY = y * speed;
      floatImg.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
    });

    card.addEventListener('mouseleave', () => {
      floatImg.style.transform = 'translate(0, 0) scale(1)';
    });
  });
}
document.addEventListener('DOMContentLoaded', initShowcaseParallax);

// ═══════════════════════ PROJECT IMAGE SLIDER ═══════════════════════
function initProjectSliders() {
  // Find all sliders on the page
  const sliders = document.querySelectorAll('.proj-slider');
  
  sliders.forEach(slider => {
    const slides = slider.querySelectorAll('.proj-slider__slide');
    const dotsContainer = slider.querySelector('.proj-slider__dots');
    const prevBtn = slider.querySelector('.proj-slider__btn--prev');
    const nextBtn = slider.querySelector('.proj-slider__btn--next');
    
    if (!slides.length) return;
    
    let current = 0;
    let autoTimer = null;

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'proj-slider__dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      if (dotsContainer) dotsContainer.appendChild(dot);
    });

    function getDots() {
      return dotsContainer ? dotsContainer.querySelectorAll('.proj-slider__dot') : [];
    }

    function goTo(idx) {
      slides[current].classList.remove('active');
      getDots()[current]?.classList.remove('active');
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('active');
      getDots()[current]?.classList.add('active');
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAuto(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAuto(); });

    // Auto-advance every 3.5s
    function startAuto() {
      autoTimer = setInterval(next, 3500);
    }
    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }
    startAuto();

    // Pause on hover / touch
    slider.addEventListener('mouseenter', () => clearInterval(autoTimer));
    slider.addEventListener('mouseleave', startAuto);

    // Touch/swipe support
    let touchStartX = 0;
    slider.addEventListener('touchstart', e => {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    slider.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        dx < 0 ? next() : prev();
        resetAuto();
      }
    }, { passive: true });
  });
}
document.addEventListener('DOMContentLoaded', initProjectSliders);

// ═══════════════════════ SERVICE CARDS 3D TILT ═══════════════════════
function initServiceCards() {
  const cards = document.querySelectorAll('.svc-card');
  
  cards.forEach(card => {
    const inner = card.querySelector('.svc-card__inner');
    if (!inner) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;
      
      inner.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      inner.style.transform = 'perspective(800px) rotateX(0) rotateY(0)';
      inner.style.transition = 'transform 0.5s ease';
      setTimeout(() => { inner.style.transition = ''; }, 500);
    });

    card.addEventListener('mouseenter', () => {
      inner.style.transition = 'none';
    });
  });
}
document.addEventListener('DOMContentLoaded', initServiceCards);

// ═══════════════════════ HERO CARD 3D TILT ═══════════════════════
function initHeroCardTilt() {
  const wrap = document.getElementById('heroCard');
  if (!wrap) return;
  const card = wrap.querySelector('.hero__visual-card');
  if (!card) return;

  wrap.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const rotateX = ((y - cy) / cy) * -8;
    const rotateY = ((x - cx) / cx) * 8;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.transition = 'none';
  });

  wrap.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    card.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
  });
}

// ═══════════════════════ STAT COUNTER ANIMATION ═══════════════════════
function initStatCounters() {
  const nums = document.querySelectorAll('.hero__stat-num[data-target]');
  if (!nums.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.getAttribute('data-target'));
        const duration = 1600;
        const start = performance.now();

        function animate(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(target * eased);
          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            el.textContent = target;
          }
        }
        requestAnimationFrame(animate);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  nums.forEach(num => observer.observe(num));
}
