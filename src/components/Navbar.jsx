// components/Navbar.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { authClient } from "@/lib/auth-client"; // Adjust this path to your Better-Auth client instance
import { useTheme } from "@/context/ThemeContext"; // Adjust this path to your custom theme context
import { FaBus } from "react-icons/fa";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { FiUser, FiLogOut, FiLayout, FiChevronDown } from "react-icons/fi";
import Image from "next/image";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Pull theme state from your custom context hook
  const { theme } = useTheme();
  const isDark = theme === "dark";

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
    <nav
      className={`font-sans sticky top-0 z-50 backdrop-blur-md border-b transition-all duration-300 ${
        isDark ? "bg-black border-zinc-900" : "bg-white/80 border-gray-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* LEFT SIDE: Brand Identity */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105 duration-300 ${
                isDark ? "bg-white text-zinc-950" : "bg-black text-white"
              }`}
            >
              <FaBus className="text-xl" />
            </div>
            <span
              className={`text-xl font-bold tracking-tight font-sans ${isDark ? "text-white" : "text-black"}`}
            >
              Route
              <span
                className={`font-light ${isDark ? "text-zinc-500" : "text-gray-400"}`}
              >
                mate
              </span>
            </span>
          </Link>

          {/* CENTER: Public Core Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                isActive("/")
                  ? isDark
                    ? "text-white"
                    : "text-black"
                  : isDark
                    ? "text-zinc-400 hover:text-white"
                    : "text-gray-500 hover:text-black"
              }`}
            >
              Home
            </Link>
            <Link
              href="/tickets"
              className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
                isActive("/tickets")
                  ? isDark
                    ? "text-white"
                    : "text-black"
                  : isDark
                    ? "text-zinc-400 hover:text-white"
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
                    ? isDark
                      ? "text-white"
                      : "text-black"
                    : isDark
                      ? "text-zinc-400 hover:text-white"
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
              <div
                className={`w-8 h-8 rounded-full animate-pulse ${isDark ? "bg-zinc-800" : "bg-gray-100"}`}
              />
            ) : user ? (
              /* PREMIUM PROFILE DROPDOWN MENU CONTAINER */
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`flex items-center space-x-3 p-1.5 rounded-xl transition-colors duration-200 focus:outline-none ${
                    isDark ? "hover:bg-zinc-900" : "hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full border flex items-center justify-center font-semibold text-sm overflow-hidden uppercase ${
                      isDark
                        ? "bg-white border-zinc-800 text-zinc-950"
                        : "bg-gray-900 border-gray-200 text-white"
                    }`}
                  >
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
                    <p
                      className={`text-xs font-semibold leading-none mb-0.5 ${isDark ? "text-zinc-100" : "text-gray-900"}`}
                    >
                      {user.name}
                    </p>
                    <p
                      className={`text-[10px] font-medium uppercase tracking-wider leading-none ${isDark ? "text-zinc-500" : "text-gray-400"}`}
                    >
                      {user.role}
                    </p>
                  </div>
                  <FiChevronDown
                    className={`text-xs transition-transform duration-300 ${isDark ? "text-zinc-500" : "text-gray-400"} ${dropdownOpen ? "rotate-180" : ""}`}
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
                        className={`absolute right-0 mt-2 w-52 rounded-xl border py-1 z-20 overflow-hidden ${
                          isDark
                            ? "bg-zinc-900 border-zinc-800 shadow-black/40 shadow-2xl"
                            : "bg-white border-gray-100 shadow-xl"
                        }`}
                      >
                        <div
                          className={`px-4 py-2 border-b lg:hidden ${isDark ? "border-zinc-800" : "border-gray-50"}`}
                        >
                          <p
                            className={`text-sm font-semibold ${isDark ? "text-zinc-100" : "text-gray-900"}`}
                          >
                            {user.name}
                          </p>
                          <p
                            className={`text-xs capitalize ${isDark ? "text-zinc-500" : "text-gray-400"}`}
                          >
                            {user.role}
                          </p>
                        </div>

                        <Link
                          href="/user/dashboard/profile"
                          className={`flex items-center space-x-2 px-4 py-2.5 text-sm transition-colors ${
                            isDark
                              ? "text-zinc-300 hover:bg-zinc-800/50 hover:text-white"
                              : "text-gray-600 hover:bg-gray-50 hover:text-black"
                          }`}
                        >
                          <FiUser
                            className={
                              isDark ? "text-zinc-500" : "text-gray-400"
                            }
                          />
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
                          className={`flex items-center space-x-2 px-4 py-2.5 text-sm transition-colors ${
                            isDark
                              ? "text-zinc-300 hover:bg-zinc-800/50 hover:text-white"
                              : "text-gray-600 hover:bg-gray-50 hover:text-black"
                          }`}
                        >
                          <FiLayout
                            className={
                              isDark ? "text-zinc-500" : "text-gray-400"
                            }
                          />
                          <span>Workspace</span>
                        </Link>

                        <hr
                          className={
                            isDark
                              ? "border-zinc-800 my-1"
                              : "border-gray-50 my-1"
                          }
                        />

                        <button
                          onClick={handleLogout}
                          className={`w-full flex items-center space-x-2 px-4 py-2.5 text-sm transition-colors text-left ${
                            isDark
                              ? "text-red-400 hover:bg-red-950/20"
                              : "text-red-600 hover:bg-red-50/50"
                          }`}
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
                  className={`text-sm font-semibold px-4 py-2 transition-colors ${
                    isDark
                      ? "text-zinc-300 hover:text-white"
                      : "text-gray-600 hover:text-black"
                  }`}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className={`text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200 shadow-sm active:scale-95 ${
                    isDark
                      ? "bg-white text-zinc-950 hover:bg-zinc-100"
                      : "bg-black text-white hover:bg-gray-900"
                  }`}
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* RESPONSIVE MOBILE TRIGGER CONTROLLER */}
          <div className="flex md:hidden items-center">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-xl transition-colors focus:outline-none ${
                isDark
                  ? "text-zinc-400 hover:bg-zinc-900 active:bg-zinc-800"
                  : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
              }`}
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
            className={`md:hidden border-t overflow-hidden ${
              isDark
                ? "border-zinc-900 bg-zinc-950"
                : "border-gray-100 bg-white"
            }`}
          >
            <div className="px-4 pt-2 pb-6 space-y-3 shadow-inner">
              <Link
                href="/"
                className={`block py-3 px-3 text-base font-medium rounded-xl ${
                  isDark
                    ? "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                    : "text-gray-700 hover:bg-gray-50 hover:text-black"
                }`}
              >
                Home
              </Link>
              <Link
                href="/tickets"
                className={`block py-2.5 px-3 text-base font-medium rounded-xl ${
                  isDark
                    ? "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                    : "text-gray-700 hover:bg-gray-50 hover:text-black"
                }`}
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
                  className={`block py-2.5 px-3 text-base font-medium rounded-xl ${
                    isDark
                      ? "text-zinc-300 hover:bg-zinc-900 hover:text-white"
                      : "text-gray-700 hover:bg-gray-50 hover:text-black"
                  }`}
                >
                  Dashboard
                </Link>
              )}

              <hr
                className={
                  isDark ? "border-zinc-900 my-2" : "border-gray-100 my-2"
                }
              />

              {user ? (
                <div className="space-y-2 pt-2">
                  <div className="flex items-center space-x-3 px-3 py-1.5">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold uppercase text-sm ${
                        isDark
                          ? "bg-white text-zinc-950"
                          : "bg-black text-white"
                      }`}
                    >
                      {user.name?.charAt(0)}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-bold leading-tight ${isDark ? "text-zinc-100" : "text-gray-900"}`}
                      >
                        {user.name}
                      </p>
                      <p
                        className={`text-xs capitalize ${isDark ? "text-zinc-500" : "text-gray-400"}`}
                      >
                        {user.role}
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/user/dashboard/profile"
                    className={`flex items-center space-x-2 py-2.5 px-3 text-base font-medium rounded-xl ${
                      isDark
                        ? "text-zinc-300 hover:bg-zinc-900"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    <FiUser /> <span>My Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className={`w-full flex items-center space-x-2 py-2.5 px-3 text-base font-medium rounded-xl text-left ${
                      isDark
                        ? "text-red-400 hover:bg-red-950/20"
                        : "text-red-600 hover:bg-red-50/50"
                    }`}
                  >
                    <FiLogOut /> <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    href="/auth/signin"
                    className={`w-full text-center py-2.5 text-sm font-semibold rounded-xl ${
                      isDark
                        ? "border border-zinc-800 text-zinc-300 hover:bg-zinc-900"
                        : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className={`w-full text-center py-2.5 text-sm font-semibold rounded-xl ${
                      isDark
                        ? "bg-white text-zinc-950 hover:bg-zinc-100"
                        : "bg-black text-white hover:bg-gray-900"
                    }`}
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
