"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function DonateSuccess() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-lg mx-auto px-4 pt-32 pb-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
          <p className="text-muted-foreground text-lg mb-8">
            Your donation was successful. Your support helps keep this portfolio 
            and my projects running. I truly appreciate it!
          </p>
          <Link
            href="/"
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Back to Portfolio
          </Link>
        </motion.div>
      </div>
      <Footer />
    </main>
  );
}