import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify, readingTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error("Blog GET error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      excerpt,
      content,
      coverImage,
      tags,
      published,
      featured,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    const slug = slugify(title);
    const postReadingTime = readingTime(content);

    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });

    const finalSlug = existingPost
      ? slug + "-" + Date.now()
      : slug;

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: finalSlug,
        excerpt: excerpt || "",
        content,
        coverImage: coverImage || "",
        tags: tags || [],
        published: published || false,
        featured: featured || false,
        readingTime: postReadingTime,
        authorId: "default-author",
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Blog POST error:", error);
    return NextResponse.json(
      { error: "Failed to create blog post" },
      { status: 500 }
    );
  }
}