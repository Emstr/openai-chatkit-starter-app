"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

// Icon components
const QuestionIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <line x1="12" y1="17" x2="12.01" y2="17" stroke="#EC4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SpeakersIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="9" cy="7" r="4" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  </svg>
);

const TalksIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" fill="#A855F7"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <line x1="12" y1="19" x2="12" y2="23" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="8" y1="23" x2="16" y2="23" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AgendaIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <line x1="16" y1="2" x2="16" y2="6" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="8" y1="2" x2="8" y2="6" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="3" y1="10" x2="21" y2="10" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function App() {
  const quickLinks = [
    { href: "#", label: "Ask a question", icon: QuestionIcon },
    { href: "/speakers", label: "View Speakers", icon: SpeakersIcon },
    { href: "/talks", label: "View Talks", icon: TalksIcon },
    { href: "/agenda", label: "View Agenda", icon: AgendaIcon },
  ];

  const [showEvent, setShowEvent] = useState(true);

  useEffect(() => {
    // Hide event after 6pm on November 18, 2025
    const eventEndDate = new Date("2025-11-18T18:00:00");
    const now = new Date();
    
    if (now > eventEndDate) {
      setShowEvent(false);
    }
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-start px-6 pt-12 pb-20 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/b-gradient.png)',
        }}
      />
      
      <div className="text-center max-w-4xl mx-auto relative z-10">
        {/* Main Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-white">
          Ask Marloo anything about FAAA
        </h1>

        {/* Descriptive Text */}
        <p className="text-xl md:text-2xl text-white max-w-3xl mx-auto mb-12 leading-relaxed">
          It knows about all the speakers and talks
        </p>

        {/* Quick Links - Rounded Rectangle White Buttons */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
          {quickLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center gap-2 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 px-6 py-3 text-base font-medium text-gray-900 dark:text-white transition-all hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md"
              >
                <IconComponent />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Event Banner - More appealing design */}
        {showEvent && (
          <div className="mt-8 max-w-lg mx-auto">
            <div className="group relative rounded-xl bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-blue-950/20 px-6 py-5 text-center transition-all hover:shadow-lg border-2 border-pink-200/50 dark:border-pink-800/30 hover:border-pink-300 dark:hover:border-pink-700/50 overflow-hidden">
              {/* Decorative background elements */}
              <div className="absolute inset-0 opacity-10 dark:opacity-5">
                <div className="absolute top-0 right-0 w-32 h-32 bg-pink-400 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-400 rounded-full blur-2xl"></div>
              </div>
              
              <div className="relative z-10">
                <div className="mb-2">
                  <h2 className="text-xs md:text-sm font-bold text-gray-900 dark:text-white leading-tight">
                    Meet the Marloo team at Flight Club
                  </h2>
                </div>
                <p className="text-sm md:text-base font-bold text-gray-700 dark:text-gray-300 mb-2">
                  6:15 on Tuesday the 18th – Flight Club Perth
                </p>
                <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-3 max-w-md mx-auto">
                  Join the Marloo team for some friendly competition, drinks and bites at Flight Club Perth during the FAAA Congress.
                </p>
                <div className="flex items-center justify-between gap-3 mt-4">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-900/30 border border-pink-200 dark:border-pink-800">
                    <span className="w-2 h-2 bg-pink-500 rounded-full animate-pulse"></span>
                    <span className="text-xs font-semibold text-pink-700 dark:text-pink-300">
                      Limited spots remaining
                    </span>
                  </div>
                  <a
                    href="https://luma.com/udhpq1il"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-pink-600 hover:bg-pink-700 text-white px-5 py-2 text-sm font-semibold transition-colors shadow-sm hover:shadow-md whitespace-nowrap"
                  >
                    RSVP now
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
