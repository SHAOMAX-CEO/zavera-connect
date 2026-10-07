# Zavera Connect

Build ZAVERA: a premium, mobile-first Swahili web platform connecting users with international students interested in African culture, traditions, history, and languages.

Key Requirements:
1. Brand & Design:
- Name: ZAVERA ("Ongea na Dunia. Shiriki Afrika. Pata Kipato.")
- Secondary: "Wanafunzi wa kimataifa wanataka kujifunza Afrika kutoka kwa watu wanaoifahamu vizuri..."
- Default language Swahili with English toggle foundation.
- Aesthetics: Deep black, dark navy, electric blue accents, African gold highlights, glassmorphism cards, soft shadows, responsive mobile-first typography.

2. Hero & Real-time Indicator:
- Headline: "Shiriki Maarifa Yako Kuhusu Afrika. Ongea na Dunia."
- Subtitle, CTA buttons ("Tazama Wanafunzi", "Jinsi Inavyofanya Kazi").
- Real-time online indicator showing active student count from database (never fake stats).

3. International Students Directory:
- Search and filterable grid by topic (African History, Traditional Food, Ancient Kingdoms, Languages, Music, etc.) and country.
- Student profile cards: photo/avatar, name, country flag, languages, topic, availability, rate, "CHAT" and "VOICE" actions.
- Real database records.

4. Chat Experience:
- Interactive chat UI with student details, message history, timestamps, real-time message exchange.
- 30-second introductory timer ("Muda wa Utambulisho: 00:30").
- After countdown: prompt to create account with registration info ($6 / ~TZS 16,000) linking externally to https://moxeraagencies.com/register?ref=Aurea without false earning promises.

5. Voice Feature Gate:
- VOICE button checks account eligibility; if not yet registered, displays premium modal prompting registration at https://moxeraagencies.com/register?ref=Aurea.

6. Core Sections:
- Earnings section: transparent guidelines, rate estimates (TZS 50,000 - 150,000 example), strict disclaimer.
- How It Works (4 steps): Unda Account, Chagua Mwanafunzi, Anza Mazungumzo, Kamilisha Huduma.
- Usalama na Uwazi (Trust & Safety): Privacy, security, transparent earnings, no deceptive guarantees.
- Footer with brand mission, quick links, and 2026 copyright.

7. Floating Assistants & Support:
- Floating "AFRICAN Assistance" AI chat widget answering platform FAQs truthfully without misleading income guarantees.
- Floating "CUSTOMER SUPPORT" panel with mailto:Missshamii0@gmail.com and WhatsApp channel link (https://whatsapp.com/channel/0029Vb7epIc6WaKubQCrb72f).

8. Backend & Database (Supabase / Lovable Cloud):
- Tables: profiles, students, conversations, messages, voice_sessions, opportunities, payments, support_messages.
- Proper RLS policies and realtime subscription setup.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://zavera-africonnect.vercel.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/42e37bd6-4523-4d25-9dce-7be2529a72c8).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
