/* Halden Employee Onboarding
   Course engine, content and gamification. Plain JavaScript, no dependencies.
   Content lives in BEHAVIORS, DEPTS, BADGES and MODULES below. */
(() => {
  const KEY = 'halden-onboarding-v2';
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Icons (outline, 24px grid) ---------- */
  const ICONS = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    x: '<path d="M18 6 6 18M6 6l12 12"/>',
    'check-circle': '<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
    'x-circle': '<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>',
    'chevron-right': '<path d="m9 18 6-6-6-6"/>',
    'chevron-left': '<path d="m15 18-6-6 6-6"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    compass: '<circle cx="12" cy="12" r="10"/><path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z"/>',
    users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
    user: '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
    'user-check': '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="m16 11 2 2 4-4"/>',
    shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
    'shield-check': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
    lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    rocket: '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    trophy: '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2z"/>',
    award: '<circle cx="12" cy="8" r="6"/><path d="M15.48 12.89 17 22l-5-3-5 3 1.52-9.11"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
    zap: '<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>',
    star: '<path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    'trending-up': '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>',
    clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
    building: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01"/>',
    'pie-chart': '<path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/>',
    network: '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3M12 12V8"/>',
    message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    video: '<path d="m22 8-6 4 6 4V8z"/><rect x="2" y="6" width="14" height="12" rx="2"/>',
    'file-text': '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>',
    scale: '<path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1zM2 16l3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1z"/><path d="M7 21h10M12 3v18M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>',
    gift: '<rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"/>',
    alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/><path d="M12 9v4M12 17h.01"/>',
    search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6M15.5 7.5l3 3L22 7l-3-3"/>',
    laptop: '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16"/>',
    smartphone: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18h.01"/>',
    heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/>',
    calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
    book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    'life-buoy': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="m4.93 4.93 4.24 4.24M14.83 9.17l4.24-4.24M14.83 14.83l4.24 4.24M9.17 14.83l-4.24 4.24"/>',
    monitor: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>',
    'clipboard-check': '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="m9 14 2 2 4-4"/>',
    'bar-chart': '<path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/>',
    sparkles: '<path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3z"/>',
    eye: '<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/>',
    smile: '<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>',
    meh: '<circle cx="12" cy="12" r="10"/><path d="M8 15h8M9 9h.01M15 9h.01"/>',
    frown: '<circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2M9 9h.01M15 9h.01"/>',
    lightbulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5M9 18h6M10 22h4"/>',
    flag: '<path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7"/>',
    play: '<path d="m6 3 14 9-14 9V3z"/>',
    rotate: '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
    coffee: '<path d="M17 8h1a4 4 0 1 1 0 8h-1M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4ZM6 2v2M10 2v2M14 2v2"/>',
    plane: '<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',
    graduation: '<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
    map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',
    megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
    ban: '<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
    globe: '<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    briefcase: '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    'arrow-right': '<path d="M5 12h14M12 5l7 7-7 7"/>',
    layers: '<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 17 10 5 10-5M2 12l10 5 10-5"/>',
    code: '<path d="m16 18 6-6-6-6M8 6l-6 6 6 6"/>',
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
    repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14M7 22l-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
    receipt: '<path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z"/><path d="M16 8h-6M16 12H8M13 16H8"/>'
  };
  const ic = (name, cls = '') => `<svg class="ic ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name] || ICONS.info}</svg>`;
  const dt = (icon, label) => `<dt>${ic(icon)}<span>${label}</span></dt>`;

  /* ---------- Constants ---------- */
  const CHAIN = ['Business outcome', 'Performance', 'Capability → Objective', 'Experience', 'Assessment', 'Workplace application', 'KPI'];
  const CONSIDER = ['Motivation', 'Prior knowledge', 'Cognitive load', 'Workplace reality', 'Culture', 'Language', 'Accessibility', 'Practice'];
  const BEHAVIORS = [
    { id: 'b1', icon: 'building', label: 'Explain what Halden does and how my role contributes', mod: 1 },
    { id: 'b2', icon: 'compass', label: 'Apply our values in everyday decisions', mod: 2 },
    { id: 'b3', icon: 'message', label: 'Pick the right channel and meeting habits for a message', mod: 2 },
    { id: 'b4', icon: 'scale', label: 'Recognize an integrity concern and know where to raise it', mod: 3 },
    { id: 'b5', icon: 'shield', label: 'Spot phishing and handle data by its classification', mod: 4 },
    { id: 'b6', icon: 'laptop', label: 'Use my core tools and know who to ask for help', mod: 5 }
  ];
  const DEPTS = {
    ops: { n: 'Operations', icon: 'settings', tool: 'Ops Console', toolD: 'Client operations dashboards and service tickets.' },
    tech: { n: 'Technology', icon: 'code', tool: 'Code repository and on-call rota', toolD: 'Request repository access and shadow one on-call shift in week three.' },
    sales: { n: 'Sales & Client', icon: 'trending-up', tool: 'CRM', toolD: 'Your accounts, pipeline and client history. Training slot in week one.' },
    corp: { n: 'Corporate functions', icon: 'briefcase', tool: 'Finance and HR systems', toolD: 'Access depends on your role; your manager raises the request.' }
  };
  const PULSE = [['smile', 'Clear and useful'], ['meh', 'Mostly clear'], ['frown', 'Confusing or too much']];
  const BADGES = {
    culture: { n: 'Culture Navigator', icon: 'compass', d: 'Completed the Who we are check.' },
    team: { n: 'Team Player', icon: 'users', d: 'Completed the How we work check.' },
    integrity: { n: 'Integrity Ally', icon: 'scale', d: 'Completed the Integrity & respect check.' },
    phish: { n: 'Phish Finder', icon: 'search', d: 'Found all five red flags without help.' },
    guardian: { n: 'Data Guardian', icon: 'lock', d: 'Completed the Security & privacy check.' },
    ready: { n: 'Ready to Roll', icon: 'rocket', d: 'Set up your first weeks.' },
    streak: { n: 'On a Roll', icon: 'flame', d: 'Five correct answers in a row.' },
    certified: { n: 'Certified', icon: 'award', d: 'Passed the final assessment.' },
    firsttry: { n: 'First-Try Finisher', icon: 'trophy', d: 'Passed the final assessment on the first attempt.' }
  };
  const LEVELS = [{ n: 'Newcomer', x: 0 }, { n: 'Explorer', x: 600 }, { n: 'Contributor', x: 1600 }, { n: 'Insider', x: 3000 }];

  /* ---------- State ---------- */
  const fresh = () => ({
    started: false, idx: 0, max: 0, done: false, name: '', dept: null, mode: null, exp: null,
    base: {}, post: {}, a: {}, pulse: {}, t: {},
    xp: 0, got: {}, streak: 0, best: 0, badges: [],
    plan: { w1: '', d30: '', d60: '', draft: '', approved: false, share: true },
    final: { rel: null, load: null, rec: null },
    cert: 'HLD-ONB-' + Math.floor(100000 + Math.random() * 899999), finishedAt: null
  });
  let S = fresh();
  try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(fresh(), JSON.parse(raw)); } catch (e) {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  const nm = (pre = ', ') => S.name ? pre + esc(S.name) : '';
  const dept = () => DEPTS[S.dept] || DEPTS.ops;
  const modeIcon = () => ({ office: 'building', hybrid: 'repeat', remote: 'home' }[S.mode] || 'repeat');

  /* ---------- Gamification ---------- */
  const level = () => { let L = LEVELS[0], i = 0; LEVELS.forEach((l, j) => { if (S.xp >= l.x) { L = l; i = j; } }); return { ...L, i, next: LEVELS[i + 1] }; };
  function award(key, pts, why) {
    if (!pts || S.got[key] != null) return 0;
    const before = level().i;
    S.got[key] = pts; S.xp += pts; save();
    toast(`<span class="bolt">${ic('zap')}</span><b>+${pts} XP</b>${why ? `<span>${why}</span>` : ''}`);
    renderXP(true);
    const L = level(); if (L.i > before) toast(`${ic('trending-up')}<span>Level up: <b>${L.n}</b></span>`);
    return pts;
  }
  function badge(key) {
    if (S.badges.includes(key)) return;
    S.badges.push(key); save(); renderXP(true); if (S.started) renderSide();
    layerQueue.push(() => badgeDialog(key)); if (!layerOpen) nextLayer();
  }
  function toast(html) {
    const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = html;
    $('#toasts').appendChild(t); setTimeout(() => t.remove(), 2500);
  }
  function renderXP(bump) {
    const L = level();
    const c = $('#t-xp');
    c.innerHTML = `<span class="bolt">${ic('zap')}</span><b>${S.xp.toLocaleString()}</b> XP <span class="lv">· ${L.n}</span><span class="bdg">${ic('award')}${S.badges.length}</span>`;
    c.setAttribute('aria-label', `${S.xp} points, level ${L.n}, ${S.badges.length} badges. Open achievements.`);
    if (bump && !reduced()) { c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump'); }
  }
  /* Layers (dialogs) */
  const layerQueue = []; let layerOpen = false, layerReturn = null;
  function nextLayer() { const f = layerQueue.shift(); if (f) f(); }
  function openLayer(html, focusSel) {
    layerOpen = true; layerReturn = layerReturn || document.activeElement;
    const L = $('#layer'); L.innerHTML = html; L.hidden = false;
    const f = L.querySelector(focusSel || 'button'); if (f) f.focus();
    L.querySelectorAll('[data-close]').forEach(b => b.onclick = closeLayer);
  }
  function closeLayer() {
    const L = $('#layer'); L.hidden = true; L.innerHTML = ''; layerOpen = false;
    if (layerQueue.length) { nextLayer(); return; }
    if (layerReturn && document.contains(layerReturn)) layerReturn.focus(); layerReturn = null;
  }
  $('#layer').addEventListener('click', e => { if (e.target.id === 'layer') closeLayer(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && layerOpen) closeLayer(); });
  function badgeDialog(key) {
    const b = BADGES[key];
    openLayer(`<div class="dialog center" role="dialog" aria-modal="true" aria-labelledby="bd-t">
      <span class="eyebrow">Badge unlocked</span><div class="medal-big">${ic(b.icon)}</div>
      <h2 id="bd-t">${b.n}</h2><p class="muted">${b.d}</p>
      <p class="small muted">${S.badges.length} of ${Object.keys(BADGES).length} badges earned</p>
      <button class="btn accent" data-close>Continue ${ic('arrow-right')}</button></div>`);
  }
  function achievementsDialog() {
    openLayer(`<div class="dialog wide" role="dialog" aria-modal="true" aria-labelledby="ach-t">
      <div class="dialog-top"><h2 id="ach-t">Your achievements${nm()}</h2><button class="x-btn" data-close aria-label="Close">${ic('x')}</button></div>
      ${levelHTML()}
      <h3>Badges</h3>${badgesHTML()}
      <h3>Knowledge checks</h3>${checksHTML()}
      <p class="small muted">Earn points for correct answers on the first try. Streaks of correct answers add bonus points, and badges unlock as you finish each lesson.</p></div>`, '[data-close]');
  }
  function levelHTML() {
    const L = level(), from = L.x, to = L.next ? L.next.x : L.x, pct = L.next ? Math.round((S.xp - from) / (to - from) * 100) : 100;
    return `<div class="level"><div class="level-top"><b>${L.n}</b><span>${S.xp.toLocaleString()} XP${L.next ? ` · ${(to - S.xp).toLocaleString()} to ${L.next.n}` : ' · top level'}</span></div>
      <div class="level-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Progress to next level"><i style="width:${pct}%"></i></div>
      <div class="levels">${LEVELS.map(l => `<span>${l.n}</span>`).join('')}</div></div>`;
  }
  const badgesHTML = () => `<div class="badges">${Object.entries(BADGES).map(([k, b]) => { const on = S.badges.includes(k); return `<div class="badge ${on ? 'on' : ''}"><span class="medal">${ic(on ? b.icon : 'lock')}</span><b>${b.n}</b><small>${b.d}</small><span class="sr">${on ? 'Earned' : 'Locked'}</span></div>`; }).join('')}</div>`;
  const starsHTML = (n, cls = 'stars') => `<span class="${cls}" role="img" aria-label="${n} of 3 stars">${[1, 2, 3].map(i => ic('star', i <= n ? 'on fill' : 'fill')).join('')}</span>`;
  function checksHTML() {
    const quizzes = FLAT.filter(s => s.type === 'mcq');
    return `<div class="jmap-scroll"><table class="jmap"><thead><tr><th>Check</th><th>Score</th><th>Stars</th></tr></thead><tbody>${quizzes.map(s => {
      const m = MODULES[s.mi], done = quizDone(s);
      return `<tr><td><span class="mname">${ic(m.icon)}${m.name}</span></td><td class="num">${done ? `${quizScore(s)} / ${s.items.length}` : '—'}</td><td>${done ? starsHTML(quizStars(s), 'mini-stars') : '<span class="small muted">Not taken</span>'}</td></tr>`;
    }).join('')}</tbody></table></div>`;
  }

  /* ---------- CONNECT lens defaults by screen type ---------- */
  const LENS = {
    text: { element: 'Short read, one idea per screen', why: 'Each screen carries one idea in under 150 words. Icons label each point so it can be scanned quickly. Low cognitive load keeps attention on what matters at work.', consider: ['Cognitive load', 'Culture'], a11y: 'Real headings, readable line length, decorative icons hidden from screen readers.', evidence: 'Screen reached.' },
    reveal: { element: 'Flip cards', why: 'The learner turns each card in any order. The front names the value, the back shows what it looks like in practice. Curiosity drives the reading instead of a long page.', consider: ['Motivation', 'Cognitive load'], a11y: 'Cards are toggle buttons with a pressed state. Motion is removed when the learner prefers less motion.', evidence: 'Cards turned.' },
    tabs: { element: 'Labelled tabs with icons', why: 'Reference content split into tabs the learner can open in any order. It works as a job aid they can come back to.', consider: ['Cognitive load', 'Workplace reality', 'Accessibility'], a11y: 'WAI-ARIA tabs with arrow-key navigation.', evidence: 'Sections opened.' },
    timeline: { element: 'Process interaction', why: 'Company history told step by step as five moments, each linked to a habit the learner will see today.', consider: ['Culture', 'Motivation'], a11y: 'Steps are tabs, plus Previous and Next buttons.', evidence: 'Steps opened.' },
    predict: { element: 'Predict, then reveal', why: 'Making a guess before seeing the answer draws on what the learner already thinks. A correct guess earns points; a surprise is remembered.', consider: ['Prior knowledge', 'Motivation'], a11y: 'Chart values are written as numbers next to each bar.', evidence: 'Prediction compared with the answer.' },
    scenario: { element: 'Character scenario with consequences', why: 'A realistic message from a colleague or supplier. The learner sees what happens first, then why. The best choice on the first try earns points.', consider: ['Practice', 'Workplace reality', 'Culture'], a11y: 'Dialogue and outcomes are text, announced when they appear. The learner can try again.', evidence: 'First choice, mapped to a target behavior.' },
    mcq: { element: 'Gamified knowledge check', why: 'One question at a time with Submit and feedback, like a quiz slide. Points for first-try answers, streak bonuses, stars and a badge give low-stakes motivation without hiding the learning.', consider: ['Practice', 'Motivation', 'Cognitive load'], a11y: 'Options are a radio group. Feedback is written out and marked with words, not only color.', evidence: 'First-try accuracy, streaks, stars.' },
    match: { element: 'Matching task', why: 'The learner applies a rule to realistic messages. Points come from correct answers on the first check.', consider: ['Practice', 'Workplace reality', 'Language'], a11y: 'Native select menus, each with a label.', evidence: 'First-check accuracy.' },
    sort: { element: 'Sorting task', why: 'The learner sorts real examples into categories, which builds the judgment needed at work. Feedback and points come item by item.', consider: ['Practice', 'Workplace reality'], a11y: 'Category buttons have icons and text labels.', evidence: 'Accuracy per item.' },
    hotspot: { element: 'Simulated email with hidden red flags', why: 'Practice on a safe copy of the real threat. Every flag found without help earns points, and finding all five earns a badge.', consider: ['Practice', 'Workplace reality', 'Accessibility'], a11y: 'Every part of the email is a keyboard-reachable button, and there are normal parts as well as flags. The learner can reveal the rest at any time.', evidence: 'Flags found vs. revealed.' },
    checklist: { element: 'Setup checklist (performance support)', why: 'Turns information into action during the first week. It stays available after the course.', consider: ['Workplace reality', 'Cognitive load'], a11y: 'Native checkboxes with full labels.', evidence: 'Self-reported setup progress.' },
    pulse: { element: 'Lesson experience pulse', why: 'One tap at the end of each lesson shows where learners struggle, so improvement can start before the end-of-course survey.', consider: ['Motivation', 'Language', 'Accessibility'], a11y: 'Three labelled buttons with icons and an optional comment field.', evidence: 'Clarity rating per lesson, optional comment.' },
    rate: { element: 'Confidence self-rating', why: 'The same six behaviors are rated before and after, which gives a baseline to compare against.', consider: ['Prior knowledge', 'Motivation'], a11y: 'Radio groups with arrow keys and labelled endpoints.', evidence: 'Confidence on six target behaviors.' }
  };

  /* ---------- Course content ---------- */
  const MODULES = [
    {
      id: 'm0', name: 'Welcome', icon: 'map', links: [0, 1, 2], min: 6, sub: 'Outcome · Performance · Objective',
      screens: [
        { type: 'custom', key: 'outcome', lens: { element: 'Gap analysis opener', why: 'CONNECT™ starts with the business problem. New hires see why onboarding exists before they see any content.', consider: ['Motivation', 'Workplace reality'], a11y: 'Figures are text, not images.', evidence: 'None. This screen frames the course.' } },
        { type: 'custom', key: 'profile', lens: { element: 'Learner profile', why: 'Department, work pattern and experience shape examples, tools and the AI draft later on. This takes account of the learner\'s context and prior knowledge.', consider: ['Prior knowledge', 'Workplace reality', 'Culture'], a11y: 'Grouped buttons with pressed state; name field is optional.', evidence: 'Profile used for personalization only.' } },
        { type: 'rate', set: 'base', title: 'Where are you starting from?', lead: 'Six behaviors define a successful first 90 days here. Rate your confidence today. Only you see this, and it shapes your path.' },
        { type: 'custom', key: 'path', lens: { element: 'Personalized learning path with traceability', why: 'Each lesson traces from behavior to practice to check to on-the-job evidence. Low baseline ratings mark lessons as focus areas.', consider: ['Prior knowledge', 'Motivation', 'Cognitive load'], a11y: 'Focus and refresher status written as text.', evidence: 'None. This screen helps the learner decide where to put effort.' } }
      ]
    },
    {
      id: 'm1', name: 'Who we are', icon: 'building', links: [3, 4], min: 9, sub: 'Experience · Check',
      screens: [
        { type: 'text', title: 'We make complex operations simple for the people who run them.', lead: 'That sentence is our purpose. Everything else in this lesson explains how we deliver it.',
          html: () => `<div class="body">
            <p>Halden builds software and services that help organizations run their operations: logistics networks, hospital scheduling, utility field crews. Our clients don't buy software for its own sake. They buy fewer delays, safer shifts and calmer control rooms.</p>
            <p>About a third of us write software; the rest implement it, support it, sell it, and keep the company running.</p></div>
          <div class="gap">
            <div><span class="top-l"><span class="mono-lab">People</span>${ic('users')}</span><span class="num">2,400</span></div>
            <div><span class="top-l"><span class="mono-lab">Countries</span>${ic('globe')}</span><span class="num">9</span></div>
            <div><span class="top-l"><span class="mono-lab">Clients</span>${ic('briefcase')}</span><span class="num">1,300</span></div>
            <div><span class="top-l"><span class="mono-lab">Founded</span>${ic('calendar')}</span><span class="num">2009</span></div>
          </div><p class="footnote">Halden &amp; Co. and all figures in this course are fictional, for demonstration.</p>` },
        { type: 'timeline', title: 'Five moments that shaped us', lead: 'Step through the story. Each moment explains a habit you will still see today.',
          items: [
            { y: '2009', icon: 'lightbulb', h: 'Two operations engineers start Halden', b: 'They had spent years fixing scheduling problems by hand at a port. The first product was a spreadsheet add-in.', so: 'Today: we still hire people who have run operations, not only people who build software for them.' },
            { y: '2014', icon: 'layers', h: 'The first Halden platform', b: 'The add-in became a cloud platform. Implementation services grew around it because clients needed help changing how they work.', so: 'Today: product and services teams plan together.' },
            { y: '2018', icon: 'globe', h: 'Americas office opens', b: 'Our first office outside Europe. Hybrid work became the default to make collaboration across time zones possible.', so: 'Today: our core hours and written decisions exist for teams spread across time zones.' },
            { y: '2022', icon: 'trending-up', h: '1,000 clients', b: 'Growth exposed slow onboarding. Some teams took four months to make a new hire productive.', so: 'Today: you are taking the course that came from that lesson.' },
            { y: '2025', icon: 'sparkles', h: 'Responsible AI charter', b: 'We published how we use AI in our products and internally: people stay accountable and review what AI drafts.', so: 'Today: you will review an AI draft in this course before you approve it.' }
          ] },
        { type: 'predict', title: 'How does Halden make money?', lead: 'Make a guess first. A correct guess earns 50 XP. Which line brings in the most revenue?',
          opts: [{ t: 'Platform subscriptions', icon: 'layers', v: 62 }, { t: 'Implementation services', icon: 'users', v: 28 }, { t: 'Training and support', icon: 'book', v: 10 }], a: 0,
          after: 'Subscriptions pay for the platform, but they renew only when clients get value. That\'s why services and support teams are measured on client results, not hours billed.' },
        { type: 'tabs', title: 'How the company is organized', lead: 'Four groups, one client. Your group is marked, so start there if you like.',
          tabs: () => Object.entries(DEPTS).map(([k, d]) => ({
            name: d.n + (k === S.dept ? ' <span class="yours">You</span>' : ''), icon: d.icon,
            body: `<p>${{ ops: 'Implements the platform with clients, runs support, and owns client results after go-live.', tech: 'Builds and runs the platform: product, engineering, data, security and IT.', sales: 'Finds new clients, grows existing ones, and manages contracts and renewals.', corp: 'Finance, People (HR), Legal, Workplace and Communications.' }[k]}</p>
              <dl class="kv">${dt('network', 'Works closely with')}<dd>${{ ops: 'Technology for fixes and releases, Sales & Client for renewals.', tech: 'Operations for client feedback, Corporate functions for security and access policies.', sales: 'Operations for delivery promises, Corporate functions for pricing and contracts.', corp: 'Everyone. You set the policies the other groups follow.' }[k]}</dd></dl>`
          })) },
        { type: 'mcq', badge: 'culture', title: 'Knowledge check', lead: 'Two questions. Earn 100 XP for each correct answer on the first try.', items: [
          { q: 'A client asks why they should renew. What does Halden ultimately sell?', opts: ['Software licenses', 'Better operational results, delivered through software and services', 'Consulting hours'], a: 1, f: ['Licenses are how clients pay, not why they renew.', 'Renewals follow results, which is why every team is measured on client outcomes.', 'Services exist to get results from the platform, not to sell hours.'] },
          { q: 'Why does Halden write decisions down and keep core hours?', opts: ['Because of the 2018 move to teams spread across time zones', 'Because of the 2025 AI charter', 'Because it is a legal requirement'], a: 0, f: ['Distributed teams need decisions everyone can read, and hours when everyone overlaps.', 'The AI charter is about human review of AI output.', 'It is a working choice, not a legal one.'] }
        ] },
        { type: 'pulse' }
      ]
    },
    {
      id: 'm2', name: 'How we work', icon: 'users', links: [3, 4], min: 11, sub: 'Experience · Check',
      screens: [
        { type: 'reveal', title: 'Three values, seen in behavior', lead: 'Values only matter when you can see them. Select each card to turn it over.',
          cards: [
            { h: 'Clarity over noise', icon: 'lightbulb', s: 'Say the decision, the reason, and the next step.', y: ['A one-page update with the decision first', 'Saying "I don\'t know yet, I\'ll confirm by Thursday"'], n: ['A 30-slide deck nobody reads', 'Copying everyone "just in case"'] },
            { h: 'Own the outcome', icon: 'target', s: 'Results belong to the team; follow-through belongs to you.', y: ['Flagging a risk early, with options', 'Closing the loop with the person who asked'], n: ['"That\'s not my team\'s job"', 'Waiting for someone else to notice'] },
            { h: 'Respect time', icon: 'clock', s: 'Yours, your colleagues\', and your clients\'.', y: ['Meetings with an owner, agenda and end time', 'Answering in writing when a meeting isn\'t needed'], n: ['Back-to-back meetings with no agenda', 'Messages after hours that expect a reply tonight'] }
          ] },
        { type: 'match', title: 'Which channel fits?', lead: 'Choose the right channel for each message, then submit. Each correct answer on the first try earns 50 XP.',
          options: ['Chat', 'Email', 'Meeting', 'Decision log'], optIcons: ['message', 'mail', 'video', 'file-text'],
          items: [
            { t: 'Quick question for a teammate about today\'s file', a: 0, why: 'Chat: fast, informal, and fine for a reply the same day.' },
            { t: 'Formal update to a client about a delivery date', a: 1, why: 'Email: external, on the record, and easy to forward.' },
            { t: 'A difficult conversation about missed expectations', a: 2, why: 'Meeting: tone matters. Never handle this over chat.' },
            { t: 'The team agreed to change the weekly report format', a: 3, why: 'Decision log: written so people in other time zones and future hires can see what was decided and why.' }
          ] },
        { type: 'text', title: 'Rhythms you can count on', lead: 'These habits make hybrid work feel fair for everyone, wherever they sit.',
          html: () => `<div class="block flat"><dl class="kv">
            ${dt('clock', 'Core hours')}<dd>10:00–15:00 local time. Meetings across teams go here.</dd>
            ${dt('target', 'Focus time')}<dd>Wednesday mornings have no internal meetings.</dd>
            ${dt('message', 'Response times')}<dd>Chat the same working day; email within two working days; clients within one.</dd>
            ${dt('calendar', 'Meetings')}<dd>Owner, agenda and end time, or decline. Notes in 24 hours.</dd>
            ${dt(modeIcon(), 'Your week')}<dd>${S.mode === 'remote' ? 'As a remote colleague, join the Monday team sync on video and use the Thursday virtual coffee to meet people.' : S.mode === 'office' ? 'You are in the office, so remember remote colleagues: put every meeting on video and every decision in writing.' : 'Hybrid: agree anchor days with your team, and keep meetings video-first so remote colleagues are included.'}</dd>
          </dl></div>` },
        { type: 'scenario', channel: ['message', 'Thursday · 18:30 · Chat'], who: ['SR', 'Sam Reyes · Client Services'], text: '"Hi! Can you review this 20-page document tonight? I need it for a client meeting at 9 tomorrow." (You have plans this evening.)', q: 'What do you reply?',
          opts: [
            { t: 'Cancel your plans and review it tonight.', c: 'The review is done, but you are tired on Friday and Sam learns that late-night requests work.', f: 'Owning the outcome doesn\'t mean giving up your own time. It sets a pattern that is hard to undo.', tone: 'mid' },
            { t: '"I can\'t tonight. I can review the two most important sections by 8:15. Which ones?"', c: 'Sam sends sections 2 and 4. You review them over breakfast and the meeting goes well.', f: 'Clear about what you can do, and a useful offer that respects both your time and Sam\'s.', tone: 'good' },
            { t: 'Leave it until the morning and reply then.', c: 'At 8:50 Sam is still waiting for an answer. The client meeting starts without your review.', f: 'Silence leaves people stuck. Even a "no" with an alternative helps more.', tone: 'mid' }
          ] },
        { type: 'mcq', badge: 'team', title: 'Knowledge check', lead: 'Two situations from a normal week. Keep your streak going.', items: [
          { q: 'You need input from three colleagues in different countries. What first?', opts: ['Book a meeting at 09:00 your time', 'Share a short written proposal and ask for comments by a set date', 'Wait until everyone is in the office'], a: 1, f: ['09:00 for you may be outside someone else\'s core hours.', 'Writing first respects time zones and often makes the meeting unnecessary.', 'Many teams are never all in one place.'] },
          { q: 'Which update reflects "clarity over noise"?', opts: ['"Decision: we ship Monday. Why: tests pass. Next: Ana sends release notes."', 'A detailed history of everything discussed', '"Let\'s sync on this soon."'], a: 0, f: ['Decision, reason, next step.', 'Detail has a place, but the decision gets lost.', 'No decision and no owner.'] }
        ] },
        { type: 'pulse' }
      ]
    },
    {
      id: 'm3', name: 'Integrity & respect', icon: 'scale', links: [3, 4], min: 10, sub: 'Experience · Check',
      screens: [
        { type: 'text', title: 'Our Code of Conduct, in four promises', lead: 'The full code is long. These four promises cover most situations you will face.',
          html: () => `<div class="block flat"><dl class="kv">
            ${dt('check-circle', 'We are honest')}<dd>With clients, colleagues and data. No shortcuts on facts.</dd>
            ${dt('scale', 'We avoid conflicts')}<dd>Declare anything that could look like personal gain from your role.</dd>
            ${dt('users', 'We respect people')}<dd>No harassment, discrimination or exclusion, in person or online.</dd>
            ${dt('megaphone', 'We speak up')}<dd>If something seems wrong, raise it. Retaliation against anyone who speaks up is itself a breach of the code.</dd>
          </dl></div>
          <div class="callout">${ic('life-buoy')}<div><h3>Where to raise a concern</h3><p>Your manager, your HR partner, or the Ethics Line, which is available 24/7, in 14 languages, and can be anonymous. Use whichever feels safest.</p></div></div>` },
        { type: 'scenario', channel: ['mail', 'Tuesday · 11:00 · Email'], who: ['NS', 'Northline Supplies · Account manager'], text: '"Thank you for your time on our proposal! Please enjoy two concert tickets on us." (The tickets are worth about €300, and Northline is bidding for a contract you are helping to evaluate.)', q: 'What do you do?',
          opts: [
            { t: 'Accept. It\'s a gesture and won\'t change your view.', c: 'Another bidder hears about it. Your evaluation is questioned, and the tender is delayed for a review.', f: 'Intent doesn\'t matter here; appearance does. Gifts during a tender are not allowed.', tone: 'mid' },
            { t: 'Decline politely and log the offer in the gifts register.', c: 'The supplier replies, "Of course, understood." The record protects you and the process.', f: 'Decline anything during an active tender, and log the offer so there is a record.', tone: 'good' },
            { t: 'Accept, but give the tickets to a colleague.', c: 'The supplier still sees it as accepted, and now a colleague is involved too.', f: 'Passing a gift on doesn\'t remove the conflict. Decline and log it.', tone: 'mid' }
          ] },
        { type: 'sort', title: 'Fine, declare first, or not allowed?', lead: 'Sort each situation. Each correct answer earns 50 XP.',
          buckets: ['Fine', 'Declare first', 'Not allowed'], bucketIcons: ['check-circle', 'flag', 'ban'],
          items: [
            { t: 'A branded notebook from a client after a workshop', a: 0, why: 'Low value and not tied to a decision.' },
            { t: 'Your cousin applies for a role on your team', a: 1, why: 'Declare it, and stay out of the hiring decision.' },
            { t: 'A €50 gift card from a supplier', a: 2, why: 'Cash and cash equivalents are never allowed, at any value.' },
            { t: 'Dinner with a client during their contract renewal', a: 1, why: 'Allowed with your manager\'s approval and a reasonable budget.' },
            { t: 'Freelancing for a Halden competitor at weekends', a: 2, why: 'A direct conflict of interest.' }
          ] },
        { type: 'scenario', channel: ['video', 'Monday · 10:00 · Video call'], who: null, text: 'In a project meeting, Mei\'s idea is talked over twice. Then someone jokes about Mei\'s accent, and two people laugh.', q: 'What do you do?',
          opts: [
            { t: 'Stay quiet. It isn\'t your meeting.', c: 'Mei says nothing for the rest of the call and keeps the camera off the following week.', f: 'Silence reads as agreement. You don\'t need to own the meeting to act.', tone: 'mid' },
            { t: 'Redirect in the moment ("I\'d like to hear the rest of Mei\'s idea") and check in with Mei afterwards.', c: 'The meeting moves on with Mei\'s point heard. Afterwards Mei thanks you, and you agree together whether to raise the joke.', f: 'A light intervention in the moment, then support. You can also raise it with your manager or HR.', tone: 'good' },
            { t: 'Call the person out sharply in front of everyone.', c: 'The meeting becomes about the conflict, and Mei is now at the center of it without being asked.', f: 'Right instinct, but tone matters. Redirect first, then follow up privately.', tone: 'mid' }
          ] },
        { type: 'mcq', badge: 'integrity', title: 'Knowledge check', lead: 'Two questions on raising concerns.', items: [
          { q: 'You suspect a colleague is changing timesheets, but you are not sure. What do you do?', opts: ['Wait until you have proof', 'Raise it through any speak-up channel; you don\'t need proof', 'Confront the colleague first'], a: 1, f: ['Waiting can let harm grow. Investigations are for others to run.', 'A concern raised in good faith is protected, even if it turns out to be nothing.', 'That can put you at risk and compromise a review.'] },
          { q: 'Which is true about the Ethics Line?', opts: ['Only managers may use it', 'It can be anonymous and is open 24/7', 'It is only for legal issues'], a: 1, f: ['Anyone can use it, including contractors.', 'Anyone can use it, at any time, anonymously if they wish.', 'It covers any conduct concern.'] }
        ] },
        { type: 'pulse' }
      ]
    },
    {
      id: 'm4', name: 'Security & privacy', icon: 'shield', links: [3, 4], min: 9, sub: 'Experience · Check',
      screens: [
        { type: 'hotspot', title: 'Find the red flags', lead: 'This email arrived in your inbox. Five details give it away. Select anything that looks suspicious; each flag you find earns 50 XP.',
          parts: {
            from: { t: '"Halden Payroll" &lt;payroll@halden-co-payroll.com&gt;', flag: 'Lookalike sender domain. Real Halden mail comes from @halden.com only.' },
            subj: { t: 'ACTION REQUIRED: Confirm your bank details within 2 hours', flag: 'Pressure and a short deadline, designed to stop you thinking.' },
            greet: { t: 'Dear employee,', flag: 'Generic greeting. Payroll knows your name.' },
            pre: { t: 'Due to a system upgrade, your next salary payment is on hold.', ok: 'A plausible story. Suspicious in context, but not proof on its own.' },
            link: { t: '<span class="fake-link">https://people.halden.com/verify</span> <span class="small muted">(link goes to: http://halden-verify.co/login)</span>', flag: 'The link text and the real destination don\'t match.' },
            cred: { t: 'Please enter your password to confirm your identity.', flag: 'Halden never asks for your password by email or form.' },
            sign: { t: 'Kind regards, Payroll Team', ok: 'Normal sign-off. Nothing suspicious here.' }
          } },
        { type: 'sort', title: 'How sensitive is it?', lead: 'Every document has a class. The class decides where it can be stored and who can see it.',
          buckets: ['Public', 'Internal', 'Confidential', 'Restricted'], bucketIcons: ['globe', 'building', 'lock', 'shield'],
          items: [
            { t: 'A published press release', a: 0, why: 'Already public.' },
            { t: 'The team org chart', a: 1, why: 'Fine for anyone at Halden, but not outside.' },
            { t: 'A signed client contract', a: 2, why: 'Need-to-know, and never shared outside approved tools.' },
            { t: 'Employee salary data', a: 3, why: 'Personal data: the highest class, with access logged.' },
            { t: 'Next year\'s product roadmap', a: 2, why: 'Commercially sensitive and need-to-know.' }
          ] },
        { type: 'checklist', title: 'Your first-week security setup', lead: 'Do these now or this week. Check each one off when it\'s done; this list stays in your plan.',
          items: [
            { t: 'Turn on multi-factor sign-in', icon: 'smartphone', d: 'Use the authenticator app, not text messages.' },
            { t: 'Set up the password manager', icon: 'key', d: 'One strong master password; let it create the rest.' },
            { t: 'Lock your screen whenever you step away', icon: 'lock', d: 'Windows + L, or Ctrl + Cmd + Q on a Mac.' },
            { t: 'Save the security contact', icon: 'alert', d: 'Report suspected phishing with the Report button, or to the IT service desk, within 30 minutes.' }
          ] },
        { type: 'mcq', badge: 'guardian', title: 'Knowledge check', lead: 'Two questions to finish the lesson.', items: [
          { q: 'You clicked a suspicious link before noticing. What now?', opts: ['Close the tab and hope for the best', 'Report it to IT immediately; speed matters more than embarrassment', 'Change your password next month'], a: 1, f: ['Damage can spread silently.', 'Reports in the first 30 minutes make the biggest difference, and no one is blamed for reporting.', 'Too late. Report now.'] },
          { q: 'A client asks you to send their contract to a personal email address. What do you do?', opts: ['Send it, since it\'s their own contract', 'Use the approved client portal and explain why', 'Print it and post it'], a: 1, f: ['Confidential data stays in approved tools, whoever asks.', 'Confidential data stays in approved tools, and a short explanation keeps the client on side.', 'That adds risk.'] }
        ] },
        { type: 'pulse' }
      ]
    },
    {
      id: 'm5', name: 'Your first weeks', icon: 'rocket', links: [3, 5], min: 8, sub: 'Experience · Application',
      screens: [
        { type: 'checklist', title: () => `Tools for ${dept().n}`, lead: 'Your core tools. Check them off as access arrives. Most are ready on day one.',
          items: () => [
            { t: 'Laptop and single sign-on', icon: 'laptop', d: 'One login for every Halden tool.' },
            { t: 'People portal', icon: 'user', d: 'Payslips, time off, benefits and your profile.' },
            { t: 'Expenses app', icon: 'receipt', d: 'Photograph receipts; claims are paid with the next salary.' },
            { t: 'Learning hub', icon: 'book', d: 'This course, and your learning budget.' },
            { t: dept().tool, icon: dept().icon, d: dept().toolD }
          ] },
        { type: 'tabs', title: 'Benefits and wellbeing', lead: 'The essentials. The People portal has the full details for your country.',
          tabs: () => [
            { name: 'Time off', icon: 'plane', body: `<dl class="kv">${dt('calendar', 'Annual leave')}<dd>25 days, plus local public holidays.</dd>${dt('clock', 'Booking')}<dd>Through the People portal, two weeks ahead for anything over three days.</dd></dl>` },
            { name: 'Health', icon: 'heart', body: `<dl class="kv">${dt('heart', 'Medical')}<dd>Private cover from your first day, including dependants.</dd>${dt('info', 'Sick leave')}<dd>Tell your manager by 10:00. A note is needed after three days.</dd></dl>` },
            { name: 'Growth', icon: 'graduation', body: `<dl class="kv">${dt('book', 'Learning budget')}<dd>€1,200 a year for courses, books and conferences.</dd>${dt('users', 'Mentoring')}<dd>Open to everyone after three months.</dd></dl>` },
            { name: 'Wellbeing', icon: 'life-buoy', body: `<dl class="kv">${dt('life-buoy', 'Support line')}<dd>Free, confidential counselling 24/7 for you and your family.</dd>${dt(modeIcon(), 'Flexibility')}<dd>${S.mode === 'remote' ? 'Remote setup allowance of €500.' : 'Hybrid by default; agree a pattern with your team.'}</dd></dl>` }
          ] },
        { type: 'match', badge: 'ready', title: 'Who would you ask?', lead: 'You will have questions. Match each one to the right person.',
          options: ['Your manager', 'Your onboarding buddy', 'HR partner', 'IT service desk'], optIcons: ['user-check', 'coffee', 'briefcase', 'monitor'],
          items: [
            { t: 'What are my priorities for the first month?', a: 0, why: 'Priorities are agreed with your manager.' },
            { t: 'Where do people usually have lunch, and who should I meet?', a: 1, why: 'Your buddy is there for the unwritten rules.' },
            { t: 'My contract shows the wrong start date', a: 2, why: 'Contracts and personal records go to your HR partner.' },
            { t: 'I\'m locked out of my laptop', a: 3, why: 'Access and devices go to the IT service desk, 24/7.' }
          ] },
        { type: 'pulse' }
      ]
    },
    {
      id: 'm6', name: 'Final assessment', icon: 'trophy', links: [4], min: 6, sub: 'Assessment',
      screens: [
        { type: 'mcq', final: true, pass: 6, title: 'Final challenge', lead: 'Eight situations, one from each part of the course. Score 6 or more to pass. First-try answers earn 150 XP plus streak bonuses. You can retake any you miss.',
          lens: { element: 'Gamified summative assessment', why: 'Each item maps to one target behavior, so the result shows evidence by objective, not just a score. Points, streaks and stars motivate. Retaking only the missed items supports mastery rather than punishing a mistake.', consider: ['Practice', 'Workplace reality', 'Motivation'], a11y: 'Results are written out per item. There is no time limit.', evidence: 'Score by behavior, attempts taken, first-try accuracy.' },
          items: [
            { b: 'b1', q: 'A client says, "You\'re just a software vendor." What is the best response?', opts: ['Agree and move on', 'Explain that Halden is measured on their operational results, through software and services', 'List product features'], a: 1, f: ['That misses why clients renew.', 'Clients renew for results, and every team is measured on them.', 'Features don\'t answer the point.'] },
            { b: 'b2', q: 'You realize a deadline you own will slip. When do you say so?', opts: ['Now, with options', 'On the deadline', 'Only if asked'], a: 0, f: ['Own the outcome by flagging early with options.', 'Too late to help anyone plan.', 'People can\'t plan around something they don\'t know.'] },
            { b: 'b3', q: 'Where should a decision affecting three teams be recorded?', opts: ['A chat thread', 'The decision log', 'Your own notes'], a: 1, f: ['Chat threads get lost.', 'The decision log is where everyone, in every time zone, can find it.', 'Others can\'t see your notes.'] },
            { b: 'b3', q: 'A meeting invite has no agenda. What do you do?', opts: ['Ask the owner for the goal, or decline', 'Attend and see', 'Ignore it'], a: 0, f: ['Respect time, including your own.', 'That can cost everyone an hour.', 'Silence leaves the owner guessing.'] },
            { b: 'b4', q: 'A supplier in an active tender offers lunch. What do you do?', opts: ['Accept, since it\'s only lunch', 'Decline and log it in the gifts register', 'Accept and pay half'], a: 1, f: ['No gifts or hospitality during a tender.', 'Decline and keep a record. That protects you and the process.', 'It still looks like influence.'] },
            { b: 'b4', q: 'Who can use the Ethics Line?', opts: ['Managers only', 'Anyone, anonymously if they wish', 'Only the legal team'], a: 1, f: ['No, it is open to everyone.', 'Open to everyone, 24/7.', 'No, it is open to everyone.'] },
            { b: 'b5', q: 'An email from "@halden-co-payroll.com" asks for your password. What do you do?', opts: ['Reply asking if it\'s real', 'Use Report phishing and delete it', 'Forward it to your team as a warning'], a: 1, f: ['Never engage with the sender.', 'Reporting removes it from everyone\'s inbox.', 'Forwarding spreads the risk. Report it instead.'] },
            { b: 'b6', q: 'You\'re locked out at 21:00 before an early client call. Who do you contact?', opts: ['Your manager', 'The IT service desk, 24/7', 'Your buddy'], a: 1, f: ['Your manager can\'t reset access.', 'The service desk handles access around the clock.', 'Your buddy can\'t reset access either.'] }
          ] }
      ]
    },
    {
      id: 'm7', name: 'Your 60-day plan', icon: 'clipboard-check', links: [5], min: 6, sub: 'Workplace application',
      screens: [{ type: 'custom', key: 'plan', lens: { element: 'Commitment plan + AI-drafted first 1:1 that needs human approval', why: 'Learning creates value when it changes what people do at work. The assistant drafts from the learner\'s profile and lowest-rated behaviors. The learner reviews, edits and approves it, which is supervised human–AI collaboration.', consider: ['Practice', 'Workplace reality', 'Motivation', 'Language'], a11y: 'Labelled fields; suggestion chips are buttons; the AI draft is clearly labelled and needs approval.', evidence: 'Commitments and approved agenda, shared with the manager for day-30 check-in.' } }]
    },
    {
      id: 'm8', name: 'Measure & close', icon: 'bar-chart', links: [6], min: 5, sub: 'KPI',
      screens: [
        { type: 'rate', set: 'post', title: 'Where are you now?', lead: 'Rate the same six behaviors again. Next you will see the before and after side by side.' },
        { type: 'custom', key: 'change', lens: { element: 'Before/after view and measurement plan', why: 'Baseline → Target → Evidence → Measurement → Interpretation → Improvement. The learner sees their own change, and the organization shows how impact is measured after launch.', consider: ['Motivation', 'Accessibility'], a11y: 'Each chart row has a text equivalent.', evidence: 'Self-reported change; links to on-the-job KPIs.' } },
        { type: 'custom', key: 'final', lens: { element: 'End-of-course experience survey', why: 'Relevance, effort and recommendation, read together with the lesson pulses, show designers where to improve the course next quarter.', consider: ['Motivation', 'Cognitive load', 'Language'], a11y: 'Three labelled groups of buttons.', evidence: 'Relevance, effort, likelihood to recommend.' } },
        { type: 'custom', key: 'finish', lens: { element: 'Learner journey map, achievements and certificate', why: 'Shows the learner\'s own experience lesson by lesson: how clear it felt, stars earned, and time against the plan. The same data shows designers where the course needs work.', consider: ['Motivation', 'Accessibility'], a11y: 'The journey map is a real table with headers.', evidence: 'Completion, certificate ID, journey and gamification data.' } }
      ]
    }
  ];

  /* Flat index of screens */
  const FLAT = [];
  MODULES.forEach((m, mi) => m.screens.forEach((s, si) => { s.id = `${m.id}-${si}`; s.mi = mi; s.si = si; FLAT.push(s); }));
  const val = x => typeof x === 'function' ? x() : x;
  const lessonLabel = mi => mi === 0 ? 'Introduction' : `Lesson ${String(mi).padStart(2, '0')} of ${String(MODULES.length - 1).padStart(2, '0')}`;

  /* ---------- Quiz helpers ---------- */
  const qa = s => S.a[s.id] || {};
  const quizScore = s => s.items.filter((q, i) => qa(s)[i] === q.a).length;
  const quizAllAnswered = s => s.items.every((_, i) => qa(s)[i] != null);
  const quizCur = s => S.a[s.id + ':cur'] ?? 0;
  const quizDone = s => quizAllAnswered(s) && quizCur(s) >= s.items.length;
  const quizFirst = s => S.a[s.id + ':first'] || {};
  const quizStars = s => { const f = quizFirst(s), n = s.items.length, c = s.items.filter((_, i) => f[i]).length; return c === n ? 3 : c / n >= .5 ? 2 : 1; };
  const tries = s => S.a[s.id + ':tries'] || 1;

  /* ---------- Gates ---------- */
  function gate(s) {
    const a = S.a[s.id];
    switch (s.type) {
      case 'rate': return BEHAVIORS.every(b => S[s.set][b.id]);
      case 'reveal': return (a || []).length >= s.cards.length;
      case 'tabs': return (a || []).length >= val(s.tabs).length;
      case 'timeline': return (a || []).length >= s.items.length;
      case 'predict': return a != null;
      case 'scenario': return a != null;
      case 'mcq': return quizDone(s) && (!s.pass || quizScore(s) >= s.pass);
      case 'match': return !!(a && a.checked);
      case 'sort': return s.items.every((_, i) => a && a[i] != null);
      case 'hotspot': return !!(a && a.done);
      case 'checklist': return true;
      case 'pulse': return S.pulse[MODULES[s.mi].id] != null;
      case 'custom': return CUSTOM[s.key].gate();
    }
    return true;
  }
  const HINTS = {
    rate: 'Rate all six behaviors to continue.', reveal: 'Turn every card to continue.', tabs: 'Open every tab to continue.',
    timeline: 'Open every step to continue.', predict: 'Make your guess to continue.', scenario: 'Choose what you would do to continue.',
    mcq: 'Finish the check to continue.', match: 'Submit your answers to continue.', sort: 'Sort every item to continue.',
    hotspot: 'Find the flags, or reveal them, then report the email.', pulse: 'Tell us how this lesson felt to continue.'
  };

  /* ---------- Renderers ---------- */
  const head = s => `<div class="head"><h1>${val(s.title)}</h1>${s.lead ? `<p class="lead">${val(s.lead)}</p>` : ''}</div>`;
  const R = {
    text: s => head(s) + val(s.html),
    rate: s => head(s) + `<div class="block"><div class="scale-legend" aria-hidden="true"><span>1 = not yet confident</span><span>5 = I could explain it to others</span></div>${BEHAVIORS.map(b => rateRow(s.set, b)).join('')}</div>`,
    reveal: s => {
      const o = S.a[s.id] || [], flipped = S.a[s.id + ':f'] || [];
      return head(s) + `<div class="flips">${s.cards.map((c, i) => `<button class="flip" data-card="${i}" aria-pressed="${flipped.includes(i)}" aria-label="${esc(c.h)}${flipped.includes(i) ? ', showing examples' : ', select to see examples'}">
        <span class="flip-in">
          <span class="face front">${ic(c.icon, 'big')}<span style="display:grid;gap:6px"><h3>${c.h}</h3><span class="small muted">${c.s}</span></span><span class="hintline">${ic('rotate')} ${o.includes(i) ? 'Turn back' : 'Turn over'}</span></span>
          <span class="face back"><h4>${ic('check')} Looks like</h4><ul>${c.y.map(x => `<li>${x}</li>`).join('')}</ul><h4>${ic('x')} Doesn't look like</h4><ul>${c.n.map(x => `<li>${x}</li>`).join('')}</ul></span>
        </span></button>`).join('')}</div><p class="counter">${o.length} of ${s.cards.length} cards turned</p>`;
    },
    tabs: s => {
      const tabs = val(s.tabs), o = S.a[s.id] || [0], cur = S.a[s.id + ':t'] || 0;
      return head(s) + `<div class="block" style="gap:0"><div class="tabs" role="tablist">
        ${tabs.map((t, i) => `<button class="tab" role="tab" id="tb-${i}" aria-controls="tp" aria-selected="${cur === i}" tabindex="${cur === i ? 0 : -1}" data-tab="${i}">${ic(t.icon)}<span>${t.name}</span>${o.includes(i) && cur !== i ? '<span class="seen" aria-label="opened"></span>' : ''}</button>`).join('')}
        </div><div class="tabpanel fade" id="tp" role="tabpanel" aria-labelledby="tb-${cur}">${tabs[cur].body}</div></div>
        <p class="counter">${o.length} of ${tabs.length} tabs opened</p>`;
    },
    timeline: s => {
      const o = S.a[s.id] || [0], cur = S.a[s.id + ':t'] || 0, it = s.items[cur];
      return head(s) + `<div class="block process"><div class="pdots" role="tablist" aria-label="Moments">
        ${s.items.map((x, i) => `<button role="tab" data-tab="${i}" aria-selected="${cur === i}" tabindex="${cur === i ? 0 : -1}" class="${o.includes(i) ? 'seen' : ''}" aria-label="${x.y}: ${esc(x.h)}"><span class="pt">${ic(x.icon)}</span><span class="yr">${x.y}</span></button>`).join('')}
        </div><div class="pstep fade" role="tabpanel"><span class="eyebrow">Step ${cur + 1} of ${s.items.length} · ${it.y}</span><h2>${it.h}</h2><p>${it.b}</p><p class="so">${ic('arrow-right')}<span>${it.so}</span></p></div>
        <div class="pnav"><button class="btn ghost" data-step="${cur - 1}" ${cur === 0 ? 'disabled' : ''}>${ic('chevron-left')} Previous</button><button class="btn ${cur === s.items.length - 1 ? 'ghost' : ''}" data-step="${cur + 1}" ${cur === s.items.length - 1 ? 'disabled' : ''}>Next step ${ic('chevron-right')}</button></div></div>`;
    },
    predict: s => {
      const a = S.a[s.id];
      return head(s) + `<div class="choices">${s.opts.map((o, i) => `<button class="choice ${a != null ? (i === s.a ? 'correct' : i === a ? 'wrong' : 'dim') : ''}" data-pick="${i}" ${a != null ? 'disabled' : ''}>${ic(o.icon)}<span class="txt"><b>${o.t}${a != null && i === s.a ? ' · Largest' : ''}</b></span></button>`).join('')}</div>
        ${a != null ? `<div class="block fade"><h2>Share of revenue</h2><div class="bars">${s.opts.map((o, i) => `<div class="bar-row ${i === s.a ? '' : 'dim'}"><span>${ic(o.icon)}${o.t}</span><div class="bar-track"><i style="width:${o.v}%"></i></div><span class="v">${o.v}%</span></div>`).join('')}</div>
        <div class="outcome ${a === s.a ? 'good' : 'mid'}">${ic(a === s.a ? 'check-circle' : 'lightbulb')}<div><b>${a === s.a ? 'You guessed right.' : 'Most people guess services.'}</b><p>${s.after}</p></div></div></div>` : ''}`;
    },
    scenario: s => {
      const a = S.a[s.id];
      const speaker = s.who ? `<div class="speaker"><span class="avatar" aria-hidden="true">${s.who[0]}</span><div class="bubble"><small>${ic(s.channel[0])} ${s.who[1]} · ${s.channel[1]}</small><p>${s.text}</p></div></div>`
        : `<div class="callout">${ic(s.channel[0])}<div><span class="mono-lab">${s.channel[1]}</span><p>${s.text}</p></div></div>`;
      return `<div class="head"><h1>What would you do?</h1><p class="lead">Choose as you really would. The best choice on your first try earns 100 XP.</p></div>
        <div class="block scene">${speaker}<h2>${s.q}</h2>
        <div class="choices">${s.opts.map((o, i) => `<button class="choice ${a === i ? (o.tone === 'good' ? 'correct' : 'wrong') : a != null ? 'dim' : ''}" data-pick="${i}" ${a != null ? 'disabled' : ''}>${ic(a === i ? (o.tone === 'good' ? 'check-circle' : 'alert') : 'chevron-right')}<span class="txt"><b>${o.t}</b></span></button>`).join('')}</div>
        ${a != null ? `<div class="outcome ${s.opts[a].tone} fade" role="status">${ic(s.opts[a].tone === 'good' ? 'check-circle' : 'alert')}<div><b>What happens</b><p>${s.opts[a].c}</p><p class="small" style="margin-top:6px">${s.opts[a].f}</p></div></div><div><button class="btn ghost" data-retry>${ic('rotate')} Try another choice</button></div>` : ''}</div>`;
    },
    mcq: s => renderQuiz(s),
    match: s => {
      const a = S.a[s.id] || { sel: {}, checked: false, first: null };
      return head(s) + `<div class="legend-chips">${s.options.map((o, j) => `<span>${ic(s.optIcons[j])}${o}</span>`).join('')}</div>
      <div class="block" style="gap:0">${s.items.map((it, i) => {
        const v = a.sel[i]; const ok = v === it.a;
        return `<div class="mrow"><label for="mt-${s.id}-${i}">${it.t}</label>
          <select id="mt-${s.id}-${i}" data-m="${i}"><option value="">Choose…</option>${s.options.map((o, j) => `<option value="${j}" ${v === j ? 'selected' : ''}>${o}</option>`).join('')}</select>
          ${a.checked ? `<p class="why ${ok ? 'ok' : 'no'}">${ic(ok ? 'check-circle' : 'x-circle')}<span>${ok ? it.why : 'Not quite. Change your answer and submit again.'}</span></p>` : ''}</div>`;
      }).join('')}</div>
      <div class="row"><button class="btn" data-check ${s.items.every((_, i) => a.sel[i] != null) ? '' : 'disabled'}>${ic('check')} Submit</button>
      ${a.checked ? `<span class="small muted" role="status">${s.items.filter((it, i) => a.sel[i] === it.a).length} of ${s.items.length} correct</span>` : ''}</div>`;
    },
    sort: s => {
      const a = S.a[s.id] || {};
      return head(s) + `<div class="block" style="gap:0">${s.items.map((it, i) => {
        const v = a[i];
        return `<div class="srow"><span>${it.t}</span><div class="seg" role="group" aria-label="${esc(it.t)}">${s.buckets.map((b, j) => `<button data-s="${i}" data-o="${j}" ${v != null ? 'disabled' : ''} class="${v == null ? '' : j === it.a ? 'correct' : j === v ? 'picked' : ''}">${ic(s.bucketIcons[j])}${b}</button>`).join('')}</div>
          ${v != null ? `<p class="why fade">${v === it.a ? 'Correct. ' : `Best answer: ${s.buckets[it.a]}. `}${it.why}</p>` : ''}</div>`;
      }).join('')}</div><p class="counter">${s.items.filter((it, i) => a[i] === it.a).length} of ${s.items.length} sorted correctly · ${s.items.filter((_, i) => a[i] == null).length} remaining</p>`;
    },
    hotspot: s => {
      const a = S.a[s.id] || { hit: [], ok: [], revealed: false, done: false };
      const P = s.parts, flags = Object.keys(P).filter(k => P[k].flag);
      const num = k => flags.indexOf(k) + 1;
      const seg = k => { const p = P[k], hit = a.hit.includes(k) || (a.revealed && p.flag), ok = a.ok.includes(k); return `<button class="hs ${hit ? 'found' : ''} ${ok ? 'miss' : ''}" data-hs="${k}">${p.t}${hit ? `<sup>${num(k)}</sup>` : ''}</button>`; };
      const found = flags.filter(k => a.hit.includes(k)), shown = a.revealed ? flags : found;
      return head(s) + `<div class="mail" aria-label="Simulated email"><div class="mail-bar">${ic('mail')} Inbox · 1 new message</div>
        <div class="mail-head"><div class="r"><span>FROM</span><span>${seg('from')}</span></div><div class="r"><span>TO</span><span>you@halden.com</span></div><div class="r"><span>SUBJECT</span><span>${seg('subj')}</span></div></div>
        <div class="mail-body"><p>${seg('greet')}</p><p>${seg('pre')}</p><p>Confirm your login and bank details here: ${seg('link')}</p><p>${seg('cred')}</p><p>${seg('sign')}</p></div></div>
        ${a.lastOk ? `<div class="callout fade" role="status">${ic('info')}<p>${P[a.lastOk].ok}</p></div>` : ''}
        <div class="block"><div class="row" style="justify-content:space-between"><h2>${ic('flag')} Red flags</h2><span class="counter" role="status">${found.length} of ${flags.length} found${a.revealed ? ' · rest revealed' : ''}</span></div>
        ${shown.length ? `<ol class="flags">${flags.filter(k => shown.includes(k)).map(k => `<li><b>${num(k)}</b><span>${P[k].flag}</span></li>`).join('')}</ol>` : '<p class="small muted">Nothing found yet. Look closely at the sender, the subject and the link.</p>'}
        <div class="row">${!a.revealed && found.length < flags.length ? `<button class="btn ghost" data-reveal>${ic('eye')} Reveal the rest</button>` : ''}
        ${a.done ? `<span class="status ok">${ic('check')} Reported</span>` : `<button class="btn" data-report ${found.length === flags.length || a.revealed ? '' : 'disabled'}>${ic('alert')} Report phishing</button>`}</div>
        ${a.done ? `<div class="outcome good fade">${ic('shield-check')}<div><b>Reported</b><p>At work, the Report button sends the email to Security and removes it from everyone's inbox. It takes two clicks.</p></div></div>` : ''}</div>`;
    },
    checklist: s => {
      const a = S.a[s.id] || [], items = val(s.items);
      return head(s) + `<div class="block" style="gap:0">${items.map((it, i) => `<label class="check"><input type="checkbox" id="ck-${s.id}-${i}" data-ck="${i}" ${a.includes(i) ? 'checked' : ''}><span class="tile" aria-hidden="true">${ic(it.icon)}</span><span><b>${esc(it.t)}</b><small>${esc(it.d)}</small></span></label>`).join('')}</div>
        <p class="counter">${a.length} of ${items.length} done · you can continue anytime</p>`;
    },
    pulse: s => {
      const m = MODULES[s.mi], p = S.pulse[m.id];
      return `<div class="head"><h1>How did “${m.name}” feel?</h1><p class="lead">One tap, worth 20 XP. Your answer goes straight to the people who improve this course.</p></div>
        <div class="choices cols" role="group" aria-label="Lesson clarity">${PULSE.map(([icn, t], i) => `<button class="choice big" data-pulse="${i + 1}" aria-pressed="${!!(p && p.v === i + 1)}">${ic(icn)}<span class="txt"><b>${t}</b></span></button>`).join('')}</div>
        <label class="field"><span>Anything we should improve? (optional)</span><textarea id="pc-${m.id}" rows="3">${esc(p && p.c)}</textarea></label>
        ${p ? `<div class="callout fade" role="status">${ic('heart')}<p>Thanks${nm()}. ${p.v === 3 ? 'We will look at this lesson first. You can also ask your buddy about anything that was unclear.' : 'Noted.'}</p></div>` : ''}`;
    }
  };

  function rateRow(set, b) {
    const v = S[set][b.id];
    return `<div class="rate-row">${ic(b.icon)}<span id="${set}-${b.id}">${b.label}</span>
      <div class="scale" role="radiogroup" aria-labelledby="${set}-${b.id}" data-set="${set}" data-b="${b.id}">
      ${[1, 2, 3, 4, 5].map(n => `<button role="radio" aria-checked="${v === n}" tabindex="${(v ? v === n : n === 1) ? 0 : -1}" data-n="${n}" aria-label="${n} of 5">${n}</button>`).join('')}</div></div>`;
  }

  /* Quiz: one question at a time, Submit, feedback layer, results */
  function renderQuiz(s) {
    const a = qa(s), n = s.items.length, cur = quizCur(s), first = quizFirst(s);
    const xpHere = Object.entries(S.got).filter(([k]) => k.startsWith(s.id + ':')).reduce((t, [, v]) => t + v, 0);
    const dots = `<span class="qdots" aria-hidden="true">${s.items.map((q, i) => `<i class="${a[i] != null ? (a[i] === q.a ? 'ok' : 'no') : i === cur ? 'cur' : ''}"></i>`).join('')}</span>`;
    const stats = `<span class="stats"><span class="stat flame ${S.streak >= 3 ? 'hot' : ''}" title="Current streak">${ic('flame')} ${S.streak}</span><span class="stat pts">${ic('zap')} ${xpHere} XP</span></span>`;
    if (cur >= n && quizAllAnswered(s)) {
      const sc = quizScore(s), pct = Math.round(sc / n * 100), stars = quizStars(s);
      const pass = !s.pass || sc >= s.pass;
      return head(s) + `<div class="qcard"><div class="result fade" role="status" tabindex="-1">
        <span class="eyebrow">${s.final ? (pass ? 'Challenge passed' : 'Not passed yet') : 'Check complete'}</span>
        <div class="score-ring" style="--p:${pct}"><div><b>${sc}/${n}</b><small>${pct}%</small></div></div>
        ${starsHTML(stars)}
        <p class="muted">${stars === 3 ? 'Perfect on the first try.' : sc === n ? 'All correct after a retake.' : stars === 2 ? 'Solid. Review the ones you missed below.' : 'Worth another look at the lesson.'} You earned <b>${xpHere} XP</b> here${S.best >= 3 ? ` and your best streak is ${S.best}` : ''}.</p>
        ${s.final && !pass ? `<p>You need ${s.pass} to pass. Retake only the questions you missed; your correct answers are kept.</p><button class="btn accent" data-retake>${ic('rotate')} Retake missed questions</button>` : ''}
        <ul class="review">${s.items.map((q, i) => `<li>${ic(a[i] === q.a ? 'check-circle' : 'x-circle', a[i] === q.a ? 'ok' : 'no')}<span>${q.q}${first[i] === false && a[i] === q.a ? ' <span class="small muted">(on retake)</span>' : ''}</span></li>`).join('')}</ul>
      </div></div>`;
    }
    const q = s.items[cur], ans = a[cur], sel = ans != null ? ans : S.a[s.id + ':sel'];
    const right = ans === q.a;
    const lastQ = s.items.every((_, i) => i === cur || a[i] != null);
    const gained = S.got[`${s.id}:${cur}:${tries(s)}`];
    return head(s) + `<div class="quiz-top"><span class="mono-lab">Question ${cur + 1} of ${n}</span>${dots}${stats}</div>
      <div class="qcard"><div class="qhead"><h2 id="qq">${q.q}</h2></div>
      <div class="qbody" role="radiogroup" aria-labelledby="qq">${q.opts.map((o, j) => {
        let cls = ''; if (ans != null) cls = j === q.a ? 'correct' : j === ans ? 'wrong' : '';
        const mk = ans != null && j === q.a ? `<span class="mk">${ic('check')} Best answer</span>` : ans != null && j === ans ? `<span class="mk">${ic('x')} Your answer</span>` : '';
        return `<button class="opt ${cls}" role="radio" aria-checked="${sel === j}" data-opt="${j}" ${ans != null ? 'disabled' : ''} tabindex="${(sel != null ? sel === j : j === 0) ? 0 : -1}"><span class="lt">${'ABCD'[j]}</span><span>${o}</span>${mk}</button>`;
      }).join('')}</div>
      ${ans == null ? `<div class="qfoot"><button class="btn accent" data-submit ${sel == null ? 'disabled' : ''}>Submit ${ic('arrow-right')}</button></div>`
        : `<div class="fb ${right ? 'ok' : 'no'} fade" role="status" tabindex="-1" id="fb">${ic(right ? 'check-circle' : 'x-circle')}<div><b>${right ? 'Correct' : 'Not quite'}${gained ? `<span class="xp">+${gained} XP</span>` : ''}${right && S.streak >= 2 ? `<span class="xp" style="background:var(--vino);color:var(--on-accent)">${S.streak} in a row</span>` : ''}</b><p>${q.f[ans]}${right ? '' : ` ${q.f[q.a]}`}</p></div>
          <div class="acts"><button class="btn" data-nextq>${lastQ ? 'See results' : 'Next question'} ${ic('arrow-right')}</button></div></div>`}
      </div>`;
  }

  /* ---------- Binders ---------- */
  const rerender = () => renderLesson(false);
  const focusSel = (sel, scroll) => { if (layerOpen) return; const el = $(sel); if (!el) return; el.focus({ preventScroll: true }); if (scroll) el.scrollIntoView({ block: 'nearest', behavior: reduced() ? 'auto' : 'smooth' }); };
  function bindGeneric(s) {
    const id = s.id;
    $$('.scale').forEach(g => {
      const btns = [...g.querySelectorAll('button')], set = g.dataset.set;
      const choose = (n, f) => { S[set][g.dataset.b] = n; save(); btns.forEach(x => { const on = +x.dataset.n === n; x.setAttribute('aria-checked', on); x.tabIndex = on ? 0 : -1; }); if (f) btns[n - 1].focus(); updateNav(); };
      btns.forEach(x => {
        x.onclick = () => choose(+x.dataset.n);
        x.onkeydown = e => { const n = +x.dataset.n; if (['ArrowRight', 'ArrowUp'].includes(e.key)) { e.preventDefault(); choose(Math.min(5, n + 1), true); } if (['ArrowLeft', 'ArrowDown'].includes(e.key)) { e.preventDefault(); choose(Math.max(1, n - 1), true); } };
      });
    });
    $$('[data-card]').forEach(b => b.onclick = () => {
      const i = +b.dataset.card, o = S.a[id] || [], f = S.a[id + ':f'] || [];
      if (!o.includes(i)) o.push(i);
      S.a[id] = o; S.a[id + ':f'] = f.includes(i) ? f.filter(x => x !== i) : [...f, i]; save();
      const on = S.a[id + ':f'].includes(i); b.setAttribute('aria-pressed', on);
      b.setAttribute('aria-label', `${s.cards[i].h}${on ? ', showing examples' : ', select to see examples'}`);
      b.querySelector('.hintline').innerHTML = `${ic('rotate')} Turn ${on ? 'back' : 'over'}`;
      $('.counter').textContent = `${o.length} of ${s.cards.length} cards turned`; updateNav();
    });
    const tabs = $$('[data-tab]');
    if (tabs.length) {
      if (!S.a[id]) { S.a[id] = [0]; save(); }
      const pick = i => { const o = S.a[id]; if (!o.includes(i)) o.push(i); S.a[id + ':t'] = i; save(); rerender(); focusSel(`[data-tab="${i}"]`); };
      tabs.forEach((t, i) => { t.onclick = () => pick(i); t.onkeydown = e => { if (e.key === 'ArrowRight') { e.preventDefault(); pick((i + 1) % tabs.length); } if (e.key === 'ArrowLeft') { e.preventDefault(); pick((i + tabs.length - 1) % tabs.length); } }; });
      $$('[data-step]').forEach(b => b.onclick = () => pick(+b.dataset.step));
    }
    $$('[data-pick]').forEach(b => b.onclick = () => {
      if (S.a[id] != null) return;
      const i = +b.dataset.pick; S.a[id] = i;
      if (S.a[id + ':first'] == null) {
        S.a[id + ':first'] = i;
        if (s.type === 'predict' && i === s.a) award(id, 50, 'Good guess');
        if (s.type === 'scenario' && s.opts[i].tone === 'good') award(id, 100, 'Best choice');
      }
      save(); rerender(); focusSel('[role="status"]', true);
    });
    const rt = $('[data-retry]'); if (rt) rt.onclick = () => { delete S.a[id]; save(); rerender(); focusSel('[data-pick]'); };
    if (s.type === 'mcq') bindQuiz(s);
    $$('[data-m]').forEach(sel => sel.onchange = () => {
      const a = S.a[id] || { sel: {}, checked: false, first: null };
      if (sel.value === '') delete a.sel[sel.dataset.m]; else a.sel[sel.dataset.m] = +sel.value;
      a.checked = false; S.a[id] = a; save(); rerender(); focusSel('#' + sel.id);
    });
    const ck = $('[data-check]'); if (ck) ck.onclick = () => {
      const a = S.a[id]; a.checked = true;
      if (a.first == null) {
        a.first = s.items.filter((it, i) => a.sel[i] === it.a).length;
        award(id, a.first * 50, `${a.first} of ${s.items.length} correct`);
      }
      save(); rerender(); focusSel('[data-check]');
      if (s.badge && s.items.every((it, i) => a.sel[i] === it.a)) badge(s.badge);
    };
    $$('[data-s]').forEach(b => b.onclick = () => {
      const a = S.a[id] || {}; const i = +b.dataset.s; if (a[i] != null) return;
      a[i] = +b.dataset.o; S.a[id] = a;
      if (a[i] === s.items[i].a) award(`${id}:${i}`, 50, 'Sorted');
      save(); rerender(); const nx = $(`[data-s="${i + 1}"]`); if (nx) nx.focus(); else focusSel('.counter');
    });
    $$('[data-hs]').forEach(b => b.onclick = () => {
      const a = S.a[id] || { hit: [], ok: [], revealed: false, done: false };
      const k = b.dataset.hs, p = s.parts[k];
      if (p.flag) {
        if (!a.hit.includes(k)) { a.hit.push(k); if (!a.revealed) award(`${id}:${k}`, 50, 'Red flag found'); }
        a.lastOk = null;
        const flags = Object.keys(s.parts).filter(x => s.parts[x].flag);
        if (!a.revealed && flags.every(x => a.hit.includes(x))) { S.a[id] = a; save(); badge('phish'); }
      } else { if (!a.ok.includes(k)) a.ok.push(k); a.lastOk = k; }
      S.a[id] = a; save(); rerender(); focusSel(`[data-hs="${k}"]`);
    });
    const rv = $('[data-reveal]'); if (rv) rv.onclick = () => { const a = S.a[id] || { hit: [], ok: [], revealed: false, done: false }; a.revealed = true; S.a[id] = a; save(); rerender(); focusSel('[data-report]'); };
    const rp = $('[data-report]'); if (rp) rp.onclick = () => { S.a[id].done = true; save(); rerender(); };
    $$('[data-ck]').forEach(c => c.onchange = () => {
      let a = S.a[id] || []; const i = +c.dataset.ck;
      a = c.checked ? [...new Set([...a, i])] : a.filter(x => x !== i); S.a[id] = a; save();
      const cnt = $('.counter'); if (cnt) cnt.textContent = `${a.length} of ${val(s.items).length} done · you can continue anytime`;
    });
    $$('[data-pulse]').forEach(b => b.onclick = () => {
      const m = MODULES[s.mi].id; S.pulse[m] = { v: +b.dataset.pulse, c: ($('#pc-' + m) || {}).value || '' }; save();
      award('pulse:' + m, 20, 'Thanks for the feedback');
      if (m === 'm5') badge('ready');
      rerender(); focusSel(`[data-pulse="${b.dataset.pulse}"]`);
    });
    const pc = $('[id^="pc-"]'); if (pc) pc.oninput = () => { const m = MODULES[s.mi].id; if (S.pulse[m]) { S.pulse[m].c = pc.value; save(); } };
  }
  function bindQuiz(s) {
    const id = s.id;
    const opts = $$('[data-opt]');
    const choose = (j, f) => { S.a[id + ':sel'] = j; save(); opts.forEach(o => { const on = +o.dataset.opt === j; o.setAttribute('aria-checked', on); o.tabIndex = on ? 0 : -1; }); const sb = $('[data-submit]'); if (sb) sb.disabled = false; if (f) opts[j].focus(); };
    opts.forEach((o, j) => {
      o.onclick = () => choose(j);
      o.onkeydown = e => { if (['ArrowDown', 'ArrowRight'].includes(e.key)) { e.preventDefault(); choose((j + 1) % opts.length, true); } if (['ArrowUp', 'ArrowLeft'].includes(e.key)) { e.preventDefault(); choose((j + opts.length - 1) % opts.length, true); } };
    });
    const sb = $('[data-submit]'); if (sb) sb.onclick = () => {
      const cur = quizCur(s), sel = S.a[id + ':sel']; if (sel == null) return;
      const a = qa(s); a[cur] = sel; S.a[id] = a; S.a[id + ':sel'] = null;
      const right = sel === s.items[cur].a, first = quizFirst(s);
      if (first[cur] == null) { first[cur] = right; S.a[id + ':first'] = first; }
      if (right) {
        S.streak++; S.best = Math.max(S.best, S.streak);
        const t = tries(s), base = s.final ? (t > 1 ? 50 : 150) : 100, bonus = S.streak >= 2 ? 25 * Math.min(S.streak - 1, 4) : 0;
        save();
        award(`${id}:${cur}:${t}`, base + bonus, bonus ? `Streak bonus +${bonus}` : 'Correct');
        if (S.streak >= 5) badge('streak');
      } else { S.streak = 0; save(); }
      rerender(); focusSel('#fb', true);
    };
    const nx = $('[data-nextq]'); if (nx) nx.onclick = () => {
      const a = qa(s), cur = quizCur(s);
      let next = s.items.findIndex((_, i) => i > cur && a[i] == null);
      if (next < 0) next = s.items.findIndex((_, i) => a[i] == null);
      S.a[id + ':cur'] = next < 0 ? s.items.length : next; save();
      renderLesson(false); focusSel(next < 0 ? '.result' : '#qq');
      if (next < 0) quizComplete(s);
    };
    const rk = $('[data-retake]'); if (rk) rk.onclick = () => {
      const a = qa(s); s.items.forEach((q, i) => { if (a[i] !== q.a) delete a[i]; });
      S.a[id + ':tries'] = tries(s) + 1; S.a[id + ':cur'] = s.items.findIndex((_, i) => a[i] == null); S.a[id + ':sel'] = null; save();
      renderLesson(true);
    };
  }
  function quizComplete(s) {
    if (s.badge) badge(s.badge);
    if (s.final && quizScore(s) >= s.pass) { badge('certified'); if (tries(s) === 1) badge('firsttry'); }
  }

  /* ---------- Custom screens ---------- */
  const CUSTOM = {
    outcome: {
      gate: () => true,
      render: () => `<div class="head"><h1>Your first 60 days matter to you, and to us.</h1>
        <p class="lead">We redesigned onboarding because the old version didn't work. Here is the problem this course exists to solve.</p></div>
        <div class="gap">
          <div><span class="top-l"><span class="mono-lab">What is happening</span>${ic('clock')}</span><span class="num">120 days</span><p class="small muted">before a new hire feels fully effective</p></div>
          <div class="target"><span class="top-l"><span class="mono-lab">What should be happening</span>${ic('target')}</span><span class="num">60 days</span><p class="small muted">our target for every new colleague</p></div>
          <div><span class="top-l"><span class="mono-lab">What is happening</span>${ic('users')}</span><span class="num">18%</span><p class="small muted">of new hires leave within their first year</p></div>
          <div class="target"><span class="top-l"><span class="mono-lab">What should be happening</span>${ic('trending-up')}</span><span class="num">10%</span><p class="small muted">target by the end of 2027</p></div>
        </div>
        <p class="footnote">Fictional figures for demonstration.</p>
        <div class="callout">${ic('lightbulb')}<p>New hires told us why: unclear expectations, tools that took weeks to arrive, and not knowing who to ask. So this course is built around what you will do, not what you should remember.</p></div>
        <label class="field" style="max-width:24rem"><span>What should we call you? (optional)</span><input type="text" id="f-name" autocomplete="given-name" maxlength="40" value="${esc(S.name)}"></label>`,
      bind: () => { $('#f-name').oninput = e => { S.name = e.target.value.trim(); save(); }; }
    },
    profile: {
      gate: () => S.dept && S.mode && S.exp,
      render: () => {
        const grp = (key, label, opts) => `<div class="block"><h2 id="g-${key}">${label}</h2><div class="choices cols" role="group" aria-labelledby="g-${key}">
          ${opts.map(([v, icn, t, d]) => `<button class="choice big" data-pf="${key}" data-v="${v}" aria-pressed="${S[key] === v}">${ic(icn)}<span class="txt"><b>${t}</b>${d ? `<span>${d}</span>` : ''}</span></button>`).join('')}</div></div>`;
        return `<div class="head"><h1>Tell us about your role${nm()}.</h1><p class="lead">Three quick choices. We use them to show the tools, examples and rhythms that fit your work.</p></div>
          ${grp('dept', 'Which group are you joining?', Object.entries(DEPTS).map(([k, d]) => [k, d.icon, d.n, '']))}
          ${grp('mode', 'How will you mostly work?', [['office', 'building', 'In the office', ''], ['hybrid', 'repeat', 'Hybrid', ''], ['remote', 'home', 'Remote', '']])}
          ${grp('exp', 'Your experience so far', [['first', 'graduation', 'First corporate role', 'New to large organizations'], ['experienced', 'briefcase', 'Experienced hire', 'New to Halden, not to the work']])}`;
      },
      bind: () => $$('[data-pf]').forEach(b => b.onclick = () => { S[b.dataset.pf] = b.dataset.v; save(); $$(`[data-pf="${b.dataset.pf}"]`).forEach(x => x.setAttribute('aria-pressed', x === b)); updateNav(); })
    },
    path: {
      gate: () => true,
      render: () => {
        const rows = MODULES.slice(1).map((m, i) => {
          const bs = BEHAVIORS.filter(b => b.mod === i + 1);
          const low = bs.some(b => (S.base[b.id] || 3) <= 3);
          const tag = bs.length ? (low ? '<span class="tag focus">Focus</span>' : '<span class="tag refresh">Refresher</span>') : '';
          const trace = bs.length ? `<span>${bs.map(b => b.label).join('; ')}</span><span>Checked in the lesson and the final challenge</span><span>Evidence at your day-30 check-in</span>` : `<span>${m.sub}</span>`;
          return `<div class="path-row"><span class="tile">${ic(m.icon)}</span><span><b>${m.name}</b>${tag}</span><span class="min">${m.min} min</span><div class="trace">${trace}</div></div>`;
        }).join('');
        const focus = MODULES.slice(1).filter((m, i) => BEHAVIORS.some(b => b.mod === i + 1 && (S.base[b.id] || 3) <= 3)).length;
        return `<div class="head"><h1>Your path${nm()}.</h1><p class="lead">${focus ? `${focus} lessons are focus areas for you, based on your ratings.` : 'You start with strong confidence. Use the lessons as a refresher and aim for three stars on each check.'} ${S.exp === 'first' ? 'As this is your first corporate role, take your time in lessons 2 and 3.' : 'As an experienced hire, look for where Halden works differently from what you know.'}</p></div>
          <div class="block" style="gap:0">${rows}</div>
          <div class="callout">${ic('trophy')}<div><h3>Earn points and badges as you go</h3><p>Correct answers on the first try earn XP, streaks add bonus points, and each lesson unlocks a badge. Select the points counter at the top at any time to see your progress.</p></div></div>`;
      },
      bind: () => {}
    },
    plan: {
      gate: () => S.plan.w1.trim().length > 3 && S.plan.approved,
      render: () => {
        const p = S.plan; if (!p.draft) p.draft = draft();
        const CH = {
          w1: ['Meet my buddy and three people outside my team', 'Finish my security setup', 'Agree my 30-day priorities with my manager'],
          d30: [`Be working independently in ${dept().tool}`, 'Lead one item in the team sync', 'Know who owns what in my area'],
          d60: ['Deliver my first piece of work end to end', 'Give and ask for feedback with my manager', 'Use my learning budget for one course']
        };
        const fld = (k, icn, l) => `<label class="field"><span>${ic(icn)} ${l}</span><input type="text" id="pl-${k}" maxlength="140" value="${esc(p[k])}"></label><div class="chips">${CH[k].map(c => `<button class="chip" data-chip="${k}">${esc(c)}</button>`).join('')}</div>`;
        return `<div class="head"><h1>Write the plan you will actually use.</h1><p class="lead">One commitment for each checkpoint. Use a suggestion or write your own; your manager will see it at your day-30 check-in.</p></div>
          <div class="block">${fld('w1', 'flag', 'In my first week, I will…')}<hr class="rule">${fld('d30', 'calendar', 'By day 30, I will…')}<hr class="rule">${fld('d60', 'target', 'By day 60, I will…')}</div>
          <div class="ai"><div class="ai-head"><span>${ic('sparkles')}<span><b>Assistant draft</b> · questions for your first 1:1, based on your profile and ratings</span></span><span class="status ${p.approved ? 'ok' : 'pending'}" id="ai-st">${p.approved ? 'Approved by you' : 'Needs your review'}</span></div>
          <div class="ai-body"><p class="small muted">The assistant suggests, and you decide. Edit anything that doesn't sound like you before you approve it.</p>
          <label class="field"><span class="sr">Draft</span><textarea id="pl-draft" rows="11">${esc(p.draft)}</textarea></label>
          <div class="row"><button class="btn" id="ai-ok">${ic('check')} ${p.approved ? 'Approved' : 'Approve draft'}</button><button class="btn ghost" id="ai-redo">${ic('rotate')} Restore draft</button></div></div></div>
          <label class="row small" style="cursor:pointer"><input type="checkbox" id="pl-share" ${p.share ? 'checked' : ''}> Share my plan with my manager for our day-30 check-in</label>`;
      },
      bind: () => {
        ['w1', 'd30', 'd60'].forEach(k => { const i = $('#pl-' + k); i.oninput = () => { S.plan[k] = i.value; save(); updateNav(); }; });
        $$('[data-chip]').forEach(c => c.onclick = () => { const k = c.dataset.chip; S.plan[k] = c.textContent; $('#pl-' + k).value = c.textContent; save(); updateNav(); });
        const ta = $('#pl-draft');
        const setA = v => { S.plan.approved = v; save(); const st = $('#ai-st'); st.className = 'status ' + (v ? 'ok' : 'pending'); st.textContent = v ? 'Approved by you' : 'Needs your review'; $('#ai-ok').innerHTML = `${ic('check')} ${v ? 'Approved' : 'Approve draft'}`; if (v) award('plan', 100, 'Plan approved'); updateNav(); };
        ta.oninput = () => { S.plan.draft = ta.value; if (S.plan.approved) setA(false); else save(); };
        $('#ai-ok').onclick = () => setA(true);
        $('#ai-redo').onclick = () => { S.plan.draft = draft(); ta.value = S.plan.draft; setA(false); };
        $('#pl-share').onchange = e => { S.plan.share = e.target.checked; save(); };
      }
    },
    change: {
      gate: () => true,
      render: () => `<div class="head"><h1>What changed${nm()}?</h1><p class="lead">Your confidence before and after the course. On-the-job evidence comes next.</p></div>
        <div class="block"><div class="row" style="justify-content:space-between"><h2>Confidence, 1 to 5</h2><div class="legend"><span><i style="border:2px solid var(--muted);background:var(--surface)"></i>Baseline</span><span><i style="background:var(--vino)"></i>Now</span></div></div>
        <div class="dumb">${BEHAVIORS.map(b => {
          const x = v => (v - 1) / 4 * 100, a = S.base[b.id] || 1, p = S.post[b.id] || a, d = p - a;
          return `<div class="dumb-row"><span>${b.label}</span><div class="dumb-track" role="img" aria-label="${b.label}: from ${a} to ${p}"><span class="sg" style="left:${x(Math.min(a, p))}%;width:${Math.abs(x(p) - x(a))}%"></span><span class="dot b" style="left:${x(a)}%"></span><span class="dot a" style="left:${x(p)}%"></span></div><span class="delta">${d > 0 ? '+' : ''}${d}</span></div>`;
        }).join('')}<div class="axis"><span></span><div><span>1</span><span>2</span><span>3</span><span>4</span><span>5</span></div><span></span></div></div></div>
        <div class="head" style="gap:8px"><h2>How Halden measures onboarding</h2><p class="small muted">Completing the course is not the measure. What you do at work and how quickly you get there are.</p></div>
        <div class="loop-scroll"><div class="loop">
          <div><span class="lab">${ic('flag')} Baseline</span><p>120 days to full effectiveness; 18% first-year leavers; your ratings</p></div>
          <div><span class="lab">${ic('target')} Target</span><p>60 days; 10% leavers by end of 2027</p></div>
          <div><span class="lab">${ic('clipboard-check')} Evidence</span><p>Your plan, setup checklist, assessment by behavior</p></div>
          <div><span class="lab">${ic('calendar')} Measure</span><p>Manager check-ins at day 30 and 60; new-hire survey at day 90</p></div>
          <div><span class="lab">${ic('search')} Interpret</span><p>People team compares groups and departments every quarter</p></div>
          <div><span class="lab">${ic('rotate')} Improve</span><p>Lessons with low clarity scores are revised first</p></div>
        </div></div>`,
      bind: () => {}
    },
    final: {
      gate: () => S.final.rel && S.final.load && S.final.rec,
      render: () => {
        const g = (k, icn, q, opts) => `<div class="block"><h2 id="fq-${k}">${ic(icn)} ${q}</h2><div class="choices cols" role="group" aria-labelledby="fq-${k}">${opts.map((t, i) => `<button class="choice" data-fin="${k}" data-v="${i + 1}" aria-pressed="${S.final[k] === i + 1}"><span class="txt"><b>${t}</b></span></button>`).join('')}</div></div>`;
        return `<div class="head"><h1>Three last questions.</h1><p class="lead">Together with your lesson answers, these tell us what to improve next quarter.</p></div>
          ${g('rel', 'target', 'How relevant was this course to your actual role?', ['Not much', 'Somewhat', 'Very relevant'])}
          ${g('load', 'layers', 'How did the amount of content feel?', ['Too light', 'About right', 'Too much'])}
          ${g('rec', 'heart', 'Would you recommend this course to the next new hire?', ['No', 'Maybe', 'Yes'])}`;
      },
      bind: () => $$('[data-fin]').forEach(b => b.onclick = () => { S.final[b.dataset.fin] = +b.dataset.v; save(); $$(`[data-fin="${b.dataset.fin}"]`).forEach(x => x.setAttribute('aria-pressed', x === b)); updateNav(); })
    },
    finish: {
      gate: () => true,
      render: () => {
        const rows = MODULES.slice(1, 6).map((m, i) => {
          const mcq = m.screens.find(s => s.type === 'mcq'), p = S.pulse[m.id], tm = Math.round((S.t[m.id] || 0) / 60);
          const pct = Math.min(100, tm / (m.min * 2) * 100);
          return `<tr><td><span class="mname">${ic(m.icon)}${m.name}</span></td>
            <td>${p ? `<span class="pill p${p.v}">${ic(PULSE[p.v - 1][0])}${PULSE[p.v - 1][1]}</span>` : '<span class="pill p0">Not rated</span>'}</td>
            <td class="num">${mcq && quizDone(mcq) ? `${quizScore(mcq)} / ${mcq.items.length}` : '—'}</td>
            <td>${mcq && quizDone(mcq) ? starsHTML(quizStars(mcq), 'mini-stars') : '—'}</td>
            <td><div class="row" style="gap:8px;flex-wrap:nowrap"><div class="tbar" aria-hidden="true"><i style="width:${pct}%"></i><b style="left:50%"></b></div><span class="num">${tm}/${m.min}</span></div></td></tr>`;
        }).join('');
        const fin = FLAT.find(s => s.final), fs = quizScore(fin), t = tries(fin);
        const byB = BEHAVIORS.map(b => { const its = fin.items.map((q, i) => [q, i]).filter(([q]) => q.b === b.id); return `${its.filter(([q, i]) => qa(fin)[i] === q.a).length}/${its.length}`; });
        const date = new Date(S.finishedAt || Date.now()).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
        return `<div class="head"><span class="eyebrow">${S.done ? 'Course complete' : 'Last step'}</span><h1>Your learning journey${nm()}.</h1><p class="lead">How each lesson felt to you, how you did, and the time you spent against the plan. The same data is how we improve the course.</p></div>
          <div class="block">${levelHTML()}<div class="row" style="gap:20px"><span class="stat">${ic('zap')} ${S.xp.toLocaleString()} XP</span><span class="stat">${ic('award')} ${S.badges.length} of ${Object.keys(BADGES).length} badges</span><span class="stat flame">${ic('flame')} Best streak ${S.best}</span></div></div>
          <div class="block"><h2>Lesson by lesson</h2><div class="jmap-scroll"><table class="jmap"><thead><tr><th>Lesson</th><th>How it felt</th><th>Check</th><th>Stars</th><th>Minutes (yours / planned)</th></tr></thead><tbody>${rows}</tbody></table></div>
          <p class="footnote">Bar: your time, where the black tick is the planned time. Time counts only while the course is open.</p></div>
          <div class="block"><h2>Final challenge by behavior</h2><dl class="kv">${BEHAVIORS.map((b, i) => `${dt(b.icon, byB[i])}<dd>${b.label}</dd>`).join('')}</dl>
          <p class="small muted">Overall ${fs} of ${fin.items.length}, in ${t} attempt${t > 1 ? 's' : ''}.</p></div>
          <div class="block"><h2>Badges</h2>${badgesHTML()}</div>
          ${S.done ? `<div class="cert fade" id="cert" tabindex="-1"><span class="seal">${ic('award')}</span><span class="eyebrow">Certificate of completion</span><span class="who">${esc(S.name || 'New colleague')}</span><span class="line"></span>
            <p class="muted">has completed Halden Employee Onboarding,<br>built on the CONNECT™ methodology.</p>
            <dl><div><dt>Date</dt><dd>${date}</dd></div><div><dt>Group</dt><dd>${dept().n}</dd></div><div><dt>Points</dt><dd>${S.xp.toLocaleString()} XP</dd></div><div><dt>Certificate</dt><dd>${S.cert}</dd></div></dl></div>
            <div class="row"><button class="btn ghost" id="copy">${ic('clipboard-check')} Copy my plan</button><button class="btn ghost" id="fin-restart">${ic('rotate')} Restart course</button><span class="small muted" id="copy-msg" role="status"></span></div>`
            : `<div class="callout">${ic('award')}<p>Select <b>Finish course</b> to receive your certificate.</p></div>`}`;
      },
      bind: () => {
        const fr = $('#fin-restart'); if (fr) fr.onclick = confirmRestart;
        const b = $('#copy'); if (!b) return;
        b.onclick = () => {
          const t = `My onboarding plan\nWeek 1: ${S.plan.w1}\nDay 30: ${S.plan.d30}\nDay 60: ${S.plan.d60}\n\n${S.plan.draft}`;
          const fail = () => { $('#copy-msg').textContent = 'Copy is blocked here. Your plan is on the “Your 60-day plan” screen.'; };
          try { navigator.clipboard.writeText(t).then(() => { $('#copy-msg').textContent = 'Plan copied.'; }, fail); } catch (e) { fail(); }
        };
      }
    }
  };

  function draft() {
    const low = BEHAVIORS.filter(b => S.base[b.id]).sort((x, y) => S.base[x.id] - S.base[y.id]).slice(0, 2);
    const lines = [`First 1:1 with my manager · 25 minutes`, ``, `1. What does a great first 60 days look like in ${dept().n}?`, `2. Which two priorities matter most this month?`];
    low.forEach((b, i) => lines.push(`${i + 3}. I'd like support with: ${b.label.toLowerCase()}`));
    lines.push(`${low.length + 3}. ${S.mode === 'remote' ? 'How do we stay in touch day to day while I am remote?' : 'Which days is the team usually together?'}`);
    lines.push(``, `My plan: week 1 / day 30 / day 60 attached.`);
    return lines.join('\n');
  }

  /* ---------- Shell ---------- */
  let enteredAt = Date.now();
  function addTime() {
    const now = Date.now();
    if (S.started && document.visibilityState === 'visible') {
      const m = MODULES[FLAT[S.idx].mi].id;
      S.t[m] = (S.t[m] || 0) + Math.min(600, Math.round((now - enteredAt) / 1000)); save();
    }
    enteredAt = now;
  }
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') addTime(); else enteredAt = Date.now(); });
  const lensOn = () => document.body.classList.contains('lens');
  const totalMin = MODULES.reduce((a, m) => a + m.min, 0);
  const pctDone = () => Math.round((S.done ? FLAT.length : S.idx) / FLAT.length * 100);

  function renderCover() {
    const resume = S.idx > 0 || S.max > 0 || S.xp > 0 || !!S.name;
    return `<div class="cover-hero"><div class="cover-in">
        <span class="eyebrow">Halden &amp; Co. · New employee onboarding</span>
        <h1>Your first 60 days start here</h1>
        <p>Who we are, how we work, how we keep each other and our clients safe, and the plan you will take into your first weeks.</p>
        <div class="cover-meta"><span>${ic('clock')} ${totalMin} minutes</span><span>${ic('layers')} ${MODULES.length - 1} lessons</span><span>${ic('trophy')} ${Object.keys(BADGES).length} badges to earn</span><span>${ic('award')} Certificate</span></div>
        <div class="row"><button class="btn big" id="start">${ic('play')} ${resume ? 'Resume course' : 'Start course'}</button>${resume ? `<button class="btn big over" id="start-over">${ic('rotate')} Start over</button>` : ''}</div>
      </div></div>
      <div class="cover-body">
        <div><h2 style="margin-bottom:8px">Lessons</h2><ol class="cover-list">${MODULES.map((m, i) => `<li><span class="tile">${ic(m.icon)}</span><span><small>${lessonLabel(i).replace(/ of \d+/, '')}</small><b>${m.name}</b></span><span class="min">${m.min} min</span></li>`).join('')}</ol></div>
        <div class="cover-aside">
          <div class="block flat"><h2>How this course works</h2><div class="how">
            <div>${ic('target')}<span><b>Built around what you will do</b>Every lesson links to a behavior your manager will look for in your first 60 days.</span></div>
            <div>${ic('zap')}<span><b>Points, streaks and badges</b>Correct answers on the first try earn XP. Keep a streak for bonus points.</span></div>
            <div>${ic('smile')}<span><b>Tell us how it feels</b>One tap at the end of each lesson helps us improve the course.</span></div>
            <div>${ic('clipboard-check')}<span><b>Leave with a plan</b>You finish with a 60-day plan to share with your manager.</span></div>
          </div></div>
          <p class="small muted">Your progress is saved in this browser, so you can stop between lessons.</p>
        </div>
      </div>`;
  }

  function renderSide() {
    const cur = FLAT[S.idx], pct = pctDone();
    $('#side').innerHTML = `<div class="side-head"><span class="ring" style="--p:${pct}" role="img" aria-label="${pct}% complete"><span>${pct}%</span></span><span><h2>Halden Employee Onboarding</h2><p>${totalMin} min · ${MODULES.length - 1} lessons</p></span></div>
      <ol class="lessons">${MODULES.map((m, mi) => {
        const first = FLAT.findIndex(s => s.mi === mi), last = first + m.screens.length - 1;
        const open = first <= S.max || lensOn(), done = last < S.max || S.done, isCur = cur.mi === mi;
        const st = done && !isCur ? ic('check-circle') : !open ? ic('lock') : '';
        return `<li class="${done && !isCur ? 'done' : ''} ${isCur ? 'current' : ''}"><button class="lsn" data-mod="${mi}" aria-disabled="${!open}" ${isCur ? 'aria-current="step"' : ''}>
          <span class="tile">${ic(m.icon)}</span><span class="t"><small>${lessonLabel(mi).replace(/ of \d+/, '')} · ${m.min} min</small><span>${m.name}</span></span><span class="st">${st}</span></button></li>`;
      }).join('')}</ol>
      <div class="side-badges"><span class="mono-lab">${ic('award')} Badges · ${S.badges.length} of ${Object.keys(BADGES).length}</span>
        <div class="row">${Object.entries(BADGES).map(([k, b]) => `<span class="mini-badge ${S.badges.includes(k) ? 'on' : ''}" title="${b.n}${S.badges.includes(k) ? '' : ' (locked)'}">${ic(S.badges.includes(k) ? b.icon : 'lock')}</span>`).join('')}</div>
        <button class="chip" id="side-ach" style="justify-self:start">View achievements</button></div>`;
    $$('[data-mod]').forEach(b => b.onclick = () => {
      if (b.getAttribute('aria-disabled') === 'true') return;
      closeMenu(); go(FLAT.findIndex(s => s.mi === +b.dataset.mod));
    });
    $('#side-ach').onclick = () => { closeMenu(); achievementsDialog(); };
    $('#prog').style.width = pct + '%';
    const links = MODULES[cur.mi].links, maxLink = Math.max(...links);
    $('#chain').innerHTML = CHAIN.map((c, i) => `<li class="${links.includes(i) ? 'on' : i < maxLink ? 'past' : ''}" ${links.includes(i) ? 'aria-current="step"' : ''}><span class="k">${String(i + 1).padStart(2, '0')}</span>${c}</li>`).join('');
    const on = document.querySelector('.chain li.on'); if (on && window.innerWidth < 900) on.scrollIntoView({ block: 'nearest', inline: 'center' });
  }
  function renderLens() {
    const s = FLAT[S.idx], m = MODULES[s.mi], L = s.lens || LENS[s.type] || LENS.text;
    $('#lens').innerHTML = `<div class="lens-card"><span class="eyebrow">${ic('eye')} CONNECT™ lens</span><h3>${m.links.map(i => CHAIN[i]).join(' · ')}</h3>
      <dl style="display:grid;gap:14px;margin:0">
      <div class="lens-item"><dt>eLearning element</dt><dd>${L.element}</dd></div>
      <div class="lens-item"><dt>Design rationale</dt><dd>${L.why}</dd></div>
      <div class="lens-item"><dt>Learner considerations</dt><dd class="lens-tags">${CONSIDER.map(c => `<span class="${L.consider.includes(c) ? 'on' : ''}">${c}</span>`).join('')}</dd></div>
      <div class="lens-item"><dt>Accessibility by design</dt><dd>${L.a11y}</dd></div>
      <div class="lens-item"><dt>Evidence collected</dt><dd>${L.evidence}</dd></div></dl></div>`;
  }
  function updateNav() {
    const s = FLAT[S.idx], ok = gate(s), last = S.idx === FLAT.length - 1;
    const nextMod = !last && FLAT[S.idx + 1].mi !== s.mi ? MODULES[FLAT[S.idx + 1].mi].name : null;
    $('#back').innerHTML = `${ic('chevron-left')} Previous`;
    $('#back').disabled = false;
    $('#next').disabled = !ok || (last && S.done);
    $('#next').innerHTML = last ? (S.done ? `${ic('check')} Completed` : `${ic('award')} Finish course`) : nextMod ? `Next lesson: ${nextMod} ${ic('chevron-right')}` : `Continue ${ic('chevron-right')}`;
    let h = '';
    if (!ok) {
      if (s.type === 'custom') h = s.key === 'profile' ? 'Answer all three to continue.' : s.key === 'plan' ? 'Add a first-week commitment and approve the draft.' : 'Answer all three to continue.';
      else if (s.type === 'mcq' && s.final && quizDone(s)) h = 'Retake the missed questions to pass.';
      else h = HINTS[s.type] || '';
    }
    $('#hint').textContent = h;
  }
  function renderLesson(focus = true) {
    if (!S.started) {
      document.body.classList.add('cover-on');
      $('.content').hidden = true; coverEl.hidden = false; coverEl.innerHTML = renderCover();
      $('#start').onclick = () => { S.started = true; save(); enteredAt = Date.now(); renderLesson(); };
      const so = $('#start-over'); if (so) so.onclick = confirmRestart;
      renderXP(); return;
    }
    document.body.classList.remove('cover-on'); coverEl.hidden = true; coverEl.innerHTML = ''; $('.content').hidden = false;
    const s = FLAT[S.idx], m = MODULES[s.mi];
    const body = s.type === 'custom' ? CUSTOM[s.key].render() : R[s.type](s);
    const L = $('#lesson'), y = window.scrollY;
    const first = FLAT.findIndex(x => x.mi === s.mi);
    L.innerHTML = `<div class="lhead"><span class="tile">${ic(m.icon)}</span><span><small>${lessonLabel(s.mi)}</small><b>${m.name}</b></span>
      <span class="steps" role="img" aria-label="Screen ${s.si + 1} of ${m.screens.length}">${m.screens.map((_, i) => `<i class="${i === s.si ? 'c' : first + i <= S.max ? 'd' : ''}"></i>`).join('')}</span></div>${body}`;
    if (focus) { L.classList.remove('fade'); void L.offsetWidth; L.classList.add('fade'); }
    if (s.type === 'custom') CUSTOM[s.key].bind(); else bindGeneric(s);
    renderSide(); renderLens(); updateNav(); renderXP();
    if (focus) { L.focus({ preventScroll: true }); window.scrollTo({ top: 0 }); } else window.scrollTo({ top: y });
  }
  function go(i) {
    if (i < 0) { addTime(); S.started = false; save(); renderLesson(); window.scrollTo({ top: 0 }); return; }
    if (i >= FLAT.length) return;
    addTime(); S.idx = i; S.max = Math.max(S.max, i); save(); renderLesson();
  }
  const coverEl = document.createElement('div'); coverEl.id = 'cover'; coverEl.hidden = true;
  $('.main').insertBefore(coverEl, $('.chain-scroll'));

  $('#back').onclick = () => go(S.idx - 1);
  $('#next').onclick = () => {
    const s = FLAT[S.idx]; if (!gate(s)) return;
    if (S.idx === FLAT.length - 1) {
      addTime(); S.done = true; S.finishedAt = Date.now(); save();
      award('complete', 250, 'Course complete');
      renderLesson(false);
      const c = $('#cert'); if (c) { c.focus({ preventScroll: true }); c.scrollIntoView({ block: 'center', behavior: reduced() ? 'auto' : 'smooth' }); }
      return;
    }
    go(S.idx + 1);
  };
  /* Restart: always confirmed in a dialog first */
  function confirmRestart() {
    openLayer(`<div class="dialog center" role="dialog" aria-modal="true" aria-labelledby="rs-t" aria-describedby="rs-d">
      <span class="icon-big">${ic('rotate')}</span>
      <h2 id="rs-t">Restart the course?</h2>
      <p class="muted" id="rs-d">This clears your progress, answers, plan, points and badges, and takes you back to the cover. It can't be undone.</p>
      <div class="row" style="justify-content:center"><button class="btn ghost" data-close>Cancel</button><button class="btn accent" id="rs-ok">${ic('rotate')} Restart course</button></div></div>`, '[data-close]');
    $('#rs-ok').onclick = restart;
  }
  function restart() {
    layerQueue.length = 0; layerReturn = null; closeLayer(); closeMenu();
    S = fresh(); save(); enteredAt = Date.now(); renderLesson(); window.scrollTo({ top: 0 });
    toast(`${ic('rotate')}<span>Course restarted</span>`);
    focusSel('#start');
  }
  $('#reset').onclick = confirmRestart;
  const rsBtn = $('#t-restart'); rsBtn.innerHTML = `${ic('rotate')}<span class="lbl-long">Restart</span>`; rsBtn.onclick = confirmRestart;
  $('#t-xp').onclick = achievementsDialog;

  /* Menu drawer */
  const menuBtn = $('#t-menu'); menuBtn.innerHTML = ic('menu');
  function closeMenu() { document.body.classList.remove('menu'); menuBtn.setAttribute('aria-expanded', 'false'); }
  menuBtn.onclick = () => { const o = !document.body.classList.contains('menu'); document.body.classList.toggle('menu', o); menuBtn.setAttribute('aria-expanded', o); if (o) { const b = $('.lessons li.current .lsn') || $('.lsn'); if (b) b.focus(); } };
  $('#scrim').onclick = closeMenu;
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.body.classList.contains('menu')) { closeMenu(); menuBtn.focus(); } });

  /* Preferences */
  let prefs = { lens: false, large: false };
  try { prefs = Object.assign(prefs, JSON.parse(localStorage.getItem(KEY + '-prefs') || '{}')); } catch (e) {}
  const applyPrefs = () => {
    document.body.classList.toggle('lens', prefs.lens); $('#t-lens').setAttribute('aria-pressed', prefs.lens);
    document.documentElement.classList.toggle('large', prefs.large); $('#t-size').setAttribute('aria-pressed', prefs.large);
    try { localStorage.setItem(KEY + '-prefs', JSON.stringify(prefs)); } catch (e) {}
  };
  $('#t-lens').onclick = () => { prefs.lens = !prefs.lens; applyPrefs(); if (S.started) renderSide(); };
  $('#t-size').onclick = () => { prefs.large = !prefs.large; applyPrefs(); };
  applyPrefs();
  renderLesson(false);
})();
