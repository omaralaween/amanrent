# AmanRent Demo Application — Build Specification

**Version:** 1.0
**Prepared for:** HTU Free Choice Elective 1 (Course 30302237) — Portfolio submission, D1 criterion
**Product:** AmanRent — Jordan's first fintech trust infrastructure for the rental market
**Purpose of this document:** A complete specification of how the AmanRent demo application should look, behave, and be built.

---

## 0. What this build is, and what it is not

This is a **demonstration application**, built so that the course instructor can open it, tap through it, and validate the AmanRent concept end to end. It is deliberately scoped as a demo, not a production system. Read this section carefully before building, because every later decision follows from it.

### It is a mobile-first application

The application is designed **mobile-first**. The entire layout, navigation, type sizing, and tap-target spacing are built for a phone screen first, and only then allowed to scale up. The reason is simple: the real AmanRent product is a mobile app used by tenants and landlords in Jordan, on their phones, in the real world. The demo must feel like that product, so it is built phone-first.

It is **also fully responsive on desktop**. When opened on a laptop or large monitor, the application renders inside a centered phone frame so the mobile experience stays intact and the surrounding space is used cleanly, rather than stretching the mobile UI across a wide screen and breaking the feel. The mobile experience is the priority; the desktop rendering is a courtesy so the instructor can open it on whatever device is in front of him.

### It uses mock data only

Every number, name, payment, lease, and score in the application is **mock data**, hard-coded into the app. There is no backend, no database, no real bank connection, no real Sanad integration, no real CliQ transaction. The application does not move money. It does not store anyone's identity. It simulates these flows visually so the idea can be understood and judged.

This is intentional and correct for the stage. AmanRent at this point is a validated concept and a working demonstration, not a deployed financial product. A real deployment would require Central Bank of Jordan engagement, CliQ RTP integration, Sanad API access through the relevant government channel, and the regulatory clearances that come with handling rent payments and tenant scoring. None of that is in scope for a course demo, and pretending otherwise would misrepresent the product's maturity.

### It is for a single user: the instructor

The application is **not** being published to the Apple App Store or Google Play Store. It is hosted as a single web application at a private URL, and the instructor reaches it by **scanning one QR code**. The browser opens, and the app runs. No download, no install, no account creation, no app-store search, no "allow unknown sources" warning. This matters because the intended user is the instructor, who should not have to be technical to evaluate the work.

A note for the report: AmanRent's real product vision is a **native mobile app** (built in a cross-platform framework such as React Native or Flutter). For this submission, the demonstration is delivered as a mobile-first web application so the instructor can open it instantly by scanning a QR code, with no installation step. This is a deliberate delivery choice driven by the single-evaluator use case and the submission timeline, and it does not change the product's underlying design or vision. The screens, flows, and features specified below are exactly what the native app would present.

---

## 1. Design system

The application uses the existing AmanRent brand identity with no deviation.

### Colours

| Role | Name | HEX |
|------|------|-----|
| Primary background (dark mode) | Deep Navy | #1B2B6B |
| Deeper background / surfaces | Dark Navy | #0F1A3F |
| Accent / success / confirmation | Emerald | #00A86B |
| Light mode background | Platinum | #F4F4F5 |
| Text on dark, surfaces | White | #FFFFFF |

Emerald is reserved for confirmation, success, money received, and positive movement. It is never used as a large background fill; it highlights the most important element on a screen (a received payment, an approved lease, a rising score).

### Typography

Inter throughout (the brand typeface), with system sans-serif fallback (Arial, Helvetica). Type hierarchy: bold and large for screen titles and key figures, semibold for section labels, regular for body, smaller and lighter for secondary/contextual text. Minimum body size 9pt equivalent; on mobile, body should be comfortably readable without zooming.

### Visual style

Flat, geometric, no gradients, no drop shadows used decoratively (a subtle elevation shadow on cards is acceptable for depth), no textures. Generous spacing. The shield-house-checkmark logo is the brand anchor. Sentence case throughout. This matches the brand's "90 percent disciplined, 10 percent distinctive" principle: restraint as default, personality through specific signatures.

