'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'qrcode';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QrCodeIcon from '@mui/icons-material/QrCode';
import ShareIcon from '@mui/icons-material/Share';
import CheckIcon from '@mui/icons-material/Check';
import LinkIcon from '@mui/icons-material/Link';

interface ShareRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  isEncrypted: boolean;
}

export default function ShareRoomModal({ isOpen, onClose, roomId, isEncrypted }: ShareRoomModalProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [shareMethod, setShareMethod] = useState<'link' | 'qr'>('link');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 生成分享链接
  const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/chat_project?room=${roomId}`;
  const roomType = isEncrypted ? '加密' : '公开';
  const shareText = `加入我的${roomType}聊天房间 #${roomId}${isEncrypted ? '（需要密码）' : ''}`;

  // 生成QR码
  useEffect(() => {
    if (isOpen && shareMethod === 'qr') {
      generateQRCode();
    }
  }, [isOpen, shareMethod, shareUrl]);

  const generateQRCode = async () => {
    try {
      const qrDataUrl = await QRCode.toDataURL(shareUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1f2937',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('生成QR码失败:', error);
    }
  };

  // 复制链接到剪贴板
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('复制失败:', error);
      // 降级方案：选择文本
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // 使用Web Share API分享
  const handleNativeShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: '聊天房间分享',
          text: shareText,
          url: shareUrl,
        });
      } else {
        // 降级到复制链接
        handleCopyLink();
      }
    } catch (error) {
      console.error('分享失败:', error);
    }
  };

  // 下载QR码
  const handleDownloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `room-${roomId}-qr.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 头部 */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                分享房间
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {roomType}房间 #{roomId}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            >
              <CloseIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* 分享方式选择 */}
          <div className="p-6">
            <div className="flex space-x-2 mb-6">
              <button
                onClick={() => setShareMethod('link')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all ${
                  shareMethod === 'link'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                <span className="text-sm font-medium">链接</span>
              </button>
              <button
                onClick={() => setShareMethod('qr')}
                className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl transition-all ${
                  shareMethod === 'qr'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <QrCodeIcon className="w-4 h-4" />
                <span className="text-sm font-medium">二维码</span>
              </button>
            </div>

            {/* 链接分享 */}
            {shareMethod === 'link' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">分享链接：</p>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-900 dark:text-white"
                    />
                    <motion.button
                      onClick={handleCopyLink}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 rounded-lg transition-all ${
                        copySuccess
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-500 hover:bg-blue-600 text-white'
                      }`}
                    >
                      {copySuccess ? (
                        <CheckIcon className="w-4 h-4" />
                      ) : (
                        <ContentCopyIcon className="w-4 h-4" />
                      )}
                    </motion.button>
                  </div>
                </div>

                {isEncrypted && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      ⚠️ 这是一个加密房间，接收者需要输入密码才能加入。
                    </p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <motion.button
                    onClick={handleCopyLink}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-xl font-medium transition-colors"
                  >
                    复制链接
                  </motion.button>
                  {navigator.share && (
                    <motion.button
                      onClick={handleNativeShare}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <ShareIcon className="w-4 h-4" />
                      <span>分享</span>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}

            {/* QR码分享 */}
            {shareMethod === 'qr' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-xl shadow-lg">
                    {qrCodeUrl ? (
                      <img
                        src={qrCodeUrl}
                        alt="房间二维码"
                        className="w-48 h-48"
                      />
                    ) : (
                      <div className="w-48 h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-center text-sm text-gray-600 dark:text-gray-300">
                  使用手机扫描二维码加入房间
                </p>

                {isEncrypted && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                    <p className="text-sm text-amber-800 dark:text-amber-200">
                      ⚠️ 扫码后仍需输入密码才能加入加密房间。
                    </p>
                  </div>
                )}

                <motion.button
                  onClick={handleDownloadQR}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium transition-colors"
                  disabled={!qrCodeUrl}
                >
                  下载二维码
                </motion.button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
