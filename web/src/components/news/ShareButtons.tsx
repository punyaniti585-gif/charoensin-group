"use client";

import React, { useState } from "react";
import { Check, ExternalLink, Share2 } from "lucide-react";

/** Share (Web Share API → copy-link fallback) + open the original source. */
export default function ShareButtons({ title, externalUrl }: { title: string; externalUrl: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* cancelled — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={share}
        className="inline-flex items-center gap-2 rounded-full border border-[#a28757]/40 px-5 py-2.5 font-kanit text-sm text-[#6B5A3A] transition-colors hover:border-[#a28757] hover:bg-[#a28757]/10"
      >
        {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
        {copied ? "คัดลอกลิงก์แล้ว" : "แชร์ข่าวนี้"}
      </button>
      <a
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-[#14171F] px-5 py-2.5 font-kanit text-sm text-white transition-colors hover:bg-[#a28757]"
      >
        เปิดลิงก์ต้นฉบับ
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );
}