### Accessibility for the target age range

The real users are tenants and landlords in Jordan across a wide age range, including older landlords who are not necessarily comfortable with technology. The demo must reflect that design discipline:

- Large tap targets (minimum 48px height on interactive elements).
- High text contrast (white on navy, navy on platinum).
- Minimal steps to complete any action.
- No dense menus, no hidden gestures, no jargon on primary screens.
- Plain language. Technical terms (CliQ RTP, Sanad) appear with a one-line plain explanation the first time they are shown.

---

## 2. Bilingual requirement (Arabic / English toggle)

The application supports **Arabic and English** with a visible toggle in the top bar, available on every screen.

- English renders left-to-right (LTR).
- Arabic renders **right-to-left (RTL)**: the entire layout mirrors, including navigation order, icon placement, and text alignment. This is not optional and not cosmetic; an RTL layout that only changes the text but keeps an LTR layout reads as broken to an Arabic speaker.
- All interface strings, screen titles, button labels, and the score explanation tags must exist in both languages.
- Numbers and currency show as Jordanian Dinar (JOD / د.أ) in both languages.
- The toggle switches the whole interface live, without reloading or losing the user's place.

The brand wordmark stays "AmanRent" with "أمان رنت" as the Arabic lockup, as per the brand guidelines.

---

## 3. Two roles, one app

The app opens to a **role chooser** so the instructor can experience both sides of the marketplace. This is important: AmanRent is a two-sided product, and the demo should let the evaluator switch between the tenant view and the landlord view freely.

- **Tenant view** — the person who pays rent.
- **Landlord view** — the person who receives rent.

A simple role switch (top bar or a clearly labelled control) lets the instructor jump between the two without restarting. State (mock data) is shared so a payment approved on the tenant side is reflected on the landlord side, making the demo feel connected.

---

## 4. Feature list (what the instructor can do)

Tight and focused, because a clean demo beats a sprawling one. Buttons are tapped by the instructor; text fields auto-fill with narration (Section 5a).

**Tenant side**
- Approve the CliQ Request-to-Pay (the core action; drives the payment and updates the score)
- View the Sanad lease and open the contract view
- View payment history
- View own score, free, with the three-layer read-more presentation

**Landlord side**
- See rent received automatically on the 1st at 9:01 AM (the hero payoff)
- Add a property/unit (address + monthly rent; fields auto-fill, instructor taps Save)
- Add/invite a tenant and draft a lease (tenant name, linked unit, rent, term; fields auto-fill, instructor taps Save) — the interactive centrepiece, because the new tenant then appears with a fresh "New tenant" score and its explanation tag, demonstrating the score-credibility logic live
- View tenants with scores + explanations (read-more)
- View incoming payments, with automated arrivals marked

**Shared**
- Language toggle (EN / ع) with full RTL
- Role switch (tenant ↔ landlord), shared state so a tenant payment shows up on the landlord side
- Guided tour, replayable (Section 7a)
- Reset demo control (Section 5b)

---

## 4b. Screen-by-screen specification

Below are the screens. Each is described as it should appear and behave. All data is mock.

### 4.1 Splash / entry screen
- AmanRent logo (shield-house-checkmark) centered on Deep Navy.
- Slogan: "Your rent. Automated. Trusted." / "إيجارك. تلقائي. موثوق."
- Language toggle (EN / ع) visible.
- A single primary button: "Enter demo" / "ابدأ".
- Small honest footer line: "Demonstration version. Mock data only." / "نسخة تجريبية. بيانات توضيحية فقط."

### 4.2 Role chooser
- Title: "I am a..." / "أنا..."
- Two large cards: **Tenant** (مستأجر) and **Landlord** (مالك).
- Each card has the icon, the role name, and one line describing what that person does.
- Tapping a card enters that role's home screen.
- A persistent way to switch role later (top-bar control).

---

### TENANT FLOW

