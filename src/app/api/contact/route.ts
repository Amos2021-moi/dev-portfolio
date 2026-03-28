import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendContactNotification } from "@/lib/emails";

export async function GET() {
  try {
    const messages = await prisma.analytics.findMany({
      where: { event: "contact_message" },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    await sendContactNotification({ name, email, subject: subject || "No subject", message });

    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}