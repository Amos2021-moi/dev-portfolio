import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendNewsletterConfirmation } from "@/lib/emails";
import { rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const subscribers = await prisma.subscriber.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(subscribers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, {
    limit: 2,
    windowMs: 60 * 1000,
    message: "Too many subscription attempts. Please wait before trying again.",
  });
  if (limited) return limited;

  try {
    const body = await request.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const existing = await prisma.subscriber.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Already subscribed" }, { status: 400 });
    }

    const subscriber = await prisma.subscriber.create({
      data: { email, name: name || "" },
    });

    await sendNewsletterConfirmation({ email });

    return NextResponse.json(subscriber, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}