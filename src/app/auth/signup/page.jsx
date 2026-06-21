// app/auth/signup/page.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useTheme } from "@/context/ThemeContext"; // Adjust this path to your custom theme context
import GoogleLoginButton from "@/components/GoogleLoginButton";
import {
  FiUser,
  FiMail,
  FiLock,
  FiImage,
  FiLoader,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { RiRouteLine } from "react-icons/ri";

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Pull theme state from your custom context hook
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Real-time password verification states
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState({
    label: "",
    color: "text-gray-400",
    bg: "bg-gray-200",
    width: "w-0",
  });

  // Evaluation hook for live password strength auditing
  useEffect(() => {
    if (!password) {
      setStrength({
        label: "",
        color: "text-gray-400",
        bg: "bg-gray-200",
        width: "w-0",
      });
      return;
    }

    const hasLetter = /[a-zA-Z]/.test(password);
    const hasSpecial = /[^a-zA-Z0-9]/.test(password);
    const isMinLength = password.length >= 8;

    if (!isMinLength) {
      setStrength({
        label: "Too Short (Min 8 characters)",
        color: "text-red-500",
        bg: "bg-red-500",
        width: "w-1/3",
      });
    } else if (!hasLetter || !hasSpecial) {
      setStrength({
        label: "Weak (Add letters & special chars)",
        color: "text-amber-500",
        bg: "bg-amber-500",
        width: "w-2/3",
      });
    } else {
      setStrength({
        label: "Strong Password",
        color: "text-emerald-500",
        bg: "bg-emerald-500",
        width: "w-full",
      });
    }
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");

    const formData = new FormData(e.target);
    const userInfo = Object.fromEntries(formData.entries());

    // Front-end sanity check bypass protection
    if (
      password.length < 8 ||
      !/[a-zA-Z]/.test(password) ||
      !/[^a-zA-Z0-9]/.test(password)
    ) {
      setErrorMessage(
        "Please ensure your password meets the minimum security requirements.",
      );
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await authClient.signUp.email({
        name: userInfo.name,
        email: userInfo.email,
        password: password,
        image: userInfo.imageUrl || undefined, // Captures optional avatar URL mapping
      });

      if (error) {
        setErrorMessage(
          error.message || "Failed to establish authorization records.",
        );
        setLoading(false);
      } else if (data) {
        setSuccessMessage(
          "Account created successfully! Redirecting to login space...",
        );
        setTimeout(() => {
          router.push("/");
        }, 2000);
      }
    } catch (err) {
      setErrorMessage("An unexpected network interruption occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] w-full flex items-center justify-center px-4 py-12 font-sans transition-colors duration-300">
      <div className="w-full max-w-md space-y-6">
        {/* BRAND IDENTITY HEADER */}
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
            Create your account
          </h1>
          <p
            className={`text-sm font-light mt-1 transition-colors duration-300 ${
              isDark ? "text-zinc-400" : "text-gray-500"
            }`}
          >
            Join our premium transit reservation engine
          </p>
        </div>

        {/* INTERACTIVE FORM CONTAINER */}
        <div
          className={`p-6 sm:p-8 rounded-2xl border transition-all duration-300 ${
            isDark
              ? "bg-zinc-900 border-zinc-800/80 shadow-2xl shadow-black/40"
              : "bg-white border-gray-100 shadow-xl shadow-slate-100/50"
          }`}
        >
          {/* STATE ALERTS */}
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

          {successMessage && (
            <div
              className={`mb-5 p-3.5 border rounded-xl text-xs font-medium flex items-start space-x-2 animate-fadeIn transition-colors duration-300 ${
                isDark
                  ? "bg-emerald-950/40 border-emerald-900/60 text-emerald-400"
                  : "bg-emerald-50 border-emerald-100 text-emerald-700"
              }`}
            >
              <FiCheckCircle className="text-sm shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* FULL NAME */}
            <div>
              <label
                className={`block text-xs font-bold uppercase tracking-wider mb-1.5 transition-colors duration-300 ${
                  isDark ? "text-zinc-500" : "text-gray-400"
                }`}
              >
                Full Name
              </label>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-300 ${
                    isDark ? "text-zinc-500" : "text-gray-400"
                  }`}
                >
                  <FiUser className="text-base" />
                </div>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
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

            {/* EMAIL ADDRESS */}
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

            {/* OPTIONAL PROFILE IMAGE URL LAYER */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label
                  className={`block text-xs font-bold uppercase tracking-wider transition-colors duration-300 ${
                    isDark ? "text-zinc-500" : "text-gray-400"
                  }`}
                >
                  Avatar Image URL
                </label>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded transition-colors duration-300 ${
                    isDark
                      ? "bg-zinc-800 text-zinc-400"
                      : "bg-slate-100 text-gray-500"
                  }`}
                >
                  Optional
                </span>
              </div>
              <div className="relative">
                <div
                  className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-300 ${
                    isDark ? "text-zinc-500" : "text-gray-400"
                  }`}
                >
                  <FiImage className="text-base" />
                </div>
                <input
                  type="url"
                  name="imageUrl"
                  placeholder="https://images.com/avatar.jpg"
                  disabled={loading}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium transition-all focus:outline-none focus:ring-1 disabled:opacity-60 ${
                    isDark
                      ? "bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:border-white focus:ring-white/20"
                      : "bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-black focus:ring-black/20"
                  }`}
                />
              </div>
            </div>

            {/* PASSWORD ENGINE LAYER */}
            <div>
              <label
                className={`block text-xs font-bold uppercase tracking-wider mb-1.5 transition-colors duration-300 ${
                  isDark ? "text-zinc-500" : "text-gray-400"
                }`}
              >
                Choose Password
              </label>
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

              {/* LIVE PASSWORD AUDITING BAR & TEXT */}
              {password && (
                <div className="mt-2.5 space-y-1.5 animate-fadeIn">
                  <div className="flex justify-between items-center text-[11px] font-medium">
                    <span
                      className={isDark ? "text-zinc-500" : "text-gray-400"}
                    >
                      Security Index:
                    </span>
                    <span
                      className={`font-bold tracking-tight ${strength.color}`}
                    >
                      {strength.label}
                    </span>
                  </div>
                  <div
                    className={`w-full h-1 rounded-full overflow-hidden transition-colors duration-300 ${
                      isDark ? "bg-zinc-950" : "bg-gray-100"
                    }`}
                  >
                    <div
                      className={`h-full ${strength.bg} ${strength.width} transition-all duration-300`}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SUBMIT EXECUTION BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-3 inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-sm ${
                isDark
                  ? "bg-white text-black hover:bg-zinc-100 shadow-white/5"
                  : "bg-black text-white hover:bg-gray-900"
              }`}
            >
              {loading ? (
                <FiLoader className="text-base animate-spin" />
              ) : (
                "Create Free Account"
              )}
            </button>
          </form>

          {/* OAUTH HORIZONTAL SEPARATOR */}
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

          <GoogleLoginButton isLoading={loading} />
        </div>

        {/* LOG IN BACK-LINK DIRECTIONAL ELEMENT */}
        <p
          className={`text-center text-sm font-light transition-colors duration-300 ${
            isDark ? "text-zinc-400" : "text-gray-500"
          }`}
        >
          Already have a route credential?{" "}
          <Link
            href="/auth/signin"
            className={`font-semibold hover:underline transition-colors duration-300 ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
}
