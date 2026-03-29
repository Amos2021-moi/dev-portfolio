import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === "clear_analytics") {
      await prisma.analytics.deleteMany({
        where: { event: "page_view" },
      });
      return NextResponse.json({
        success: true,
        message: "Analytics cleared",
      });
    }

    if (action === "clear_messages") {
      await prisma.analytics.deleteMany({
        where: { event: "contact_message" },
      });
      return NextResponse.json({
        success: true,
        message: "Messages cleared",
      });
    }

    if (action === "clear_subscribers") {
      await prisma.subscriber.deleteMany({});
      return NextResponse.json({
        success: true,
        message: "Subscribers cleared",
      });
    }

    return NextResponse.json(
      { error: "Invalid action" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Danger action error:", error);
    return NextResponse.json(
      { error: "Action failed" },
      { status: 500 }
    );
  }
}