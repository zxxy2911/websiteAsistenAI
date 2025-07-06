import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, CheckCircle } from "lucide-react";
import { chatApi } from "@/lib/chat-api";
import { useToast } from "@/hooks/use-toast";
import type { ProspectData } from "@/types/chat";

interface ProspectFormProps {
  conversationId?: number;
}

export default function ProspectForm({ conversationId }: ProspectFormProps) {
  const [formData, setFormData] = useState<ProspectData>({
    name: "",
    email: "",
    phone: "",
    conversationId
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createProspectMutation = useMutation({
    mutationFn: chatApi.createProspect,
    onSuccess: () => {
      setIsSubmitted(true);
      toast({
        title: "Terima kasih!",
        description: "Informasi Anda telah tersimpan. Kami akan segera menghubungi Anda.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/prospects'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Gagal menyimpan informasi. Silakan coba lagi.",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    createProspectMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof ProspectData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkip = () => {
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex justify-start">
        <div className="max-w-2xl">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-cyan)] rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-[var(--dark-bg)]" />
            </div>
            <div className="bg-[var(--dark-bg)]/50 border border-[var(--neon-green)]/30 px-6 py-4 rounded-2xl">
              <p className="text-white font-medium">
                Terima kasih! Informasi Anda telah tersimpan. Mari kita lanjutkan percakapan.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start">
      <div className="max-w-2xl">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-[var(--neon-amber)] to-[var(--neon-cyan)] rounded-full flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-[var(--dark-bg)]" />
          </div>
          <div className="bg-[var(--dark-bg)]/50 border border-[var(--neon-cyan)]/30 px-6 py-4 rounded-2xl">
            <p className="text-white font-medium mb-4">
              Untuk memberikan rekomendasi yang lebih tepat, bolehkah saya meminta informasi kontak Anda?
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Nama Lengkap
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Masukkan nama lengkap Anda"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--dark-bg)] border border-[var(--neon-cyan)]/30 rounded-lg text-white placeholder-gray-400 focus:border-[var(--neon-magenta)] focus:outline-none focus:ring-2 focus:ring-[var(--neon-magenta)]/20"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--dark-bg)] border border-[var(--neon-cyan)]/30 rounded-lg text-white placeholder-gray-400 focus:border-[var(--neon-magenta)] focus:outline-none focus:ring-2 focus:ring-[var(--neon-magenta)]/20"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Nomor WhatsApp
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+62 812 3456 7890"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className="w-full px-4 py-2 bg-[var(--dark-bg)] border border-[var(--neon-cyan)]/30 rounded-lg text-white placeholder-gray-400 focus:border-[var(--neon-magenta)] focus:outline-none focus:ring-2 focus:ring-[var(--neon-magenta)]/20"
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={createProspectMutation.isPending}
                  className="px-6 py-2 gradient-bg text-[var(--dark-bg)] font-semibold hover:shadow-lg hover:shadow-[var(--neon-cyan)]/25 transition-all duration-300 neon-glow"
                >
                  {createProspectMutation.isPending ? "Menyimpan..." : "Kirim Informasi"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleSkip}
                  className="px-6 py-2 bg-[var(--dark-bg)]/50 border border-[var(--neon-cyan)]/30 text-[var(--neon-cyan)] hover:border-[var(--neon-magenta)]/50 transition-all duration-300"
                >
                  Lewati
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
