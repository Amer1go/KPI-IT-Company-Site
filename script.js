document.addEventListener('DOMContentLoaded', () => {
  const pageLoader = document.getElementById('pageLoader');

  function hideLoader(immediate = false) {
    if (!pageLoader) {
      document.body.classList.remove('loading');
      return;
    }

    if (immediate) {
      pageLoader.remove();
      document.body.classList.remove('loading');
      return;
    }

    pageLoader.classList.add('hidden');
    setTimeout(() => {
      if (pageLoader && pageLoader.parentNode) pageLoader.parentNode.removeChild(pageLoader);
    }, 450);
    document.body.classList.remove('loading');
  }

  window.addEventListener('load', () => hideLoader(false));
  setTimeout(() => {
    if (document.getElementById('pageLoader')) hideLoader(false);
  }, 5000);
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  const root = document.documentElement;
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  let theme = stored || (prefersDark ? 'dark' : 'light');
  applyTheme(theme);

  const themeBtn = document.getElementById('themeToggle');
  if (themeBtn) {
    setThemeButtonState(themeBtn, theme);
    themeBtn.addEventListener('click', () => {
      theme = (root.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
      localStorage.setItem('theme', theme);
      applyTheme(theme);
      setThemeButtonState(themeBtn, theme);
    });
  }

  function applyTheme(t) {
    root.setAttribute('data-theme', t === 'dark' ? 'dark' : 'light');

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      root.style.transition = 'background-color .25s ease, color .25s ease';
      setTimeout(() => root.style.transition = '', 300);
    }
  }

  function setThemeButtonState(btn, t) {
    btn.setAttribute('aria-pressed', t === 'dark' ? 'true' : 'false');
  }

  window.toggleMobileMenu = function toggleMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const toggle = document.querySelector('.menu-toggle');
    if (!mobileNav || !toggle) return;
    const opened = mobileNav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(opened));
    mobileNav.setAttribute('aria-hidden', String(!opened));

    if (opened) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  window.closeMobileMenu = function closeMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const toggle = document.querySelector('.menu-toggle');
    if (!mobileNav || !toggle) return;
    mobileNav.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  let io;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.fade-up, .service-card, .service-item')
      .forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.fade-up, .service-card, .service-item')
      .forEach(el => el.classList.add('in', 'visible'));
  }

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 72;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
        closeMobileMenu();
      }
    });
  });

  (function initSlider() {
    const slidesWrap = document.getElementById('slidesInner');
    if (!slidesWrap) return;
    const slides = slidesWrap.querySelectorAll('.slide');
    if (!slides || slides.length === 0) return;

    let idx = 0;
    const gap = 18;
    const next = document.getElementById('nextSlide');
    const prev = document.getElementById('prevSlide');

    function show(i) {
      idx = (i + slides.length) % slides.length;
      const slideWidth = slides[0].offsetWidth;
      const shift = -idx * (slideWidth + gap);
      slidesWrap.style.transform = `translateX(${shift}px)`;
    }

    if (next) next.addEventListener('click', () => show(idx + 1));
    if (prev) prev.addEventListener('click', () => show(idx - 1));

    let auto = setInterval(() => show(idx + 1), 4200);
    [next, prev, slidesWrap].forEach(el => {
      if (!el) return;
      el.addEventListener('mouseenter', () => clearInterval(auto));
      el.addEventListener('mouseleave', () => auto = setInterval(() => show(idx + 1), 4200));
    });

    window.addEventListener('resize', () => {
      setTimeout(() => show(idx), 120);
    });

    setTimeout(() => show(0), 100);
  })();

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.fade-up, .service-card, .service-item').forEach(el => {
      el.style.transition = 'none';
      el.classList.add('in', 'visible');
    });
  }
});
