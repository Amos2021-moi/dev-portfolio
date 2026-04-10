import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, content, previewText } = body;

    if (!subject || !content) {
      return NextResponse.json(
        { error: "Subject and content are required" },
        { status: 400 }
      );
    }

    const subscribers = await prisma.subscriber.findMany({
      where: { subscribed: true },
    });

    if (subscribers.length === 0) {
      return NextResponse.json({ error: "No subscribers found" }, { status: 400 });
    }

    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);

    let sent = 0;
    let failed = 0;

    for (const subscriber of subscribers) {
      try {
        await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
          to: subscriber.email,
          subject,
          html: `
            <!DOCTYPE html>
            <html>
              <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
              <body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
                <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
                  <div style="background:linear-gradient(135deg,#3b82f6,#8b5cf6);padding:32px;text-align:center;">
                    <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:700;">Mark Osiemo Newsletter</h1>
                    ${previewText ? '<p style="margin:8px 0 0;color:rgba(255,255,255,0.8);font-size:14px;">' + previewText + '</p>' : ""}
                  </div>
                  <div style="padding:32px;">
                    <div style="color:#475569;font-size:15px;line-height:1.7;">
                      ${content.replace(/\n/g, "<br>")}
                    </div>
                    <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e2e8f0;text-align:center;">
                      <a href="https://markosiemo.vercel.app" style="display:inline-block;background:linear-gradient(135deg,#3b82f6,#8b5cf6);color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:8px;font-size:14px;font-weight:600;">
                        Visit My Portfolio
                      </a>
                    </div>
                    <div style="margin-top:24px;text-align:center;">
                      <p style="color:#94a3b8;font-size:12px;">
                        You are receiving this because you subscribed at Mark.dev<br>
                        Mark Amos Osiemo · SEKU · Kenya
                      </p>
                    </div>
                  </div>
                </div>
              </body>
            </html>
          `,
        });
        sent++;
        await new Promise(r => setTimeout(r, 100));
      } catch {
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      sent,
      failed,
      total: subscribers.length,
    });
  } catch (error) {
    console.error("Campaign error:", error);
    return NextResponse.json({ error: "Campaign failed" }, { status: 500 });
  }
}