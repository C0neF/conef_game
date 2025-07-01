import type { Metadata } from "next";
import { ThemeProvider } from "./contexts/ThemeContext";

export const metadata: Metadata = {
  title: "快艇骰子游戏",
  description: "使用 WebGPU 和 Three.js 开发的快艇骰子游戏",
};

export default function WebGPULayout({
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
