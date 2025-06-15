import { NextResponse } from "next/server";
import stripe from "@/app/lib/stripe";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  try {
    if (!sessionId) {
      return NextResponse.json(
        { message: "Missing session id" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer_details"],
    });

    return NextResponse.json(session);
  } catch (error: any) {
    console.error("Errore nel recupero sessione:", error);
    return NextResponse.json(
      {
        message: "Errore nel recupero della sessione",
        error: error instanceof Error ? error.message : error,
      },
      { status: 500 }
    );
  }
}


export async function POST(request: Request) {
  try {
    const { items } = await request.json();

    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: [item.image],
        },
        unit_amount: item.price * 100, // <-- Attenzione: unit_amount, non amout
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_URL}/checkout?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/cart`,
    });

    return NextResponse.json({ url: session.url, id: session.id });
  } catch (error) {
    return NextResponse.json({ message: "Errore interno" }, { status: 500 });
  }
}
