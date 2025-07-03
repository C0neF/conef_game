"use client"

import { useState, useEffect } from "react"
import { Moon, Settings, Sun, Info, Home } from "lucide-react"
import { Button } from "./components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./components/ui/dialog"
import { Input } from "./components/ui/input"
import { Label } from "./components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./components/ui/select"
import { Textarea } from "./components/ui/textarea"
import Footer from "./components/footer"
import GameDialog from "./components/game-dialog"
import { puzzleGeneratorConfig, questionAnswererConfig, getPuzzleGeneratorSystemPrompt, getQuestionAnswererSystemPrompt } from "./lib/aiConfig"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "../chat_project/contexts/ThemeContext"

// Define types for the model data and puzzle data
interface ApiModel {
  id: string
  name?: string // Optional name property
}
interface AiPuzzle {
  description: string
  title?: string // Optional title from AI
  solution: string // Add field for the puzzle solution
}

// Add state for AI answer
interface AiAnswer {
  text: string;
  isError?: boolean;
}

export default function TurtleSoupGame() {
  const router = useRouter()
  const { resolvedTheme, toggleTheme } = useTheme()
  const [isEnglish, setIsEnglish] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  // State for Settings Dialog
  const [apiUrl, setApiUrl] = useState("")
  const [apiKey, setApiKey] = useState("")
  const [models, setModels] = useState<ApiModel[]>([])
  const [selectedModel, setSelectedModel] = useState<string | undefined>(undefined)
  const [selectedAnswerModel, setSelectedAnswerModel] = useState<string | undefined>(undefined)
  const [isLoadingModels, setIsLoadingModels] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false) // Track settings load state

  // Replace single puzzle state with history
  // const [aiPuzzle, setAiPuzzle] = useState<AiPuzzle | null>(null)
  const [puzzleHistory, setPuzzleHistory] = useState<AiPuzzle[]>([])
  const [currentPuzzleIndex, setCurrentPuzzleIndex] = useState<number>(-1) // -1 indicates no puzzle selected

  const [isFetchingPuzzle, setIsFetchingPuzzle] = useState(false)
  const [fetchPuzzleError, setFetchPuzzleError] = useState<string | null>(null)

  // Add state for the AI's answer to user questions
  const [aiAnswer, setAiAnswer] = useState<AiAnswer | null>(null);
  const [isFetchingAnswer, setIsFetchingAnswer] = useState(false);

  // Question Limit State
  const [questionCount, setQuestionCount] = useState(0);
  const [questionLimit, setQuestionLimit] = useState(10);  // 默认值为10，现在是动态的

  const toggleDarkMode = () => {
    toggleTheme()
  }

  const toggleLanguage = () => {
    setIsEnglish(!isEnglish);
  }

  // Fetch models when API URL and Key are provided
  useEffect(() => {
    const fetchModels = async () => {
      if (apiUrl && apiKey) {
        // Validate URL format before attempting fetch
        if (!apiUrl.trim() || apiUrl.trim().length < 3) {
          setFetchError("Please enter a valid API URL")
          return
        }

        setIsLoadingModels(true)
        setFetchError(null)
        setModels([]) // Clear previous models
        
        // 保存当前选择的模型，稍后恢复
        const currentSelectedModel = selectedModel;
        const currentAnswerModel = selectedAnswerModel;
        
        try {
          // Ensure URL starts with http:// or https://
          let fullUrl = apiUrl
          if (!/^https?:\/\//i.test(fullUrl)) {
             // Basic check, might need refinement
             // For simplicity, assuming http if no protocol is specified.
             // Consider adding validation or forcing https in a real app.
            console.warn("API URL does not specify protocol, defaulting to http. Consider using https.")
            fullUrl = `http://${apiUrl}`
          }
          // Append /v1/models if not already present at the end
          if (!fullUrl.endsWith('/v1/models')) {
              if (fullUrl.endsWith('/')) {
                  fullUrl += 'v1/models';
              } else {
                  fullUrl += '/v1/models';
              }
          }

          console.log(`Attempting fetch from full URL: ${fullUrl}`)

          const response = await fetch(fullUrl, {
            headers: {
              Authorization: `Bearer ${apiKey}`,
            },
            // Add timeout and error handling
            signal: AbortSignal.timeout(10000), // 10 second timeout
          })

          console.log(`Response status: ${response.status}`)


          if (!response.ok) {
            const errorData = await response.text() // Read error body as text
            console.error("API Error Response:", errorData)
            throw new Error(
              `Failed to fetch models: ${response.status} ${response.statusText}. ${errorData}`
            )
          }

          const data = await response.json()
          console.log("API Response Data:", data)


          // Adjust based on the actual structure of the API response
          // Assuming the response has a 'data' array field containing model objects like { id: 'model-id', ... }
           if (data && Array.isArray(data.data)) {
             setModels(data.data)
           } else if (Array.isArray(data)) {
             // Handle cases where the response is directly an array of models
             setModels(data);
           } else {
             console.error("Unexpected API response structure:", data)
             throw new Error("Unexpected API response structure")
           }
           
           // 恢复之前选择的模型（如果存在）
           if (currentSelectedModel) {
             setSelectedModel(currentSelectedModel);
           }
           if (currentAnswerModel) {
             setSelectedAnswerModel(currentAnswerModel);
           }
        } catch (error) {
          console.error("Fetch models error:", error)

          // Provide user-friendly error messages
          let errorMessage = "Failed to connect to API server"

          if (error instanceof Error) {
            if (error.name === 'AbortError' || error.message.includes('timeout')) {
              errorMessage = "Connection timeout. Please check your API URL and try again."
            } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
              errorMessage = "Cannot connect to API server. Please check your API URL and network connection."
            } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
              errorMessage = "Invalid API key. Please check your API key and try again."
            } else if (error.message.includes('404')) {
              errorMessage = "API endpoint not found. Please check your API URL."
            } else {
              errorMessage = error.message
            }
          }

          setFetchError(errorMessage)
          setModels([]) // Clear models on error
        } finally {
          setIsLoadingModels(false)
        }
      } else {
        // Clear models if URL or Key is missing
        setModels([])
        setSelectedModel(undefined)
        setFetchError(null)
      }
    }

    // Debounce fetching slightly or fetch directly
    const timerId = setTimeout(() => {
       fetchModels()
    }, 500); // Fetch after 500ms pause in typing URL/Key

    return () => clearTimeout(timerId); // Cleanup timer on unmount or dependency change

  }, [apiUrl, apiKey]) // Re-run effect when apiUrl or apiKey changes


  // Function to parse multiple puzzles from the response format
  const parsePuzzlesFromText = (text: string, isEnglish: boolean): AiPuzzle[] => {
    const puzzles: AiPuzzle[] = [];
    // Simplified and potentially more robust regex
    const puzzleRegex = isEnglish
      ? /Scenario\s*(\d+)\s*:\s*([\s\S]*?)Solution\s*\1\s*:\s*([\s\S]*?)(?=\s*Scenario\s*\d+\s*:|$)/g
      : /谜面\s*(\d+)\s*[:：]\s*([\s\S]*?)谜底\s*\1\s*[:：]\s*([\s\S]*?)(?=\s*谜面\s*\d+\s*[:：]|$)/g;

    console.log("Attempting to parse text with simplified puzzle regex:", text);

    let match;
    let foundMatches = false; // Flag to track if main regex found anything
    while ((match = puzzleRegex.exec(text)) !== null) {
      foundMatches = true; // Mark that we found at least one match
      console.log("Puzzle Match:", match);
      const puzzleNumber = match[1];
      let scenarioContent = match[2]?.trim() || '';
      let solutionContent = match[3]?.trim() || '';

      // Clean content (remove potential wrapping brackets/braces)
      scenarioContent = scenarioContent.replace(/^\{\{|\}\}$/g, "").trim();
      solutionContent = solutionContent.replace(/^\{\{|\}\}$/g, "").trim();

      if (scenarioContent && solutionContent) {
        console.log(`Found Puzzle #${puzzleNumber}:`);
        console.log("  Scenario:", scenarioContent);
        console.log("  Solution:", solutionContent);
        puzzles.push({
          description: scenarioContent,
          solution: solutionContent,
          title: `${isEnglish ? "AI Puzzle" : "AI 谜题"} #${puzzles.length + 1}`
        });
      } else {
        console.warn(`Match found but missing content for puzzle #${puzzleNumber}:`, { scenario: scenarioContent, solution: solutionContent });
      }
    }

    // Fallback parsing (might only get description)
    if (!foundMatches) { // Only run fallback if main regex failed
      console.log("Main regex found no matches. Trying fallback parsing method (description only).");
      const lines = text.split(/\n+/);
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if ((line.includes("谜面") || line.includes("Scenario"))) {
          const description = line.split(/[:：]/)[1]?.trim().replace(/^\{\{|\}\}$/g, "").trim();
          if (description) {
             // Fallback: We don't have the solution here
            console.warn("Fallback parsed only description:", description);
            puzzles.push({
              description,
              solution: isEnglish ? "(Solution not parsed)" : "（谜底未解析）", // Provide a placeholder for missing solution
              title: `${isEnglish ? "AI Puzzle" : "AI 谜题"} #${puzzles.length + 1}`
            });
          }
        }
      }
    }

    console.log(`Parsed ${puzzles.length} puzzles from text.`);
    return puzzles;
  };

  // Function to fetch a new puzzle from the AI
  const fetchAiPuzzle = async () => {
    // If models are still loading but settings exist, show a pending state instead of error
    if (isLoadingModels && apiUrl && apiKey) {
      setFetchPuzzleError(isEnglish ? "Loading models, please wait..." : "正在加载模型，请稍候...")
      return;
    }
    
    if (!apiUrl || !apiKey || !selectedModel) {
      setFetchPuzzleError(isEnglish ? "API settings are incomplete." : "API 设置不完整。")
      return
    }

    setIsFetchingPuzzle(true)
    setFetchPuzzleError(null)
    setAiAnswer(null);
    setQuestionCount(0); // Reset question count for new puzzle

    // Get config (contains User Prompt and temp)
    const config = puzzleGeneratorConfig(isEnglish);
    // Get the System Prompt, passing the language state
    const systemPrompt = getPuzzleGeneratorSystemPrompt(isEnglish);
    // Get the User Prompt
    const userPrompt = config.prompt;
    const maxTokens = 500;

    console.log(`Fetching puzzle using model: ${selectedModel} from ${apiUrl}`)

    // Construct the endpoint - assuming OpenAI compatible API
    let chatUrl = apiUrl
    if (!/^https?:\/\//i.test(chatUrl)) {
        console.warn("API URL does not specify protocol, defaulting to http. Consider using https.")
        chatUrl = `http://${apiUrl}`
    }
    // Append /v1/chat/completions if not already present
    if (!chatUrl.includes('/v1/chat/completions')) {
        if (chatUrl.endsWith('/')) {
            chatUrl += 'v1/chat/completions';
        } else if (!chatUrl.includes('/v1/')) { // Basic check if /v1/ path exists
             chatUrl += '/v1/chat/completions';
        } else {
             // Assume the path is already correct if /v1/ is present but not the full path
             // Or handle more specific cases if needed
            console.warn("API URL structure might be unexpected. Assuming it's correct.")
        }
    }

    console.log(`Attempting fetch from chat URL: ${chatUrl}`)

    try {
      const response = await fetch(chatUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            // Add System Prompt
            { role: "system", content: systemPrompt },
            // Add User Prompt
            { role: "user", content: userPrompt }
          ],
          max_tokens: maxTokens,
          temperature: config.temperature
        }),
      })

      console.log(`Puzzle fetch response status: ${response.status}`)

      if (!response.ok) {
        const errorData = await response.text()
        console.error("Puzzle API Error Response:", errorData)
        throw new Error(
          `Failed to fetch puzzle: ${response.status} ${response.statusText}. ${errorData}`
        )
      }

      const data = await response.json()
      console.log("Puzzle API Response Data:", data)

      // Extract the full text content from the response
      const responseText = data?.choices?.[0]?.message?.content?.trim()

      // Log the raw response text before parsing
      console.log("Raw AI Response Text:\n---\n", responseText, "\n---");

      if (responseText) {
          // Use the updated parser
          const newPuzzles = parsePuzzlesFromText(responseText, isEnglish);
          
          if (newPuzzles.length > 0) {
              const currentHistoryLength = puzzleHistory.length;
              // Add all new puzzles to history
              setPuzzleHistory(prevHistory => [...prevHistory, ...newPuzzles]);
              // Set index to the first of the newly added puzzles
              setCurrentPuzzleIndex(currentHistoryLength);
              setAiAnswer(null); // Clear answer for the new puzzle
              // Question count is already reset at the start of fetch
          } else {
              console.error("Could not parse any puzzles from AI response text:", responseText);
              setFetchPuzzleError(isEnglish ? "Failed to parse puzzles from response." : "无法从响应中解析谜题。");
          }
      } else {
        console.error("Could not extract puzzle text from API response:", data)
        throw new Error(isEnglish ? "Could not extract puzzle text from API response." : "无法从 API 响应中提取谜题文本。");
      }
    } catch (error) {
      console.error("Fetch puzzle error:", error)
      setFetchPuzzleError(
        error instanceof Error ? error.message : "An unknown error occurred"
      )
    } finally {
      setIsFetchingPuzzle(false)
    }
  }

  // Function to handle user asking a question
  const handleAskQuestion = async (question: string) => {
    const currentPuzzle = puzzleHistory[currentPuzzleIndex];

    if (!apiUrl || !apiKey || !selectedAnswerModel || !currentPuzzle || !question.trim() || questionCount >= questionLimit) {
      console.warn("Cannot ask question: Missing info, already fetching, or question limit reached.");
      if (questionCount >= questionLimit) {
          setAiAnswer({ text: isEnglish ? "Question limit reached." : "已达到提问次数上限。", isError: true });
      } else if (!selectedAnswerModel) {
          setAiAnswer({ text: isEnglish ? "Please select an answer model in settings." : "请在设置中选择回答模型。", isError: true });
      }
      return;
    }

    // Check if solution exists (moved check here to avoid unnecessary fetch)
    if (!currentPuzzle.solution || currentPuzzle.solution.includes("not parsed") || currentPuzzle.solution.includes("未解析")) {
        console.error("Cannot ask question: Solution for the current puzzle is missing or wasn't parsed correctly.");
        setAiAnswer({ text: isEnglish ? "Cannot answer: Solution for this puzzle is unavailable." : "无法回答：当前谜题的谜底不可用。", isError: true });
        return;
    }

    setIsFetchingAnswer(true);
    setAiAnswer(null); // Clear previous answer

    const config = questionAnswererConfig(isEnglish);
    // Get System Prompt for question answering
    const systemPrompt = getQuestionAnswererSystemPrompt(isEnglish);
    // Get User Prompt template
    let userPromptTemplate = config.prompt;

    // Replace placeholders in the User Prompt template
    const userPrompt = userPromptTemplate
      .replace("{scenario}", currentPuzzle.description)
      .replace("{solution}", currentPuzzle.solution) // Add the solution here
      .replace("{question}", question);

    // ... construct chatUrl similarly to fetchAiPuzzle ...
    let chatUrl = apiUrl
    if (!/^https?:\/\//i.test(chatUrl)) {
        chatUrl = `http://${apiUrl}`
    }
    if (!chatUrl.includes('/v1/chat/completions')) {
        if (chatUrl.endsWith('/')) chatUrl += 'v1/chat/completions';
        else if (!chatUrl.includes('/v1/')) chatUrl += '/v1/chat/completions';
    }
    console.log(`Asking question using model: ${selectedAnswerModel} from ${chatUrl}`);
    // Log both prompts
    console.log(`Using System Prompt: ${systemPrompt}`);
    console.log(`Using User Prompt: ${userPrompt}`);

    try {
        const response = await fetch(chatUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: selectedAnswerModel,
                messages: [
                    // Add System Prompt
                    { role: "system", content: systemPrompt },
                    // Add User Prompt
                    {
                        role: "user",
                        content: userPrompt,
                    },
                ],
                max_tokens: 10,
                temperature: config.temperature,
            }),
        });

        if (!response.ok) {
            const errorData = await response.text();
            throw new Error(`Failed to get answer: ${response.status} ${response.statusText}. ${errorData}`);
        }

        const data = await response.json();
        const answerText = data?.choices?.[0]?.message?.content?.trim();

        if (answerText) {
            setAiAnswer({ text: answerText });
            // Increment question count AFTER successful answer
            setQuestionCount(prevCount => prevCount + 1);
        } else {
            throw new Error(isEnglish ? "Could not extract answer from API response." : "无法从 API 响应中提取答案。");
        }
    } catch (error) {
        console.error("Fetch answer error:", error);
        setAiAnswer({
            text: error instanceof Error ? error.message : "An unknown error occurred while fetching the answer.",
            isError: true,
        });
    } finally {
        setIsFetchingAnswer(false);
    }
};

  // Navigation functions
  const goToPreviousPuzzle = () => {
      if (currentPuzzleIndex > 0) {
          setCurrentPuzzleIndex(prevIndex => prevIndex - 1);
          setAiAnswer(null); // Clear answer when switching puzzles
          setQuestionCount(0); // Reset question count
      }
  }

  const goToNextPuzzle = () => {
      if (currentPuzzleIndex < puzzleHistory.length - 1) {
          setCurrentPuzzleIndex(prevIndex => prevIndex + 1);
          setAiAnswer(null); // Clear answer when switching puzzles
          setQuestionCount(0); // Reset question count
      }
  }

  const handleSaveSettings = () => {
    console.log("Saving settings:", { apiUrl, apiKey, selectedModel, selectedAnswerModel, questionLimit })
    localStorage.setItem("apiUrl", apiUrl)
    if (apiKey) localStorage.setItem("apiKey", window.btoa(apiKey))
    else localStorage.removeItem("apiKey")
    if (selectedModel) {
      localStorage.setItem("selectedModel", selectedModel)
      console.log("Saved question model to localStorage:", selectedModel)
    }
    else localStorage.removeItem("selectedModel")
    if (selectedAnswerModel) {
      localStorage.setItem("selectedAnswerModel", selectedAnswerModel)
      console.log("Saved answer model to localStorage:", selectedAnswerModel)
    }
    else localStorage.removeItem("selectedAnswerModel")
    
    // 保存问题限制数量
    localStorage.setItem("questionLimit", questionLimit.toString())
    console.log("Saved question limit to localStorage:", questionLimit)
    
    setIsSettingsOpen(false)
  }

  // Load saved settings on initial mount
  useEffect(() => {
    const savedApiUrl = localStorage.getItem("apiUrl")
    const savedApiKeyEncoded = localStorage.getItem("apiKey")
    const savedSelectedModel = localStorage.getItem("selectedModel")
    const savedAnswerModel = localStorage.getItem("selectedAnswerModel")
    const savedQuestionLimit = localStorage.getItem("questionLimit")
    
    let hasSettings = false;

    if (savedApiUrl) {
      setApiUrl(savedApiUrl)
      hasSettings = true;
    }

    // Decode API Key
    if (savedApiKeyEncoded) {
      try {
        setApiKey(window.atob(savedApiKeyEncoded))
        hasSettings = true;
      } catch (error) {
        console.error("Failed to decode API Key:", error)
        localStorage.removeItem("apiKey")
      }
    }

    // 立即设置选中的模型，即使模型列表还未加载
    if (savedSelectedModel) {
      setSelectedModel(savedSelectedModel);
      console.log("Restoring saved question model:", savedSelectedModel);
      hasSettings = true;
    }
    
    if (savedAnswerModel) {
      setSelectedAnswerModel(savedAnswerModel);
      console.log("Restoring saved answer model:", savedAnswerModel);
      hasSettings = true;
    }
    
    // 加载问题数量限制
    if (savedQuestionLimit) {
      const limit = parseInt(savedQuestionLimit, 10);
      if (!isNaN(limit) && [10, 20, 30].includes(limit)) {
        setQuestionLimit(limit);
        console.log("Restoring saved question limit:", limit);
      }
    }

    // 如果有设置，触发模型加载
    if (hasSettings) {
      setIsLoadingModels(true);
      
      const loadModels = async () => {
        if (savedApiUrl && savedApiKeyEncoded) {
          try {
            // Same URL construction as in the models fetch effect
            let fullUrl = savedApiUrl;
            if (!/^https?:\/\//i.test(fullUrl)) {
              fullUrl = `http://${savedApiUrl}`;
            }
            if (!fullUrl.endsWith('/v1/models')) {
              if (fullUrl.endsWith('/')) {
                fullUrl += 'v1/models';
              } else {
                fullUrl += '/v1/models';
              }
            }
            
            const decodedKey = window.atob(savedApiKeyEncoded);
            
            const response = await fetch(fullUrl, {
              headers: {
                Authorization: `Bearer ${decodedKey}`,
              },
              // Add timeout and error handling
              signal: AbortSignal.timeout(10000), // 10 second timeout
            });
            
            if (!response.ok) {
              const errorData = await response.text();
              throw new Error(`Failed to load models: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Process the data 
            let modelList: ApiModel[] = [];
            if (data && Array.isArray(data.data)) {
              modelList = data.data;
              setModels(data.data);
            } else if (Array.isArray(data)) {
              modelList = data;
              setModels(data);
            } else {
              throw new Error("Unexpected API response structure");
            }
            
            // 验证保存的模型是否在模型列表中，但不重置它们
            if (savedSelectedModel && !modelList.some(model => model.id === savedSelectedModel)) {
              console.warn(`Saved question model "${savedSelectedModel}" not found in fetched models list. It might be unavailable now.`);
            }
            
            if (savedAnswerModel && !modelList.some(model => model.id === savedAnswerModel)) {
              console.warn(`Saved answer model "${savedAnswerModel}" not found in fetched models list. It might be unavailable now.`);
            }
            
            // 确保模型选择被正确设置，即使模型不在列表中
            if (savedSelectedModel) {
              setSelectedModel(savedSelectedModel);
            }
            
            if (savedAnswerModel) {
              setSelectedAnswerModel(savedAnswerModel);
            }
            
          } catch (error) {
            console.error("Initial models load error:", error);

            // Provide user-friendly error messages for initial load
            let errorMessage = "Failed to connect to API server"

            if (error instanceof Error) {
              if (error.name === 'AbortError' || error.message.includes('timeout')) {
                errorMessage = "Connection timeout. Please check your API settings."
              } else if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
                errorMessage = "Cannot connect to API server. Please check your API settings."
              } else if (error.message.includes('401') || error.message.includes('Unauthorized')) {
                errorMessage = "Invalid API key. Please check your API settings."
              } else if (error.message.includes('404')) {
                errorMessage = "API endpoint not found. Please check your API settings."
              } else {
                errorMessage = error.message
              }
            }

            setFetchError(errorMessage);
          } finally {
            setIsLoadingModels(false);
            setIsSettingsLoaded(true);
          }
        }
      };
      
      // Call the function
      loadModels();
    } else {
      setIsSettingsLoaded(true); // Mark as loaded even if no settings
    }
  }, []) // Empty dependency array for initial load only

  return (
    <div className={`min-h-screen flex flex-col ${resolvedTheme === 'dark' ? "dark bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className={`${isSettingsOpen ? "fixed inset-0 bg-black/20 backdrop-blur-sm z-40" : ""}`} />

      <header className="p-3 flex justify-between items-center">
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
            {resolvedTheme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="ghost" onClick={toggleLanguage}>
            {isEnglish ? "中文" : "EN"}
          </Button>
        </div>
        <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => setIsSettingsOpen(true)}>
          <Settings className="h-5 w-5" />
        </Button>
          <Link href="/turtle_soup_project/tutorial">
            <Button variant="ghost" size="icon">
              <Info className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 flex-1 flex flex-col overflow-hidden">
        {/* Hero Section - Without Start Game button */}
        <section className="py-3 flex flex-col items-center text-center mb-2">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            {isEnglish ? "Turtle Soup Reasoning Game" : "乌龟汤推理游戏"}
          </h1>
          <p className="text-sm md:text-base mb-3 max-w-2xl">
            {isEnglish
              ? "Challenge your deductive reasoning skills with intriguing puzzles and mysteries."
              : "通过有趣的谜题和神秘事件挑战你的推理能力。"}
          </p>
        </section>

        {/* Game Dialog Area - Pass necessary props */}
        <div className="flex-1 flex items-center justify-center">
          <GameDialog
            isEnglish={isEnglish}
            compact={true}
            apiUrl={apiUrl}
            apiKey={apiKey}
            puzzleHistory={puzzleHistory}
            currentPuzzleIndex={currentPuzzleIndex}
            goToPreviousPuzzle={goToPreviousPuzzle}
            goToNextPuzzle={goToNextPuzzle}
            isFetchingPuzzle={isFetchingPuzzle}
            fetchPuzzleError={fetchPuzzleError}
            fetchAiPuzzle={fetchAiPuzzle}
            aiAnswer={aiAnswer}
            isFetchingAnswer={isFetchingAnswer}
            handleAskQuestion={handleAskQuestion}
            questionCount={questionCount}
            questionLimit={questionLimit}
            isLoadingModels={isLoadingModels}
            isSettingsLoaded={isSettingsLoaded}
            selectedModel={selectedModel}
            selectedAnswerModel={selectedAnswerModel}
          />
        </div>
      </main>

      <Footer isEnglish={isEnglish} isDarkMode={resolvedTheme === 'dark'} />

      {/* Settings Dialog */}
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{isEnglish ? "Settings" : "设置"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-4 gap-4 py-4">
            {/* API URL Input */}
            <div className="grid grid-cols-4 items-center gap-4 col-span-4">
              <Label htmlFor="apiUrl" className="text-right col-span-1">
                {isEnglish ? "API URL" : "API 地址"}
              </Label>
              <Input
                id="apiUrl"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
                className="col-span-3"
                placeholder="e.g., localhost:11434 or api.example.com"
              />
            </div>
            {/* API Key Input */}
            <div className="grid grid-cols-4 items-center gap-4 col-span-4">
              <Label htmlFor="apiKey" className="text-right col-span-1">
                {isEnglish ? "API Key" : "API 密钥"}
              </Label>
              <Input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="col-span-3"
                placeholder={isEnglish ? "Enter your API Key" : "输入您的 API 密钥"}
              />
            </div>
            {/* Question Model Select */}
            <div className="grid grid-cols-4 items-center gap-4 col-span-4">
              <Label htmlFor="questionModel" className="text-right col-span-1">
                {isEnglish ? "Question Model" : "问题模型"}
              </Label>
              <div className="col-span-3">
                <Select
                   value={selectedModel || ""}
                   onValueChange={(value) => {
                     console.log("Selecting question model:", value);
                     setSelectedModel(value);
                   }}
                   disabled={isLoadingModels || fetchError !== null || models.length === 0}
                 >
                  <SelectTrigger className="w-full">
                     <SelectValue placeholder={
                         isLoadingModels
                           ? (isEnglish ? "Loading models..." : "正在加载模型...")
                           : fetchError
                             ? (isEnglish ? "Error loading models" : "加载模型出错")
                             : models.length === 0 && (apiUrl && apiKey)
                               ? (isEnglish ? "No models found" : "未找到模型")
                               : (isEnglish ? "Select a model" : "选择一个模型")
                       } />
                  </SelectTrigger>
                  <SelectContent>
                     {models.map((model) => (
                       <SelectItem key={model.id} value={model.id}>
                         {model.name || model.id}
                       </SelectItem>
                     ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Answer Model Select */}
            <div className="grid grid-cols-4 items-center gap-4 col-span-4">
              <Label htmlFor="answerModel" className="text-right col-span-1">
                {isEnglish ? "Answer Model" : "回答模型"}
              </Label>
              <div className="col-span-3">
                <Select
                   value={selectedAnswerModel || ""}
                   onValueChange={(value) => {
                     console.log("Selecting answer model:", value);
                     setSelectedAnswerModel(value);
                   }}
                   disabled={isLoadingModels || fetchError !== null || models.length === 0}
                 >
                  <SelectTrigger className="w-full">
                     <SelectValue placeholder={
                         isLoadingModels
                           ? (isEnglish ? "Loading models..." : "正在加载模型...")
                           : fetchError
                             ? (isEnglish ? "Error loading models" : "加载模型出错")
                             : models.length === 0 && (apiUrl && apiKey)
                               ? (isEnglish ? "No models found" : "未找到模型")
                               : (isEnglish ? "Select a model" : "选择一个模型")
                       } />
                  </SelectTrigger>
                  <SelectContent>
                     {models.map((model) => (
                       <SelectItem key={model.id} value={model.id}>
                         {model.name || model.id}
                       </SelectItem>
                     ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Question Limit Select */}
            <div className="grid grid-cols-4 items-center gap-4 col-span-4">
              <Label htmlFor="questionLimit" className="text-right col-span-1">
                {isEnglish ? "Question Limit" : "提问数量"}
              </Label>
              <div className="col-span-3">
                <Select
                   value={questionLimit.toString()}
                   onValueChange={(value) => {
                     console.log("Setting question limit:", value);
                     setQuestionLimit(parseInt(value, 10));
                   }}
                 >
                  <SelectTrigger className="w-full">
                     <SelectValue placeholder={isEnglish ? "Select question limit" : "选择问题数量限制"} />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="10">10</SelectItem>
                     <SelectItem value="20">20</SelectItem>
                     <SelectItem value="30">30</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Display Fetch Error */}
            {fetchError && (
              <div className="col-span-4">
                <p className="text-sm text-red-600 px-1 py-2 bg-red-100 dark:bg-red-900/30 rounded">
                  {isEnglish ? "Error: " : "错误："} {fetchError}
                </p>
              </div>
            )}
          </div>
          {/* Save Button */}
          <DialogFooter>
             <Button
               onClick={handleSaveSettings}
               disabled={isLoadingModels}
             >
               {isEnglish ? "Save" : "保存"}
             </Button>
           </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
