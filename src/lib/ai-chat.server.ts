// Server-only chat completion helper. Works on Lovable (LOVABLE_API_KEY) and on
// external hosts like Vercel (GEMINI_API_KEY, Google's OpenAI-compatible API).
type Msg = { role: "system" | "user" | "assistant"; content: string };
export type ChatResult =
  | { ok: true; error: null; reply: string }
  | { ok: false; error: "config" | "rate_limit" | "credits" | "unknown" | "empty"; reply: "" };

export async function chatComplete(messages: Msg[], tag: string): Promise<ChatResult> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  const geminiKey = process.env["GEMINI_API_KEY"];

  let url: string;
  let headers: Record<string, string>;
  let model: string;
  if (lovableKey) {
    url = "https://ai.gateway.lovable.dev/v1/chat/completions";
    headers = { "Lovable-API-Key": lovableKey, "X-Lovable-AIG-SDK": "fetch" };
    model = "google/gemini-3.8-flash";
  } else if (geminiKey) {
    url = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
    headers = { Authorization: `Bearer ${geminiKey}` };
    model = process.env["GEMINI_MODEL"] || "gemini-2.5-flash";
  } else {
    console.error(`[${tag}] no AI key configured (set GEMINI_API_KEY on Vercel)`);
    return { ok: false, error: "config", reply: "" };
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ model, messages }),
    });
    if (!response.ok) {
      console.error(`[${tag}] AI error`, response.status, await response.text());
      if (response.status === 429) return { ok: false, error: "rate_limit", reply: "" };
      if (response.status === 402 || response.status === 403)
        return { ok: false, error: "credits", reply: "" };
      if (response.status === 401) return { ok: false, error: "config", reply: "" };
      return { ok: false, error: "unknown", reply: "" };
    }
    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const reply = payload.choices?.[0]?.message?.content?.trim() ?? "";
    if (!reply) return { ok: false, error: "empty", reply: "" };
    return { ok: true, error: null, reply };
  } catch (err) {
    console.error(`[${tag}] AI network error`, err);
    return { ok: false, error: "unknown", reply: "" };
  }
}
