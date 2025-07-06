export interface ChatMessage {
  id: number;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  metadata?: any;
}

export interface ChatConversation {
  id: number;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProspectData {
  name: string;
  email: string;
  phone?: string;
  conversationId?: number;
}

export interface FileUpload {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface ChatState {
  conversations: ChatConversation[];
  currentConversation: ChatConversation | null;
  messages: ChatMessage[];
  isTyping: boolean;
  uploadedFiles: FileUpload[];
}
