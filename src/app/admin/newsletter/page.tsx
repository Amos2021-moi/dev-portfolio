"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Send, Users, Loader2, CheckCircle, Download } from "lucide-react";

interface Subscriber {
  id: string;
  email: string;
  name: string;
  subscribed: boolean;
  createdAt: string;
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ sent: number; failed: number; total: number } | null>(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const [backupLoading, setBackupLoading] = useState(false);

  useEffect(() => {
    fetch("/api/newsletter")
      .then(r => r.json())
      .then(d => {
        setSubscribers(Array.isArray(d) ? d : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSendCampaign = async () => {
    if (!subject || !content) {
      setError("Subject and content are required.");
      return;
    }
    if (subscribers.filter(s => s.subscribed).length === 0) {
      setError("No active subscribers to send to.");
      return;
    }

    const confirmed = window.confirm(
      "Send this campaign to " +
      subscribers.filter(s => s.subscribed).length +
      " subscribers?"
    );
    if (!confirmed) return;

    setSending(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/newsletter/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, content, previewText }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Campaign failed.");
      } else {
        setResult(data);
        setSubject("");
        setContent("");
        setPreviewText("");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleBackup = async () => {
    setBackupLoading(true);
    try {
      const res = await fetch("/api/backup", {
        headers: {
          Authorization: "Bearer " + process.env.NEXT_PUBLIC_BACKUP_KEY || "Bearer backup",
        },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "portfolio-backup-" + new Date().toISOString().split("T")[0] + ".json";
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Backup failed. Please try again.");
    } finally {
      setBackupLoading(false);
    }
  };

  const activeCount = subscribers.filter(s => s.subscribed).length;

  return (
    <div className="space-y-6 max-w-5xl">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Mail className="w-6 h-6 text-primary" />
            Newsletter
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage subscribers and send campaigns
          </p>
        </div>
        <button
          onClick={handleBackup}
          disabled={backupLoading}
          className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm hover:bg-accent transition-colors disabled:opacity-50"
          style={{ borderColor: "var(--color-border)" }}
        >
          {backupLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          Backup Data
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Subscribers", value: subscribers.length, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
          { label: "Active", value: activeCount, icon: CheckCircle, color: "text-green-500", bg: "bg-green-500/10" },
          { label: "Unsubscribed", value: subscribers.length - activeCount, icon: Mail, color: "text-red-500", bg: "bg-red-500/10" },
        ].map(stat => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-background rounded-xl border p-5"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div className={"w-10 h-10 rounded-lg flex items-center justify-center mb-3 " + stat.bg}>
                <Icon className={"w-5 h-5 " + stat.color} />
              </div>
              <p className="text-2xl font-bold">{loading ? "..." : stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Campaign Composer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background rounded-xl border p-6 space-y-4"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Send Campaign</h2>
            <button
              onClick={() => setPreview(!preview)}
              className="text-xs text-primary hover:opacity-80 transition-opacity"
            >
              {preview ? "Edit" : "Preview"}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-500/10 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          {result && (
            <div className="bg-green-500/10 border border-green-500/30 text-green-600 px-4 py-3 rounded-lg text-sm">
              <p className="font-medium">Campaign sent!</p>
              <p>{result.sent} sent · {result.failed} failed · {result.total} total</p>
            </div>
          )}

          {preview ? (
            <div
              className="rounded-xl p-4 text-sm"
              style={{ backgroundColor: "var(--color-muted)" }}
            >
              <p className="font-bold text-lg mb-2">{subject || "No subject"}</p>
              {previewText && <p className="text-muted-foreground text-xs mb-3">{previewText}</p>}
              <div className="whitespace-pre-wrap text-muted-foreground">
                {content || "No content yet..."}
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Subject *</label>
                <input
                  type="text"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="New projects and updates from Mark!"
                  className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none"
                  style={{ borderColor: "var(--color-border)" }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Preview Text</label>
                <input
                  type="text"
                  value={previewText}
                  onChange={e => setPreviewText(e.target.value)}
                  placeholder="Short preview shown in email clients..."
                  className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none"
                  style={{ borderColor: "var(--color-border)" }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Content *</label>
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder="Write your newsletter content here..."
                  rows={8}
                  className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none resize-none"
                  style={{ borderColor: "var(--color-border)" }}
                />
              </div>
            </>
          )}

          <button
            onClick={handleSendCampaign}
            disabled={sending || !subject || !content}
            className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending to {activeCount} subscribers...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send to {activeCount} subscribers
              </>
            )}
          </button>
        </motion.div>

        {/* Subscribers List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-background rounded-xl border overflow-hidden"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div
            className="p-5 border-b"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h2 className="font-semibold">Subscribers ({subscribers.length})</h2>
          </div>

          <div className="divide-y max-h-96 overflow-y-auto" style={{ borderColor: "var(--color-border)" }}>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="p-4 animate-pulse">
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              ))
            ) : subscribers.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No subscribers yet. Share your portfolio!
              </div>
            ) : (
              subscribers.map(sub => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold">
                      {sub.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{sub.name || sub.email}</p>
                      <p className="text-xs text-muted-foreground">{sub.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: sub.subscribed
                          ? "rgb(34 197 94 / 0.1)"
                          : "rgb(239 68 68 / 0.1)",
                        color: sub.subscribed
                          ? "rgb(34 197 94)"
                          : "rgb(239 68 68)",
                      }}
                    >
                      {sub.subscribed ? "Active" : "Unsubscribed"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>

      </div>
    </div>
  );
}