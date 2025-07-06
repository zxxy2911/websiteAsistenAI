# xXzZyyAI - AI Chatbot by ejaa[xXzZyy]

## Overview

This is a full-stack AI chatbot application called "xXzZyyAI" created by ejaa[xXzZyy]. Built with React, TypeScript, Express, and PostgreSQL, featuring a vibrant neon-themed design with animated gradients. The application provides an AI-powered chat interface for customer service interactions, FAQ responses, general conversation, and prospect data collection. The AI assistant is configured to communicate in Indonesian and handle customer service, FAQ, and general conversation scenarios with enhanced neon visual effects.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: Radix UI components with Tailwind CSS for styling
- **State Management**: TanStack Query for server state and caching
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom neon-themed design system

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **File Handling**: Multer for file uploads with local storage
- **AI Integration**: OpenAI GPT-4o for chat responses
- **Session Management**: Built-in session handling for conversation persistence

## Key Components

### Database Schema
- **Users**: Basic user authentication system
- **Conversations**: Chat session management with timestamps
- **Messages**: Individual messages with role-based content (user/assistant)
- **Prospects**: Customer lead information collection
- **Files**: File upload metadata and storage references

### API Endpoints
- **Conversations**: CRUD operations for chat sessions
- **Messages**: Real-time message handling with AI responses
- **File Upload**: Secure file upload with type validation
- **Prospects**: Lead capture and management

### Frontend Components
- **Chat Interface**: Real-time chat with typing indicators and message history
- **Sidebar**: Conversation management and navigation
- **File Upload**: Drag-and-drop file handling with progress indicators
- **Prospect Forms**: Data collection forms for customer information

## Data Flow

1. **User Interaction**: User sends message through chat interface
2. **API Request**: Frontend sends message to Express API
3. **Database Storage**: Message stored in PostgreSQL via Drizzle ORM
4. **AI Processing**: OpenAI API generates response based on Indonesian customer service context
5. **Response Storage**: AI response stored and returned to frontend
6. **Real-time Updates**: TanStack Query updates UI with new messages

## External Dependencies

### Core Framework Dependencies
- **@neondatabase/serverless**: Neon PostgreSQL serverless driver
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **openai**: OpenAI API client for GPT-4o integration

### UI/UX Dependencies
- **@radix-ui/***: Comprehensive UI component library
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **wouter**: Lightweight routing

### Development Dependencies
- **vite**: Fast build tool and dev server
- **typescript**: Type safety and development experience
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React application to `dist/public`
2. **Backend Build**: esbuild bundles Express server to `dist/index.js`
3. **Database Migration**: Drizzle handles schema migrations via `db:push`

### Environment Configuration
- **DATABASE_URL**: Neon PostgreSQL connection string
- **OPENAI_API_KEY**: OpenAI API authentication
- **NODE_ENV**: Environment-specific configurations

### Production Deployment
- **Static Assets**: Frontend served from Express static middleware
- **API Routes**: Express handles all `/api/*` requests
- **Database**: Neon serverless PostgreSQL with connection pooling
- **File Storage**: Local file system with configurable upload directory

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- July 06, 2025: Initial setup with basic chat functionality
- July 06, 2025: Complete rebrand to "xXzZyyAI" by ejaa[xXzZyy]
- Enhanced neon theme with:
  - Extended color palette (8 neon colors)
  - Animated gradient backgrounds with 800% size
  - Chat bubble glow animations
  - Enhanced scrollbar styling
  - Pulsing neon text effects
  - Multi-color gradient buttons and elements
- Updated branding throughout application
- Fixed TypeScript errors in storage and routes
- Enhanced visual effects and animations