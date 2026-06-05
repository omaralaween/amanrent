/* ============================================================
   app.js — application controller.
   Holds the live state, handles routing between screens, the
   top bar / bottom nav, language + RTL switching, role switching,
   and all click actions (via one delegated listener). Screen
   markup lives in screens.js; the tour lives in tour.js.
   ============================================================ */
(function (AR) {
  'use strict';

  var S;                 // live state (loaded/seeded from storage)
  var view = 'splash';   // current full-screen view id
  var params = {};       // params for the current view
  var menuOpen = false;
  var autoTourStarted = false; // session-scoped: auto-run the tour once per page load

  /* ---- date helpers (deterministic from "today") ---------------- */
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  var now = new Date();
  var due = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  var DUE_ISO = due.getFullYear() + '-' + pad(due.getMonth() + 1) + '-01';
  var DUE_MONTH_IDX = due.getMonth();

  function genRef() {
    var n = Math.floor(10000000 + Math.random() * 89999999);
    return 'AR-' + n;
  }

  /* ---- persistence + language ----------------------------------- */
  function save() { AR.storage.save(S); }

  function applyLangDir() {
    AR.i18n.lang = S.lang;
    document.documentElement.lang = S.lang;
    document.documentElement.dir = S.lang === 'ar' ? 'rtl' : 'ltr';
  }

  /* ---- tab mapping (sub-views map to a parent bottom-nav tab) ---- */
  var TAB_OF = {
    'tenant/home': 'tenant/home', 'tenant/approval': 'tenant/home', 'tenant/success': 'tenant/home',
    'tenant/lease': 'tenant/lease', 'tenant/contract': 'tenant/lease',
    'tenant/payments': 'tenant/payments', 'tenant/score': 'tenant/score',
    'landlord/home': 'landlord/home',
    'landlord/properties': 'landlord/properties', 'landlord/unit': 'landlord/properties', 'landlord/addProperty': 'landlord/properties',
    'landlord/tenants': 'landlord/tenants', 'landlord/addTenant': 'landlord/tenants',
    'landlord/payments': 'landlord/payments'
  };

  /* ---- navigation ----------------------------------------------- */
  function go(v, p) {
    AR.autofill.cancel();
    menuOpen = false;
    view = v;
    params = p || {};
    render();
    if (AR.tour) AR.tour.onViewChange(view);
  }

  function setRole(r) { S.role = r; save(); }

  function setLang(l) {
    S.lang = l;
    applyLangDir();
    save();
    render();
    if (AR.tour) AR.tour.reposition();
  }

  /* ---- icons (minimal geometric line set) ----------------------- */
  function icon(name, cls) {
    var P = {
      home: '<path d="M3 11.5 12 4l9 7.5M5 10v10h14V10"/>',
      fwd: '<path d="M9 5l7 7-7 7"/>',
      swap: '<path d="M4 8h12"/><path d="M13 5l3 3-3 3"/><path d="M20 16H8"/><path d="M11 13l-3 3 3 3"/>',
      lease: '<path d="M7 3h7l4 4v14H7zM14 3v4h4"/><path d="M9 12h6M9 16h6"/>',
      card: '<rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18"/>',
      gauge: '<path d="M5 18a8 8 0 1 1 14 0"/><path d="M12 14l4-3"/>',
      building: '<rect x="5" y="3" width="14" height="18" rx="1"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/>',
      users: '<circle cx="9" cy="8" r="3"/><path d="M3 20a6 6 0 0 1 12 0"/><path d="M16 6a3 3 0 0 1 0 6M21 20a6 6 0 0 0-5-5.9"/>',
      dots: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
      back: '<path d="M15 5l-7 7 7 7"/>',
      check: '<path d="M5 13l4 4L19 7"/>'
    };
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round" stroke-linejoin="round" class="' + (cls || 'w-6 h-6') + '">' +
      (P[name] || '') + '</svg>';
  }

  /* ---- logo: green on dark surfaces, blue on light (brand rule) -- */
  function logoImg(surface, cls) {
    var color = surface === 'light' ? 'Blue' : 'Green';
    var base = 'AmanRent Logo - ' + color;
    var svg = encodeURI(base + '.svg');
    var png = encodeURI(base + '.png');
    return '<img src="' + svg + '" onerror="this.onerror=null;this.src=\'' + png + '\'" ' +
      'alt="AmanRent" class="' + (cls || '') + '">';
  }

  /* ---- top bar -------------------------------------------------- */
  function topBar() {
    var langBtn =
      '<button data-action="lang-toggle" class="tap px-3 rounded-full bg-white/10 text-white text-sm font-semibold" ' +
      'aria-label="Language">' + (S.lang === 'ar' ? 'EN' : 'ع') + '</button>';

    // Switch role is a direct control that navigates to the role-chooser
    // screen (no in-place popover for role switching).
    var switchRoleBtn =
      '<button data-action="switch-role" class="tap w-11 rounded-full bg-white/10 text-white grid place-items-center" ' +
      'aria-label="' + AR.t('switch_role') + '" title="' + AR.t('switch_role') + '">' + icon('swap', 'w-5 h-5') + '</button>';

    var menuBtn =
      '<button data-action="menu-toggle" class="tap w-11 rounded-full bg-white/10 text-white grid place-items-center" ' +
      'aria-haspopup="true" aria-expanded="' + (menuOpen ? 'true' : 'false') + '" ' +
      'aria-label="' + AR.t('menu') + '">' + icon('dots', 'w-5 h-5') + '</button>';

    // logo + wordmark may shrink/truncate; the controls never shrink, so
    // the language toggle and menu button can never be crowded off-bar.
    return '' +
      '<header class="shrink-0 bg-darknavy/95 backdrop-blur px-3 h-14 flex items-center gap-2 border-b border-white/10">' +
        '<div class="flex items-center gap-2 min-w-0 flex-1">' +
          logoImg('dark', 'w-8 h-8 shrink-0') +
          '<span class="font-bold text-white truncate">' + AR.t('brand') + '</span>' +
          '<span class="hidden xs:inline shrink-0 text-[10px] px-1.5 py-0.5 rounded bg-emerald/15 text-emerald border border-emerald/30">' + AR.t('mock_badge') + '</span>' +
        '</div>' +
        '<div class="flex items-center gap-2 shrink-0">' + langBtn + switchRoleBtn + menuBtn + '</div>' +
      '</header>';
  }

  /* ---- menu (popover, rendered at shell level so it floats above
     everything with its own scrim — never overlapping the top-bar
     controls, and clearly elevated above page content) ------------ */
  function menuOverlay() {
    if (!menuOpen) return '';
    function item(action, label) {
      return '<button data-action="' + action + '" class="w-full text-start px-3 py-3 rounded-lg hover:bg-black/5 active:bg-black/10 text-sm font-medium tap">' + label + '</button>';
    }
    return '' +
      '<div class="absolute inset-0 z-[60]">' +
        '<div data-action="menu-close" class="absolute inset-0 bg-black/40"></div>' +
        '<div role="menu" class="absolute end-2 top-[60px] w-56 max-w-[78%] card-light p-1 rounded-2xl shadow-2xl ring-1 ring-black/10 fade-up text-start">' +
          item('take-tour', AR.t('take_tour')) +
          item('reset-demo', '<span class="text-red-600">' + AR.t('reset_demo') + '</span>') +
        '</div>' +
      '</div>';
  }

  /* ---- bottom nav ----------------------------------------------- */
  function bottomNav() {
    var tabs = S.role === 'tenant'
      ? [['tenant/home', 'home', 'nav_home'], ['tenant/lease', 'lease', 'nav_lease'], ['tenant/payments', 'card', 'nav_payments'], ['tenant/score', 'gauge', 'nav_score']]
      : [['landlord/home', 'home', 'nav_home'], ['landlord/properties', 'building', 'nav_properties'], ['landlord/tenants', 'users', 'nav_tenants'], ['landlord/payments', 'card', 'nav_payments']];

    var active = TAB_OF[view];
    var items = tabs.map(function (t) {
      var on = t[0] === active;
      var cls = on ? 'text-emerald' : 'text-white/55';
      return '<button data-action="nav" data-view="' + t[0] + '" class="flex-1 h-16 flex flex-col items-center justify-center gap-0.5 ' + cls + '">' +
        icon(t[1], 'w-6 h-6') +
        '<span class="text-[11px] font-medium">' + AR.t(t[2]) + '</span>' +
        '</button>';
    }).join('');

    return '<nav class="shrink-0 bg-darknavy/95 border-t border-white/10 flex">' + items + '</nav>';
  }

  /* ---- render --------------------------------------------------- */
  function render() {
    var root = document.getElementById('app');

    if (view === 'splash') {
      root.innerHTML = '<div class="app-shell">' + AR.screens.splash() + '</div>';
    } else if (view === 'role') {
      root.innerHTML = '<div class="app-shell">' + AR.screens.role() + '</div>';
    } else {
      root.innerHTML =
        '<div class="app-shell">' +
          topBar() +
          '<main class="screen-scroll screen-in" id="scrollArea">' +
            AR.screens.content(view, params, S) +
          '</main>' +
          bottomNav() +
          menuOverlay() +
        '</div>';
    }
    if (AR.screens.mount) AR.screens.mount(view, params, S);
  }

  /* ---- toast ---------------------------------------------------- */
  function toast(msg) {
    var root = document.getElementById('toasts');
    var el = document.createElement('div');
    el.className = 'toast-in pointer-events-auto mx-auto max-w-[360px] card-light text-navy text-sm font-medium px-4 py-3 rounded-xl shadow-lg flex items-center gap-2';
    el.innerHTML = '<span class="text-emerald">' + icon('check', 'w-5 h-5') + '</span><span>' + msg + '</span>';
    root.appendChild(el);
    setTimeout(function () {
      el.style.transition = 'opacity .3s'; el.style.opacity = '0';
      setTimeout(function () { el.remove(); }, 320);
    }, 2400);
  }

  /* ---- action handlers ------------------------------------------ */
  function approvePayment() {
    S.shared.laylaPaidThisMonth = true;
    S.shared.laylaPaymentRef = genRef();
    // record the payment in tenant history
    S.tenantPayments.unshift({
      month: DUE_MONTH_IDX, year: due.getFullYear(), amount: S.lease.rent,
      paid: DUE_ISO, kind: 'ontime', automated: true, justNow: true
    });
    // score ticks up with an explanation (still reliable, longer streak)
    S.tenantScore.months = (S.tenantScore.months || 11) + 1;
    S.tenantScore.value = Math.min(1000, (S.tenantScore.value || 870) + 10);
    save();
    go('tenant/success');
    if (AR.tour) AR.tour.notify('approved');
  }

  // Single source of truth for "clean curated starting state": wipes
  // storage and re-seeds (Layla unpaid, scores at initial values, pools
  // full/unused). The tour reuses this on start and on finish/skip.
  function resetState() {
    S = AR.storage.reset();
    S.lang = AR.i18n.lang; // keep the current language for convenience
    save();
    return S;
  }

  function doReset() {
    if (!window.confirm(AR.t('reset_confirm'))) return;
    if (AR.tour) AR.tour.stop();
    resetState();
    go('splash');
    toast(AR.t('reset_demo'));
  }

  function handleAction(action, ds, el) {
    switch (action) {
      case 'enter-demo':
        // Auto-run the tour once per page load (a true "first launch").
        // tour.start() resets to the clean state and begins at step 1.
        if (!autoTourStarted && AR.tour) {
          autoTourStarted = true;
          AR.tour.start();
        } else {
          go('role');
        }
        break;
      case 'choose-role':
        setRole(ds.role);
        go(ds.role + '/home');
        break;
      case 'nav':
        go(ds.view);
        break;
      case 'go':
        go(ds.view, ds.id ? { id: ds.id } : {});
        break;
      case 'back':
        go(ds.view);
        break;
      case 'lang-toggle':
        setLang(S.lang === 'ar' ? 'en' : 'ar');
        break;
      case 'menu-toggle':
        menuOpen = !menuOpen; render();
        break;
      case 'menu-close':
        menuOpen = false; render();
        break;
      case 'switch-role':
        // Go to the role-chooser screen; the role is picked there.
        go('role');
        break;
      case 'take-tour':
        menuOpen = false;
        autoTourStarted = true; // suppress a later auto-start this session
        if (AR.tour) AR.tour.start(); // start() resets first, then runs step 1
        break;
      case 'reset-demo':
        doReset();
        break;
      case 'review-payment':
        go('tenant/approval');
        if (AR.tour) AR.tour.notify('review');
        break;
      case 'approve-payment':
        approvePayment();
        break;
      case 'open-contract':
        go('tenant/contract');
        break;
      case 'view-unit':
        go('landlord/unit', { id: ds.id });
        break;
      case 'add-property':
        go('landlord/addProperty');
        break;
      case 'add-tenant':
        go('landlord/addTenant');
        break;
      case 'save-property':
        if (AR.screens.commitProperty) AR.screens.commitProperty(S);
        save();
        go('landlord/properties');
        toast(AR.t('property_added'));
        break;
      case 'save-tenant':
        if (AR.screens.commitTenant) AR.screens.commitTenant(S);
        save();
        go('landlord/tenants');
        toast(AR.t('tenant_added'));
        break;
      case 'toggle-score':
        toggleScore(ds.target, el);
        break;
    }
  }

  function toggleScore(targetId, btn) {
    var box = document.getElementById(targetId);
    if (!box) return;
    var open = box.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    var more = btn.querySelector('[data-role="more"]');
    var less = btn.querySelector('[data-role="less"]');
    if (more) more.classList.toggle('hidden', open);
    if (less) less.classList.toggle('hidden', !open);
  }

  /* ---- delegated click listener --------------------------------- */
  function onClick(e) {
    var el = e.target.closest('[data-action]');
    if (!el) {
      // tapping outside the menu closes it
      if (menuOpen) { menuOpen = false; render(); }
      return;
    }
    var action = el.getAttribute('data-action');
    handleAction(action, el.dataset, el);
  }

  /* ---- public API (used by screens.js, tour.js) ----------------- */
  AR.app = {
    get state() { return S; },
    save: save,
    go: go,
    setRole: setRole,
    setLang: setLang,
    render: render,
    approve: approvePayment,
    resetState: resetState,
    toast: toast,
    icon: icon,
    logoImg: logoImg,
    money: AR.money,
    dueISO: DUE_ISO,
    dueMonthIdx: DUE_MONTH_IDX,
    genRef: genRef,
    get view() { return view; }
  };

  /* ---- boot ----------------------------------------------------- */
  function boot() {
    S = AR.storage.loadOrSeed();
    if (!S.lang) S.lang = 'en';
    applyLangDir();
    document.getElementById('app').addEventListener('click', onClick);
    go('splash');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

})(window.AR = window.AR || {});
