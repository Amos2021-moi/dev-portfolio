import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-03-25.dahlia",
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, donorName, message } = body;

    if (!amount || amount < 1) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency || "usd",
            product_data: {
              name: "Support Mark Osiemo",
              description: message
                ? "Message: " + message
                : "Thank you for supporting my work!",
              images: ["https://avatars.githubusercontent.com/u/187047991?v=4"],
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: process.env.NEXTAUTH_URL + "/donate/success",
      cancel_url: process.env.NEXTAUTH_URL + "/donate/cancel",
      metadata: {
        donorName: donorName || "Anonymous",
        message: message || "",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return NextResponse.json(
      { error: "Failed to create payment session" },
      { status: 500 }
    );
  }
}