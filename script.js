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

  const projectVisual = title => {
    const text = title.toLowerCase();
    const svg = (label, body) => `<svg viewBox="0 0 72 48" role="img" aria-label="${label}">${body}</svg>`;
    if (text.includes('pn-junction')) return svg('PN junction diode', '<path d="M3 24h12m42 0h12"/><rect x="15" y="10" width="21" height="28" rx="2"/><rect x="36" y="10" width="21" height="28" rx="2"/><path d="M36 10v28"/><text x="25.5" y="29">P</text><text x="46.5" y="29">N</text><circle cx="3" cy="24" r="2"/><circle cx="69" cy="24" r="2"/>');
    if (text.includes('mos capacitor')) return svg('MOS capacitor', '<path d="M7 34h58M20 34V18m7 0v16m18 0V18m7 0v16M15 18h42"/><text x="23" y="14">G</text><text x="46" y="45">Si</text>');
    if (text.includes('mosfet')) return svg('MOSFET', '<path d="M13 24h16m8-14v28m0-14h20m-20-10h10m-10 20h10m10-10v-9m0 18v-9"/><circle cx="13" cy="24" r="2"/><circle cx="57" cy="15" r="2"/><circle cx="57" cy="33" r="2"/><text x="31" y="11">FET</text>');
    if (text.includes('ferroelectric')) return svg('Ferroelectric device', '<path d="M9 36h54M16 36V18h40v18M36 10v16m0-16-5 6m5-6 5 6"/><path d="M24 27c7-7 17 7 24 0"/><text x="13" y="15">+P</text><text x="48" y="15">−P</text>');
    if (text.includes('random laser')) return svg('Random laser', '<circle cx="36" cy="24" r="6"/><path d="m36 3 3 12m12-6-8 9m20 6-14 0m2 15-8-9m-7 15 3-12M21 39l8-9M9 24h14m-2-15 8 9"/><circle cx="17" cy="16" r="2"/><circle cx="55" cy="31" r="2"/><circle cx="20" cy="34" r="2"/>');
    if (text.includes('energy bands')) return svg('Energy bands', '<path d="M8 37c9-10 17 5 26-7s18 4 30-10M8 23c9-10 17 5 26-7s18 4 30-10"/><text x="5" y="12">E</text><text x="62" y="45">k</text>');
    if (text.includes('malaria')) return svg('AI microscopy', '<circle cx="24" cy="24" r="13"/><circle cx="24" cy="24" r="5"/><circle cx="48" cy="18" r="9"/><path d="M44 18h8m-4-4v8"/><text x="43" y="39">AI</text>');
    if (text.includes('playstore')) return svg('Data analysis chart', '<path d="M9 40h54M16 36V25m12 11V16m12 20V21m12 15V10"/><rect x="13" y="25" width="6" height="11" rx="1"/><rect x="25" y="16" width="6" height="20" rx="1"/><rect x="37" y="21" width="6" height="15" rx="1"/><rect x="49" y="10" width="6" height="26" rx="1"/>');
    if (text.includes('echo')) return svg('Audio echo waveform', '<path d="M5 25h7l4-12 7 24 7-28 7 30 7-20 6 10h12"/><path d="M5 10c10 0 16 4 20 10M5 40c10 0 16-4 20-10"/>');
    if (text.includes('becton') || text.includes('urine')) return svg('Sensor and pump system', '<path d="M14 10h28v28H14zM21 17h14m-7-7v14m21 4c0 6-5 10-5 10s-5-4-5-10a5 5 0 0 1 10 0Z"/><path d="M49 19c5 3 8 7 8 12"/>');
    if (text.includes('morphological')) return svg('Image morphology pixels', '<path d="M12 12h12v12H12zm18 0h12v12H30zm18 0h12v12H48zM12 30h12v12H12zm18 0h12v12H30zm18 0h12v12H48z"/><path d="M16 8v4m-4 4h4m28-4h4m4 4h4"/>');
    if (text.includes('obstacle') || text.includes('bot')) return svg('BLE robot', '<rect x="17" y="16" width="31" height="22" rx="6"/><circle cx="27" cy="27" r="3"/><circle cx="39" cy="27" r="3"/><path d="M26 34h14M49 17c6 2 10 7 10 13m-5-16c8 3 13 10 13 18M24 16v-6h17v6"/>');
    if (text.includes('rtl') || text.includes('fp8')) return svg('RTL datapath', '<rect x="7" y="15" width="18" height="18" rx="2"/><rect x="47" y="15" width="18" height="18" rx="2"/><path d="M25 24h22m-6-6 6 6-6 6"/><text x="10" y="27">01</text><text x="50" y="27">Σ</text>');
    if (text.includes('sram') || text.includes('sequential')) return svg('SRAM cell', '<rect x="13" y="10" width="18" height="12" rx="1"/><rect x="41" y="10" width="18" height="12" rx="1"/><rect x="13" y="28" width="18" height="12" rx="1"/><rect x="41" y="28" width="18" height="12" rx="1"/><path d="M31 16h10m-10 18h10"/><text x="29" y="47">6T</text>');
    if (text.includes('standard cells')) return svg('Logic gate', '<path d="M12 12h20c12 0 18 7 18 12s-6 12-18 12H12zM12 12v24m38-12h13"/><circle cx="63" cy="24" r="2"/><text x="18" y="28">NAND</text>');
    if (text.includes('package')) return svg('BGA package', '<rect x="18" y="9" width="36" height="30" rx="3"/><path d="M26 16h20v16H26z"/><circle cx="23" cy="13" r="1.5"/><circle cx="49" cy="13" r="1.5"/><circle cx="23" cy="35" r="1.5"/><circle cx="49" cy="35" r="1.5"/><path d="M10 24h8m36 0h8"/>');
    return svg('Engineering project', '<path d="M13 37 30 10l9 12 7-7 13 22H13z"/><circle cx="43" cy="30" r="4"/>');
  };
  document.querySelectorAll('.project h3, .additional-card h3').forEach((heading, index) => {
    if (heading.querySelector('.project-visual')) return;
    const icon = document.createElement('span');
    icon.className = 'project-visual';
    icon.setAttribute('aria-hidden', 'true');
    icon.innerHTML = projectVisual(heading.textContent);
    heading.prepend(icon);
    heading.closest('article')?.style.setProperty('--project-index', index);
  });

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
