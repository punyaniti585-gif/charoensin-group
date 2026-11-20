import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutHero from "@/components/about/AboutHero";
import VisionAndMission from "@/components/about/VisionAndMission";
import HistoryTimeline from "@/components/about/HistoryTimeline";
import ChairmanMessage from "@/components/about/ChairmanMessage";
import CoreValues from "@/components/about/CoreValues";
import LeadershipTeam from "@/components/about/LeadershipTeam";

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา | กลุ่มบริษัทเจริญสิน (Charoensin Group)",
  description:
    "เรียนรู้เกี่ยวกับกลุ่มบริษัทเจริญสิน วิสัยทัศน์ พันธกิจ ประวัติความเป็นมากว่า 90 ปี สาส์นจากประธานกิตติมศักดิ์ ปรัชญาค่านิยมองค์กร และคณะกรรมการบริหารผู้ขับเคลื่อนองค์กรสู่อนาคต",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F7F1E7] text-[#1F1F1F] selection:bg-[#B39B6B]/20 selection:text-[#6B5A3A]">
      {/* 1. Global Navigation Bar */}
      <Navbar />

      {/* Main Content Sections in visionbyclaude Storytelling Order */}
      <main className="flex-1 flex flex-col">
        {/* 1. Hero Header & Quick Jump Navigation */}
        <AboutHero />

        {/* 2. ส่วนที่ 1: วิสัยทัศน์ & พันธกิจ (02.01 & 02.02 - Sticky Visual & 6 Mission Points) */}
        <VisionAndMission />

        {/* 3. ส่วนที่ 2 & 3: แบนเนอร์ Parallax 'History of buildings Succeed' + ไทม์ไลน์ 14 หมุดหมาย + เจริญสินมุ่งมั่นสู่ ISO / Green */}
        <HistoryTimeline />

        {/* 4. สาส์นจากประธานกิตติมศักดิ์ (ดร.ทนง พิทยะ) */}
        <ChairmanMessage />

        {/* Thin Gold CI Divider */}
        <div className="w-full bg-[#F7F1E7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#CCA369]/30 to-transparent" />
          </div>
        </div>

        {/* 5. 02.03 ปรัชญาการทำงานของเจริญสิน (ค่านิยม 4 ประการ & จรรยาบรรณธุรกิจ) */}
        <CoreValues />

        {/* Thin Gold CI Divider */}
        <div className="w-full bg-[#F7F1E7]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#CCA369]/30 to-transparent" />
          </div>
        </div>

        {/* 6. 02.04 ผู้นำของเรา (คณะกรรมการบริษัท 11 ท่าน & คณะที่ปรึกษา 6 ท่าน) */}
        <LeadershipTeam />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
