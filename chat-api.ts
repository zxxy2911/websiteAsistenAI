import { apiRequest } from "./queryClient";

export interface SendMessageRequest {
  content: string;
  files?: any[];
}

export interface SendMessageResponse {
  userMessage: any;
  aiMessage: any;
}

export const chatApi = {
  // Conversations
  getConversations: () => apiRequest('GET', '/api/conversations'),
  getConversation: (id: number) => apiRequest('GET', `/api/conversations/${id}`),
  createConversation: (data: { title: string }) => apiRequest('POST', '/api/conversations', data),
  updateConversation: (id: number, data: { title: string }) => apiRequest('PATCH', `/api/conversations/${id}`, data),
  deleteConversation: (id: number) => apiRequest('DELETE', `/api/conversations/${id}`),

  // Messages
  getMessages: (conversationId: number) => apiRequest('GET', `/api/conversations/${conversationId}/messages`),
  sendMessage: (conversationId: number, data: SendMessageRequest) => 
    apiRequest('POST', `/api/conversations/${conversationId}/messages`, data),

  // Prospects
  createProspect: (data: any) => apiRequest('POST', '/api/prospects', data),
  getProspects: () => apiRequest('GET', '/api/prospects'),

  // Files
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error('File upload failed');
    }
    
    return response.json();
  }
};
