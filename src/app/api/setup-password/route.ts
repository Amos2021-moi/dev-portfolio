import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secretKey, password } = body;

    if (secretKey !== "MARK_SETUP_2024_SECRET") {
      return NextResponse.json({ error: "Invalid secret key" }, { status: 401 });
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email: "amosmark2332@gmail.com" },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ success: true, message: "Password set successfully!" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to set password" }, { status: 500 });
  }
}