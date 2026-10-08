import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { CircleDollarSign, MessageCircle, Wifi } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { playChime } from "@/lib/chime";
import { useT } from "@/lib/i18n";
import { studentsQueryOptions } from "@/lib/students";
import { PAYMENT_POPUP_INTERVAL_MS, paymentPopupFrame } from "@/lib/payment-popup";

type VerifiedPayment = {
  id: string;
  name: string;
  amount: string;
};

export function ActivityFeed() {
  const t = useT();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: students = [] } = useQuery(studentsQueryOptions);
  const [studentIndex, setStudentIndex] = useState(0);
  const [paymentStep, setPaymentStep] = useState(0);

  const onlineStudents = useMemo(() => students.filter((student) => student.is_online), [students]);

  const { data: verifiedPayments = [] } = useQuery({
    queryKey: ["verified-payments", user?.id],
    enabled: Boolean(user),
    refetchInterval: 30000,
    queryFn: async (): Promise<VerifiedPayment[]> => {
      if (!user) return [];
      const [{ data: payments, error: paymentsError }, { data: profile, error: profileError }] =
        await Promise.all([
          supabase
            .from("payments")
            .select("id, amount_tzs, amount_usd, status")
            .eq("user_id", user.id)
            .in("status", ["paid", "completed", "confirmed", "successful", "success"])
            .order("created_at", { ascending: false })
            .limit(5),
          supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
        ]);

      if (paymentsError) throw paymentsError;
      if (profileError) throw profileError;

      const name = profile?.full_name?.trim() || t("Mwanachama wa ZAVERA", "ZAVERA member");
      return (payments ?? []).map((payment) => ({
        id: payment.id,
        name,
        amount:
          payment.amount_tzs != null
            ? `TZS ${payment.amount_tzs.toLocaleString()}`
            : `$${Number(payment.amount_usd ?? 0).toLocaleString()}`,
      }));
    },
  });

  const { visible: showPayment, index: paymentIndex } = paymentPopupFrame(paymentStep, verifiedPayments.length);

  // Real arrivals: students whose status switched to online since the last data refresh.
  const seenOnline = useRef<Set<string> | null>(null);
  useEffect(() => {
    if (!students.length) return;
    const ids = new Set(onlineStudents.map((s) => s.id));
    const prev = seenOnline.current;
    seenOnline.current = ids;
    if (!prev) return;
    const arrivals = onlineStudents.filter((s) => !prev.has(s.id));
    if (!arrivals.length) return;
    playChime();
    arrivals.slice(0, 2).forEach((s) =>
      toast(`${s.country_flag} ${s.name} ${t("ameingia mtandaoni", "just came online")}`, {
        description: s.topic,
        action: {
          label: t("Ongea", "Chat"),
          onClick: () => void navigate({ to: "/wanafunzi/$studentId", params: { studentId: s.id } }),
        },
      }),
    );
  }, [onlineStudents, students.length, t, navigate]);

  useEffect(() => {
    if (showPayment) playChime();
  }, [showPayment]);

  useEffect(() => {
    if (onlineStudents.length < 2) return;
    const timer = window.setInterval(
      () => setStudentIndex((current) => (current + 1) % onlineStudents.length),
      5000,
    );
    return () => window.clearInterval(timer);
  }, [onlineStudents.length]);

  useEffect(() => {
    setPaymentStep(0);
    if (!verifiedPayments.length) return;
    const timer = window.setInterval(
      () => setPaymentStep((current) => current + 1),
      PAYMENT_POPUP_INTERVAL_MS,
    );
    return () => window.clearInterval(timer);
  }, [user?.id, verifiedPayments.length]);

  const currentStudent = onlineStudents[studentIndex % Math.max(onlineStudents.length, 1)];
  const currentPayment = verifiedPayments[paymentIndex % Math.max(verifiedPayments.length, 1)];

  return (
    <>
      <div className="border-b border-border/70 bg-secondary/35">
        <div className="mx-auto flex h-9 w-full max-w-6xl items-center overflow-hidden px-4 text-xs">
          <div className="flex shrink-0 items-center gap-1.5 font-semibold text-gold">
            <Wifi className="size-3.5" /> {t("LIVE", "LIVE")}
          </div>
          <div className="mx-3 h-4 w-px shrink-0 bg-border" />
          {currentStudent ? (
            <Link
              key={currentStudent.id}
              to="/wanafunzi/$studentId"
              params={{ studentId: currentStudent.id }}
              className="animate-fade-in flex min-w-0 items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <span className="size-1.5 shrink-0 rounded-full bg-emerald-400" />
              <span className="truncate">
                {currentStudent.name} · {currentStudent.country} · {currentStudent.topic}
              </span>
              <span className="hidden shrink-0 items-center gap-1 font-semibold text-primary sm:inline-flex">
                <MessageCircle className="size-3" /> {t("Ongea sasa", "Chat now")}
              </span>
            </Link>
          ) : (
            <span className="truncate text-muted-foreground">
              {t("Inatafuta wanafunzi walio mtandaoni...", "Checking who is online...")}
            </span>
          )}
        </div>
      </div>

      {showPayment && currentPayment ? (
        <div
          role="status"
          className="glass animate-slide-in-right pointer-events-none fixed right-4 top-4 z-40 flex w-80 max-w-[calc(100vw-2rem)] items-center gap-3 rounded-lg p-3 shadow-lg motion-reduce:animate-none"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gold/15 text-gold">
            <CircleDollarSign className="size-5" />
          </span>
          <div className="min-w-0 text-sm">
            <p className="truncate font-semibold text-foreground">{currentPayment.name}</p>
            <p className="text-xs text-muted-foreground">
              {t("Malipo yamethibitishwa", "Payment confirmed")} · {currentPayment.amount}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}