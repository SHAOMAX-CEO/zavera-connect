import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { OnlineIndicator } from "@/components/zavera/OnlineIndicator";
import { RegisterDialog } from "@/components/zavera/RegisterDialog";
import { StudentCard } from "@/components/zavera/StudentCard";
import { useAuth } from "@/hooks/useAuth";
import { useT } from "@/lib/i18n";
import { studentsQueryOptions } from "@/lib/students";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/wanafunzi/")({
  head: () => ({
    meta: [
      { title: "Wanafunzi wa Kimataifa — ZAVERA" },
      {
        name: "description",
        content:
          "Tafuta wanafunzi wa kimataifa kwa mada na nchi: historia ya Afrika, vyakula vya asili, falme za kale, muziki na lugha.",
      },
      { property: "og:title", content: "Wanafunzi wa Kimataifa — ZAVERA" },
      {
        property: "og:description",
        content: "Chagua mwanafunzi, anza mazungumzo ya maandishi au sauti kwenye ZAVERA.",
      },
    ],
  }),
  component: StudentsPage,
});

function StudentsPage() {
  const t = useT();
  const { isRegistered } = useAuth();
  const { data, isLoading, isError } = useQuery(studentsQueryOptions);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");
  const [country, setCountry] = useState("all");
  const [gateOpen, setGateOpen] = useState(false);

  const topics = useMemo(
    () => Array.from(new Set((data ?? []).map((s) => s.topic))).sort(),
    [data],
  );
  const countries = useMemo(
    () => Array.from(new Set((data ?? []).map((s) => s.country))).sort(),
    [data],
  );

  const filtered = (data ?? []).filter((s) => {
    const q = query.trim().toLowerCase();
    const matchesQuery =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.topic.toLowerCase().includes(q) ||
      s.country.toLowerCase().includes(q) ||
      s.languages.some((l) => l.toLowerCase().includes(q));
    return matchesQuery && (topic === "all" || s.topic === topic) && (country === "all" || s.country === country);
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10">
      <OnlineIndicator />
      <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
        {t("Wanafunzi wa Kimataifa", "International Students")}
      </h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        {t(
          "Chagua mwanafunzi anayelingana na maarifa yako, kisha anza mazungumzo.",
          "Choose a student who matches your knowledge, then start a conversation.",
        )}
      </p>

      <div className="mt-6 space-y-3">
        <label className="glass flex items-center gap-3 rounded-xl px-4 py-3">
          <Search className="size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("Tafuta jina, mada, nchi au lugha...", "Search name, topic, country or language...")}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
          {["all", ...topics].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setTopic(value)}
              className={cn(
                "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                topic === value
                  ? "border-primary bg-primary/15 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {value === "all" ? t("Mada zote", "All topics") : value}
            </button>
          ))}
        </div>

        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm sm:w-64"
        >
          <option value="all">{t("Nchi zote", "All countries")}</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8">
        {isLoading ? (
          <p className="text-muted-foreground">{t("Inapakia wanafunzi...", "Loading students...")}</p>
        ) : isError ? (
          <p className="text-destructive">
            {t(
              "Imeshindikana kupakia wanafunzi. Tafadhali jaribu tena.",
              "Could not load students. Please try again.",
            )}
          </p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground">
            {t("Hakuna mwanafunzi anayelingana na utafutaji wako.", "No student matches your search.")}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((s) => (
              <StudentCard
                key={s.id}
                student={s}
                onVoice={() => {
                  if (!isRegistered) setGateOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </div>

      <RegisterDialog open={gateOpen} onOpenChange={setGateOpen} reason="voice" />
    </div>
  );
}
