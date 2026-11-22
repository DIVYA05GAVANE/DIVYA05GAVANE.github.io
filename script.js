/* Hamming-distance concept demo adapted from the supplied Claude portfolio. */
(() => {
  'use strict';
  function mulberry32(a) { return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const rand = mulberry32(2026);
  const stored = Array.from({length: 8}, () => Array.from({length: 32}, () => rand() < .5 ? 1 : 0));
  const initialQuery = stored[3].slice();
  [4,13,27].forEach(i => initialQuery[i] ^= 1);
  let query = initialQuery.slice();
  const queryEl = document.getElementById('query-bits');
  const rowsEl = document.getElementById('stored-rows');
  const buttons = query.map((_, i) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'bit';
    b.setAttribute('aria-label', 'Query bit ' + (i+1));
    b.addEventListener('click', () => { query[i] ^= 1; render(); });
    queryEl.appendChild(b); return b;
  });
  function render() {
    buttons.forEach((b,i) => { b.setAttribute('aria-pressed', String(!!query[i])); b.title = 'Bit ' + (i+1) + ': ' + query[i]; });
    document.getElementById('query-ones').textContent = query.reduce((a,b)=>a+b,0) + ' ones';
    const distances = stored.map(word => word.reduce((d,b,i)=>d + Number(b !== query[i]),0));
    const best = Math.min(...distances);
    rowsEl.replaceChildren();
    stored.forEach((word,row) => {
      const el = document.createElement('div'); el.className = 'grid-row' + (distances[row] === best ? ' row-best' : '');
      const tag = document.createElement('span'); tag.className = 'tag'; tag.textContent = 'v' + (row+1);
      const bits = document.createElement('div'); bits.className = 'bits'; bits.setAttribute('aria-hidden','true');
      word.forEach((bit,i) => { const c = document.createElement('span'); c.className = 'cell ' + (bit !== query[i] ? (bit ? 'miss-on' : 'miss-off') : (bit ? 'on' : '')); bits.appendChild(c); });
      const dist = document.createElement('span'); dist.className = 'dist'; dist.textContent = distances[row];
      el.append(tag,bits,dist); rowsEl.appendChild(el);
    });
    const winners = distances.flatMap((d,i)=>d===best ? ['v'+(i+1)] : []);
    document.getElementById('demo-status').textContent = (winners.length>1 ? 'Closest matches: ' : 'Closest match: ') + winners.join(', ') + ' (Hamming distance ' + best + ')';
  }
  document.getElementById('btn-reset').addEventListener('click',()=>{query=initialQuery.slice();render();});
  document.getElementById('btn-random').addEventListener('click',()=>{query=query.map(()=>Math.random()<.5?1:0);render();});
  render();
  const filters = document.querySelectorAll('[data-filter]');
  filters.forEach(button=>button.addEventListener('click',()=>{
    filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
    document.querySelectorAll('.project').forEach(p=>{p.hidden = !(button.dataset.filter==='all'||p.dataset.track===button.dataset.filter);});
  }));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealTargets = document.querySelectorAll('main > .highlights, main > .section-nav, main > section');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealTargets.forEach(target => target.classList.add('is-visible'));
  } else {
    revealTargets.forEach(target => target.classList.add('reveal'));
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(target => revealObserver.observe(target));
  }

  const navLinks = [...document.querySelectorAll('.section-nav a[href^="#"]')];
  if ('IntersectionObserver' in window && navLinks.length) {
    const navObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-18% 0px -72% 0px', threshold: 0 });
    navLinks.forEach(link => {
      const section = document.querySelector(link.getAttribute('href'));
      if (section) navObserver.observe(section);
    });
  }

  const metrics = [...document.querySelectorAll('.highlights strong')];
  if (!reduceMotion) {
    metrics.forEach(metric => {
      const original = metric.textContent.trim();
      const match = original.match(/^(.*?)(\d+)(.*)$/);
      if (!match) return;
      const [, prefix, targetText, suffix] = match;
      const target = Number(targetText);
      metric.textContent = prefix + '0' + suffix;
      const start = performance.now();
      const duration = 650;
      const tick = now => {
        const progress = Math.min((now - start) / duration, 1);
        metric.textContent = prefix + Math.round(target * (1 - Math.pow(1 - progress, 3))) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }
})();
