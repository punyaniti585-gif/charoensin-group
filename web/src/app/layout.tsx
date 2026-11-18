import type { Metadata } from "next";
import { Kanit, Sarabun, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const kanit = Kanit({
  subsets: ["latin", "thai"],
  weight: ["300", "400"],
  variable: "--font-kanit",
  display: "swap",
});

const sarabun = Sarabun({
  subsets: ["latin", "thai"],
  weight: ["400"],
  variable: "--font-sarabun",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
      className={`${kanit.variable} ${sarabun.variable} ${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sarabun text-csg-dark bg-white">
        {children}
      </body>
    </html>
  );
}
