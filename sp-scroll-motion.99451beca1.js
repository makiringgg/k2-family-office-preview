(() => {
  'use strict';
  const layout = document.querySelector('.sp-layout');
  if (!layout || !('IntersectionObserver' in window) || !Element.prototype.animate) return;
  const mobile = matchMedia('(max-width:767px)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  let observer;
  const animations = new Set();
  const targets = [...layout.querySelectorAll('[data-scroll-motion]')];
  function finish() {
    observer?.disconnect();
    for (const animation of animations) animation.cancel();
    animations.clear();
    targets.forEach(el => el.classList.remove('scroll-pending'));
  }
  function reveal(el) {
    if (el.dataset.scrollShown) return;
    el.dataset.scrollShown = 'true';
    const kind = el.dataset.scrollMotion;
    const delay = Number(el.dataset.scrollDelay || 0);
    let frames = [{opacity:0,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}];
    let duration = 850;
    if (kind === 'book') {
      frames = [{opacity:0,transform:'translateY(18px) scale(.97)'},{opacity:1,transform:'translateY(0) scale(1)'}];
      duration = 1500;
    } else if (kind === 'fade') {
      frames = [{opacity:0},{opacity:1}];
      duration = 1100;
    } else if (kind === 'lines') {
      frames = [{opacity:1,clipPath:'inset(37% 49% 60% 49%)'},{opacity:1,clipPath:'inset(0% 0% 0% 0%)'}];
      duration = 1100;
    }
    try {
      const animation = el.animate(frames, {duration, delay, easing:'cubic-bezier(.22,.61,.36,1)', fill:'both'});
      animations.add(animation);
      animation.finished.then(() => {
        el.classList.remove('scroll-pending');
        animation.cancel();
        animations.delete(animation);
      }).catch(() => {});
    } catch (_) {
      el.classList.remove('scroll-pending');
    }
  }
  function setup() {
    finish();
    if (!mobile.matches || reduced.matches) return;
    observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target;
        if (el.hasAttribute('data-scroll-group')) {
          el.querySelectorAll('[data-scroll-motion]').forEach(reveal);
        } else reveal(el);
        observer.unobserve(el);
      }
    }, {rootMargin:'0px 0px -10% 0px', threshold:.12});
    targets.forEach(el => {
      if (el.dataset.scrollShown) return;
      // Restored scroll positions/hash links must never leave earlier content hidden.
      if (el.getBoundingClientRect().bottom <= 0) {
        el.dataset.scrollShown = 'true';
        return;
      }
      el.classList.add('scroll-pending');
      if (!el.closest('[data-scroll-group]')) observer.observe(el);
    });
    layout.querySelectorAll('[data-scroll-group]').forEach(el => observer.observe(el));
  }
  mobile.addEventListener('change', setup);
  reduced.addEventListener('change', setup);
  addEventListener('pageshow', setup);
  setup();
})();
