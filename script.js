/**
 * Sohan Kharel — Portfolio Scripts & Advanced Mouse Effects
 * Inspired by pratik-prasai.com.np
 * Features:
 * - Cyber Viewfinder Canvas Cursor (Center dot + lerping brackets)
 * - Click Sonar Radar Ripple effect
 * - Fading Particle Trail
 * - Dynamic 3D Card Tilt & Mouse Spotlight Sheen
 * - Live Telemetry UTC Clock
 * - Theme Toggle (Light / Dark)
 * - Section Dot Navigator
 */

document.addEventListener('DOMContentLoaded', () => {
  // ── 1. Live Telemetry UTC Clock ──
  const clockEl = document.getElementById('status-clock');
  function updateClock() {
    if (clockEl) {
      const now = new Date();
      const timeStr = now.toISOString().substring(11, 19) + ' UTC';
      clockEl.textContent = timeStr;
    }
  }
  updateClock();
  setInterval(updateClock, 1000);

  // ── 2. Dynamic Copyright Year ──
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ── 3. Theme Toggle (Light / Dark Mode) ──
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.getElementById('main-body');
  const THEME_KEY = 'sk-portfolio-theme';

  function applyTheme(mode) {
    if (mode === 'dark') {
      body.classList.add('dark-mode');
      body.classList.remove('light-mode');
    } else {
      body.classList.add('light-mode');
      body.classList.remove('dark-mode');
    }
    localStorage.setItem(THEME_KEY, mode);
  }

  const savedTheme = localStorage.getItem(THEME_KEY) || 'light';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = body.classList.contains('dark-mode');
      applyTheme(isDark ? 'light' : 'dark');
    });
  }

  // ── 4. Mobile Menu Navigation ──
  const mobileBtn = document.getElementById('mobile-btn');
  const navLinks = document.getElementById('nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }

  // ── 5. Section Dot Navigation & Active State Tracking ──
  const sections = [
    document.getElementById('hero'),
    document.getElementById('about-sec'),
    document.getElementById('projects-sec'),
    document.getElementById('skills-sec'),
    document.getElementById('labs-sec'),
    document.getElementById('writeups-sec'),
    document.getElementById('contact-sec')
  ].filter(Boolean);

  const dots = document.querySelectorAll('#section-dots .sdot');

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      if (sections[index]) {
        sections[index].scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        dots.forEach(dot => {
          if (dot.getAttribute('data-target') === id) {
            dot.classList.add('active');
          } else {
            dot.classList.remove('active');
          }
        });

        const navAnchor = document.querySelector(`.nav-links a[href="#${id}"]`);
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        if (navAnchor) {
          navAnchor.classList.add('active');
        }
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px'
  });

  sections.forEach(sec => sectionObserver.observe(sec));

  // ── 6. Scroll to Top Button ──
  const scrollTopBtn = document.getElementById('scroll-top-btn');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }, { passive: true });

    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ── 7. Contact Form Handler ──
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      const subject = encodeURIComponent(`Portfolio Inquiry from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

      window.location.href = `mailto:sohankharel@example.com?subject=${subject}&body=${body}`;

      if (formStatus) {
        formStatus.style.color = '#10b981';
        formStatus.textContent = 'Drafting email in your default client...';
      }

      contactForm.reset();
    });
  }

  // ── 8. INTERACTIVE 3D CARD TILT & SPOTLIGHT SHEEN ──
  const cards = document.querySelectorAll('.glass-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Update spotlight position
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);

      // Gentle 3D perspective tilt
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4.5;
      const rotateY = ((x - centerX) / centerX) * 4.5;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.setProperty('--mouse-x', `-300px`);
      card.style.setProperty('--mouse-y', `-300px`);
    });
  });

  // ── 9. ADVANCED CYBER CANVAS CURSOR & EFFECTS ──
  // Only activate custom cursor on fine-pointer devices (mouse/trackpad), not on touch screens
  if (window.matchMedia('(pointer: fine)').matches) {
    body.classList.add('custom-cursor-active');

    const cvs = document.createElement('canvas');
    cvs.id = 'cursor-canvas';
    Object.assign(cvs.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      pointerEvents: 'none',
      zIndex: '2147483647',
      display: 'block'
    });
    document.documentElement.appendChild(cvs);

    const ctx = cvs.getContext('2d');

    function resizeCanvas() {
      cvs.width = window.innerWidth;
      cvs.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    let mx = -200, my = -200;
    let bx = -200, by = -200;
    let isHover = false;
    let ripples = [];
    let particles = [];

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;

      // Spawn trail particle on movement
      if (Math.random() < 0.4) {
        particles.push({
          x: mx,
          y: my,
          vx: (Math.random() - 0.5) * 1.2,
          vy: (Math.random() - 0.5) * 1.2,
          life: 1.0,
          decay: 0.035,
          size: Math.random() * 2.5 + 1.2
        });
      }
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
      mx = -200;
      my = -200;
    });

    // Click Sonar Ripple Pulse
    window.addEventListener('mousedown', (e) => {
      ripples.push({
        x: e.clientX,
        y: e.clientY,
        radius: 4,
        maxRadius: 36,
        alpha: 0.85
      });
    });

    // Hover Target Elements
    const HOVER_SELECTORS = 'a, button, input, textarea, select, .glass-card, .tech-pill, .sdot, .card-badge';
    function updateHoverBindings() {
      document.querySelectorAll(HOVER_SELECTORS).forEach(el => {
        if (el._cursorBound) return;
        el._cursorBound = true;
        el.addEventListener('mouseenter', () => { isHover = true; });
        el.addEventListener('mouseleave', () => { isHover = false; });
      });
    }
    updateHoverBindings();

    // Lerp follow factor
    const LERP = 0.18;

    function getCursorColors() {
      const isDark = body.classList.contains('dark-mode');
      if (isDark) {
        return {
          primary: { r: 99, g: 102, b: 241 },     // Indigo
          accent:  { r: 45, g: 212, b: 191 }      // Electric Teal
        };
      } else {
        return {
          primary: { r: 29, g: 94,  b: 168 },     // Deep Blue
          accent:  { r: 2,  g: 132, b: 199 }      // Vivid Sky Blue
        };
      }
    }

    function drawDot(x, y, hover, colors) {
      const r = hover ? 6 : 4;
      const c = hover ? colors.accent : colors.primary;
      const glow = hover ? 16 : 10;

      // Glow
      const grad = ctx.createRadialGradient(x, y, 0, x, y, glow * 2);
      grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 0.4)`);
      grad.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);
      ctx.beginPath();
      ctx.arc(x, y, glow * 2, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Solid Dot
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgb(${c.r}, ${c.g}, ${c.b})`;
      ctx.fill();
    }

    function drawBrackets(x, y, hover, colors) {
      const size  = hover ? 22 : 15;
      const arm   = hover ? 9  : 6;
      const c     = hover ? colors.accent : colors.primary;
      const alpha = hover ? 0.95 : 0.65;
      const lw    = hover ? 2.0 : 1.5;

      ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${alpha})`;
      ctx.lineWidth = lw;
      ctx.lineCap = 'square';

      const x0 = x - size, y0 = y - size;
      const x1 = x + size, y1 = y + size;

      // Top-Left
      ctx.beginPath(); ctx.moveTo(x0 + arm, y0); ctx.lineTo(x0, y0); ctx.lineTo(x0, y0 + arm); ctx.stroke();
      // Top-Right
      ctx.beginPath(); ctx.moveTo(x1 - arm, y0); ctx.lineTo(x1, y0); ctx.lineTo(x1, y0 + arm); ctx.stroke();
      // Bottom-Left
      ctx.beginPath(); ctx.moveTo(x0, y1 - arm); ctx.lineTo(x0, y1); ctx.lineTo(x0 + arm, y1); ctx.stroke();
      // Bottom-Right
      ctx.beginPath(); ctx.moveTo(x1 - arm, y1); ctx.lineTo(x1, y1); ctx.lineTo(x1, y1 - arm); ctx.stroke();
    }

    function loop() {
      ctx.clearRect(0, 0, cvs.width, cvs.height);

      const colors = getCursorColors();

      // 1. Draw and update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= p.decay;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colors.primary.r}, ${colors.primary.g}, ${colors.primary.b}, ${p.life * 0.4})`;
        ctx.fill();
      }

      // 2. Draw and update click ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 1.8;
        r.alpha -= 0.04;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${colors.accent.r}, ${colors.accent.g}, ${colors.accent.b}, ${r.alpha})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 3. Draw Target Viewfinder and Cursor Dot
      if (mx >= 0 && my >= 0) {
        bx += (mx - bx) * LERP;
        by += (my - by) * LERP;

        drawBrackets(bx, by, isHover, colors);
        drawDot(mx, my, isHover, colors);
      }

      requestAnimationFrame(loop);
    }
    loop();
  }
});
