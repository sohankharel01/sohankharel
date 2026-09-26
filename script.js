/**
 * Sohan Kharel — Cybersecurity Portfolio Scripts
 * Ultra-Clean Minimalism & Interactive 3D Telemetry
 * Features:
 * - True 3D Floating Avatar Engine (Physics, mouse tracking, touch drag, device orientation)
 * - Generative Interactive Voronoi Mesh with Cursor Seeds & Shockwave Pulses
 * - Viewfinder Canvas Cursor (desktop pointer: fine only)
 * - Dynamic 3D Card Tilt & Interactive Light Spotlight Sheen
 * - Live Telemetry UTC Clock
 * - Light / Dark Minimalist Theme Switcher with SVG Icons
 * - Section Dot Navigator (Desktop)
 * - Mobile Touch-Friendly Navigation Drawer
 * - WhatsApp Direct Inquiry Form
 * - Live GitHub Profile & Repositories Telemetry
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

  // ── 4. Mobile Menu Navigation (Drawer & Outside-Click Close) ──
  const mobileBtn = document.getElementById('mobile-btn');
  const navLinks = document.getElementById('nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('open');
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!navLinks.contains(e.target) && !mobileBtn.contains(e.target)) {
        navLinks.classList.remove('open');
      }
    });
  }

  // ── 5. Section Dot Navigation & Active State Tracking ──
  const sections = [
    document.getElementById('hero'),
    document.getElementById('about-sec'),
    document.getElementById('projects-sec'),
    document.getElementById('skills-sec'),
    document.getElementById('cert-sec'),
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

  // ── 7. WhatsApp Contact Handler ──
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();

      const waText = encodeURIComponent(
        `Hi Sohan, my name is ${name} (${email}):\n\n${message}\n\n[Inquiry via Portfolio Website]`
      );
      // WhatsApp Click-to-Chat endpoint (+977 Nepal default)
      const waUrl = `https://wa.me/9779800000000?text=${waText}`;

      if (formStatus) {
        formStatus.style.color = '#10b981';
        formStatus.textContent = 'Redirecting to WhatsApp to send your message...';
      }

      window.open(waUrl, '_blank', 'noopener,noreferrer');
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

  // ── 9. ADVANCED CYBER CANVAS CURSOR & EFFECTS (DESKTOP FINE POINTER ONLY) ──
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
          primary: { r: 250, g: 250, b: 250 },     // Titanium Chalk
          accent:  { r: 16,  g: 185, b: 129 }      // Minimal Emerald
        };
      } else {
        return {
          primary: { r: 9,   g: 9,   b: 11  },     // Deep Ink
          accent:  { r: 5,   g: 150, b: 105 }      // Forest Emerald
        };
      }
    }

    function drawDot(x, y, hover, colors) {
      const r = hover ? 6 : 4;
      const c = hover ? colors.accent : colors.primary;
      const glow = hover ? 16 : 10;

      // Glow
      const grad = ctx.createRadialGradient(x, y, 0, x, y, glow * 2);
      grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 0.35)`);
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

  // ── 10. GENERATIVE VORONOI MESH CANVAS & 3D FLOATING AVATAR ENGINE ──
  const voronoiCanvas = document.getElementById('voronoi-mesh-canvas');
  const heroSection = document.getElementById('hero');
  const avatarStage = document.getElementById('avatar-3d-stage');
  const avatarWrapper = document.getElementById('avatar-3d-wrapper');

  if (voronoiCanvas && heroSection) {
    const vctx = voronoiCanvas.getContext('2d');
    let vWidth = 0, vHeight = 0;
    let isHeroActive = true;

    function resizeVoronoi() {
      const rect = heroSection.getBoundingClientRect();
      vWidth = voronoiCanvas.width = rect.width;
      vHeight = voronoiCanvas.height = rect.height;
    }
    resizeVoronoi();
    window.addEventListener('resize', resizeVoronoi);

    // Pause animation when hero is off-screen to preserve CPU
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isHeroActive = entry.isIntersecting;
      });
    }, { threshold: 0.05 });
    heroObserver.observe(heroSection);

    // Generate floating seed sites for Voronoi cells
    const POINT_COUNT = 34;
    const points = [];
    for (let i = 0; i < POINT_COUNT; i++) {
      points.push({
        x: Math.random() * (vWidth || 900),
        y: Math.random() * (vHeight || 600),
        vx: (Math.random() - 0.5) * 0.55,
        vy: (Math.random() - 0.5) * 0.55,
        ox: 0,
        oy: 0
      });
    }

    // Hero cursor & touch tracking
    let vMouseX = -1000, vMouseY = -1000;
    let mouseSpeed = 0;
    let isPointerOverHero = false;

    // 3D Avatar state variables
    let currentRotX = 0, currentRotY = 0, currentRotZ = 0, currentTransZ = 0;
    let targetRotX = 0, targetRotY = 0, targetRotZ = 0, targetTransZ = 0;
    let currentLightX = 50, currentLightY = 40;
    let targetLightX = 50, targetLightY = 40;

    // Desktop Mouse Tracking
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const nx = e.clientX - rect.left;
      const ny = e.clientY - rect.top;

      if (vMouseX > 0) {
        const mdx = nx - vMouseX;
        const mdy = ny - vMouseY;
        mouseSpeed = Math.min(Math.sqrt(mdx * mdx + mdy * mdy), 25);
      }
      vMouseX = nx;
      vMouseY = ny;
      isPointerOverHero = true;

      // Update 3D avatar rotation target relative to avatar center
      if (avatarStage) {
        const sRect = avatarStage.getBoundingClientRect();
        const cx = sRect.left + sRect.width / 2;
        const cy = sRect.top + sRect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const span = Math.max(sRect.width * 0.8, 220);
        targetRotY = Math.max(-24, Math.min(24, (dx / span) * 20));
        targetRotX = Math.max(-24, Math.min(24, -(dy / span) * 20));
        targetRotZ = Math.max(-5, Math.min(5, (dx / span) * -3));
        targetTransZ = Math.max(0, 36 - (dist / 18));

        targetLightX = Math.max(15, Math.min(85, 50 + (dx / 320) * 35));
        targetLightY = Math.max(15, Math.min(85, 40 + (dy / 320) * 35));
      }
    }, { passive: true });

    heroSection.addEventListener('mouseleave', () => {
      vMouseX = -1000;
      vMouseY = -1000;
      mouseSpeed = 0;
      isPointerOverHero = false;
      targetRotX = 0;
      targetRotY = 0;
      targetRotZ = 0;
      targetTransZ = 0;
      targetLightX = 50;
      targetLightY = 40;
    });

    // Shockwave click pulses
    const clickPulses = [];
    heroSection.addEventListener('mousedown', (e) => {
      const rect = heroSection.getBoundingClientRect();
      clickPulses.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 10,
        maxRadius: 280,
        strength: 8.0,
        alpha: 0.9
      });
    });

    // Touch Support for Mobile (Voronoi interaction + 3D Avatar Tilt)
    heroSection.addEventListener('touchstart', (e) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        const rect = heroSection.getBoundingClientRect();
        vMouseX = t.clientX - rect.left;
        vMouseY = t.clientY - rect.top;
        isPointerOverHero = true;

        clickPulses.push({
          x: vMouseX,
          y: vMouseY,
          radius: 8,
          maxRadius: 220,
          strength: 6.0,
          alpha: 0.85
        });

        if (avatarStage) {
          const sRect = avatarStage.getBoundingClientRect();
          const cx = sRect.left + sRect.width / 2;
          const cy = sRect.top + sRect.height / 2;
          const dx = t.clientX - cx;
          const dy = t.clientY - cy;
          targetRotY = Math.max(-20, Math.min(20, (dx / 150) * 18));
          targetRotX = Math.max(-20, Math.min(20, -(dy / 150) * 18));
          targetTransZ = 20;
        }
      }
    }, { passive: true });

    heroSection.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        const rect = heroSection.getBoundingClientRect();
        vMouseX = t.clientX - rect.left;
        vMouseY = t.clientY - rect.top;

        if (avatarStage) {
          const sRect = avatarStage.getBoundingClientRect();
          const cx = sRect.left + sRect.width / 2;
          const cy = sRect.top + sRect.height / 2;
          const dx = t.clientX - cx;
          const dy = t.clientY - cy;
          targetRotY = Math.max(-22, Math.min(22, (dx / 160) * 20));
          targetRotX = Math.max(-22, Math.min(22, -(dy / 160) * 20));
          targetTransZ = 24;
        }
      }
    }, { passive: true });

    heroSection.addEventListener('touchend', () => {
      vMouseX = -1000;
      vMouseY = -1000;
      isPointerOverHero = false;
      targetRotX = 0;
      targetRotY = 0;
      targetTransZ = 0;
    }, { passive: true });

    // Gyroscope / Device Orientation Support on Mobile Phones
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', (e) => {
        if (e.gamma !== null && e.beta !== null && !isPointerOverHero) {
          targetRotY = Math.max(-22, Math.min(22, e.gamma * 0.65));
          targetRotX = Math.max(-22, Math.min(22, (e.beta - 45) * 0.65));
        }
      }, { passive: true });
    }

    // Circumcircle calculation for Bowyer-Watson Delaunay Triangulation
    function getCircumcenter(a, b, c) {
      const d = 2 * (a.x * (b.y - c.y) + b.x * (c.y - a.y) + c.x * (a.y - b.y));
      if (Math.abs(d) < 1e-7) return null;
      const a2 = a.x * a.x + a.y * a.y;
      const b2 = b.x * b.x + b.y * b.y;
      const c2 = c.x * c.x + c.y * c.y;
      const cx = (a2 * (b.y - c.y) + b2 * (c.y - a.y) + c2 * (a.y - b.y)) / d;
      const cy = (a2 * (c.x - b.x) + b2 * (a.x - c.x) + c2 * (b.x - a.x)) / d;
      const r2 = (cx - a.x) * (cx - a.x) + (cy - a.y) * (cy - a.y);
      return { x: cx, y: cy, r2 };
    }

    // Bowyer-Watson 2D Delaunay Triangulation
    function triangulate(pts, w, h) {
      const m = Math.max(w, h) * 4;
      const p0 = { x: w / 2, y: -m, isSuper: true };
      const p1 = { x: -m, y: h * 2, isSuper: true };
      const p2 = { x: w + m, y: h * 2, isSuper: true };

      const c0 = getCircumcenter(p0, p1, p2);
      let triangles = [{ a: p0, b: p1, c: p2, cc: c0 }];

      for (let i = 0; i < pts.length; i++) {
        const p = pts[i];
        const badTriangles = [];

        for (let j = 0; j < triangles.length; j++) {
          const t = triangles[j];
          if (!t.cc) continue;
          const d2 = (t.cc.x - p.x) * (t.cc.x - p.x) + (t.cc.y - p.y) * (t.cc.y - p.y);
          if (d2 <= t.cc.r2) {
            badTriangles.push(t);
          }
        }

        const polygon = [];
        for (let j = 0; j < badTriangles.length; j++) {
          const t = badTriangles[j];
          const edges = [
            { a: t.a, b: t.b },
            { a: t.b, b: t.c },
            { a: t.c, b: t.a }
          ];

          for (let e = 0; e < 3; e++) {
            const edge = edges[e];
            let shared = false;
            for (let k = 0; k < badTriangles.length; k++) {
              if (j === k) continue;
              const other = badTriangles[k];
              const oEdges = [
                { a: other.a, b: other.b },
                { a: other.b, b: other.c },
                { a: other.c, b: other.a }
              ];
              for (let oe = 0; oe < 3; oe++) {
                if (
                  (oEdges[oe].a === edge.a && oEdges[oe].b === edge.b) ||
                  (oEdges[oe].a === edge.b && oEdges[oe].b === edge.a)
                ) {
                  shared = true;
                  break;
                }
              }
              if (shared) break;
            }
            if (!shared) polygon.push(edge);
          }
        }

        for (let j = 0; j < badTriangles.length; j++) {
          const idx = triangles.indexOf(badTriangles[j]);
          if (idx !== -1) triangles.splice(idx, 1);
        }

        for (let j = 0; j < polygon.length; j++) {
          const edge = polygon[j];
          const cc = getCircumcenter(edge.a, edge.b, p);
          if (cc) {
            triangles.push({ a: edge.a, b: edge.b, c: p, cc });
          }
        }
      }

      return triangles.filter(t => !t.a.isSuper && !t.b.isSuper && !t.c.isSuper);
    }

    // Avatar mesh anchor points (tracking avatar silhouette in canvas space)
    function getAvatarNodes() {
      if (!avatarStage) return [];
      const hRect = heroSection.getBoundingClientRect();
      const aRect = avatarStage.getBoundingClientRect();
      const cx = aRect.left - hRect.left + aRect.width / 2;
      const cy = aRect.top - hRect.top + aRect.height / 2;
      const r = Math.min(aRect.width, aRect.height) * 0.44;

      // Dynamic anchors encircling the 3D avatar silhouette
      return [
        { x: cx, y: cy - r * 0.95, isAvatar: true },
        { x: cx - r * 0.70, y: cy - r * 0.45, isAvatar: true },
        { x: cx + r * 0.70, y: cy - r * 0.45, isAvatar: true },
        { x: cx - r * 0.92, y: cy + r * 0.35, isAvatar: true },
        { x: cx + r * 0.92, y: cy + r * 0.35, isAvatar: true },
        { x: cx, y: cy + r * 0.92, isAvatar: true }
      ];
    }

    // Smooth Lerp Physics for 3D Avatar
    const LERP_AVATAR = 0.08;
    function updateAvatar3D(time) {
      if (!avatarWrapper) return;

      // Organic idle floating physics when not directly interacting
      const idleFloatY = Math.sin(time * 0.002) * 7.5;
      const idlePitch  = Math.sin(time * 0.0016) * 3;
      const idleYaw    = Math.cos(time * 0.0012) * 3.5;

      currentRotX += (targetRotX + (isPointerOverHero ? 0 : idlePitch) - currentRotX) * LERP_AVATAR;
      currentRotY += (targetRotY + (isPointerOverHero ? 0 : idleYaw) - currentRotY) * LERP_AVATAR;
      currentRotZ += (targetRotZ - currentRotZ) * LERP_AVATAR;
      currentTransZ += (targetTransZ - currentTransZ) * LERP_AVATAR;

      currentLightX += (targetLightX - currentLightX) * LERP_AVATAR;
      currentLightY += (targetLightY - currentLightY) * LERP_AVATAR;

      avatarWrapper.style.transform = `perspective(1100px) translateY(${idleFloatY.toFixed(2)}px) translateZ(${currentTransZ.toFixed(2)}px) rotateX(${currentRotX.toFixed(2)}deg) rotateY(${currentRotY.toFixed(2)}deg) rotateZ(${currentRotZ.toFixed(2)}deg)`;
      avatarWrapper.style.setProperty('--avatar-light-x', `${currentLightX.toFixed(1)}%`);
      avatarWrapper.style.setProperty('--avatar-light-y', `${currentLightY.toFixed(1)}%`);
    }

    function renderVoronoi(now) {
      if (isHeroActive) {
        // Update 3D avatar physics
        updateAvatar3D(now);

        vctx.clearRect(0, 0, vWidth, vHeight);
        const isDark = body.classList.contains('dark-mode');

        // Minimal Palette: Carbon, Chalk, Minimal Emerald (NO purple, NO blue)
        const strokeVoronoi     = isDark ? 'rgba(16, 185, 129, 0.28)' : 'rgba(16, 185, 129, 0.24)';
        const strokeDelaunay    = isDark ? 'rgba(255, 255, 255, 0.07)' : 'rgba(0, 0, 0, 0.05)';
        const nodeColor         = isDark ? 'rgba(16, 185, 129, 0.85)' : 'rgba(5, 150, 105, 0.80)';
        const nodeGlow          = isDark ? 'rgba(16, 185, 129, 0.35)' : 'rgba(16, 185, 129, 0.22)';
        const activeHoverFill   = isDark ? 'rgba(16, 185, 129, 0.08)' : 'rgba(16, 185, 129, 0.06)';
        const activeHoverStroke = isDark ? 'rgba(52, 211, 153, 0.65)' : 'rgba(5, 150, 105, 0.55)';

        // 1. Process click shockwave pulses
        for (let i = clickPulses.length - 1; i >= 0; i--) {
          const cp = clickPulses[i];
          cp.radius += 7.0;
          cp.alpha -= 0.025;

          if (cp.alpha <= 0 || cp.radius >= cp.maxRadius) {
            clickPulses.splice(i, 1);
            continue;
          }

          // Draw shockwave ring
          vctx.beginPath();
          vctx.arc(cp.x, cp.y, cp.radius, 0, Math.PI * 2);
          vctx.strokeStyle = `rgba(16, 185, 129, ${cp.alpha * 0.45})`;
          vctx.lineWidth = 1.5;
          vctx.stroke();

          // Push points along the shockwave
          for (let p of points) {
            const pdx = p.x - cp.x;
            const pdy = p.y - cp.y;
            const pdist = Math.sqrt(pdx * pdx + pdy * pdy);
            if (Math.abs(pdist - cp.radius) < 35 && pdist > 1) {
              p.x += (pdx / pdist) * cp.strength * cp.alpha;
              p.y += (pdy / pdist) * cp.strength * cp.alpha;
            }
          }
        }

        // 2. Update points drift & mouse repulsion physics
        for (let i = 0; i < points.length; i++) {
          const p = points[i];
          p.x += p.vx;
          p.y += p.vy;

          // Bounce smoothly on canvas boundaries
          if (p.x < 15) { p.x = 15; p.vx = Math.abs(p.vx); }
          if (p.x > vWidth - 15) { p.x = vWidth - 15; p.vx = -Math.abs(p.vx); }
          if (p.y < 15) { p.y = 15; p.vy = Math.abs(p.vy); }
          if (p.y > vHeight - 15) { p.y = vHeight - 15; p.vy = -Math.abs(p.vy); }

          // Responsive mouse/touch interaction: dynamic elastic deflection
          if (vMouseX > 0 && vMouseY > 0) {
            const dx = p.x - vMouseX;
            const dy = p.y - vMouseY;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const influenceRadius = 180 + mouseSpeed * 3;

            if (dist < influenceRadius && dist > 1) {
              const force = ((influenceRadius - dist) / influenceRadius) * 2.2;
              p.x += (dx / dist) * force;
              p.y += (dy / dist) * force;
            }
          }
        }

        // 3. Assemble active triangulation points: floating seeds + avatar nodes + cursor seed
        const activeSeeds = [...points];
        const avatarNodes = getAvatarNodes();
        avatarNodes.forEach(an => activeSeeds.push(an));

        // Inject cursor as a dynamic Voronoi seed when inside hero
        const isCursorActive = (vMouseX > 0 && vMouseY > 0);
        if (isCursorActive) {
          activeSeeds.push({ x: vMouseX, y: vMouseY, isCursor: true });
        }

        // 4. Compute Delaunay Triangulation
        const triangles = triangulate(activeSeeds, vWidth, vHeight);

        // 5. Draw Delaunay Wireframe Mesh & Highlight cells connected to cursor
        for (let i = 0; i < triangles.length; i++) {
          const t = triangles[i];
          const hasCursor = (t.a.isCursor || t.b.isCursor || t.c.isCursor);

          vctx.beginPath();
          vctx.moveTo(t.a.x, t.a.y);
          vctx.lineTo(t.b.x, t.b.y);
          vctx.lineTo(t.c.x, t.c.y);
          vctx.closePath();

          if (hasCursor) {
            vctx.fillStyle = activeHoverFill;
            vctx.fill();
            vctx.strokeStyle = activeHoverStroke;
            vctx.lineWidth = 1.4;
          } else {
            vctx.strokeStyle = strokeDelaunay;
            vctx.lineWidth = 1.0;
          }
          vctx.stroke();
        }

        // 6. Draw Voronoi Cell Boundaries (connecting triangle circumcenters)
        vctx.beginPath();
        vctx.strokeStyle = strokeVoronoi;
        vctx.lineWidth = 1.5;
        for (let i = 0; i < triangles.length; i++) {
          const t1 = triangles[i];
          if (!t1.cc) continue;

          for (let j = i + 1; j < triangles.length; j++) {
            const t2 = triangles[j];
            if (!t2.cc) continue;

            let sharedCount = 0;
            if (t1.a === t2.a || t1.a === t2.b || t1.a === t2.c) sharedCount++;
            if (t1.b === t2.a || t1.b === t2.b || t1.b === t2.c) sharedCount++;
            if (t1.c === t2.a || t1.c === t2.b || t1.c === t2.c) sharedCount++;

            if (sharedCount >= 2) {
              vctx.moveTo(t1.cc.x, t1.cc.y);
              vctx.lineTo(t2.cc.x, t2.cc.y);
            }
          }
        }
        vctx.stroke();

        // 7. Draw Dynamic Cyber Connective Filaments to Avatar Nodes
        if (avatarNodes.length > 0 && isCursorActive) {
          for (let an of avatarNodes) {
            const adx = vMouseX - an.x;
            const ady = vMouseY - an.y;
            const adist = Math.sqrt(adx * adx + ady * ady);

            // Connect when cursor is within 380px of the avatar
            if (adist < 380) {
              const alpha = (1 - adist / 380) * 0.45;
              vctx.beginPath();
              vctx.moveTo(vMouseX, vMouseY);
              vctx.lineTo(an.x, an.y);
              vctx.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
              vctx.lineWidth = 1.2;
              vctx.stroke();
            }
          }
        }

        // 8. Draw Glowing Voronoi Seed Nodes & Avatar Connectors
        for (let i = 0; i < activeSeeds.length; i++) {
          const p = activeSeeds[i];
          if (p.isCursor) continue;

          const isAv = p.isAvatar;
          const haloSize = isAv ? 6.5 : 5.0;
          const coreSize = isAv ? 3.0 : 2.4;

          // Outer halo
          vctx.beginPath();
          vctx.arc(p.x, p.y, haloSize, 0, Math.PI * 2);
          vctx.fillStyle = isAv ? 'rgba(52, 211, 153, 0.45)' : nodeGlow;
          vctx.fill();

          // Core dot
          vctx.beginPath();
          vctx.arc(p.x, p.y, coreSize, 0, Math.PI * 2);
          vctx.fillStyle = isAv ? '#10b981' : nodeColor;
          vctx.fill();
        }
      }
      requestAnimationFrame(renderVoronoi);
    }
    requestAnimationFrame(renderVoronoi);
  }

  // ── 11. LIVE GITHUB TELEMETRY AUTO-SYNC ──
  const GITHUB_USERNAME = 'sohankharel01';
  async function syncGitHubTelemetry() {
    try {
      const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=10`);
      if (!res.ok) return;
      const repos = await res.json();
      if (Array.isArray(repos) && repos.length > 0) {
        const syncSub = document.querySelector('.sync-sub');
        if (syncSub) {
          syncSub.textContent = `${repos.length} Public Repositories synchronized with @${GITHUB_USERNAME}`;
        }
      }
    } catch {
      // Fallback cleanly to static content if offline or rate limited
    }
  }
  syncGitHubTelemetry();
});
