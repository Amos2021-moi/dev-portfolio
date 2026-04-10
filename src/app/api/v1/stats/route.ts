import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const limited = rateLimit(request, {
    limit: 20,
    windowMs: 60 * 1000,
  });
  if (limited) return limited;

  try {
    const [
      totalProjects,
      totalPosts,
      totalViews,
      totalSubscribers,
      totalLikes,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.analytics.count({ where: { event: "page_view" } }),
      prisma.subscriber.count({ where: { subscribed: true } }),
      prisma.project.aggregate({ _sum: { likes: true } }),
    ]);

    return NextResponse.json({
      projects: totalProjects,
      blogPosts: totalPosts,
      pageViews: totalViews,
      subscribers: totalSubscribers,
      totalLikes: totalLikes._sum.likes || 0,
      generatedAt: new Date().toISOString(),
    }, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}