import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FoundationHero from "@/components/foundation/FoundationHero";
import FoundationAbout from "@/components/foundation/FoundationAbout";
import FoundationImpact from "@/components/foundation/FoundationImpact";
import FoundationGallery from "@/components/foundation/FoundationGallery";
import FoundationContact from "@/components/foundation/FoundationContact";

export const metadata: Metadata = {
  title: "มูลนิธิวงษ์เจริญสิน | Wongcharoensin Foundation",
  description:
    "มูลนิธิวงษ์เจริญสิน ภายใต้กลุ่มบริษัทเจริญสิน ก่อตั้ง พ.ศ. 2551 ส่งต่อความเมตตาสู่โรงเรียน วัด โรงพยาบาล บ้านพักคนชรา และสถานสงเคราะห์ทั่วประเทศไทย",
};

/** Same framed card shell as the home page (rounded 28px, inset 8/12px) */
function Frame({ children }: { children: React.ReactNode }) {
  return <div className="w-full overflow-clip rounded-[1.75rem] border border-[#a28757]/20">{children}</div>;
}

/**
 * /foundation — Hero (navy photo card) → About & objectives (white) →
 * Initiatives & impact (cream) → Gallery (white) → Contact (navy) → Footer.
 */
export default function FoundationPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F4F0E8] text-[#14171F] selection:bg-[#a28757]/20 selection:text-[#6B5A3A]">
      <Navbar />
      <main className="flex flex-1 flex-col gap-2 sm:gap-3 p-2 sm:p-3">
        <FoundationHero />
        <Frame>
          <FoundationAbout />
        </Frame>
        <Frame>
          <FoundationImpact />
        </Frame>
        <Frame>
          <FoundationGallery />
        </Frame>
        <Frame>
          <FoundationContact />
        </Frame>
      </main>
      <Footer />
    </div>
  );
}
