import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug");

    if (slug) {
      const project = await prisma.project.findUnique({
        where: { slug },
        include: { category: true },
      });

      if (!project) {
        return NextResponse.json(
          { error: "Project not found" },
          { status: 404 }
        );
      }

      await prisma.project.update({
        where: { slug },
        data: { views: { increment: 1 } },
      });

      return NextResponse.json(project);
    }

    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error("Projects GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      description,
      content,
      techStack,
      githubUrl,
      liveUrl,
      status,
      featured,
      images,
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    const slug = slugify(title);
    const existing = await prisma.project.findUnique({ where: { slug } });
    const finalSlug = existing ? slug + "-" + Date.now() : slug;

    const project = await prisma.project.create({
      data: {
        title,
        slug: finalSlug,
        description,
        content: content || "",
        techStack: techStack || [],
        githubUrl: githubUrl || "",
        liveUrl: liveUrl || "",
        status: status || "ACTIVE",
        featured: featured || false,
        images: images || [],
        authorId: "default-author",
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Projects POST error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}