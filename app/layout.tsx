import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { BottomNavigation } from "@/components/BottomNavigation";
import { PWARegister } from "@/components/PWARegister";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
  title: "ABSECO Smart Living Experience Platform",
  description: "Explore AI powered smart homes before speaking to ABSECO sales.",
  manifest: "/manifest.webmanifest",
  icons: [{ rel: "icon", url: "/icons/icon.svg" }]
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${sora.variable} min-h-screen pb-20`}>
        <PWARegister />
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 py-4">{children}</main>
        <BottomNavigation />
      </body>
    </html>
  );
}
