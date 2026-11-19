import Navbar from "@/components/Navbar";
import HeroCover from "@/components/HeroCover";
import BusinessCategories from "@/components/BusinessCategories";
import StatsAndGlobal from "@/components/StatsAndGlobal";
import SustainabilityAndPhilosophy from "@/components/SustainabilityAndPhilosophy";
import FlagshipBento from "@/components/FlagshipBento";
import NewsSection from "@/components/NewsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F1E7] text-[#1F1F1F] selection:bg-[#B39B6B]/20 selection:text-[#6B5A3A]">
      {/* 1. Sticky Navigation Header with Mega Menu */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1 flex flex-col">
        {/* 2. Hero Cover Section with 80th Anniversary Logo & AI Badge */}
        <HeroCover />

        {/* Thin Gold CI Divider */}
        <div className="w-full bg-[#F7F1E7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#B39B6B]/40 to-transparent" />
          </div>
        </div>

        {/* 3. Business Categories Section (About CSG & 5 Interactive Expandable Cards) */}
        <BusinessCategories />

        {/* Thin Gold CI Divider */}
        <div className="w-full bg-[#F7F1E7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#B39B6B]/40 to-transparent" />
          </div>
        </div>

        {/* 4. Company Statistics (CountUp Animation) & Global Presence (10 Countries) */}
        <StatsAndGlobal />

        {/* Thin Gold CI Divider */}
        <div className="w-full bg-[#F7F1E7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#B39B6B]/40 to-transparent" />
          </div>
        </div>

        {/* 5. Sustainability & Philosophy (Stepped Trajectory & Hairline Index) */}
        <SustainabilityAndPhilosophy />

        {/* Thin Gold CI Divider */}
        <div className="w-full bg-[#F7F1E7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#B39B6B]/40 to-transparent" />
          </div>
        </div>

        {/* 6. Flagship Bento Grid (Future-Driving Ventures - 5 Cards Single Viewport Fit) */}
        <FlagshipBento />

        {/* Thin Gold CI Divider */}
        <div className="w-full bg-[#F7F1E7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#B39B6B]/40 to-transparent" />
          </div>
        </div>

        {/* 7. News & Activities Section (3-Column Facebook Embeds) */}
        <NewsSection />
      </main>

      {/* 8. Comprehensive Brand Footer with 24 Monochromatic Affiliate Logos */}
      <Footer />
    </div>
  );
}
