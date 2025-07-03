'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ThemeToggle from './chat_project/components/ThemeToggle';

export default function Home() {
  const [hoveredModule, setHoveredModule] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);



  // 根据悬停状态计算模块flex值
  const getModuleFlex = (moduleIndex: number) => {
    if (isMobile) return 1;

    switch (hoveredModule) {
      case 1:
        return moduleIndex === 1 ? 3 : 1;
      case 2:
        return moduleIndex === 2 ? 3 : 1;
      case 3:
        return moduleIndex === 3 ? 3 : 1;
      case 4:
        return moduleIndex === 4 ? 3 : 1;
      default:
        return 1; // 默认所有模块相等
    }
  };

  // 处理模块点击事件
  const handleModuleClick = (moduleNumber: number) => {
    switch (moduleNumber) {
      case 1:
        router.push('/gomoku_project');
        break;
      case 2:
        router.push('/chat_project');
        break;
      case 3:
        router.push('/turtle_soup_project');
        break;
      case 4:
        router.push('/webgpu_project');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center relative">
      {/* 右上角深色模式切换按钮 */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle size="large" />
      </div>

      <div className="w-full">
        <motion.h1
          className="text-3xl font-bold text-center mb-12 text-gray-800 dark:text-gray-200"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
            delay: 0.1
          }}
        >
          Game Hub
        </motion.h1>

        {/* Bento Grid Container - Responsive Layout */}
        <div className="flex flex-col md:flex-row gap-4 w-full px-8 overflow-hidden">

          {/* Module 1 - Gomoku */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-2xl"
            style={{
              height: isMobile ? 'calc((100vh - 8rem) / 4)' : '66.67vh',
              minWidth: '200px'
            }}
            initial={{
              x: -300,
              opacity: 0,
              flex: getModuleFlex(1)
            }}
            animate={{
              x: 0,
              opacity: 1,
              flex: getModuleFlex(1),
              scale: 1,
              borderColor: hoveredModule === 1 ? '#3B82F6' : 'rgb(229 231 235)'
            }}
            transition={{
              x: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], type: "spring", stiffness: 100, damping: 20, delay: 0.2 },
              opacity: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 },
              flex: { duration: 0.3, ease: "easeOut" },
              scale: { duration: 0.2, ease: "easeOut" },
              borderColor: { duration: 0.2, ease: "easeOut" }
            }}
            layout
            onMouseEnter={() => setHoveredModule(1)}
            onMouseLeave={() => setHoveredModule(null)}
            onClick={() => handleModuleClick(1)}
            whileHover={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-6xl mb-4">⚫⚪</div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">五子棋</h3>
            </div>
          </motion.div>

          {/* Module 2 - Chat */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-2xl"
            style={{
              height: isMobile ? 'calc((100vh - 8rem) / 4)' : '66.67vh',
              minWidth: '200px'
            }}
            initial={{
              scale: 0,
              opacity: 0,
              flex: getModuleFlex(2)
            }}
            animate={{
              scale: 1,
              opacity: 1,
              flex: getModuleFlex(2),
              borderColor: hoveredModule === 2 ? '#10B981' : 'rgb(229 231 235)'
            }}
            transition={{
              scale: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], type: "spring", stiffness: 100, damping: 20, delay: 0.4 },
              opacity: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 },
              flex: { duration: 0.3, ease: "easeOut" },
              borderColor: { duration: 0.2, ease: "easeOut" }
            }}
            layout
            onMouseEnter={() => setHoveredModule(2)}
            onMouseLeave={() => setHoveredModule(null)}
            onClick={() => handleModuleClick(2)}
            whileHover={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-6xl mb-4">💬</div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">聊天室</h3>
            </div>
          </motion.div>

          {/* Module 3 - Turtle Soup */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-2xl"
            style={{
              height: isMobile ? 'calc((100vh - 8rem) / 4)' : '66.67vh',
              minWidth: '200px'
            }}
            initial={{
              y: 300,
              opacity: 0,
              flex: getModuleFlex(3)
            }}
            animate={{
              y: 0,
              opacity: 1,
              flex: getModuleFlex(3),
              scale: 1,
              borderColor: hoveredModule === 3 ? '#8B5CF6' : 'rgb(229 231 235)'
            }}
            transition={{
              y: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], type: "spring", stiffness: 100, damping: 20, delay: 0.5 },
              opacity: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.5 },
              flex: { duration: 0.3, ease: "easeOut" },
              scale: { duration: 0.2, ease: "easeOut" },
              borderColor: { duration: 0.2, ease: "easeOut" }
            }}
            layout
            onMouseEnter={() => setHoveredModule(3)}
            onMouseLeave={() => setHoveredModule(null)}
            onClick={() => handleModuleClick(3)}
            whileHover={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-6xl mb-4">🐢</div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">海龟汤</h3>
            </div>
          </motion.div>

          {/* Module 4 - WebGPU */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 flex flex-col items-center justify-center cursor-pointer hover:shadow-2xl"
            style={{
              height: isMobile ? 'calc((100vh - 8rem) / 4)' : '66.67vh',
              minWidth: '200px'
            }}
            initial={{
              x: 300,
              opacity: 0,
              flex: getModuleFlex(4)
            }}
            animate={{
              x: 0,
              opacity: 1,
              flex: getModuleFlex(4),
              scale: 1,
              borderColor: hoveredModule === 4 ? '#F59E0B' : 'rgb(229 231 235)'
            }}
            transition={{
              x: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], type: "spring", stiffness: 100, damping: 20, delay: 0.7 },
              opacity: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.7 },
              flex: { duration: 0.3, ease: "easeOut" },
              scale: { duration: 0.2, ease: "easeOut" },
              borderColor: { duration: 0.2, ease: "easeOut" }
            }}
            layout
            onMouseEnter={() => setHoveredModule(4)}
            onMouseLeave={() => setHoveredModule(null)}
            onClick={() => handleModuleClick(4)}
            whileHover={{
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-6xl mb-4">🎲</div>
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">快艇骰子</h3>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
