/* ═══════════════════════════════════════════════════════════════════
   IKM Transport — script.js  (Futuristic v2)
═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── Loader ──────────────────────────────────────────────────────── */
  const loader    = document.getElementById('loader');
  const loaderBar = document.getElementById('loaderBar');
  const loaderPct = document.getElementById('loaderPct');

  let progress = 0;
  const interval = setInterval(function () {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      loaderBar.style.width = '100%';
      loaderPct.textContent  = '100%';
      setTimeout(function () {
        loader.classList.add('hidden');
        document.body.classList.remove('loading');
        animateHeroWords();
        triggerReveal();
        startFlipWords();
      }, 400);
    } else {
      loaderBar.style.width = progress + '%';
      loaderPct.textContent  = Math.floor(progress) + '%';
    }
  }, 80);


  /* ── Header scroll state ─────────────────────────────────────────── */
  const header = document.getElementById('header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 10);
    toggleFabs();
    updateActiveNav();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ── FABs show/hide ──────────────────────────────────────────────── */
  const fabs = document.getElementById('fabs');
  function toggleFabs() {
    fabs.classList.toggle('show', window.scrollY > 120);
  }

  /* ── Mobile drawer ───────────────────────────────────────────────── */
  const burger      = document.getElementById('burger');
  const drawer      = document.getElementById('drawer');
  const drawerClose = document.getElementById('drawerClose');
  const drawerMask  = document.getElementById('drawerMask');

  function openDrawer() {
    drawer.classList.add('open');
    drawerMask.classList.add('open');
    burger.classList.add('open');
    fabs.classList.add('menu-open');
    burger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeDrawer() {
    drawer.classList.remove('open');
    drawerMask.classList.remove('open');
    burger.classList.remove('open');
    fabs.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggleFabs();
  }

  burger.addEventListener('click', function () {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });
  drawerClose.addEventListener('click', closeDrawer);
  drawerMask.addEventListener('click', closeDrawer);
  drawer.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeDrawer);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  /* ── Active nav on scroll ────────────────────────────────────────── */
  const navLinks = document.querySelectorAll('.nav-a');
  const sections = ['home', 'services', 'testimonials', 'about', 'contact'];

  function updateActiveNav() {
    let current = 'home';
    sections.forEach(function (id) {
      const el = document.getElementById(id);
      if (el && window.scrollY >= el.offsetTop - 140) current = id;
    });
    navLinks.forEach(function (link) {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === current);
    });
  }

  /* ── Smooth scroll ───────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ── Hero word-by-word animation ─────────────────────────────────── */
  function animateHeroWords() {
    const words = document.querySelectorAll('.h1-word');
    words.forEach(function (word, i) {
      setTimeout(function () {
        word.classList.add('in');
      }, 100 + i * 90);
    });
  }

  /* ── Word-flip rotation ─────────────────────────────────────────── */
  function startFlipWords() {
    var words = document.querySelectorAll('.flip-word');
    if (!words.length) return;
    var idx = 0;
    setInterval(function () {
      words[idx].classList.remove('active');
      idx = (idx + 1) % words.length;
      words[idx].classList.add('active');
    }, 2500);
  }

  /* ── Scroll reveal (IntersectionObserver) ────────────────────────── */
  function triggerReveal() {
    const revealEls = document.querySelectorAll('[data-reveal]');
    if (!('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('revealed'); });
      return;
    }
    const obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { obs.observe(el); });
  }

  /* ── Animated number counter ─────────────────────────────────────── */
  const counters = document.querySelectorAll('.counter');

  function animateCounter(el) {
    const target   = parseInt(el.getAttribute('data-to'), 10);
    const duration = 1800;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    const counterObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(function (el) { counterObs.observe(el); });
  }

  /* ── Parallax on hero photo ──────────────────────────────────────── */
  const heroPhoto = document.getElementById('heroPhoto');
  if (heroPhoto) {
    window.addEventListener('scroll', function () {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroPhoto.style.transform = 'scale(1.06) translateY(' + (scrolled * 0.18) + 'px)';
      }
    }, { passive: true });
  }

  /* ── Quote form → WhatsApp ───────────────────────────────────────── */
  const quoteForm = document.getElementById('quoteForm');
  if (quoteForm) {
    quoteForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name    = document.getElementById('fname').value.trim();
      const phone   = document.getElementById('fphone').value.trim();
      const city    = document.getElementById('fcity').value;
      const service = document.getElementById('fservice').value;
      const msg     = document.getElementById('fmsg').value.trim();

      if (!name) { document.getElementById('fname').focus(); return; }
      if (!phone) { document.getElementById('fphone').focus(); return; }

      const text = encodeURIComponent(
        'Hello IKM Transport,\n\n' +
        'Name: '    + name    + '\n' +
        'Phone: '   + phone   + '\n' +
        'City: '    + city    + '\n' +
        'Service: ' + service + '\n' +
        'Details: ' + (msg || 'No additional details provided.') + '\n\n' +
        'Please provide a quote. Thank you.'
      );

      window.open('https://wa.me/971567094916?text=' + text, '_blank');
    });
  }

  /* ── Stagger service cards ───────────────────────────────────────── */
  document.querySelectorAll('.svc-card').forEach(function (card, i) {
    card.setAttribute('data-delay', String(i + 1));
  });

  /* ── Add tilt effect on service cards (desktop only) ─────────────── */
  if (window.matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.svc-card').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        const rect   = card.getBoundingClientRect();
        const x      = (e.clientX - rect.left) / rect.width  - 0.5;
        const y      = (e.clientY - rect.top)  / rect.height - 0.5;
        card.style.transform = 'translateY(-8px) rotateX(' + (-y * 6) + 'deg) rotateY(' + (x * 6) + 'deg)';
      });
      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  /* ── Marquee pause on hover ──────────────────────────────────────── */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('mouseenter', function () {
      marqueeTrack.style.animationPlayState = 'paused';
    });
    marqueeTrack.addEventListener('mouseleave', function () {
      marqueeTrack.style.animationPlayState = 'running';
    });
  }

  /* ── Header red line glow on scroll position ─────────────────────── */
  const headerLine = document.querySelector('.header-line');
  if (headerLine) {
    window.addEventListener('scroll', function () {
      const pct = Math.min(window.scrollY / 300, 1);
      headerLine.style.opacity = 0.3 + pct * 0.7;
    }, { passive: true });
  }

})();
