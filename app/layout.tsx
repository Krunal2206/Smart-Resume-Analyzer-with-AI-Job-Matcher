import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import Footer from "../components/Footer";
import { GlobalToaster } from "../lib/useToast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Resume Analyzer & Job Matcher",
  description: "AI-powered resume analysis and job recommendations",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <div className="min-h-screen bg-gray-950 text-white">
          {children}
          <Footer />
          <GlobalToaster />
        </div>
      </body>
    </html>
  );
}
