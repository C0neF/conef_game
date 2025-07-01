'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// 主题类型定义
export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

// 主题上下文类型
interface ThemeContextType {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

// 创建主题上下文
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 主题提供者组件
interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  storageKey = 'chat-app-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>('light');
  const [mounted, setMounted] = useState(false);

  // 获取系统主题偏好
  const getSystemTheme = (): ResolvedTheme => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // 解析主题（将 system 转换为实际主题）
  const resolveTheme = (theme: Theme): ResolvedTheme => {
    if (theme === 'system') {
      return getSystemTheme();
    }
    return theme;
  };

  // 应用主题到 DOM
  const applyTheme = (resolvedTheme: ResolvedTheme) => {
    const root = window.document.documentElement;

    // 移除之前的主题类
    root.classList.remove('light', 'dark');

    // 添加新的主题类
    root.classList.add(resolvedTheme);

    // 设置 data 属性用于 CSS 选择器
    root.setAttribute('data-theme', resolvedTheme);

    // 强制重新渲染以确保样式应用
    root.style.colorScheme = resolvedTheme;
  };

  // 设置主题
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    
    // 保存到 localStorage
    try {
      localStorage.setItem(storageKey, newTheme);
    } catch (error) {
      console.warn('无法保存主题设置到 localStorage:', error);
    }
    
    // 解析并应用主题
    const resolved = resolveTheme(newTheme);
    setResolvedTheme(resolved);
    
    if (mounted) {
      applyTheme(resolved);
    }
  };

  // 切换主题（在 light 和 dark 之间切换）
  const toggleTheme = () => {
    if (theme === 'system') {
      // 如果当前是系统主题，切换到相反的主题
      const systemTheme = getSystemTheme();
      const newTheme = systemTheme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    } else {
      // 在 light 和 dark 之间切换
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    }
  };

  // 初始化主题
  useEffect(() => {
    try {
      // 从 localStorage 读取保存的主题
      const savedTheme = localStorage.getItem(storageKey) as Theme;
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeState(savedTheme);
        const resolved = resolveTheme(savedTheme);
        setResolvedTheme(resolved);
        applyTheme(resolved);
      } else {
        // 使用默认主题
        const resolved = resolveTheme(defaultTheme);
        setResolvedTheme(resolved);
        applyTheme(resolved);
      }
    } catch (error) {
      console.warn('无法从 localStorage 读取主题设置:', error);
      const resolved = resolveTheme(defaultTheme);
      setResolvedTheme(resolved);
      applyTheme(resolved);
    }
    
    setMounted(true);
  }, [defaultTheme, storageKey]);

  // 监听系统主题变化
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (theme === 'system') {
        const resolved = getSystemTheme();
        setResolvedTheme(resolved);
        applyTheme(resolved);
      }
    };

    // 添加监听器
    mediaQuery.addEventListener('change', handleChange);
    
    // 清理监听器
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  // 提供上下文值
  const value: ThemeContextType = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// 使用主题的 Hook
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}