### 4.3 Tenant home / dashboard
The tenant's main screen. Shows, top to bottom:
- Greeting with mock tenant name (e.g., "Marhaba, Layla").
- **The next rent payment card** (the hero element): amount in JOD, due date (1st of next month), property name/address, and the landlord's name. A clear status: "Scheduled" / "مجدول".
- A line explaining the automation honestly: "On the 1st at 9:01 AM, AmanRent will send you a CliQ Request-to-Pay. Approve once and your rent is sent." This is the honest CliQ RTP model: the tenant approves, it is not a silent auto-debit. Do not imply silent pull payment.
- **Rent-Trust Score widget** (supporting, not hero — see Section 5): the score number, a short label, and the contextual explanation tag.
- Bottom navigation: Home, Lease, Payments, Score.

### 4.4 The CliQ Request-to-Pay approval flow
This is the centrepiece of the tenant experience and the most important flow to get right, because it shows how AmanRent actually works within real CliQ rules.

- A simulated notification / prompt appears: "AmanRent: your rent for [month] is ready. JOD [amount] to [landlord]."
- Tenant taps "Review".
- A clean approval screen shows: amount, recipient (landlord), property, reference, and date.
- One primary action: "Approve payment" / "الموافقة على الدفع".
- On approval: an Emerald success state. "Rent sent. You're all set for [month]." A confirmation reference number (mock). The tenant's next payment card updates to "Paid". The score may tick up with an explanation (see Section 5).
- Honest framing throughout: the tenant is approving a Request-to-Pay, consistent with how CliQ RTP works in Jordan. The convenience is that AmanRent prepares everything, schedules the request, handles the contract and the record, and the tenant approves in one tap. The convenience is real; the silent-auto-debit claim would not be, so it is not made.

