"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings, Save, User, Bell, Shield, Globe, Loader2, FileText, Upload, Download, Trash2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [profile, setProfile] = useState({
    name: "Mark Amos Osiemo",
    email: "amosmark2332@gmail.com",
    title: "Full-Stack Developer & CS Student",
    bio: "Computer Science student at South Eastern Kenya University (SEKU), passionate about building modern web applications and turning ideas into real digital products. Always learning, always building.",
    github: "AMOS2021-MOI",
    location: "Kenya, East Africa",
  });

  const [notifications, setNotifications] = useState({
    emailMessages: true,
    emailComments: true,
    emailNewsletter: false,
    browserNotifications: true,
  });

  const [siteSettings, setSiteSettings] = useState({
    siteName: "Mark Osiemo | Dev Portfolio",
    siteUrl: "https://markosiemo.vercel.app",
    maintenanceMode: false,
    analyticsEnabled: true,
  });

  const [password, setPassword] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [savedSection, setSavedSection] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [dangerAction, setDangerAction] = useState<string | null>(null);
  const [dangerLoading, setDangerLoading] = useState(false);
  const [dangerDone, setDangerDone] = useState<string | null>(null);
const [resumeUrl, setResumeUrl] = useState<string | null>(null);
const [resumeUploading, setResumeUploading] = useState(false);
const [resumeSuccess, setResumeSuccess] = useState(false);
const [resumeError, setResumeError] = useState("");

