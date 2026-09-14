import { useServerFn } from "@tanstack/react-start";
import { Headset, Mail, MessageCircle, Send, Sparkle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { askAssistant } from "@/lib/assistant.functions";
import { SUPPORT_EMAIL, WHATSAPP_CHANNEL, useLang, useT } from "@/lib/i18n";

type ChatMessage = { role: "user" | "assistant"; content: string };

export function FloatingWidgets() {
  const t = useT();
  const { lang } = useLang();
  const ask = useServerFn(askAssistant);
  const [panel, setPanel] = useState<"none" | "ai" | "support">("none");
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const welcome = t(
    "Habari 👋 Karibu ZAVERA! Mimi ni msaidizi wako wa ZAVERA. Ninaweza kukusaidia kuelewa ZAVERA, kufungua akaunti, kujua jinsi mtandao unafanya kazi, na kujibu maswali kuhusu Afrika. Nikusaidie nini leo?",
    "Hello 👋 Welcome to ZAVERA! I am your ZAVERA AI Assistant. I can help you understand ZAVERA, create an account, learn how the platform works, and answer questions about Africa. How can I help you today?",
  );

  // The assistant greets first the moment the panel is opened.
  useEffect(() => {
    if (panel !== "ai") return;
    setMessages((prev) => (prev.length ? prev : [{ role: "assistant", content: welcome }]));
  }, [panel, welcome]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, pending, panel]);


  const send = async () => {
    const text = input.trim();
    if (!text || pending) return;
    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);
    setInput("");
    setPending(true);
    try {
      const result = await ask({
        data: { lang, messages: next.filter((m) => m.content).slice(-12) },
      });
      setMessages([
        ...next,
        {
          role: "assistant",
          content: result.ok
            ? result.reply
            : result.error === "rate_limit"
              ? t(
                  "Maswali ni mengi kwa sasa. Tafadhali jaribu tena baada ya dakika moja.",
                  "Too many questions right now. Please try again in a minute.",
                )
              : t(
                  `Msaidizi hapatikani kwa sasa. Tuma barua pepe kwa ${SUPPORT_EMAIL}.`,
                  `The assistant is unavailable right now. Please email ${SUPPORT_EMAIL}.`,
                ),
        },
      ]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content: t(
            "Kuna hitilafu ya mtandao. Tafadhali jaribu tena.",
            "A network error occurred. Please try again.",
          ),
        },
      ]);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-3">
      {panel === "ai" ? (
        <div className="glass flex h-[26rem] w-[min(22rem,calc(100vw-2rem))] flex-col rounded-2xl">
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-3">
            <div className="flex items-center gap-2">
              <Sparkle className="size-4 text-gold" />
              <span className="font-display text-sm font-semibold">AFRICAN Assistance</span>
            </div>
            <button type="button" onClick={() => setPanel("none")} aria-label="Funga">
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>
          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={
                  m.role === "user"
                    ? "ml-auto max-w-[85%] animate-in rounded-xl bg-primary px-3 py-2 text-primary-foreground fade-in slide-in-from-bottom-1"
                    : "max-w-[90%] animate-in whitespace-pre-wrap text-foreground/90 fade-in slide-in-from-bottom-1"
                }
              >
                {m.content}
              </div>
            ))}
            {pending ? (
              <div className="inline-flex items-center gap-2 text-muted-foreground">
                <span className="text-xs">{t("Anaandika", "Typing")}</span>
                <span className="flex items-end gap-1">
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:0ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
                </span>
              </div>
            ) : null}
          </div>

          <form
            className="flex items-center gap-2 border-t border-border/70 p-3"
            onSubmit={(e) => {
              e.preventDefault();
              void send();
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("Uliza swali...", "Ask a question...")}
              className="min-w-0 flex-1 rounded-xl bg-secondary px-3 py-2 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              className="rounded-xl bg-gold p-2 text-gold-foreground disabled:opacity-50"
              aria-label={t("Tuma", "Send")}
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>
      ) : null}

      {panel === "support" ? (
        <div className="glass w-[min(22rem,calc(100vw-2rem))] rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Headset className="size-4 text-primary" />
              <span className="font-display text-sm font-semibold">CUSTOMER SUPPORT</span>
            </div>
            <button type="button" onClick={() => setPanel("none")} aria-label="Funga">
              <X className="size-4 text-muted-foreground" />
            </button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {t(
              "Timu yetu inajibu maswali ya usajili, malipo na usalama.",
              "Our team answers questions about registration, payments and safety.",
            )}
          </p>
          <div className="mt-4 space-y-2">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm hover:bg-secondary"
            >
              <Mail className="size-4 text-gold" /> {SUPPORT_EMAIL}
            </a>
            <a
              href={WHATSAPP_CHANNEL}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-xl border border-border px-3 py-2.5 text-sm hover:bg-secondary"
            >
              <MessageCircle className="size-4 text-emerald-400" />{" "}
              {t("Channel ya WhatsApp", "WhatsApp channel")}
            </a>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setPanel(panel === "ai" ? "none" : "ai")}
          className="flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-primary px-4 py-3 text-sm font-semibold text-gold-foreground shadow-lg"
        >
          <Sparkle className="size-4" /> AFRICAN Assistance
        </button>
        <button
          type="button"
          onClick={() => setPanel(panel === "support" ? "none" : "support")}
          className="flex items-center gap-2 self-end rounded-full border border-border bg-card/90 px-4 py-2.5 text-xs font-semibold text-foreground shadow-lg backdrop-blur"
        >
          <Headset className="size-4 text-primary" /> CUSTOMER SUPPORT
        </button>
      </div>
    </div>
  );
}
