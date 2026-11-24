import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsIndex from "@/components/news/NewsIndex";

export const metadata: Metadata = {
  title: "ข่าวสารและกิจกรรม | กลุ่มบริษัทเจริญสิน (Charoensin Group)",
  description:
    "ข่าวสาร ประกาศองค์กร และกิจกรรมเพื่อสังคมล่าสุดจากกลุ่มบริษัทเจริญสิน และบริษัทในเครือทั้ง 5 กลุ่มธุรกิจ",
};

export default function NewsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#14171F]">
      <Navbar />
      <main className="flex-1">
        <NewsIndex />
      </main>
      <Footer />
    </div>
  );
}
