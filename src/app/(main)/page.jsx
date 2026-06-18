import FeaturedTickets from "@/components/FeaturedTickets";
import Hero from "@/components/Hero";
import LatestTickets from "@/components/LatestTickets";
import PopularRoutes from "@/components/PopularRoutes";
import WhyChooseUs from "@/components/WhyChooseUs";
async function getFeaturedTickets() {
  try {
    // Server-to-server dynamic network call
    const res = await fetch(
      `${process.env.API_URL}/api/public/tickets/featured`,
      {
        cache: "no-store", // Keep inventory allocations fully real-time
      },
    );

    if (!res.ok) return [];
    const json = await res.ok ? await res.json() : null;
    return json?.success ? json.data : [];
  } catch (error) {
    console.error("Express API connection refused:", error.message);
    return []; // Return empty array fallback to prevent build crashes
  }
}

async function getLatestTickets() {
  try {
    // Calling your public tickets route
    const res = await fetch(`${process.env.API_URL}/api/public/tickets`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const json = await res.json();

    if (json?.success && Array.isArray(json.data)) {
      // Sort on the server to ensure newest items always sit at the top, then slice to 6-8 items
      return json.data
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8); // Limits layout strictly to maximum 8 cards
    }
    return [];
  } catch (error) {
    console.error("Latest API error:", error.message);
    return [];
  }
}

export default async function Home() {
  const [featuredTickets, latestTickets] = await Promise.all([
    getFeaturedTickets(),
    getLatestTickets(),
  ]);
  return (
    <>
      <Hero />
      <FeaturedTickets tickets={featuredTickets} />
      <PopularRoutes />
      <LatestTickets tickets={latestTickets} />
      <WhyChooseUs />
    </>
  );
}
