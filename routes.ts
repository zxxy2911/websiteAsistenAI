import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getChatResponse } from "./openai";
import { insertConversationSchema, insertMessageSchema, insertProspectSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Allow images, documents, and text files
    const allowedMimes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain', 'text/csv', 'application/json'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('File type not supported'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve download files
  app.use('/downloads', express.static('public'));
  app.use(express.static('public'));
  // Get all conversations
  app.get("/api/conversations", async (req, res) => {
    try {
      const conversations = await storage.getConversations();
      res.json(conversations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  // Get conversation by ID
  app.get("/api/conversations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const conversation = await storage.getConversation(id);
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch conversation" });
    }
  });

  // Create new conversation
  app.post("/api/conversations", async (req, res) => {
    try {
      const data = insertConversationSchema.parse(req.body);
      const conversation = await storage.createConversation(data);
      res.status(201).json(conversation);
    } catch (error) {
      res.status(400).json({ message: "Invalid conversation data" });
    }
  });

  // Update conversation title
  app.patch("/api/conversations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { title } = req.body;
      
      if (!title) {
        return res.status(400).json({ message: "Title is required" });
      }
      
      const conversation = await storage.updateConversation(id, title);
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      res.json(conversation);
    } catch (error) {
      res.status(500).json({ message: "Failed to update conversation" });
    }
  });

  // Delete conversation
  app.delete("/api/conversations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteConversation(id);
      
      if (!success) {
        return res.status(404).json({ message: "Conversation not found" });
      }
      
      res.json({ message: "Conversation deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete conversation" });
    }
  });

  // Get messages for a conversation
  app.get("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const messages = await storage.getMessages(conversationId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Send message and get AI response
  app.post("/api/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const { content, files } = req.body;
      
      if (!content || content.trim() === '') {
        return res.status(400).json({ message: "Message content is required" });
      }

      // Create user message
      const userMessage = await storage.createMessage({
        conversationId,
        content,
        role: "user",
        metadata: files ? { files } : null
      });

      // Get AI response
      const aiResponse = await getChatResponse(content);
      
      // Create AI message
      const aiMessage = await storage.createMessage({
        conversationId,
        content: aiResponse,
        role: "assistant",
        metadata: null
      });

      // Update conversation timestamp
      await storage.updateConversation(conversationId, 
        content.length > 50 ? content.substring(0, 50) + "..." : content
      );

      res.json({ userMessage, aiMessage });
    } catch (error) {
      console.error("Error in message handling:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  // Upload file
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const file = req.file;
      const fileData = {
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: file.path,
        messageId: null // Will be set when message is created
      };

      res.json({
        id: file.filename,
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
        url: `/api/files/${file.filename}`
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Serve uploaded files
  app.get("/api/files/:filename", (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: "File not found" });
    }
    
    res.sendFile(filePath);
  });

  // Create prospect
  app.post("/api/prospects", async (req, res) => {
    try {
      const data = insertProspectSchema.parse(req.body);
      const prospect = await storage.createProspect(data);
      res.status(201).json(prospect);
    } catch (error) {
      res.status(400).json({ message: "Invalid prospect data" });
    }
  });

  // Get all prospects
  app.get("/api/prospects", async (req, res) => {
    try {
      const prospects = await storage.getProspects();
      res.json(prospects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch prospects" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
