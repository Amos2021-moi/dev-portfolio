import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { slugify, readingTime } from "@/lib/utils";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = await prisma.blogPost.findUnique({
      where: { id: params.id },
      include: { category: true },
    });

    if (!post) {
      return NextResponse.json(
        { error: "Blog post not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch blog post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const slug = title ? slugify(title) : undefined;
    const postReadingTime = content ? readingTime(content) : undefined;

    const post = await prisma.blogPost.update({
      where: { id: params.id },
      data: {
        ...(title && { title, slug }),
        ...(excerpt !== undefined && { excerpt }),
        ...(content && { content, readingTime: postReadingTime }),
        ...(coverImage !== undefined && { coverImage }),
        ...(tags && { tags }),
        ...(published !== undefined && { published }),
        ...(featured !== undefined && { featured }),
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update blog post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.blogPost.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete blog post" },
      { status: 500 }
    );
  }
}