import Navbar from "@/components/Navbar";
import HeroStage from "@/components/home/HeroStage";
import BusinessCategories from "@/components/BusinessCategories";
import StatsAndGlobal from "@/components/StatsAndGlobal";
import SustainabilityAndPhilosophy from "@/components/SustainabilityAndPhilosophy";
import VenturesBento from "@/components/home/VenturesBento";
import NewsSection from "@/components/NewsSection";
import Footer from "@/components/Footer";
import SmoothScrollProvider from "@/components/home/SmoothScrollProvider";
import StickySection from "@/components/home/StickySection";

/** Thin gold CI hairline between normally-flowing sections */
function GoldDivider() {
  return (
    <div className="relative z-10 w-full bg-[#F7F1E7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#B39B6B]/40 to-transparent" />
      </div>
    </div>
  );
}

/**
 * Home page scroll pacing — sticky overlap at exactly TWO seams:
 *   1. Hero (pinned)  ← "เกี่ยวกับกลุ่มเจริญสิน" (5 business pillars) slides over it
 *   2. News (pinned)  ← the dark Footer slides over it to close the page
 * Everything in between flows normally (relative z-10, opaque backgrounds),
 * which keeps the layer stack and z-index simple and the page light.
 *
 * <main> is `display: contents` so News and the Footer share one containing
 * block — required for the Footer to overlap the pinned News section.
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F1E7] text-[#1F1F1F] selection:bg-[#B39B6B]/20 selection:text-[#6B5A3A]">
      <SmoothScrollProvider />

      {/* 1. Sticky Navigation Header with Mega Menu (z-50, above every layer) */}
      <Navbar />

      <main className="contents">
        {/* 2. Hero Stage — pinned at the end of its scroll stage (seam 1) */}
        <StickySection z={0}>
          <HeroStage />
        </StickySection>

        {/* 3. เกี่ยวกับกลุ่มเจริญสิน + 5 pillars — slides over the pinned Hero */}
        <div className="relative z-10 shadow-[0_-18px_40px_-12px_rgba(31,31,31,0.18)]">
          <div
            aria-hidden
            className="absolute top-0 inset-x-0 z-10 h-px bg-gradient-to-r from-transparent via-[#B39B6B]/45 to-transparent pointer-events-none"
          />
          <BusinessCategories />
        </div>

        <GoldDivider />

        {/* 4. กลุ่มบริษัทเจริญสิน — statistics & global presence */}
        <div className="relative z-10">
          <StatsAndGlobal />
        </div>

        <GoldDivider />

        {/* 5. Sustainability & Philosophy */}
        <div className="relative z-10">
          <SustainabilityAndPhilosophy />
        </div>

        <GoldDivider />

        {/* 6. Future-Driving Ventures — bento explorer (ADB · CPL · TTN · TWS · มูลนิธิ) */}
        <div className="relative z-10">
          <VenturesBento />
        </div>

        <GoldDivider />

        {/* 7. News & Activities — pinned so the Footer slides over it (seam 2) */}
        <StickySection z={10}>
          <NewsSection />
        </StickySection>
      </main>

      {/* 8. Dark Footer slides over the pinned News section */}
      <div className="relative z-20 shadow-[0_-18px_40px_-12px_rgba(31,31,31,0.25)]">
        <Footer />
      </div>
    </div>
  );
}
