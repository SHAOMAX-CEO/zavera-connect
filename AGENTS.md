<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Social-proof UI must render only verified backend activity and consented testimonials, because fabricated financial claims damage user trust.
- Payment popup timing uses a shared pure frame calculation, because rotation must keep repeating even with a single confirmed record.
- Phone installation remains manifest-only and uses the browser's native install prompt, because offline caching was not requested.
- Registration promotion uses a shared lightweight ticker and the existing registration constant, because every account prompt must keep the same destination.

- AI chat calls go through src/lib/ai-chat.server.ts: LOVABLE_API_KEY (Lovable hosting) first, else GEMINI_API_KEY (+ optional GEMINI_MODEL) for external hosts like Vercel, because the Lovable key is not available off-platform.
