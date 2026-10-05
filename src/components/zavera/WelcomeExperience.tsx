import { ArrowRight, Volume2, VolumeX } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BrandMark } from "@/components/zavera/BrandMark";
import { playChime } from "@/lib/chime";

const WELCOME_KEY = "zavera-welcome-seen";

export function WelcomeExperience() {
  const [visible, setVisible] = useState(true);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem(WELCOME_KEY) === "yes") setVisible(false);
  }, []);

  const enter = (withSound: boolean) => {
    if (withSound) playChime();
    window.sessionStorage.setItem(WELCOME_KEY, "yes");
    setLeaving(true);
    window.setTimeout(() => setVisible(false), 650);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to ZAVERA"
      className={
        leaving
          ? "fixed inset-0 z-[100] flex animate-welcome-exit items-center justify-center overflow-hidden bg-background px-5 text-center"
          : "fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background px-5 text-center"
      }
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_34%),radial-gradient(circle_at_82%_80%,color-mix(in_oklab,var(--gold)_13%,transparent),transparent_32%)]" />
      <div className="absolute top-6 left-6 size-16 border-t border-l border-gold/30 sm:size-24" />
      <div className="absolute right-6 bottom-6 size-16 border-r border-b border-primary/30 sm:size-24" />

      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
        <div className="animate-welcome-logo">
          <BrandMark />
          <div className="mt-5 font-display text-4xl font-extrabold tracking-[0.18em] text-foreground sm:text-5xl">
            ZA<span className="text-gradient-zavera">VE</span>RA
          </div>
          <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-primary" />
        </div>

        <div className="mt-10 w-full sm:mt-12">
          <h1 className="welcome-writing mx-auto w-fit max-w-full font-display text-2xl font-bold text-foreground sm:text-4xl">
            Welcome! to ZAVERA you're lucky 🎉
          </h1>
          <p className="animate-welcome-copy mx-auto mt-7 max-w-2xl text-base leading-relaxed font-medium text-primary opacity-0 sm:text-xl">
            Fundisha wanafunzi wa kigeni unachojua kuhusu Africa na kuingiza kipato
          </p>
          <p className="animate-welcome-copy-late mx-auto mt-3 max-w-xl text-sm text-muted-foreground opacity-0 sm:text-base">
            Ongea na Dunia. Shiriki Afrika. Jenga mazungumzo yenye maana.
          </p>
        </div>

        <div className="animate-welcome-actions mt-10 flex flex-col items-center gap-3 opacity-0">
          <Button
            type="button"
            size="lg"
            onClick={() => enter(true)}
            className="min-w-56 border border-gold bg-gold font-bold text-gold-foreground shadow-[0_0_36px_color-mix(in_oklab,var(--gold)_22%,transparent)] hover:bg-gold/90"
          >
            <Volume2 className="size-4" /> Ingia ZAVERA <ArrowRight className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => enter(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <VolumeX className="size-4" /> Ingia bila sauti
          </Button>
        </div>
      </div>
    </div>
  );
}