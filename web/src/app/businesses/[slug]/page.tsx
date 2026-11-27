import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CompanySummary from "@/components/businesses/CompanySummary";
import { getAllCompanies, getCompanyBySlug } from "@/data/businesses-data";

/* 03.xx Company summary — one static page per company in businesses-data.ts */

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCompanies().map(({ company }) => ({ slug: company.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const entry = getCompanyBySlug(slug);
  if (!entry) return {};
  const { company, group } = entry;
  return {
    title: `${company.nameTh} | ธุรกิจของเรา | กลุ่มบริษัทเจริญสิน (Charoensin Group)`,
    description:
      company.description ??
      `${company.nameTh}${company.nameEn ? ` (${company.nameEn})` : ""} — บริษัทใน${group.nameTh} กลุ่มบริษัทเจริญสิน`,
  };
}

export default async function CompanyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = getCompanyBySlug(slug);
  if (!entry) notFound();

  return (
    <div className="min-h-screen flex flex-col bg-[#F7F1E7] text-[#1F1F1F] selection:bg-[#B39B6B]/20 selection:text-[#6B5A3A]">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <CompanySummary company={entry.company} group={entry.group} />
      </main>
      <Footer />
    </div>
  );
}
