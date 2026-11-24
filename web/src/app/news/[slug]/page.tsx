import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsCard from "@/components/news/NewsCard";
import ShareButtons from "@/components/news/ShareButtons";
import {
  NEWS_INDEX_HREF,
  formatThaiDate,
  getAllNews,
  getNewsBySlug,
  getRelatedNews,
} from "@/data/news-data";

// Static export: every story is generated at build time from news-data.ts
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllNews().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) return {};
  return {
    title: `${item.title} | ข่าวสารและกิจกรรม — กลุ่มบริษัทเจริญสิน`,
    description: item.excerpt,
    openGraph: { title: item.title, description: item.excerpt, images: [item.image] },
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = getNewsBySlug(slug);
  if (!item) notFound();
  const related = getRelatedNews(item, 3);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#14171F]">
      <Navbar />
      <main className="flex-1">
        <article>
          <header className="mx-auto max-w-4xl px-4 sm:px-6 pt-10 sm:pt-14">
            <Link
              href={NEWS_INDEX_HREF}
              className="inline-flex items-center gap-2 font-kanit text-sm text-[#6B5A3A] hover:text-[#a28757]"
            >
              <ArrowLeft className="h-4 w-4" />
              ข่าวสารและกิจกรรมทั้งหมด
            </Link>
            <p className="mt-8 font-kanit text-sm text-[#a28757]">
              {item.category} · <time dateTime={item.date}>{formatThaiDate(item.date)}</time>
            </p>
            <h1 className="mt-3 font-kanit font-normal text-3xl sm:text-4xl lg:text-5xl leading-tight text-[#14171F]">{item.title}</h1>
            <p className="mt-4 font-sarabun text-lg leading-relaxed text-[#14171F]/65">{item.excerpt}</p>
          </header>

          <div className="mx-auto mt-10 max-w-5xl px-4 sm:px-6">
            <div className="relative aspect-[16/9] overflow-hidden rounded-3xl bg-[#E9DFCC] shadow-[0_30px_70px_-40px_rgba(60,45,20,0.55)]">
              <Image src={item.image} alt={item.title} fill priority sizes="(max-width: 1024px) 100vw, 1024px" className="object-cover" />
            </div>
          </div>

          <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12 sm:py-16">
            <div className="space-y-5 font-sarabun text-[17px] leading-[1.9] text-[#14171F]/80">
              {item.content.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
            <div className="mt-10 border-t border-[#a28757]/20 pt-8">
              <ShareButtons title={item.title} externalUrl={item.externalUrl} />
            </div>
          </div>
        </article>

        {related.length > 0 && (
          <section aria-labelledby="related-title" className="border-t border-[#a28757]/15 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
              <h2 id="related-title" className="font-kanit font-normal text-2xl sm:text-3xl text-[#14171F]">
                ข่าวที่เกี่ยวข้อง
              </h2>
              <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map((n) => (
                  <li key={n.id}>
                    <NewsCard item={n} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}
