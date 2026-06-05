/* ============================================================
   scores.js — the Rent-Trust Score model + its three-layer
   "read-more" presentation, used everywhere a score appears
   (tenant home widget, tenant score screen, landlord tenants
   list, unit detail). A score is NEVER rendered as a bare number:
   Layer 1 (status label) always sits beside it.

   score object shape:
     { case: 'new'|'reliable'|'late'|'recovering',
       value: <0..1000>, months?, lateDays?, recent? }
   ============================================================ */
(function (AR) {
  'use strict';

  var CASE = {
    new:        { labelKey: 'sl_new',        tagKey: 'tag_new',        detailKey: 'detail_new',        tone: 'good' },
    reliable:   { labelKey: 'sl_reliable',   tagKey: 'tag_reliable',   detailKey: 'detail_reliable',   tone: 'good' },
    recovering: { labelKey: 'sl_recovering', tagKey: 'tag_recovering', detailKey: 'detail_recovering', tone: 'good' },
    late:       { labelKey: 'sl_late',       tagKey: 'tag_late',       detailKey: 'detail_late',       tone: 'warn' }
  };

  function nFor(score) {
    // the {n} value each tag/detail needs
    switch (score.case) {
      case 'reliable':   return score.months || 0;
      case 'late':       return score.lateDays || 0;
      case 'recovering': return score.recent || 0;
      default:           return 0;
    }
  }

  function labelText(score) { return AR.t(CASE[score.case].labelKey); }
  function tagText(score)   { return AR.t(CASE[score.case].tagKey, { n: nFor(score) }); }
  function detailText(score){ return AR.t(CASE[score.case].detailKey, { n: nFor(score) }); }

  var idSeq = 0;

  /* Renders the full three-layer component as an HTML string.
     opts:
       compact : true  -> Layer 1 + number + "See details"; Layer 2 inside expand
                 false -> Layer 1 + Layer 2 visible; Layer 3 inside expand
       own     : include the "always free" note (tenant viewing own score)
       big     : larger number styling (score screen / home hero widget)  */
  function render(score, opts) {
    opts = opts || {};
    var compact = !!opts.compact;
    var meta = CASE[score.case];
    var tone = meta.tone;
    var id = 'sd' + (++idSeq);

    var chipCls = tone === 'warn'
      ? 'bg-amber-400/15 text-amber-300 border border-amber-400/40'
      : 'bg-emerald/15 text-emerald border border-emerald/40';
    var numCls = (opts.big ? 'text-4xl' : 'text-3xl') + ' font-bold tnum ' +
      (tone === 'warn' ? 'text-amber-300' : 'text-emerald');

    var head =
      '<div class="flex items-center gap-3">' +
        '<div class="' + numCls + '">' + score.value + '</div>' +
        '<div class="min-w-0">' +
          '<span class="inline-block text-xs font-semibold px-2 py-0.5 rounded-full ' + chipCls + '">' + labelText(score) + '</span>' +
          (compact ? '' :
            '<p class="text-sm text-white/80 mt-1 leading-snug">' + tagText(score) + '</p>') +
        '</div>' +
      '</div>';

    // Hidden detail region (Layer 3, plus Layer 2 when compact)
    var detailInner =
      (compact ? '<p class="text-sm text-white/85 leading-snug mb-2">' + tagText(score) + '</p>' : '') +
      '<p class="text-xs uppercase tracking-wide text-white/45 mb-1">' + AR.t('behind_score') + '</p>' +
      '<p class="text-sm text-white/80 leading-snug mb-3">' + detailText(score) + '</p>' +
      '<p class="text-xs text-white/55 leading-snug mb-2">' + AR.t('early_stage') + '</p>' +
      (opts.own ? '<p class="text-xs text-emerald/90 leading-snug">' + AR.t('free_note') + '</p>' : '');

    var toggle =
      '<button type="button" class="mt-2 text-sm font-semibold text-emerald underline-offset-2 hover:underline" ' +
        'data-action="toggle-score" data-target="' + id + '" aria-expanded="false">' +
        '<span data-role="more">' + AR.t('see_details') + '</span>' +
        '<span data-role="less" class="hidden">' + AR.t('hide_details') + '</span>' +
      '</button>';

    var detail =
      '<div class="score-detail mt-1" id="' + id + '"><div class="pt-1">' + detailInner + '</div></div>';

    return '<div class="score-block">' + head + toggle + detail + '</div>';
  }

  AR.scores = {
    labelText: labelText,
    tagText: tagText,
    detailText: detailText,
    render: render,
    CASE: CASE
  };

})(window.AR = window.AR || {});
