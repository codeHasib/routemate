// app/signin/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/context/ThemeContext"; // Adjust this path to your custom theme context
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { FiMail, FiLock, FiLoader, FiAlertCircle } from "react-icons/fi";
import { RiRouteLine } from "react-icons/ri";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // Pull theme state from your custom context hook
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    const formData = new FormData(e.target);
    const userInfo = Object.fromEntries(formData.entries());

    try {
      const { data, error } = await authClient.signIn.email({
        email: userInfo.email,
        password: userInfo.password,
        callbackURL: "/",
      });

      if (error) {
        setErrorMessage(error.message || "Invalid authentication credentials.");
      } else if (data) {
        console.log("Session authenticated successfully:", data);
        router.push("/");
      }
    } catch (err) {
      setErrorMessage("An unexpected network interruption occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center px-4 py-12 font-sans transition-colors duration-300">
      <div className="w-full max-w-md space-y-6">
        {/* BRAND SYMBOL ENTRY */}
        <div className="text-center">
          <div
            className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-4 shadow-md transition-all duration-300 ${
              isDark ? "bg-white text-black" : "bg-black text-white"
            }`}
          >
            <RiRouteLine className="text-2xl" />
          </div>
          <h1
            className={`text-2xl font-extrabold tracking-tight transition-colors duration-300 ${
              isDark ? "text-zinc-100" : "text-gray-900"
            }`}
          >
            Welcome back
          </h1>
          <p
            className={`text-sm font-light mt-1 transition-colors duration-300 ${
              isDark ? "text-zinc-400" : "text-gray-500"
            }`}
          >
            Access your secure dashboard workspace
          </p>
        </div>

        {/* AUTH ARCHITECTURE HOUSING CARD */}
        <div
          className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
            isDark
              ? "bg-zinc-900 border-zinc-800/80 shadow-2xl shadow-black/40"
              : "bg-white border-gray-100 shadow-xl shadow-slate-100/50"
          }`}
        >
          {/* FEEDBACK PROMPT BOX */}
          {errorMessage && (
            <div
              className={`mb-5 p-3.5 border rounded-xl text-xs font-medium flex items-start space-x-2 animate-fadeIn transition-colors duration-300 ${
                isDark
                  ? "bg-red-950/40 border-red-900/60 text-red-400"
                  : "bg-red-50 border-red-100 text-red-700"
              }`}
            >
              <FiAlertCircle className="text-sm shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* EMAIL LAYER */}
            <div>
              <label
                className={`block text-xs font-bold uppercase tracking-wider mb-1.5 transition-colors duration-300 ${
                  isDark ? "text-zinc-500" : "text-gray-400"
                }`}
              >
                Email Address
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-300 ${
                    isDark ? "text-zinc-500" : "text-gray-400"
                  }`}
                >
                  <FiMail className="text-base" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  required
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-1 disabled:opacity-60 ${
                    isDark
                      ? "bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:border-white focus:ring-white/20"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-black/20"
                  }`}
                />
              </div>
            </div>

            {/* PASSWORD LAYER */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  className={`block text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                    isDark ? "text-zinc-500" : "text-gray-400"
                  }`}
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-300 ${
                    isDark ? "text-zinc-500" : "text-gray-400"
                  }`}
                >
                  <FiLock className="text-base" />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-1 disabled:opacity-60 ${
                    isDark
                      ? "bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:border-white focus:ring-white/20"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-black/20"
                  }`}
                />
              </div>
            </div>

            {/* STRATEGIC TRIGGER ATOM BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-2 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-sm ${
                isDark
                  ? "bg-white text-black hover:bg-zinc-100 shadow-white/5"
                  : "bg-black text-white hover:bg-gray-900"
              }`}
            >
              {loading ? (
                <FiLoader className="text-base animate-spin" />
              ) : (
                "Sign In to Account"
              )}
            </button>
          </form>

          {/* VISUAL DIVIDER */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div
                className={`w-full border-t transition-colors duration-300 ${
                  isDark ? "border-zinc-800" : "border-gray-100"
                }`}
              />
            </div>
            <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
              <span
                className={`px-3 text-[10px] transition-colors duration-300 ${
                  isDark
                    ? "bg-zinc-900 text-zinc-600"
                    : "bg-white text-gray-300"
                }`}
              >
                Or continue with
              </span>
            </div>
          </div>

          {/* ISOLATED COMPONENT INTEGRATION */}
          <GoogleLoginButton isLoading={loading} />
        </div>

        {/* SUBFOOTER DIRECTION ROUTING LINK */}
        <p
          className={`text-center text-sm font-light transition-colors duration-300 ${
            isDark ? "text-zinc-400" : "text-gray-500"
          }`}
        >
          Don&apos;t have an account yet?{" "}
          <Link
            href="/auth/signup"
            className={`font-semibold hover:underline transition-colors duration-300 ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
