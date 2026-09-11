import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { onlineCountQueryOptions } from "@/lib/students";
import { useT } from "@/lib/i18n";

export function OnlineIndicator() {
  const t = useT();
  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useQuery(onlineCountQueryOptions);

  useEffect(() => {
    const channel = supabase
      .channel("students-online")
      .on("postgres_changes", { event: "*", schema: "public", table: "students" }, () => {
        queryClient.invalidateQueries({ queryKey: ["students"] });
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs backdrop-blur">
      <span className="relative flex size-2">
        <span className="absolute inline-flex size-2 animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
      </span>
      <span className="text-muted-foreground">
        {isLoading
          ? t("Inapakia...", "Loading...")
          : isError
            ? t("Hali ya mtandao haipatikani", "Live status unavailable")
            : t(
                `${data} wanafunzi mtandaoni sasa`,
                `${data} student${data === 1 ? "" : "s"} online now`,
              )}
      </span>
    </div>
  );
}
