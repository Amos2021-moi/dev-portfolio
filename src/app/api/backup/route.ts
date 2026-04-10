import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const expectedAuth = "Bearer " + process.env.NEXTAUTH_SECRET;

    if (authHeader !== expectedAuth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      projects,
      blogPosts,
      subscribers,
      testimonials,
      comments,
    ] = await Promise.all([
      prisma.project.findMany(),
      prisma.blogPost.findMany(),
      prisma.subscriber.findMany(),
      prisma.testimonial.findMany(),
      prisma.comment.findMany(),
    ]);

    const backup = {
      exportedAt: new Date().toISOString(),
      version: "1.0",
      data: {
        projects,
        blogPosts,
        subscribers,
        testimonials,
        comments,
      },
      counts: {
        projects: projects.length,
        blogPosts: blogPosts.length,
        subscribers: subscribers.length,
        testimonials: testimonials.length,
        comments: comments.length,
      },
    };

    return new NextResponse(JSON.stringify(backup, null, 2), {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition":
          "attachment; filename=portfolio-backup-" +
          new Date().toISOString().split("T")[0] +
          ".json",
      },
    });
  } catch (error) {
    console.error("Backup error:", error);
    return NextResponse.json({ error: "Backup failed" }, { status: 500 });
  }
}