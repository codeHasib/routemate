// components/GoogleLoginButton.jsx
"use client";

import { authClient } from "@/lib/auth-client";
import { FcGoogle } from "react-icons/fc";

export default function GoogleLoginButton({ isLoading }) {
  const handleGoogleClick = () => {
    const signIn = async () => {
      const data = await authClient.signIn.social({
        provider: "google",
      });
    };
    signIn();
  };

  return (
    <button
      type="button"
      onClick={handleGoogleClick}
      disabled={isLoading}
      className="w-full inline-flex items-center justify-center space-x-2.5 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none shadow-sm"
    >
      <FcGoogle className="text-lg shrink-0" />
      <span>Continue with Google</span>
    </button>
  );
}
