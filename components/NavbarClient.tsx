"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Archive,
  Home,
  LayoutDashboard,
  LogIn,
  Menu,
  Search,
  Settings,
  UploadCloud,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

interface Session {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  };
}

interface NavbarClientProps {
  session: Session | null;
}

export default function NavbarClient({ session }: NavbarClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/signin" });
  };

  return (
    <header className="bg-gray-900 text-white w-full shadow-md sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-blue-500">
          ResumeAI
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex space-x-6 items-center">
          <Link
            href="/"
            className="flex items-center gap-1 hover:text-blue-400 transition"
          >
            <Home size={18} /> Home
          </Link>
          <Link
            href="/upload"
            className="flex items-center gap-1 hover:text-blue-400 transition"
          >
            <UploadCloud size={18} /> Upload
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 hover:text-blue-400 transition"
          >
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link
            href="/dashboard/history"
            className="flex items-center gap-1 hover:text-blue-400 transition"
          >
            <Archive size={18} /> History
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-1 hover:text-blue-400 transition"
          >
            <Settings size={18} /> Settings
          </Link>
          <Link
            href="/jobs"
            className="flex items-center gap-1 hover:text-blue-400 transition"
          >
            <Search size={18} /> Job Finder
          </Link>
          {session?.user?.role === "admin" && (
            <Link href="/admin/dashboard" className="hover:text-blue-400">
              Admin
            </Link>
          )}

          {session?.user ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl font-semibold flex items-center gap-1"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/auth/signin"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl font-semibold flex items-center gap-1"
            >
              <LogIn size={18} /> Sign In
            </Link>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button className="lg:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden bg-gray-800 overflow-hidden px-4 py-4 space-y-4 text-center"
          >
            <Link
              href="/"
              className="flex items-center justify-center gap-2 hover:text-blue-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              <Home size={18} /> Home
            </Link>
            <Link
              href="/upload"
              className="flex items-center justify-center gap-2 hover:text-blue-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              <UploadCloud size={18} /> Upload
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 hover:text-blue-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              <LayoutDashboard size={18} /> Dashboard
            </Link>
            <Link
              href="/dashboard/history"
              className="flex items-center justify-center gap-2 hover:text-blue-400 transition"
            >
              <Archive size={18} /> History
            </Link>
            <Link
              href="/jobs"
              className="flex items-center justify-center gap-2 hover:text-blue-400 transition"
            >
              <Search size={18} /> Job Finder
            </Link>

            {session?.user?.role === "admin" && (
              <Link
                href="/admin/dashboard"
                className="flex items-center justify-center gap-2 hover:text-blue-400 transition"
              >
                Admin
              </Link>
            )}

            {session?.user ? (
              <button
                onClick={() => {
                  setMenuOpen(false);
                  handleLogout();
                }}
                className="cursor-pointer bg-red-600 hover:bg-red-700 w-full py-2 rounded-xl"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/auth/signin"
                className="bg-blue-600 hover:bg-blue-700 w-full py-2 rounded-xl flex items-center justify-center gap-2"
                onClick={() => setMenuOpen(false)}
              >
                <LogIn size={18} /> Sign In
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
