/* ============================================================
   i18n.js — all interface strings in English + Arabic.
   Access with AR.t('key', { vars }). Interpolates {name} tokens.
   Numbers/currency helpers live here too so EN/AR stay consistent.
   ============================================================ */
(function (AR) {
  'use strict';

  var STR = {
    /* ---- Brand / global ---- */
    brand:            { en: 'AmanRent',        ar: 'أمان رنت' },
    slogan:           { en: 'Your rent. Automated. Trusted.', ar: 'إيجارك. تلقائي. موثوق.' },
    demo_footer:      { en: 'Demonstration version. Mock data only.', ar: 'نسخة تجريبية. بيانات توضيحية فقط.' },
    mock_badge:       { en: 'Demo · mock data', ar: 'تجريبي · بيانات توضيحية' },
    enter_demo:       { en: 'Enter demo',       ar: 'ابدأ' },
    lang_name:        { en: 'EN',               ar: 'ع' },

    /* ---- Top bar menu ---- */
    menu:             { en: 'Menu',             ar: 'القائمة' },
    switch_role:      { en: 'Switch role',      ar: 'تبديل الدور' },
    take_tour:        { en: 'Take the tour',    ar: 'ابدأ الجولة' },
    reset_demo:       { en: 'Reset demo',       ar: 'إعادة ضبط العرض' },
    reset_confirm:    { en: 'Reset the demo? This clears everything you added and returns to the clean starting state.', ar: 'إعادة ضبط العرض؟ سيؤدي ذلك إلى مسح كل ما أضفته والعودة إلى الحالة الأولى.' },

    /* ---- Role chooser ---- */
    i_am_a:           { en: 'I am a…',           ar: 'أنا…' },
    role_intro:       { en: 'Experience both sides of the marketplace. You can switch any time.', ar: 'جرّب جانبَي المنصة. يمكنك التبديل في أي وقت.' },
    tenant:           { en: 'Tenant',           ar: 'مستأجر' },
    landlord:         { en: 'Landlord',         ar: 'مالك' },
    tenant_desc:      { en: 'The person who pays rent.', ar: 'الشخص الذي يدفع الإيجار.' },
    landlord_desc:    { en: 'The person who receives rent.', ar: 'الشخص الذي يستلم الإيجار.' },

    /* ---- Bottom nav ---- */
    nav_home:         { en: 'Home',             ar: 'الرئيسية' },
    nav_lease:        { en: 'Lease',            ar: 'العقد' },
    nav_payments:     { en: 'Payments',         ar: 'الدفعات' },
    nav_score:        { en: 'Score',            ar: 'الدرجة' },
    nav_properties:   { en: 'Properties',       ar: 'العقارات' },
    nav_tenants:      { en: 'Tenants',          ar: 'المستأجرون' },

    /* ---- Tenant home ---- */
    greeting:         { en: 'Marhaba, {name}',  ar: 'مرحباً، {name}' },
    next_rent:        { en: 'Your next rent',   ar: 'إيجارك القادم' },
    due_on:           { en: 'Due {date}',       ar: 'مستحق في {date}' },
    status_scheduled: { en: 'Scheduled',        ar: 'مجدول' },
    status_paid:      { en: 'Paid',             ar: 'مدفوع' },
    status_received:  { en: 'Received',         ar: 'مستلم' },
    landlord_label:   { en: 'Landlord',         ar: 'المالك' },
    property_label:   { en: 'Property',         ar: 'العقار' },
    automation_note:  { en: 'On the 1st at 9:01 AM, AmanRent sends you a CliQ Request-to-Pay. Approve once and your rent is sent.', ar: 'في الأول من الشهر الساعة 9:01 صباحاً، يرسل أمان رنت طلب دفع عبر كليك. وافق مرة واحدة ويُرسَل إيجارك.' },
    cliq_explain:     { en: 'CliQ Request-to-Pay: Jordan\'s instant-payment request. You approve it — money is never pulled silently.', ar: 'طلب الدفع عبر كليك: طلب الدفع الفوري في الأردن. أنت من يوافق عليه — لا يُسحب المال تلقائياً دون إذنك.' },
    notif_title:      { en: 'AmanRent',         ar: 'أمان رنت' },
    notif_body:       { en: 'Your rent for {month} is ready. {amount} to {landlord}.', ar: 'إيجارك لشهر {month} جاهز. {amount} إلى {landlord}.' },
    review:           { en: 'Review',           ar: 'مراجعة' },
    paid_for_month:   { en: 'Rent paid for {month}. You\'re all set.', ar: 'تم دفع إيجار {month}. كل شيء جاهز.' },

    /* ---- Approval flow ---- */
    approve_title:    { en: 'Approve rent payment', ar: 'الموافقة على دفع الإيجار' },
    amount:           { en: 'Amount',           ar: 'المبلغ' },
    recipient:        { en: 'Recipient',        ar: 'المستلِم' },
    reference:        { en: 'Reference',        ar: 'الرقم المرجعي' },
    date:             { en: 'Date',             ar: 'التاريخ' },
    via_cliq:         { en: 'via CliQ Request-to-Pay', ar: 'عبر طلب الدفع كليك' },
    approve_payment:  { en: 'Approve payment',  ar: 'الموافقة على الدفع' },
    cancel:           { en: 'Cancel',           ar: 'إلغاء' },
    success_title:    { en: 'Rent sent',        ar: 'تم إرسال الإيجار' },
    success_sub:      { en: 'You\'re all set for {month}.', ar: 'كل شيء جاهز لشهر {month}.' },
    confirmation_ref: { en: 'Confirmation reference', ar: 'الرقم المرجعي للتأكيد' },
    back_home:        { en: 'Back to home',     ar: 'العودة للرئيسية' },
    score_ticked:     { en: 'Your score went up', ar: 'ارتفعت درجتك' },

    /* ---- Multi-step approval flow (Review → Slide → Processing → Done) ---- */
    ap_narr_review:    { en: 'Check who you\'re paying and how much.', ar: 'تحقّق ممّن تدفع له وكم المبلغ.' },
    ap_narr_slide:     { en: 'Slide to approve, just like confirming a real payment.', ar: 'اسحب للموافقة، تماماً كتأكيد دفعة حقيقية.' },
    ap_narr_processing:{ en: 'AmanRent is sending your rent over CliQ.', ar: 'يقوم أمان رنت بإرسال إيجارك عبر كليك.' },
    ap_narr_success:   { en: 'Rent sent. Your landlord receives it automatically — no message needed.', ar: 'تم إرسال الإيجار. يستلمه مالكك تلقائياً — دون الحاجة لأي رسالة.' },
    ap_tap_confirm:    { en: 'Tap to confirm',  ar: 'اضغط للتأكيد' },
    ap_confirmed:      { en: 'Confirmed',        ar: 'تم التأكيد' },
    ap_review_hint:    { en: 'Confirm the amount and who you\'re paying, then slide to approve.', ar: 'أكّد المبلغ ومَن تدفع له، ثم اسحب للموافقة.' },
    slide_label:       { en: 'Slide to approve', ar: 'اسحب للموافقة' },
    slide_done:        { en: 'Approved',         ar: 'تمت الموافقة' },
    slide_a11y:        { en: 'Slide to approve the payment. Press Enter to approve.', ar: 'اسحب للموافقة على الدفعة. اضغط Enter للموافقة.' },
    processing_label:  { en: 'Processing…',      ar: 'جارٍ المعالجة…' },
    success_landlord_line: { en: 'Your landlord will now receive this rent automatically on the 1st — no message sent.', ar: 'سيستلم مالكك هذا الإيجار تلقائياً الآن في الأول من الشهر — دون إرسال أي رسالة.' },
    your_score:        { en: 'Your score',       ar: 'درجتك' },

    /* ---- Lease screen ---- */
    lease_title:      { en: 'Your lease',       ar: 'عقد إيجارك' },
    parties:          { en: 'Parties',          ar: 'الأطراف' },
    monthly_rent:     { en: 'Monthly rent',     ar: 'الإيجار الشهري' },
    term:             { en: 'Term',             ar: 'المدة' },
    term_months:      { en: '{n} months',       ar: '{n} شهراً' },
    start_date:       { en: 'Start',            ar: 'البداية' },
    end_date:         { en: 'End',              ar: 'النهاية' },
    lease_status:     { en: 'Signed and legally binding', ar: 'موقّع وملزم قانونياً' },
    sanad_explain:    { en: 'This lease was signed digitally with Sanad (Jordan\'s national digital ID) and notarised through the Electronic Notary Public (Katib Al-Adl) — giving it full legal authority even when the parties are not in the same place.', ar: 'وُقّع هذا العقد رقمياً عبر سند (الهوية الرقمية الوطنية الأردنية) وتم توثيقه عبر كاتب العدل الإلكتروني — ما يمنحه كامل القوة القانونية حتى لو لم يكن الطرفان في المكان نفسه.' },
    sanad_term:       { en: 'Sanad: Jordan\'s national digital identity, used to sign securely online.', ar: 'سند: الهوية الرقمية الوطنية الأردنية، تُستخدم للتوقيع بأمان عبر الإنترنت.' },
    enforce_note:     { en: 'A notarised lease can be enforced directly through the Execution Department — without filing a lawsuit first.', ar: 'يمكن تنفيذ العقد الموثّق مباشرةً عبر دائرة التنفيذ — دون الحاجة لرفع دعوى أولاً.' },
    view_contract:    { en: 'View contract',    ar: 'عرض العقد' },
    contract_title:   { en: 'Lease contract',   ar: 'عقد الإيجار' },
    contract_body:    { en: 'This is a mock contract view for demonstration. The full residential lease agreement between the parties, signed via Sanad and notarised electronically, would be displayed here.', ar: 'هذه نسخة توضيحية من العقد لغرض العرض. سيظهر هنا عقد الإيجار السكني الكامل بين الطرفين، الموقّع عبر سند والموثّق إلكترونياً.' },
    close:            { en: 'Close',            ar: 'إغلاق' },

    /* ---- Payments ---- */
    payments_title:   { en: 'Payment history',  ar: 'سجل الدفعات' },
    paid_on:          { en: 'Paid {date}',      ar: 'دُفع في {date}' },
    paid_early:       { en: 'Paid early',        ar: 'دُفع مبكراً' },
    paid_on_time:     { en: 'Paid on time',     ar: 'دُفع في الوقت' },
    automated_arrival:{ en: 'Arrived automatically', ar: 'وصل تلقائياً' },
    landlord_payments_title: { en: 'Incoming rent', ar: 'الإيجارات الواردة' },
    received_on:      { en: 'Received {date}',   ar: 'استُلم في {date}' },

    /* ---- Landlord home ---- */
    rent_received:    { en: 'Rent received',     ar: 'تم استلام الإيجار' },
    received_auto_line:{ en: 'Arrived automatically on the 1st at 9:01 AM — no message sent.', ar: 'وصل تلقائياً في الأول من الشهر الساعة 9:01 صباحاً — دون إرسال أي رسالة.' },
    from_tenant:      { en: 'from {name}',       ar: 'من {name}' },
    portfolio:        { en: 'Portfolio this month', ar: 'المحفظة هذا الشهر' },
    total_units:      { en: 'Units',             ar: 'الوحدات' },
    expected:         { en: 'Expected',          ar: 'المتوقع' },
    received_total:   { en: 'Received',          ar: 'المستلَم' },
    outstanding:      { en: 'Outstanding',       ar: 'المتبقّي' },
    you_approved_line:{ en: 'This is the rent you just approved as the tenant, arriving on its own.', ar: 'هذا هو الإيجار الذي وافقت عليه للتو كمستأجر، وقد وصل من تلقاء نفسه.' },

    /* ---- Properties ---- */
    properties_title: { en: 'Your properties',   ar: 'عقاراتك' },
    add_property:     { en: 'Add property',      ar: 'إضافة عقار' },
    add_tenant:       { en: 'Add tenant',        ar: 'إضافة مستأجر' },
    unit_detail:      { en: 'Unit detail',       ar: 'تفاصيل الوحدة' },
    current_tenant:   { en: 'Current tenant',    ar: 'المستأجر الحالي' },
    rent_status:      { en: 'Rent this month',   ar: 'إيجار هذا الشهر' },
    commercial:       { en: 'Commercial',        ar: 'تجاري' },
    residential:      { en: 'Residential',       ar: 'سكني' },
    vacant:           { en: 'Vacant',            ar: 'شاغر' },

    /* ---- Tenants list ---- */
    tenants_title:    { en: 'Your tenants',      ar: 'مستأجروك' },
    tenants_intro:    { en: 'Every score is shown with the reason behind it — never as a bare number.', ar: 'تظهر كل درجة مع السبب وراءها — وليست رقماً مجرّداً أبداً.' },

    /* ---- Add property / tenant forms ---- */
    form_address:     { en: 'Property address',  ar: 'عنوان العقار' },
    form_rent:        { en: 'Monthly rent (JOD)', ar: 'الإيجار الشهري (د.أ)' },
    form_type:        { en: 'Type',              ar: 'النوع' },
    form_tenant_name: { en: 'Tenant name',       ar: 'اسم المستأجر' },
    form_unit:        { en: 'Linked unit',       ar: 'الوحدة المرتبطة' },
    form_term:        { en: 'Lease term (months)', ar: 'مدة العقد (أشهر)' },
    save_property:    { en: 'Save property',     ar: 'حفظ العقار' },
    save_tenant:      { en: 'Save tenant',       ar: 'حفظ المستأجر' },
    autofilling:      { en: 'Auto-filling the form…', ar: 'تتم تعبئة النموذج تلقائياً…' },
    af_pause:         { en: 'Pause',             ar: 'إيقاف مؤقت' },
    af_resume:        { en: 'Resume',            ar: 'متابعة' },
    af_skip:          { en: 'Skip',              ar: 'تخطّي' },
    af_handoff_prop:  { en: 'The property is ready. Tap Save property when you\'re ready.', ar: 'العقار جاهز. اضغط حفظ العقار عندما تكون مستعداً.' },
    af_handoff_tenant:{ en: 'The lease is ready. Tap Save tenant when you\'re ready.', ar: 'العقد جاهز. اضغط حفظ المستأجر عندما تكون مستعداً.' },
    af_cap_name:      { en: 'Entering the tenant\'s name…', ar: 'إدخال اسم المستأجر…' },
    af_cap_unit:      { en: 'Linking them to {unit}…', ar: 'ربطهم بـ {unit}…' },
    af_cap_rent:      { en: 'Setting monthly rent to {amount}…', ar: 'تحديد الإيجار الشهري إلى {amount}…' },
    af_cap_term:      { en: 'Setting the lease term to {n} months…', ar: 'تحديد مدة العقد إلى {n} شهراً…' },
    af_cap_address:   { en: 'Entering the property address…', ar: 'إدخال عنوان العقار…' },
    af_cap_type:      { en: 'Marking it as a {type} unit…', ar: 'تحديدها كوحدة {type}…' },
    pool_exhausted:   { en: 'All sample entries have been used. The form is now blank — Reset demo to refill the pool.', ar: 'تم استخدام جميع الإدخالات التجريبية. النموذج فارغ الآن — أعد ضبط العرض لإعادة تعبئة المجموعة.' },
    property_added:   { en: 'Property added.',   ar: 'تمت إضافة العقار.' },
    tenant_added:     { en: 'Tenant added with a fresh score.', ar: 'تمت إضافة المستأجر بدرجة جديدة.' },
    new_tenant_appeared:{ en: 'New tenant', ar: 'مستأجر جديد' },

    /* ---- Score: labels (Layer 1) ---- */
    score_title:      { en: 'Rent-Trust Score', ar: 'درجة الثقة الإيجارية' },
    sl_new:           { en: 'New tenant',        ar: 'مستأجر جديد' },
    sl_reliable:      { en: 'Paying on time',    ar: 'يدفع في وقته' },
    sl_recovering:    { en: 'Recovering',        ar: 'يتعافى' },
    sl_late:          { en: 'Recently late',     ar: 'تأخر مؤخراً' },

    /* ---- Score: one-line tags (Layer 2) ---- */
    tag_new:          { en: 'New tenant — no payment history yet. Score will reflect real behaviour over time.', ar: 'مستأجر جديد — لا يوجد سجل دفعات بعد. ستعكس الدرجة السلوك الفعلي مع الوقت.' },
    tag_reliable:     { en: 'High score — paid on time or early for {n} consecutive months.', ar: 'درجة عالية — دفع في الوقت المحدد أو قبله لمدة {n} أشهر متتالية.' },
    tag_late:         { en: 'Score decreased — a recent payment was late by {n} days.', ar: 'انخفضت الدرجة — تأخرت دفعة أخيرة {n} يوماً.' },
    tag_recovering:   { en: 'Score improving — recovering with {n} recent on-time payments.', ar: 'الدرجة في تحسّن — تتعافى مع {n} دفعات أخيرة في وقتها.' },

    /* ---- Score: Layer 3 + framing ---- */
    see_details:      { en: 'See details',       ar: 'التفاصيل' },
    hide_details:     { en: 'Hide details',      ar: 'إخفاء التفاصيل' },
    early_stage:      { en: 'The Rent-Trust Score grows more accurate as AmanRent records more rental history. It is an early-stage feature.', ar: 'تزداد دقة درجة الثقة مع تسجيل المزيد من سجل الإيجار. هذه ميزة في مرحلة مبكرة.' },
    free_note:        { en: 'You can always view your own score for free. It is never charged.', ar: 'يمكنك دائماً عرض درجتك مجاناً. لا يتم احتسابها أبداً.' },
    behind_score:     { en: 'Behind this score',  ar: 'خلف هذه الدرجة' },
    score_out_of:     { en: 'out of 1000',        ar: 'من 1000' },
    detail_new:       { en: 'This tenant joined recently and has no recorded payments yet. A new tenant starts high because nothing has counted against them — the score will move to reflect real behaviour as payments are recorded.', ar: 'انضم هذا المستأجر مؤخراً ولا توجد لديه دفعات مسجّلة بعد. يبدأ المستأجر الجديد بدرجة عالية لأنه لا شيء ضدّه — وستتحرك الدرجة لتعكس السلوك الفعلي مع تسجيل الدفعات.' },
    detail_reliable:  { en: 'Rent has been paid on time or early for {n} consecutive months. A consistent on-time record is the strongest positive signal the score tracks.', ar: 'دُفع الإيجار في وقته أو قبله لمدة {n} أشهر متتالية. السجل المنتظم في الوقت هو أقوى إشارة إيجابية تتبعها الدرجة.' },
    detail_late:      { en: 'The score dipped because a recent payment arrived {n} days late. One late payment lowers the score but does not erase a good history; on-time payments will recover it.', ar: 'انخفضت الدرجة لأن دفعة أخيرة وصلت متأخرة {n} يوماً. تأخر دفعة واحدة يخفض الدرجة لكنه لا يمحو سجلاً جيداً؛ وستتعافى مع الدفعات في وقتها.' },
    detail_recovering:{ en: 'After an earlier late payment, the last {n} payments arrived on time. The score is climbing back as the recent pattern improves.', ar: 'بعد تأخر سابق، وصلت آخر {n} دفعات في وقتها. تعود الدرجة للصعود مع تحسّن النمط الأخير.' },

    /* ---- Tour ---- */
    tour_next:        { en: 'Next',              ar: 'التالي' },
    tour_skip:        { en: 'Skip tour',         ar: 'تخطّي الجولة' },
    tour_done:        { en: 'You\'re free to explore', ar: 'أنت حر في الاستكشاف' },
    tour_finish:      { en: 'Finish',            ar: 'إنهاء' },
    tour_step:        { en: 'Step {n} of {total}', ar: 'الخطوة {n} من {total}' },
    tour_action_hint: { en: 'Tap the highlighted button to continue.', ar: 'اضغط الزر المضيء للمتابعة.' },

    t1_title:         { en: 'Welcome to AmanRent', ar: 'مرحباً بك في أمان رنت' },
    t1_body:          { en: 'This is a demonstration with sample data, built so you can see how the product works. This toggle switches the whole app between English and Arabic — try it and switch back.', ar: 'هذا عرض توضيحي ببيانات نموذجية، أُعدّ لتتمكن من رؤية كيفية عمل المنتج. يبدّل هذا الزر التطبيق بالكامل بين الإنجليزية والعربية — جرّبه ثم عُد.' },
    t2_title:         { en: 'You are the tenant',  ar: 'أنت المستأجر' },
    t2_body:          { en: 'The tour starts on the tenant side, because this is where everything begins.', ar: 'تبدأ الجولة من جانب المستأجر، لأن كل شيء يبدأ من هنا.' },
    t3_title:         { en: 'Your next rent',      ar: 'إيجارك القادم' },
    t3_body:          { en: 'Here is your next rent: the amount, due on the 1st, your landlord and the property. AmanRent prepares everything in advance.', ar: 'هذا إيجارك القادم: المبلغ، المستحق في الأول من الشهر، ومالكك والعقار. يجهّز أمان رنت كل شيء مسبقاً.' },
    t4_title:         { en: 'One-tap approval',    ar: 'موافقة بنقرة واحدة' },
    t4_body:          { en: 'On the 1st at 9:01 AM you get one request. Tap Review, confirm who you\'re paying, then slide to approve — just like a real CliQ payment.', ar: 'في الأول من الشهر الساعة 9:01 صباحاً تصلك طلب واحد. اضغط مراجعة، أكّد مَن تدفع له، ثم اسحب للموافقة — تماماً كدفعة كليك حقيقية.' },
    t5_title:         { en: 'Done',               ar: 'تم' },
    t5_body:          { en: 'That is the whole job for the tenant. One tap, every month.', ar: 'هذه هي مهمة المستأجر بالكامل. نقرة واحدة، كل شهر.' },
    t6_title:         { en: 'Your lease is legally binding', ar: 'عقدك ملزم قانونياً' },
    t6_body:          { en: 'Signed with Sanad and notarised electronically, it carries full legal authority and can be enforced directly through the Execution Department — no lawsuit needed.', ar: 'موقّع عبر سند وموثّق إلكترونياً، يحمل كامل القوة القانونية ويمكن تنفيذه مباشرةً عبر دائرة التنفيذ — دون الحاجة لدعوى.' },
    t7_title:         { en: 'Your Rent-Trust Score', ar: 'درجة الثقة الإيجارية' },
    t7_body:          { en: 'Your score always comes with the reason behind it, and you can always see it for free. It grows more useful over time.', ar: 'تأتي درجتك دائماً مع السبب وراءها، ويمكنك رؤيتها مجاناً دائماً. وتزداد فائدتها مع الوقت.' },
    t8_title:         { en: 'Now switch to the landlord', ar: 'انتقل الآن إلى المالك' },
    t8_body:          { en: 'You just paid as the tenant. Now see what the landlord experiences.', ar: 'لقد دفعت للتو كمستأجر. شاهد الآن ما يختبره المالك.' },
    t9_title:         { en: 'Rent received, automatically', ar: 'تم استلام الإيجار، تلقائياً' },
    t9_body:          { en: 'This is the rent you just approved, arriving on its own on the 1st at 9:01 AM — no message sent.', ar: 'هذا هو الإيجار الذي وافقت عليه للتو، يصل من تلقاء نفسه في الأول من الشهر الساعة 9:01 صباحاً — دون أي رسالة.' },
    t10_title:        { en: 'Reading tenants at a glance', ar: 'قراءة المستأجرين بنظرة' },
    t10_body:         { en: 'Every score comes with context, so the number is never misleading. You\'re free to explore from here.', ar: 'تأتي كل درجة مع سياقها، فلا يكون الرقم مضلّلاً أبداً. أنت حر في الاستكشاف من هنا.' },

    /* ---- Misc ---- */
    explore_freely:   { en: 'You can now explore everything yourself.', ar: 'يمكنك الآن استكشاف كل شيء بنفسك.' }
  };

  // Month names for both languages (index 0 = January)
  var MONTHS = {
    en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
    ar: ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر']
  };

  function interpolate(s, vars) {
    if (!vars) return s;
    return s.replace(/\{(\w+)\}/g, function (m, k) {
      return (vars[k] !== undefined && vars[k] !== null) ? vars[k] : m;
    });
  }

  AR.i18n = {
    lang: 'en',
    STR: STR,
    t: function (key, vars) {
      var entry = STR[key];
      if (!entry) return '[' + key + ']';
      var s = entry[AR.i18n.lang] || entry.en;
      return interpolate(s, vars);
    },
    monthName: function (idx) { return MONTHS[AR.i18n.lang][idx]; },
    isRTL: function () { return AR.i18n.lang === 'ar'; }
  };

  // Convenience shortcut used everywhere
  AR.t = function (key, vars) { return AR.i18n.t(key, vars); };

  // Currency formatter — JOD / د.أ, western digits (common in Jordan)
  AR.money = function (n) {
    var num = Number(n).toLocaleString('en-US');
    return AR.i18n.lang === 'ar' ? (num + ' د.أ') : (num + ' JOD');
  };

})(window.AR = window.AR || {});
