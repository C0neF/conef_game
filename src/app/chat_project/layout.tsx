import type { Metadata } from "next";
import { ThemeProvider } from "./contexts/ThemeContext";

export const metadata: Metadata = {
  title: "聊天应用",
  description: "基于 Next.js 和 TailwindCSS 的现代聊天界面",
};

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}
