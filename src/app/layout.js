import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ThemeProvider } from "@/context/ThemeContext";

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
      <body className="">
        <ThemeProvider>
          <div>
            <Navbar />
            <main className="w-full">{children}</main>
          </div>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
