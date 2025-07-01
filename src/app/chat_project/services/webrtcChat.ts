import { joinRoom, selfId } from 'trystero';



export interface TextMessage {
  type: 'text';
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isUser: boolean;
}

export interface FileMessage {
  type: 'file';
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  magnetURI: string;
  senderId: string;
  senderName: string;
  timestamp: Date;
  isUser: boolean;
}

export type ChatMessage = TextMessage | FileMessage;

export interface PeerInfo {
  id: string;
  name: string;
  joinedAt: Date;
}

export interface WebRTCChatConfig {
  appId: string;
  roomId: string;
  userName: string;
  password?: string; // 可选的房间密码
}

export class WebRTCChatService {
  private room: any;
  private config: WebRTCChatConfig;
  private peers: Map<string, PeerInfo> = new Map();
  private messageHistory: ChatMessage[] = [];
  private activeTorrents: Set<string> = new Set(); // 跟踪活跃的 torrent

  // 事件回调
  private onMessageCallback?: (message: ChatMessage) => void;
  private onPeerJoinCallback?: (peer: PeerInfo) => void;
  private onPeerLeaveCallback?: (peerId: string) => void;
  private onConnectionStatusCallback?: (status: 'connecting' | 'connected' | 'disconnected') => void;

  constructor(config: WebRTCChatConfig) {
    this.config = config;
  }

  async connect(): Promise<void> {
    try {
      this.onConnectionStatusCallback?.('connecting');

      // 使用 Nostr 策略连接（默认策略，无需额外设置）
      const roomConfig: any = {
        appId: this.config.appId,
      };

      // 如果提供了密码，则使用密码保护
      if (this.config.password) {
        roomConfig.password = this.config.password;
      }

      this.room = joinRoom(roomConfig, this.config.roomId);

      // 设置消息处理
      this.setupMessageHandling();

      // 设置用户管理
      this.setupPeerManagement();

      // 立即设置为已连接状态，因为房间已经创建成功
      // 即使是单用户房间也应该允许发送消息
      this.broadcastUserInfo();
      this.onConnectionStatusCallback?.('connected');

    } catch (error) {
      console.error('连接失败:', error);
      this.onConnectionStatusCallback?.('disconnected');
      throw error;
    }
  }

  private setupMessageHandling(): void {
    // 创建消息发送和接收动作 (action 名称必须 ≤ 12 字节)
    const [sendMessage, getMessage] = this.room.makeAction('msg');
    const [sendUserInfo, getUserInfo] = this.room.makeAction('user');
    const [sendHistory, getHistory] = this.room.makeAction('history');

    // 监听消息
    getMessage((data: any, peerId: string) => {
      let message: ChatMessage;

      if (data.type === 'file') {
        message = {
          type: 'file',
          id: data.id,
          fileName: data.fileName,
          fileSize: data.fileSize,
          fileType: data.fileType,
          magnetURI: data.magnetURI,
          senderId: peerId,
          senderName: this.peers.get(peerId)?.name || '未知用户',
          timestamp: new Date(data.timestamp),
          isUser: false
        };
      } else {
        message = {
          type: 'text',
          id: data.id,
          content: data.content,
          senderId: peerId,
          senderName: this.peers.get(peerId)?.name || '未知用户',
          timestamp: new Date(data.timestamp),
          isUser: false
        };
      }

      this.messageHistory.push(message);
      this.onMessageCallback?.(message);
    });

    // 监听用户信息
    getUserInfo((data: any, peerId: string) => {
      const peer: PeerInfo = {
        id: peerId,
        name: data.name,
        joinedAt: new Date()
      };
      
      this.peers.set(peerId, peer);
      this.onPeerJoinCallback?.(peer);

      // 向新用户发送消息历史
      if (this.messageHistory.length > 0) {
        sendHistory(this.messageHistory, peerId);
      }
    });

    // 监听消息历史
    getHistory((data: ChatMessage[], peerId: string) => {
      // 合并消息历史，避免重复
      data.forEach(msg => {
        if (!this.messageHistory.find(m => m.id === msg.id)) {
          this.messageHistory.push({
            ...msg,
            timestamp: new Date(msg.timestamp),
            isUser: msg.senderId === selfId
          });
        }
      });

      // 按时间排序
      this.messageHistory.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

      // 通知UI更新
      this.messageHistory.forEach(msg => {
        this.onMessageCallback?.(msg);
      });
    });

    // 存储发送函数供外部使用
    this.sendMessage = sendMessage;
    this.sendUserInfo = sendUserInfo;
    this.sendHistory = sendHistory;
  }

