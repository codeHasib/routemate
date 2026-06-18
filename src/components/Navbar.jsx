// components/Navbar.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client"; // Adjust this path to your Better-Auth client instance
import { RiRouteLine } from "react-icons/ri";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FiUser, FiLogOut, FiLayout, FiChevronDown } from "react-icons/fi";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // 1. Listen to Better-Auth live session state
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  // Close mobile drawer on route shifts
  useEffect(() => {
    setIsOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  // Shared active link styling constraint
  const isActive = (path) => pathname === path;

  return (
    <nav className="font-sans sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* LEFT SIDE: Brand Identity */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-white transition-transform group-hover:scale-105 duration-300">
              <RiRouteLine className="text-xl" />
            </div>
            <span className="text-xl font-bold tracking-tight text-black font-sans">
              Route<span className="text-gray-400 font-light">mate</span>
            </span>
          </Link>

          {/* CENTER: Public Core Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                isActive("/") ? "text-black" : "text-gray-500 hover:text-black"
              }`}
            >
              Home
            </Link>
            <Link
              href="/tickets"
              className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                isActive("/tickets")
                  ? "text-black"
                  : "text-gray-500 hover:text-black"
              }`}
            >
              All Tickets
            </Link>

            {/* Contextual Protected Dashboard Navigation Anchor */}
            {user && (
              <Link
                href={
                  user.role === "admin"
                    ? "/admin/dashboard"
                    : user.role === "vendor"
                      ? "/vendor/dashboard"
                      : "/user/dashboard"
                }
                className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                  pathname.includes("dashboard")
                    ? "text-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* RIGHT SIDE: Auth Gateway Configuration */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            {isPending ? (
              <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
            ) : user ? (
              /* PREMIUM PROFILE DROPDOWN MENU CONTAINER */
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 p-1.5 rounded-xl hover:bg-gray-50 transition-colors duration-200 focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-900 border border-gray-200 flex items-center justify-center text-white font-semibold text-sm overflow-hidden uppercase">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        height={22}
                        width={22}
                        className="object-cover rounded-full"
                      />
                    ) : (
                      user.name?.charAt(0)
                    )}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-gray-900 leading-none mb-0.5">
                      {user.name}
                    </p>
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider leading-none">
                      {user.role}
                    </p>
                  </div>
                  <FiChevronDown
                    className={`text-gray-400 text-xs transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Animated Dropdown Menu Panel */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <>
                      {/* Full screen invisible click listener to close dropdown */}
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setDropdownOpen(false)}
                      />

                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 mt-2 w-52 bg-white rounded-xl border border-gray-100 shadow-xl py-1 z-20 overflow-hidden"
                      >
                        <div className="px-4 py-2 border-b border-gray-50 lg:hidden">
                          <p className="text-sm font-semibold text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-400 capitalize">
                            {user.role}
                          </p>
                        </div>

                        <Link
                          href="/user/dashboard/profile"
                          className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
                        >
                          <FiUser className="text-gray-400" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          href={
                            user.role === "admin"
                              ? "/admin/dashboard"
                              : user.role === "vendor"
                                ? "/vendor/dashboard"
                                : "/user/dashboard"
                          }
                          className="flex items-center space-x-2 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-black transition-colors"
                        >
                          <FiLayout className="text-gray-400" />
                          <span>Workspace</span>
                        </Link>

                        <hr className="border-gray-50 my-1" />

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50/50 transition-colors text-left"
                        >
                          <FiLogOut />
                          <span>Log Out</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* NON-LOGGED GATEWAY CTAs */
              <div className="flex items-center space-x-3">
                <Link
                  href="/auth/signin"
                  className="text-sm font-semibold text-gray-600 hover:text-black px-4 py-2 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm font-semibold bg-black text-white px-4 py-2 rounded-xl hover:bg-gray-900 transition-all duration-200 shadow-sm active:scale-95"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* RESPONSIVE MOBILE TRIGGER CONTROLLER */}
          <div className="flex md:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors focus:outline-none"
            >
              {isOpen ? (
                <HiX className="text-2xl" />
              ) : (
                <HiMenuAlt3 className="text-2xl" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE EXPANDABLE DRAWER ACCORDION PANEL */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-3 shadow-inner">
              <Link
                href="/"
                className="block py-2.5 px-3 text-base font-medium rounded-xl text-gray-700 hover:bg-gray-50 hover:text-black"
              >
                Home
              </Link>
              <Link
                href="/tickets"
                className="block py-2.5 px-3 text-base font-medium rounded-xl text-gray-700 hover:bg-gray-50 hover:text-black"
              >
                All Tickets
              </Link>

              {user && (
                <Link
                  href={
                    user.role === "admin"
                      ? "/admin/dashboard"
                      : user.role === "vendor"
                        ? "/vendor/dashboard"
                        : "/user/dashboard"
                  }
                  className="block py-2.5 px-3 text-base font-medium rounded-xl text-gray-700 hover:bg-gray-50 hover:text-black"
                >
                  Dashboard
                </Link>
              )}

              <hr className="border-gray-100 my-2" />

              {user ? (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-3 px-3 py-1.5">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold uppercase text-sm">
                      {user.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 leading-tight">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-400 capitalize">
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/user/dashboard/profile"
                    className="flex items-center space-x-2 py-2.5 px-3 text-base font-medium text-gray-600 rounded-xl hover:bg-gray-50"
                  >
                    <FiUser /> <span>My Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 py-2.5 px-3 text-base font-medium text-red-600 rounded-xl hover:bg-red-50/50 text-left"
                  >
                    <FiLogOut /> <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    href="/auth/signin"
                    className="w-full text-center py-2.5 border border-gray-200 text-sm font-semibold rounded-xl text-gray-700 hover:bg-gray-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="w-full text-center py-2.5 bg-black text-white text-sm font-semibold rounded-xl hover:bg-gray-900"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
