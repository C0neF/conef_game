interface FooterProps {
  isEnglish: boolean
  isDarkMode: boolean
}

export default function Footer({ isEnglish, isDarkMode }: FooterProps) {
  return (
    <footer className={`py-2 border-t ${isDarkMode ? "border-gray-800" : "border-gray-200"}`}>
      <div className="container mx-auto px-4">
        <div className="text-center text-xs text-muted-foreground">
          <p>© 2025 Turtle Soup Reasoning Game. {isEnglish ? "All rights reserved." : "保留所有权利。"}</p>
        </div>
      </div>
    </footer>
  )
}
