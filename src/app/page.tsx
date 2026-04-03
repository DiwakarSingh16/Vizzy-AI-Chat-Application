'use client';

import { useEffect } from 'react';
import Sidebar from '@/components/sidebar/Sidebar';
import ChatInterface from '@/components/chat/ChatInterface';
import PreviewPanel from '@/components/preview/PreviewPanel';
import { useMemoryStore } from '@/store/memoryStore';

export default function Home() {
  const { loadFromStorage } = useMemoryStore();

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <main className="h-screen w-screen flex overflow-hidden bg-[var(--color-bg-primary)] bg-mesh">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Chat Area */}
      <ChatInterface />

      {/* Right Preview Panel */}
      <PreviewPanel />
    </main>
  );
}
