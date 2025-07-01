'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InfoIcon from '@mui/icons-material/Info';

interface EncryptedRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateRoom: (password: string) => void;
  roomId?: string;
}

export default function EncryptedRoomModal({ 
  isOpen, 
  onClose, 
  onCreateRoom,
  roomId 
}: EncryptedRoomModalProps) {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;

    setIsCreating(true);
    try {
      await onCreateRoom(password.trim());
      setPassword('');
    } catch (error) {
      console.error('创建加密房间失败:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setShowPassword(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 backdrop-blur-sm"
          >
            {/* 弹窗内容 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden relative z-[101]"
            >
              {/* 头部 */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <LockIcon className="text-white" fontSize="small" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                      创建加密房间
                    </h2>
                    {roomId && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        房间号: {roomId}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <CloseIcon className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* 内容 */}
              <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 密码输入 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      房间密码
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="输入房间密码"
                        className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
                        disabled={isCreating}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        {showPassword ? (
                          <VisibilityOffIcon fontSize="small" />
                        ) : (
                          <VisibilityIcon fontSize="small" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 安全提示 */}
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <InfoIcon className="text-blue-500 mt-0.5" fontSize="small" />
                      <div className="text-sm text-blue-700 dark:text-blue-300">
                        <p className="font-medium mb-1">安全提示</p>
                        <ul className="space-y-1 text-xs">
                          <li>• 密码用于加密房间连接信息</li>
                          <li>• 只有知道密码的用户才能加入</li>
                          <li>• 所有消息都经过端到端加密</li>
                          <li>• 请妥善保管密码并分享给信任的用户</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* 按钮 */}
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                      disabled={isCreating}
                    >
                      取消
                    </button>
                    <motion.button
                      type="submit"
                      disabled={!password.trim() || isCreating}
                      whileHover={{ scale: password.trim() ? 1.02 : 1 }}
                      whileTap={{ scale: password.trim() ? 0.98 : 1 }}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                    >
                      {isCreating ? (
                        <div className="flex items-center justify-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>创建中...</span>
                        </div>
                      ) : (
                        '创建房间'
                      )}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
