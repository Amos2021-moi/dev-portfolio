import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, {
    limit: 30,
    windowMs: 60 * 1000,
  });
  if (limited) return limited;

  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");
    const limit = Math.min(parseInt(searchParams.get("limit") || "10"), 50);
    const page = Math.max(parseInt(searchParams.get("page") || "1"), 1);

    const where: Record<string, unknown> = { published: true };
    if (tag) where.tags = { has: tag };

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          tags: true,
          readingTime: true,
          views: true,
          featured: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      data: posts,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    }, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}