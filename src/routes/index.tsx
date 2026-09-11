import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Globe2, Sparkle } from "lucide-react";
import heroImage from "@/assets/zavera-hero.jpg";
import { OnlineIndicator } from "@/components/zavera/OnlineIndicator";
import { EarningsSection, HowItWorksSection, TrustSection } from "@/components/zavera/Sections";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ZAVERA — Shiriki Maarifa Yako Kuhusu Afrika. Ongea na Dunia." },
      {
        name: "description",
        content:
          "Wanafunzi wa kimataifa wanataka kujifunza Afrika kutoka kwa watu wanaoifahamu vizuri. Anza mazungumzo kwenye ZAVERA.",
      },
      {
        property: "og:title",
        content: "ZAVERA — Shiriki Maarifa Yako Kuhusu Afrika. Ongea na Dunia.",
      },
      {
        property: "og:description",
        content:
          "Ungana na wanafunzi wa kimataifa wanaotaka kujifunza utamaduni, historia, vyakula na lugha za Afrika.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const t = useT();

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 -right-24 size-[28rem] rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute top-40 -left-32 size-[24rem] rounded-full bg-gold/10 blur-3xl" />

        <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-4 pt-12 pb-8 lg:grid-cols-2 lg:pt-20">
          <div>
            <OnlineIndicator />
            <h1 className="mt-5 font-display text-4xl leading-[1.05] font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Shiriki Maarifa Yako Kuhusu Afrika.{" "}
              <span className="text-gradient-zavera">Ongea na Dunia.</span>
            </h1>
            <p className="mt-4 text-base text-gold sm:text-lg">
              Ongea na Dunia. Shiriki Afrika. Pata Kipato.
            </p>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Wanafunzi wa kimataifa wanataka kujifunza Afrika kutoka kwa watu wanaoifahamu vizuri —
              historia, mila, vyakula, falme za kale, muziki na lugha.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/wanafunzi"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                {t("Tazama Wanafunzi", "Browse Students")} <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/jinsi-inavyofanya-kazi"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold/40 px-6 py-3.5 font-semibold text-gold transition-colors hover:bg-gold/10"
              >
                {t("Jinsi Inavyofanya Kazi", "How It Works")}
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Globe2 className="size-4 text-primary" />
                {t("Wanafunzi kutoka mabara yote", "Students from every continent")}
              </span>
              <span className="inline-flex items-center gap-2">
                <Sparkle className="size-4 text-gold" />
                {t("Mazungumzo ya maandishi na sauti", "Text and voice conversations")}
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="glass overflow-hidden rounded-3xl p-2">
              <img
                src={heroImage}
                alt={t(
                  "Mwanamke wa Kiafrika akizungumza na mwanafunzi wa kimataifa kwa simu",
                  "An African woman talking with an international student on her phone",
                )}
                width={1280}
                height={1280}
                className="h-full w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <EarningsSection />
      <HowItWorksSection />
      <TrustSection />
    </>
  );
}
