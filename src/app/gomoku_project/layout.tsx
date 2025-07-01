import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "五子棋在线对战游戏",
  description: "基于 Next.js 和 WebRTC 技术的实时五子棋对战游戏，支持移动端和桌面端",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function GomokuLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
