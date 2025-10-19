"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#0c4a6e] text-white">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-6xl font-semibold mb-6"
      >
        SchematicSense
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-lg text-gray-300 max-w-xl text-center mb-8"
      >
        AI-powered schematic analysis for smarter circuit design.
      </motion.p>

      <Link
        href="/login"
        className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 hover:bg-white/20 transition-all"
      >
        Get Started
      </Link>

      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-6 text-sm text-gray-500"
      >
        Made by Triaksha Singh © 2025
      </motion.footer>
    </main>
  );
}
