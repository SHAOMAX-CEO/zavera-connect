import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { REGISTER_URL, useT } from "@/lib/i18n";

export function RegistrationTicker() {
  const t = useT();
  const words = t(
    "Shiriki maarifa yako kuhusu Afrika · Ongea na Dunia · Anza safari yako na ZAVERA",
    "Share your knowledge of Africa · Talk to the world · Begin your ZAVERA journey",
  );

  return (
    <div className="flex items-center gap-3 border-b border-gold/20 bg-secondary px-4 py-2">
      <Sparkles aria-hidden="true" className="size-4 shrink-0 text-gold" />
      <div className="registration-ticker min-w-0 flex-1 overflow-hidden text-sm text-foreground">
        <div className="registration-ticker-track flex w-max gap-12">
          <span>{words}</span>
          <span aria-hidden="true">{words}</span>
        </div>
      </div>
      <Button asChild size="sm" className="shrink-0 bg-gold text-gold-foreground hover:bg-gold/90">
        <a href={REGISTER_URL} target="_blank" rel="noopener noreferrer">
          {t("Jisajili", "Register")} <ArrowRight className="size-4" />
        </a>
      </Button>
    </div>
  );
}