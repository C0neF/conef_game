"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Define the structure for the AI puzzle prop - MUST match page.tsx
interface AiPuzzle {
  description: string
  title?: string
  solution: string // Ensure solution field is present
}

// Define the structure for the AI answer prop
interface AiAnswer {
  text: string;
  isError?: boolean;
}

// Update GameDialogProps to include selectedAnswerModel
interface GameDialogProps {
  isEnglish: boolean
  compact?: boolean
  apiUrl?: string
  apiKey?: string
  // Model selection
  selectedModel?: string
  selectedAnswerModel?: string
  // Use history and index
  puzzleHistory: AiPuzzle[] // Use the updated AiPuzzle interface
  currentPuzzleIndex: number
  // Navigation functions
  goToPreviousPuzzle: () => void
  goToNextPuzzle: () => void
  // Fetch state for NEW puzzles
  isFetchingPuzzle: boolean
  fetchPuzzleError: string | null
  fetchAiPuzzle: () => Promise<void>
  // Question answering props
  aiAnswer: AiAnswer | null
  isFetchingAnswer: boolean
  handleAskQuestion: (question: string) => Promise<void>
  // Add props for question limit
  questionCount: number
  questionLimit: number
  // Add props for settings loading state
  isLoadingModels: boolean
  isSettingsLoaded: boolean
}

