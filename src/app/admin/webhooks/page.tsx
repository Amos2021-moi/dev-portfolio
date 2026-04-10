"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Send, Check, X, Settings, MessageSquare } from "lucide-react";

const WEBHOOK_EVENTS = [
  { id: "new_message", label: "New Contact Message", desc: "When someone sends a contact form message", icon: MessageSquare },
  { id: "new_subscriber", label: "New Newsletter Subscriber", desc: "When someone subscribes to the newsletter", icon: MessageSquare },
  { id: "new_comment", label: "New Comment", desc: "When someone leaves a comment", icon: MessageSquare },
  { id: "new_testimonial", label: "New Testimonial", desc: "When someone submits a testimonial", icon: MessageSquare },
];

export default function WebhooksPage() {
  const [discordUrl, setDiscordUrl] = useState("");
  const [slackUrl, setSlackUrl] = useState("");
  const [testing, setTesting] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const testWebhook = async (target: string) => {
    setTesting(target);
    try {
      const res = await fetch("/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          event: "test_webhook",
          data: {
            message: "This is a test webhook from Mark.dev Portfolio!",
            target,
            timestamp: new Date().toISOString(),
          },
          targets: [target],
        }),
      });
      const data = await res.json();
      setTestResults(prev => ({
        ...prev,
        [target]: data.results?.[target] === "sent" ? "success" : "failed",
      }));
    } catch {
      setTestResults(prev => ({ ...prev, [target]: "failed" }));
    } finally {
      setTesting(null);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">

      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Zap className="w-6 h-6 text-primary" />
          Webhook Manager
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Get notified on Discord or Slack when events happen on your portfolio
        </p>
      </div>

      {/* Discord Webhook */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background rounded-xl border p-6 space-y-4"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#5865F2" + "20" }}>
            <span className="text-xl">💬</span>
          </div>
          <div>
            <h2 className="font-semibold">Discord Webhook</h2>
            <p className="text-xs text-muted-foreground">Get notifications in your Discord server</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Webhook URL</label>
          <input
            type="url"
            value={discordUrl}
            onChange={e => setDiscordUrl(e.target.value)}
            placeholder="https://discord.com/api/webhooks/..."
            className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none font-mono"
            style={{ borderColor: "var(--color-border)" }}
          />
          <p className="text-xs text-muted-foreground">
            Go to your Discord server → Channel Settings → Integrations → Webhooks → New Webhook
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => testWebhook("discord")}
            disabled={!discordUrl || testing === "discord"}
            className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
            style={{ borderColor: "var(--color-border)" }}
          >
            {testing === "discord" ? (
              <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send Test
          </button>

          {testResults.discord === "success" && (
            <span className="flex items-center gap-1 text-green-500 text-sm">
              <Check className="w-4 h-4" />
              Sent successfully!
            </span>
          )}
          {testResults.discord === "failed" && (
            <span className="flex items-center gap-1 text-red-500 text-sm">
              <X className="w-4 h-4" />
              Failed — check your URL
            </span>
          )}
        </div>
      </motion.div>

      {/* Slack Webhook */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-background rounded-xl border p-6 space-y-4"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#4A154B" + "20" }}>
            <span className="text-xl">💼</span>
          </div>
          <div>
            <h2 className="font-semibold">Slack Webhook</h2>
            <p className="text-xs text-muted-foreground">Get notifications in your Slack workspace</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Webhook URL</label>
          <input
            type="url"
            value={slackUrl}
            onChange={e => setSlackUrl(e.target.value)}
            placeholder="https://hooks.slack.com/services/..."
            className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none font-mono"
            style={{ borderColor: "var(--color-border)" }}
          />
          <p className="text-xs text-muted-foreground">
            Go to api.slack.com → Your Apps → Incoming Webhooks → Add New Webhook
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => testWebhook("slack")}
            disabled={!slackUrl || testing === "slack"}
            className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
            style={{ borderColor: "var(--color-border)" }}
          >
            {testing === "slack" ? (
              <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            Send Test
          </button>

          {testResults.slack === "success" && (
            <span className="flex items-center gap-1 text-green-500 text-sm">
              <Check className="w-4 h-4" />
              Sent successfully!
            </span>
          )}
          {testResults.slack === "failed" && (
            <span className="flex items-center gap-1 text-red-500 text-sm">
              <X className="w-4 h-4" />
              Failed — check your URL
            </span>
          )}
        </div>
      </motion.div>

      {/* Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-background rounded-xl border p-6 space-y-4"
        style={{ borderColor: "var(--color-border)" }}
      >
        <h2 className="font-semibold flex items-center gap-2">
          <Settings className="w-4 h-4 text-primary" />
          Webhook Events
        </h2>
        <p className="text-sm text-muted-foreground">
          These events will trigger webhook notifications when they occur:
        </p>

        <div className="space-y-3">
          {WEBHOOK_EVENTS.map((event) => (
            <div
              key={event.id}
              className="flex items-center justify-between p-4 rounded-lg border"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div>
                <p className="text-sm font-medium">{event.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{event.desc}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-xs text-green-500">Active</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* How to setup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-background rounded-xl border p-6 space-y-4"
        style={{ borderColor: "var(--color-border)" }}
      >
        <h2 className="font-semibold">Setup Instructions</h2>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--color-muted)" }}>
            <p className="font-medium text-foreground mb-1">Discord Setup</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Open your Discord server</li>
              <li>Go to Server Settings → Integrations → Webhooks</li>
              <li>Click "New Webhook" and choose a channel</li>
              <li>Copy the webhook URL and paste it above</li>
              <li>Add DISCORD_WEBHOOK_URL to your Vercel environment variables</li>
            </ol>
          </div>
          <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--color-muted)" }}>
            <p className="font-medium text-foreground mb-1">Slack Setup</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Go to api.slack.com/apps</li>
              <li>Create a new app → From scratch</li>
              <li>Enable Incoming Webhooks</li>
              <li>Add a webhook to your workspace and choose a channel</li>
              <li>Copy the URL and add SLACK_WEBHOOK_URL to Vercel</li>
            </ol>
          </div>
        </div>
      </motion.div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
      >
        {saving ? (
          <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" />
        ) : saved ? (
          <Check className="w-4 h-4" />
        ) : (
          <Zap className="w-4 h-4" />
        )}
        {saved ? "Saved!" : "Save Configuration"}
      </button>

    </div>
  );
}