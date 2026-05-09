import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NextCampus — Discover. Compare. Decide.",
  description:
    "Find your perfect college. Explore IITs, NITs, and top private universities. Compare fees, placements, ratings, and more.",
  keywords: ["college discovery", "IIT", "NIT", "engineering colleges", "India"],
  openGraph: {
    title: "NextCampus — Discover. Compare. Decide.",
    description: "Find your perfect college in India.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
