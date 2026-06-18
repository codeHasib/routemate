import { NextResponse } from "next/server";
import { stripe } from "../../../lib/stripe";

export async function POST(req) {
  try {
    const body = await req.json();
    const { ticketTitle, amount, quantity, bookingId } = body;

    // Fallback: Extract the origin dynamically if env is missing
    const fallbackOrigin = new URL(req.url).origin;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || fallbackOrigin;

    // Convert amount to the smallest currency unit (Stripe expects Poisha for BDT, so amount * 100)
    const unitAmount = Math.round(amount * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "bdt", // ✨ FIXED: Changed from 'usd' to 'bdt'
            product_data: {
              name: ticketTitle,
            },
            unit_amount: unitAmount,
          },
          quantity: quantity,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/user/dashboard/my-bookings`,
      metadata: {
        bookingId: bookingId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Session Creation Failure:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
