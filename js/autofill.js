/* ============================================================
   autofill.js — assisted-typing engine (spec §5a).
   Fields fill themselves at a human pace with a one-line caption
   narrating each one; a subtle highlight follows the active field.
   Pause / Skip are supported. NOTHING auto-commits — when filling
   finishes, narration hands off to the instructor and the manual
   Save button is enabled.
   ============================================================ */
(function (AR) {
  'use strict';

  var current = null; // active controller, so we can cancel on navigation

  function makeCtrl() { return { paused: false, skipped: false, cancelled: false }; }

  // Resolves after `ms` of *un-paused* time; resolves immediately on skip/cancel.
  function wait(ms, ctrl) {
    return new Promise(function (resolve) {
      if (ctrl.cancelled || ctrl.skipped) return resolve();
      var remaining = ms, last = Date.now();
      var iv = setInterval(function () {
        if (ctrl.cancelled || ctrl.skipped) { clearInterval(iv); return resolve(); }
        var now = Date.now();
        if (!ctrl.paused) remaining -= (now - last);
        last = now;
        if (remaining <= 0) { clearInterval(iv); resolve(); }
      }, 30);
    });
  }

  function typeField(field, ctrl) {
    return new Promise(async function (resolve) {
      var input = field.input;
      input.classList.add('af-active');
      try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); }
      input.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      var val = String(field.value);
      input.value = '';
      for (var i = 0; i < val.length; i++) {
        if (ctrl.cancelled) { input.classList.remove('af-active'); return resolve(); }
        if (ctrl.skipped) { break; }
        input.value += val.charAt(i);
        await wait(40 + Math.random() * 55, ctrl);
      }
      if (!ctrl.cancelled) input.value = val;
      input.classList.remove('af-active');
      resolve();
    });
  }

  function setNarration(el, text, done) {
    if (!el) return;
    el.textContent = text;
    el.classList.toggle('narration', !done);
    el.classList.toggle('text-emerald', !!done);
  }

  async function run(config) {
    AR.autofill.cancel(); // ensure no overlap
    var ctrl = makeCtrl();
    current = ctrl;

    // disable Save until filling completes
    if (config.saveBtn) {
      config.saveBtn.disabled = true;
      config.saveBtn.classList.add('opacity-40', 'pointer-events-none');
    }

    // wire Pause / Skip if provided
    if (config.pauseBtn) {
      config.pauseBtn.onclick = function () {
        ctrl.paused = !ctrl.paused;
        config.pauseBtn.textContent = ctrl.paused ? AR.t('af_resume') : AR.t('af_pause');
      };
    }
    if (config.skipBtn) {
      config.skipBtn.onclick = function () { ctrl.skipped = true; };
    }

    await wait(450, ctrl);

    for (var i = 0; i < config.fields.length; i++) {
      if (ctrl.cancelled) return;
      var field = config.fields[i];
      setNarration(config.narration, field.caption, false);
      await typeField(field, ctrl);
      await wait(380, ctrl);
    }

    if (ctrl.cancelled) return;

    // Handoff — explicit prompt for the manual action (spec §5a)
    setNarration(config.narration, config.handoffText, true);
    if (config.pauseBtn) config.pauseBtn.classList.add('hidden');
    if (config.skipBtn) config.skipBtn.classList.add('hidden');
    if (config.saveBtn) {
      config.saveBtn.disabled = false;
      config.saveBtn.classList.remove('opacity-40', 'pointer-events-none');
      config.saveBtn.classList.add('pop');
    }
    if (typeof config.onComplete === 'function') config.onComplete();
    current = null;
  }

  AR.autofill = {
    start: function (config) { run(config); },
    cancel: function () { if (current) current.cancelled = true; current = null; }
  };

})(window.AR = window.AR || {});
