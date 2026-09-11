import { Link } from "@tanstack/react-router";
import { Mail, MessageCircle } from "lucide-react";
import { SUPPORT_EMAIL, WHATSAPP_CHANNEL, useT } from "@/lib/i18n";

export function Footer() {
  const t = useT();

  return (
    <footer className="mt-20 border-t border-border/70 bg-navy/40">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <div className="font-display text-lg font-bold tracking-[0.18em]">ZAVERA</div>
          <p className="mt-1 text-sm text-gold">Ongea na Dunia. Shiriki Afrika. Pata Kipato.</p>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            {t(
              "Tunaunganisha watu wa Afrika na wanafunzi wa kimataifa wanaotaka kujifunza utamaduni, historia na lugha za Afrika kutoka kwa watu wanaozifahamu vizuri.",
              "We connect people in Africa with international students who want to learn African culture, history and languages from the people who know them best.",
            )}
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            {t("Viungo", "Quick links")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/wanafunzi" className="text-foreground/80 hover:text-gold">
                {t("Tazama Wanafunzi", "Browse students")}
              </Link>
            </li>
            <li>
              <Link to="/jinsi-inavyofanya-kazi" className="text-foreground/80 hover:text-gold">
                {t("Jinsi Inavyofanya Kazi", "How it works")}
              </Link>
            </li>
            <li>
              <Link to="/mapato" className="text-foreground/80 hover:text-gold">
                {t("Mapato", "Earnings")}
              </Link>
            </li>
            <li>
              <Link to="/usalama" className="text-foreground/80 hover:text-gold">
                {t("Usalama na Uwazi", "Trust & safety")}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            {t("Msaada", "Support")}
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex items-center gap-2 text-foreground/80 hover:text-gold"
              >
                <Mail className="size-4" /> {SUPPORT_EMAIL}
              </a>
            </li>
            <li>
              <a
                href={WHATSAPP_CHANNEL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-foreground/80 hover:text-gold"
              >
                <MessageCircle className="size-4" /> {t("Channel ya WhatsApp", "WhatsApp channel")}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/70 px-4 py-5 text-center text-xs text-muted-foreground">
        © 2026 ZAVERA.{" "}
        {t(
          "Hakuna uhakika wa kipato. Malipo yanategemea muda wako na mahitaji ya wanafunzi.",
          "No income is guaranteed. Payments depend on your availability and student demand.",
        )}
      </div>
    </footer>
  );
}
