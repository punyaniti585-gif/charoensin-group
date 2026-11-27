import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroStage from "@/components/home/HeroStage";
import ManifestoSection from "@/components/home/ManifestoSection";
import GlobalSection from "@/components/home/GlobalSection";
import PhilosophySection from "@/components/home/PhilosophySection";
import VenturesShowcase from "@/components/home/VenturesShowcase";
import NewsSection from "@/components/home/NewsSection";
import SmoothScrollProvider from "@/components/home/SmoothScrollProvider";
import StickySection from "@/components/home/StickySection";

/**
 * Framed section shell (V.3 proportions): every section after the Hero sits in its own
 * rounded 28px card inset 8/12px from the viewport and 12px apart, so each chapter reads as a distinct,
 * layered card. Sections set their own background (white / ivory / navy).
 */
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full overflow-clip rounded-[1.75rem] border border-[#a28757]/20">
      {children}
    </div>
  );
}

/**
 * Home page
 *   Hero (full-bleed 2-act stage) → framed sections: Manifesto (ivory) →
 *   Global (white) → Philosophy (ivory) → Ventures (navy) → News (white) → Footer.
 *
 * Only one sticky overlap: News (the last section) pins and the dark Footer
 * slides over it. <main> is `display: contents` so News and the Footer share one
 * containing block; the News wrapper is flow-root so its frame margins stay inside it.
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F0E8] text-[#14171F] selection:bg-[#a28757]/20 selection:text-[#6B5A3A]">
      <SmoothScrollProvider />
      <Navbar />

      <main className="contents">
        <HeroStage />

        <div className="relative z-10 flex flex-col gap-2 sm:gap-3 bg-[#F4F0E8] p-2 sm:p-3">
          <Frame>
            <ManifestoSection />
          </Frame>
          <Frame>
            <GlobalSection />
          </Frame>
          <Frame>
            <PhilosophySection />
          </Frame>
          <Frame>
            <VenturesShowcase />
          </Frame>
        </div>

        {/* News pins so the Footer slides over it (the only sticky seam) */}
        <StickySection z={10} className="flow-root bg-[#F4F0E8] px-2 pb-2 sm:px-3 sm:pb-3">
          <Frame>
            <NewsSection />
          </Frame>
        </StickySection>
      </main>

      <div className="relative z-20 shadow-[0_-18px_40px_-12px_rgba(20,23,31,0.28)]">
        <Footer />
      </div>
    </div>
  );
}
