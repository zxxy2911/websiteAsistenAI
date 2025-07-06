import { useRef, useEffect } from "react";
import { Copy, RefreshCw, CheckCircle, MessageCircle, Headphones, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProspectForm from "./prospect-form";
import type { ChatConversation, ChatMessage } from "@/types/chat";

interface MessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isTyping: boolean;
  conversation: ChatConversation | null;
}

export default function MessageList({ messages, isLoading, isTyping, conversation }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleRegenerateResponse = (messageId: number) => {
    // TODO: Implement response regeneration
    console.log("Regenerate response for message:", messageId);
  };

  const formatTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-16 h-16 bg-gradient-to-r from-[var(--neon-cyan)] to-[var(--neon-magenta)] rounded-full flex items-center justify-center animate-pulse neon-glow">
          <div className="w-8 h-8 border-2 border-[var(--dark-bg)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-neon">
      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Welcome Message - ChatGPT Style */}
        {messages.length === 0 && (
          <div className="text-center py-20">
            <div className="w-12 h-12 mx-auto mb-6 gradient-bg rounded-full flex items-center justify-center">
              <span className="text-[var(--dark-bg)] font-bold text-lg">AI</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              xXzZyyAI
            </h1>
            <p className="text-gray-400 mb-8">
              Dibuat oleh ejaa[xXzZyy]
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              <div className="p-4 bg-[var(--dark-surface)]/30 rounded-lg border border-[var(--neon-cyan)]/10 hover:bg-[var(--dark-surface)]/50 transition-colors cursor-pointer">
                <h3 className="font-semibold text-white mb-2">💬 Customer Service</h3>
                <p className="text-sm text-gray-400">Bantuan layanan pelanggan 24/7</p>
              </div>
              <div className="p-4 bg-[var(--dark-surface)]/30 rounded-lg border border-[var(--neon-cyan)]/10 hover:bg-[var(--dark-surface)]/50 transition-colors cursor-pointer">
                <h3 className="font-semibold text-white mb-2">❓ FAQ</h3>
                <p className="text-sm text-gray-400">Jawaban cepat untuk pertanyaan umum</p>
              </div>
              <div className="p-4 bg-[var(--dark-surface)]/30 rounded-lg border border-[var(--neon-cyan)]/10 hover:bg-[var(--dark-surface)]/50 transition-colors cursor-pointer">
                <h3 className="font-semibold text-white mb-2">🗣️ Percakapan</h3>
                <p className="text-sm text-gray-400">Chat natural dalam bahasa Indonesia</p>
              </div>
              <div className="p-4 bg-[var(--dark-surface)]/30 rounded-lg border border-[var(--neon-cyan)]/10 hover:bg-[var(--dark-surface)]/50 transition-colors cursor-pointer">
                <h3 className="font-semibold text-white mb-2">📊 Lead Generation</h3>
                <p className="text-sm text-gray-400">Pengumpulan data prospek otomatis</p>
              </div>
            </div>
          </div>
        )}

        {/* Messages - ChatGPT Style */}
        <div className="space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`group ${message.role === 'user' ? '' : 'bg-[var(--dark-surface)]/30'}`}>
              <div className={`py-6 px-4 ${message.role === 'user' ? '' : 'bg-[var(--dark-surface)]/20'}`}>
                <div className="max-w-3xl mx-auto flex gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {message.role === 'user' ? (
                      <div className="w-8 h-8 bg-[var(--neon-cyan)] rounded-full flex items-center justify-center">
                        <span className="text-[var(--dark-bg)] font-bold text-sm">U</span>
                      </div>
                    ) : (
                      <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center">
                        <span className="text-[var(--dark-bg)] font-bold text-sm">AI</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="prose prose-invert max-w-none">
                      <p className="text-white text-[15px] leading-7 whitespace-pre-wrap">
                        {message.content}
                      </p>
                    </div>
                    
                    {/* Actions */}
                    {message.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyMessage(message.content)}
                          className="text-xs text-gray-400 hover:text-[var(--neon-cyan)] transition-colors p-1 h-auto rounded"
                        >
                          <Copy className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRegenerateResponse(message.id)}
                          className="text-xs text-gray-400 hover:text-[var(--neon-cyan)] transition-colors p-1 h-auto rounded"
                        >
                          <RefreshCw className="w-3 h-3" />
                        </Button>
                        <span className="text-xs text-gray-500 ml-2">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    )}
                    
                    {message.role === 'user' && (
                      <div className="mt-2">
                        <span className="text-xs text-gray-500">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show prospect form after a few messages */}
        {messages.length >= 4 && messages.length % 6 === 0 && (
          <ProspectForm conversationId={conversation?.id} />
        )}

        {/* Typing Indicator - ChatGPT Style */}
        {isTyping && (
          <div className="bg-[var(--dark-surface)]/20">
            <div className="py-6 px-4">
              <div className="max-w-3xl mx-auto flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center">
                    <span className="text-[var(--dark-bg)] font-bold text-sm">AI</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 py-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[var(--neon-cyan)] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-[var(--neon-magenta)] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-[var(--neon-green)] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
