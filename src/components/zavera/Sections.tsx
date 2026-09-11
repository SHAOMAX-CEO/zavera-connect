import { Link } from "@tanstack/react-router";
import {
  BadgeCheck,
  Coins,
  Eye,
  Lock,
  MessagesSquare,
  ShieldAlert,
  UserPlus,
  Users,
} from "lucide-react";
import { REGISTER_URL, useT } from "@/lib/i18n";

export function EarningsSection() {
  const t = useT();

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16">
      <h2 className="font-display text-3xl font-bold sm:text-4xl">
        {t("Mapato kwa Uwazi", "Earnings, transparently")}
      </h2>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        {t(
          "Unalipwa kwa muda unaotumia kuzungumza na wanafunzi. Kiwango kinatofautiana kwa mwanafunzi, mada na muda uliopo.",
          "You are paid for the time you spend talking with students. Rates differ by student, topic and your availability.",
        )}
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="glass rounded-2xl p-5">
          <Coins className="size-5 text-gold" />
          <div className="mt-3 font-display text-2xl font-bold text-gold">TZS 50,000 – 150,000</div>
          <p className="mt-1 text-sm text-muted-foreground">
            {t(
              "Mfano wa viwango vinavyoonekana kwenye majukumu ya mazungumzo. Huu ni mfano, si ahadi.",
              "Example rate range shown on conversation tasks. This is an example, not a promise.",
            )}
          </p>
        </div>
        <div className="glass rounded-2xl p-5">
          <BadgeCheck className="size-5 text-primary" />
          <h3 className="mt-3 font-display font-semibold">
            {t("Usajili wa akaunti", "Account registration")}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t(
              "$6 (~TZS 16,000) hulipwa mara moja kufungua akaunti na kufungua mazungumzo na sauti.",
              "$6 (~TZS 16,000) is a one-time fee to open an account and unlock chat and voice.",
            )}
          </p>
        </div>
        <div className="glass rounded-2xl p-5">
          <Eye className="size-5 text-primary" />
          <h3 className="mt-3 font-display font-semibold">
            {t("Unajua kabla ya kuanza", "You know before you start")}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {t(
              "Kila mwanafunzi anaonyesha kiwango chake kwenye kadi yake kabla uanze mazungumzo.",
              "Every student shows their rate on their card before you start a conversation.",
            )}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/10 p-4">
        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-destructive" />
        <p className="text-sm text-foreground/90">
          <strong className="font-semibold">{t("Kanusho: ", "Disclaimer: ")}</strong>
          {t(
            "ZAVERA HAITOI uhakika wa kipato chochote. Hakuna kiasi cha pesa kinachohakikishwa, na viwango vilivyoonyeshwa ni mifano tu. Mapato yako yanategemea muda wako, ujuzi wako na mahitaji ya wanafunzi.",
            "ZAVERA does NOT guarantee any income. No amount of money is guaranteed and the figures shown are examples only. Your earnings depend on your availability, your skills and student demand.",
          )}
        </p>
      </div>
    </section>
  );
}

export function HowItWorksSection() {
  const t = useT();

  const steps = [
    {
      icon: UserPlus,
      title: t("1. Unda Account", "1. Create an account"),
      body: t(
        "Jisajili kwa $6 (~TZS 16,000) ili kufungua mazungumzo yasiyo na kikomo na kipengele cha sauti.",
        "Register for $6 (~TZS 16,000) to unlock unlimited chat and the voice feature.",
      ),
    },
    {
      icon: Users,
      title: t("2. Chagua Mwanafunzi", "2. Choose a student"),
      body: t(
        "Tafuta kwa mada au nchi, kisha chagua mwanafunzi anayelingana na maarifa yako.",
        "Search by topic or country, then pick a student who matches your knowledge.",
      ),
    },
    {
      icon: MessagesSquare,
      title: t("3. Anza Mazungumzo", "3. Start the conversation"),
      body: t(
        "Anza kwa mazungumzo ya maandishi au sauti. Shiriki historia, mila, vyakula na lugha.",
        "Start with text or voice. Share history, traditions, food and language.",
      ),
    },
    {
      icon: BadgeCheck,
      title: t("4. Kamilisha Huduma", "4. Complete the service"),
      body: t(
        "Kamilisha kipindi, mwanafunzi athibitishe, na malipo yako yaandikishwe kwenye akaunti yako.",
        "Finish the session, the student confirms it, and your payment is recorded on your account.",
      ),
    },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16">
      <h2 className="font-display text-3xl font-bold sm:text-4xl">
        {t("Jinsi Inavyofanya Kazi", "How It Works")}
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {steps.map((s) => (
          <div key={s.title} className="glass rounded-2xl p-5">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
              <s.icon className="size-5" />
            </span>
            <h3 className="mt-4 font-display font-semibold">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
          </div>
        ))}
      </div>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          to="/wanafunzi"
          className="rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground"
        >
          {t("Tazama Wanafunzi", "Browse students")}
        </Link>
        <a
          href={REGISTER_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-gold/40 px-5 py-3 font-semibold text-gold"
        >
          {t("Unda Account", "Create account")}
        </a>
      </div>
    </section>
  );
}

export function TrustSection() {
  const t = useT();

  const items = [
    {
      icon: Lock,
      title: t("Faragha yako", "Your privacy"),
      body: t(
        "Mazungumzo yako yanaonekana kwako tu. Hatushiriki namba yako ya simu wala barua pepe yako na wanafunzi.",
        "Your conversations are visible only to you. We never share your phone number or email with students.",
      ),
    },
    {
      icon: ShieldAlert,
      title: t("Usalama wa akaunti", "Account security"),
      body: t(
        "Kila akaunti inalindwa na kuingia kwa barua pepe au Google, na data yako inalindwa na sheria kali za ufikiaji.",
        "Every account is protected by email or Google sign-in, and your data is protected by strict access rules.",
      ),
    },
    {
      icon: Coins,
      title: t("Malipo kwa uwazi", "Transparent payments"),
      body: t(
        "Viwango vinaonyeshwa kabla ya mazungumzo. Ada ya usajili ni $6 (~TZS 16,000) na inaonyeshwa wazi.",
        "Rates are shown before a conversation. The registration fee is $6 (~TZS 16,000) and is stated openly.",
      ),
    },
    {
      icon: Eye,
      title: t("Hakuna ahadi za uongo", "No false promises"),
      body: t(
        "Hatutoi ahadi za kipato, hatutumii idadi za kubuni, na takwimu za mtandaoni zinatoka kwenye database yetu halisi.",
        "We make no income promises, we use no invented numbers, and the online counts come from our real database.",
      ),
    },
  ];

  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16">
      <h2 className="font-display text-3xl font-bold sm:text-4xl">
        {t("Usalama na Uwazi", "Trust & Safety")}
      </h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {items.map((i) => (
          <div key={i.title} className="glass rounded-2xl p-5">
            <i.icon className="size-5 text-gold" />
            <h3 className="mt-3 font-display font-semibold">{i.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{i.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
