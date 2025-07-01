'use client';

import { motion } from 'framer-motion';
import ChatIcon from '@mui/icons-material/Chat';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import LoginIcon from '@mui/icons-material/Login';
import ThemeToggle from './ThemeToggle';

interface WelcomeScreenProps {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

export default function WelcomeScreen({ onCreateRoom, onJoinRoom }: WelcomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4 relative">
      {/* 主题切换按钮 - 右上角固定定位 */}
      <div className="absolute top-4 right-4 z-10">
        <ThemeToggle size="medium" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* 主标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <ChatIcon fontSize="large" className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            聊天室
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            点击右上角切换深色/浅色主题
          </p>
        </motion.div>

        {/* 操作按钮区域 */}
        <div className="space-y-4">
          {/* 创建房间按钮 */}
          <motion.button
            onClick={onCreateRoom}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            className="w-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-100 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <GroupAddIcon className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  创建房间
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  创建一个新的聊天房间并邀请朋友
                </p>
              </div>
              <div className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                →
              </div>
            </div>
          </motion.button>

          {/* 加入房间按钮 */}
          <motion.button
            onClick={onJoinRoom}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            className="w-full bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-shadow duration-100 group"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <LoginIcon className="text-white" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  加入房间
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  输入房间号加入现有的聊天房间
                </p>
              </div>
              <div className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
                →
              </div>
            </div>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
