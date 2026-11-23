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
    if (text.includes('pn-junction')) return svg('PN junction diode', '<path d="M3 24h12m42 0h12"/><rect x="15" y="10" width="21" height="28" rx="2"/><rect x="36" y="10" width="21" height="28" rx="2"/><path d="M36 10v28"/><text x="25.5" y="24">P</text><text x="46.5" y="24">N</text><circle cx="3" cy="24" r="2"/><circle cx="69" cy="24" r="2"/>');
    if (text.includes('mos capacitor')) return svg('MOS capacitor cross section', '<path d="M11 12h50M18 12v10m7-10v10m22-10v10m7-10v10M11 25h50M11 36h50"/><text x="36" y="7">GATE</text><text x="36" y="18.5">OXIDE</text><text x="36" y="31">SILICON</text>');
    if (text.includes('mosfet')) return svg('MOSFET', '<path d="M13 24h16m8-14v28m0-14h20m-20-10h10m-10 20h10m10-10v-9m0 18v-9"/><circle cx="13" cy="24" r="2"/><circle cx="57" cy="15" r="2"/><circle cx="57" cy="33" r="2"/><text x="36" y="6">FET</text>');
    if (text.includes('ferroelectric')) return svg('Ferroelectric nanosheet transistor', '<path d="M10 11h52v7H10zM16 18v20m40-20v20M16 38h40"/><rect x="23" y="21" width="26" height="3" rx="1"/><rect x="23" y="28" width="26" height="3" rx="1"/><path d="M36 7V2m0 0-3 3m3-3 3 3"/><text x="36" y="44">GAA</text>');
    if (text.includes('random laser')) return svg('Random laser scattering', '<path d="M6 24h21m18 0h21M6 24l12-8m0 16L6 24"/><path d="M29 24l5-5m0 10 5-5m0-5 5 5m-5 5 5-5"/><circle cx="30" cy="12" r="2"/><circle cx="38" cy="35" r="2"/><circle cx="47" cy="13" r="2"/><circle cx="54" cy="33" r="2"/><circle cx="26" cy="36" r="2"/>');
    if (text.includes('energy bands')) return svg('Semiconductor energy bands', '<path d="M12 12h48M12 36h48M12 24h48" stroke-dasharray="3 3"/><path d="M17 10v4m0 20v4M55 10v4m0 20v4"/><text x="7" y="14">Ec</text><text x="7" y="38">Ev</text><text x="7" y="26">Ef</text>');
    if (text.includes('malaria')) return svg('Malaria cell classifier', '<circle cx="24" cy="24" r="14"/><circle cx="24" cy="24" r="6"/><path d="M21 21c5-4 9 5 4 8"/><rect x="44" y="13" width="18" height="18" rx="3"/><path d="M48 22h10m-5-5v10"/><text x="53" y="41">AI</text>');
    if (text.includes('playstore')) return svg('App data analytics', '<path d="m10 12 20 12-20 12z"/><path d="M39 38h24M43 34V25m8 9V17m8 17V12"/><rect x="41" y="25" width="4" height="9"/><rect x="49" y="17" width="4" height="17"/><rect x="57" y="12" width="4" height="22"/>');
    if (text.includes('echo')) return svg('Audio echo cancellation', '<path d="M9 18h8l10-7v26l-10-7H9zM34 18c7 4 7 8 0 12m6-17c13 7 13 15 0 22"/><path d="M48 36c5-6 11-6 16 0" stroke-dasharray="3 2"/>');
    if (text.includes('becton') || text.includes('urine')) return svg('Sensor and pump system', '<path d="M14 10h28v28H14zM21 17h14m-7-7v14m21 4c0 6-5 10-5 10s-5-4-5-10a5 5 0 0 1 10 0Z"/><path d="M49 19c5 3 8 7 8 12"/>');
    if (text.includes('morphological')) return svg('Image morphology pixels', '<path d="M12 12h12v12H12zm18 0h12v12H30zm18 0h12v12H48zM12 30h12v12H12zm18 0h12v12H30zm18 0h12v12H48z"/><path d="M16 8v4m-4 4h4m28-4h4m4 4h4"/>');
    if (text.includes('obstacle') || text.includes('bot')) return svg('BLE obstacle robot', '<rect x="16" y="15" width="30" height="20" rx="5"/><circle cx="25" cy="25" r="3"/><circle cx="37" cy="25" r="3"/><path d="M26 31h10M22 35v6m18-6v6M13 41h10m10 0h10M31 15V8m0 0-3 3m3-3 3 3M48 15c6 2 10 7 10 13m-5-16c8 3 13 10 13 18"/>');
    if (text.includes('rtl') || text.includes('fp8')) return svg('RTL datapath', '<rect x="7" y="15" width="18" height="18" rx="2"/><rect x="47" y="15" width="18" height="18" rx="2"/><path d="M25 24h22m-6-6 6 6-6 6"/><text x="16" y="24">01</text><text x="56" y="24">Σ</text>');
    if (text.includes('sram') || text.includes('sequential')) return svg('SRAM cell', '<rect x="13" y="10" width="18" height="12" rx="1"/><rect x="41" y="10" width="18" height="12" rx="1"/><rect x="13" y="28" width="18" height="12" rx="1"/><rect x="41" y="28" width="18" height="12" rx="1"/><path d="M31 16h10m-10 18h10"/><text x="36" y="45">6T</text>');
    if (text.includes('standard cells')) return svg('Logic gate', '<path d="M12 12h20c12 0 18 7 18 12s-6 12-18 12H12zM12 12v24m38-12h13"/><circle cx="63" cy="24" r="2"/><text x="31" y="24">NAND</text>');
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

  const researchSection = document.getElementById('research');
  const researchDemo = researchSection?.querySelector('.demo');
  if (researchSection && researchDemo && !document.querySelector('.journey')) {
    const journey = document.createElement('section');
    journey.className = 'journey';
    journey.setAttribute('aria-labelledby', 'journey-title');
    journey.innerHTML = `
      <div class="journey-heading">
        <p class="eyebrow">Research journey</p>
        <h3 id="journey-title">Building a 3D memory macro</h3>
        <p>From device behaviour to a fabricated system, this is how the work comes together.</p>
      </div>
      <div class="journey-figures">
        <figure><img src="images/fabricated-fetft-memory-cell.png?v=20261123-hq" alt="Fabricated 2T-2FeTFT memory cell showing labelled word, bit, source and storage lines"><figcaption><strong>Fabricated memory cell</strong><span>2T-2FeTFT cell: concept and fabricated device</span></figcaption></figure>
        <figure><img src="images/fabricated-bcam-macro.png?v=20261123-hq" alt="Fabricated BCAM macro showing integrated word-line decoder, bit-line decoder, drivers, multiplexer, array, precharge and sense amplifier"><figcaption><strong>Fabricated BCAM macro</strong><span>Peripherals integrated with the memory array</span></figcaption></figure>
      </div>
      <ol class="journey-track">
        <li><span>01</span><strong>Model the cell</strong><small>Research team maps device behaviour</small></li>
        <li><span>02</span><strong>Fabricate the cell</strong><small>Research team builds the stacked device</small></li>
        <li class="journey-mine"><span>03</span><strong>Design the periphery</strong><small>My work: circuits, GDS and array interface</small></li>
        <li><span>04</span><strong>Fabricate the macro</strong><small>Array and peripheral integration</small></li>
        <li class="journey-mine"><span>05</span><strong>Characterise the hardware</strong><small>My work: electrical measurements and analysis</small></li>
      </ol>
      <p class="journey-note"><strong>My contribution:</strong> peripheral circuit design, custom GDS layouts, array-interface integration and electrical characterisation.</p>`;
    researchDemo.before(journey);
  }

  document.querySelector('.role')?.replaceChildren('Semiconductor Engineer · Custom IC, Memory Devices, TCAD & Advanced Packaging');
  const availability = document.querySelector('.availability');
  if (availability) availability.lastChild.textContent = ' Available worldwide for full-time semiconductor engineering roles';
  const bios = document.querySelectorAll('.bio');
  if (bios[0]) bios[0].innerHTML = `I work across memory technology from transistor to system. As a Nanoelectronics master's candidate at the <a href="https://www.nus.edu.sg/">National University of Singapore</a>, I develop circuits and custom layouts for a ferroelectric thin-film-transistor (FeTFT) memory macro, now fabricated and electrically measured.`;
  if (bios[1]) bios[1].innerHTML = `Previously, I spent nearly three years at <a href="https://www.micron.com/">Micron</a> translating memory-package requirements into production-ready schematics and layouts. I’m open worldwide to opportunities in Custom IC Design, Memory Devices, TCAD, Process Integration, Advanced Packaging and heterogeneous integration.`;
  const demoTitle = document.querySelector('.demo-head h3');
  if (demoTitle) demoTitle.textContent = 'Try a Hamming-distance search';
  const demoLead = document.querySelector('.demo .lede');
  if (demoLead) demoLead.textContent = 'See the search principle in action: a BCAM compares one 32-bit query with every stored vector in parallel. The smallest mismatch count wins—toggle any query bit to explore how the closest match changes.';
  const contactHeading = document.querySelector('#contact h2');
  if (contactHeading) contactHeading.textContent = 'Let’s connect';
})();
