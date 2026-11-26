import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutHero from "@/components/about/AboutHero";
import VisionAndMission from "@/components/about/VisionAndMission";
import HistoryTimeline from "@/components/about/HistoryTimeline";
import ChairmanMessage from "@/components/about/ChairmanMessage";
import CoreValues from "@/components/about/CoreValues";
import LeadershipTeam from "@/components/about/LeadershipTeam";
import AboutAffiliates from "@/components/about/AboutAffiliates";

/**
 * Framed section shell — same as the home page (V.3 proportions): each
 * chapter after the Hero is its own rounded 28px card, inset 8/12px from the
 * viewport and 8/12px apart, on the warm page background. overflow-clip (not
 * hidden) so sticky children keep working.
 */
function Frame({ children }: { children: React.ReactNode }) {
  return <div className="w-full overflow-clip rounded-[1.75rem] border border-[#a28757]/20 bg-[#FCFBF9]">{children}</div>;
}

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา | กลุ่มบริษัทเจริญสิน (Charoensin Group)",
  description:
    "เรียนรู้เกี่ยวกับกลุ่มบริษัทเจริญสิน วิสัยทัศน์ พันธกิจ ประวัติความเป็นมากว่า 90 ปี สาส์นจากประธานกิตติมศักดิ์ ปรัชญาค่านิยมองค์กร และคณะกรรมการบริหารผู้ขับเคลื่อนองค์กรสู่อนาคต",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F0E8] text-[#1F1F1F] selection:bg-[#B39B6B]/20 selection:text-[#6B5A3A]">
      {/* 1. Global Navigation Bar */}
      <Navbar />

      {/* Main Content Sections in visionbyclaude Storytelling Order */}
      <main className="flex-1 flex flex-col">
        {/* 1. Hero Header & Quick Jump Navigation */}
        <AboutHero />

        {/* Sections 2–7: one rounded card per chapter (as on the home page) */}
        <div className="relative z-10 flex flex-col gap-2 bg-[#F4F0E8] p-2 sm:gap-3 sm:p-3">
          {/* 02.01–02.02 วิสัยทัศน์ & พันธกิจ */}
          <Frame>
            <VisionAndMission />
          </Frame>
          {/* ประวัติความเป็นมา — parallax banner + 14 milestones */}
          <Frame>
            <HistoryTimeline />
          </Frame>
          {/* สาส์นจากประธานกิตติมศักดิ์ */}
          <Frame>
            <ChairmanMessage />
          </Frame>
          {/* 02.03 ค่านิยม 4 ประการ & จรรยาบรรณธุรกิจ */}
          <Frame>
            <CoreValues />
          </Frame>
          {/* 02.04 ผู้นำของเรา */}
          <Frame>
            <LeadershipTeam />
          </Frame>
          {/* บริษัทและแบรนด์ในเครือ — static 2-row logo grid (replaces the Footer marquee here) */}
          <Frame>
            <AboutAffiliates />
          </Frame>
        </div>
      </main>

      {/* Global Footer */}
      <Footer hideAffiliates />
    </div>
  );
}
