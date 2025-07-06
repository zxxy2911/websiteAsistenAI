import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "@/components/chat/sidebar";
import ChatArea from "@/components/chat/chat-area";
import { chatApi } from "@/lib/chat-api";
import type { ChatConversation, ChatMessage } from "@/types/chat";

export default function ChatPage() {
  const [match, params] = useRoute("/chat/:id");
  const conversationId = params?.id ? parseInt(params.id) : null;
  const [currentConversation, setCurrentConversation] = useState<ChatConversation | null>(null);

  // Fetch conversations
  const { data: conversations = [], isLoading: loadingConversations } = useQuery({
    queryKey: ['/api/conversations'],
    queryFn: async () => {
      const response = await chatApi.getConversations();
      return response.json();
    }
  });

  // Fetch current conversation
  const { data: conversation } = useQuery({
    queryKey: ['/api/conversations', conversationId],
    queryFn: async () => {
      if (!conversationId) return null;
      const response = await chatApi.getConversation(conversationId);
      return response.json();
    },
    enabled: !!conversationId
  });

  // Fetch messages for current conversation
  const { data: messages = [], isLoading: loadingMessages } = useQuery({
    queryKey: ['/api/conversations', conversationId, 'messages'],
    queryFn: async () => {
      if (!conversationId) return [];
      const response = await chatApi.getMessages(conversationId);
      return response.json();
    },
    enabled: !!conversationId
  });

  useEffect(() => {
    if (conversation) {
      setCurrentConversation(conversation);
    }
  }, [conversation]);

  return (
    <div className="h-screen flex bg-[var(--dark-bg)] text-white">
      <Sidebar 
        conversations={conversations}
        currentConversation={currentConversation}
        isLoading={loadingConversations}
      />
      <ChatArea 
        conversation={currentConversation}
        messages={messages}
        isLoading={loadingMessages}
      />
    </div>
  );
}
