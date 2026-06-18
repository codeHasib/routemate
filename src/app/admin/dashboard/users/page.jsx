// app/admin/dashboard/users/page.jsx
"use client";

import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import {
  FiUsers,
  FiShield,
  FiUserPlus,
  FiAlertTriangle,
  FiLoader,
  FiSearch,
  FiRefreshCw,
} from "react-icons/fi";

export default function ManageUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [actioningId, setActioningId] = useState(null);

  // 1. YOUR EXACT REQUIRED TOKEN STORAGE ARCHITECTURE
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function fetchToken() {
      const { data } = await authClient.token();
      setToken(data.token);
    }
    fetchToken();
  }, []);

  // Fetch all user accounts from your database
  const fetchUsers = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch(`http://localhost:5000/api/admin/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok)
        throw new Error("Could not fetch the registered users list.");

      const data = await res.json();
      setUsers(data.users || data);
    } catch (err) {
      setError(err.message || "An issue occurred while collecting user logs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  // ACTION 1: Change profile role hierarchy using your standard /manage-role route
  const handleUpdateRole = async (targetUserId, newRole) => {
    if (!token) return;
    setActioningId(targetUserId);
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch(`http://localhost:5000/api/admin/manage-role`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ targetUserId, newRole }),
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(
          data.message || "Failed to update account permissions.",
        );
      }

      setSuccessMessage(
        data.message || `Account changed to ${newRole} status.`,
      );

      // Update interface state instantly
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === targetUserId ? { ...user, role: newRole } : user,
        ),
      );
    } catch (err) {
      setError(
        err.message || "An error occurred while modifying account rules.",
      );
    } finally {
      setActioningId(null);
    }
  };

  // ACTION 2: Flag vendor as fraud and quarantine assets using your /mistrust-operator route
  const handleMarkAsFraud = async (targetUserId) => {
    if (!token) return;
    const confirmAction = confirm(
      "Are you completely sure you want to mark this vendor as fraudulent? This will immediately strip their credentials and hide all of their travel tickets.",
    );
    if (!confirmAction) return;

    setActioningId(targetUserId);
    setError("");
    setSuccessMessage("");

    try {
      const res = await fetch(
        `http://localhost:5000/api/admin/mistrust-operator`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ targetUserId }),
        },
      );

      const data = await res.json();

      if (!res.ok || data.success === false) {
        throw new Error(
          data.message || "Failed to finalize restriction parameters.",
        );
      }

      setSuccessMessage(
        "Vendor account flagged as fraud. Access revoked and all listings hidden.",
      );

      // Update local state to reflect role fallback demotion to standard "user" status
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === targetUserId ? { ...user, role: "user" } : user,
        ),
      );
    } catch (err) {
      setError(
        err.message || "An issue occurred while enforcing security block.",
      );
    } finally {
      setActioningId(null);
    }
  };

  // Real-time keyword filter mapping logic
  const filteredUsers = users.filter((user) => {
    const searchTarget =
      `${user.name} ${user.email} ${user.role}`.toLowerCase();
    return searchTarget.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl flex items-center space-x-2">
            <FiUsers className="text-slate-800" />
            <span>Manage Users</span>
          </h1>
          <p className="text-xs text-slate-400 font-light mt-0.5">
            Monitor accounts, adjust permission levels, or restrict fraudulent
            vendors across the platform.
          </p>
        </div>

        <button
          onClick={fetchUsers}
          disabled={loading || !token}
          className="inline-flex items-center space-x-2 px-3.5 py-2 bg-white border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 transition-all shadow-xs disabled:opacity-50"
        >
          <FiRefreshCw className={`text-xs ${loading ? "animate-spin" : ""}`} />
          <span>Refresh List</span>
        </button>
      </div>

      {/* FILTER CONTROL BAR */}
      <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-xs flex items-center">
        <div className="relative w-full max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <FiSearch className="text-sm" />
          </div>
          <input
            type="text"
            placeholder="Search by user name, email address, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium placeholder-slate-400 focus:outline-none focus:border-black focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* REACTION POPUPS */}
      {error && (
        <div className="p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-medium flex items-center space-x-2">
          <FiAlertTriangle className="text-sm shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-800 text-xs font-semibold flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* PRIMARY DATA MATRIX */}
      <div className="bg-white border border-slate-100 rounded-2xl shadow-xs overflow-hidden">
        {loading && !users.length ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <FiLoader className="text-xl text-black animate-spin mb-2" />
            <span className="text-[10px] font-bold uppercase tracking-wider">
              Loading user directory...
            </span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs font-medium">
            No registered users were found matching your current parameters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <th className="py-3 px-4">User Details</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Account Role</th>
                  <th className="py-3 px-4 text-right">
                    Administrative System Tools
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    {/* NAME */}
                    <td className="py-4 px-4 font-bold text-slate-900">
                      {user.name}
                    </td>

                    {/* EMAIL */}
                    <td className="py-4 px-4 font-mono text-slate-500 font-light">
                      {user.email}
                    </td>

                    {/* ROLE BADGES */}
                    <td className="py-4 px-4">
                      {user.role === "admin" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-950 text-white border border-slate-900">
                          Administrator
                        </span>
                      )}
                      {user.role === "vendor" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Vendor Partner
                        </span>
                      )}
                      {user.role === "user" && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                          General User
                        </span>
                      )}
                    </td>

                    {/* ACTIONS BAR CONTAINER */}
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* MAKE ADMIN ACTION BUTTON */}
                        <button
                          onClick={() => handleUpdateRole(user._id, "admin")}
                          disabled={
                            actioningId !== null || user.role === "admin"
                          }
                          className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all shadow-xs ${
                            user.role === "admin"
                              ? "bg-slate-50 text-slate-300 border border-slate-100 pointer-events-none shadow-none"
                              : "bg-black text-white hover:bg-slate-900 active:scale-95 disabled:opacity-40"
                          }`}
                        >
                          <FiShield className="text-xs" />
                          <span>Make Admin</span>
                        </button>

                        {/* MAKE VENDOR ACTION BUTTON */}
                        <button
                          onClick={() => handleUpdateRole(user._id, "vendor")}
                          disabled={
                            actioningId !== null || user.role === "vendor"
                          }
                          className={`inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all shadow-xs ${
                            user.role === "vendor"
                              ? "bg-slate-50 text-slate-300 border-slate-100 pointer-events-none shadow-none"
                              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 active:scale-95 disabled:opacity-40"
                          }`}
                        >
                          <FiUserPlus className="text-xs" />
                          <span>Make Vendor</span>
                        </button>

                        {/* CRITICAL CONDITIONAL RENDER: MARK AS FRAUD (VENDORS ONLY) */}
                        {user.role === "vendor" && (
                          <button
                            onClick={() => handleMarkAsFraud(user._id)}
                            disabled={actioningId !== null}
                            className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold bg-red-50 border border-red-100 text-red-600 hover:bg-red-100 transition-all shadow-xs active:scale-95 disabled:opacity-40"
                            title="Flag vendor account for fraud and quarantine resources"
                          >
                            <FiAlertTriangle className="text-xs animate-pulse" />
                            <span>Mark as Fraud</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
