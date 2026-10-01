import { BadgeCheck, Quote } from "lucide-react";
import { useT } from "@/lib/i18n";

export function Testimonials() {
  const t = useT();

  return (
    <section className="border-y border-border/70 bg-navy/25">
      <div className="mx-auto w-full max-w-6xl px-4 py-14">
        <div className="flex items-center gap-2 text-gold">
          <Quote className="size-5" />
          <span className="text-xs font-semibold uppercase tracking-widest">
            {t("Hadithi za Jamii", "Community Stories")}
          </span>
        </div>
        <h2 className="mt-3 font-display text-2xl font-bold sm:text-3xl">
          {t("Uzoefu halisi, bila madai ya kubuni", "Real experiences, without invented claims")}
        </h2>
        <div className="mt-6 flex max-w-2xl items-start gap-3 rounded-xl border border-border bg-card/50 p-5">
          <BadgeCheck className="mt-0.5 size-5 shrink-0 text-primary" />
          <div>
            <h3 className="font-display font-semibold">
              {t("Shuhuda zilizothibitishwa zinakuja", "Verified stories are coming soon")}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {t(
                "Tutachapisha majina na uzoefu wa kifedha baada ya kupata ruhusa ya watu husika na kuthibitisha taarifa zao.",
                "Names and financial experiences will appear only after the people involved approve them and their information is verified.",
              )}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}