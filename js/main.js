/* ============================================
   鍼灸院・整骨院 かい — main.js
   ハンバーガー / フェードイン / FAQ / ヘッダー透過
   ============================================ */

(function () {
  'use strict';

  /* ---------- Mobile Hamburger ---------- */
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');
  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      hamburger.classList.toggle('is-active', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // close on link click
    nav.querySelectorAll('.nav__link, .nav__cta').forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('is-open');
        hamburger.classList.remove('is-active');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- FAQ Accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-item__q');
    const a = item.querySelector('.faq-item__a');
    if (!q || !a) return;
    q.setAttribute('aria-expanded', 'false');
    q.addEventListener('click', () => {
      const open = item.classList.toggle('is-open');
      q.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) {
        a.style.maxHeight = a.scrollHeight + 'px';
      } else {
        a.style.maxHeight = '0px';
      }
    });
  });

  /* ---------- Fade-in on scroll ---------- */
  const fadeEls = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window && fadeEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    fadeEls.forEach(el => io.observe(el));
  } else {
    fadeEls.forEach(el => el.classList.add('is-visible'));
  }

  /* ---------- Header on-scroll style ---------- */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Year stamp ---------- */
  const yearEl = document.querySelector('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
