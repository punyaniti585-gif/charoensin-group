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
 * Framed section shell: every section after the Hero sits in its own large
 * rounded panel on the #F4F0E8 page, so each chapter reads as a distinct,
 * layered card. Sections set their own background (white / ivory / navy).
 */
function Frame({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full my-2 sm:my-3 overflow-hidden rounded-[1.75rem] sm:rounded-[2.5rem] border-y border-[#a28757]/15 shadow-[0_10px_40px_rgba(20,23,31,0.04)]">
      {children}
    </div>
  );
}

/**
 * Home page
 *   Hero (full-bleed 2-act stage) → framed sections: Manifesto (ivory) →
 *   Global (white) → Philosophy (ivory) → Ventures (navy) → News (white)
 *   → Footer.
 *
 * Only one sticky overlap: News pins and the dark Footer slides over it.
 * <main> is `display: contents` so News and the Footer share one containing
 * block; the News wrapper is flow-root so its frame margins stay inside it.
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F0E8] text-[#14171F] selection:bg-[#a28757]/20 selection:text-[#6B5A3A]">
      <SmoothScrollProvider />
      <Navbar />

      <main className="contents">
        <HeroStage />

        <div className="relative z-10 bg-[#F4F0E8] py-2 lg:py-4">
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
        <StickySection z={10} className="flow-root bg-[#F4F0E8] pb-2 lg:pb-4">
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
