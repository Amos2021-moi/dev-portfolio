import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

async function getMpesaToken(): Promise<string> {
  const key = process.env.MPESA_CONSUMER_KEY || "";
  const secret = process.env.MPESA_CONSUMER_SECRET || "";
  const auth = Buffer.from(key + ":" + secret).toString("base64");

  const res = await fetch(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: { Authorization: "Basic " + auth },
    }
  );

  const data = await res.json();
  return data.access_token;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { phone, amount } = body;

    if (!phone || !amount) {
      return NextResponse.json(
        { error: "Phone and amount are required" },
        { status: 400 }
      );
    }

    const cleanPhone = phone.replace(/\D/g, "");
    let formattedPhone = cleanPhone;
    if (cleanPhone.startsWith("0")) {
      formattedPhone = "254" + cleanPhone.slice(1);
    } else if (cleanPhone.startsWith("+")) {
      formattedPhone = cleanPhone.slice(1);
    }

    const token = await getMpesaToken();
    const configuredShortcode =
      process.env.MPESA_SHORTCODE ||
      process.env.NEXT_PUBLIC_MPESA_TILL ||
      "174379";
    const passkey = process.env.MPESA_PASSKEY || "";
    const timestamp = new Date()
      .toISOString()
      .replace(/[-:T.Z]/g, "")
      .slice(0, 14);
    const password = Buffer.from(configuredShortcode + passkey + timestamp).toString("base64");

    const stkRes = await fetch(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          BusinessShortCode: configuredShortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Math.round(amount),
          PartyA: formattedPhone,
          PartyB: configuredShortcode,
          PhoneNumber: formattedPhone,
          CallBackURL: process.env.MPESA_CALLBACK_URL,
          AccountReference: "MarkOsiemo",
          TransactionDesc: "Support Mark Osiemo",
        }),
      }
    );

    const stkData = await stkRes.json();

    if (stkData.ResponseCode === "0") {
      return NextResponse.json({
        success: true,
        checkoutRequestId: stkData.CheckoutRequestID,
        message: "STK push sent to your phone. Enter your M-Pesa PIN to complete.",
      });
    } else {
      return NextResponse.json(
        { error: stkData.errorMessage || "M-Pesa request failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("M-Pesa error:", error);
    return NextResponse.json(
      { error: "Failed to initiate M-Pesa payment" },
      { status: 500 }
    );
  }
}