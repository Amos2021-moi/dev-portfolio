import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { projectId } = body;

    if (!projectId) {
      return NextResponse.json({ error: "Project ID required" }, { status: 400 });
    }

    const project = await prisma.project.update({
      where: { id: projectId },
      data: { likes: { increment: 1 } },
      select: { likes: true },
    });

    return NextResponse.json({ likes: project.likes });
  } catch (error) {
    console.error("Likes error:", error);
    return NextResponse.json({ error: "Failed to like project" }, { status: 500 });
  }
}