### 4.5 Tenant lease screen (Sanad / digital contract)
- Shows the active lease as a clean digital document card: parties (tenant, landlord), property, monthly rent, term, start/end dates.
- Status badge: "Signed and legally binding" / "موقّع وملزم قانونياً".
- A plain-language explanation: the lease was signed digitally using Sanad (Jordan's national digital ID) and notarised through the Electronic Notary Public service (Katib Al-Adl), giving it full legal authority even when the parties are not in the same place.
- A note that a notarised lease can be enforced directly through the Execution Department without filing a lawsuit. (This is AmanRent's real legal validation; it is a genuine strength, present it plainly.)
- A "View contract" action that opens a mock contract view.

### 4.6 Tenant payments history
- A list of past months, each showing month, amount, date paid, and a green "Paid" badge (mock history).
- One or two entries can show variety for the demo (e.g., one paid early, one paid on time) to feed the score explanation.

### 4.7 Tenant score screen
See Section 5 for full score logic. The tenant can always view their own score for free; this is never charged.

---

### LANDLORD FLOW

### 4.8 Landlord home / dashboard
- Greeting with mock landlord name.
- **The headline element:** "Rent received" — showing this month's rent landed automatically on the 1st at 9:01 AM, in Emerald, with the amount and the tenant/property. The emotional core of the product: the landlord got paid without sending a single message.
- A portfolio summary if multiple units (mock): total units, total expected rent, total received this month, anything outstanding.
- Bottom navigation: Home, Properties, Tenants, Payments.

### 4.9 Landlord properties / units
- A list of the landlord's rental units (mock), each with address, monthly rent, current tenant, and rent status for the month (received / scheduled).
- Tapping a unit shows its detail: tenant, lease summary, payment status, tenant's Rent-Trust Score with explanation.

### 4.10 Landlord tenants view
- List of the landlord's tenants with each tenant's Rent-Trust Score and explanation tag. This is where the score earns its value for the landlord: a quick, contextual read on reliability.
- Important ethical framing: the score is shown with context, never as a bare number that could mislead (see Section 5).

### 4.11 Landlord payments
- Incoming rent records: month, tenant, amount, date received, status. The automated arrivals are clearly marked.

### 4.12 Add tenant / set up a lease (optional demo flow)
If time allows, a simplified "invite a tenant / set up a new lease" flow that shows how a landlord onboards: enter property and rent, invite tenant, lease drafted, sent for Sanad signing. This is a nice-to-have that shows the onboarding wedge; if time is short, it can be a single illustrative screen rather than a full flow.

---

## 5. The Rent-Trust Score — contextual, explained, and deliberately secondary

This section is the most conceptually important change. Build it exactly as described.

### The score is not the hero feature yet
The Rent-Trust Score (0–1000) is shown in the demo as a **supporting feature, clearly labelled as early-stage**, not as the product's main selling point. The reason is honest and should be reflected in the UI: a reliability score only becomes meaningful once there is real payment history across many tenants over time. At launch there is no such data. So the demo presents the score as a feature that grows in value as AmanRent operates, and the automated rent flow and legal contract are the present-day hero features.

A visible line near the score states this, e.g.: "The Rent-Trust Score grows more accurate as AmanRent records more rental history. It is an early-stage feature." / "تزداد دقة درجة الثقة مع تسجيل المزيد من سجل الإيجار. هذه ميزة في مرحلة مبكرة."

### Every score comes with an explanation tag
A bare number is misleading. Every score, everywhere it appears, carries a short contextual explanation. The four core cases:

1. **New tenant, perfect/high score.** A new tenant starts at a high score. The explanation makes clear *why* it is high: there is no history yet, so nothing has counted against them.
   - Tag (EN): "New tenant — no payment history yet. Score will reflect real behaviour over time."
   - Tag (AR): "مستأجر جديد — لا يوجد سجل دفعات بعد. ستعكس الدرجة السلوك الفعلي مع الوقت."

2. **Established tenant, high score.** The explanation attributes it to real behaviour.
   - Tag (EN): "High score — paid on time or early for [N] consecutive months."
   - Tag (AR): "درجة عالية — دفع في الوقت المحدد أو قبله لمدة [N] أشهر متتالية."

3. **Decreasing score.** The explanation gives the reason.
   - Tag (EN): "Score decreased — a recent payment was late by [N] days."
   - Tag (AR): "انخفضت الدرجة — تأخرت دفعة أخيرة [N] يوماً."

4. **Increasing score.** The explanation shows the positive trend.
   - Tag (EN): "Score improving — recovering with [N] recent on-time payments."
   - Tag (AR): "الدرجة في تحسّن — تتعافى مع [N] دفعات أخيرة في وقتها."

Use additional context labels where useful: "New tenant", "Recovering, improving pattern", etc. The principle: the number never appears without the story behind it. This is what gives the score credibility, including for brand-new users.

### Three-layer presentation (read-more pattern) — applies everywhere a score appears
To keep screens compact and uncluttered while still never showing a bare number, every score is presented in three layers, shortest first. This pattern is used in **all** places a score is shown: the tenant home widget, the tenant's full score screen, the landlord's tenants list, and the unit-detail view.

1. **Layer 1 — Status label (always visible):** two or three words only. Examples: "New tenant" / "مستأجر جديد"; "Paying on time" / "يدفع في وقته"; "Recovering" / "يتعافى"; "Recently late" / "تأخر مؤخراً". This sits next to the number so the number is never naked, even at a glance.
2. **Layer 2 — One-line explanation (default visible):** a single short sentence under the label (one of the four tag sentences above). Kept to one line where possible.
3. **Layer 3 — Full detail (behind a "See details" / "التفاصيل" link):** expands inline to show the fuller reasoning, the payment history points behind the score, and the "early-stage feature" note. Collapsed by default so the screen stays clean; the instructor expands it only if curious.

The expand/collapse is inline (no new page), animates open smoothly, and follows the active language including RTL. On the compact widgets (tenant home, landlord list), Layer 1 and the "See details" link may be enough, with Layer 2 shown on expand; on the dedicated score screen, Layers 1 and 2 are both visible by default and Layer 3 expands.

### Ethics rules baked into the build
- A tenant can **always view their own score for free.** Never gate it, never charge for it.
- The score is shown to a landlord **with its explanation tag**, never as a bare number.
- Mock score data should include at least: one new tenant (high, "new" tag), one established reliable tenant (high, history tag), and one tenant with a dip and recovery (to show the decreasing and increasing explanations). This lets the instructor see all four cases.

---

## 5a. Interaction model: assisted input, manual buttons

The demo is designed so the instructor feels in control without ever having to figure out *what to type*. The rule is a clean split:

**Typing is assisted (auto-fill with narration).** Anywhere the app has a form or text field the instructor would otherwise have to write into (adding a tenant, drafting a lease, entering a property and rent), the fields **fill themselves**, as if an invisible user were typing, with a short caption narrating each field as it populates. The instructor watches the data appear and understands what each field means, instead of facing a blank form and guessing.

- Fields fill at a readable, human-typing pace, not instant.
- Each field gets a one-line caption as it fills, e.g. "Entering the tenant's name…", "Linking them to Apartment 4, Jabal Amman…", "Setting monthly rent to 350 JOD…".
- A subtle cursor/highlight shows where the action is happening so the eye follows it.
- A "Pause" / "Skip" control is available so the instructor can jump ahead.

**Buttons are manual (the instructor taps them).** Every button, confirmation, and decision is pressed by the instructor: "Approve payment", "Save tenant", "Next", "Take the tour". The auto-fill prepares the input; the instructor commits the action. This gives genuine interactivity, the instructor drives the meaningful moments, while removing the friction and error of typing.

The handoff is explicit: when a field finishes auto-filling, the narration pauses and prompts the instructor for the action, e.g. "The lease is ready. Tap Save tenant when you're ready." The button waits for him. Nothing auto-commits.

This split runs through the whole app and through the guided tour: the tour narrates, the form fills itself, and the instructor taps to confirm.

### Varied mock data pool (no repeats)
The auto-fill must **not** fill the same record every time. Build a pool of **10 to 12 distinct mock entries per form type** (a pool of tenants, a pool of properties/units). Behaviour:

- Each time the instructor opens an auto-fill form, the app checks local storage for which pool entries have already been used, and fills the form with the **next unused** entry.
- Once an entry is used, it is **marked as used in local storage**, so the no-repeat rule holds across reloads (consistent with the persistence model in Section 5b).
- When the pool is exhausted (all 10–12 used), the auto-fill **stops offering new entries** and the form behaves as a normal empty form, rather than looping back and repeating, looping would reintroduce the repetition this is meant to avoid, and twelve entries is ample variety for an evaluation.
- The **"Reset demo"** control also clears the used-markers, so the full pool becomes available again from the start.

The pool entries should feel real and Jordanian, so the variety is visibly credible rather than a changing name over identical numbers:
- Plausible tenant names (mix of male/female, common Jordanian names).
- Real Amman-area neighbourhoods: Jabal Amman, Abdoun, Khalda, Sweifieh, Tla' Al-Ali, Deir Ghbar, Shmeisani, and similar.
- Realistic, varied JOD rents: e.g. a small studio around 200–250, mid-size flats 350–600, a larger apartment 700+, and at least one or two **commercial units** at higher rents. The commercial entries are deliberate: they quietly reinforce the unit-economics point that higher commercial rents amplify transaction-fee income without any pricing change.
- Varied lease terms and, for the tenant pool, varied payment histories so the four score cases (new, established-reliable, recently-late, recovering) are all represented across the pool.

---

## 5b. Data persistence

**Model: full persistence via the device's browser storage.** Everything the instructor creates in the app (a tenant he adds, a lease he saves, a payment he approves) is saved to the browser on the device he is using, and survives closing and reopening the app on that same device and browser.

Honest scope of this choice, to be stated plainly in the report:
- Persistence is **per device and per browser.** Data saved on one phone does not appear on another device, and does not move with the instructor.
- It will not be present in private/incognito browsing, and is cleared if the browser's site data is cleared.
- This is browser-side storage, not a secure backend. It is appropriate for a single-evaluator demonstration and is explicitly not how the real product would store data.

**Report framing:** the demonstration persists the instructor's actions on his device so the experience feels like a real, stateful app during evaluation. Real AmanRent stores rent, lease, identity, and score data on secure server infrastructure in compliance with Jordan's Personal Data Protection Law and tied to Sanad identity, never in browser storage. The demo's local persistence is a deliberate, scoped choice for evaluation, not the production architecture.

**Required build safeguard (because persistence and auto-fill interact):** the app must not re-run the auto-fill seeding or re-create the curated demo data on every load. On first run it seeds the curated demo state (the mock tenants, the four score cases) and records a flag in storage that seeding is done. On subsequent loads it reads existing saved data instead of seeding again, so the instructor never sees duplicate tenants or a half-narrated form after a reload. A visible **"Reset demo"** control lets the instructor (or you) wipe saved data and return to the clean curated starting state on demand; this is important so the demo can be returned to a pristine state between viewings.

---

## 6. Navigation map

```
Splash
  └─ Role chooser
       ├─ TENANT
       │    ├─ Home (next payment hero + score widget)
       │    ├─ CliQ RTP approval flow  → success state
       │    ├─ Lease (Sanad / notarised contract)
       │    ├─ Payments history
       │    └─ Score (full view, free, with explanation)
       │
       └─ LANDLORD
            ├─ Home (rent received hero + portfolio summary)
            ├─ Properties / units → unit detail
            ├─ Tenants (scores with explanations)
            ├─ Payments (incoming, automated arrivals marked)
            └─ (optional) Add tenant / set up lease
  Persistent: language toggle (EN/ع), role switch
```

---

## 7. Technical build notes (for whoever builds it)

- **Single self-contained file** (HTML with embedded CSS and JS), so it can be hosted by dropping one file. No build step, no dependencies that require a package manager at runtime. This keeps hosting and the QR handoff trivial.
- **Persistence via browser storage (localStorage).** The app saves the instructor's actions (tenants added, leases saved, payments approved) to the device's browser storage so they survive reload on that device/browser. See Section 5b for the full model, the honest scope, and the required seeding safeguard. Note: if this is ever run as a sandboxed artifact, localStorage is blocked, so the hosted-page deployment is the intended target. No server-side backend is used.
- **Seeding safeguard (required):** on first run, seed the curated demo state and set a "seeded" flag in storage; on later loads, read saved data instead of re-seeding, to avoid duplicate tenants or re-triggered auto-fill. Provide a visible "Reset demo" control to wipe storage and return to the clean curated state.
- **Mobile-first responsive.** Build for a ~380px-wide phone viewport first. On wider screens, render the app inside a centered phone frame (max-width around 430px) on a neutral backdrop so the mobile UI is preserved rather than stretched.
- **RTL handled properly** for Arabic (mirror layout, not just text alignment).
- **"Add to Home Screen" friendly.** A web app manifest and an icon let the instructor optionally add it to his home screen so it behaves like an installed app. Optional but a nice touch given the "feels native" goal.
- **Hosting + QR:** host the single file (Netlify Drop or GitHub Pages, both free, no friction), then generate a QR code pointing at the resulting public URL. The QR is the only thing the instructor needs.
- **Honest labelling stays in the build:** the "demonstration / mock data" line is part of the product, not a disclaimer to hide. It belongs on the splash and somewhere persistent.

---

## 7a. Guided on-screen tour (required)

The application includes a **built-in guided tour** that runs automatically on first open and can be re-triggered at any time from a "Take the tour" control. This is a core requirement, not optional. The intended user is a non-technical instructor evaluating the concept; the tour walks them through the main flow step by step so they never have to guess where to tap or what they are looking at.

### How the tour works
- On first launch (after the splash), the tour begins automatically.
- Each step shows a **spotlight/highlight** on the relevant element, a short **caption** explaining what it is, and a **"Next"** button. A "Skip tour" option is always available.
- The tour **drives the flow itself**: when a step needs an action (for example, approving the CliQ payment), the tour points to the button and advances when it is tapped, so the instructor genuinely performs the key action rather than just reading about it.
- The tour is fully bilingual: every caption exists in English and Arabic and follows the active language toggle (including RTL layout for the highlights and captions in Arabic).
- A small progress indicator (e.g., "Step 3 of 9") so the instructor knows how far along they are.

### The tour starts on the TENANT side. (Design decision — rationale below.)
The guided tour begins in the **tenant** role and ends in the **landlord** role. The reason: AmanRent's value chain starts with the tenant. The tenant signs the Sanad lease, approves the CliQ Request-to-Pay, and triggers the payment. The landlord's payoff — rent arriving automatically on the 1st with no message sent — only makes emotional and logical sense *after* the instructor has seen what causes it. Starting tenant-first lets the tour build cause, then effect: the instructor personally approves a payment as the tenant, then switches to the landlord and watches that same payment land automatically. Landlord-first would show the payoff before the cause and weaken the demonstration. It also lets the tour close the loop on the score: approve as tenant, watch the score rise with its explanation, then switch to landlord and see that same tenant's score from the other side, demonstrating the two-sided marketplace in one continuous path.

### Tour steps
1. **Welcome + honesty note.** "Welcome to AmanRent. This is a demonstration with sample data, built so you can see how the product works." Point out the language toggle; invite the instructor to try Arabic and switch back.
2. **You are the tenant.** Explain the tour starts from the tenant's side because this is where everything begins. Land on the tenant home.
3. **Your next rent.** Highlight the next-payment card: amount, due on the 1st, the landlord, the property. Caption explains AmanRent prepares everything in advance.
4. **One-tap approval.** Highlight the CliQ Request-to-Pay prompt. Caption: "On the 1st at 9:01 AM you get one request. Approve once and your rent is sent." Advance when the instructor taps approve.
5. **Done.** Show the Emerald confirmation. Caption: "That is the whole job for the tenant. One tap, every month."
6. **Your lease is legally binding.** Move to the lease screen. Highlight the Sanad-signed, notarised status. Caption explains full legal authority and direct enforcement through the Execution Department, in plain language.
7. **Your Rent-Trust Score.** Highlight the score and its explanation tag. Caption: "Your score always comes with the reason behind it, and you can always see it for free. It grows more useful over time."
8. **Now switch to the landlord.** The tour switches role for the instructor. Caption: "You just paid as the tenant. Now see what the landlord experiences."
9. **Rent received, automatically.** Land on the landlord home and spotlight the "rent received on the 1st at 9:01 AM, no message sent" hero. Caption ties it back: "This is the rent you just approved, arriving on its own."
10. **Reading tenants at a glance.** Highlight the tenants list with scores and explanations. Caption: "Every score comes with context, so the number is never misleading." End the tour here, with a "You're free to explore" close.

After the tour ends, the instructor is free to navigate everything manually, and can replay the tour from the "Take the tour" control at any time.

---

## 8. Demo script (suggested, for the instructor walk-through)

This mirrors the guided tour above and can be included in the report as the documented walk-through path:

1. Open via QR. See the splash and the honest "demo / mock data" line. Toggle to Arabic and back to see the bilingual RTL support.
2. Choose **Tenant**. See the next rent payment scheduled for the 1st. Read the one-tap CliQ approval explanation.
3. Run the **CliQ Request-to-Pay approval**. Approve. See the Emerald confirmation and the score tick up with its explanation.
4. Open the **Lease** screen. See the Sanad-signed, notarised, legally binding contract and the plain-language legal explanation.
5. Open the **Score** screen. See the contextual explanation and the "early-stage feature" framing.
6. Switch to **Landlord**. See "rent received automatically on the 1st at 9:01 AM, no message sent" as the hero.
7. Open **Tenants**. See each tenant's score *with its explanation*: a new tenant, a reliable long-term tenant, and one recovering from a dip.

That path demonstrates every required idea: automation, honest CliQ flow, legal contract via Sanad, the contextual score, the two-sided marketplace, and the bilingual mobile-first design.

---

*End of specification.*
