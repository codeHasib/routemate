import { NextResponse } from "next/server";
import { stripe } from "../../../../lib/stripe";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing target session reference identifier" },
        { status: 400 },
      );
    }

    // Pull verified data straight from Stripe's registers
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    return NextResponse.json({
      success: true,
      bookingId: session.metadata?.bookingId,
      paymentIntentId: session.payment_intent,
      paymentStatus: session.payment_status,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
