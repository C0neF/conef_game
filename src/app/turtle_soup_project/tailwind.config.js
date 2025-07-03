/** @type {import('tailwindcss').Config} */
module.exports = {
  // 最小配置，仅用于 shadcn/ui 兼容性
  // 实际配置在 CSS 中的 @theme 指令中
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require("tailwindcss-animate")],
}
