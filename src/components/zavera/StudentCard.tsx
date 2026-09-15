import { Link } from "@tanstack/react-router";
import { MessageSquare, Phone } from "lucide-react";
import { useT } from "@/lib/i18n";
import type { Student } from "@/lib/students";
import { cn } from "@/lib/utils";

const availabilityLabels: Record<string, [string, string]> = {
  online: ["Yuko mtandaoni", "Available now"],
  busy: ["Ana shughuli", "Busy"],
  offline: ["Hayupo", "Offline"],
};

export function StudentCard({ student, onVoice }: { student: Student; onVoice: () => void }) {
  const t = useT();
  const label = availabilityLabels[student.availability] ?? availabilityLabels["offline"]!;
  const initials = student.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2);

  return (
    <article className="glass flex flex-col gap-4 rounded-2xl p-5">
      <div className="flex items-start gap-3">
        {photo ? (
          <img
            src={photo}
            alt={`${student.name} — ${student.country}`}
            width={112}
            height={112}
            className="size-14 rounded-2xl object-cover"
            loading="lazy"
          />
        ) : (
          <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/30 to-gold/30 font-display text-lg font-bold">
            {initials}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-base font-semibold">{student.name}</h3>
          <p className="text-sm text-muted-foreground">
            {student.country_flag} {student.country}
          </p>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {student.languages.join(" · ")}
          </p>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-[11px] font-medium",
            student.is_online
              ? "bg-emerald-400/15 text-emerald-300"
              : "bg-muted text-muted-foreground",
          )}
        >
          <span
            className={cn(
              "size-1.5 rounded-full",
              student.is_online ? "bg-emerald-400" : "bg-muted-foreground",
            )}
          />
          {t(label[0], label[1])}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-1 text-xs text-foreground">
          {student.topic}
        </span>
        <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-xs text-gold">
          TZS {student.rate_tzs.toLocaleString("en-US")} / {t("saa", "hour")}
        </span>
      </div>

      {student.bio ? (
        <p className="line-clamp-2 text-sm text-muted-foreground">{student.bio}</p>
      ) : null}

      <div className="mt-auto grid grid-cols-2 gap-2">
        <Link
          to="/wanafunzi/$studentId"
          params={{ studentId: student.id }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <MessageSquare className="size-4" /> CHAT
        </Link>
        <button
          type="button"
          onClick={onVoice}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gold/40 px-3 py-2.5 text-sm font-semibold text-gold transition-colors hover:bg-gold/10"
        >
          <Phone className="size-4" /> VOICE
        </button>
      </div>
    </article>
  );
}
