import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { REGISTER_URL, useT } from "@/lib/i18n";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Ingia au Jisajili — ZAVERA" },
      {
        name: "description",
        content: "Ingia kwenye akaunti yako ya ZAVERA kwa barua pepe au Google ili kuanza mazungumzo.",
      },
      { property: "og:title", content: "Ingia au Jisajili — ZAVERA" },
      { property: "og:description", content: "Ingia kwa barua pepe au Google kwenye ZAVERA." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const t = useT();
  const navigate = useNavigate();
  const { user, isRegistered } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        if (data.user && data.session) {
          await supabase
            .from("profiles")
            .upsert({ id: data.user.id, full_name: fullName || null });
          toast.success(t("Karibu ZAVERA!", "Welcome to ZAVERA!"));
          void navigate({ to: "/wanafunzi" });
        } else {
          toast.success(
            t(
              "Tuma imefanikiwa. Angalia barua pepe yako kuthibitisha akaunti.",
              "Sign-up successful. Check your email to confirm your account.",
            ),
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success(t("Umeingia.", "Signed in."));
        void navigate({ to: "/wanafunzi" });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("Hitilafu imetokea.", "Something went wrong."));
    } finally {
      setBusy(false);
    }
  };

  const google = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error(t("Kuingia kwa Google kumeshindikana.", "Google sign-in failed."));
      return;
    }
    if (result.redirected) return;
    void navigate({ to: "/wanafunzi" });
  };

  if (user) {
    return (
      <div className="mx-auto w-full max-w-md px-4 py-16">
        <div className="glass rounded-2xl p-6">
          <h1 className="font-display text-2xl font-bold">{t("Akaunti yako", "Your account")}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{user.email}</p>
          <p className="mt-4 text-sm">
            {isRegistered
              ? t("Usajili wako umekamilika.", "Your registration is complete.")
              : t(
                  "Usajili wa $6 (~TZS 16,000) haujakamilika. Kamilisha ili kufungua mazungumzo bila kikomo na sauti.",
                  "Your $6 (~TZS 16,000) registration is not complete. Finish it to unlock unlimited chat and voice.",
                )}
          </p>
          {!isRegistered ? (
            <a
              href={REGISTER_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex rounded-xl bg-gold px-5 py-3 font-semibold text-gold-foreground"
            >
              {t("Kamilisha Usajili", "Complete registration")}
            </a>
          ) : null}
          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              toast.success(t("Umetoka.", "Signed out."));
            }}
            className="mt-4 block w-full rounded-xl border border-border px-4 py-2.5 text-sm"
          >
            {t("Toka", "Sign out")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-16">
      <div className="glass rounded-2xl p-6">
        <h1 className="font-display text-2xl font-bold">
          {mode === "signin" ? t("Ingia", "Sign in") : t("Fungua Akaunti", "Create account")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t(
            "Ongea na Dunia. Shiriki Afrika. Pata Kipato.",
            "Talk to the world. Share Africa. Earn.",
          )}
        </p>

        <button
          type="button"
          onClick={() => void google()}
          className="mt-6 w-full rounded-xl border border-border px-4 py-3 text-sm font-semibold hover:bg-secondary"
        >
          {t("Endelea na Google", "Continue with Google")}
        </button>

        <div className="my-4 text-center text-xs text-muted-foreground">
          {t("au kwa barua pepe", "or with email")}
        </div>

        <form className="space-y-3" onSubmit={submit}>
          {mode === "signup" ? (
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t("Jina lako kamili", "Your full name")}
              className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none"
            />
          ) : null}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("Barua pepe", "Email")}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("Neno la siri", "Password")}
            className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-primary-foreground disabled:opacity-60"
          >
            {mode === "signin" ? t("Ingia", "Sign in") : t("Jisajili", "Sign up")}
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-4 w-full text-center text-sm text-gold"
        >
          {mode === "signin"
            ? t("Huna akaunti? Jisajili", "No account? Sign up")
            : t("Una akaunti? Ingia", "Have an account? Sign in")}
        </button>
      </div>
    </div>
  );
}
