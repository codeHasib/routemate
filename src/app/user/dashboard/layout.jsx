// app/user/dashboard/layout.jsx
"use client";
import { useState } from "react";
import UserSidebar from "@/components/UserSidebar";
import { FiMenu } from "react-icons/fi";

export default function UserDashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    /* Auth signout logic */ window.location.href = "/";
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <header className="md:hidden flex items-center justify-between bg-white p-4 rounded-2xl mb-5 border shadow-xs">
        <span className="font-bold">Routemate User</span>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 border rounded-xl"
        >
          <FiMenu />
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 items-start">
        <UserSidebar
          isOpen={sidebarOpen}
          setIsOpen={setSidebarOpen}
          onLogout={handleLogout}
        />
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
}
