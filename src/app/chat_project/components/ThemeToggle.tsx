'use client';

import React from 'react';
import { motion } from 'framer-motion';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useTheme } from '../hooks/useTheme';

interface ThemeToggleProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function ThemeToggle({ className = '', size = 'medium' }: ThemeToggleProps) {
  const { resolvedTheme, toggleTheme } = useTheme();

  // 根据尺寸设置样式
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-10 h-10',
  };

  const iconSizes = {
    small: 'small' as const,
    medium: 'medium' as const,
    large: 'large' as const,
  };

  // 处理键盘事件
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleTheme();
    }
  };

  // 获取当前主题的标签
  const getAriaLabel = () => {
    return resolvedTheme === 'light' ? '切换到深色模式' : '切换到浅色模式';
  };

  return (
    <motion.button
      onClick={toggleTheme}
      onKeyDown={handleKeyDown}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`
        ${sizeClasses[size]}
        rounded-full 
        flex items-center justify-center 
        transition-colors duration-200
        hover:bg-gray-100 dark:hover:bg-gray-700
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        dark:focus:ring-offset-gray-800
        text-gray-600 dark:text-gray-300
        hover:text-gray-800 dark:hover:text-gray-100
        ${className}
      `}
      aria-label={getAriaLabel()}
      title={getAriaLabel()}
      tabIndex={0}
      role="button"
    >
      <motion.div
        key={resolvedTheme}
        initial={{ rotate: -180, scale: 0 }}
        animate={{ rotate: 0, scale: 1 }}
        exit={{ rotate: 180, scale: 0 }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 10,
        }}
      >
        {resolvedTheme === 'light' ? (
          <DarkModeIcon fontSize={iconSizes[size]} />
        ) : (
          <LightModeIcon fontSize={iconSizes[size]} />
        )}
      </motion.div>
    </motion.button>
  );
}
