import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import 'mapbox-gl/dist/mapbox-gl.css';

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RaahSaathi – Navigate Your World with Confidence",
  description: "Real-time accessibility navigation for the visually impaired and physically disabled. Community-powered barrier reports, AI classification, and accessible route planning.",
  keywords: ["accessibility", "navigation", "disability", "barrier reports", "route planner"],
  openGraph: {
    title: "RaahSaathi – Navigate Your World with Confidence",
    description: "Real-time accessibility information for the visually impaired and physically disabled.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
