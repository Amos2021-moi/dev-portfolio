import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const existing = await prisma.user.findUnique({
      where: { id: "default-author" },
    });

    if (!existing) {
      await prisma.user.create({
        data: {
          id: "default-author",
          name: "Mark Amos Osiemo",
          email: "amosmark2332@gmail.com",
          role: "ADMIN",
        },
      });
    }

    return NextResponse.json({ success: true, message: "Seed completed!" });
  } catch (error) {
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}