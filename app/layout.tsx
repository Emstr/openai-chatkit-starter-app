import Script from "next/script";
import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/Navigation";

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
    <html lang="en">
      <head>
        <Script
          src="https://cdn.platform.openai.com/deployments/chatkit/chatkit.js?publicKey=domain_pk_68fb9921e13881908b45fd6f6b4149ac0fdc061de51ddba7"
          strategy="beforeInteractive"
        />
      </head>
      <body className="antialiased">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
