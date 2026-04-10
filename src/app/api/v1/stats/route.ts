import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { rateLimit } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest): Promise<NextResponse> {
  // Ensure rateLimit is handled correctly
  const limitedResponse = await rateLimit(request, {
    limit: 20,
    windowMs: 60 * 1000,
  });

  if (limitedResponse instanceof NextResponse) {
    return limitedResponse;
  }

  try {
    const [
      totalProjects,
      totalPosts,
      totalViews,
      totalSubscribers,
      totalLikesResult,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.blogPost.count({ where: { published: true } }),
      prisma.analytics.count({ where: { event: "page_view" } }),
      prisma.subscriber.count({ where: { subscribed: true } }),
      prisma.project.aggregate({ _sum: { likes: true } }),
    ]);

    return NextResponse.json(
      {
        projects: totalProjects,
        blogPosts: totalPosts,
        pageViews: totalViews,
        subscribers: totalSubscribers,
        totalLikes: totalLikesResult._sum.likes || 0,
        generatedAt: new Date().toISOString(),
      },
      {
        status: 200,
        headers: { 
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "no-store, max-age=0"
        },
      }
    );
  } catch (error) {
    console.error("Stats API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" }, 
      { status: 500 }
    );
  }
}