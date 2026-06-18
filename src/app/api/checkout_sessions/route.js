import { NextResponse } from "next/server";
import { stripe } from "../../../lib/stripe";

export async function POST(req) {
  try {
    const body = await req.json();
    const { ticketTitle, amount, quantity, bookingId } = body;

    // Convert amount to cents (Stripe requirement)
    const unitAmount = Math.round(amount * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd", // Change to your currency (e.g., 'bdt')
            product_data: {
              name: ticketTitle,
            },
            unit_amount: unitAmount,
          },
          quantity: quantity,
        },
      ],
      mode: "payment",
      // Pass the bookingId so you can update your database in the webhook
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/user/dashboard/my-bookings`,
      metadata: {
        bookingId: bookingId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}