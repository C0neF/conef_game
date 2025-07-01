'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onSendFile: (file: File) => void;
  disabled?: boolean;
}

export default function MessageInput({ onSendMessage, onSendFile, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [isFileUploading, setIsFileUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // 处理文件选择按钮点击
  const handleFileButtonClick = () => {
    if (!disabled && !isFileUploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 处理文件选择
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && !isFileUploading) {
      // 发送第一个选择的文件
      const file = files[0];

      // 检查文件大小（限制为 100MB）
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (file.size > maxSize) {
        alert('文件大小不能超过 100MB');
        e.target.value = '';
        return;
      }

      setIsFileUploading(true);
      try {
        await onSendFile(file);
      } catch (error) {
        console.error('文件发送失败:', error);
      } finally {
        setIsFileUploading(false);
      }

      // 清空文件输入，允许重复选择同一文件
      e.target.value = '';
    }
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        {/* 文件选择按钮 */}
        <motion.button
          type="button"
          onClick={handleFileButtonClick}
          disabled={disabled || isFileUploading}
          whileHover={{ scale: disabled || isFileUploading ? 1 : 1.05 }}
          whileTap={{ scale: disabled || isFileUploading ? 1 : 0.95 }}
          className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-gray-500 dark:bg-gray-600 text-white transition-colors hover:bg-gray-600 dark:hover:bg-gray-500 disabled:bg-gray-300 dark:disabled:bg-gray-700 disabled:cursor-not-allowed flex-shrink-0"
          title={isFileUploading ? "文件上传中..." : "选择文件"}
        >
          {isFileUploading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          ) : (
            <AddIcon fontSize="small" />
          )}
        </motion.button>

        {/* 隐藏的文件输入 */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.zip,.rar"
        />

        <div className="flex-1 flex items-end">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="输入消息..."
            disabled={disabled}
            className="w-full resize-none rounded-2xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 max-h-32 min-h-[44px] scrollbar-hide leading-6"
            rows={1}
            style={{
              height: 'auto',
              minHeight: '44px',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 128) + 'px';
            }}
          />
        </div>

        {/* 发送按钮 */}
        <motion.button
          type="submit"
          disabled={!message.trim() || disabled}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-[44px] w-[44px] items-center justify-center rounded-full bg-blue-500 text-white transition-colors hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 disabled:cursor-not-allowed flex-shrink-0"
          title="发送消息"
        >
          <SendIcon fontSize="small" />
        </motion.button>
      </form>
    </div>
  );
}
