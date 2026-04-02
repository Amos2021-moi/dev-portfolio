"use client";

import { useState, useEffect, useRef } from "react";
import { QrCode, Download, X } from "lucide-react";

interface QRCodeProps {
  url: string;
  title: string;
}

export default function ProjectQRCode({ url, title }: QRCodeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isOpen || !canvasRef.current) return;

    import("qrcode").then((QRCode) => {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 200,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
    });
  }, [isOpen, url]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = title.replace(/\s+/g, "-").toLowerCase() + "-qr.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg border text-sm hover:bg-accent transition-colors"
        style={{ borderColor: "var(--color-border)" }}
        title="Show QR Code"
      >
        <QrCode className="w-4 h-4" />
        QR Code
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div
            className="bg-background rounded-2xl border p-6 max-w-xs w-full mx-4 shadow-2xl text-center"
            style={{ borderColor: "var(--color-border)" }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold">QR Code</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-accent transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-4 truncate">
              {title}
            </p>

            <div className="flex justify-center mb-4 p-4 bg-white rounded-xl">
              <canvas ref={canvasRef} />
            </div>

            <p className="text-xs text-muted-foreground mb-4">
              Scan to view this project on any device
            </p>

            <button
              onClick={handleDownload}
              className="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Download className="w-4 h-4" />
              Download QR Code
            </button>
          </div>
        </div>
      )}
    </>
  );
}