import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Route Mate | Your Travel Companion",
  description:
    "Best travel companion for your next adventure. Plan, explore, and share your journeys with ease.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen flex flex-col justify-between">
        <div>
          {/* Renders globally on EVERY single page */}
          <Navbar />
          <main className="w-full">{children}</main>
        </div>
        {/* Renders globally on EVERY single footer margin */}
        <Footer />
      </body>
    </html>
  );
}
