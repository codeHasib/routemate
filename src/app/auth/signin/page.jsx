// app/signin/page.jsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { FiMail, FiLock, FiLoader, FiAlertCircle } from "react-icons/fi";
import { RiRouteLine } from "react-icons/ri";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

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
    <div className="min-h-[85vh] w-full flex items-center justify-center px-4 py-12 bg-white font-sans">
      <div className="w-full max-w-md space-y-6">
        {/* BRAND SYMBOL ENTRY */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-black text-white rounded-2xl mb-4 shadow-md">
            <RiRouteLine className="text-2xl" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900">
            Welcome back
          </h1>
          <p className="text-sm text-gray-500 font-light mt-1">
            Access your secure dashboard workspace
          </p>
        </div>

        {/* AUTH ARCHITECTURE HOUSING CARD */}
        <div className="bg-white border border-gray-100 p-6 sm:p-8 rounded-2xl shadow-xl shadow-slate-100/50">
          {/* FEEDBACK PROMPT BOX */}
          {errorMessage && (
            <div className="mb-5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-medium flex items-start space-x-2 animate-fadeIn">
              <FiAlertCircle className="text-sm shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* EMAIL LAYER */}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FiMail className="text-base" />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/20 transition-all disabled:opacity-60"
                />
              </div>
            </div>

            {/* PASSWORD LAYER */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <FiLock className="text-base" />
                </div>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black/20 transition-all disabled:opacity-60"
                />
              </div>
            </div>

            {/* STRATEGIC TRIGGER ATOM BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center px-4 py-2.5 bg-black text-white rounded-xl text-sm font-semibold hover:bg-gray-900 active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-sm"
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
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase font-bold tracking-widest">
              <span className="bg-white px-3 text-gray-300 text-[10px]">
                Or continue with
              </span>
            </div>
          </div>

          {/* ISOLATED COMPONENT INTEGRATION */}
          <GoogleLoginButton isLoading={loading} />
        </div>

        {/* SUBFOOTER DIRECTION ROUTING LINK */}
        <p className="text-center text-sm text-gray-500 font-light">
          Don&apos;t have an account yet?{" "}
          <Link
            href="/auth/signup"
            className="font-semibold text-black hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}
