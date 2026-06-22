// components/Footer.jsx
"use client";

import Link from "next/link";
import { FaBus } from "react-icons/fa";
import { FiMail, FiPhone, FiArrowUpRight } from "react-icons/fi";
import { useTheme } from "@/context/ThemeContext"; // Adjust this path to your custom theme context
import {
  FaFacebook,
  FaCcStripe,
  FaCcVisa,
  FaCcMastercard,
} from "react-icons/fa";

export default function Footer() {
  // Pull theme state from your custom context hook
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer
      className={`font-sans pt-16 pb-8 border-t transition-colors duration-300 ${
        isDark
          ? "bg-zinc-950 text-zinc-400 border-zinc-900"
          : "bg-gray-100 text-black border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4-COLUMN DESKTOP GRID / STACKED MOBILE LAYOUT */}
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 pb-12 border-b transition-colors duration-300 ${
            isDark ? "border-zinc-900" : "border-gray-100"
          }`}
        >
          {/* COLUMN 1: BRAND IDENTITY & DESCRIPTION */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${
                  isDark ? "bg-white text-black" : "bg-black text-white"
                }`}
              >
                <FaBus className="text-lg" />
              </div>
              <span
                className={`text-lg font-bold tracking-tight transition-colors duration-300 ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                Route
                <span
                  className={
                    isDark
                      ? "text-zinc-500 font-light"
                      : "text-gray-400 font-light"
                  }
                >
                  mate
                </span>
              </span>
            </Link>
            <p
              className={`text-sm font-light leading-relaxed tracking-wide max-w-xs transition-colors duration-300 ${
                isDark ? "text-zinc-400" : "text-gray-500"
              }`}
            >
              Book bus, train, launch & flight tickets easily through our
              automated, high-performance verification routing systems.
            </p>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div className="space-y-4">
            <h4
              className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className={`transition-colors duration-200 inline-flex items-center group ${
                    isDark ? "hover:text-white" : "hover:text-black"
                  }`}
                >
                  <span>Home</span>
                  <FiArrowUpRight className="opacity-0 group-hover:opacity-100 text-xs ml-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  href="/tickets"
                  className={`transition-colors duration-200 inline-flex items-center group ${
                    isDark ? "hover:text-white" : "hover:text-black"
                  }`}
                >
                  <span>All Tickets</span>
                  <FiArrowUpRight className="opacity-0 group-hover:opacity-100 text-xs ml-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className={`transition-colors duration-200 inline-flex items-center group ${
                    isDark ? "hover:text-white" : "hover:text-black"
                  }`}
                >
                  <span>Contact Us</span>
                  <FiArrowUpRight className="opacity-0 group-hover:opacity-100 text-xs ml-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className={`transition-colors duration-200 inline-flex items-center group ${
                    isDark ? "hover:text-white" : "hover:text-black"
                  }`}
                >
                  <span>About</span>
                  <FiArrowUpRight className="opacity-0 group-hover:opacity-100 text-xs ml-1 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: CONTACT INFORMATION */}
          <div className="space-y-4">
            <h4
              className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Contact Info
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2.5 group">
                <FiMail
                  className={`transition-colors duration-300 ${isDark ? "text-zinc-500 group-hover:text-white" : "text-gray-400 group-hover:text-black"}`}
                />
                <a
                  href="mailto:support@routemate.com"
                  className={`transition-colors break-all ${isDark ? "hover:text-white" : "hover:text-black"}`}
                >
                  support@routemate.com
                </a>
              </li>
              <li className="flex items-center space-x-2.5 group">
                <FiPhone
                  className={`transition-colors duration-300 ${isDark ? "text-zinc-500 group-hover:text-white" : "text-gray-400 group-hover:text-black"}`}
                />
                <a
                  href="tel:+880123456789"
                  className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}
                >
                  +880 1234-56789
                </a>
              </li>
              <li className="flex items-center space-x-2.5 pt-1 group">
                <FaFacebook
                  className={`transition-colors text-base ${isDark ? "text-zinc-500 group-hover:text-blue-500" : "text-gray-400 group-hover:text-blue-600"}`}
                />
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`transition-colors ${isDark ? "hover:text-white" : "hover:text-black"}`}
                >
                  Official Facebook Page
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: SECURE PAYMENT GATEWAYS */}
          <div className="space-y-4">
            <h4
              className={`text-xs font-bold uppercase tracking-widest transition-colors duration-300 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Payment Infrastructure
            </h4>
            <p
              className={`text-xs leading-relaxed font-light mb-2 transition-colors duration-300 ${
                isDark ? "text-zinc-500" : "text-gray-400"
              }`}
            >
              All production transactions are securely verified and processing
              atomically via Stripe network tunnels.
            </p>
            <div
              className={`flex flex-wrap gap-3 text-2xl transition-colors duration-300 ${
                isDark ? "text-zinc-500" : "text-gray-400"
              }`}
            >
              <div
                className={`p-1.5 border rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isDark
                    ? "bg-zinc-950 border-zinc-800 hover:text-white"
                    : "bg-slate-50 border-gray-200 hover:text-black"
                }`}
                title="Stripe Secured"
              >
                <FaCcStripe />
              </div>
              <div
                className={`p-1.5 border rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isDark
                    ? "bg-zinc-950 border-zinc-800 hover:text-white"
                    : "bg-slate-50 border-gray-200 hover:text-black"
                }`}
                title="Visa"
              >
                <FaCcVisa />
              </div>
              <div
                className={`p-1.5 border rounded-lg flex items-center justify-center transition-all duration-300 ${
                  isDark
                    ? "bg-zinc-950 border-zinc-800 hover:text-white"
                    : "bg-slate-50 border-gray-200 hover:text-black"
                }`}
                title="Mastercard"
              >
                <FaCcMastercard />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM METADATA BAR BLOCK */}
        <div
          className={`pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-light gap-4 transition-colors duration-300 ${
            isDark ? "text-zinc-500" : "text-gray-400"
          }`}
        >
          <p>© 2026 Routemate. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link
              href="/privacy"
              className={`transition-colors ${isDark ? "hover:text-zinc-300" : "hover:text-gray-600"}`}
            >
              Privacy & Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
