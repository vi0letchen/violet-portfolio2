import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import CustomCursor from "@/components/CustomCursor";
import { SkillPreviewProvider } from "@/components/SkillPreview";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Violet a Developer",
  description:
    "Full-Stack Developer specialising in Next.js, TypeScript, and modern web technologies. CS graduate from University of Auckland.",
  keywords: ["Violet Chen", "Full-Stack Developer", "Next.js", "TypeScript", "Portfolio"],
  authors: [{ name: "Violet Chen", url: "https://www.violetchen.dev" }],
  openGraph: {
    title: "Violet Chen — Full-Stack Developer",
    description: "Portfolio of Violet Chen, Full-Stack Developer based in Auckland, NZ.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} antialiased bg-black text-[#e2e8f0]`}>
        <CustomCursor />
        <SkillPreviewProvider>
          <div className="relative" style={{ zIndex: 10 }}>
            {children}
          </div>
        </SkillPreviewProvider>
      </body>
    </html>
  );
}
