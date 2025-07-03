import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./chat_project/app/globals.css";
import "./gomoku_project/app/globals.css";
import "./webgpu_project/app/globals.css";
import "./turtle_soup_project/app/globals.css";
import { ThemeProvider } from "./chat_project/contexts/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Game Hub - Conef Game",
  description: "A modern web application hub for Chat Room, Gomoku Game, and WebGPU Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider defaultTheme="system" storageKey="game-hub-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
