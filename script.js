document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------
     NAVBAR: blur/shadow on scroll + mobile toggle
     ----------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('is-scrolled', window.scrollY > 12);
  }, { passive: true });

  navToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', isOpen);
  });

  navMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', false);
    });
  });

  /* -----------------------------------------------------
     REVEAL ON SCROLL: fade + rise for sections/cards
     ----------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  /* -----------------------------------------------------
     HERO SCROLL BUTTON: not a link, just scrolls down
     ----------------------------------------------------- */
  const heroScrollBtn = document.getElementById('heroScrollBtn');
  if (heroScrollBtn) {
    heroScrollBtn.addEventListener('click', () => {
      document.getElementById('tentang').scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* -----------------------------------------------------
     LOVE METER: starts at 30%. Pressing the button fills
     it quickly up to 100%, then a warning popup appears
     and hearts & flowers scatter across both sides.
     ----------------------------------------------------- */
  const meterButton = document.getElementById('meterButton');
  const meterFill = document.getElementById('meterFill');
  const meterValue = document.getElementById('meterValue');
  const loveBurst = document.getElementById('loveBurst');
  const lovePopup = document.getElementById('lovePopup');
  const lovePopupClose = document.getElementById('lovePopupClose');

  const MIN_PERCENT = 30;
  const MAX_PERCENT = 100;
  const ANIMATION_MS = 1100; // fast acceleration once triggered

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateMeter() {
    meterButton.disabled = true;
    const startTime = performance.now();

    function frame(now) {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / ANIMATION_MS, 1);
      const eased = easeOutCubic(t);
      const current = Math.round(MIN_PERCENT + eased * (MAX_PERCENT - MIN_PERCENT));

      meterFill.style.width = current + '%';
      meterValue.textContent = current + '%';

      if (t < 1) {
        requestAnimationFrame(frame);
      } else {
        spawnLoveBurst();
        openLovePopup();
      }
    }

    requestAnimationFrame(frame);
  }

  function openLovePopup() {
    lovePopup.classList.add('is-open');
  }

  function closeLovePopup() {
    lovePopup.classList.remove('is-open');
  }

  function spawnLoveBurst() {
    const symbols = ['❤', '💗', '🌸', '🌷', '✿', '💖'];
    const totalParticles = 26;

    for (let i = 0; i < totalParticles; i++) {
      const isLeftSide = i % 2 === 0;
      const item = document.createElement('span');
      item.className = 'love-burst__item';
      item.textContent = symbols[Math.floor(Math.random() * symbols.length)];

      // Keep particles away from the center number, spread across left/right thirds
      const leftPos = isLeftSide
        ? Math.random() * 22 + 2          // 2% – 24% from left
        : Math.random() * 22 + 76;        // 76% – 98% from left

      const dx = (isLeftSide ? -1 : 1) * (Math.random() * 60 + 20) + 'px';
      const rot = (Math.random() * 160 - 80) + 'deg';
      const dur = (Math.random() * 0.9 + 1.6) + 's';
      const size = (Math.random() * 0.9 + 1.1) + 'rem';
      const delay = (Math.random() * 0.5) + 's';

      item.style.left = leftPos + '%';
      item.style.setProperty('--burst-dx', dx);
      item.style.setProperty('--burst-rot', rot);
      item.style.setProperty('--burst-dur', dur);
      item.style.setProperty('--burst-size', size);
      item.style.animationDelay = delay;

      loveBurst.appendChild(item);
      item.addEventListener('animationend', () => item.remove());
    }
  }

  meterButton.addEventListener('click', animateMeter);
  lovePopupClose.addEventListener('click', closeLovePopup);
  lovePopup.addEventListener('click', (e) => {
    if (e.target === lovePopup) closeLovePopup();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLovePopup();
  });

});
