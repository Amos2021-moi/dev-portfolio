"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Loader2, Smartphone, CheckCircle } from "lucide-react";

const presetAmounts = [50, 100, 200, 500];

export default function MpesaDonation() {
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const finalAmount = customAmount ? parseInt(customAmount) : amount;

  const handlePay = async () => {
    if (!phone) {
      setError("Please enter your M-Pesa phone number.");
      return;
    }
    if (!finalAmount || finalAmount < 1) {
      setError("Please enter a valid amount.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/mpesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, amount: finalAmount }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Payment failed. Please try again.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="section-padding"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <div className="container-max">
        <div className="max-w-lg mx-auto">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8"
          >
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ backgroundColor: "#4CAF50" + "20" }}>
                <Smartphone className="w-8 h-8" style={{ color: "#4CAF50" }} />
              </div>
            </div>
            <h2 className="text-3xl font-bold mb-3">Support via M-Pesa</h2>
            <p className="text-muted-foreground">
              Kenyan? Support me directly via M-Pesa Lipa Na M-Pesa.
            </p>
            {process.env.NEXT_PUBLIC_MPESA_TILL && (
              <div
                className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full border"
                style={{ borderColor: "var(--color-border)" }}
              >
                <span className="text-sm text-muted-foreground">Till Number:</span>
                <span className="font-bold font-mono text-primary">
                  {process.env.NEXT_PUBLIC_MPESA_TILL}
                </span>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-background rounded-2xl border p-6 space-y-5"
            style={{ borderColor: "var(--color-border)" }}
          >
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">STK Push Sent!</h3>
                <p className="text-muted-foreground">
                  Check your phone and enter your M-Pesa PIN to complete the payment.
                  Thank you for your support!
                </p>
                <button
                  onClick={() => {
                    setSuccess(false);
                    setPhone("");
                    setCustomAmount("");
                    setAmount(100);
                  }}
                  className="mt-4 text-primary hover:opacity-80 transition-opacity text-sm"
                >
                  Make another donation
                </button>
              </motion.div>
            ) : (
              <>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium mb-3">Amount (KES)</p>
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {presetAmounts.map((a) => (
                      <button
                        key={a}
                        onClick={() => {
                          setAmount(a);
                          setCustomAmount("");
                          setError("");
                        }}
                        className="py-2.5 rounded-xl border text-sm font-bold transition-all"
                        style={{
                          borderColor:
                            amount === a && !customAmount
                              ? "var(--color-primary)"
                              : "var(--color-border)",
                          backgroundColor:
                            amount === a && !customAmount
                              ? "color-mix(in srgb, var(--color-primary) 10%, transparent)"
                              : "transparent",
                          color:
                            amount === a && !customAmount
                              ? "var(--color-primary)"
                              : "var(--color-foreground)",
                        }}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    min="1"
                    placeholder="Custom amount (KES)"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setAmount(0);
                      setError("");
                    }}
                    className="w-full px-4 py-3 rounded-xl border bg-muted/50 text-sm focus:outline-none"
                    style={{ borderColor: "var(--color-border)" }}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">M-Pesa Phone Number</p>
                  <input
                    type="tel"
                    placeholder="0712345678 or 254712345678"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setError("");
                    }}
                    className="w-full px-4 py-3 rounded-xl border bg-muted/50 text-sm focus:outline-none"
                    style={{ borderColor: "var(--color-border)" }}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Enter the phone number registered with M-Pesa
                  </p>
                </div>

                <button
                  onClick={handlePay}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold text-base transition-all disabled:opacity-50"
                  style={{ backgroundColor: "#4CAF50", color: "white" }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending STK Push...
                    </>
                  ) : (
                    <>
                      <Smartphone className="w-5 h-5" />
                      Pay KES {finalAmount || "..."} via M-Pesa
                    </>
                  )}
                </button>

                <div
                  className="p-3 rounded-lg text-xs text-muted-foreground space-y-1"
                  style={{ backgroundColor: "var(--color-muted)" }}
                >
                  <p className="font-medium">How it works:</p>
                  <p>1. Enter amount and your M-Pesa number</p>
                  <p>2. Click Pay — you will get a prompt on your phone</p>
                  <p>3. Enter your M-Pesa PIN to confirm</p>
                  <p>4. Done! Payment goes to Till No. {process.env.NEXT_PUBLIC_MPESA_TILL || "your till"}</p>
                </div>
              </>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}