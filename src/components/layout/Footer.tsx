import Link from "next/link";
import { Code2, Mail, Heart, GitBranch } from "lucide-react";
import { siteConfig, navItems } from "@/lib/config";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-background" style={{ borderColor: "var(--color-border)" }}>
      <div className="container-max section-padding py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 font-mono font-bold text-xl w-fit"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-gradient">Mark.dev</span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {siteConfig.description}
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">Quick Links</h3>
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">Get In Touch</h3>
            <div className="flex flex-col gap-3">
              <Link
                href={"mailto:" + siteConfig.author.email}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                {siteConfig.author.email}
              </Link>
              <Link
                href={"https://github.com/" + siteConfig.author.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                <GitBranch className="w-4 h-4" />
                {"github.com/" + siteConfig.author.github}
              </Link>
            </div>
          </div>

        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "var(--color-border)" }}>
          <p className="text-muted-foreground text-sm">
            {"© " + currentYear + " " + siteConfig.author.name + ". All rights reserved."}
          </p>
          <p className="text-muted-foreground text-sm flex items-center gap-1">
            Built with
            <Heart className="w-3 h-3 mx-1" style={{ color: "red", fill: "red" }} />
            using Next.js and Tailwind
          </p>
        </div>

      </div>
    </footer>
  );
}