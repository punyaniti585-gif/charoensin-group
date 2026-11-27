import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AboutV2 from "@/components/about/v2/AboutV2";

/* /about — V.2: shared hero + Instant View Switcher across three views
   (ประวัติความเป็นมา / วิสัยทัศน์ พันธกิจ และค่านิยม / ผู้นำของเรา).
   The V.1 section components in components/about/ are no longer used here. */

export const metadata: Metadata = {
  title: "เกี่ยวกับเรา | กลุ่มบริษัทเจริญสิน (Charoensin Group)",
  description:
    "เรียนรู้เกี่ยวกับกลุ่มบริษัทเจริญสิน ประวัติความเป็นมาตั้งแต่ พ.ศ. 2475 วิสัยทัศน์ พันธกิจ ปรัชญาการทำงาน จรรยาบรรณธุรกิจ สาส์นจากประธานกิตติมศักดิ์ และคณะกรรมการผู้ขับเคลื่อนองค์กรสู่อนาคต",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F3] text-[#111e46] selection:bg-[#C8A96A]/25 selection:text-[#111e46]">
      <Navbar />
      {/* main's 2nd child is the content wrapper — the Navbar folds its top bar when it reaches it */}
      <main className="flex flex-1 flex-col">
        <AboutV2 />
      </main>
      <Footer />
    </div>
  );
}
