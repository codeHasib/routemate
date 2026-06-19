// app/vendor/dashboard/layout.jsx
"use client";

import { useState } from "react";
import VendorSidebar from "@/components/VendorSidebar";
import { FiMenu } from "react-icons/fi";
import { RiRouteLine } from "react-icons/ri";

export default function VendorDashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    // Session termination script logic goes here
    console.log("Terminating session execution tree...");
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen font-sans antialiased text-slate-900">
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
        {/* MOBILE NAVIGATION BAR HEADER */}
        <header className="flex md:hidden items-center justify-between bg-white border border-slate-200/60 p-4 rounded-2xl mb-5 shadow-xs">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 bg-black rounded-md flex items-center justify-center text-white font-bold">
              <RiRouteLine className="text-sm" />
            </div>
            <span className="text-sm font-bold tracking-tight">Routemate</span>
            <span className="text-[9px] font-bold uppercase bg-amber-50 text-amber-700 border border-amber-100 px-1.5 py-0.5 rounded-md">
              Vendor
            </span>
          </div>

          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl bg-slate-50 border border-slate-200/60 text-slate-700 hover:text-black transition-colors"
          >
            <FiMenu className="text-base" />
          </button>
        </header>

        {/* INTERACTION DESK VIEWPORT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] lg:grid-cols-[280px_1fr] gap-6 lg:gap-8 items-start">
          {/* RESPONSIVE CONTROL PANEL ELEMENT */}
          <VendorSidebar
            isOpen={sidebarOpen}
            setIsOpen={setSidebarOpen}
            onLogout={handleLogout}
          />

          {/* DYNAMIC CONTENT CONTAINER DECK */}
          <main className="min-h-[600px] w-full overflow-hidden">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
