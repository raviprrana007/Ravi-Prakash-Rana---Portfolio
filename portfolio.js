'use strict';

    /* ------------------------------------------
       SCROLL PROGRESS BAR
    ------------------------------------------ */
    const scrollBar = document.getElementById('scroll-progress');
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct = (window.scrollY / total) * 100;
      scrollBar.style.width = pct + '%';
    }, { passive: true });

    /* ------------------------------------------
       NAVBAR SCROLL EFFECT
    ------------------------------------------ */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    /* ------------------------------------------
       MOBILE MENU
    ------------------------------------------ */
    const navToggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');

    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navToggle.classList.remove('open');
        mobileMenu.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });

    /* ------------------------------------------
       TYPEWRITER EFFECT
    ------------------------------------------ */
    const phrases = [
      'Second-Year CS Student',
      'Python Programmer',
      'Web Developer in Training',
      'AI Enthusiast',
      'Problem Solver',
    ];
    const tw = document.getElementById('typewriter-text');
    let pIdx = 0, cIdx = 0, deleting = false, paused = false;

    function typeLoop() {
      const current = phrases[pIdx];
      if (paused) { setTimeout(typeLoop, 1800); paused = false; return; }

      if (!deleting) {
        tw.textContent = current.slice(0, ++cIdx);
        if (cIdx === current.length) { paused = true; deleting = true; }
        setTimeout(typeLoop, 80);
      } else {
        tw.textContent = current.slice(0, --cIdx);
        if (cIdx === 0) { deleting = false; pIdx = (pIdx + 1) % phrases.length; }
        setTimeout(typeLoop, 40);
      }
    }
    typeLoop();

    /* ------------------------------------------
       TERMINAL CURSOR BLINK (terminal section)
    ------------------------------------------ */
    const termCursor = document.getElementById('terminal-cursor');
    setInterval(() => {
      termCursor.style.opacity = termCursor.style.opacity === '0' ? '1' : '0';
    }, 600);

    /* ------------------------------------------
       SCROLL REVEAL (IntersectionObserver)
    ------------------------------------------ */
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => revealObserver.observe(el));

    /* ------------------------------------------
       3D TILT on PROJECT CARDS
    ------------------------------------------ */
    document.querySelectorAll('.project-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const rx = ((e.clientY - cy) / (rect.height / 2)) * 6;
        const ry = ((e.clientX - cx) / (rect.width / 2)) * -6;
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-5px)`;
        card.style.boxShadow = `0 30px 70px rgba(0,0,0,0.5), 0 0 40px rgba(0,232,255,0.08)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });

    /* ------------------------------------------
       BACKGROUND PARTICLE CANVAS
    ------------------------------------------ */
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let W, H;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const PARTICLE_COUNT = window.innerWidth < 600 ? 40 : 80;

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.5 + 0.3,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      a: Math.random() * 0.6 + 0.1,
    }));

    // Star/connection lines
    function drawParticles() {
      ctx.clearRect(0, 0, W, H);

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(0,232,255,${0.07 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw dots
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,232,255,${p.a})`;
        ctx.fill();

        // Move
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
      });

      requestAnimationFrame(drawParticles);
    }
    drawParticles();

    /* ------------------------------------------
       SMOOTH SCROLL (backup for older browsers)
    ------------------------------------------ */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
