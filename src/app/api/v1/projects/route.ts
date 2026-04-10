import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, {
    limit: 30,
    windowMs: 60 * 1000,
    message: "Rate limit exceeded. Max 30 requests per minute.",
  });
  if (limited) return limited;

  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured");
    const status = searchParams.get("status");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);

    const where: Record<string, unknown> = {};
    if (featured === "true") where.featured = true;
    if (status) where.status = status.toUpperCase();

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          techStack: true,
          githubUrl: true,
          liveUrl: true,
          status: true,
          featured: true,
          views: true,
          likes: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.project.count({ where }),
    ]);

    return NextResponse.json({
      data: projects,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    }, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "X-RateLimit-Limit": "30",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}