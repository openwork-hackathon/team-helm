import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HELM - Human-Agent Continuity",
  description: "Tools that help humans maintain momentum on open work without pressure or overwhelm.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.Node;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">
        {children}
      </body>
    </html>
  );
}
