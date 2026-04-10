import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface WebhookPayload {
  event: string;
  data: Record<string, unknown>;
  timestamp: string;
}

const WEBHOOK_URLS = {
  discord: process.env.DISCORD_WEBHOOK_URL || "",
  slack: process.env.SLACK_WEBHOOK_URL || "",
};

async function sendDiscordWebhook(url: string, payload: WebhookPayload) {
  const colors: Record<string, number> = {
    new_message: 0x9b59b6,
    new_subscriber: 0x2ecc71,
    new_comment: 0x3498db,
    new_testimonial: 0xe67e22,
  };

  const embeds = [{
    title: "📬 " + payload.event.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
    color: colors[payload.event] || 0x7289da,
    fields: Object.entries(payload.data).slice(0, 5).map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: String(value).slice(0, 100) || "N/A",
      inline: true,
    })),
    footer: { text: "Mark.dev Portfolio" },
    timestamp: payload.timestamp,
  }];

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ embeds }),
  });
}

async function sendSlackWebhook(url: string, payload: WebhookPayload) {
  const fields = Object.entries(payload.data).slice(0, 5).map(([key, value]) => ({
    type: "mrkdwn",
    text: "*" + key + ":*\n" + String(value).slice(0, 100),
  }));

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: "🔔 " + payload.event.replace(/_/g, " ").toUpperCase() },
        },
        {
          type: "section",
          fields: fields.length > 0 ? fields : [{ type: "mrkdwn", text: "New event received" }],
        },
        {
          type: "context",
          elements: [{ type: "mrkdwn", text: "Mark.dev Portfolio • " + new Date(payload.timestamp).toLocaleString() }],
        },
      ],
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { event, data, targets } = body;

    if (!event) {
      return NextResponse.json({ error: "Event is required" }, { status: 400 });
    }

    const payload: WebhookPayload = {
      event,
      data: data || {},
      timestamp: new Date().toISOString(),
    };

    const results: Record<string, string> = {};
    const sendTo = targets || ["discord", "slack"];

    await Promise.allSettled([
      sendTo.includes("discord") && WEBHOOK_URLS.discord
        ? sendDiscordWebhook(WEBHOOK_URLS.discord, payload)
            .then(() => { results.discord = "sent"; })
            .catch(() => { results.discord = "failed"; })
        : Promise.resolve(),
      sendTo.includes("slack") && WEBHOOK_URLS.slack
        ? sendSlackWebhook(WEBHOOK_URLS.slack, payload)
            .then(() => { results.slack = "sent"; })
            .catch(() => { results.slack = "failed"; })
        : Promise.resolve(),
    ]);

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Failed to send webhook" }, { status: 500 });
  }
}