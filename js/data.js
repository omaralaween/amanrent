/* ============================================================
   data.js — THE MOCK-DATA MODULE.
   Everything fake lives here:
     • DATA.tenantPool     — 12 entries for the "Add tenant" autofill
     • DATA.propertyPool   — 12 entries for the "Add property" autofill
     • DATA.buildInitialState() — the curated demo state seeded on
       first run (the tenant persona, the landlord portfolio, and
       the four score cases the spec requires).
   No persistence logic here — that lives in storage.js. This file
   is pure data + the seed builder so it is easy to find and edit.
   ============================================================ */
(function (AR) {
  'use strict';

  /* -------- Small bilingual date formatter (used across screens) -------- */
  AR.fmtDate = function (iso) {
    if (!iso) return '';
    var p = iso.split('-');           // YYYY-MM-DD
    var y = +p[0], m = +p[1] - 1, d = +p[2];
    return d + ' ' + AR.i18n.monthName(m) + ' ' + y;
  };

  /* =========================================================
     POOL 1 — Tenants (Add-tenant / draft-lease autofill)
     Mix of male/female Jordanian names + commercial tenants,
     real Amman neighbourhoods, varied rents and terms.
     ========================================================= */
  var tenantPool = [
    { id: 't1',  name: { en: 'Omar Nasser',      ar: 'عمر نصر' },        unit: { en: 'Apartment 2, Khalda',          ar: 'شقة 2، خلدا' },           rent: 320,  term: 12, type: 'residential' },
    { id: 't2',  name: { en: 'Dina Mansour',     ar: 'دينا منصور' },     unit: { en: 'Studio, Jabal Al-Weibdeh',     ar: 'استوديو، جبل اللويبدة' }, rent: 230,  term: 12, type: 'residential' },
    { id: 't3',  name: { en: 'Tariq Suleiman',   ar: 'طارق سليمان' },    unit: { en: 'Apartment 7, Shmeisani',       ar: 'شقة 7، الشميساني' },      rent: 480,  term: 12, type: 'residential' },
    { id: 't4',  name: { en: 'Nour Abu-Zaid',    ar: 'نور أبو زيد' },    unit: { en: 'Flat 3, Tla\' Al-Ali',         ar: 'شقة 3، تلاع العلي' },     rent: 400,  term: 6,  type: 'residential' },
    { id: 't5',  name: { en: 'Yousef Haddad',    ar: 'يوسف حداد' },      unit: { en: 'Apartment 11, Deir Ghbar',     ar: 'شقة 11، دير غبار' },      rent: 750,  term: 12, type: 'residential' },
    { id: 't6',  name: { en: 'Salma Odeh',       ar: 'سلمى عودة' },      unit: { en: 'Studio, Sweifieh',             ar: 'استوديو، الصويفية' },     rent: 260,  term: 12, type: 'residential' },
    { id: 't7',  name: { en: 'Optimal Pharmacy', ar: 'صيدلية الأمثل' },  unit: { en: 'Shop 1, Abdoun',               ar: 'محل 1، عبدون' },          rent: 1400, term: 24, type: 'commercial' },
    { id: 't8',  name: { en: 'Maya Saleh',       ar: 'مايا صالح' },      unit: { en: 'Apartment 5, Um Uthaina',      ar: 'شقة 5، أم أذينة' },       rent: 520,  term: 12, type: 'residential' },
    { id: 't9',  name: { en: 'Hani Qasem',       ar: 'هاني قاسم' },      unit: { en: 'Apartment 9, Al-Rabieh',       ar: 'شقة 9، الرابية' },        rent: 690,  term: 12, type: 'residential' },
    { id: 't10', name: { en: 'Cilantro Café',    ar: 'مقهى سيلانترو' },  unit: { en: 'Unit 2, Sweifieh',             ar: 'وحدة 2، الصويفية' },      rent: 2200, term: 36, type: 'commercial' },
    { id: 't11', name: { en: 'Lina Faour',       ar: 'لينا فاعور' },     unit: { en: 'Flat 6, Marj Al-Hamam',        ar: 'شقة 6، مرج الحمام' },     rent: 370,  term: 12, type: 'residential' },
    { id: 't12', name: { en: 'Sami Barakat',     ar: 'سامي بركات' },     unit: { en: 'Apartment 8, Dabouq',          ar: 'شقة 8، دابوق' },          rent: 900,  term: 12, type: 'residential' }
  ];

  /* =========================================================
     POOL 2 — Properties (Add-property autofill)
     ========================================================= */
  var propertyPool = [
    { id: 'p1',  address: { en: 'Apartment 3, Jabal Amman',     ar: 'شقة 3، جبل عمان' },        rent: 380,  type: 'residential' },
    { id: 'p2',  address: { en: 'Studio, Khalda',               ar: 'استوديو، خلدا' },          rent: 240,  type: 'residential' },
    { id: 'p3',  address: { en: 'Apartment 12, Abdoun',         ar: 'شقة 12، عبدون' },          rent: 820,  type: 'residential' },
    { id: 'p4',  address: { en: 'Flat 4, Shmeisani',            ar: 'شقة 4، الشميساني' },       rent: 450,  type: 'residential' },
    { id: 'p5',  address: { en: 'Shop 3, Sweifieh',             ar: 'محل 3، الصويفية' },        rent: 1600, type: 'commercial' },
    { id: 'p6',  address: { en: 'Apartment 6, Tla\' Al-Ali',    ar: 'شقة 6، تلاع العلي' },      rent: 410,  type: 'residential' },
    { id: 'p7',  address: { en: 'Studio, Jabal Al-Weibdeh',     ar: 'استوديو، جبل اللويبدة' },  rent: 220,  type: 'residential' },
    { id: 'p8',  address: { en: 'Apartment 10, Deir Ghbar',     ar: 'شقة 10، دير غبار' },       rent: 700,  type: 'residential' },
    { id: 'p9',  address: { en: 'Office 2, Shmeisani',          ar: 'مكتب 2، الشميساني' },      rent: 1900, type: 'commercial' },
    { id: 'p10', address: { en: 'Flat 7, Um Uthaina',           ar: 'شقة 7، أم أذينة' },        rent: 540,  type: 'residential' },
    { id: 'p11', address: { en: 'Apartment 1, Al-Rabieh',       ar: 'شقة 1، الرابية' },         rent: 760,  type: 'residential' },
    { id: 'p12', address: { en: 'Penthouse, Dabouq',            ar: 'بنتهاوس، دابوق' },         rent: 1500, type: 'residential' }
  ];

  /* =========================================================
     Curated personas + dates
     ========================================================= */
  var TENANT_PERSONA = { en: 'Layla Haddad',  ar: 'ليلى حداد' };
  var LANDLORD_PERSONA = { en: 'Khaled Al-Masri', ar: 'خالد المصري' };

  /* The curated initial state seeded once on first run. A deep copy
     is returned each call so the live state can mutate freely. */
  function buildInitialState() {
    return {
      seeded: true,
      schemaVersion: 1,
      lang: 'en',
      role: null,                 // 'tenant' | 'landlord'
      tab: { tenant: 'home', landlord: 'home' },
      tourCompleted: false,
      tourAutoStarted: false,

      tenantName: TENANT_PERSONA,
      landlordName: LANDLORD_PERSONA,

      /* Shared payment state for Layla — read by BOTH the tenant
         dashboard and the landlord portfolio so a payment approved
         on the tenant side shows up on the landlord side. */
      shared: {
        laylaPaidThisMonth: false,
        laylaPaymentRef: null
      },

      /* Layla's lease (tenant side) */
      lease: {
        tenant: TENANT_PERSONA,
        landlord: LANDLORD_PERSONA,
        property: { en: 'Apartment 4, Jabal Amman', ar: 'شقة 4، جبل عمان' },
        rent: 350,
        termMonths: 12,
        start: '2025-08-01',
        end: '2026-07-31'
      },

      /* Layla's own score — reliable, established. Shared into unit u1. */
      tenantScore: { case: 'reliable', value: 870, months: 11 },

      /* Tenant payment history (mock) — variety feeds the score story */
      tenantPayments: [
        { month: 4, year: 2026, amount: 350, paid: '2026-05-01', kind: 'ontime', automated: true },
        { month: 3, year: 2026, amount: 350, paid: '2026-03-31', kind: 'early',  automated: true },
        { month: 2, year: 2026, amount: 350, paid: '2026-03-01', kind: 'ontime', automated: true },
        { month: 1, year: 2026, amount: 350, paid: '2026-02-01', kind: 'ontime', automated: true }
      ],

      /* Landlord portfolio — four units covering all four score cases.
         u1 (Layla) links to the shared payment + tenantScore at render. */
      units: [
        {
          id: 'u1', linkLayla: true,
          tenant: TENANT_PERSONA,
          address: { en: 'Apartment 4, Jabal Amman', ar: 'شقة 4، جبل عمان' },
          rent: 350, type: 'residential',
          score: null /* resolved from tenantScore at render */
        },
        {
          id: 'u2',
          tenant: { en: 'Omar Nasser', ar: 'عمر نصر' },
          address: { en: 'Studio, Khalda', ar: 'استوديو، خلدا' },
          rent: 250, type: 'residential', received: true,
          score: { case: 'new', value: 800 }
        },
        {
          id: 'u3',
          tenant: { en: 'Rania Khalil', ar: 'رانيا خليل' },
          address: { en: 'Flat, Abdoun', ar: 'شقة، عبدون' },
          rent: 600, type: 'residential', received: true,
          score: { case: 'recovering', value: 705, recent: 3 }
        },
        {
          id: 'u4',
          tenant: { en: 'Cilantro Café', ar: 'مقهى سيلانترو' },
          address: { en: 'Commercial unit, Sweifieh', ar: 'وحدة تجارية، الصويفية' },
          rent: 1200, type: 'commercial', received: true,
          score: { case: 'late', value: 640, lateDays: 6 }
        }
      ],

      /* Instructor-created records (appended via the autofill flows) */
      addedTenants: [],
      addedProperties: [],

      /* No-repeat tracking for the autofill pools */
      usedPool: { tenants: [], properties: [] }
    };
  }

  AR.data = {
    tenantPool: tenantPool,
    propertyPool: propertyPool,
    buildInitialState: buildInitialState,
    TENANT_PERSONA: TENANT_PERSONA,
    LANDLORD_PERSONA: LANDLORD_PERSONA
  };

})(window.AR = window.AR || {});
