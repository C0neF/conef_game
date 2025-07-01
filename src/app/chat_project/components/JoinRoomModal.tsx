'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import LoginIcon from '@mui/icons-material/Login';
import InfoIcon from '@mui/icons-material/Info';

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (roomId: string) => void; // 移除密码参数，只传递房间号
  prefilledRoomId?: string; // 预填的房间号
}

export default function JoinRoomModal({ isOpen, onClose, onJoin, prefilledRoomId }: JoinRoomModalProps) {
  const [roomId, setRoomId] = useState('');
  const [error, setError] = useState('');

  // 处理预填房间号
  useEffect(() => {
    if (prefilledRoomId && isOpen) {
      setRoomId(prefilledRoomId);
      setError('');
    }
  }, [prefilledRoomId, isOpen]);

  // 根据房间号位数判断是否为加密房间
  const isEncryptedRoom = roomId.trim().length === 4 && /^\d{4}$/.test(roomId.trim());
  const isPublicRoom = roomId.trim().length === 6 && /^\d{6}$/.test(roomId.trim());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 验证房间号
    if (!roomId.trim()) {
      setError('请输入房间号');
      return;
    }

    // 验证房间号格式
    if (!isEncryptedRoom && !isPublicRoom) {
      setError('房间号格式错误：公开房间为6位数字，加密房间为4位数字');
      return;
    }

    // 直接传递房间号，让父组件处理加密房间的密码验证
    onJoin(roomId.trim());
    setRoomId('');
    setError('');
  };

  const handleClose = () => {
    setRoomId('');
    setError('');
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
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-750">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <LoginIcon className="text-white" fontSize="small" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    加入房间
                  </h2>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <CloseIcon className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* 内容 */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    房间号
                  </label>
                  <input
                    type="text"
                    value={roomId}
                    onChange={(e) => {
                      setRoomId(e.target.value);
                      setError('');
                    }}
                    placeholder="公开房间6位数字，加密房间4位数字"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none transition-colors"
                    autoFocus
                  />
                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm mt-2"
                    >
                      {error}
                    </motion.p>
                  )}
                </div>

                {/* 房间类型提示 */}
                {roomId.trim().length > 0 && (
                  <div className="mb-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      isEncryptedRoom
                        ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
                        : isPublicRoom
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                    }`}>
                      {isEncryptedRoom && '🔐 加密房间'}
                      {isPublicRoom && '🌐 公开房间'}
                      {!isEncryptedRoom && !isPublicRoom && roomId.trim().length > 0 && '❓ 房间号格式错误'}
                    </div>
                  </div>
                )}



                {/* 提示信息 */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <InfoIcon className="text-blue-500 mt-0.5" fontSize="small" />
                    <div className="text-sm text-blue-700 dark:text-blue-300">
                      <p className="font-medium mb-1">房间号规则</p>
                      <ul className="space-y-1 text-xs">
                        <li>• 公开房间：6位数字（例如：123456）</li>
                        <li>• 加密房间：4位数字（例如：1234）</li>
                        <li>• 系统会自动识别房间类型并要求密码</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 按钮 */}
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                  >
                    取消
                  </button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
                  >
                    加入房间
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
