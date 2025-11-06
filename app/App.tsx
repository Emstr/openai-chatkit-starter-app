"use client";

import Link from "next/link";

export default function App() {
  const quickLinks = [
    { href: "/speakers", label: "View Speakers", icon: "👥" },
    { href: "/talks", label: "View Talks", icon: "🎤" },
    { href: "/agenda", label: "View Agenda", icon: "📅" },
  ];

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 px-6">
      <div className="text-center">
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight">
          Ask{" "}
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Marloo
          </span>{" "}
          Anything
        </h1>
        <p className="mt-6 text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Your AI assistant for all things FAAA and more
        </p>

        {/* Quick Links */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-3 rounded-xl border-2 border-gray-200 bg-white px-6 py-4 text-lg font-medium text-gray-900 shadow-sm transition-all hover:border-blue-400 hover:shadow-md dark:border-gray-700 dark:bg-slate-800 dark:text-white dark:hover:border-blue-500"
            >
              <span className="text-2xl">{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
