import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BusinessOverview from "@/components/businesses/BusinessOverview";
import { getBusinessPageData } from "@/data/businesses-data";

export const metadata: Metadata = {
  title: "ธุรกิจของเรา | กลุ่มบริษัทเจริญสิน (Charoensin Group)",
  description:
    "5 กลุ่มธุรกิจของกลุ่มบริษัทเจริญสิน ได้แก่ อสังหาริมทรัพย์ ผลิตหนังและรองเท้า สิ่งทอ เคมีภัณฑ์ และธุรกิจอื่นๆ พร้อมรายชื่อบริษัทในเครือ ที่เชื่อมโยงกันตลอดห่วงโซ่อุตสาหกรรม",
};

export default async function BusinessesPage() {
  const data = await getBusinessPageData();

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F1E7] text-[#1F1F1F] selection:bg-[#B39B6B]/20 selection:text-[#6B5A3A]">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <BusinessOverview data={data} />
      </main>
      <Footer />
    </div>
  );
}
