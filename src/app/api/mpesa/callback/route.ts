import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("M-Pesa callback received:", JSON.stringify(body, null, 2));
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  } catch (error) {
    console.error("M-Pesa callback error:", error);
    return NextResponse.json({ ResultCode: 0, ResultDesc: "Success" });
  }
}