import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediPulse — Hospital Resource Analytics Dashboard",
  description:
    "Interactive analytics dashboard visualising hospital resource utilisation, disease trends, and operational metrics across 5 hospitals in India (Jan 2025 – May 2026).",
  keywords: ["hospital analytics", "healthcare dashboard", "ICU utilisation", "COVID trends", "India health data"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
