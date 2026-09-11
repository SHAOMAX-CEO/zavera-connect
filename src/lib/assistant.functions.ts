import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  lang: z.enum(["sw", "en"]).default("sw"),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(30),
});

const SYSTEM_PROMPT = `You are "AFRICAN Assistance", the help assistant of ZAVERA.

ZAVERA facts you may share:
- ZAVERA connects people in Africa with international students who want to learn about African culture, traditions, history, food, music, ancient kingdoms and languages.
- The tagline is "Ongea na Dunia. Shiriki Afrika. Pata Kipato."
- Visitors can browse the student directory, and start a chat. A free introduction lasts 30 seconds.
- To keep chatting or to use VOICE, a person must create an account. Registration costs $6 (about TZS 16,000) at https://moxeraagencies.com/register?ref=Aurea
- Payment amounts per conversation vary. An example range shown on the site is TZS 50,000 - 150,000, but this is only an example.
- Support: email Missshamii0@gmail.com or the WhatsApp channel https://whatsapp.com/channel/0029Vb7epIc6WaKubQCrb72f

Hard rules:
- NEVER promise, guarantee or estimate income for a specific person. Say earnings depend on availability, skill and demand, and nothing is guaranteed.
- Never invent statistics, student numbers, or payout figures.
- If you do not know something, say so and point to support.
- Answer in Swahili by default; answer in English only if the user writes in English or asks for English. Keep replies short (max 4 sentences).`;

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      return { ok: false as const, error: "config", reply: "" };
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "google/gemini-3.8-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "system", content: `Preferred reply language: ${data.lang}` },
          ...data.messages,
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("assistant gateway error", response.status, body);
      if (response.status === 429) return { ok: false as const, error: "rate_limit", reply: "" };
      if (response.status === 402 || response.status === 403)
        return { ok: false as const, error: "credits", reply: "" };
      return { ok: false as const, error: "unknown", reply: "" };
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = payload.choices?.[0]?.message?.content?.trim() ?? "";
    if (!reply) return { ok: false as const, error: "empty", reply: "" };
    return { ok: true as const, error: null, reply };
  });
