'use client';

import { useEffect, useRef } from 'react';
import Message from './Message';
import FileMessage from './FileMessage';
import { ChatMessage } from '../services/webrtcChat';

interface MessageListProps {
  messages: ChatMessage[];
  onDownloadFile: (magnetURI: string, fileName: string) => Promise<void>;
}

export default function MessageList({ messages, onDownloadFile }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={`flex-1 p-4 space-y-2 ${messages.length > 0 ? 'overflow-y-auto scrollbar-thin' : 'overflow-hidden'}`}>
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
          <div className="text-center">
            <p className="text-lg mb-2">开始对话</p>
            <p className="text-sm">发送消息开始聊天</p>
          </div>
        </div>
      ) : (
        messages.map((message) => {
          if (message.type === 'file') {
            return (
              <FileMessage
                key={message.id}
                message={message}
                onDownload={onDownloadFile}
              />
            );
          } else {
            return (
              <Message
                key={message.id}
                message={message}
              />
            );
          }
        })
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}
