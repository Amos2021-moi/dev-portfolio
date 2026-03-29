import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getLocationFromIP(ip: string) {
  try {
    if (ip === "127.0.0.1" || ip === "::1" || ip.startsWith("192.168")) {
      return { country: "Local", city: "Development", region: "Local" };
    }
    const res = await fetch("http://ip-api.com/json/" + ip + "?fields=country,city,regionName,countryCode", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      country: data.country || null,
      city: data.city || null,
      region: data.regionName || null,
      countryCode: data.countryCode || null,
    };
  } catch {
    return null;
  }
}

function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const realIP = request.headers.get("x-real-ip");
  const cfIP = request.headers.get("cf-connecting-ip");

  if (cfIP) return cfIP;
  if (forwarded) return forwarded.split(",")[0].trim();
  if (realIP) return realIP;
  return "127.0.0.1";
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page, event } = body;

    if (!page || !event) {
      return NextResponse.json({ error: "Page and event required" }, { status: 400 });
    }

    const userAgent = request.headers.get("user-agent") || "";
    const device = userAgent.includes("Mobile") ? "mobile" :
      userAgent.includes("Tablet") ? "tablet" : "desktop";

    const browser =
      userAgent.includes("Chrome") ? "Chrome" :
      userAgent.includes("Firefox") ? "Firefox" :
      userAgent.includes("Safari") ? "Safari" :
      userAgent.includes("Edge") ? "Edge" : "Other";

    const ip = getClientIP(request);
    const location = await getLocationFromIP(ip);

    await prisma.analytics.create({
      data: {
        page,
        event,
        device,
        browser,
        ip,
        country: location?.country || null,
        city: location?.city || null,
        data: {
          ...body.data,
          region: location?.region || null,
          countryCode: location?.countryCode || null,
        },
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
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      total,
      last30,
      last7,
      todayCount,
      pageViews,
      devices,
      browsers,
      countries,
      cities,
      recentVisits,
    ] = await Promise.all([
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
      prisma.analytics.groupBy({
        by: ["browser"],
        where: { event: "page_view" },
        _count: { browser: true },
        orderBy: { _count: { browser: "desc" } },
      }),
      prisma.analytics.groupBy({
        by: ["country"],
        where: { event: "page_view", country: { not: null } },
        _count: { country: true },
        orderBy: { _count: { country: "desc" } },
        take: 10,
      }),
      prisma.analytics.groupBy({
        by: ["city"],
        where: { event: "page_view", city: { not: null } },
        _count: { city: true },
        orderBy: { _count: { city: "desc" } },
        take: 8,
      }),
      prisma.analytics.findMany({
        where: { event: "page_view" },
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          page: true,
          country: true,
          city: true,
          device: true,
          browser: true,
          createdAt: true,
          ip: true,
        },
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
      browsers: browsers.map((b) => ({
        browser: b.browser || "Other",
        count: b._count.browser,
      })),
      countries: countries.map((c) => ({
        country: c.country,
        count: c._count.country,
      })),
      cities: cities.map((c) => ({
        city: c.city,
        count: c._count.city,
      })),
      recentVisits: recentVisits.map((v) => ({
        page: v.page,
        country: v.country,
        city: v.city,
        device: v.device,
        browser: v.browser,
        time: v.createdAt,
        ip: v.ip ? v.ip.split(".").slice(0, 2).join(".") + ".x.x" : null,
      })),
    });
  } catch (error) {
    console.error("Analytics GET error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}