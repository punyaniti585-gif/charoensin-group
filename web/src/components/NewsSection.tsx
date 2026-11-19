"use client";

import React from "react";
import Link from "next/link";
import { FadeUp } from "@/components/ui/MotionWrapper";
import { Newspaper, ExternalLink, ArrowRight, Share2 } from "lucide-react";

export default function NewsSection() {
  const newsPosts = [
    {
      id: "fb-post-1",
      title: "Charoensin Group Facebook Post 1",
      url: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FCharoensinGroup%2Fposts%2Fpfbid0FW9daEYB5PydsQwWyVNminAgi8TTsmwMrF3WAPmqzq5LmbTRLsv7i7CVdMR56pBJl&show_text=true",
      directUrl:
        "https://www.facebook.com/CharoensinGroup/posts/pfbid0FW9daEYB5PydsQwWyVNminAgi8TTsmwMrF3WAPmqzq5LmbTRLsv7i7CVdMR56pBJl",
      category: "กิจกรรมองค์กร",
      date: "ล่าสุด",
    },
    {
      id: "fb-post-2",
      title: "Charoensin Group Facebook Post 2",
      url: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FCharoensinGroup%2Fposts%2Fpfbid0mnFKdu35RDH4vmENDzmet3YuEF15QvKHVyDStmLY4jTJ1WJJTQN7zyvRDKXPqX2jl&show_text=true",
      directUrl:
        "https://www.facebook.com/CharoensinGroup/posts/pfbid0mnFKdu35RDH4vmENDzmet3YuEF15QvKHVyDStmLY4jTJ1WJJTQN7zyvRDKXPqX2jl",
      category: "ข่าวสารกลุ่มธุรกิจ",
      date: "ล่าสุด",
    },
    {
      id: "fb-post-3",
      title: "Charoensin Group Facebook Post 3",
      url: "https://www.facebook.com/plugins/post.php?href=https%3A%2F%2Fwww.facebook.com%2FCharoensinGroup%2Fposts%2Fpfbid02AAKTeopJ26fkmqK9bqZcU7BAxVBd4kodHXsvPPAmV47ogyKbRzVAbCELvJkpvXCal&show_text=true",
      directUrl:
        "https://www.facebook.com/CharoensinGroup/posts/pfbid02AAKTeopJ26fkmqK9bqZcU7BAxVBd4kodHXsvPPAmV47ogyKbRzVAbCELvJkpvXCal",
      category: "นวัตกรรมและความยั่งยืน",
      date: "ล่าสุด",
    },
  ];

  return (
    <section id="news" className="relative w-full py-12 lg:py-16 bg-[#F7F1E7] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 lg:mb-10">
          <div>
            <FadeUp delay={0.1} distance={20}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#B39B6B]/20 border border-[#B39B6B]/40 text-[#6B5A3A] text-xs font-semibold tracking-widest uppercase mb-4">
                <Newspaper className="w-3.5 h-3.5 text-[#B39B6B]" />
                <span>NEWS & ACTIVITIES</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-kanit tracking-tight text-[#1F1F1F]">
                ข่าวสารและกิจกรรม
              </h2>
              <p className="mt-3 text-base sm:text-lg text-[#1F1F1F]/75 font-sarabun max-w-2xl">
                ติดตามความเคลื่อนไหว ประกาศองค์กร และกิจกรรมเพื่อสังคมล่าสุดจากกลุ่มบริษัทเจริญสิน
              </p>
            </FadeUp>
          </div>

          <FadeUp delay={0.2} distance={20}>
            {/* Primary Action Button (CI Rule 7: Deep Bronze #6B5A3A with White Text) */}
            <Link
              href="https://csgok.sfinsulations.com/new2026/"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#6B5A3A] hover:bg-[#B39B6B] text-white font-semibold font-kanit text-sm transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 group/cta"
            >
              <span>ดูข่าวสารและกิจกรรมทั้งหมด</span>
              <ArrowRight className="w-4 h-4 group-hover/cta:translate-x-1 transition-transform" />
            </Link>
          </FadeUp>
        </div>

        {/* 3-Column Grid with Facebook Post Embeds */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsPosts.map((post, idx) => (
            <FadeUp
              key={post.id}
              delay={0.2 + idx * 0.1}
              distance={24}
              className="h-full"
            >
              <div className="h-full flex flex-col bg-white rounded-3xl border border-[#B39B6B]/30 hover:border-[#B39B6B] shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
                {/* Post Top Card Header */}
                <div className="p-4 sm:p-5 border-b border-[#F2EFE9] flex items-center justify-between bg-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#B39B6B]" />
                    <span className="text-xs font-semibold text-[#6B5A3A] font-kanit">
                      {post.category}
                    </span>
                  </div>

                  <a
                    href={post.directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-[#6B5A3A] hover:text-[#1F1F1F] font-semibold transition-colors"
                  >
                    <span>เปิดโพสต์</span>
                    <ExternalLink className="w-3 h-3 text-[#6B5A3A]" />
                  </a>
                </div>

                {/* Facebook Embed iframe Frame */}
                <div className="relative w-full min-h-[480px] sm:min-h-[520px] bg-[#FAFAFA] flex items-center justify-center p-2">
                  <iframe
                    src={post.url}
                    width="100%"
                    height="500"
                    style={{ border: "none", overflow: "hidden" }}
                    scrolling="no"
                    frameBorder="0"
                    allowFullScreen={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    title={post.title}
                    className="w-full h-[500px] rounded-xl"
                  />
                </div>

                {/* Card Footer */}
                <div className="p-4 bg-[#F2EFE9]/40 border-t border-[#F2EFE9] mt-auto flex items-center justify-between text-xs text-[#1F1F1F]/60">
                  <span className="font-sarabun">Charoensin Group Official Facebook</span>
                  <a
                    href={post.directUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#6B5A3A] transition-colors"
                    aria-label="แชร์โพสต์"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
