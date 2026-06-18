// components/AdminSidebar.jsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiUser, FiUsers, FiAward, FiLogOut, FiX } from "react-icons/fi";
import { RiRouteLine } from "react-icons/ri";
import { IoTicketSharp } from "react-icons/io5";
import { authClient } from "@/lib/auth-client";

// 1. ISOLATED SIDEBAR CONTENT ARCHITECTURE
function SidebarContent({ setIsOpen, onLogout }) {
  const pathname = usePathname();
  const router = useRouter();
  async function handleSignOut() {
    await authClient.signOut();
    router.push("/");
  }

  const routes = [
    { name: "Admin Profile", path: "/admin/dashboard/profile", icon: FiUser },
    {
      name: "Manage Tickets",
      path: "/admin/dashboard/tickets",
      icon: IoTicketSharp,
    },
    { name: "Manage Users", path: "/admin/dashboard/users", icon: FiUsers },
    {
      name: "Advertise Tickets",
      path: "/admin/dashboard/advertise",
      icon: FiAward,
    },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-950 text-gray-400 border-r border-slate-900 font-sans">
      {/* BRAND PANEL AREA */}
      <div className="p-6 border-b border-slate-900 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2.5 group">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black font-bold transition-transform group-hover:scale-105 duration-300">
            <RiRouteLine className="text-lg" />
          </div>
          <span className="text-md font-bold tracking-tight text-white">
            Routemate
            <span className="text-emerald-500 font-medium text-xs ml-1.5 px-1.5 py-0.5 bg-emerald-950 rounded-md border border-emerald-900">
              Admin
            </span>
          </span>
        </Link>

        {/* MOBILE CLOSE/EXIT BUTTON */}
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-gray-400 hover:text-white transition-colors"
        >
          <FiX className="text-base" />
        </button>
      </div>

      {/* CORE NAVIGATION TRACK */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {routes.map((route) => {
          const Icon = route.icon;
          const isActive = pathname === route.path;

          return (
            <Link
              key={route.path}
              href={route.path}
              onClick={() => setIsOpen(false)} // Closes mobile drawer layout instantly
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group relative ${
                isActive
                  ? "bg-white text-black font-semibold shadow-md"
                  : "hover:bg-slate-900 hover:text-white"
              }`}
            >
              <Icon
                className={`text-base shrink-0 ${isActive ? "text-black" : "text-gray-500 group-hover:text-gray-300"}`}
              />
              <span>{route.name}</span>

              {/* UTILITY ACTIVE POINT INDICATOR */}
              {isActive && (
                <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-black" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* WORK SESSION TERMINATION HOUSING */}
      <div className="p-4 border-t border-slate-900">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors duration-200"
        >
          <FiLogOut className="text-base shrink-0" />
          <span>Exit Work Session</span>
        </button>
      </div>
    </div>
  );
}

// 2. MAIN EXPORTED RESPONSIVE WRAPPER SWITCH
export default function AdminSidebar({ isOpen, setIsOpen, onLogout }) {
  return (
    <>
      {/* DESKTOP SIDEBAR PANEL (Rendered inline inside layout flex row) */}
      <aside className="hidden md:block w-full rounded-2xl overflow-hidden h-[600px] shadow-sm">
        <SidebarContent setIsOpen={setIsOpen} onLogout={onLogout} />
      </aside>

      {/* MOBILE COLLAPSIBLE DRAWER (Triggered by Navbar Menu on Mobile Screens) */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-all duration-300 ${isOpen ? "visible" : "invisible"}`}
      >
        {/* BACKDROP BLUR MASK */}
        <div
          onClick={() => setIsOpen(false)}
          className={`absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"}`}
        />

        {/* TRANSITIONING SLIDE SHEET LAYER */}
        <div
          className={`absolute top-0 bottom-0 left-0 w-72 max-w-[80vw] transform transition-transform duration-300 ease-out h-full ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <SidebarContent setIsOpen={setIsOpen} onLogout={onLogout} />
        </div>
      </div>
    </>
  );
}
