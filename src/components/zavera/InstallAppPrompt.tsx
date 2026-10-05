import { Download, Share2, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useT } from "@/lib/i18n";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function isStandalone() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator &&
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone))
  );
}

export function InstallAppPrompt() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    setInstalled(isStandalone());

    const capturePrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const markInstalled = () => {
      setInstalled(true);
      setOpen(false);
      setInstallPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", capturePrompt);
    window.addEventListener("appinstalled", markInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", capturePrompt);
      window.removeEventListener("appinstalled", markInstalled);
    };
  }, []);

  const install = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    if (choice.outcome === "accepted") {
      setInstalled(true);
      setOpen(false);
    }
    setInstallPrompt(null);
  };

  if (installed) return null;

  return (
    <>
      <div className="border-b border-gold/25 bg-gold/10 px-3 py-2">
        <div className="mx-auto flex w-full max-w-6xl justify-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setOpen(true)}
            className="relative overflow-hidden border-gold/50 bg-background/80 font-semibold text-gold shadow-md hover:bg-gold/10"
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-0 -left-8 w-6 animate-[slide-in-right_2.8s_ease-in-out_infinite] bg-gold/20 blur-sm motion-reduce:hidden"
            />
            <Download className="size-4 animate-bounce motion-reduce:animate-none" />
            {t("Sakinisha ZAVERA App", "Install ZAVERA App")}
          </Button>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="glass w-[calc(100vw-2rem)] max-w-md border-gold/30">
          <DialogHeader>
            <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-gold/15 text-gold sm:mx-0">
              <Smartphone className="size-6" />
            </span>
            <DialogTitle className="font-display text-xl">
              {t("Kuwa na ZAVERA kama app", "Have ZAVERA as an app")}
            </DialogTitle>
            <DialogDescription>
              {t(
                "Sakinisha ZAVERA kwenye skrini ya simu yako ili uifungue haraka kama app. Mazungumzo, wanafunzi na akaunti yako vitabaki vilevile.",
                "Add ZAVERA to your phone's home screen and open it quickly like an app. Your chats, students and account stay the same.",
              )}
            </DialogDescription>
          </DialogHeader>

          {installPrompt ? (
            <Button type="button" onClick={() => void install()} className="w-full bg-gold text-gold-foreground hover:bg-gold/90">
              <Download className="size-4" />
              {t("Sakinisha sasa", "Install now")}
            </Button>
          ) : (
            <div className="space-y-3 rounded-lg border border-border bg-secondary/45 p-4 text-sm">
              <p className="flex items-start gap-2 text-foreground">
                <Share2 className="mt-0.5 size-4 shrink-0 text-primary" />
                {t(
                  "iPhone: bonyeza alama ya Share kwenye browser, kisha chagua “Add to Home Screen”.",
                  "iPhone: tap the browser's Share icon, then choose “Add to Home Screen”.",
                )}
              </p>
              <p className="flex items-start gap-2 text-foreground">
                <Download className="mt-0.5 size-4 shrink-0 text-gold" />
                {t(
                  "Android: fungua menyu ya browser, kisha chagua “Install app” au “Add to Home screen”.",
                  "Android: open the browser menu, then choose “Install app” or “Add to Home screen”.",
                )}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}