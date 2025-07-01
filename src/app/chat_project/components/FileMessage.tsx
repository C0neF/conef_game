'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { FileMessage as FileMessageType } from '../services/webrtcChat';
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArchiveIcon from '@mui/icons-material/Archive';
import ErrorIcon from '@mui/icons-material/Error';

interface FileMessageProps {
  message: FileMessageType;
  onDownload: (magnetURI: string, fileName: string) => Promise<void>;
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};



// 根据文件类型获取图标
const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('image/')) {
    return <ImageIcon className="text-blue-500" />;
  } else if (fileType.startsWith('video/')) {
    return <VideoFileIcon className="text-purple-500" />;
  } else if (fileType.startsWith('audio/')) {
    return <AudioFileIcon className="text-green-500" />;
  } else if (fileType === 'application/pdf') {
    return <PictureAsPdfIcon className="text-red-500" />;
  } else if (fileType.includes('zip') || fileType.includes('rar') || fileType.includes('archive')) {
    return <ArchiveIcon className="text-orange-500" />;
  } else {
    return <InsertDriveFileIcon className="text-gray-500" />;
  }
};

export default function FileMessage({ message, onDownload }: FileMessageProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<string>('');

  const handleDownload = async () => {
    if (isDownloading) return;

    setIsDownloading(true);
    setDownloadProgress('准备下载...');

    try {
      await onDownload(message.magnetURI, message.fileName);
      // 下载成功提示
      setDownloadProgress('下载完成！');
      console.log(`文件 "${message.fileName}" 下载完成`);

      // 2秒后清除成功提示
      setTimeout(() => {
        setDownloadProgress('');
      }, 2000);
    } catch (error) {
      console.error('下载失败:', error);

      // 根据错误类型显示不同的提示
      let errorMessage = '文件下载失败，请重试';
      if (error instanceof Error) {
        if (error.message.includes('超时')) {
          errorMessage = '下载超时，请检查网络连接后重试';
        } else if (error.message.includes('正在下载')) {
          errorMessage = '文件正在下载中，请稍候';
        } else if (error.message.includes('无响应')) {
          errorMessage = '网络无响应，请检查连接后重试';
        } else {
          errorMessage = `下载失败：${error.message}`;
        }
      }

      setDownloadProgress(errorMessage);

      // 5秒后清除错误提示
      setTimeout(() => {
        setDownloadProgress('');
      }, 5000);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`max-w-xs lg:max-w-md rounded-2xl ${
          message.isUser
            ? 'bg-blue-500 text-white'
            : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
        } px-4 py-3`}
      >
        {/* 统一的文件显示模式 */}
        <div className="flex items-start space-x-3">
          {/* 文件图标 */}
          <div className="flex-shrink-0 mt-1">
            {getFileIcon(message.fileType)}
          </div>

          {/* 文件详情 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <p className={`text-sm font-medium truncate ${
                message.isUser ? 'text-white' : 'text-gray-900 dark:text-white'
              }`}>
                {message.fileName}
              </p>
            </div>

            <p className={`text-xs mb-3 ${
              message.isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {formatFileSize(message.fileSize)}
            </p>

            {/* 下载按钮 */}
            <motion.button
              onClick={handleDownload}
              disabled={isDownloading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                message.isUser
                  ? 'bg-white/20 hover:bg-white/30 text-white disabled:bg-white/10'
                  : 'bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400'
              } disabled:cursor-not-allowed`}
            >
              <DownloadIcon fontSize="small" />
              <span>
                {isDownloading
                  ? (downloadProgress || '下载中...')
                  : '下载文件'
                }
              </span>
            </motion.button>

            {/* 下载状态提示 */}
            {downloadProgress && !isDownloading && (
              <div className={`mt-2 text-xs text-center ${
                downloadProgress.includes('完成')
                  ? 'text-green-600 dark:text-green-400'
                  : 'text-red-600 dark:text-red-400'
              }`}>
                {downloadProgress}
              </div>
            )}
          </div>
        </div>

        {/* 发送者和时间 */}
        <div className={`mt-3 pt-2 border-t ${
          message.isUser
            ? 'border-white/20'
            : 'border-gray-200 dark:border-gray-600'
        }`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs ${
              message.isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {message.isUser ? '我' : message.senderName}
            </span>
            <span className={`text-xs ${
              message.isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
            }`}>
              {message.timestamp.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
