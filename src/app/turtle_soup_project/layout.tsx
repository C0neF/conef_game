import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./app/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "乌龟汤推理游戏",
  description: "挑战你的推理能力，解开谜题和神秘事件。",
};

export default function TurtleSoupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={inter.className}>
      {children}
    </div>
  );
}
