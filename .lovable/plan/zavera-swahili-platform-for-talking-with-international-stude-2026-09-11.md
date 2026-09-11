# ZAVERA — Swahili platform for talking with international students

A premium, mobile-first Swahili website where people in Africa share their culture with international students. Dark theme (deep black / navy) with electric blue and African gold accents, glass-style cards.

## Pages and sections

**Home (single scrolling landing + separate pages for the main areas)**
- Hero: "Shiriki Maarifa Yako Kuhusu Afrika. Ongea na Dunia." with subtitle, and two buttons: "Tazama Wanafunzi" and "Jinsi Inavyofanya Kazi".
- Live indicator showing how many students are actually online right now, read from the database. If the number is zero, it says zero — no invented figures.
- Short intro line: "Wanafunzi wa kimataifa wanataka kujifunza Afrika kutoka kwa watu wanaoifahamu vizuri..."
- Earnings section: honest ranges (example TZS 50,000 – 150,000) with a clear disclaimer that nothing is guaranteed.
- How It Works, 4 steps: Unda Account, Chagua Mwanafunzi, Anza Mazungumzo, Kamilisha Huduma.
- Usalama na Uwazi: privacy, safety, transparent pay, no promises.
- Footer: mission, quick links, 2026 copyright.

**Students directory**
- Search box plus filters by topic (African History, Traditional Food, Ancient Kingdoms, Languages, Music, and more) and by country.
- Cards showing avatar, name, country flag, languages, topic, availability, rate, and CHAT / VOICE buttons.
- All students come from the database, seeded with real starter records.

**Chat page**
- Student details at the top, message list with timestamps, message box, messages appearing live.
- A 30-second intro timer: "Muda wa Utambulisho: 00:30".
- When it ends, a card appears asking the visitor to create an account (registration $6 / about TZS 16,000) linking to https://moxeraagencies.com/register?ref=Aurea. No earning promises in that copy.

**Voice button**
- Checks whether the visitor has a registered account. If not, a premium-looking modal invites them to register at the same link.

## Floating helpers
- "AFRICAN Assistance" chat bubble: an AI helper that answers questions about how ZAVERA works, told to stay factual and never promise income.
- "CUSTOMER SUPPORT" bubble: email Missshamii0@gmail.com and the WhatsApp channel link.

## Language
Swahili is the default text everywhere, with a SW/EN switch in the header wired to a small translation layer so English can be filled in progressively.

## Technical notes
- Enable Lovable Cloud for the database, accounts and realtime.
- Tables: `profiles`, `students`, `conversations`, `messages`, `voice_sessions`, `opportunities`, `payments`, `support_messages` — each with row-level security: students/opportunities publicly readable, conversations and messages readable and writable only by their participants, payments and profiles owner-only, support messages insert-only for visitors.
- Realtime enabled on `messages` and on the students' online flag for the live counter.
- Routes: `/` (landing), `/wanafunzi` (directory), `/wanafunzi/$id` (chat), `/jinsi-inavyofanya-kazi`, `/mapato`, `/usalama`, `/auth`. Each gets its own Swahili page title and description.
- The AI helper runs through a server function on Lovable AI; no keys in the browser.
- Guest chat allowed for the 30-second intro, then gated by the registration card.
