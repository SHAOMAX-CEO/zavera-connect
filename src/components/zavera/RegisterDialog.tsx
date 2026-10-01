import { ExternalLink, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { REGISTER_URL, useT } from "@/lib/i18n";

export type RegisterReason = "chat" | "voice" | "offline" | "reward";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reason: RegisterReason;
};

export function RegisterDialog({ open, onOpenChange, reason }: Props) {
  const t = useT();

  const title =
    reason === "voice"
      ? t("Sauti ni kwa wanachama", "Voice is for members")
      : reason === "offline"
        ? t(
            "Mtu huyu hayupo mtandaoni kwa sasa, tafadhali chagua mtu mwingine.",
            "This person is currently offline, please choose another person.",
          )
        : reason === "reward"
          ? t("Mazungumzo mazuri! 🎉", "Great conversation! 🎉")
          : t("Muda wa utambulisho umeisha", "Introduction time is over");

  const description =
    reason === "voice"
      ? t(
          "Kipengele cha VOICE kinapatikana kwa watu waliokamilisha usajili wa akaunti.",
          "The VOICE feature is available to people who have completed account registration.",
        )
      : reason === "offline"
        ? t(
            "Fungua akaunti ili kuhifadhi taarifa zako na kupata taarifa/kuendelea wanafunzi wa kigeni wanapopatikana.",
            "Create an account to save your information and be notified/continue when foreign students become available.",
          )
        : reason === "reward"
          ? t(
              "Mwanafunzi wa kigeni alifurahia mazungumzo yako. Fungua akaunti yako ili kupokea zawadi/malipo yako.",
              "The foreign student enjoyed your conversation. Open your account to receive your reward/payment.",
            )
          : t(
              "Ili kuendelea kuzungumza na mwanafunzi huyu, unahitaji akaunti ya ZAVERA.",
              "To keep talking with this student you need a ZAVERA account.",
            );

  const cta =
    reason === "reward"
      ? t("Fungua Akaunti", "Open Account")
      : reason === "offline"
        ? t("Fungua Akaunti", "Create Account")
        : t("Fungua Akaunti", "Create account");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-w-md border-gold/30">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {reason === "reward" ? null : (
          <div className="rounded-xl border border-gold/30 bg-gold/10 p-4">
            <div className="font-display text-2xl font-bold text-gold">$6</div>
            <p className="text-sm text-muted-foreground">
              {t("~TZS 16,000 — gharama ya usajili wa akaunti", "~TZS 16,000 — account registration fee")}
            </p>
          </div>
        )}

        {reason === "reward" ? null : (
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>{t("Mazungumzo bila kikomo cha muda", "Chat without the time limit")}</li>
            <li>{t("Ufikiaji wa kipengele cha sauti", "Access to the voice feature")}</li>
            <li>{t("Wasifu wako unaonekana kwa wanafunzi", "Your profile is visible to students")}</li>
          </ul>
        )}

        <a
          href={REGISTER_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gold px-4 py-3 font-semibold text-gold-foreground transition-opacity hover:opacity-90"
        >
          {cta} <ExternalLink className="size-4" />
        </a>

        <p className="flex items-start gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
          {reason === "reward"
            ? t(
                "Hii ni taarifa ya kustahili zawadi. Malipo hufanyika baada ya uthibitisho wa akaunti yako; hakuna uhakika wa kipato.",
                "This is a reward eligibility notice. Payment happens after your account is verified; no income is guaranteed.",
              )
            : t(
                "Usajili haumaanishi uhakika wa kipato. Malipo yanategemea muda wako, ujuzi na mahitaji ya wanafunzi.",
                "Registration does not guarantee any income. Payments depend on your availability, skills and student demand.",
              )}
        </p>
      </DialogContent>
    </Dialog>
  );
}