export default function GameDialog({
  isEnglish,
  compact = false,
  apiUrl,
  apiKey,
  selectedModel,
  selectedAnswerModel,
  // Destructure new/updated props
  puzzleHistory,
  currentPuzzleIndex,
  goToPreviousPuzzle,
  goToNextPuzzle,
  isFetchingPuzzle,
  fetchPuzzleError,
  fetchAiPuzzle,
  aiAnswer,
  isFetchingAnswer,
  handleAskQuestion,
  // Destructure question limit props
  questionCount,
  questionLimit,
  // Destructure settings loading props
  isLoadingModels,
  isSettingsLoaded,
}: GameDialogProps) {
  const [userQuestion, setUserQuestion] = useState("")
  const [isSolutionVisible, setIsSolutionVisible] = useState(false) // State for solution visibility
  const settingsConfigured = Boolean(apiUrl && apiKey && (selectedModel || '') && (selectedAnswerModel || ''));

  // Get the current puzzle based on the index
  const currentPuzzle = puzzleHistory[currentPuzzleIndex];

  // Reset solution visibility when puzzle index changes
  useEffect(() => {
    setIsSolutionVisible(false);
  }, [currentPuzzleIndex]);

  // Determine if the question limit has been reached
  const limitReached = questionCount >= questionLimit;

  // Determine what to display in the description area
  let puzzleDisplayContent: React.ReactNode
  if (!settingsConfigured) {
    puzzleDisplayContent = (
      <p className="text-sm text-muted-foreground italic">
        {isEnglish
          ? "Click the settings icon (top right) to enter your AI API URL, Key and select both question and answer models, then click \"New Puzzle\"."
          : '点击右上角的设置按钮填写 AI 的 API 地址和密钥(可以点击设置按钮右侧的按钮查看教程获取)，并选择问题模型和回答模型，然后点击"新谜题"。'}
      </p>
    )
  } else if (isLoadingModels) {
    puzzleDisplayContent = (
      <p className="text-sm text-muted-foreground italic">
        {isEnglish ? "Loading models..." : "正在加载模型..."}
      </p>
    )
  } else if (!isSettingsLoaded) {
    puzzleDisplayContent = (
      <p className="text-sm text-muted-foreground italic">
        {isEnglish ? "Loading settings..." : "正在加载设置..."}
      </p>
    )
  } else if (isFetchingPuzzle) {
    puzzleDisplayContent = (
      <p className="text-sm text-muted-foreground italic">
        {isEnglish ? "Generating puzzle..." : "正在生成谜题..."}
      </p>
    )
  } else if (fetchPuzzleError) {
    puzzleDisplayContent = (
      <p className="text-sm text-red-600">
        {isEnglish ? "Error: " : "错误："} {fetchPuzzleError}
      </p>
    )
  } else if (!currentPuzzle) {
    puzzleDisplayContent = (
      <p className="text-sm text-muted-foreground italic">
        {isEnglish
          ? "Click \"New Puzzle\" to start a new mystery."
          : '点击"新谜题"开始一个新的神秘事件。'}
      </p>
    )
  } else {
    // Display the current puzzle
    puzzleDisplayContent = (
      <div className="space-y-2">
        <p className="text-sm leading-relaxed">{currentPuzzle.description}</p>
        {isSolutionVisible && currentPuzzle.solution && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
              {isEnglish ? "Solution:" : "谜底："}
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">{currentPuzzle.solution}</p>
          </div>
        )}
      </div>
    )
  }

  const handleSubmitQuestion = async () => {
    if (!userQuestion.trim() || isFetchingAnswer || limitReached) return

    await handleAskQuestion(userQuestion)
    setUserQuestion("") // Clear the input after asking
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmitQuestion()
    }
  }

  return (
    <Card className={`w-full ${compact ? "max-w-2xl" : "max-w-4xl"} mx-auto`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">
              {isEnglish ? "Turtle Soup Mystery" : "乌龟汤谜题"}
            </CardTitle>
            <CardDescription className="text-sm">
              {isEnglish
                ? "Ask yes/no questions to solve the mystery"
                : "通过是/否问题解开谜题"}
            </CardDescription>
          </div>
          
          {/* Navigation and New Puzzle Controls */}
          <div className="flex items-center gap-2">
            {/* Navigation buttons - only show if there are puzzles */}
            {puzzleHistory.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToPreviousPuzzle}
                  disabled={currentPuzzleIndex <= 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-xs text-muted-foreground px-2">
                  {currentPuzzleIndex + 1} / {puzzleHistory.length}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={goToNextPuzzle}
                  disabled={currentPuzzleIndex >= puzzleHistory.length - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
            
            {/* New Puzzle Button */}
            <Button
              onClick={fetchAiPuzzle}
              disabled={isFetchingPuzzle || !settingsConfigured || isLoadingModels || !isSettingsLoaded}
              size="sm"
            >
              {isFetchingPuzzle
                ? (isEnglish ? "Generating..." : "生成中...")
                : (isEnglish ? "New Puzzle" : "新谜题")}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Puzzle Description Area */}
        <div className="min-h-[100px] p-3 bg-muted rounded-md">
          {puzzleDisplayContent}
        </div>

        {/* Question Input and Answer Area - Only show if there's a current puzzle */}
        {currentPuzzle && (
          <div className="space-y-3">
            {/* Question Counter */}
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>
                {isEnglish ? "Questions asked:" : "已提问："} {questionCount} / {questionLimit}
              </span>
              {limitReached && (
                <span className="text-red-600 font-medium">
                  {isEnglish ? "Question limit reached" : "已达到提问上限"}
                </span>
              )}
            </div>

            {/* Question Input */}
            <div className="space-y-2">
              <Textarea
                placeholder={isEnglish ? "Ask a yes/no question..." : "提出一个是/否问题..."}
                value={userQuestion}
                onChange={(e) => setUserQuestion(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isFetchingAnswer || limitReached}
                className="min-h-[80px] resize-none"
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmitQuestion}
                  disabled={!userQuestion.trim() || isFetchingAnswer || limitReached}
                  className="flex-1"
                >
                  {isFetchingAnswer
                    ? (isEnglish ? "Thinking..." : "思考中...")
                    : (isEnglish ? "Ask Question" : "提问")}
                </Button>
                
                {/* View Solution Button */}
                <Button
                  variant="outline"
                  onClick={() => setIsSolutionVisible(!isSolutionVisible)}
                  disabled={!currentPuzzle.solution || currentPuzzle.solution.includes("not parsed") || currentPuzzle.solution.includes("未解析")}
                >
                  {isSolutionVisible
                    ? (isEnglish ? "Hide Solution" : "隐藏谜底")
                    : (isEnglish ? "View Solution" : "查看谜底")}
                </Button>
              </div>
            </div>

            {/* AI Answer Display */}
            {aiAnswer && (
              <div className={`p-3 rounded-md ${aiAnswer.isError ? "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800" : "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"}`}>
                <h4 className={`font-medium mb-1 ${aiAnswer.isError ? "text-red-800 dark:text-red-200" : "text-blue-800 dark:text-blue-200"}`}>
                  {isEnglish ? "Answer:" : "回答："}
                </h4>
                <p className={`text-sm ${aiAnswer.isError ? "text-red-700 dark:text-red-300" : "text-blue-700 dark:text-blue-300"}`}>
                  {aiAnswer.text}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
