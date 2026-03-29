import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, event } = body;

    if (!page || !event) {
      return NextResponse.json({ error: "Page and event required" }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") || "";
    const device = userAgent.includes("Mobile") ? "mobile" : "desktop";

    await prisma.analytics.create({
      data: {
        page,
        event,
        device,
        data: body.data || {},
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to track" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const now = new Date();
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const today = new Date(now.setHours(0, 0, 0, 0));

    const [total, last30, last7, todayCount, pageViews, devices] =
      await Promise.all([
        prisma.analytics.count({ where: { event: "page_view" } }),
        prisma.analytics.count({
          where: { event: "page_view", createdAt: { gte: last30Days } },
        }),
        prisma.analytics.count({
          where: { event: "page_view", createdAt: { gte: last7Days } },
        }),
        prisma.analytics.count({
          where: { event: "page_view", createdAt: { gte: today } },
        }),
        prisma.analytics.groupBy({
          by: ["page"],
          where: { event: "page_view" },
          _count: { page: true },
          orderBy: { _count: { page: "desc" } },
          take: 10,
        }),
        prisma.analytics.groupBy({
          by: ["device"],
          where: { event: "page_view" },
          _count: { device: true },
        }),
      ]);

    return NextResponse.json({
      total,
      last30Days: last30,
      last7Days: last7,
      today: todayCount,
      topPages: pageViews.map((p) => ({
        page: p.page,
        views: p._count.page,
      })),
      devices: devices.map((d) => ({
        device: d.device || "unknown",
        count: d._count.device,
      })),
    });
  } catch (error) {
    console.error("Analytics GET error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}