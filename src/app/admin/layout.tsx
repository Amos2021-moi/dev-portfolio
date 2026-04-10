"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Code2,
  BarChart2,
  Star,
  Mail,
  Zap,
  Shield,
  Globe,
} from "lucide-react";

const sidebarItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderKanban },
  { label: "Blog Posts", href: "/admin/blog", icon: FileText },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Testimonials", href: "/admin/testimonials", icon: Star },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart2 },
  { label: "Webhooks", href: "/admin/webhooks", icon: Zap },
  { label: "Security", href: "/admin/security", icon: Shield },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { data: session, status } = useSession();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/admin/login" });
  };

  const isLoginPage = pathname === "/admin/login";
  const isLoading = status === "loading";

  if (isLoginPage || isLoading) {
    return <>{children}</>;
  }

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-50 w-64 bg-background border-r flex flex-col lg:hidden"
        style={{
          borderColor: "var(--color-border)",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s ease",
        }}
      >
        <div
          className="flex items-center justify-between p-5 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <Link href="/" className="flex items-center gap-2 font-mono font-bold text-lg">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-gradient">Mark.dev</span>
          </Link>
          <button
            className="p-2 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: isActive ? "var(--color-primary)" : "transparent",
                  color: isActive ? "var(--color-primary-foreground)" : "var(--color-muted-foreground)",
                }}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
              M
            </div>
            <div>
              <p className="text-sm font-medium">{session?.user?.name || "Mark Osiemo"}</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex fixed inset-y-0 left-0 z-50 w-60 bg-background border-r flex-col"
        style={{ borderColor: "var(--color-border)" }}
      >
        <div
          className="flex items-center gap-2 p-5 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <Link href="/" className="flex items-center gap-2 font-mono font-bold text-lg">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-gradient">Mark.dev</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
                style={{
                  backgroundColor: isActive ? "var(--color-primary)" : "transparent",
                  color: isActive ? "var(--color-primary-foreground)" : "var(--color-muted-foreground)",
                }}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t" style={{ borderColor: "var(--color-border)" }}>
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
              M
            </div>
            <div>
              <p className="text-sm font-medium">{session?.user?.name || "Mark Osiemo"}</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-60 flex flex-col min-h-screen">

        <header
          className="sticky top-0 z-30 bg-background border-b px-6 py-4 flex items-center justify-between"
          style={{ borderColor: "var(--color-border)" }}
        >
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden lg:block">
            <p className="text-sm text-muted-foreground">
              Welcome back,{" "}
              <span className="text-foreground font-medium">
                {session?.user?.name?.split(" ")[0] || "Mark"}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <a
              href="/api-docs"
              target="_blank"
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Globe className="w-3.5 h-3.5" />
              API Docs
            </a>
            <Link
              href="/"
              target="_blank"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View Site
            </Link>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}