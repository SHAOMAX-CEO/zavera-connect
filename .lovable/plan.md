# Lightweight social proof for ZAVERA

## What will change
- Add one compact activity layer shared across the existing pages.
- Rotate verified payment notifications for three seconds each, using only confirmed payment records. If none exist, show no payment claim.
- Rotate currently online students near the top, with a direct Chat action. Keep the existing offline guard and update its English message to: “This person is currently offline, please choose another person.”
- Add a smooth, lightweight announcement ticker near the top using real online-student activity and factual ZAVERA guidance.
- Add a testimonials band above the existing footer, designed to show only approved, attributable testimonials. Until verified names and quotes are supplied, it will show a neutral “Stories coming soon” state rather than invented financial claims.

## Experience and safety
- Preserve the current colors, navigation, registration flow, chat, one-minute timer, AI assistant, and all existing pages.
- Respect reduced-motion settings and avoid sound, large libraries, or heavy animation.
- Keep payment amounts and testimonials database-backed and truthful; never generate fake social proof.

## Technical details
- Add a small public-safe activity query that returns currently online students and confirmed payments only, masking payment identities to first name plus initial.
- Add one reusable activity component to the shared page shell and one testimonials component to the home page.
- Keep all controls mobile-friendly and ensure activity overlays do not cover the existing assistant/support buttons.
- Verify mobile and desktop rendering, online/offline chat behavior, timed popup rotation, assistant access, and the production build.
