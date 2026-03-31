"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Coffee, Star, Zap, Loader2 } from "lucide-react";

const presetAmounts = [
  { amount: 5, label: "$5", icon: Coffee, desc: "Buy me a coffee" },
  { amount: 10, label: "$10", icon: Heart, desc: "Show some love" },
  { amount: 25, label: "$25", icon: Star, desc: "Super supporter" },
  { amount: 50, label: "$50", icon: Zap, desc: "Amazing patron" },
];

export default function DonationSection() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(10);
  const [customAmount, setCustomAmount] = useState("");
  const [donorName, setDonorName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const finalAmount = customAmount
    ? parseFloat(customAmount)
    : selectedAmount || 0;

  const handleDonate = async () => {
    if (!finalAmount || finalAmount < 1) {
      setError("Please select or enter an amount of at least $1.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          currency: "usd",
          donorName: donorName || "Anonymous",
          message,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
        setLoading(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setError("Failed to process donation. Please try again.");
      setLoading(false);
    }
  };

  return (
    <section
      className="section-padding"
      style={{ backgroundColor: "var(--color-muted)" }}
    >
      <div className="container-max">
        <div className="max-w-2xl mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center">
                <Heart className="w-8 h-8 text-red-500" />
              </div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Support My Work
            </h2>
            <p className="text-muted-foreground text-lg">
              If you find my projects or content helpful, consider buying me
              a coffee! Your support helps me keep building and sharing.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="bg-background rounded-2xl border p-8 space-y-6"
            style={{ borderColor: "var(--color-border)" }}
          >
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Preset Amounts */}
            <div>
              <p className="text-sm font-medium mb-3">Choose an amount</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {presetAmounts.map((preset) => {
                  const Icon = preset.icon;
                  return (
                    <button
                      key={preset.amount}
                      onClick={() => {
                        setSelectedAmount(preset.amount);
                        setCustomAmount("");
                        setError("");
                      }}
                      className="flex flex-col items-center gap-1.5 p-4 rounded-xl border transition-all"
                      style={{
                        borderColor:
                          selectedAmount === preset.amount && !customAmount
                            ? "var(--color-primary)"
                            : "var(--color-border)",
                        backgroundColor:
                          selectedAmount === preset.amount && !customAmount
                            ? "color-mix(in srgb, var(--color-primary) 10%, transparent)"
                            : "transparent",
                      }}
                    >
                      <Icon
                        className="w-5 h-5"
                        style={{
                          color:
                            selectedAmount === preset.amount && !customAmount
                              ? "var(--color-primary)"
                              : "var(--color-muted-foreground)",
                        }}
                      />
                      <span className="font-bold text-lg">{preset.label}</span>
                      <span className="text-xs text-muted-foreground text-center">
                        {preset.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <p className="text-sm font-medium mb-2">Or enter custom amount</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                  $
                </span>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount(null);
                    setError("");
                  }}
                  className="w-full pl-8 pr-4 py-3 rounded-xl border bg-muted/50 text-sm focus:outline-none"
                  style={{ borderColor: "var(--color-border)" }}
                />
              </div>
            </div>

            {/* Donor Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-2">Your name (optional)</p>
                <input
                  type="text"
                  placeholder="Anonymous"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border bg-muted/50 text-sm focus:outline-none"
                  style={{ borderColor: "var(--color-border)" }}
                />
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Message (optional)</p>
                <input
                  type="text"
                  placeholder="Keep up the great work!"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border bg-muted/50 text-sm focus:outline-none"
                  style={{ borderColor: "var(--color-border)" }}
                />
              </div>
            </div>

            {/* Donate Button */}
            <button
              onClick={handleDonate}
              disabled={loading || !finalAmount || finalAmount < 1}
              className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Redirecting to payment...
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  Donate {finalAmount ? "$" + finalAmount : ""}
                </>
              )}
            </button>

            <p className="text-xs text-muted-foreground text-center">
              Secured by Stripe. Your payment info is never stored on this site.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}