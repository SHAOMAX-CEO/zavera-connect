import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, Lock, Phone, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { RegisterDialog } from "@/components/zavera/RegisterDialog";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { REGISTER_URL, useT } from "@/lib/i18n";
import { studentQueryOptions } from "@/lib/students";

export const Route = createFileRoute("/wanafunzi/$studentId")({
  head: () => ({
    meta: [
      { title: "Mazungumzo na Mwanafunzi — ZAVERA" },
      {
        name: "description",
        content:
          "Anza mazungumzo na mwanafunzi wa kimataifa. Muda wa utambulisho ni sekunde 30 kwa wageni.",
      },
      { property: "og:title", content: "Mazungumzo na Mwanafunzi — ZAVERA" },
      {
        property: "og:description",
        content: "Chat na sauti na wanafunzi wa kimataifa kwenye ZAVERA.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ChatPage,
});

type ChatRow = { id: string; sender: string; body: string; created_at: string };

const INTRO_SECONDS = 30;

function ChatPage() {
  const t = useT();
  const { studentId } = Route.useParams();
  const { user, isRegistered } = useAuth();
  const { data: student, isLoading, isError } = useQuery(studentQueryOptions(studentId));

  const [messages, setMessages] = useState<ChatRow[]>([]);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(INTRO_SECONDS);
  const [gate, setGate] = useState<"none" | "chat" | "voice">("none");
  const listRef = useRef<HTMLDivElement>(null);

  const locked = !isRegistered && secondsLeft <= 0;

  // Intro countdown for anyone who has not registered yet.
  useEffect(() => {
    if (isRegistered) return;
    const id = window.setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, [isRegistered]);

  useEffect(() => {
    if (!isRegistered && secondsLeft === 0) setGate("chat");
  }, [isRegistered, secondsLeft]);

  // Signed-in members get a persisted conversation with live message updates.
  useEffect(() => {
    if (!user) return;
    let active = true;

    const setup = async () => {
      const existing = await supabase
        .from("conversations")
        .select("id")
        .eq("user_id", user.id)
        .eq("student_id", studentId)
        .maybeSingle();

      let id = existing.data?.id ?? null;
      if (!id) {
        const created = await supabase
          .from("conversations")
          .insert({ user_id: user.id, student_id: studentId })
          .select("id")
          .single();
        id = created.data?.id ?? null;
      }
      if (!id || !active) return;
      setConversationId(id);

      const history = await supabase
        .from("messages")
        .select("id, sender, body, created_at")
        .eq("conversation_id", id)
        .order("created_at");
      if (active && history.data) setMessages(history.data as ChatRow[]);
    };

    void setup();
    return () => {
      active = false;
    };
  }, [user?.id, studentId]);

  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const row = payload.new as ChatRow;
          setMessages((prev) => (prev.some((m) => m.id === row.id) ? prev : [...prev, row]));
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [conversationId]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages.length]);

  const send = async () => {
    const body = input.trim();
    if (!body || locked) return;
    setInput("");

    if (user && conversationId) {
      const { data, error } = await supabase
        .from("messages")
        .insert({ conversation_id: conversationId, user_id: user.id, sender: "user", body })
        .select("id, sender, body, created_at")
        .single();
      if (!error && data) {
        setMessages((prev) =>
          prev.some((m) => m.id === data.id) ? prev : [...prev, data as ChatRow],
        );
        await supabase
          .from("conversations")
          .update({ last_message_at: new Date().toISOString() })
          .eq("id", conversationId);
        return;
      }
    }

    setMessages((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        sender: "user",
        body,
        created_at: new Date().toISOString(),
      },
    ]);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-muted-foreground">
        {t("Inapakia mazungumzo...", "Loading conversation...")}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-destructive">
        {t("Imeshindikana kupakia mwanafunzi.", "Could not load this student.")}
      </div>
    );
  }

  if (!student) throw notFound();

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6">
      <Link
        to="/wanafunzi"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" /> {t("Wanafunzi wote", "All students")}
      </Link>

      <div className="glass mt-4 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-gold/30 font-display font-bold">
            {student.name.slice(0, 2)}
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-lg font-semibold">{student.name}</h1>
            <p className="truncate text-sm text-muted-foreground">
              {student.country_flag} {student.country} · {student.topic}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {student.languages.join(" · ")}
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-xs text-gold">
            TZS {student.rate_tzs.toLocaleString("en-US")}/{t("saa", "hr")}
          </span>
          <button
            type="button"
            onClick={() => {
              if (!isRegistered) setGate("voice");
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-gold/40 px-3 py-2 text-sm font-semibold text-gold"
          >
            <Phone className="size-4" /> VOICE
          </button>
        </div>
      </div>

      {!isRegistered ? (
        <div className="mt-3 flex items-center justify-between rounded-xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-sm">
          <span className="inline-flex items-center gap-2 text-foreground">
            <Clock className="size-4 text-primary" />
            {t("Muda wa Utambulisho:", "Introduction time:")}{" "}
            <span className="font-display font-semibold">
              {mm}:{ss}
            </span>
          </span>
          {locked ? (
            <span className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Lock className="size-3.5" /> {t("Umefungwa", "Locked")}
            </span>
          ) : null}
        </div>
      ) : null}

      <div
        ref={listRef}
        className="glass mt-3 h-[24rem] space-y-3 overflow-y-auto rounded-2xl p-4 text-sm"
      >
        <p className="text-center text-xs text-muted-foreground">
          {t(
            `Anza kwa kujitambulisha kwa ${student.name} na kueleza unachoweza kushiriki.`,
            `Start by introducing yourself to ${student.name} and what you can share.`,
          )}
        </p>
        {messages.map((m) => (
          <div key={m.id} className="ml-auto max-w-[85%]">
            <div className="rounded-2xl bg-primary px-3 py-2 text-primary-foreground">{m.body}</div>
            <div className="mt-1 text-right text-[11px] text-muted-foreground">
              {new Date(m.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))}
        {messages.length > 0 ? (
          <p className="text-center text-xs text-muted-foreground">
            {student.is_online
              ? t(
                  `${student.name} yuko mtandaoni na atajibu hapa.`,
                  `${student.name} is online and will reply here.`,
                )
              : t(
                  `${student.name} hayupo mtandaoni sasa. Ujumbe wako umehifadhiwa.`,
                  `${student.name} is offline right now. Your message has been saved.`,
                )}
          </p>
        ) : null}
      </div>

      {locked ? (
        <div className="glass mt-3 rounded-2xl border-gold/30 p-5 text-center">
          <h2 className="font-display text-lg font-semibold">
            {t("Muda wa utambulisho umeisha", "Introduction time is over")}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t(
              "Fungua akaunti kwa $6 (~TZS 16,000) ili kuendelea kuzungumza na kutumia sauti. Usajili haumaanishi uhakika wa kipato.",
              "Create an account for $6 (~TZS 16,000) to keep chatting and use voice. Registration does not guarantee income.",
            )}
          </p>
          <a
            href={REGISTER_URL}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex rounded-xl bg-gold px-5 py-3 font-semibold text-gold-foreground"
          >
            {t("Unda Account", "Create account")}
          </a>
        </div>
      ) : (
        <form
          className="mt-3 flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void send();
          }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={t("Andika ujumbe...", "Write a message...")}
            className="min-w-0 flex-1 rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded-xl bg-primary p-3 text-primary-foreground disabled:opacity-50"
            aria-label={t("Tuma", "Send")}
          >
            <Send className="size-4" />
          </button>
        </form>
      )}

      <RegisterDialog
        open={gate !== "none"}
        onOpenChange={(open) => setGate(open ? gate : "none")}
        reason={gate === "voice" ? "voice" : "chat"}
      />
    </div>
  );
}
