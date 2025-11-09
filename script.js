/* ===== Tahun di footer ===== */
document.addEventListener('DOMContentLoaded', () => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
});

/* ===== THEME TOGGLE (dark / light) ===== */
(function(){
  const root = document.documentElement;
  const btn  = document.getElementById('themeToggle');

  const saved = localStorage.getItem('theme');
  const prefersLight = window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: light)').matches;
  const initial = saved || (prefersLight ? 'light' : 'dark');
  setTheme(initial);

  function setTheme(mode){
    root.classList.add('theming');              // aktifkan animasi transisi
    root.setAttribute('data-theme', mode);
    localStorage.setItem('theme', mode);
    if (btn) btn.textContent = (mode === 'light') ? '🌞' : '🌙';
    if (btn) btn.setAttribute(
      'aria-label',
      mode === 'light' ? 'Ubah ke dark mode' : 'Ubah ke light mode'
    );
    window.setTimeout(()=> root.classList.remove('theming'), 220);
  }

  if (btn){
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
})();

/* ===== LIGHTBOX (zoom gambar) ===== */
function openLightbox(src, alt){
  const overlay = document.getElementById('lightbox');
  const imgTag  = document.getElementById('lightboxImg');
  const capTag  = document.getElementById('lightboxCap');
  if (!overlay || !imgTag) return;
  imgTag.src = src;
  imgTag.alt = alt || '';
  if (capTag) capTag.textContent = alt || '';
  overlay.classList.add('is-open');
  overlay.setAttribute('aria-hidden','false');
}
function closeLightbox(){
  const overlay = document.getElementById('lightbox');
  const imgTag  = document.getElementById('lightboxImg');
  if (!overlay || !imgTag) return;
  overlay.classList.remove('is-open');
  overlay.setAttribute('aria-hidden','true');
  imgTag.removeAttribute('src');
}

/* backup handler klik + esc */
document.addEventListener('DOMContentLoaded', () => {
  const clickable = '.gallery__item img, .property__media img';

  function handler(e){
    const t = e.target;
    if (t && t.matches && t.matches(clickable)) {
      e.preventDefault();
      openLightbox(t.currentSrc || t.src, t.alt || '');
    }
  }
  document.addEventListener('click', handler, { passive:false });
  document.addEventListener('touchend', handler, { passive:false });

  const overlay = document.getElementById('lightbox');
  const btnClose= document.querySelector('.lightbox__close');
  if (overlay){
    overlay.addEventListener('click', (e)=>{
      if (e.target === overlay || e.target === btnClose) closeLightbox();
    }, { passive:true });
  }

  document.addEventListener('keydown', (e)=>{
    if (e.key === 'Escape' && overlay && overlay.classList.contains('is-open')){
      closeLightbox();
    }
  });
});

/* ===== SCROLL REVEAL (muncul saat discroll) ===== */
(function(){
  const groups = [
    { selector: '.hero__content, .hero__visual, .hero .btn, .hero .badges li' },
    { selector: '#units .property' },
    { selector: '.cta-bar' },
    { selector: '#gallery .section__title, #gallery .gallery__item' },
    { selector: '.footer' },
  ];

  groups.forEach(g => {
    const nodes = document.querySelectorAll(g.selector);
    nodes.forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = `${Math.min(i * 90, 360)}ms`;
    });
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);        // sekali saja
      }
    });
  }, { root:null, threshold:0.15, rootMargin:'0px 0px -10% 0px' });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  if ('MutationObserver' in window){
    const mo = new MutationObserver(muts => {
      muts.forEach(m => {
        m.addedNodes && m.addedNodes.forEach(node => {
          if (!(node instanceof Element)) return;
          if (node.matches('.reveal')) io.observe(node);
          node.querySelectorAll &&
            node.querySelectorAll('.reveal').forEach(el => io.observe(el));
        });
      });
    });
    mo.observe(document.body, { childList:true, subtree:true });
  }
})();

/* ===== PAGE ENTER ANIMATION (saat halaman pertama kali muncul) ===== */
document.addEventListener('DOMContentLoaded', () => {
  const targets = [
    '.header .brand', '.header .nav a', '#themeToggle',
    '.hero__content', '.hero__visual', '.hero .btn', '.hero .badges li',
    '.property',
    '.cta-bar',
    '#gallery .section__title', '.gallery__item',
    '.footer'
  ];
  const els = document.querySelectorAll(targets.join(','));

  els.forEach((el, i) => {
    el.classList.add('enter');
    const step = Math.min(5, Math.floor(i/2));
    el.classList.add(`delay-${step}`);
  });

  document.body.classList.add('page-enter');

  requestAnimationFrame(() => {
    els.forEach(el => el.classList.add('entered'));
    setTimeout(() => document.body.classList.remove('page-enter'), 650);
  });
});
W