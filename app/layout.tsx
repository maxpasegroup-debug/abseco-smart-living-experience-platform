import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { ShowroomNav } from "@/components/ShowroomNav";
import { ShowroomBottomNav } from "@/components/ShowroomBottomNav";
import { PWARegister } from "@/components/PWARegister";
import { SmartPlanProvider } from "@/lib/context/SmartPlanContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
  title: "ABSECO AI Smart Living Showroom",
  description: "Experience AI powered luxury homes. Your online smart living showroom.",
  manifest: "/manifest.webmanifest",
  icons: [{ rel: "icon", url: "/icons/icon.svg" }]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sora.variable} min-h-screen pb-20`}>
        <PWARegister />
        <SmartPlanProvider>
          <ShowroomNav />
          <main className="mx-auto w-full max-w-6xl px-4 py-4">{children}</main>
          <ShowroomBottomNav />
        </SmartPlanProvider>
      </body>
    </html>
  );
}
