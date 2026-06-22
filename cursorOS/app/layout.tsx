import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CursorOS",
  description: "AI desktop theme generator for wallpaper, cursor packs, and palettes."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
