"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, QrCode, CheckCircle, AlertTriangle, Loader2, Key } from "lucide-react";
import Image from "next/image";

export default function SecurityPage() {
  const [step, setStep] = useState<"intro" | "setup" | "verify" | "done">("intro");
  const [secret, setSecret] = useState("");
  const [qrUrl, setQrUrl] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);

  const handleSetup2FA = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/2fa/setup");
      const data = await res.json();
      setSecret(data.secret);
      const qrApiUrl =
        "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" +
        encodeURIComponent(data.otpauthUrl);
      setQrUrl(qrApiUrl);
      setStep("setup");
    } catch {
      setError("Failed to setup 2FA. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!token || token.length !== 6) {
      setError("Please enter the 6-digit code from your authenticator app.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, secret }),
      });
      const data = await res.json();

      if (data.verified) {
        setIs2FAEnabled(true);
        setStep("done");
      } else {
        setError("Invalid code. Please check your authenticator app and try again.");
      }
    } catch {
      setError("Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">

      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          Security Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your account security and two-factor authentication
        </p>
      </div>

      {/* 2FA Setup */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background rounded-xl border p-6 space-y-6"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Key className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="font-semibold">Two-Factor Authentication</h2>
              <p className="text-xs text-muted-foreground">Extra security for your admin account</p>
            </div>
          </div>
          <span
            className="text-xs px-3 py-1 rounded-full font-medium"
            style={{
              backgroundColor: is2FAEnabled
                ? "rgb(34 197 94 / 0.1)"
                : "rgb(234 179 8 / 0.1)",
              color: is2FAEnabled
                ? "rgb(34 197 94)"
                : "rgb(234 179 8)",
            }}
          >
            {is2FAEnabled ? "Enabled" : "Not Set Up"}
          </span>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {step === "intro" && (
          <div className="space-y-4">
            <div
              className="p-4 rounded-xl"
              style={{ backgroundColor: "var(--color-muted)" }}
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Recommended</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Two-factor authentication adds an extra layer of security.
                    Even if someone gets your password, they cannot access your
                    account without the 6-digit code from your phone.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">How it works:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Install Google Authenticator or Authy on your phone</li>
                <li>Scan the QR code with the app</li>
                <li>Enter the 6-digit code to verify setup</li>
                <li>Every login will require both password and code</li>
              </ol>
            </div>

            <button
              onClick={handleSetup2FA}
              disabled={loading}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Shield className="w-4 h-4" />
              )}
              Set Up 2FA
            </button>
          </div>
        )}

        {step === "setup" && (
          <div className="space-y-6">
            <div>
              <p className="text-sm font-medium mb-3">
                Step 1: Scan this QR code with Google Authenticator or Authy
              </p>
              <div className="flex justify-center p-4 bg-white rounded-xl w-fit">
                {qrUrl && (
                  <img
                    src={qrUrl}
                    alt="2FA QR Code"
                    width={200}
                    height={200}
                  />
                )}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-2">Or enter this code manually:</p>
              <code
                className="block px-4 py-3 rounded-lg text-sm font-mono tracking-widest text-center"
                style={{ backgroundColor: "var(--color-muted)" }}
              >
                {secret}
              </code>
            </div>

            <button
              onClick={() => setStep("verify")}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-medium hover:opacity-90"
            >
              Next — Verify Code
            </button>
          </div>
        )}

        {step === "verify" && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Step 2: Enter the 6-digit code from your authenticator app to confirm setup.
            </p>

            <div className="space-y-2">
              <label className="text-sm font-medium">Verification Code</label>
              <input
                type="text"
                value={token}
                onChange={e => setToken(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-center text-2xl font-mono tracking-widest focus:outline-none"
                style={{ borderColor: "var(--color-border)" }}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleVerify}
                disabled={loading || token.length !== 6}
                className="flex-1 flex items-center justify-center gap-2 bg-primary text-primary-foreground py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Verify & Enable 2FA"
                )}
              </button>
              <button
                onClick={() => setStep("setup")}
                className="px-4 py-3 rounded-lg border hover:bg-accent transition-colors text-sm"
                style={{ borderColor: "var(--color-border)" }}
              >
                Back
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">2FA Enabled!</h3>
            <p className="text-muted-foreground text-sm">
              Your account is now protected with two-factor authentication.
              Keep your authenticator app safe — you will need it to log in.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Session Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-background rounded-xl border p-6 space-y-4"
        style={{ borderColor: "var(--color-border)" }}
      >
        <h2 className="font-semibold flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          Security Tips
        </h2>
        <div className="space-y-3">
          {[
            { tip: "Use a strong unique password for your admin account", status: "good" },
            { tip: "Enable two-factor authentication", status: is2FAEnabled ? "good" : "warning" },
            { tip: "Never share your admin credentials with anyone", status: "good" },
            { tip: "Log out when using shared computers", status: "good" },
            { tip: "Keep your NEXTAUTH_SECRET key safe and private", status: "good" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-lg"
              style={{ backgroundColor: "var(--color-muted)" }}
            >
              <div
                className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                style={{
                  backgroundColor: item.status === "good"
                    ? "rgb(34 197 94)"
                    : "rgb(234 179 8)",
                }}
              />
              <p className="text-sm text-muted-foreground">{item.tip}</p>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  );
}