useEffect(() => {
  fetch("/api/resume")
    .then((res) => res.json())
    .then((data) => {
      if (data.exists) setResumeUrl(data.url);
    })
    .catch(() => {});
}, []);

  const showSuccess = (section: string) => {
    setSavedSection(section);
    setTimeout(() => setSavedSection(null), 3000);
  };

  const handleSaveProfile = async () => {
    if (!profile.name || !profile.email) {
      setErrors({ profile: "Name and email are required." });
      return;
    }
    setSavingSection("profile");
    setErrors({});
    try {
      await fetch("/api/settings/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      showSuccess("profile");
    } catch {
      setErrors({ profile: "Failed to save. Please try again." });
    } finally {
      setSavingSection(null);
    }
  };

  const handleSaveNotifications = async () => {
    setSavingSection("notifications");
    try {
      await fetch("/api/settings/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notifications),
      });
      showSuccess("notifications");
    } catch {
      setErrors({ notifications: "Failed to save." });
    } finally {
      setSavingSection(null);
    }
  };

  const handleSaveSite = async () => {
    setSavingSection("site");
    try {
      await fetch("/api/settings/site", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(siteSettings),
      });
      showSuccess("site");
    } catch {
      setErrors({ site: "Failed to save." });
    } finally {
      setSavingSection(null);
    }
  };

  const handleChangePassword = async () => {
    if (!password.current || !password.newPass || !password.confirm) {
      setErrors({ password: "All password fields are required." });
      return;
    }
    if (password.newPass !== password.confirm) {
      setErrors({ password: "New passwords do not match." });
      return;
    }
    if (password.newPass.length < 8) {
      setErrors({ password: "Password must be at least 8 characters." });
      return;
    }
    setSavingSection("password");
    setErrors({});
    try {
      const res = await fetch("/api/settings/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: password.current,
          newPassword: password.newPass,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ password: data.error || "Failed to change password." });
      } else {
        showSuccess("password");
        setPassword({ current: "", newPass: "", confirm: "" });
      }
    } catch {
      setErrors({ password: "Failed to change password." });
    } finally {
      setSavingSection(null);
    }
  };

  const handleDangerAction = async (action: string) => {
    setDangerLoading(true);
    try {
      await fetch("/api/settings/danger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      setDangerDone(action);
      setTimeout(() => setDangerDone(null), 3000);
    } catch {
      setErrors({ danger: "Action failed. Please try again." });
    } finally {
      setDangerLoading(false);
      setDangerAction(null);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          Settings
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage your portfolio settings and preferences
        </p>
      </div>

      {/* Profile Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-background rounded-xl border p-6 space-y-4"
        style={{ borderColor: "var(--color-border)" }}
      >
        <h2 className="font-semibold flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          Profile Information
        </h2>

        {errors.profile && (
          <p className="text-red-500 text-sm bg-red-500/10 px-3 py-2 rounded-lg">
            {errors.profile}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: "Full Name", key: "name", type: "text", placeholder: "Mark Amos Osiemo" },
            { label: "Email", key: "email", type: "email", placeholder: "email@example.com" },
            { label: "Job Title", key: "title", type: "text", placeholder: "Full-Stack Developer" },
            { label: "GitHub Username", key: "github", type: "text", placeholder: "username" },
            { label: "Location", key: "location", type: "text", placeholder: "Kenya, East Africa" },
          ].map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-sm font-medium">{field.label}</label>
              <input
                type={field.type}
                value={profile[field.key as keyof typeof profile]}
                onChange={(e) =>
                  setProfile((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                placeholder={field.placeholder}
                className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none"
                style={{ borderColor: "var(--color-border)" }}
              />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Bio</label>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
            rows={3}
            className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none resize-none"
            style={{ borderColor: "var(--color-border)" }}
          />
        </div>

        <button
          onClick={handleSaveProfile}
          disabled={savingSection === "profile"}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {savingSection === "profile" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {savedSection === "profile" ? "Saved!" : "Save Profile"}
        </button>
      </motion.div>

      {/* Change Password */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-background rounded-xl border p-6 space-y-4"
        style={{ borderColor: "var(--color-border)" }}
      >
        <h2 className="font-semibold flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          Change Password
        </h2>

        {errors.password && (
          <p className="text-red-500 text-sm bg-red-500/10 px-3 py-2 rounded-lg">
            {errors.password}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Current Password", key: "current" },
            { label: "New Password", key: "newPass" },
            { label: "Confirm New Password", key: "confirm" },
          ].map((field) => (
            <div key={field.key} className="space-y-2">
              <label className="text-sm font-medium">{field.label}</label>
              <input
                type="password"
                value={password[field.key as keyof typeof password]}
                onChange={(e) =>
                  setPassword((prev) => ({ ...prev, [field.key]: e.target.value }))
                }
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none"
                style={{ borderColor: "var(--color-border)" }}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleChangePassword}
          disabled={savingSection === "password"}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {savingSection === "password" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {savedSection === "password" ? "Password Changed!" : "Change Password"}
        </button>
      </motion.div>

      {/* Notification Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-background rounded-xl border p-6 space-y-4"
        style={{ borderColor: "var(--color-border)" }}
      >
        <h2 className="font-semibold flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          Notifications
        </h2>

        <div className="space-y-3">
          {[
            { key: "emailMessages", label: "Email me when I receive a new message" },
            { key: "emailComments", label: "Email me when someone comments" },
            { key: "emailNewsletter", label: "Send newsletter performance reports" },
            { key: "browserNotifications", label: "Enable browser push notifications" },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 rounded-lg border"
              style={{ borderColor: "var(--color-border)" }}
            >
              <p className="text-sm">{item.label}</p>
              <button
                onClick={() =>
                  setNotifications((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof typeof prev],
                  }))
                }
                className="relative w-11 h-6 rounded-full transition-colors duration-200"
                style={{
                  backgroundColor: notifications[item.key as keyof typeof notifications]
                    ? "var(--color-primary)"
                    : "var(--color-muted)",
                }}
              >
                <span
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                  style={{
                    transform: notifications[item.key as keyof typeof notifications]
                      ? "translateX(20px)"
                      : "translateX(0)",
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveNotifications}
          disabled={savingSection === "notifications"}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {savingSection === "notifications" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {savedSection === "notifications" ? "Saved!" : "Save Notifications"}
        </button>
      </motion.div>

      {/* Site Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-background rounded-xl border p-6 space-y-4"
        style={{ borderColor: "var(--color-border)" }}
      >
        <h2 className="font-semibold flex items-center gap-2">
          <Globe className="w-4 h-4 text-primary" />
          Site Settings
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Site Name</label>
            <input
              type="text"
              value={siteSettings.siteName}
              onChange={(e) =>
                setSiteSettings((prev) => ({ ...prev, siteName: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Site URL</label>
            <input
              type="url"
              value={siteSettings.siteUrl}
              onChange={(e) =>
                setSiteSettings((prev) => ({ ...prev, siteUrl: e.target.value }))
              }
              className="w-full px-4 py-3 rounded-lg border bg-muted/50 text-sm focus:outline-none"
              style={{ borderColor: "var(--color-border)" }}
            />
          </div>
        </div>

        <div className="space-y-3">
          {[
            {
              key: "maintenanceMode",
              label: "Maintenance Mode",
              desc: "Hide the site from visitors while you make changes",
            },
            {
              key: "analyticsEnabled",
              label: "Analytics Tracking",
              desc: "Track visitor behavior and page views",
            },
          ].map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 rounded-lg border"
              style={{ borderColor: "var(--color-border)" }}
            >
              <div>
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
              </div>
              <button
                onClick={() =>
                  setSiteSettings((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key as keyof typeof prev],
                  }))
                }
                className="relative w-11 h-6 rounded-full transition-colors duration-200"
                style={{
                  backgroundColor: siteSettings[item.key as keyof typeof siteSettings]
                    ? "var(--color-primary)"
                    : "var(--color-muted)",
                }}
              >
                <span
                  className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200"
                  style={{
                    transform: siteSettings[item.key as keyof typeof siteSettings]
                      ? "translateX(20px)"
                      : "translateX(0)",
                  }}
                />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleSaveSite}
          disabled={savingSection === "site"}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-50"
        >
          {savingSection === "site" ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {savedSection === "site" ? "Saved!" : "Save Site Settings"}
        </button>
      </motion.div>

{/* Resume Upload */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.25 }}
  className="bg-background rounded-xl border p-6 space-y-4"
  style={{ borderColor: "var(--color-border)" }}
>
  <h2 className="font-semibold flex items-center gap-2">
    <FileText className="w-4 h-4 text-primary" />
    Resume / CV
  </h2>
  <p className="text-sm text-muted-foreground">
    Upload your resume PDF. Visitors can download it from your portfolio homepage.
  </p>

  {resumeError && (
    <p className="text-red-500 text-sm bg-red-500/10 px-3 py-2 rounded-lg">
      {resumeError}
    </p>
  )}

  {resumeUrl && (
    <div
      className="flex items-center justify-between p-4 rounded-lg border"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
          <FileText className="w-5 h-5 text-red-500" />
        </div>
        <div>
          <p className="text-sm font-medium">Resume uploaded</p>
          <p className="text-xs text-muted-foreground">PDF · Ready for download</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <a
          href={resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border hover:bg-accent transition-colors"
          style={{ borderColor: "var(--color-border)" }}
        >
          <Download className="w-3 h-3" />
          Preview
        </a>
        <button
          onClick={() => setResumeUrl(null)}
          className="p-1.5 rounded-lg hover:bg-red-500/10 transition-colors text-muted-foreground hover:text-red-500"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  )}

  <div
    className="border-2 border-dashed rounded-xl p-8 text-center transition-colors"
    style={{ borderColor: "var(--color-border)" }}
    onDragOver={(e) => e.preventDefault()}
    onDrop={async (e) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) {
        const input = document.createElement("input");
        const dt = new DataTransfer();
        dt.items.add(file);
        const fakeEvent = { target: { files: dt.files } } as unknown as React.ChangeEvent<HTMLInputElement>;
        const handleUpload = async (f: File) => {
          if (f.type !== "application/pdf") {
            setResumeError("Only PDF files are allowed.");
            return;
          }
          setResumeUploading(true);
          setResumeError("");
          const formData = new FormData();
          formData.append("resume", f);
          try {
            const res = await fetch("/api/resume", { method: "POST", body: formData });
            const data = await res.json();
            if (!res.ok) {
              setResumeError(data.error || "Upload failed.");
            } else {
              setResumeUrl(data.url);
              setResumeSuccess(true);
              setTimeout(() => setResumeSuccess(false), 3000);
            }
          } catch {
            setResumeError("Upload failed. Please try again.");
          } finally {
            setResumeUploading(false);
          }
        };
        handleUpload(file);
      }
    }}
  >
    <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
    <p className="text-sm font-medium mb-1">
      Drag and drop your resume PDF here
    </p>
    <p className="text-xs text-muted-foreground mb-4">
      PDF only · Max 5MB
    </p>
    <label className="cursor-pointer">
      <span className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity inline-flex mx-auto w-fit">
        {resumeUploading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Uploading...
          </>
        ) : resumeSuccess ? (
          <>
            <Save className="w-4 h-4" />
            Uploaded!
          </>
        ) : (
          <>
            <Upload className="w-4 h-4" />
            Choose PDF File
          </>
        )}
      </span>
      <input
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          if (file.type !== "application/pdf") {
            setResumeError("Only PDF files are allowed.");
            return;
          }
          setResumeUploading(true);
          setResumeError("");
          const formData = new FormData();
          formData.append("resume", file);
          try {
            const res = await fetch("/api/resume", {
              method: "POST",
              body: formData,
            });
            const data = await res.json();
            if (!res.ok) {
              setResumeError(data.error || "Upload failed.");
            } else {
              setResumeUrl(data.url);
              setResumeSuccess(true);
              setTimeout(() => setResumeSuccess(false), 3000);
            }
          } catch {
            setResumeError("Upload failed. Please try again.");
          } finally {
            setResumeUploading(false);
          }
        }}
      />
    </label>
  </div>
</motion.div>
      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-background rounded-xl border p-6 space-y-4"
        style={{ borderColor: "rgb(239 68 68 / 0.3)" }}
      >
        <h2 className="font-semibold flex items-center gap-2 text-red-500">
          <Shield className="w-4 h-4" />
          Danger Zone
        </h2>
        <p className="text-sm text-muted-foreground">
          These actions are irreversible. Please proceed with caution.
        </p>

        {errors.danger && (
          <p className="text-red-500 text-sm bg-red-500/10 px-3 py-2 rounded-lg">
            {errors.danger}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setDangerAction("clear_analytics")}
            className="px-4 py-2.5 rounded-lg border border-red-500/30 text-red-500 text-sm font-medium hover:bg-red-500/10 transition-colors"
          >
            Clear All Analytics Data
          </button>
          <button
            onClick={() => setDangerAction("clear_messages")}
            className="px-4 py-2.5 rounded-lg border border-red-500/30 text-red-500 text-sm font-medium hover:bg-red-500/10 transition-colors"
          >
            Delete All Messages
          </button>
          <button
            onClick={() => setDangerAction("clear_subscribers")}
            className="px-4 py-2.5 rounded-lg border border-red-500/30 text-red-500 text-sm font-medium hover:bg-red-500/10 transition-colors"
          >
            Clear All Subscribers
          </button>
        </div>

        {dangerDone && (
          <p className="text-green-500 text-sm bg-green-500/10 px-3 py-2 rounded-lg">
            Action completed successfully!
          </p>
        )}
      </motion.div>

      {/* Danger Confirmation Modal */}
      {dangerAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-background rounded-xl border p-6 max-w-sm w-full mx-4 shadow-xl"
            style={{ borderColor: "var(--color-border)" }}
          >
            <h3 className="text-lg font-bold mb-2 text-red-500">
              Are you sure?
            </h3>
            <p className="text-muted-foreground text-sm mb-2">
              You are about to:
            </p>
            <p className="font-medium text-sm mb-6">
              {dangerAction === "clear_analytics" && "Delete ALL analytics and visitor data permanently"}
              {dangerAction === "clear_messages" && "Delete ALL contact messages permanently"}
              {dangerAction === "clear_subscribers" && "Delete ALL newsletter subscribers permanently"}
            </p>
            <p className="text-xs text-muted-foreground mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDangerAction(null)}
                disabled={dangerLoading}
                className="flex-1 px-4 py-2 rounded-lg border text-sm font-medium hover:bg-accent transition-colors disabled:opacity-50"
                style={{ borderColor: "var(--color-border)" }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDangerAction(dangerAction)}
                disabled={dangerLoading}
                className="flex-1 px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {dangerLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Yes, Delete"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}