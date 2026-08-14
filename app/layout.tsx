import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rahma — Generation Storyboard",
  description: "A continuity-first 10-second generation storyboard for Rahma.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
