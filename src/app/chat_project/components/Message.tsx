'use client';

import { motion } from 'framer-motion';
import { TextMessage } from '../services/webrtcChat';

interface MessageProps {
  message: TextMessage;
}

export default function Message({ message }: MessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-lg ${
          message.isUser
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md border border-blue-400'
            : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-md border border-gray-200 dark:border-gray-700'
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <p className={`text-xs mt-1 ${
          message.isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
        }`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </motion.div>
  );
}
