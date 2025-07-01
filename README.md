# Game Hub - Conef Game

A modern web application that serves as a navigation hub for three interactive projects: Chat Room, Gomoku Game, and WebGPU Demo.

## Features

### 🏠 Main Navigation Hub
- **Responsive Design**: Adapts to both desktop and mobile devices
- **Animated Interface**: Smooth animations powered by Framer Motion and Anime.js
- **Interactive Modules**: Hover effects with dynamic width changes
- **Modern UI**: Clean design with dark mode support

### 💬 Chat Room (Module 1) - Complete Original Project
- **P2P WebRTC Communication**: Direct peer-to-peer messaging using Trystero
- **File Sharing**: Secure file transfer with encryption
- **Room Management**: Create public/private rooms with passwords
- **Real-time Messaging**: Instant message delivery and history
- **Theme Support**: Dark/light mode with smooth transitions
- **Mobile Responsive**: Optimized for all device sizes
- **No Server Required**: Fully decentralized communication

### ⚫⚪ Gomoku Game (Module 2) - Complete Original Project
- **P2P Multiplayer**: Real-time two-player gameplay via WebRTC
- **Room System**: Create/join rooms with 6-digit codes
- **15x15 Board**: Classic Gomoku rules with win detection
- **Real-time Sync**: Synchronized game state across players
- **Responsive Design**: Works on desktop and mobile
- **Connection Management**: Automatic reconnection handling
- **No Server Required**: Direct peer-to-peer game sessions

### 🎮 WebGPU Demo (Module 3) - Complete Original Project
- **3D Graphics**: Advanced WebGPU-powered 3D rendering
- **Interactive Dice**: Physics-based dice rolling simulation
- **Multiplayer Support**: Share dice rolls with other players
- **Real-time Sync**: Synchronized dice states via WebRTC
- **Modern Graphics**: Cutting-edge GPU acceleration
- **Cross-platform**: Works on WebGPU-supported browsers
- **Performance Optimized**: Smooth 60fps rendering

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Material-UI
- **Animations**: Framer Motion + Anime.js
- **Graphics**: WebGPU API + Three.js
- **P2P Communication**: Trystero (WebRTC)
- **File Transfer**: Secure File Transfer
- **Icons**: FontAwesome + Lucide React
- **Testing**: Playwright

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:3000`

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Main navigation hub
│   ├── chat_project/               # Complete Chat Room Application
│   │   ├── app/
│   │   │   ├── page.tsx           # Chat main page
│   │   │   ├── layout.tsx         # Chat layout
│   │   │   └── globals.css        # Chat styles
│   │   ├── components/            # Chat components
│   │   │   ├── ChatContainer.tsx  # Main chat container
│   │   │   ├── WelcomeScreen.tsx  # Welcome interface
│   │   │   ├── MessageList.tsx    # Message display
│   │   │   └── ...               # Other chat components
│   │   ├── services/              # Chat services
│   │   │   └── webrtcChat.ts     # WebRTC chat logic
│   │   └── contexts/              # Chat contexts
│   ├── gomoku_project/            # Complete Gomoku Game
│   │   ├── app/
│   │   │   ├── page.tsx          # Gomoku main page
│   │   │   ├── layout.tsx        # Gomoku layout
│   │   │   └── globals.css       # Gomoku styles
│   │   └── lib/
│   │       └── webrtc-manager.ts # Gomoku WebRTC logic
│   └── webgpu_project/           # Complete WebGPU Demo
│       ├── app/
│       │   ├── page.tsx          # WebGPU main page
│       │   ├── layout.tsx        # WebGPU layout
│       │   ├── globals.css       # WebGPU styles
│       │   └── components/       # WebGPU components
│       └── lib/
│           └── webrtc-manager.ts # WebGPU WebRTC logic
```

## Navigation

- **Desktop**: Hover over modules to see width expansion effects, click to navigate
- **Mobile**: Tap modules to navigate, optimized vertical layout
- **Back Navigation**: Each sub-application has a "Back to Home" button

## Browser Compatibility

- **Chat Room**: All modern browsers
- **Gomoku Game**: All modern browsers
- **WebGPU Demo**: Chrome 113+, Edge 113+, or browsers with WebGPU support
