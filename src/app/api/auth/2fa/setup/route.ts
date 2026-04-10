import { NextResponse } from "next/server";
import speakeasy from "speakeasy";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const secret = speakeasy.generateSecret({
      name: "Mark.dev Portfolio",
      issuer: "Mark Osiemo",
      length: 32,
    });

    return NextResponse.json({
      secret: secret.base32,
      otpauthUrl: secret.otpauth_url,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate 2FA secret" }, { status: 500 });
  }
}