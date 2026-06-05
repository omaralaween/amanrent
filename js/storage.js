/* ============================================================
   storage.js — persistence + the localStorage "used pool" tracking.
   This is the single place that touches localStorage, so the
   seeding safeguard and the no-repeat autofill logic are easy to
   find and debug.

   Model (see spec §5b / §7):
     • One key holds the whole app state as JSON.
     • On first run we seed the curated demo state and set state.seeded.
     • On later loads we READ the saved state instead of re-seeding,
       so reloads never duplicate tenants or re-trigger autofill.
     • usedPool tracks which pool entries the autofill has consumed,
       so "next unused" survives reloads and stops when exhausted.
     • Reset wipes the key and rebuilds the clean curated state,
       which also clears the used markers (full pool available again).
   ============================================================ */
(function (AR) {
  'use strict';

  var KEY = 'amanrent.state.v1';
  var available = (function () {
    try {
      var k = '__amanrent_test__';
      window.localStorage.setItem(k, '1');
      window.localStorage.removeItem(k);
      return true;
    } catch (e) {
      return false; // private mode / sandbox — fall back to in-memory
    }
  })();

  var memoryFallback = null; // used only if localStorage is blocked

  function rawRead() {
    if (!available) return memoryFallback;
    try {
      var s = window.localStorage.getItem(KEY);
      return s ? JSON.parse(s) : null;
    } catch (e) {
      return null;
    }
  }

  function rawWrite(state) {
    if (!available) { memoryFallback = state; return; }
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      memoryFallback = state;
    }
  }

  AR.storage = {
    /* localStorage may be unavailable (incognito / sandbox); the app
       still runs, just without cross-reload persistence. */
    isPersistent: function () { return available; },

    /* Seeding safeguard: load existing state, or seed once. */
    loadOrSeed: function () {
      var existing = rawRead();
      if (existing && existing.seeded && existing.schemaVersion === 1) {
        return existing;
      }
      var fresh = AR.data.buildInitialState();
      rawWrite(fresh);
      return fresh;
    },

    save: function (state) { rawWrite(state); },

    /* Wipe everything and return to the clean curated starting state.
       Clears used markers too, so the full autofill pool is available. */
    reset: function () {
      if (available) {
        try { window.localStorage.removeItem(KEY); } catch (e) {}
      }
      memoryFallback = null;
      var fresh = AR.data.buildInitialState();
      rawWrite(fresh);
      return fresh;
    },

    /* ---- No-repeat autofill pool tracking -------------------------- */

    /* Returns the next unused entry for a pool ('tenants'|'properties'),
       or null when the pool is exhausted (caller then shows a blank form). */
    nextUnused: function (state, poolName) {
      var pool = poolName === 'tenants' ? AR.data.tenantPool : AR.data.propertyPool;
      var used = state.usedPool[poolName] || [];
      for (var i = 0; i < pool.length; i++) {
        if (used.indexOf(pool[i].id) === -1) return pool[i];
      }
      return null; // exhausted — stop offering, do not loop
    },

    markUsed: function (state, poolName, id) {
      if (!state.usedPool[poolName]) state.usedPool[poolName] = [];
      if (state.usedPool[poolName].indexOf(id) === -1) {
        state.usedPool[poolName].push(id);
      }
      AR.storage.save(state);
    },

    poolExhausted: function (state, poolName) {
      var pool = poolName === 'tenants' ? AR.data.tenantPool : AR.data.propertyPool;
      var used = state.usedPool[poolName] || [];
      return used.length >= pool.length;
    }
  };

})(window.AR = window.AR || {});
