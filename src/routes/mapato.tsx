import { createFileRoute } from "@tanstack/react-router";
import { EarningsSection } from "@/components/zavera/Sections";

export const Route = createFileRoute("/mapato")({
  head: () => ({
    meta: [
      { title: "Mapato na Uwazi — ZAVERA" },
      {
        name: "description",
        content:
          "Maelezo ya wazi kuhusu malipo ya mazungumzo, ada ya usajili ya $6 (~TZS 16,000), na kanusho kwamba hakuna uhakika wa kipato.",
      },
      { property: "og:title", content: "Mapato na Uwazi — ZAVERA" },
      {
        property: "og:description",
        content: "Viwango vya mfano, ada ya usajili, na kanusho la wazi kuhusu mapato.",
      },
    ],
  }),
  component: () => (
    <div className="py-6">
      <EarningsSection />
    </div>
  ),
});
