import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setSession(data.session ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next ?? null);
      setLoading(false);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session?.user) {
      setIsRegistered(false);
      return;
    }
    let active = true;
    supabase
      .from("profiles")
      .select("is_registered")
      .eq("id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        if (active) setIsRegistered(Boolean(data?.is_registered));
      });
    return () => {
      active = false;
    };
  }, [session?.user?.id]);

  return { session, user: session?.user ?? null, loading, isRegistered };
}
