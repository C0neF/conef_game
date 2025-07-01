'use client';

import { motion, AnimatePresence } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import LockIcon from '@mui/icons-material/Lock';
import PublicIcon from '@mui/icons-material/Public';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePublic: () => void;
  onCreateEncrypted: () => void;
}

export default function CreateRoomModal({ 
  isOpen, 
  onClose, 
  onCreatePublic, 
  onCreateEncrypted 
}: CreateRoomModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 遮罩层 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
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
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                    <GroupAddIcon className="text-white" fontSize="small" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    创建房间
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <CloseIcon className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              {/* 内容 */}
              <div className="p-6">
                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    选择房间类型
                  </p>
                </div>

                {/* 房间类型选项 */}
                <div className="space-y-4">
                  {/* 公开房间 */}
                  <motion.button
                    onClick={onCreatePublic}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <PublicIcon className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          公开房间
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          6位数字房间号，任何知道房间号的人都可以加入
                        </p>
                      </div>
                      <div className="text-gray-400 group-hover:text-blue-500 transition-colors">
                        →
                      </div>
                    </div>
                  </motion.button>

                  {/* 加密房间 */}
                  <motion.button
                    onClick={onCreateEncrypted}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <LockIcon className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                          加密房间
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          4位数字房间号，需要密码才能加入，端到端加密
                        </p>
                      </div>
                      <div className="text-gray-400 group-hover:text-orange-500 transition-colors">
                        →
                      </div>
                    </div>
                  </motion.button>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    所有房间都使用 WebRTC 进行点对点通信
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
