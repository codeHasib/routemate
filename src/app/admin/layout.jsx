// app/admin/layout.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/AdminSidebar";
import { authClient } from "@/lib/auth-client";
import { FiMenu, FiBell, FiShield, FiLoader } from "react-icons/fi";

export default function AdminLayout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/auth/signin");
  };

  if (isPending) {
    return (
      <div className="w-full py-24 flex flex-col items-center justify-center text-gray-500">
        <FiLoader className="text-2xl text-emerald-500 animate-spin mb-2" />
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Verifying Credentials...
        </span>
      </div>
    );
  }

  // Fallback protection check
  if (!session || session.user?.role !== "admin") {
    return null; 
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* HEADER SECTION FOR ADMIN CONTROLS */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 mb-6 flex items-center justify-between shadow-xs">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-600"
          >
            <FiMenu className="text-lg" />
          </button>
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            <FiShield className="text-emerald-500 animate-pulse" />
            <span>Secure Console Connection Active</span>
          </div>
        </div>
        
        <div className="text-right leading-none hidden sm:block">
          <p className="text-xs font-bold text-slate-900">{session.user.name}</p>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5 block">Root Operator</span>
        </div>
      </div>

      {/* CORE WORKSPACE LAYER */}
      <div className="flex flex-col md:flex-row gap-6 items-start relative">
        
        {/* INLINE ADMIN SIDEBAR ENGINE */}
        {/* We use structural classes so it sits as a layout block column next to content instead of taking over the screen */}
        <div className="w-full md:w-64 shrink-0">
          <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} onLogout={handleLogout} />
        </div>

        {/* WORKSPACE ELEMENT SLOT CONTENT */}
        <div className="flex-1 w-full bg-white border border-slate-100 rounded-2xl p-6 shadow-xs min-h-[500px]">
          {children}
        </div>
      </div>
    </div>
  );
}