  private setupPeerManagement(): void {
    // 监听用户加入
    this.room.onPeerJoin((peerId: string) => {
      console.log(`用户 ${peerId} 加入房间`);
      // 向新用户发送自己的信息
      this.sendUserInfo({ name: this.config.userName }, peerId);

      // 确保连接状态为已连接
      this.onConnectionStatusCallback?.('connected');
    });

    // 监听用户离开
    this.room.onPeerLeave((peerId: string) => {
      console.log(`用户 ${peerId} 离开房间`);
      this.peers.delete(peerId);
      this.onPeerLeaveCallback?.(peerId);
    });
  }

  private broadcastUserInfo(): void {
    // 向房间中的所有用户广播自己的信息
    this.sendUserInfo({ name: this.config.userName });
  }

  // 发送消息的方法
  private sendMessage: any;
  private sendUserInfo: any;
  private sendHistory: any;

  async sendChatMessage(content: string): Promise<void> {
    const message: TextMessage = {
      type: 'text',
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      content,
      senderId: selfId,
      senderName: this.config.userName,
      timestamp: new Date(),
      isUser: true
    };

    // 添加到本地历史
    this.messageHistory.push(message);

    // 通知本地UI
    this.onMessageCallback?.(message);

    // 发送给其他用户
    this.sendMessage({
      type: 'text',
      id: message.id,
      content: message.content,
      timestamp: message.timestamp.toISOString()
    });
  }

