/* ============================================================
   screens.js — markup for every screen + the autofill form
   wiring (mount) and the commit functions that append a saved
   property / tenant to state. Pure-ish render: each builder
   returns an HTML string; app.js composes the shell around it.
   ============================================================ */
(function (AR) {
  'use strict';

  function t(k, v) { return AR.t(k, v); }
  function L(o) {
    return (o && typeof o === 'object' && (('en' in o) || ('ar' in o)))
      ? (o[AR.i18n.lang] || o.en) : o;
  }
  function icon(n, c) { return AR.app.icon(n, c); }
  function money(n) { return AR.money(n); }

  /* -------------------------------------------------------------- */
  /*  SPLASH                                                        */
  /* -------------------------------------------------------------- */
  function splash() {
    return '' +
      '<div class="h-full flex flex-col bg-darknavy text-white">' +
        '<div class="flex justify-end p-4">' +
          '<button data-action="lang-toggle" class="tap px-3 rounded-full bg-white/10 text-sm font-semibold">' +
            (AR.i18n.lang === 'ar' ? 'EN' : 'ع') + '</button>' +
        '</div>' +
        '<div class="flex-1 flex flex-col items-center justify-center px-8 text-center">' +
          '<div class="fade-up">' + AR.app.logoImg('dark', 'w-28 h-28 mx-auto') + '</div>' +
          '<h1 class="fade-up delay-1 mt-5 text-3xl font-bold">' + t('brand') + '</h1>' +
          '<p class="fade-up delay-2 mt-3 text-white/80 text-lg leading-snug max-w-[280px]">' + t('slogan') + '</p>' +
        '</div>' +
        '<div class="px-8 pb-10 space-y-5">' +
          '<button data-action="enter-demo" class="btn w-full bg-emerald text-white text-lg fade-up delay-3">' + t('enter_demo') + '</button>' +
          '<p class="text-center text-xs text-white/50">' + t('demo_footer') + '</p>' +
        '</div>' +
      '</div>';
  }

  /* -------------------------------------------------------------- */
  /*  ROLE CHOOSER                                                  */
  /* -------------------------------------------------------------- */
  function roleCard(role, ic, name, desc) {
    return '' +
      '<button data-action="choose-role" data-role="' + role + '" ' +
        'class="card w-full text-start p-5 flex items-center gap-4 active:scale-[.99] transition">' +
        '<span class="w-14 h-14 rounded-2xl bg-emerald/15 text-emerald grid place-items-center shrink-0">' + icon(ic, 'w-7 h-7') + '</span>' +
        '<span class="min-w-0">' +
          '<span class="block text-xl font-bold">' + name + '</span>' +
          '<span class="block text-sm text-white/70 mt-0.5">' + desc + '</span>' +
        '</span>' +
      '</button>';
  }

  function role() {
    return '' +
      '<div class="h-full flex flex-col bg-darknavy text-white">' +
        '<header class="flex items-center gap-2 px-4 h-14 border-b border-white/10">' +
          AR.app.logoImg('dark', 'w-8 h-8') +
          '<span class="font-bold">' + t('brand') + '</span>' +
          '<button id="langToggle" data-action="lang-toggle" class="ms-auto tap px-3 rounded-full bg-white/10 text-sm font-semibold">' +
            (AR.i18n.lang === 'ar' ? 'EN' : 'ع') + '</button>' +
        '</header>' +
        '<div class="flex-1 px-6 py-6 flex flex-col">' +
          '<h1 class="text-2xl font-bold">' + t('i_am_a') + '</h1>' +
          '<p class="text-white/70 mt-2 mb-6 leading-snug">' + t('role_intro') + '</p>' +
          '<div class="space-y-4">' +
            roleCard('tenant', 'users', t('tenant'), t('tenant_desc')) +
            roleCard('landlord', 'building', t('landlord'), t('landlord_desc')) +
          '</div>' +
          '<p class="mt-auto pt-8 text-center text-xs text-white/50">' + t('demo_footer') + '</p>' +
        '</div>' +
      '</div>';
  }

  /* -------------------------------------------------------------- */
  /*  shared bits                                                   */
  /* -------------------------------------------------------------- */
  function backHeader(title, backView) {
    return '<div class="flex items-center gap-2 mb-4">' +
      '<button data-action="back" data-view="' + backView + '" class="tap w-10 rounded-full bg-white/10 grid place-items-center">' +
      icon('back', 'w-5 h-5 rtl:-scale-x-100') + '</button>' +
      '<h1 class="text-lg font-bold">' + title + '</h1></div>';
  }

  function typeBadge(type) {
    var label = t(type === 'commercial' ? 'commercial' : 'residential');
    var cls = type === 'commercial'
      ? 'bg-amber-400/15 text-amber-300 border-amber-400/30'
      : 'bg-white/10 text-white/70 border-white/15';
    return '<span class="text-[11px] px-2 py-0.5 rounded-full border ' + cls + '">' + label + '</span>';
  }

  function statusPill(received) {
    return received
      ? '<span class="text-xs px-2 py-1 rounded-full bg-emerald/15 text-emerald border border-emerald/40 font-semibold">' + t('status_received') + '</span>'
      : '<span class="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70 border border-white/15 font-semibold">' + t('status_scheduled') + '</span>';
  }

  /* compute the landlord's full unit list (curated + added) */
  function allUnits(S) {
    var arr = S.units.map(function (u) {
      var c = Object.assign({}, u);
      if (u.linkLayla) {
        c.score = S.tenantScore;
        c.received = S.shared.laylaPaidThisMonth;
        c.rent = S.lease.rent;
        c.tenant = S.tenantName;
        c.address = S.lease.property;
      }
      return c;
    });
    (S.addedTenants || []).forEach(function (x) {
      arr.push({ id: x.id, address: x.unit, rent: x.rent, type: x.type, tenant: x.name, score: x.score, received: false, term: x.term });
    });
    (S.addedProperties || []).forEach(function (p) {
      arr.push({ id: p.id, address: p.address, rent: p.rent, type: p.type, tenant: null, received: false });
    });
    return arr;
  }

  /* -------------------------------------------------------------- */
  /*  TENANT — home                                                 */
  /* -------------------------------------------------------------- */
  function tenantHome(S) {
    var paid = S.shared.laylaPaidThisMonth;
    var monthName = AR.i18n.monthName(AR.app.dueMonthIdx);

    var notif = paid ? '' : (
      '<div class="card-light text-navy p-4 mb-4 toast-in" id="cliqNotif">' +
        '<div class="flex items-start gap-3">' +
          '<span class="w-10 h-10 rounded-xl bg-emerald/15 text-emerald grid place-items-center shrink-0">' + icon('card', 'w-5 h-5') + '</span>' +
          '<div class="min-w-0 flex-1">' +
            '<p class="font-bold text-sm">' + t('notif_title') + '</p>' +
            '<p class="text-sm text-navy/80 mt-0.5 leading-snug">' +
              t('notif_body', { month: monthName, amount: money(S.lease.rent), landlord: L(S.lease.landlord) }) + '</p>' +
            '<button id="reviewBtn" data-action="review-payment" class="btn mt-3 bg-emerald text-white px-5 text-sm">' + t('review') + '</button>' +
          '</div>' +
        '</div>' +
      '</div>'
    );

    var heroStatus = paid
      ? '<span class="text-sm px-3 py-1 rounded-full bg-emerald text-white font-semibold">' + t('status_paid') + '</span>'
      : '<span class="text-sm px-3 py-1 rounded-full bg-white/15 text-white font-semibold">' + t('status_scheduled') + '</span>';

    var nextCard =
      '<div id="nextRentCard" class="card p-5 mb-4">' +
        '<div class="flex items-center justify-between mb-3">' +
          '<span class="text-sm text-white/70">' + t('next_rent') + '</span>' + heroStatus +
        '</div>' +
        '<div class="text-4xl font-bold tnum text-emerald">' + money(S.lease.rent) + '</div>' +
        '<p class="text-white/70 text-sm mt-1">' + t('due_on', { date: AR.fmtDate(AR.app.dueISO) }) + '</p>' +
        '<div class="mt-4 space-y-1.5 text-sm">' +
          row(t('property_label'), L(S.lease.property)) +
          row(t('landlord_label'), L(S.lease.landlord)) +
        '</div>' +
        (paid ? '<p class="mt-4 text-sm text-emerald font-medium">' + t('paid_for_month', { month: monthName }) + '</p>' : '') +
      '</div>';

    var automation =
      '<div class="card p-4 mb-4">' +
        '<p class="text-sm text-white/85 leading-snug">' + t('automation_note') + '</p>' +
        '<p class="text-xs text-white/55 leading-snug mt-2">' + t('cliq_explain') + '</p>' +
      '</div>';

    var scoreWidget =
      '<div class="card p-4">' +
        '<div class="flex items-center justify-between mb-2">' +
          '<span class="text-sm font-semibold text-white/80">' + t('score_title') + '</span>' +
          '<button data-action="nav" data-view="tenant/score" class="text-xs text-emerald font-semibold">' + t('nav_score') + ' →</button>' +
        '</div>' +
        AR.scores.render(S.tenantScore, { compact: true, own: true }) +
      '</div>';

    return wrap(
      '<h1 id="greetingBlock" class="text-2xl font-bold mb-4 truncate">' + t('greeting', { name: L(S.tenantName) }) + '</h1>' +
      notif + nextCard + automation + scoreWidget
    );
  }

  function row(label, value) {
    return '<div class="flex justify-between gap-3"><span class="text-white/55">' + label + '</span>' +
      '<span class="font-medium text-end">' + value + '</span></div>';
  }

  /* -------------------------------------------------------------- */
  /*  TENANT — approval                                             */
  /* -------------------------------------------------------------- */
  /* Step A is rendered here; Steps B (slide), C (processing), D (success)
     are driven by setupApproval() in mount(). The instructor performs
     each real action — nothing auto-commits. */
  function tenantApproval(S) {
    var ref = 'RENT/' + due_ym();
    return wrap(
      backHeader(t('approve_title'), 'tenant/home') +
      '<div id="approvePanel">' +
        '<div id="approveNarration" class="narration text-sm rounded-xl px-3 py-2 leading-snug mb-4">' + t('ap_narr_review') + '</div>' +
        '<div id="approveDetails" class="card p-4">' +
          '<p class="text-xs text-white/50 mb-3">' + t('via_cliq') + '</p>' +
          // chips grouped so the tour can spotlight just them (a small,
          // upper target) and keep its caption clear of them
          '<div id="approveChips">' +
            ackChip('amount', t('amount'), money(S.lease.rent), 'text-2xl font-bold tnum text-emerald') +
            ackChip('recipient', t('recipient'), L(S.lease.landlord), 'font-semibold') +
          '</div>' +
          '<div class="space-y-2 text-sm border-t border-white/10 pt-3 mt-1">' +
            row(t('property_label'), L(S.lease.property)) +
            row(t('reference'), ref) +
            row(t('date'), AR.fmtDate(AR.app.dueISO)) +
          '</div>' +
        '</div>' +
        '<p class="text-xs text-white/55 leading-snug my-4">' + t('cliq_explain') + '</p>' +
        slideControl() +
        '<button data-action="back" data-view="tenant/home" class="btn w-full bg-transparent text-white/70 mt-3">' + t('cancel') + '</button>' +
      '</div>'
    );
  }

  /* tappable "confirm this detail" chip (Step A acknowledgement) */
  function ackChip(key, label, value, valueCls) {
    return '<button type="button" id="ack-' + key + '" data-ackkey="' + key + '" aria-pressed="false" ' +
      'class="ack-chip w-full text-start flex items-center gap-3 rounded-xl border border-white/15 bg-darknavy px-3 py-3 mb-3 min-h-[56px]">' +
      '<span class="ack-mark w-6 h-6 rounded-full border-2 border-white/30 grid place-items-center shrink-0 text-white"></span>' +
      '<span class="min-w-0 flex-1">' +
        '<span class="block text-xs text-white/55">' + label + '</span>' +
        '<span class="block ' + (valueCls || 'font-medium') + ' truncate">' + value + '</span>' +
      '</span>' +
      '<span class="ack-hint text-[11px] text-white/45 shrink-0">' + t('ap_tap_confirm') + '</span>' +
    '</button>';
  }

  /* slide-to-approve control (Step B) + hidden processing row (Step C).
     Disabled until both detail chips are confirmed. */
  function slideControl() {
    return '<div id="slideArea" class="select-none">' +
      '<div id="slideTrack" aria-disabled="true" ' +
        'class="relative h-14 rounded-full bg-darknavy border border-white/15 overflow-hidden opacity-40 pointer-events-none">' +
        '<div id="slideFill" class="absolute inset-y-0 start-0 bg-emerald/30" style="width:0"></div>' +
        '<span id="slideLabel" class="absolute inset-0 grid place-items-center text-sm font-semibold text-white/80 pointer-events-none">' + t('slide_label') + '</span>' +
        '<button id="slideThumb" type="button" tabindex="0" aria-label="' + t('slide_a11y') + '" ' +
          'class="absolute top-1 start-1 w-12 h-12 rounded-full bg-emerald grid place-items-center text-white touch-none">' +
          AR.app.icon('fwd', 'w-6 h-6 rtl:-scale-x-100') +
        '</button>' +
      '</div>' +
      '<div id="slideProcessing" class="hidden items-center justify-center gap-3 h-14">' +
        '<span class="spinner"></span><span class="text-sm text-white/80">' + t('processing_label') + '</span>' +
      '</div>' +
    '</div>';
  }

  function due_ym() {
    var d = AR.app.dueISO.split('-');
    return d[0] + '-' + d[1];
  }

  /* -------------------------------------------------------------- */
  /*  TENANT — success                                              */
  /* -------------------------------------------------------------- */
  function tenantSuccess(S) {
    var monthName = AR.i18n.monthName(AR.app.dueMonthIdx);
    return wrap(
      '<div id="successCard" class="card p-6 text-center mt-6">' +
        '<div class="pop w-20 h-20 rounded-full bg-emerald grid place-items-center mx-auto mb-4">' + icon('check', 'w-10 h-10') + '</div>' +
        '<h1 class="text-2xl font-bold text-emerald">' + t('success_title') + '</h1>' +
        '<p class="text-white/80 mt-1">' + t('success_sub', { month: monthName }) + '</p>' +
        '<div class="mt-5 bg-darknavy rounded-xl p-3 text-sm">' +
          '<p class="text-white/55">' + t('confirmation_ref') + '</p>' +
          '<p class="font-bold tnum mt-0.5">' + (S.shared.laylaPaymentRef || '') + '</p>' +
        '</div>' +
        '<p class="text-xs text-emerald/90 leading-snug mt-3">' + t('success_landlord_line') + '</p>' +
      '</div>' +
      // Rent-Trust Score ticked up, shown with its explanation (three-layer)
      '<div class="card p-4 mt-4">' +
        '<div class="flex items-center gap-2 mb-2 text-emerald text-sm font-semibold">' +
          icon('gauge', 'w-4 h-4') + '<span>' + t('score_ticked') + '</span>' +
        '</div>' +
        AR.scores.render(S.tenantScore, { compact: false, own: true }) +
      '</div>' +
      '<button data-action="nav" data-view="tenant/home" class="btn w-full bg-white/10 text-white mt-5">' + t('back_home') + '</button>'
    );
  }

  /* -------------------------------------------------------------- */
  /*  TENANT — lease                                                */
  /* -------------------------------------------------------------- */
  function tenantLease(S) {
    var ls = S.lease;
    var doc =
      '<div class="card-light text-navy p-5">' +
        '<div class="flex items-center gap-2 pb-3 border-b border-black/10">' +
          AR.app.logoImg('light', 'w-9 h-9') +
          '<span class="font-bold">' + t('brand') + '</span>' +
          '<span id="leaseStatus" class="ms-auto text-xs px-2.5 py-1 rounded-full bg-emerald/15 text-emerald border border-emerald/40 font-semibold flex items-center gap-1">' +
            icon('check', 'w-3.5 h-3.5') + t('lease_status') + '</span>' +
        '</div>' +
        '<div class="pt-3 space-y-2 text-sm">' +
          lrow(t('parties'), L(ls.tenant) + ' · ' + L(ls.landlord)) +
          lrow(t('property_label'), L(ls.property)) +
          lrow(t('monthly_rent'), money(ls.rent)) +
          lrow(t('term'), t('term_months', { n: ls.termMonths })) +
          lrow(t('start_date'), AR.fmtDate(ls.start)) +
          lrow(t('end_date'), AR.fmtDate(ls.end)) +
        '</div>' +
      '</div>';

    return wrap(
      '<h1 class="text-2xl font-bold mb-4">' + t('lease_title') + '</h1>' +
      doc +
      '<div class="card p-4 mt-4">' +
        '<p class="text-sm text-white/85 leading-snug">' + t('sanad_explain') + '</p>' +
        '<p class="text-xs text-white/55 leading-snug mt-2">' + t('sanad_term') + '</p>' +
      '</div>' +
      '<div class="card p-4 mt-3">' +
        '<p class="text-sm text-emerald/90 leading-snug">' + t('enforce_note') + '</p>' +
      '</div>' +
      '<button data-action="open-contract" class="btn w-full bg-white/10 text-white mt-4">' + t('view_contract') + '</button>'
    );
  }

  function lrow(label, value) {
    return '<div class="flex justify-between gap-3"><span class="text-navy/50">' + label + '</span>' +
      '<span class="font-medium text-end">' + value + '</span></div>';
  }

  function tenantContract(S) {
    var ls = S.lease;
    return wrap(
      backHeader(t('contract_title'), 'tenant/lease') +
      '<div class="card-light text-navy p-5">' +
        '<div class="flex items-center gap-2 pb-3 border-b border-black/10 mb-3">' +
          AR.app.logoImg('light', 'w-10 h-10') +
          '<div><p class="font-bold leading-tight">' + t('brand') + '</p>' +
          '<p class="text-xs text-navy/60">' + t('contract_title') + '</p></div>' +
        '</div>' +
        '<p class="text-sm leading-relaxed text-navy/80">' + t('contract_body') + '</p>' +
        '<div class="mt-4 space-y-2 text-sm">' +
          lrow(t('parties'), L(ls.tenant) + ' · ' + L(ls.landlord)) +
          lrow(t('property_label'), L(ls.property)) +
          lrow(t('monthly_rent'), money(ls.rent)) +
          lrow(t('term'), t('term_months', { n: ls.termMonths })) +
        '</div>' +
        '<div class="mt-4 pt-3 border-t border-black/10 flex items-center gap-1 text-emerald text-sm font-semibold">' +
          icon('check', 'w-4 h-4') + t('lease_status') + '</div>' +
      '</div>' +
      '<button data-action="back" data-view="tenant/lease" class="btn w-full bg-white/10 text-white mt-4">' + t('close') + '</button>'
    );
  }

  /* -------------------------------------------------------------- */
  /*  TENANT — payments                                             */
  /* -------------------------------------------------------------- */
  function tenantPayments(S) {
    var rows = S.tenantPayments.map(function (p) {
      var kind = p.kind === 'early' ? t('paid_early') : t('paid_on_time');
      return '<div class="card p-4 flex items-center justify-between gap-3">' +
        '<div class="min-w-0">' +
          '<p class="font-semibold">' + AR.i18n.monthName(p.month) + ' ' + p.year + '</p>' +
          '<p class="text-xs text-white/55 mt-0.5">' + t('paid_on', { date: AR.fmtDate(p.paid) }) +
            (p.automated ? ' · ' + t('automated_arrival') : '') + '</p>' +
        '</div>' +
        '<div class="text-end shrink-0">' +
          '<p class="font-bold tnum">' + money(p.amount) + '</p>' +
          '<span class="text-[11px] px-2 py-0.5 rounded-full bg-emerald/15 text-emerald border border-emerald/40 font-semibold">' + kind + '</span>' +
        '</div>' +
      '</div>';
    }).join('');
    return wrap('<h1 class="text-2xl font-bold mb-4">' + t('payments_title') + '</h1>' +
      '<div class="space-y-3">' + rows + '</div>');
  }

  /* -------------------------------------------------------------- */
  /*  TENANT — score                                                */
  /* -------------------------------------------------------------- */
  function tenantScore(S) {
    return wrap(
      '<h1 class="text-2xl font-bold mb-4">' + t('score_title') + '</h1>' +
      '<div id="scoreBlock" class="card p-5">' +
        AR.scores.render(S.tenantScore, { compact: false, own: true, big: true }) +
        '<p class="text-xs text-white/50 mt-1">' + t('score_out_of') + '</p>' +
      '</div>' +
      '<p class="text-xs text-white/55 leading-snug mt-4">' + t('early_stage') + '</p>' +
      '<p class="text-xs text-emerald/90 leading-snug mt-2">' + t('free_note') + '</p>'
    );
  }

  /* -------------------------------------------------------------- */
  /*  LANDLORD — home                                               */
  /* -------------------------------------------------------------- */
  function landlordHome(S) {
    var units = allUnits(S);
    var paid = S.shared.laylaPaidThisMonth;

    var feature = paid
      ? { name: S.tenantName, addr: S.lease.property, amount: S.lease.rent, you: true }
      : { name: S.units[2].tenant, addr: S.units[2].address, amount: S.units[2].rent, you: false };

    var expected = 0, received = 0;
    units.forEach(function (u) { expected += u.rent; if (u.received) received += u.rent; });
    var outstanding = expected - received;

    var hero =
      '<div id="rentReceivedHero" class="card p-5 mb-4 border border-emerald/40">' +
        '<div class="flex items-center gap-2 mb-2">' +
          '<span class="w-8 h-8 rounded-full bg-emerald grid place-items-center">' + icon('check', 'w-5 h-5') + '</span>' +
          '<span class="text-sm font-semibold text-emerald">' + t('rent_received') + '</span>' +
        '</div>' +
        '<div class="text-4xl font-bold tnum text-emerald">' + money(feature.amount) + '</div>' +
        '<p class="text-white/80 text-sm mt-1">' + t('from_tenant', { name: L(feature.name) }) + ' · ' + L(feature.addr) + '</p>' +
        '<p class="text-xs text-white/60 leading-snug mt-3">' + t('received_auto_line') + '</p>' +
        (feature.you ? '<p class="text-xs text-emerald/90 leading-snug mt-2">' + t('you_approved_line') + '</p>' : '') +
      '</div>';

    var portfolio =
      '<div class="card p-4">' +
        '<p class="text-sm font-semibold text-white/80 mb-3">' + t('portfolio') + '</p>' +
        '<div class="grid grid-cols-2 gap-3 text-sm">' +
          stat(t('total_units'), units.length) +
          stat(t('expected'), money(expected)) +
          stat(t('received_total'), money(received), 'text-emerald') +
          stat(t('outstanding'), money(outstanding), outstanding > 0 ? 'text-amber-300' : 'text-emerald') +
        '</div>' +
      '</div>';

    return wrap(
      '<h1 class="text-2xl font-bold mb-4 truncate">' + t('greeting', { name: L(S.landlordName) }) + '</h1>' +
      hero + portfolio
    );
  }

  function stat(label, value, cls) {
    return '<div class="bg-darknavy rounded-xl p-3">' +
      '<p class="text-white/55 text-xs">' + label + '</p>' +
      '<p class="font-bold tnum mt-0.5 ' + (cls || '') + '">' + value + '</p></div>';
  }

  /* -------------------------------------------------------------- */
  /*  LANDLORD — properties                                         */
  /* -------------------------------------------------------------- */
  function landlordProperties(S) {
    var units = allUnits(S);
    var rows = units.map(function (u) {
      return '<button data-action="view-unit" data-id="' + u.id + '" class="card w-full text-start p-4">' +
        '<div class="flex items-start justify-between gap-2">' +
          '<div class="min-w-0">' +
            '<p class="font-semibold truncate">' + L(u.address) + '</p>' +
            '<p class="text-xs text-white/55 mt-0.5">' +
              (u.tenant ? L(u.tenant) : t('vacant')) + ' · ' + money(u.rent) + '</p>' +
          '</div>' + typeBadge(u.type) +
        '</div>' +
        '<div class="mt-3">' + statusPill(u.received) + '</div>' +
      '</button>';
    }).join('');

    return wrap(
      '<div class="flex items-center justify-between mb-4">' +
        '<h1 class="text-2xl font-bold">' + t('properties_title') + '</h1>' +
        '<button data-action="add-property" class="btn bg-emerald text-white px-4 text-sm">+ ' + t('add_property') + '</button>' +
      '</div>' +
      '<div class="space-y-3">' + rows + '</div>'
    );
  }

  function landlordUnit(S, id) {
    var u = allUnits(S).filter(function (x) { return x.id === id; })[0];
    if (!u) return wrap(backHeader(t('unit_detail'), 'landlord/properties') + '<p class="text-white/60">—</p>');
    var scoreHtml = u.score
      ? '<div class="card p-4 mt-3"><p class="text-sm font-semibold text-white/80 mb-2">' + t('score_title') + '</p>' +
          AR.scores.render(u.score, { compact: false }) + '</div>'
      : '';
    return wrap(
      backHeader(t('unit_detail'), 'landlord/properties') +
      '<div class="card p-5">' +
        '<div class="flex items-center justify-between gap-2 mb-3">' +
          '<p class="text-lg font-bold">' + L(u.address) + '</p>' + typeBadge(u.type) +
        '</div>' +
        '<div class="space-y-2 text-sm">' +
          row(t('current_tenant'), u.tenant ? L(u.tenant) : t('vacant')) +
          row(t('monthly_rent'), money(u.rent)) +
          (u.term ? row(t('term'), t('term_months', { n: u.term })) : '') +
          row(t('rent_status'), '') +
        '</div>' +
        '<div class="mt-2">' + statusPill(u.received) + '</div>' +
      '</div>' +
      scoreHtml
    );
  }

  /* -------------------------------------------------------------- */
  /*  LANDLORD — tenants                                            */
  /* -------------------------------------------------------------- */
  function landlordTenants(S) {
    var tenants = allUnits(S).filter(function (u) { return !!u.tenant; });
    var rows = tenants.map(function (u) {
      return '<div class="card p-4">' +
        '<div class="flex items-center justify-between gap-2 mb-2">' +
          '<div class="min-w-0">' +
            '<p class="font-semibold truncate">' + L(u.tenant) + '</p>' +
            '<p class="text-xs text-white/55">' + L(u.address) + '</p>' +
          '</div>' + typeBadge(u.type) +
        '</div>' +
        AR.scores.render(u.score || { case: 'new', value: 800 }, { compact: true }) +
      '</div>';
    }).join('');

    return wrap(
      '<div class="flex items-center justify-between mb-2">' +
        '<h1 class="text-2xl font-bold">' + t('tenants_title') + '</h1>' +
        '<button data-action="add-tenant" class="btn bg-emerald text-white px-4 text-sm">+ ' + t('add_tenant') + '</button>' +
      '</div>' +
      '<p class="text-sm text-white/60 leading-snug mb-4">' + t('tenants_intro') + '</p>' +
      '<div id="tenantsList" class="space-y-3">' + rows + '</div>'
    );
  }

  /* -------------------------------------------------------------- */
  /*  LANDLORD — payments                                           */
  /* -------------------------------------------------------------- */
  function landlordPayments(S) {
    var units = allUnits(S).filter(function (u) { return !!u.tenant; });
    var rows = units.map(function (u) {
      return '<div class="card p-4 flex items-center justify-between gap-3">' +
        '<div class="min-w-0">' +
          '<p class="font-semibold truncate">' + L(u.tenant) + '</p>' +
          '<p class="text-xs text-white/55 mt-0.5">' +
            (u.received ? t('received_on', { date: AR.fmtDate(AR.app.dueISO) }) + ' · ' + t('automated_arrival')
                        : t('status_scheduled')) + '</p>' +
        '</div>' +
        '<div class="text-end shrink-0">' +
          '<p class="font-bold tnum">' + money(u.rent) + '</p>' + statusPill(u.received) +
        '</div>' +
      '</div>';
    }).join('');
    return wrap('<h1 class="text-2xl font-bold mb-4">' + t('landlord_payments_title') + '</h1>' +
      '<div class="space-y-3">' + rows + '</div>');
  }

  /* -------------------------------------------------------------- */
  /*  LANDLORD — add property / add tenant (autofill forms)         */
  /* -------------------------------------------------------------- */
  function fieldWrap(label, inputHtml) {
    return '<label class="block mb-3"><span class="text-sm text-white/70">' + label + '</span>' +
      inputHtml + '</label>';
  }
  function input(id, extra) {
    return '<input id="' + id + '" type="text" readonly ' + (extra || '') +
      ' class="mt-1 w-full bg-darknavy border border-white/15 rounded-xl px-3 py-3 text-white outline-none">';
  }

  function afControls() {
    return '<div class="flex items-center gap-2 mb-4">' +
      '<p id="afNarration" class="narration flex-1 text-sm rounded-xl px-3 py-2 leading-snug">' + t('autofilling') + '</p>' +
      '<button id="afPause" class="tap px-3 rounded-xl bg-white/10 text-xs font-semibold shrink-0">' + t('af_pause') + '</button>' +
      '<button id="afSkip" class="tap px-3 rounded-xl bg-white/10 text-xs font-semibold shrink-0">' + t('af_skip') + '</button>' +
      '</div>';
  }

  function addProperty(S) {
    var exhausted = AR.storage.poolExhausted(S, 'properties');
    return wrap(
      backHeader(t('add_property'), 'landlord/properties') +
      (exhausted ? '<p class="card p-3 text-sm text-amber-300 mb-4">' + t('pool_exhausted') + '</p>' : afControls()) +
      '<div class="card p-4">' +
        fieldWrap(t('form_address'), input('fAddress')) +
        fieldWrap(t('form_rent'), input('fRent')) +
        fieldWrap(t('form_type'), input('fType')) +
      '</div>' +
      '<button id="savePropertyBtn" data-action="save-property" class="btn w-full bg-emerald text-white text-lg mt-4">' + t('save_property') + '</button>'
    );
  }

  function addTenant(S) {
    var exhausted = AR.storage.poolExhausted(S, 'tenants');
    return wrap(
      backHeader(t('add_tenant'), 'landlord/tenants') +
      (exhausted ? '<p class="card p-3 text-sm text-amber-300 mb-4">' + t('pool_exhausted') + '</p>' : afControls()) +
      '<div class="card p-4">' +
        fieldWrap(t('form_tenant_name'), input('fName')) +
        fieldWrap(t('form_unit'), input('fUnit')) +
        fieldWrap(t('form_rent'), input('fRent')) +
        fieldWrap(t('form_term'), input('fTerm')) +
      '</div>' +
      '<button id="saveTenantBtn" data-action="save-tenant" class="btn w-full bg-emerald text-white text-lg mt-4">' + t('save_tenant') + '</button>'
    );
  }

  /* pending pool entries chosen for the current form */
  var pendingProp = null;
  var pendingTenant = null;
  /* approval flow: have both detail chips been confirmed? (read by the tour) */
  var approveReady = false;

  function mount(view, params, S) {
    if (view === 'landlord/addProperty') setupPropertyForm(S);
    else if (view === 'landlord/addTenant') setupTenantForm(S);
    else if (view === 'tenant/approval') setupApproval(S);
  }

  /* -------------------------------------------------------------- */
  /*  Approval interaction engine (Steps A → B → C, then app.approve
      = Step D). Uses Pointer Events so the slide works with touch on
      mobile Safari; falls back to Enter/Space on the focused thumb
      for keyboard/assistive use. Nothing auto-commits. */
  /* -------------------------------------------------------------- */
  function setupApproval(S) {
    var panel = document.getElementById('approvePanel');
    approveReady = false; // both details confirmed yet? (used by the tour)
    if (!panel) return;
    var narr = document.getElementById('approveNarration');
    var track = document.getElementById('slideTrack');
    var thumb = document.getElementById('slideThumb');
    var fill = document.getElementById('slideFill');
    var label = document.getElementById('slideLabel');
    var proc = document.getElementById('slideProcessing');

    var ack = { amount: false, recipient: false };
    var enabled = false, dragging = false, completed = false, progress = 0;
    var dir = AR.i18n.isRTL() ? -1 : 1;
    var startCenterX = 0, maxTravel = 0;

    // Step A — acknowledge the key details
    ['amount', 'recipient'].forEach(function (k) {
      var btn = document.getElementById('ack-' + k);
      if (!btn) return;
      btn.addEventListener('click', function () {
        if (ack[k]) return;
        ack[k] = true;
        btn.setAttribute('aria-pressed', 'true');
        btn.classList.add('border-emerald');
        btn.classList.remove('border-white/15');
        var mark = btn.querySelector('.ack-mark');
        mark.classList.add('bg-emerald', 'border-emerald');
        mark.classList.remove('border-white/30');
        mark.innerHTML = AR.app.icon('check', 'w-4 h-4');
        var hint = btn.querySelector('.ack-hint');
        hint.textContent = t('ap_confirmed');
        hint.classList.add('text-emerald');
        hint.classList.remove('text-white/45');
        maybeEnable();
      });
    });

    function maybeEnable() {
      if (enabled || !(ack.amount && ack.recipient)) return;
      enabled = true;
      approveReady = true;
      track.classList.remove('opacity-40', 'pointer-events-none');
      track.removeAttribute('aria-disabled');
      if (narr) narr.textContent = t('ap_narr_slide');
      // let the tour move its spotlight from the chips to the slide control
      if (AR.tour) AR.tour.reposition();
    }

    function setProgress(p) {
      progress = Math.max(0, Math.min(1, p));
      var mt = track.clientWidth - thumb.offsetWidth - 8;
      thumb.style.transform = 'translateX(' + (dir * progress * mt) + 'px)';
      fill.style.width = (progress * 100) + '%';
    }

    // Step B — slide gesture
    function onDown(e) {
      if (!enabled || completed) return;
      dragging = true;
      var tr = thumb.getBoundingClientRect();
      startCenterX = tr.left + tr.width / 2;
      maxTravel = track.clientWidth - thumb.offsetWidth - 8;
      try { thumb.setPointerCapture(e.pointerId); } catch (_) {}
      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
      window.addEventListener('pointercancel', onUp);
      e.preventDefault();
    }
    function onMove(e) {
      if (!dragging) return;
      setProgress((dir * (e.clientX - startCenterX)) / maxTravel);
    }
    function onUp() {
      if (!dragging) return;
      dragging = false;
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      if (progress >= 0.9) complete();
      else animateBack();
    }
    function animateBack() {
      thumb.style.transition = 'transform .2s';
      setProgress(0);
      setTimeout(function () { thumb.style.transition = ''; }, 220);
    }
    function complete() {
      if (completed) return;
      completed = true;
      thumb.style.transition = 'transform .15s';
      setProgress(1);
      if (label) label.textContent = t('slide_done');
      track.classList.add('pointer-events-none');
      startProcessing();
    }
    // Step C — processing, then Step D (success)
    function startProcessing() {
      if (narr) narr.textContent = t('ap_narr_processing');
      track.classList.add('hidden');
      proc.classList.remove('hidden');
      proc.classList.add('flex');
      setTimeout(function () { AR.app.approve(); }, 1500);
    }

    thumb.addEventListener('pointerdown', onDown);
    thumb.addEventListener('keydown', function (e) {
      if (!enabled || completed) return;
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        complete();
      }
    });
  }

  function setupPropertyForm(S) {
    pendingProp = AR.storage.nextUnused(S, 'properties');
    if (!pendingProp) return; // exhausted — blank manual form
    var entry = pendingProp;
    AR.autofill.start({
      narration: document.getElementById('afNarration'),
      pauseBtn: document.getElementById('afPause'),
      skipBtn: document.getElementById('afSkip'),
      saveBtn: document.getElementById('savePropertyBtn'),
      handoffText: t('af_handoff_prop'),
      fields: [
        { input: document.getElementById('fAddress'), value: L(entry.address), caption: t('af_cap_address') },
        { input: document.getElementById('fRent'), value: String(entry.rent), caption: t('af_cap_rent', { amount: money(entry.rent) }) },
        { input: document.getElementById('fType'), value: t(entry.type), caption: t('af_cap_type', { type: t(entry.type) }) }
      ]
    });
  }

  function setupTenantForm(S) {
    pendingTenant = AR.storage.nextUnused(S, 'tenants');
    if (!pendingTenant) return;
    var e = pendingTenant;
    AR.autofill.start({
      narration: document.getElementById('afNarration'),
      pauseBtn: document.getElementById('afPause'),
      skipBtn: document.getElementById('afSkip'),
      saveBtn: document.getElementById('saveTenantBtn'),
      handoffText: t('af_handoff_tenant'),
      fields: [
        { input: document.getElementById('fName'), value: L(e.name), caption: t('af_cap_name') },
        { input: document.getElementById('fUnit'), value: L(e.unit), caption: t('af_cap_unit', { unit: L(e.unit) }) },
        { input: document.getElementById('fRent'), value: String(e.rent), caption: t('af_cap_rent', { amount: money(e.rent) }) },
        { input: document.getElementById('fTerm'), value: String(e.term), caption: t('af_cap_term', { n: e.term }) }
      ]
    });
  }

  /* commit functions called by app.js on Save -------------------- */
  function commitProperty(S) {
    if (pendingProp) {
      S.addedProperties.push({
        id: 'ap_' + pendingProp.id,
        address: pendingProp.address, rent: pendingProp.rent, type: pendingProp.type
      });
      AR.storage.markUsed(S, 'properties', pendingProp.id);
      pendingProp = null;
    }
  }

  function commitTenant(S) {
    if (pendingTenant) {
      S.addedTenants.push({
        id: 'at_' + pendingTenant.id,
        name: pendingTenant.name, unit: pendingTenant.unit,
        rent: pendingTenant.rent, term: pendingTenant.term, type: pendingTenant.type,
        score: { case: 'new', value: 800 }
      });
      AR.storage.markUsed(S, 'tenants', pendingTenant.id);
      pendingTenant = null;
    }
  }

  /* -------------------------------------------------------------- */
  /*  content dispatcher + wrap                                     */
  /* -------------------------------------------------------------- */
  function wrap(inner) { return '<div class="p-4 pb-8">' + inner + '</div>'; }

  function content(view, params, S) {
    switch (view) {
      case 'tenant/home':     return tenantHome(S);
      case 'tenant/approval': return tenantApproval(S);
      case 'tenant/success':  return tenantSuccess(S);
      case 'tenant/lease':    return tenantLease(S);
      case 'tenant/contract': return tenantContract(S);
      case 'tenant/payments': return tenantPayments(S);
      case 'tenant/score':    return tenantScore(S);
      case 'landlord/home':       return landlordHome(S);
      case 'landlord/properties': return landlordProperties(S);
      case 'landlord/unit':       return landlordUnit(S, params.id);
      case 'landlord/tenants':    return landlordTenants(S);
      case 'landlord/payments':   return landlordPayments(S);
      case 'landlord/addProperty':return addProperty(S);
      case 'landlord/addTenant':  return addTenant(S);
      default: return wrap('<p class="text-white/60">—</p>');
    }
  }

  AR.screens = {
    splash: splash,
    role: role,
    content: content,
    mount: mount,
    commitProperty: commitProperty,
    commitTenant: commitTenant,
    approveReady: function () { return approveReady; }
  };

})(window.AR = window.AR || {});
