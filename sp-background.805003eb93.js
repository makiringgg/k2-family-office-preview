(() => {
  const layout=document.querySelector('.sp-layout');
  const fv=document.querySelector('#sp-fv');
  const lower=document.querySelector('.sp-lower');
  const mobile=matchMedia('(max-width:767px)');
  const reduced=matchMedia('(prefers-reduced-motion:reduce)');
  let queued=false;
  function paint(){
    queued=false;
    if(!mobile.matches)return;
    const rect=fv.getBoundingClientRect();
    const width=layout.getBoundingClientRect().width;
    const start=scrollY+rect.bottom;
    const range=Math.max(1,lower.getBoundingClientRect().height-innerHeight);
    const progress=Math.min(1,Math.max(0,(scrollY-start)/range*1.95));
    const travel=Math.max(0,width*2604/750-innerHeight);
    layout.style.setProperty('--sp-bg-top',`${Math.max(0,rect.bottom)}px`);
    layout.style.setProperty('--sp-bg-y',`${reduced.matches?0:-travel*progress}px`);
  }
  function schedule(){if(!queued){queued=true;requestAnimationFrame(paint)}}
  addEventListener('scroll',schedule,{passive:true});
  addEventListener('resize',schedule);
  addEventListener('load',schedule);
  new ResizeObserver(schedule).observe(layout);
  mobile.addEventListener('change',schedule);
  reduced.addEventListener('change',schedule);
  schedule();
})();