  // 检查是否为可预览的图像文件
  private isPreviewableImage(fileType: string): boolean {
    const previewableTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ];
    return previewableTypes.includes(fileType.toLowerCase());
  }



  // 生成文件哈希用于去重
  private async generateFileHash(file: File): Promise<string> {
    try {
      // 使用文件名、大小、最后修改时间和类型生成简单哈希
      const hashInput = `${file.name}-${file.size}-${file.lastModified}-${file.type}`;

      // 使用 Web Crypto API 生成哈希
      if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
        const encoder = new TextEncoder();
        const data = encoder.encode(hashInput);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } else {
        // 降级方案：使用简单的字符串哈希
        let hash = 0;
        for (let i = 0; i < hashInput.length; i++) {
          const char = hashInput.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash = hash & hash; // 转换为32位整数
        }
        return Math.abs(hash).toString(16);
      }
    } catch (error) {
      console.error('生成文件哈希失败:', error);
      // 降级方案
      return `${file.name}-${file.size}-${Date.now()}`;
    }
  }

  async sendFileMessage(file: File): Promise<void> {
    try {
      // 生成文件唯一标识符
      const fileHash = await this.generateFileHash(file);

      // 检查是否已经在处理相同文件
      if (this.activeTorrents.has(fileHash)) {
        console.warn('文件正在处理中，请稍候再试');
        return;
      }

      // 标记文件为处理中
      this.activeTorrents.add(fileHash);

      try {
        // 动态导入 secure-file-transfer 以避免 SSR 问题
        const { fileTransfer } = await import('secure-file-transfer');

        // 生成加密密钥
        const encryptionKey = this.config.password
          ? `${this.config.roomId}-${this.config.password}`
          : this.config.roomId;

        // 使用 secure-file-transfer 的 offer 方法生成 magnet URI
        const magnetURI = await fileTransfer.offer([file], encryptionKey);

        const message: FileMessage = {
          type: 'file',
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          magnetURI: magnetURI,
          senderId: selfId,
          senderName: this.config.userName,
          timestamp: new Date(),
          isUser: true
        };

        // 添加到本地历史
        this.messageHistory.push(message);

        // 通知本地UI
        this.onMessageCallback?.(message);

        // 发送给其他用户（不包含previewUrl，因为其他用户需要自己下载）
        this.sendMessage({
          type: 'file',
          id: message.id,
          fileName: message.fileName,
          fileSize: message.fileSize,
          fileType: message.fileType,
          magnetURI: message.magnetURI,
          timestamp: message.timestamp.toISOString()
        });
      } finally {
        // 处理完成后移除标记
        this.activeTorrents.delete(fileHash);
      }
    } catch (error) {
      console.error('文件发送失败:', error);
      // 确保在错误情况下也移除标记
      const fileHash = await this.generateFileHash(file);
      this.activeTorrents.delete(fileHash);
      throw error;
    }
  }

  async downloadFile(magnetURI: string, fileName: string): Promise<void> {
    // 使用 magnetURI 作为下载标识符
    const downloadKey = `download-${magnetURI}`;

    // 检查是否已经在下载相同文件
    if (this.activeTorrents.has(downloadKey)) {
      throw new Error('文件正在下载中，请稍候再试');
    }

    // 标记文件为下载中
    this.activeTorrents.add(downloadKey);

    try {
      // 动态导入 secure-file-transfer 以避免 SSR 问题
      const { fileTransfer } = await import('secure-file-transfer');

      // 生成加密密钥
      const encryptionKey = this.config.password
        ? `${this.config.roomId}-${this.config.password}`
        : this.config.roomId;

      // 添加超时机制 - 5分钟超时，适合大文件下载
      let timeoutId: NodeJS.Timeout | undefined;
      let lastProgressTime = Date.now();

      const downloadPromise = fileTransfer.download(magnetURI, encryptionKey, {
        doSave: true,
        onProgress: (progress: number) => {
          lastProgressTime = Date.now(); // 更新最后进度时间
          console.log(`下载进度: ${Math.round(progress * 100)}%`);
        }
      });

      // 设置5分钟总超时，但如果有进度更新则重置
      const timeoutPromise = new Promise<never>((_, reject) => {
        const checkTimeout = () => {
          const timeSinceLastProgress = Date.now() - lastProgressTime;
          if (timeSinceLastProgress > 120000) { // 2分钟无进度则超时
            reject(new Error('下载超时：长时间无响应，请检查网络连接'));
          } else {
            timeoutId = setTimeout(checkTimeout, 30000); // 每30秒检查一次
          }
        };
        timeoutId = setTimeout(checkTimeout, 30000);
      });

      // 使用 Promise.race 实现超时
      try {
        await Promise.race([downloadPromise, timeoutPromise]);
        if (timeoutId) clearTimeout(timeoutId); // 下载成功，清除超时
      } catch (error) {
        if (timeoutId) clearTimeout(timeoutId); // 出错时也要清除超时
        throw error;
      }

      console.log(`文件 "${fileName}" 下载完成`);
    } catch (error) {
      console.error('文件下载失败:', error);
      throw error;
    } finally {
      // 下载完成后移除标记
      this.activeTorrents.delete(downloadKey);
    }
  }



  // 获取当前连接的用户列表
  getPeers(): PeerInfo[] {
    return Array.from(this.peers.values());
  }

  // 获取消息历史
  getMessageHistory(): ChatMessage[] {
    return this.messageHistory;
  }

  // 设置事件监听器
  onMessage(callback: (message: ChatMessage) => void): void {
    this.onMessageCallback = callback;
  }

  onPeerJoin(callback: (peer: PeerInfo) => void): void {
    this.onPeerJoinCallback = callback;
  }

  onPeerLeave(callback: (peerId: string) => void): void {
    this.onPeerLeaveCallback = callback;
  }

  onConnectionStatus(callback: (status: 'connecting' | 'connected' | 'disconnected') => void): void {
    this.onConnectionStatusCallback = callback;
  }

  // 断开连接
  disconnect(): void {
    if (this.room) {
      this.room.leave();
      this.room = null;
    }
    this.peers.clear();
    this.messageHistory = [];
    this.activeTorrents.clear(); // 清理活跃的 torrent 标记
    this.onConnectionStatusCallback?.('disconnected');
  }

  // 获取当前用户ID
  getSelfId(): string {
    return selfId;
  }

  // 获取房间信息
  getRoomInfo() {
    return {
      roomId: this.config.roomId,
      appId: this.config.appId,
      userName: this.config.userName,
      selfId: selfId,
      peerCount: this.peers.size
    };
  }
}
