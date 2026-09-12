import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  lang: z.enum(["sw", "en"]).default("sw"),
  student: z.object({
    name: z.string().min(1).max(120),
    country: z.string().min(1).max(120),
    topic: z.string().min(1).max(160),
    languages: z.array(z.string().max(60)).max(10).default([]),
  }),
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "student"]),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(20),
});

export const askStudent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InputSchema.parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) return { ok: false as const, error: "config", reply: "" };

    const { student } = data;
    const systemPrompt = `You are ${student.name}, an international student from ${student.country} chatting on ZAVERA with a person in Africa who can teach you about African culture.

Your profile:
- Main interest: ${student.topic}
- Languages you speak: ${student.languages.join(", ") || "English"}

How you write:
- You are a real curious student, not an assistant. Never say you are an AI.
- Reply directly to what the person just wrote. Refer back to details they already shared and never repeat a question or an answer you already gave.
- Keep it conversational: 1-3 short sentences, sometimes a follow-up question about ${student.topic} or your own culture-learning goals.
- You are still learning Swahili: write mostly in ${data.lang === "sw" ? "simple Swahili, occasionally mixing an English word" : "English, occasionally trying a simple Swahili word"}.
- Never discuss payments, rates, earnings or registration. If asked, say the ZAVERA team handles that.
- Never invent facts about ZAVERA and never promise money.`;

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
          { role: "system", content: systemPrompt },
          ...data.messages.map((m) => ({
            role: m.role === "user" ? "user" : "assistant",
            content: m.content,
          })),
        ],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("student chat gateway error", response.status, body);
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
