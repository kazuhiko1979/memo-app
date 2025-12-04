import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ToastProvider";

export const metadata: Metadata = {
  title: "TagNote | タグとカテゴリで整理するメモ",
  description:
    "TagNote はカテゴリとタグで立体的に整理し、Markdownで美しく書けるメモアプリです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
