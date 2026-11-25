import type { Metadata } from "next";
import {
  Kanit,
  Sarabun,
  Inter,
  EB_Garamond,
  Noto_Serif_SC,
  Noto_Serif_TC,
  Noto_Serif_JP,
} from "next/font/google";
import "./globals.css";

/* Font variables are named --nf-* (next/font); globals.css builds the
   per-language stacks (--stack-head / --stack-body / --stack-display) from
   them on html[lang], and the font-kanit / font-sarabun / font-playfair
   utilities read those stacks — so switching <html lang> re-fonts the page. */

const kanit = Kanit({
  subsets: ["latin", "thai"],
  weight: ["300", "400"],
  variable: "--nf-kanit",
  display: "swap",
});

const sarabun = Sarabun({
  subsets: ["latin", "thai"],
  weight: ["400"],
  variable: "--nf-sarabun",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--nf-inter",
  display: "swap",
});

/** Main face for English and numerals (all languages) */
const garamond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--nf-garamond",
  display: "swap",
  // No metric fallback face: its local() font could claim Thai / CJK glyphs
  // ahead of Kanit / Sarabun / Noto in the stacks.
  adjustFontFallback: false,
});

/* CJK serif faces: never preloaded. Google serves them in unicode-range
   slices, so a Thai visitor downloads nothing; zh / ja pages fetch only the
   slices their glyphs need. */
const notoSC = Noto_Serif_SC({ weight: ["400"], variable: "--nf-noto-sc", display: "swap", preload: false });
const notoTC = Noto_Serif_TC({ weight: ["400"], variable: "--nf-noto-tc", display: "swap", preload: false });
const notoJP = Noto_Serif_JP({ weight: ["400"], variable: "--nf-noto-jp", display: "swap", preload: false });

export const metadata: Metadata = {
  title: "กลุ่มบริษัทเจริญสิน | Charoensin Group (CSG)",
  description: "กลุ่มบริษัทเจริญสิน เป็นหนึ่งในกลุ่มบริษัทข้ามอุตสาหกรรมชั้นนำของประเทศไทย ดำเนินธุรกิจอย่างมั่นคงและยั่งยืนยาวนานกว่า 90 ปี",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
      { url: "/img/csg-vertical-logo.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico", 
    apple: [
      { url: "/icon.png", sizes: "180x180", type: "image/png" },
      { url: "/img/csg-vertical-logo.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      className={`${kanit.variable} ${sarabun.variable} ${inter.variable} ${garamond.variable} ${notoSC.variable} ${notoTC.variable} ${notoJP.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sarabun text-csg-dark bg-white">
        {children}
      </body>
    </html>
  );
}
