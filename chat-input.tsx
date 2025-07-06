import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Paperclip, Mic, Upload, X, Loader2 } from "lucide-react";
import FileUpload from "@/components/ui/file-upload";
import { chatApi } from "@/lib/chat-api";
import { useToast } from "@/hooks/use-toast";
import type { ChatConversation, FileUpload as FileUploadType } from "@/types/chat";

interface ChatInputProps {
  conversation: ChatConversation | null;
  onTypingStart: () => void;
  onTypingEnd: () => void;
}

export default function ChatInput({ conversation, onTypingStart, onTypingEnd }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadType[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { content: string; files?: FileUploadType[] }) => {
      if (!conversation) throw new Error("No conversation selected");
      
      onTypingStart();
      const response = await chatApi.sendMessage(conversation.id, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/conversations', conversation?.id, 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/conversations'] });
      setMessage("");
      setUploadedFiles([]);
      onTypingEnd();
    },
    onError: (error) => {
      console.error("Failed to send message:", error);
      toast({
        title: "Error",
        description: "Gagal mengirim pesan. Silakan coba lagi.",
        variant: "destructive"
      });
      onTypingEnd();
    }
  });

  const uploadFileMutation = useMutation({
    mutationFn: chatApi.uploadFile,
    onSuccess: (fileData) => {
      setUploadedFiles(prev => [...prev, fileData]);
      toast({
        title: "Sukses",
        description: "File berhasil diunggah",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal mengunggah file",
        variant: "destructive"
      });
    }
  });

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  }, [message]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !conversation) return;

    sendMessageMutation.mutate({
      content: message,
      files: uploadedFiles.length > 0 ? uploadedFiles : undefined
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      uploadFileMutation.mutate(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      uploadFileMutation.mutate(file);
    });
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording
    toast({
      title: "Fitur Suara",
      description: "Fitur input suara akan segera tersedia",
    });
  };

  const suggestedQuestions = [
    "Apa produk terbaru?",
    "Cara melakukan pemesanan?",
    "Metode pembayaran apa saja?",
    "Berapa lama pengiriman?"
  ];

  return (
    <div className="p-4 bg-[var(--dark-bg)] border-t border-[var(--neon-cyan)]/10">
      <div className="max-w-3xl mx-auto">
        
        {/* File Upload Area */}
        {isDragOver && (
          <div className="file-upload-area mb-4 p-4 rounded-lg text-center">
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-[var(--neon-cyan)]" />
              <p className="text-sm text-gray-300">Lepaskan file di sini untuk mengunggah</p>
              <p className="text-xs text-gray-400">Mendukung gambar, dokumen, dan file teks</p>
            </div>
          </div>
        )}

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="mb-4 space-y-2">
            {uploadedFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-3 p-3 bg-[var(--dark-bg)]/50 border border-[var(--neon-cyan)]/30 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-[var(--neon-amber)] to-[var(--neon-green)] rounded flex items-center justify-center">
                  <Paperclip className="w-4 h-4 text-[var(--dark-bg)]" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">{file.name}</p>
                  <p className="text-xs text-gray-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(file.id)}
                  className="text-red-400 hover:text-red-300 transition-colors p-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Message Input - ChatGPT Style */}
        <form onSubmit={handleSubmit} className="relative">
          <div 
            className="flex items-end gap-3 bg-[var(--dark-surface)]/50 border border-[var(--neon-cyan)]/20 rounded-2xl p-3"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {/* File Upload Button */}
            <div className="flex-shrink-0">
              <label className="cursor-pointer w-10 h-10 bg-transparent border-0 p-2 rounded-lg hover:bg-[var(--dark-surface)] transition-colors flex items-center justify-center">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <Paperclip className="w-5 h-5 text-gray-400 hover:text-[var(--neon-cyan)]" />
              </label>
            </div>
            
            {/* Text Input */}
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Tulis pesan..."
                className="w-full bg-transparent border-0 text-white placeholder-gray-400 focus:outline-none resize-none min-h-[24px] max-h-[200px] scrollbar-neon text-[16px] leading-6 p-0"
                rows={1}
              />
            </div>
            
            {/* Send Button */}
            <div className="flex-shrink-0">
              <Button
                type="submit"
                disabled={!message.trim() || sendMessageMutation.isPending}
                className="w-10 h-10 gradient-bg text-[var(--dark-bg)] rounded-lg flex items-center justify-center hover:shadow-lg hover:shadow-[var(--neon-cyan)]/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed p-0"
              >
                {sendMessageMutation.isPending ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Help Text */}
          <div className="text-xs text-gray-500 text-center mt-2">
            xXzZyyAI dapat membuat kesalahan. Periksa informasi penting.
          </div>
        </form>


      </div>
    </div>
  );
}
