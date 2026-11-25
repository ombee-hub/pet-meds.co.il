/* ============================================================
   Pet-Meds — Accessibility widget ("תו נגישות")
   The OMBee / Agrosoft widget used on the studio's other sites: round
   floating button with an active-settings count, side panel (full-height
   on phones), white feature cards, multi-level features with a step
   indicator, reading guide, reset button and statement / privacy links.
   Self-contained: injects its own styles, saves choices to localStorage.
   Colors: Pet-Meds navy with the amber accent.
   ============================================================ */
(function () {
  'use strict';

  var STORE_KEY = 'petmeds-a11y';
  try { localStorage.removeItem('pm-a11y-v2'); } catch (e) {} /* settings of the previous widget */

  var FONT = '"Assistant","Rubik","Segoe UI",Arial,sans-serif';
  var T = {
    title: 'תו נגישות', open: 'פתיחת תפריט נגישות', active: 'הגדרות פעילות', close: 'סגירת תפריט הנגישות', dialog: 'הגדרות נגישות',
    reset: 'איפוס כל הגדרות הנגישות', note: 'הצהרת נגישות', privacy: 'מדיניות פרטיות',
    labels: {
      contrast: '+ ניגודיות', links: 'הדגשת קישורים', bigtext: 'טקסט גדול', spacing: 'ריווח טקסט',
      noanim: 'ביטול הנפשות', noimg: 'הסתרת תמונות', dyslexia: 'גופן קריא', cursor: 'סמן גדול',
      lineh: 'גובה שורה', align: 'יישור טקסט', gray: 'גווני אפור', guide: 'קו קריאה'
    }
  };

  /* ---------- feature definitions (cycle = number of states incl. off) ---------- */
  var FEATURES = [
    { id: 'contrast', cycle: 3, icon: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor"/>' },
    { id: 'links',    cycle: 2, icon: '<path d="M9 8H7a4 4 0 0 0 0 8h2"/><path d="M15 8h2a4 4 0 0 1 0 8h-2"/><path d="M8 12h8"/>' },
    { id: 'bigtext',  cycle: 4, icon: '<path d="M3 8V6h9v2"/><path d="M7.5 6v12"/><path d="M6 18h3"/><path d="M13 12v-1.5h8V12"/><path d="M17 10.5V18"/><path d="M15.8 18h2.4"/>' },
    { id: 'spacing',  cycle: 2, icon: '<path d="M6 9l-3 3 3 3"/><path d="M18 9l3 3-3 3"/><path d="M3 12h2M8 12h2M14 12h2M19 12h2"/>' },
    { id: 'noanim',   cycle: 2, icon: '<circle cx="12" cy="12" r="9" stroke-dasharray="2.4 2.4"/><path d="M10 9v6M14 9v6"/>' },
    { id: 'noimg',    cycle: 2, icon: '<path d="M14 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><circle cx="8.5" cy="9.5" r="1.5"/><path d="M21 16l-5-5L5 20"/><path d="M17 3l4 4M21 3l-4 4"/>' },
    { id: 'dyslexia', cycle: 2, icon: '<path d="M3 5h3.5a7 7 0 0 1 0 14H3z"/><path d="M17 19V9.5A3.5 3.5 0 0 1 20.5 6"/><path d="M14.5 11.5h6"/>' },
    { id: 'cursor',   cycle: 2, icon: '<path d="M5 3l6.5 17 2.4-7.1L21 10.5z"/>' },
    { id: 'lineh',    cycle: 3, icon: '<path d="M10 6h11M10 10h11M10 14h11M10 18h11"/><path d="M5 4v16"/><path d="M3 6l2-2 2 2"/><path d="M3 18l2 2 2-2"/>' },
    { id: 'align',    cycle: 2, icon: '<path d="M3 6h18M3 10h12M3 14h18M3 18h12"/>' },
    { id: 'gray',     cycle: 2, icon: '<path d="M12 2.5s-6.5 7-6.5 12a6.5 6.5 0 0 0 13 0c0-5-6.5-12-6.5-12z" fill="currentColor" stroke="none"/>' },
    { id: 'guide',    cycle: 2, icon: '<path d="M3 12h18"/><path d="M7 7h10M7 17h10" opacity=".5"/>' }
  ];

  var state = {};
  try { state = JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { state = {}; }
  FEATURES.forEach(function (f) { state[f.id] = (+state[f.id] || 0) % f.cycle; });

  /* ---------- injected styles ---------- */
  /* MAIN = navy (white text passes AA on it), MAIN2 = lighter navy, MAIN_DARK = darkest navy, ACCENT = amber, INK = near-black */
  var MAIN = '#16325c', MAIN2 = '#1f4275', MAIN_DARK = '#0f2445', ACCENT = '#f2a516', INK = '#1b2433';
  /* page regions the effects apply to — the widget itself is never touched */
  var R = ':is(.topbar,.header,main,.footer,.drawer,.cookie-banner)';
  var css = [
    /* floating button */
    '#a11y-btn{position:fixed;bottom:22px;left:22px;z-index:99998;width:50px;height:50px;border-radius:50%;border:none;padding:0;',
    'background:linear-gradient(135deg,' + MAIN + ',' + MAIN2 + ');color:#fff;cursor:pointer;box-shadow:0 4px 20px rgba(15,36,69,.35);',
    'display:flex;align-items:center;justify-content:center;transition:transform .3s ease,box-shadow .3s ease,bottom .3s ease}',
    '#a11y-btn::before{content:"";position:absolute;inset:5px;border:2px solid #fff;border-radius:50%;pointer-events:none}',
    '#a11y-btn:hover{transform:scale(1.08);box-shadow:0 6px 28px rgba(15,36,69,.5)}',
    '#a11y-btn:focus-visible{outline:3px solid ' + ACCENT + ';outline-offset:3px}',
    '#a11y-btn svg{width:26px;height:26px}',
    '#a11y-count{position:absolute;top:-4px;right:-4px;min-width:20px;height:20px;padding:0 5px;border-radius:10px;',
    'background:' + ACCENT + ';color:' + MAIN_DARK + ';font:800 11px/20px ' + FONT + ';text-align:center;display:none;box-shadow:0 0 0 2px #fff}',
    '#a11y-btn.active #a11y-count{display:block}',

    /* overlay + panel */
    '#a11y-overlay{position:fixed;inset:0;z-index:99998;background:rgba(15,36,69,.5);opacity:0;pointer-events:none;transition:opacity .3s ease}',
    '#a11y-overlay.open{opacity:1;pointer-events:auto}',
    '#a11y-panel{position:fixed;bottom:0;left:0;z-index:99999;width:min(320px,88vw);max-height:100vh;height:auto;overflow-y:auto;overscroll-behavior:contain;padding-bottom:env(safe-area-inset-bottom);',
    'background:linear-gradient(170deg,#f6f8fc,#e6edf7);border-radius:0 18px 0 0;box-shadow:8px 0 40px rgba(15,36,69,.4);',
    'transform:translateX(-105%);visibility:hidden;transition:transform .35s cubic-bezier(.4,0,.2,1),visibility 0s linear .35s;',
    'direction:rtl;text-align:start;font-family:' + FONT + ';color:' + INK + ';line-height:1.4;letter-spacing:normal;word-spacing:normal;font-size:16px}',
    '#a11y-panel.open{transform:none;visibility:visible;transition:transform .35s cubic-bezier(.4,0,.2,1)}',
    '#a11y-panel::-webkit-scrollbar{width:5px}',
    '#a11y-panel::-webkit-scrollbar-thumb{background:rgba(22,50,92,.35);border-radius:5px}',

    /* header */
    '#a11y-head{position:sticky;top:0;z-index:2;background:rgba(255,255,255,.6);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);',
    'border-bottom:1px solid rgba(22,50,92,.15);margin-bottom:8px;display:flex;align-items:center;justify-content:space-between;gap:8px;padding:12px 12px 8px}',
    '#a11y-title{font:800 17px/1.2 ' + FONT + ';color:' + INK + ';margin:0;display:flex;align-items:center;gap:8px;letter-spacing:normal}',
    '#a11y-title span{color:' + MAIN + ';display:flex}',
    '#a11y-title svg{width:24px;height:24px}',
    '#a11y-close{width:28px;height:28px;border-radius:50%;border:none;background:rgba(22,50,92,.12);color:' + INK + ';cursor:pointer;',
    'display:flex;align-items:center;justify-content:center;flex-shrink:0;padding:0}',
    '#a11y-close:hover{background:' + MAIN + ';color:#fff}',
    '#a11y-close:focus-visible{outline:3px solid ' + MAIN + ';outline-offset:2px}',
    '#a11y-close svg{width:14px;height:14px}',

    /* feature cards */
    '#a11y-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:4px 12px 12px}',
    '.a11y-tile{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;min-height:104px;padding:14px 6px;position:relative;',
    'border:2px solid transparent;border-radius:12px;background:#fff;color:#111;font-family:inherit;cursor:pointer;text-align:center;',
    'box-shadow:0 2px 10px rgba(22,50,92,.12);transition:border-color .2s,box-shadow .2s,background .2s}',
    '.a11y-tile:hover{border-color:' + MAIN + ';box-shadow:0 6px 16px rgba(22,50,92,.2)}',
    '.a11y-tile:focus-visible{outline:3px solid ' + ACCENT + ';outline-offset:2px}',
    '.a11y-tile[aria-pressed="true"]{background:' + MAIN + ';border-color:' + MAIN + ';color:#fff}',
    '.a11y-ico{display:flex;width:28px;height:28px}',
    '.a11y-ico svg{width:100%;height:100%}',
    '.a11y-label{font-size:13px;font-weight:800;line-height:1.25}',
    '.a11y-check{position:absolute;top:7px;right:7px;width:18px;height:18px;border-radius:50%;background:' + ACCENT + ';color:' + MAIN_DARK + ';display:none;align-items:center;justify-content:center}',
    '.a11y-check svg{width:11px;height:11px}',
    '.a11y-tile[aria-pressed="true"] .a11y-check{display:flex}',
    '.a11y-step{position:absolute;top:7px;left:8px;font-size:11px;font-weight:800;line-height:18px}',

    /* reset + bottom links */
    '#a11y-reset{display:flex;align-items:center;justify-content:center;gap:10px;width:calc(100% - 24px);margin:6px 12px 14px;padding:13px 14px;',
    'border:none;border-radius:10px;background:linear-gradient(135deg,' + MAIN + ',' + MAIN2 + ');color:#fff;box-shadow:0 6px 18px rgba(22,50,92,.3);',
    'font:800 14px ' + FONT + ';cursor:pointer;transition:filter .2s}',
    '#a11y-reset:hover{filter:brightness(1.15)}',
    '#a11y-reset:focus-visible{outline:3px solid ' + ACCENT + ';outline-offset:2px}',
    '#a11y-reset svg{width:20px;height:20px;flex-shrink:0}',
    '#a11y-bottom{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:0 12px 16px}',
    '#a11y-bottom a{display:flex;align-items:center;justify-content:center;gap:6px;padding:11px 6px;border-radius:10px;background:#fff;',
    'border:1.5px solid ' + MAIN + ';font:800 12.5px/1.3 ' + FONT + ';color:' + MAIN + ';text-decoration:none;',
    'box-shadow:0 4px 12px rgba(22,50,92,.15);transition:background .2s,color .2s;text-align:center}',
    '#a11y-bottom a:hover{background:' + MAIN + ';color:#fff}',
    '#a11y-bottom a:focus-visible{outline:3px solid ' + ACCENT + ';outline-offset:2px}',
    '#a11y-bottom svg{width:15px;height:15px;flex-shrink:0}',
    '#a11y-guide-bar{position:fixed;left:0;right:0;height:10px;background:' + ACCENT + ';opacity:.85;z-index:99997;pointer-events:none;display:none;box-shadow:0 0 0 2px ' + MAIN_DARK + '}',

    /* ---------- feature effects (page regions only, so the widget stays usable) ---------- */
    /* contrast 1: black background, white text, yellow links */
    'html.a11y-contrast-1 body,html.a11y-contrast-1 ' + R + ',html.a11y-contrast-1 ' + R + ' :is(.section,.hero,.page-hero,.feature,.service,.member,.review,.faq details,.form-card,.contact__card,.cta-band,.legal-intro,.legal-toc,.legal-contact>div,.form input,.form select,.form textarea,.partners span,.hero__badge){background:#000!important;color:#fff!important;border-color:#fff!important;box-shadow:none!important}',
    'html.a11y-contrast-1 .page-hero::before{display:none}',
    'html.a11y-contrast-1 ' + R + ' :is(h1,h2,h3,h4,p,li,summary,span,strong,td,label,cite,blockquote,div,small){color:#fff!important}',
    'html.a11y-contrast-1 ' + R + ' a{color:#ffef5c!important}',
    'html.a11y-contrast-1 ' + R + ' .btn{background:#000!important;border-color:#ffef5c!important;color:#ffef5c!important}',
    'html.a11y-contrast-1 ' + R + ' .btn *{color:#ffef5c!important}',
    /* contrast 2 + grayscale: filters on the page regions */
    'html.a11y-contrast-2{--a11y-inv:invert(1) hue-rotate(180deg)}',
    'html.a11y-gray-1{--a11y-sat:grayscale(1)}',
    'html:is(.a11y-contrast-2,.a11y-gray-1) :is(.topbar,.header,main,.footer,.drawer,.cookie-banner,.fab){filter:var(--a11y-inv,invert(0)) var(--a11y-sat,saturate(1))}',
    'html.a11y-contrast-2 :is(main,.header,.footer,.drawer) :is(img,iframe){filter:invert(1) hue-rotate(180deg)}',
    'html.a11y-contrast-2 .footer__brand img,html.a11y-contrast-2 .footer__credit img{filter:none}',
    'html.a11y-links-1 ' + R + ' a{text-decoration:underline!important;text-underline-offset:3px;background:#fff34d!important;color:#0b2e8a!important}',
    'html.a11y-links-1 ' + R + ' a *{color:#0b2e8a!important}',
    'html.a11y-bigtext-1{font-size:112.5%!important}',
    'html.a11y-bigtext-2{font-size:125%!important}',
    'html.a11y-bigtext-3{font-size:140%!important}',
    'html.a11y-spacing-1 ' + R + ',html.a11y-spacing-1 ' + R + ' *{letter-spacing:.12em!important;word-spacing:.2em!important}',
    'html.a11y-noanim-1 *,html.a11y-noanim-1 *::before,html.a11y-noanim-1 *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}',
    'html.a11y-noanim-1 .reveal{opacity:1!important;transform:none!important}',
    'html.a11y-noimg-1 ' + R + ' :is(img,iframe){visibility:hidden!important}',
    'html.a11y-noimg-1 ' + R + ',html.a11y-noimg-1 ' + R + ' *{background-image:none!important}',
    'html.a11y-dyslexia-1 ' + R + ' :not(svg,svg *){font-family:Verdana,Tahoma,Arial,sans-serif!important;font-style:normal!important}',
    'html.a11y-cursor-1,html.a11y-cursor-1 *{cursor:url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'44\' height=\'44\' viewBox=\'0 0 24 24\'><path d=\'M5 2l14 10-7 1 4 8-4 2-4-8-3 5Z\' fill=\'%23111\' stroke=\'white\' stroke-width=\'1.4\'/></svg>") 4 2,auto!important}',
    'html.a11y-lineh-1 ' + R + ' :is(p,li,dd,dt,a,h1,h2,h3,h4,summary,label,figcaption,blockquote){line-height:2!important}',
    'html.a11y-lineh-2 ' + R + ' :is(p,li,dd,dt,a,h1,h2,h3,h4,summary,label,figcaption,blockquote){line-height:2.6!important}',
    'html.a11y-align-1 ' + R + ' *{text-align:right!important}',
    '#a11y-btn,.a11y-tile,#a11y-reset,#a11y-bottom a,#a11y-close{-webkit-tap-highlight-color:transparent}',
    'html.a11y-open,html.a11y-open body{overflow:hidden}',

    /* mobile: full-height side panel */
    '@media(max-width:600px){',
    '  #a11y-btn{bottom:16px;left:16px}',
    '  #a11y-panel{top:0;bottom:0;max-height:none;border-radius:0 18px 18px 0}',
    '  #a11y-head{padding:max(12px,env(safe-area-inset-top)) 12px 8px}',
    '  #a11y-grid{gap:8px;padding:4px 10px 10px}',
    '  .a11y-tile{min-height:92px;gap:9px;padding:12px 4px}',
    '  .a11y-label{font-size:13px}',
    '  #a11y-reset{width:calc(100% - 20px);margin:4px 10px 12px}',
    '  #a11y-bottom{padding:0 10px 16px}',
    '}',
    '@media(prefers-reduced-motion:reduce){#a11y-panel,#a11y-overlay,#a11y-btn{transition:none}}'
  ].join('\n');

  var styleEl = document.createElement('style');
  styleEl.id = 'a11y-styles';
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  /* ---------- DOM ---------- */
  var SV = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';
  var A11Y_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="3.8" r="2.2"/><path d="M20.5 8.7c-2.6.7-5.5 1.1-8.5 1.1s-5.9-.4-8.5-1.1c-.5-.1-1 .2-1.1.7-.1.5.2 1 .7 1.1 2.3.6 4.7 1 7.2 1.1v3.6L7.5 21c-.2.5 0 1.1.5 1.3.5.2 1.1 0 1.3-.5L11.7 16h.6l2.4 5.8c.2.5.8.7 1.3.5.5-.2.7-.8.5-1.3L13.7 15v-3.5c2.5-.1 4.9-.5 7.2-1.1.5-.1.8-.6.7-1.1-.1-.5-.6-.8-1.1-.7z"/></svg>';

  var btn = document.createElement('button');
  btn.id = 'a11y-btn';
  btn.type = 'button';
  btn.setAttribute('aria-label', T.open);
  btn.setAttribute('aria-haspopup', 'dialog');
  btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-controls', 'a11y-panel');
  btn.setAttribute('title', T.title);
  btn.innerHTML = A11Y_ICON + '<span id="a11y-count" aria-hidden="true"></span>';

  var overlay = document.createElement('div');
  overlay.id = 'a11y-overlay';

  var panel = document.createElement('div');
  panel.id = 'a11y-panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', T.dialog);
  panel.setAttribute('lang', 'he');
  panel.setAttribute('dir', 'rtl');

  var html = '<div id="a11y-head"><h2 id="a11y-title"><span>' + A11Y_ICON + '</span>' + T.title + '</h2>' +
    '<button id="a11y-close" type="button" aria-label="' + T.close + '">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
    '</button></div><div id="a11y-grid">';
  FEATURES.forEach(function (f) {
    html += '<button class="a11y-tile" type="button" data-id="' + f.id + '" data-cycle="' + f.cycle + '" aria-pressed="false">' +
      '<span class="a11y-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12l5 5 9-10"/></svg></span>' +
      '<span class="a11y-step" aria-hidden="true"></span>' +
      '<span class="a11y-ico"><svg ' + SV + '>' + f.icon + '</svg></span>' +
      '<span class="a11y-label">' + T.labels[f.id] + '</span></button>';
  });
  html += '</div>' +
    '<button id="a11y-reset" type="button"><svg ' + SV + ' stroke-width="2.2"><path d="M20 11a8 8 0 0 0-14.3-4.9L4 8"/><path d="M4 3v5h5"/><path d="M4 13a8 8 0 0 0 14.3 4.9L20 16"/><path d="M20 21v-5h-5"/></svg>' + T.reset + '</button>' +
    '<div id="a11y-bottom">' +
      '<a href="accessibility.html"><svg ' + SV + ' stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8"/></svg>' + T.note + '</a>' +
      '<a href="privacy.html"><svg ' + SV + ' stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>' + T.privacy + '</a>' +
    '</div>';
  panel.innerHTML = html;

  var guideBar = document.createElement('div');
  guideBar.id = 'a11y-guide-bar';
  guideBar.setAttribute('aria-hidden', 'true');

  document.body.appendChild(guideBar);
  document.body.appendChild(overlay);
  document.body.appendChild(panel);
  document.body.appendChild(btn);

  var count = btn.querySelector('#a11y-count');
  var closeBtn = panel.querySelector('#a11y-close');

  /* ---------- behaviour ---------- */
  function apply(id, level) {
    var root = document.documentElement;
    var f = FEATURES.filter(function (x) { return x.id === id; })[0];
    if (!f) return;
    for (var i = 1; i < f.cycle; i++) root.classList.remove('a11y-' + id + '-' + i);
    if (level > 0) root.classList.add('a11y-' + id + '-' + level);

    var tile = panel.querySelector('[data-id="' + id + '"]');
    if (tile) {
      tile.setAttribute('aria-pressed', level > 0 ? 'true' : 'false');
      tile.querySelector('.a11y-step').textContent = (f.cycle > 2 && level > 0) ? level + '/' + (f.cycle - 1) : '';
    }
    if (id === 'guide') guideBar.style.display = level > 0 ? 'block' : 'none';
  }

  function updateCount() {
    var n = FEATURES.filter(function (f) { return state[f.id] > 0; }).length;
    btn.classList.toggle('active', n > 0);
    count.textContent = n || '';
    btn.setAttribute('aria-label', n ? T.open + ' (' + n + ' ' + T.active + ')' : T.open);
  }

  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) {} }

  function openPanel() {
    panel.classList.add('open');
    overlay.classList.add('open');
    document.documentElement.classList.add('a11y-open');
    btn.style.visibility = 'hidden';
    btn.setAttribute('aria-expanded', 'true');
    setTimeout(function () { closeBtn.focus(); }, 50);
  }
  function closePanel() {
    if (!panel.classList.contains('open')) return;
    panel.classList.remove('open');
    overlay.classList.remove('open');
    document.documentElement.classList.remove('a11y-open');
    btn.style.visibility = '';
    btn.setAttribute('aria-expanded', 'false');
    btn.focus();
  }

  panel.addEventListener('click', function (e) {
    var tile = e.target.closest('.a11y-tile');
    if (tile) {
      var id = tile.getAttribute('data-id');
      var cycle = parseInt(tile.getAttribute('data-cycle'), 10);
      state[id] = ((state[id] || 0) + 1) % cycle;
      apply(id, state[id]);
      updateCount();
      save();
      return;
    }
    if (e.target.closest('#a11y-reset')) {
      Object.keys(state).forEach(function (id) { apply(id, 0); });
      state = {};
      updateCount();
      save();
      return;
    }
    if (e.target.closest('#a11y-close')) closePanel();
  });

  btn.addEventListener('click', openPanel);
  overlay.addEventListener('click', closePanel);

  /* Escape closes; Tab stays inside the panel while it is open */
  document.addEventListener('keydown', function (e) {
    if (!panel.classList.contains('open')) return;
    if (e.key === 'Escape') { closePanel(); return; }
    if (e.key !== 'Tab') return;
    var f = Array.prototype.filter.call(panel.querySelectorAll('button,a[href]'), function (el) { return el.offsetParent !== null; });
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  document.addEventListener('mousemove', function (e) {
    if (guideBar.style.display === 'block') guideBar.style.top = (e.clientY + 14) + 'px';
  });

  /* the cookie banner lifts the button through CSS (body.has-cookie-banner, see css/style.css) */

  /* restore saved settings */
  Object.keys(state).forEach(function (id) {
    if (state[id] > 0) apply(id, state[id]);
  });
  updateCount();
})();
