"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiUser,
  FiCalendar,
  FiCreditCard,
  FiLogOut,
  FiX,
} from "react-icons/fi";
import { RiRouteLine } from "react-icons/ri";
import { motion, AnimatePresence } from "framer-motion";

function SidebarContent({ setIsOpen, onLogout }) {
  const pathname = usePathname();
  const routes = [
    { name: "Profile", path: "/user/dashboard/profile", icon: FiUser },
    {
      name: "My Bookings",
      path: "/user/dashboard/my-bookings",
      icon: FiCalendar,
    },
    {
      name: "Transactions",
      path: "/user/dashboard/transactions",
      icon: FiCreditCard,
    },
  ];

  return (
    <div className="h-full flex flex-col bg-slate-950 text-gray-400 font-sans border-r border-slate-800 rounded-4xl">
      <div className="p-6 border-b border-slate-900 flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold">
            <RiRouteLine />
          </div>
          <span className="text-white font-bold tracking-tight">Routemate</span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden text-gray-400"
        >
          <FiX />
        </button>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        {routes.map((route) => {
          const isActive = pathname === route.path;
          return (
            <Link
              key={route.path}
              href={route.path}
              onClick={() => setIsOpen(false)}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20"
                  : "hover:bg-slate-900 hover:text-white"
              }`}
            >
              <route.icon
                className={isActive ? "text-white" : "text-gray-500"}
              />
              <span>{route.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-900">
        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 transition-colors"
        >
          <FiLogOut /> <span>Back to homepage</span>
        </button>
      </div>
    </div>
  );
}

export default function UserSidebar({ isOpen, setIsOpen, onLogout }) {
  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:block w-full h-[600px]">
        <SidebarContent setIsOpen={setIsOpen} onLogout={onLogout} />
      </aside>

      {/* Mobile Drawer with Motion */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="md:hidden fixed inset-0 z-50"
          >
            <div
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="absolute top-0 left-0 w-72 h-full bg-slate-950"
            >
              <SidebarContent setIsOpen={setIsOpen} onLogout={onLogout} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
