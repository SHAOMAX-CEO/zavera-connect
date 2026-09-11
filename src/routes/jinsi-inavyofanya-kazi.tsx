import { createFileRoute } from "@tanstack/react-router";
import { HowItWorksSection, TrustSection } from "@/components/zavera/Sections";

export const Route = createFileRoute("/jinsi-inavyofanya-kazi")({
  head: () => ({
    meta: [
      { title: "Jinsi ZAVERA Inavyofanya Kazi — Hatua 4" },
      {
        name: "description",
        content:
          "Unda account, chagua mwanafunzi, anza mazungumzo, kamilisha huduma. Hatua nne za kufanya kazi kwenye ZAVERA.",
      },
      { property: "og:title", content: "Jinsi ZAVERA Inavyofanya Kazi — Hatua 4" },
      {
        property: "og:description",
        content: "Hatua nne rahisi: Unda Account, Chagua Mwanafunzi, Anza Mazungumzo, Kamilisha Huduma.",
      },
    ],
  }),
  component: () => (
    <div className="py-6">
      <HowItWorksSection />
      <TrustSection />
    </div>
  ),
});
