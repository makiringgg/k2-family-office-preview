// Reveal one complete background gradually over the lower page's scroll range.
const fv = document.getElementById('fv');
const lp = document.querySelector('.lp');
const backgroundSpeed = 1.95;
let scheduled = false;
function alignBackground() {
  const fvRect = fv.getBoundingClientRect();
  const width = lp.getBoundingClientRect().width;
  const top = Math.max(0, fvRect.bottom);
  const lowerStart = scrollY + fvRect.bottom;
  const scrollRange = Math.max(1, document.documentElement.scrollHeight - innerHeight - lowerStart);
  const progress = Math.min(1, Math.max(0, (scrollY - lowerStart) / scrollRange * backgroundSpeed));
  const imageHeight = width * 2500 / 1440;
  const travel = Math.max(0, imageHeight - innerHeight);
  const style = document.documentElement.style;
  style.setProperty('--background-top', `${top}px`);
  style.setProperty('--background-width', `${width}px`);
  style.setProperty('--background-y', `${-travel * progress}px`);
  scheduled = false;
}
function scheduleAlignment() {
  if (!scheduled) { scheduled = true; requestAnimationFrame(alignBackground); }
}
addEventListener('scroll', scheduleAlignment, { passive:true });
addEventListener('resize', scheduleAlignment);
new ResizeObserver(scheduleAlignment).observe(fv);
new ResizeObserver(scheduleAlignment).observe(lp);
addEventListener('load', scheduleAlignment);
alignBackground();
