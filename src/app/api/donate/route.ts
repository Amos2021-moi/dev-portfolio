import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendContactNotification } from "@/lib/emails";
import { rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const messages = await prisma.analytics.findMany({
      where: { event: "contact_message" },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Contact GET error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const limited = rateLimit(request, {
    limit: 3,
    windowMs: 60 * 1000,
    message: "Too many messages sent. Please wait a minute before trying again.",
  });
  if (limited) return limited;

  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required" },
        { status: 400 }
      );
    }

    const entry = await prisma.analytics.create({
      data: {
        page: "contact",
        event: "contact_message",
        data: { name, email, subject, message },
      },
    });

    await sendContactNotification({
      name,
      email,
      subject: subject || "No subject",
      message,
    });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.error("Contact POST error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}