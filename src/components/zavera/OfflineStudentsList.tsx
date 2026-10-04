import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, BellRing } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useT } from "@/lib/i18n";
import { studentPhoto } from "@/lib/student-photos";
import { studentsQueryOptions } from "@/lib/students";

export function OfflineStudentsList() {
  const t = useT();
  const { user } = useAuth();
  const qc = useQueryClient();
  const { data: students = [] } = useQuery(studentsQueryOptions);
  const offline = students.filter((s) => !s.is_online).slice(0, 6);

  const { data: subscribed = [] } = useQuery({
    queryKey: ["notify-requests", user?.id],
    enabled: Boolean(user),
    queryFn: async () => {
      const { data, error } = await supabase.from("student_notify_requests").select("student_id");
      if (error) throw error;
      return (data ?? []).map((r) => r.student_id);
    },
  });

  async function toggle(studentId: string) {
    if (!user) {
      toast(t("Ingia kwanza ili tukujulishe.", "Sign in first so we can notify you."));
      return;
    }
    const on = subscribed.includes(studentId);
    const { error } = on
      ? await supabase.from("student_notify_requests").delete().eq("student_id", studentId)
      : await supabase.from("student_notify_requests").insert({ user_id: user.id, student_id: studentId });
    if (error) {
      toast.error(t("Imeshindikana, jaribu tena.", "Could not save, please try again."));
      return;
    }
    toast.success(
      on
        ? t("Arifa imeondolewa.", "Notification removed.")
        : t("Tutakujulisha akiwa mtandaoni.", "We'll notify you when they're online."),
    );
    void qc.invalidateQueries({ queryKey: ["notify-requests"] });
  }

  if (!offline.length) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {t("Hawapo mtandaoni kwa sasa", "Recently offline")}
      </p>
      <ul className="max-h-56 space-y-2 overflow-y-auto pr-1">
        {offline.map((s) => {
          const photo = studentPhoto(s);
          const on = subscribed.includes(s.id);
          return (
            <li key={s.id} className="flex items-center gap-3 rounded-xl border border-border bg-card/50 p-2">
              {photo ? (
                <img src={photo} alt={s.name} className="size-9 rounded-lg object-cover" loading="lazy" />
              ) : (
                <div className="size-9 rounded-lg bg-muted" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{s.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {s.country_flag} {s.topic}
                </p>
              </div>
              <button
                type="button"
                onClick={() => void toggle(s.id)}
                className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-primary/40 px-2 py-1.5 text-[11px] font-semibold text-primary hover:bg-primary/10"
              >
                {on ? <BellRing className="size-3.5" /> : <Bell className="size-3.5" />}
                {on ? t("Umejiandikisha", "Notifying") : t("Nijulishe", "Notify me")}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
