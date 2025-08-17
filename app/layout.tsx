import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { GlobalToaster } from "@/lib/useToast";
import "@/lib/env"; // Validate environment variables at startup

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResumeAI - AI-Powered Resume Analysis",
  description:
    "Upload your resume and get AI-powered insights, skill analysis, and job recommendations.",
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
        <main>{children}</main>
        <Footer />
        <GlobalToaster />
      </body>
    </html>
  );
}
