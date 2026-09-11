import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useLang, useT } from "@/lib/i18n";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

export function Header() {
  const t = useT();
  const { lang, setLang } = useLang();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/wanafunzi", label: t("Wanafunzi", "Students") },
    { to: "/jinsi-inavyofanya-kazi", label: t("Jinsi Inavyofanya Kazi", "How It Works") },
    { to: "/mapato", label: t("Mapato", "Earnings") },
    { to: "/usalama", label: t("Usalama", "Trust & Safety") },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-gold to-primary font-display text-base font-bold text-gold-foreground">
            Z
          </span>
          <span className="font-display text-lg font-bold tracking-[0.18em] text-foreground">
            ZAVERA
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex overflow-hidden rounded-lg border border-border text-xs">
            {(["sw", "en"] as const).map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                className={cn(
                  "px-2.5 py-1.5 font-semibold uppercase transition-colors",
                  lang === code
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {code}
              </button>
            ))}
          </div>
          <Link
            to="/auth"
            className="hidden rounded-lg bg-gold px-3 py-2 text-sm font-semibold text-gold-foreground transition-opacity hover:opacity-90 sm:block"
          >
            {user ? t("Akaunti", "Account") : t("Ingia", "Sign in")}
          </Link>
          <button
            type="button"
            aria-label={t("Menyu", "Menu")}
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg border border-border p-2 text-foreground md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav className="flex flex-col gap-1 border-t border-border/70 px-4 py-3 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "text-foreground bg-secondary" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/auth"
            onClick={() => setOpen(false)}
            className="mt-1 rounded-lg bg-gold px-3 py-2.5 text-center text-sm font-semibold text-gold-foreground"
          >
            {user ? t("Akaunti", "Account") : t("Ingia", "Sign in")}
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
