"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Trash2, Mail, Search, Eye } from "lucide-react";

interface Message {
  id: string;
  data: {
    name: string;
    email: string;
    subject: string;
    message: string;
  };
  createdAt: string;
  read?: boolean;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/contact")
      .then((res) => res.json())
      .then((data) => {
        setMessages(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = messages.filter((m) => {
    if (!m.data) return false;
    return (
      m.data.name?.toLowerCase().includes(search.toLowerCase()) ||
      m.data.subject?.toLowerCase().includes(search.toLowerCase()) ||
      m.data.email?.toLowerCase().includes(search.toLowerCase())
    );
  });

  const selectedMessage = messages.find((m) => m.id === selected);

  const handleSelect = (id: string) => {
    setSelected(id);
    setReadIds((prev) => new Set([...prev, id]));
  };

  const handleDelete = async (id: string) => {
    await fetch("/api/contact/" + id, { method: "DELETE" });
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setDeleteId(null);
    if (selected === id) setSelected(null);
  };

  const unreadCount = messages.filter((m) => !readIds.has(m.id)).length;

  return (
    <div className="space-y-6">

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-primary" />
            Messages
            {unreadCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Contact form submissions from visitors
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total Messages", value: messages.length },
          { label: "Unread", value: unreadCount },
          { label: "Read", value: messages.length - unreadCount },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-background rounded-xl border p-4"
            style={{ borderColor: "var(--color-border)" }}
          >
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search messages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border bg-background text-sm focus:outline-none"
          style={{ borderColor: "var(--color-border)" }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Messages List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-1 bg-background rounded-xl border overflow-hidden"
          style={{ borderColor: "var(--color-border)" }}
        >
          <div className="p-4 border-b" style={{ borderColor: "var(--color-border)" }}>
            <p className="text-sm font-medium">
              {filtered.length} message{filtered.length !== 1 ? "s" : ""}
            </p>
          </div>

          <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
            {loading ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                Loading...
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground text-sm">
                No messages yet.
              </div>
            ) : (
              filtered.map((message) => {
                const isRead = readIds.has(message.id);
                return (
                  <div
                    key={message.id}
                    onClick={() => handleSelect(message.id)}
                    className="p-4 cursor-pointer hover:bg-muted/30 transition-colors"
                    style={{
                      backgroundColor: selected === message.id ? "var(--color-muted)" : undefined,
                      borderLeft: !isRead ? "3px solid var(--color-primary)" : "3px solid transparent",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold flex-shrink-0">
                          {message.data?.name?.charAt(0) || "?"}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {message.data?.name || "Unknown"}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {message.data?.subject || "No subject"}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        <p className="text-xs text-muted-foreground">
                          {new Date(message.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        {!isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full" />
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 truncate pl-10">
                      {message.data?.message || ""}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Message Detail */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-2 bg-background rounded-xl border"
          style={{ borderColor: "var(--color-border)" }}
        >
          {selectedMessage ? (
            <div className="h-full flex flex-col">
              <div
                className="p-6 border-b flex items-start justify-between gap-4"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {selectedMessage.data?.name?.charAt(0) || "?"}
                  </div>
                  <div>
                    <p className="font-semibold">{selectedMessage.data?.name}</p>
                    <p className="text-sm text-muted-foreground">{selectedMessage.data?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  
                    href={"mailto:" + selectedMessage.data?.email}
                    className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Mail className="w-4 h-4" />
                    Reply
                  </a>
                  <button
                    onClick={() => setDeleteId(selectedMessage.id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="p-6 flex-1">
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Subject</p>
                  <p className="font-semibold text-lg">{selectedMessage.data?.subject}</p>
                </div>
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-1">Date</p>
                  <p className="text-sm">
                    {new Date(selectedMessage.createdAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Message</p>
                  <p className="text-muted-foreground leading-relaxed">
                    {selectedMessage.data?.message}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-24 text-center px-6">
              <Eye className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
              <p className="font-medium mb-1">No message selected</p>
              <p className="text-sm text-muted-foreground">
                Click a message from the list to read it
              </p>
            </div>
          )}
        </motion.div>

      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-xl border p-6 max-w-sm w-full mx-4 shadow-xl"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h3 className="text-lg font-bold mb-2">Delete Message</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Are you sure? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors"
                style={{ borderColor: "var(--color-border)" }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}