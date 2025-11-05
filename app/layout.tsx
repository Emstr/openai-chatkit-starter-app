import Script from "next/script";
import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { FloatingChat } from "@/components/FloatingChat";

const onest = Onest({
  subsets: ["latin"],
  variable: "--font-onest",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ask Marloo",
  description: "Ask Marloo - Your AI assistant for help with any questions",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/faviconzz.ico", type: "image/x-icon" },
    ],
    shortcut: "/faviconzz.ico",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={onest.variable}>
      <head>
        <Script
          src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js?publicKey=domain_pk_68fb9921e13881908b45fd6f6b4149ac0fdc061de51ddba7"
          strategy="beforeInteractive"
        />
      </head>
      <body className="antialiased flex flex-col min-h-screen font-sans">
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <FloatingChat />
      </body>
    </html>
  );
}
