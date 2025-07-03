"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Moon, Sun, Home } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function TutorialPage() {
  const router = useRouter()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isEnglish, setIsEnglish] = useState(false)

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const toggleLanguage = () => {
    setIsEnglish(!isEnglish);
  }

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <header className="p-3 flex justify-between items-center w-full max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-2">
          {/* 返回主页按钮 */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.push('/')}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
            title={isEnglish ? "Back to Game Hub" : "返回游戏中心"}
          >
            <Home className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" onClick={toggleLanguage}>
            {isEnglish ? "中文" : "EN"}
          </Button>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center w-full">
        <div className="w-full max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6 text-center">
            {isEnglish ? "Turtle Soup Reasoning Game - Tutorial" : "乌龟汤推理游戏 - 教程"}
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <section className="bg-muted p-4 rounded-lg h-full">
              <h2 className="text-xl font-semibold mb-2">
                {isEnglish ? "What is Turtle Soup?" : "什么是乌龟汤？"}
              </h2>
              <p className="mb-2 text-sm">
                {isEnglish 
                  ? "Turtle Soup is a deductive reasoning game where players try to solve a mysterious scenario by asking yes/no questions. The game host (AI) knows the full story and will only answer with 'Yes', 'No', 'Yes and No', or 'Irrelevant'."
                  : "乌龟汤是一种推理游戏，玩家通过提出是/否问题来解决谜题场景。游戏主持人（AI）了解完整的故事，只会用'是'、'否'、'是也不是'或'无关'来回答。"}
              </p>
              <p className="text-sm">
                {isEnglish
                  ? "The game originates from 'situation puzzles' or 'lateral thinking puzzles', but is widely known as 'Turtle Soup' in some regions of Asia due to a classic example involving turtle soup."
                  : "这个游戏源自'情境谜题'或'横向思维谜题'，但在亚洲某些地区广泛地被称为'乌龟汤'，因为一个经典例子涉及乌龟汤。"}
              </p>
            </section>
            
            <section className="bg-muted p-4 rounded-lg h-full">
              <h2 className="text-xl font-semibold mb-2">
                {isEnglish ? "Tips for Better Play" : "更好游戏的技巧"}
              </h2>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>
                  {isEnglish
                    ? "Ask specific questions rather than vague ones."
                    : "提出具体问题而不是模糊的问题。"}
                </li>
                <li>
                  {isEnglish
                    ? "Build on information from previous answers to narrow down possibilities."
                    : "基于之前的回答信息来缩小可能性范围。"}
                </li>
                <li>
                  {isEnglish
                    ? "Pay attention to 'Yes and No' answers - they often contain critical nuances."
                    : "注意'是也不是'的回答 - 它们通常包含关键的细微差别。"}
                </li>
                <li>
                  {isEnglish
                    ? "When you get an 'Irrelevant' answer, it means that line of inquiry won't help solve the puzzle."
                    : "当你得到'无关'的回答时，意味着那条查询路线无助于解决谜题。"}
                </li>
                <li>
                  {isEnglish
                    ? "Take notes to keep track of what you've learned from each question."
                    : "做笔记记录你从每个问题中学到的内容。"}
                </li>
              </ul>
            </section>

            <section className="bg-muted p-4 rounded-lg h-full md:col-span-2">
              <h2 className="text-xl font-semibold mb-2">
                {isEnglish ? "How to Play" : "如何游戏"}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-medium mb-1">
                    {isEnglish ? "Setup" : "设置"}
                  </h3>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      {isEnglish
                        ? "Click the gear icon in the top right corner to open settings."
                        : "点击右上角的齿轮图标打开设置。"}
                    </li>
                    <li>
                      {isEnglish ? (
                        <>
                          Register at <a href="https://account.siliconflow.cn/zh/login" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">SiliconFlow</a> if you don't have an API key.
                        </>
                      ) : (
                        <>
                          如果没有API密钥，可以访问 <a href="https://account.siliconflow.cn/zh/login" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">硅基流动</a> 注册账号。
                        </>
                      )}
                    </li>
                    <li>
                      {isEnglish
                        ? "After registration, click 'API Keys' to create a new key."
                        : "注册后，点击'API密钥'创建新密钥。"}
                    </li>
                    <li>
                      {isEnglish
                        ? "Copy your API key and paste it in the settings dialog."
                        : "复制API密钥并粘贴到设置对话框中。"}
                    </li>
                    <li>
                      {isEnglish
                        ? "Enter 'api.siliconflow.cn' as the API URL."
                        : "在API URL中输入'api.siliconflow.cn'。"}
                    </li>
                    <li>
                      {isEnglish
                        ? "Select models for both questions and answers."
                        : "选择问题和回答使用的模型。"}
                    </li>
                    <li>
                      {isEnglish
                        ? "Recommend using 'DeepSeek-R1(deepseek-ai/DeepSeek-R1)' for questions and 'DeepSeek-V3(deepseek-ai/DeepSeek-V3)' for answers."
                        : "推荐使用'DeepSeek-R1(deepseek-ai/DeepSeek-R1)'作为问题模型，'DeepSeek-V3(deepseek-ai/DeepSeek-V3)'作为回答模型。"}
                    </li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1">
                    {isEnglish ? "Gameplay" : "游戏过程"}
                  </h3>
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      {isEnglish
                        ? "Click 'New Puzzle' to generate a mystery scenario."
                        : "点击'新谜题'生成一个神秘场景。"}
                    </li>
                    <li>
                      {isEnglish
                        ? "Read the scenario carefully to understand the setting."
                        : "仔细阅读场景以理解情境。"}
                    </li>
                    <li>
                      {isEnglish
                        ? "Type yes/no questions in the text area to gather information."
                        : "在文本区域输入是/否问题以收集信息。"}
                    </li>
                    <li>
                      {isEnglish
                        ? "Click 'Ask Question' to submit your question."
                        : "点击'提问'提交你的问题。"}
                    </li>
                    <li>
                      {isEnglish
                        ? "The AI will answer with 'Yes', 'No', 'Yes and No', or 'Irrelevant'."
                        : "AI将回答'是'、'否'、'是也不是'或'无关'。"}
                    </li>
                    <li>
                      {isEnglish
                        ? "You have a limited number of questions (10 by default)."
                        : "你有有限的问题次数（默认为10次）。"}
                    </li>
                    <li>
                      {isEnglish
                        ? "Use logic to deduce the solution based on the answers."
                        : "根据回答使用逻辑推理出解决方案。"}
                    </li>
                    <li>
                      {isEnglish
                        ? "When ready, click 'View Solution' to see if you were right."
                        : "准备好后，点击'查看谜底'看看你是否正确。"}
                    </li>
                  </ol>
                </div>
              </div>
            </section>
            
            <div className="text-center mt-6 md:col-span-2">
              <Link href="/turtle_soup_project">
                <Button size="lg">
                  {isEnglish ? "Return to Game" : "返回游戏"}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-3 border-t border-gray-200 dark:border-gray-800">
        <div className="w-full max-w-3xl mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Turtle Soup Reasoning Game. {isEnglish ? "All rights reserved." : "保留所有权利。"}</p>
        </div>
      </footer>
    </div>
  )
}
