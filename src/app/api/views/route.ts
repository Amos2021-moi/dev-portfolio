import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, id } = body;

    if (!type || !id) {
      return NextResponse.json({ error: "Type and id required" }, { status: 400 });
    }

    if (type === "project") {
      const project = await prisma.project.update({
        where: { id },
        data: { views: { increment: 1 } },
        select: { views: true },
      });
      return NextResponse.json({ views: project.views });
    }

    if (type === "blog") {
      const post = await prisma.blogPost.update({
        where: { id },
        data: { views: { increment: 1 } },
        select: { views: true },
      });
      return NextResponse.json({ views: post.views });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error) {
    console.error("View counter error:", error);
    return NextResponse.json({ error: "Failed to update views" }, { status: 500 });
  }
}