// components/Footer.jsx
"use client";

import Link from "next/link";
import { RiRouteLine } from "react-icons/ri";
import { FiMail, FiPhone, FiArrowUpRight } from "react-icons/fi";
import {
  FaFacebook,
  FaCcStripe,
  FaCcVisa,
  FaCcMastercard,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-gray-400 font-sans border-t border-slate-900 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 4-COLUMN DESKTOP GRID / STACKED MOBILE LAYOUT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-8 pb-12 border-b border-slate-900">
          {/* COLUMN 1: BRAND IDENTITY & DESCRIPTION */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black transition-transform group-hover:scale-105 duration-300">
                <RiRouteLine className="text-lg" />
              </div>
              <span className="text-lg font-bold tracking-tight text-white">
                Route<span className="text-gray-500 font-light">mate</span>
              </span>
            </Link>
            <p className="text-sm font-light leading-relaxed tracking-wide text-gray-400 max-w-xs">
              Book bus, train, launch & flight tickets easily through our
              automated, high-performance verification routing systems.
            </p>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Quick Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-white transition-colors duration-200 inline-flex items-center group"
                >
                  <span>Home</span>
                  <FiArrowUpRight className="opacity-0 group-hover:opacity-100 text-xs ml-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  href="/tickets"
                  className="hover:text-white transition-colors duration-200 inline-flex items-center group"
                >
                  <span>All Tickets</span>
                  <FiArrowUpRight className="opacity-0 group-hover:opacity-100 text-xs ml-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors duration-200 inline-flex items-center group"
                >
                  <span>Contact Us</span>
                  <FiArrowUpRight className="opacity-0 group-hover:opacity-100 text-xs ml-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors duration-200 inline-flex items-center group"
                >
                  <span>About</span>
                  <FiArrowUpRight className="opacity-0 group-hover:opacity-100 text-xs ml-1 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: CONTACT INFORMATION */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Contact Info
            </h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2.5 group">
                <FiMail className="text-gray-500 group-hover:text-white transition-colors" />
                <a
                  href="mailto:support@routemate.com"
                  className="hover:text-white transition-colors break-all"
                >
                  support@routemate.com
                </a>
              </li>
              <li className="flex items-center space-x-2.5 group">
                <FiPhone className="text-gray-500 group-hover:text-white transition-colors" />
                <a
                  href="tel:+880123456789"
                  className="hover:text-white transition-colors"
                >
                  +880 1234-56789
                </a>
              </li>
              <li className="flex items-center space-x-2.5 pt-1 group">
                <FaFacebook className="text-gray-500 group-hover:text-blue-500 transition-colors text-base" />
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Official Facebook Page
                </a>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: SECURE PAYMENT GATEWAYS */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white">
              Payment Infrastructure
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed font-light mb-2">
              All production transactions are securely verified and processing
              atomically via Stripe network tunnels.
            </p>
            <div className="flex flex-wrap gap-3 text-2xl text-gray-500">
              <div
                className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center hover:text-white transition-colors"
                title="Stripe Secured"
              >
                <FaCcStripe />
              </div>
              <div
                className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center hover:text-white transition-colors"
                title="Visa"
              >
                <FaCcVisa />
              </div>
              <div
                className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-center hover:text-white transition-colors"
                title="Mastercard"
              >
                <FaCcMastercard />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM METADATA BAR BLOCK */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 font-light gap-4">
          <p>© 2026 Routemate. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link
              href="/privacy"
              className="hover:text-gray-300 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-gray-300 transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
