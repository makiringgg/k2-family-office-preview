(() => {
  'use strict';
  const fv = document.querySelector('#sp-fv');
  if (!fv || !fv.querySelector('[data-fv-part]')) return;
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const running = [];
  let finished = false;
  let watchdog;
  const finish = () => {
    finished = true;
    running.forEach(animation => { try { animation.finish(); } catch {} });
    root.classList.remove('k2-sp-fv-pending');
    fv.dataset.motion = 'complete';
    clearTimeout(window.k2SpFvFallback);
    clearTimeout(watchdog);
  };
  function animate(element, delay, duration, y=4, scale=1) {
    if (!element) return;
    const animation = element.animate([
      { opacity:0, transform:`translateY(${y}px) scale(${scale})` },
      { opacity:1, transform:'none' }
    ], { delay, duration, easing:'cubic-bezier(.22,.55,.3,1)', fill:'backwards' });
    running.push(animation);
    return animation;
  }
  async function start() {
    if (reduced.matches || !Element.prototype.animate) { finish(); return; }
    await Promise.all([...fv.querySelectorAll('img')].map(image=>image.decode().catch(()=>{})));
    if (finished || reduced.matches || !root.classList.contains('k2-sp-fv-pending') || fv.getBoundingClientRect().bottom<=0) { finish(); return; }
    const part = name=>fv.querySelector(`[data-fv-part="${name}"]`);
    animate(part('logo'),0,1000,4,1.012);
    animate(part('audience'),300,750);
    fv.querySelectorAll('[data-fv-letter]').forEach((letter,i)=>animate(letter,800+i*50,350));
    animate(part('support'),1750,800);
    animate(part('document'),2100,900,4,.992);
    animate(part('domains'),2500,850,3);
    animate(part('price'),2780,900,3);
    const last=animate(part('cta'),3150,1100,2,1.004);
    animate(part('note'),3500,650,0);
    root.classList.remove('k2-sp-fv-pending');
    fv.dataset.motion='playing';
    clearTimeout(window.k2SpFvFallback);
    last.finished.then(finish).catch(finish);
    watchdog=setTimeout(finish,5500);
  }
  reduced.addEventListener('change',()=>{if(reduced.matches)finish()});
  fv.addEventListener('focusin',finish,{once:true});
  const observer=new IntersectionObserver(entries=>{
    if(entries[0].boundingClientRect.bottom<=0){finish();observer.disconnect()}
  });
  observer.observe(fv);
  start().catch(finish);
})();
