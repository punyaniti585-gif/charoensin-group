import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatThaiDate, newsHref, type NewsItem } from "@/data/news-data";

/** News card — shared by the home deck, /news grid and related stories. */
export default function NewsCard({
  item,
  emphasis = false,
  priority = false,
}: {
  item: NewsItem;
  emphasis?: boolean;
  priority?: boolean;
}) {
  return (
    <Link
      href={newsHref(item)}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white transition-[border-color,box-shadow] duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#a28757] ${
        emphasis
          ? "border-[#a28757] shadow-[0_18px_40px_rgba(107,90,58,0.22)]"
          : "border-[#a28757]/25 shadow-[0_10px_26px_rgba(107,90,58,0.12)] hover:border-[#a28757]"
      }`}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[#E9DFCC]">
        <Image
          src={item.image}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 360px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-[#14171F]/70 px-2.5 py-1 font-kanit text-[11px] text-[#cfc29f]">
          {item.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <time dateTime={item.date} className="font-sarabun text-xs text-[#a28757]">
          {formatThaiDate(item.date)}
        </time>
        <h3 className="mt-1 min-h-[2.6em] font-kanit text-[15px] font-normal leading-snug text-[#14171F] line-clamp-2">{item.title}</h3>
        <p className="mt-1.5 min-h-[2.5em] font-sarabun text-xs text-[#14171F]/60 line-clamp-2">{item.excerpt}</p>
        <span className="mt-auto pt-3 inline-flex items-center gap-1 font-kanit text-xs text-[#6B5A3A] transition-colors group-hover:text-[#a28757]">
          อ่านรายละเอียด
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}
