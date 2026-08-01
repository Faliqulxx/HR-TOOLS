import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/shared/Sidebar";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "HR Tools — AI Resume Screening System",
  description:
    "Precision AI resume screening, candidate ranking, and match analytics for modern talent teams.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${mono.variable} dark h-full antialiased`}>
      <body className="flex h-full bg-[#07090E] text-slate-100 font-sans selection:bg-blue-600/30 selection:text-blue-200">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-[#07090E] via-[#0A0E17] to-[#07090E]">
          {children}
        </main>
      </body>
    </html>
  );
}
