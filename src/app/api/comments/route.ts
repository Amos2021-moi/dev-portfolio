import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get("postId");
    const projectId = searchParams.get("projectId");

    const comments = await prisma.comment.findMany({
      where: postId ? { postId } : { projectId: projectId || undefined },
      include: { author: { select: { name: true, email: true, image: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Comments GET error:", error);
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, postId, projectId, authorName, authorEmail } = body;

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Comment content is required" }, { status: 400 });
    }

    if (!postId && !projectId) {
      return NextResponse.json({ error: "Post ID or Project ID required" }, { status: 400 });
    }

    let author = await prisma.user.findUnique({
      where: { email: authorEmail || "guest@portfolio.com" },
    });

    if (!author) {
      author = await prisma.user.create({
        data: {
          name: authorName || "Anonymous",
          email: authorEmail || "guest-" + Date.now() + "@portfolio.com",
          role: "EDITOR",
        },
      });
    }

    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        authorId: author.id,
        postId: postId || null,
        projectId: projectId || null,
      },
      include: {
        author: { select: { name: true, email: true, image: true } },
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error("Comments POST error:", error);
    return NextResponse.json({ error: "Failed to post comment" }, { status: 500 });
  }
}