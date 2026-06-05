/* ============================================================
   tour.js — the required guided on-screen tour (spec §7a).
   Runs automatically on first open and is replayable from the
   "Take the tour" control. It drives the flow itself: info steps
   advance with Next; the key action step (approve the CliQ
   payment) waits for the instructor to actually tap the button.
   Tenant-first, ending on the landlord side. Fully bilingual /
   RTL because captions use AR.t and the overlay sits under the
   document's dir.
   ============================================================ */
(function (AR) {
  'use strict';

  var TOTAL = 10;
  var active = false;
  var idx = 0;

  function app() { return AR.app; }

  // Each step: ensure() puts us on the right screen; target(view)
  // returns the element selector to spotlight (or null = centered).
  var steps = [
    { // 1
      ensure: function () { app().go('role'); },
      target: function () { return '#langToggle'; },
      title: 't1_title', body: 't1_body', mode: 'info'
    },
    { // 2
      ensure: function () { app().setRole('tenant'); app().go('tenant/home'); },
      target: function () { return '#greetingBlock'; },
      title: 't2_title', body: 't2_body', mode: 'info'
    },
    { // 3
      ensure: function () { if (app().view !== 'tenant/home') app().go('tenant/home'); },
      target: function () { return '#nextRentCard'; },
      title: 't3_title', body: 't3_body', mode: 'info'
    },
    { // 4 — ACTION: review then approve
      ensure: function () { if (app().view !== 'tenant/home' && app().view !== 'tenant/approval') app().go('tenant/home'); },
      target: function (v) {
        if (v === 'tenant/approval') {
          // Track the current sub-action so the card never covers the
          // control the instructor must touch right now: the confirm
          // chips first, then the slide control once both are confirmed.
          return (AR.screens.approveReady && AR.screens.approveReady())
            ? '#slideArea' : '#approveChips';
        }
        if (v === 'tenant/success') return null;
        return '#reviewBtn';
      },
      title: 't4_title', body: 't4_body', mode: 'action', advanceOn: 'approved'
    },
    { // 5
      ensure: function () { if (app().view !== 'tenant/success') app().go('tenant/success'); },
      target: function () { return '#successCard'; },
      title: 't5_title', body: 't5_body', mode: 'info'
    },
    { // 6
      ensure: function () { app().go('tenant/lease'); },
      target: function () { return '#leaseStatus'; },
      title: 't6_title', body: 't6_body', mode: 'info'
    },
    { // 7
      ensure: function () { app().go('tenant/score'); },
      target: function () { return '#scoreBlock'; },
      title: 't7_title', body: 't7_body', mode: 'info'
    },
    { // 8 — switch to landlord
      ensure: function () { app().setRole('landlord'); app().go('landlord/home'); },
      target: function () { return null; },
      title: 't8_title', body: 't8_body', mode: 'info'
    },
    { // 9
      ensure: function () { if (app().view !== 'landlord/home') app().go('landlord/home'); },
      target: function () { return '#rentReceivedHero'; },
      title: 't9_title', body: 't9_body', mode: 'info'
    },
    { // 10
      ensure: function () { app().go('landlord/tenants'); },
      target: function () { return '#tenantsList'; },
      title: 't10_title', body: 't10_body', mode: 'info'
    }
  ];

  var layer = null;
  function ensureLayer() {
    layer = document.getElementById('tour');
    if (!layer) { layer = document.createElement('div'); layer.id = 'tour'; document.body.appendChild(layer); }
  }

  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  function reposition() {
    if (!active) return;
    var step = steps[idx];
    var sel = step.target(app().view);
    var target = sel ? document.querySelector(sel) : null;
    if (sel && target) {
      // Instant + 'nearest' so the target keeps its natural vertical
      // position (the card placement below depends on which half it's in),
      // and the rect we read next frame is already settled.
      try { target.scrollIntoView({ block: 'nearest', behavior: 'auto' }); } catch (e) {}
    }
    // wait a frame so scroll/layout settles, then draw
    requestAnimationFrame(function () { draw(step, target); });
  }

  function draw(step, target) {
    if (!active) return;
    ensureLayer();
    var shell = document.querySelector('.app-shell');
    var sr = shell ? shell.getBoundingClientRect() : { left: 0, right: window.innerWidth, top: 0, bottom: window.innerHeight, width: window.innerWidth };
    var pad = 8;
    var isAction = step.mode === 'action';

    var html = '<div class="tour-layer">';

    var holeRect = null;
    if (target) {
      var r = target.getBoundingClientRect();
      holeRect = { top: r.top - pad, left: r.left - pad, w: r.width + pad * 2, h: r.height + pad * 2, bottom: r.bottom + pad };
      html += '<div class="tour-hole" style="top:' + holeRect.top + 'px;left:' + holeRect.left + 'px;width:' + holeRect.w + 'px;height:' + holeRect.h + 'px;"></div>';
    } else {
      // full dim, no hole; block stray taps
      html += '<div class="tour-backdrop-block" style="background:rgba(6,10,30,0.72);"></div>';
    }

    // info steps over a spotlight: add a click-blocking backdrop AROUND nothing
    // (the box-shadow already dims; for info steps we also block stray taps via a transparent full layer placed *below* the card but it must not cover the hole — simplest is to skip blocking and rely on Next.)

    var progress = AR.t('tour_step', { n: idx + 1, total: TOTAL });
    var actionHint = isAction ? '<p class="text-xs text-emerald font-semibold mt-2">' + AR.t('tour_action_hint') + '</p>' : '';
    var nextBtn = isAction ? '' :
      '<button id="tourNext" class="btn px-5 bg-emerald text-white text-sm">' +
        (idx === steps.length - 1 ? AR.t('tour_finish') : AR.t('tour_next')) + '</button>';

    html += '<div class="tour-card" id="tourCard">' +
      '<p class="text-xs font-semibold text-emerald mb-1">' + progress + '</p>' +
      '<h3 class="font-bold text-base mb-1">' + AR.t(step.title) + '</h3>' +
      '<p class="text-sm leading-snug text-navy/80">' + AR.t(step.body) + '</p>' +
      actionHint +
      '<div class="flex items-center gap-2 mt-4">' +
        '<button id="tourSkip" class="tap px-3 text-sm font-semibold text-navy/60">' + AR.t('tour_skip') + '</button>' +
        '<span class="ms-auto"></span>' + nextBtn +
      '</div>' +
    '</div>';

    html += '</div>';
    layer.innerHTML = html;

    // position the card
    var card = document.getElementById('tourCard');
    var cw = Math.min(320, sr.width - 24);
    card.style.width = cw + 'px';
    var ch = card.offsetHeight;
    var winH = window.innerHeight;
    var top, left;
    if (holeRect) {
      // Place the card on the opposite side from where the target sits:
      // target in the UPPER half -> card BELOW it; LOWER half -> card ABOVE.
      // This keeps the spotlighted control visible and tappable.
      var targetCenterY = holeRect.top + holeRect.h / 2;
      var placeBelow = targetCenterY < winH / 2;
      if (placeBelow) top = holeRect.bottom + 12;
      else top = holeRect.top - ch - 12;
      top = clamp(top, 12, winH - ch - 12);
      var centerX = holeRect.left + holeRect.w / 2;
      left = clamp(centerX - cw / 2, sr.left + 12, sr.right - cw - 12);
    } else {
      top = clamp(winH / 2 - ch / 2, 20, winH - ch - 20);
      left = sr.left + (sr.width - cw) / 2;
    }
    card.style.top = top + 'px';
    card.style.left = left + 'px';

    var nb = document.getElementById('tourNext');
    if (nb) nb.onclick = function () { advance(); };
    document.getElementById('tourSkip').onclick = function () { finish(true); };
  }

  function showStep(i) {
    idx = i;
    steps[i].ensure();           // navigate (re-renders app)
    reposition();                // draw spotlight on the new screen
  }

  function advance() {
    if (idx >= steps.length - 1) { finish(false); return; }
    showStep(idx + 1);
  }

  function start() {
    // Always begin from an identical clean state (clear + re-seed), then
    // run from step 1. Reuses the app's "Reset demo" logic.
    if (app().resetState) app().resetState();
    active = true;
    idx = 0;
    addListeners();
    showStep(0);
  }

  // Finishing or skipping resets to the clean curated state and drops the
  // instructor into the normal app (role chooser) with no tour running.
  function finish() {
    active = false;
    removeListeners();
    if (layer) layer.innerHTML = '';
    if (app().resetState) app().resetState();
    app().go('role');
  }

  function stop() { active = false; removeListeners(); if (layer) layer.innerHTML = ''; }

  function onResize() { if (active) reposition(); }

  function addListeners() {
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
  }
  function removeListeners() {
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', onResize, true);
  }

  AR.tour = {
    start: start,
    stop: stop,
    isActive: function () { return active; },
    onViewChange: function () { if (active) reposition(); },
    reposition: function () { if (active) reposition(); },
    notify: function (event) {
      if (active && steps[idx].advanceOn === event) advance();
    }
  };

})(window.AR = window.AR || {});
