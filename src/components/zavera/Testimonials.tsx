import { Globe2, MessageCircle, Quote } from "lucide-react";
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
          {t("Maoni ya wanachama na wanafunzi", "Member & student feedback")}
        </h2>
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="border-t border-border pt-5">
            <div className="flex items-center gap-2 text-gold">
              <MessageCircle className="size-5" />
              <h3 className="font-display font-semibold">
                {t("Uzoefu wa wanachama", "Member experiences")}
              </h3>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {t("Tunakaribisha maoni kutoka:", "Feedback welcome from:")}
            </p>
            <ul className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              <li>🇹🇿 Tanzania</li>
              <li>🇰🇪 Kenya</li>
              <li>🇧🇮 Burundi</li>
              <li>🇺🇬 Uganda</li>
              <li>🇲🇼 Malawi</li>
              <li>🇨🇩 {t("Kongo", "Congo")}</li>
            </ul>
            <p className="mt-4 text-sm text-muted-foreground">
              {t("Hakuna maoni yaliyothibitishwa ya kipato yaliyochapishwa bado.", "No verified earning feedback has been published yet.")}
            </p>
          </div>
          <div className="border-t border-border pt-5">
            <div className="flex items-center gap-2 text-primary">
              <Globe2 className="size-5" />
              <h3 className="font-display font-semibold">
                {t("Uzoefu wa wanafunzi wa kimataifa", "International student experiences")}
              </h3>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              {t("Maoni kuhusu kujifunza tamaduni, historia na lugha za Afrika kupitia mazungumzo.", "Feedback about learning African cultures, history and languages through conversation.")}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              {t("Maoni ya wanafunzi yaliyothibitishwa yanatarajiwa.", "Verified student feedback is coming soon.")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}