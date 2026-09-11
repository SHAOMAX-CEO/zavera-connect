import { createFileRoute } from "@tanstack/react-router";
import { TrustSection } from "@/components/zavera/Sections";

export const Route = createFileRoute("/usalama")({
  head: () => ({
    meta: [
      { title: "Usalama na Uwazi — ZAVERA" },
      {
        name: "description",
        content:
          "Faragha ya mazungumzo, usalama wa akaunti, malipo ya wazi na sera yetu ya kutokutoa ahadi za kipato.",
      },
      { property: "og:title", content: "Usalama na Uwazi — ZAVERA" },
      {
        property: "og:description",
        content: "Faragha, usalama wa akaunti, malipo ya wazi na hakuna ahadi za uongo.",
      },
    ],
  }),
  component: () => (
    <div className="py-6">
      <TrustSection />
    </div>
  ),
});
