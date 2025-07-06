import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Download, Settings } from "lucide-react";
import MessageList from "./message-list";
import ChatInput from "./chat-input";
import type { ChatConversation, ChatMessage } from "@/types/chat";

interface ChatAreaProps {
  conversation: ChatConversation | null;
  messages: ChatMessage[];
  isLoading: boolean;
}

export default function ChatArea({ conversation, messages, isLoading }: ChatAreaProps) {
  const [isTyping, setIsTyping] = useState(false);

  const handleClearChat = () => {
    // TODO: Implement clear chat functionality
    console.log("Clear chat");
  };

  const handleExportChat = () => {
    // TODO: Implement export chat functionality
    console.log("Export chat");
  };

  const handleShowSettings = () => {
    // TODO: Implement settings modal
    console.log("Show settings");
  };

  return (
    <div className="flex-1 flex flex-col bg-[var(--dark-bg)]">
      {/* Simple Header like ChatGPT */}
      {conversation && (
        <div className="px-4 py-3 border-b border-[var(--neon-cyan)]/10 bg-[var(--dark-surface)]/30">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <h1 className="text-lg font-medium text-white truncate">
              {conversation.title}
            </h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearChat}
                className="p-2 hover:bg-[var(--dark-surface)] rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-gray-400 hover:text-[var(--neon-cyan)]" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExportChat}
                className="p-2 hover:bg-[var(--dark-surface)] rounded-lg transition-colors"
              >
                <Download className="w-4 h-4 text-gray-400 hover:text-[var(--neon-cyan)]" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShowSettings}
                className="p-2 hover:bg-[var(--dark-surface)] rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 text-gray-400 hover:text-[var(--neon-cyan)]" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <MessageList 
        messages={messages}
        isLoading={isLoading}
        isTyping={isTyping}
        conversation={conversation}
      />

      {/* Chat Input */}
      <ChatInput 
        conversation={conversation}
        onTypingStart={() => setIsTyping(true)}
        onTypingEnd={() => setIsTyping(false)}
      />
    </div>
  );
}
