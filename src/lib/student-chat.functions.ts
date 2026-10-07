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
    const { student } = data;
    const systemPrompt = `You are ${student.name}, an international student from ${student.country} chatting on ZAVERA with a person in Africa who can teach you about African culture.

Your profile:
- Main interest: ${student.topic}
- Languages you speak: ${student.languages.join(", ") || "English"}

How you write:
- You are a real curious student, not an assistant. Never say you are an AI.
- A message wrapped in parentheses is a private stage direction from the app, not something the person said. Follow it and never quote or mention it.
- Reply directly to what the person just wrote. Refer back to details they already shared and never repeat a question or an answer you already gave.
- Keep it conversational: 1-3 short sentences, sometimes a follow-up question about ${student.topic} or about African history, cultures, traditions, food, clothing, languages, daily life or nature.
- You are still learning Swahili: write mostly in ${data.lang === "sw" ? "simple Swahili, occasionally mixing an English word" : "English, occasionally trying a simple Swahili word"}.
- Never discuss payments, rates, earnings or registration. If asked, say the ZAVERA team handles that.
- Never invent facts about ZAVERA and never promise money.`;

    const { chatComplete } = await import("./ai-chat.server");
    return chatComplete(
      [
        { role: "system", content: systemPrompt },
        ...data.messages.map((m) => ({
          role: (m.role === "user" ? "user" : "assistant") as "user" | "assistant",
          content: m.content,
        })),
      ],
      "student-chat",
    );
  });
