import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || "default_key"
});

export async function getChatResponse(message: string, context?: string[]): Promise<string> {
  try {
    const systemPrompt = `Anda adalah asisten AI yang sangat membantu dan ramah berbahasa Indonesia. Anda bertugas membantu pengguna dengan:

1. Customer Service - Menjawab pertanyaan tentang produk, layanan, pembayaran, pengiriman, dll.
2. FAQ - Memberikan informasi tentang pertanyaan yang sering diajukan
3. Percakapan Umum - Berbicara secara natural dan membantu dengan berbagai topik

Pedoman komunikasi:
- Gunakan bahasa Indonesia yang sopan dan ramah
- Berikan jawaban yang detail dan membantu
- Jika tidak tahu jawaban pasti, katakan dengan jujur
- Tawarkan bantuan lebih lanjut jika diperlukan
- Sesekali tanyakan apakah pengguna membutuhkan informasi kontak untuk follow-up

Gaya komunikasi:
- Hangat dan profesional
- Menggunakan emotikon seperlunya
- Proaktif menawarkan bantuan
- Responsif terhadap kebutuhan pengguna`;

    const messages: OpenAI.ChatCompletionMessageParam[] = [
      {
        role: "system",
        content: systemPrompt
      }
    ];

    // Add context if provided
    if (context && context.length > 0) {
      messages.push({
        role: "system",
        content: `Konteks percakapan sebelumnya: ${context.join('\n')}`
      });
    }

    messages.push({
      role: "user",
      content: message
    });

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    });

    const aiResponse = response.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error("No response received from AI");
    }

    return aiResponse;

  } catch (error) {
    console.error("Error getting AI response:", error);
    
    // Fallback responses in Indonesian
    const fallbackResponses = [
      "Maaf, saya mengalami kesulitan teknis saat ini. Bisakah Anda mengulangi pertanyaan Anda?",
      "Sepertinya ada gangguan koneksi. Silakan coba lagi dalam beberapa saat.",
      "Saya sedang mengalami masalah teknis. Apakah ada yang bisa saya bantu dengan cara lain?",
      "Mohon maaf atas ketidaknyamanannya. Sistem sedang mengalami gangguan sementara."
    ];
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
  }
}

export async function analyzeUserIntent(message: string): Promise<{
  intent: 'customer_service' | 'faq' | 'general' | 'prospect_collection';
  confidence: number;
  category?: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Analyze the user's message and determine their intent. Respond with JSON in this format:
          {
            "intent": "customer_service" | "faq" | "general" | "prospect_collection",
            "confidence": number between 0 and 1,
            "category": optional specific category
          }
          
          Intent definitions:
          - customer_service: Questions about products, services, orders, complaints, support
          - faq: Common questions about company, policies, procedures
          - general: General conversation, greetings, casual chat
          - prospect_collection: When user shows interest in products/services and might want to be contacted`
        },
        {
          role: "user",
          content: message
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 200,
      temperature: 0.3
    });

    const result = JSON.parse(response.choices[0]?.message?.content || '{}');
    
    return {
      intent: result.intent || 'general',
      confidence: result.confidence || 0.5,
      category: result.category
    };

  } catch (error) {
    console.error("Error analyzing intent:", error);
    return {
      intent: 'general',
      confidence: 0.5
    };
  }
}

export async function generateProspectCollectionPrompt(userMessage: string, conversationHistory: string[]): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Berdasarkan pesan pengguna dan riwayat percakapan, buat respon yang natural untuk mengumpulkan informasi kontak prospek. 

          Pedoman:
          - Jangan terlalu memaksa atau sales-y
          - Tawarkan nilai tambah (konsultasi gratis, informasi khusus, dll)
          - Buat alasan yang masuk akal mengapa perlu kontak
          - Gunakan bahasa yang ramah dan profesional
          - Pastikan terasa natural dalam konteks percakapan

          Contoh pendekatan:
          - "Untuk memberikan rekomendasi yang lebih tepat..."
          - "Agar saya bisa mengirimkan informasi detail..."
          - "Supaya tim kami bisa membantu lebih lanjut..."
          - "Untuk konsultasi gratis yang lebih personal..."`
        },
        {
          role: "user",
          content: `Pesan pengguna: ${userMessage}
          
          Riwayat percakapan: ${conversationHistory.join('\n')}`
        }
      ],
      max_tokens: 300,
      temperature: 0.7
    });

    return response.choices[0]?.message?.content || "Untuk memberikan bantuan yang lebih tepat, bolehkah saya meminta informasi kontak Anda?";

  } catch (error) {
    console.error("Error generating prospect collection prompt:", error);
    return "Untuk memberikan bantuan yang lebih tepat, bolehkah saya meminta informasi kontak Anda?";
  }
}

export async function processFileContent(filePath: string, mimeType: string): Promise<string> {
  try {
    // For now, return a simple acknowledgment
    // In a full implementation, you would process different file types
    const fileType = mimeType.split('/')[0];
    
    switch (fileType) {
      case 'image':
        return "Saya melihat Anda telah mengunggah gambar. Bisakah Anda menjelaskan apa yang ingin Anda tanyakan tentang gambar tersebut?";
      case 'application':
        return "Dokumen Anda telah saya terima. Apa yang ingin Anda tanyakan tentang dokumen ini?";
      case 'text':
        return "File teks Anda telah saya baca. Ada yang ingin Anda diskusikan tentang isinya?";
      default:
        return "File Anda telah saya terima. Bagaimana saya bisa membantu Anda dengan file ini?";
    }
  } catch (error) {
    console.error("Error processing file content:", error);
    return "Maaf, saya mengalami kesulitan memproses file Anda. Bisakah Anda menjelaskan apa yang ingin Anda tanyakan?";
  }
}
