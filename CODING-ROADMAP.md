# 🚀 ChatGPT Clone - Live Coding Roadmap
## Step-by-Step Guide for Teaching 1000+ Students

---

## 📋 Session Overview
- **Total Duration**: 6 hours (4 sessions × 90 minutes)
- **Students**: 1000+
- **Format**: Live coding with real-time Q&A
- **Outcome**: Fully functional ChatGPT clone

---

## 🎯 Learning Objectives
By the end of this course, students will:
- ✅ Build a complete full-stack AI chatbot
- ✅ Integrate OpenAI API
- ✅ Master React state management
- ✅ Implement responsive UI/UX
- ✅ Deploy to production

---

# SESSION 1: Foundation & Setup
## ⏰ Duration: 90 minutes

### Part A: Environment Setup (20 minutes)

#### 🎤 **Instructor Script**
*"Welcome everyone! Today we're building a ChatGPT clone from scratch. Let's start by setting up our development environment."*

```bash
# Step 1: Check prerequisites
node --version  # Should be v18+
npm --version   # Should be v9+

# Step 2: Create Next.js project
npx create-next-app@latest ai-chatbot --typescript --app --src-dir=false --import-alias="@/*"

# Step 3: Navigate to project
cd ai-chatbot

# Step 4: Install additional dependencies
npm install openai

# Step 5: Start development server
npm run dev
```

#### 🔧 **Live Demo Points**
1. Show terminal commands in action
2. Explain each flag in create-next-app
3. Demonstrate hot reloading
4. Show browser at http://localhost:3000

### Part B: Project Structure Walkthrough (15 minutes)

#### 📁 **File Structure Explanation**
```
ai-chatbot/
├── app/                     # App Router (Next.js 13+)
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page
│   └── page.module.css     # Component styles
├── package.json            # Dependencies
└── next.config.js          # Next.js config
```

#### 🎤 **Instructor Notes**
- *"Notice we're using the new App Router - this is the latest Next.js convention"*
- *"CSS Modules help us avoid style conflicts"*
- *"TypeScript gives us better development experience with autocomplete and error checking"*

### Part C: Basic Layout Setup (25 minutes)

#### Step 1: Clean up default files
```tsx
// app/page.tsx
'use client';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.app}>
      <h1>ChatGPT Clone</h1>
    </div>
  );
}
```

#### Step 2: Global styles
```css
/* app/globals.css */
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #ffffff;
  color: #374151;
}

* {
  box-sizing: border-box;
}
```

#### Step 3: Component styles foundation
```css
/* app/page.module.css */
.app {
  display: flex;
  height: 100vh;
  background: #ffffff;
}

.sidebar {
  width: 260px;
  background: #f7f7f8;
  border-right: 1px solid #e5e5e5;
}

.chatWindow {
  flex: 1;
  background: #ffffff;
}
```

### Part D: TypeScript Types Setup (15 minutes)

```tsx
// Add to app/page.tsx
type Message = { 
  role: 'user' | 'assistant'; 
  content: string;
};

type Chat = { 
  id: number; 
  title: string; 
  messages: Message[];
};
```

#### 🎤 **Teaching Points**
- *"Types help prevent bugs and improve code quality"*
- *"These match OpenAI's message format"*
- *"IntelliSense will now help us with autocompletion"*

### Part E: Basic State Management (15 minutes)

```tsx
// app/page.tsx
'use client';
import { useState } from 'react';
import styles from './page.module.css';

// ... types here

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [input, setInput] = useState('');

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <h2>Chats</h2>
        {/* Chat list will go here */}
      </aside>
      <main className={styles.chatWindow}>
        <h2>Chat Window</h2>
        {/* Messages will go here */}
      </main>
    </div>
  );
}
```

### 🎯 **Session 1 Checkpoint**
Students should have:
- ✅ Working Next.js development environment
- ✅ Basic layout with sidebar and main area
- ✅ TypeScript types defined
- ✅ Initial state management

---

# SESSION 2: UI Implementation
## ⏰ Duration: 90 minutes

### Part A: Sidebar Implementation (30 minutes)

#### Step 1: New Chat Button
```tsx
// Add to return statement in app/page.tsx
<aside className={styles.sidebar}>
  <button className={styles.newChat} onClick={newChat}>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14m-7-7h14" />
    </svg>
    New chat
  </button>
  
  <div className={styles.chatList}>
    {/* Chat items will go here */}
  </div>
</aside>
```

#### Step 2: New Chat Function
```tsx
// Add before return statement
const newChat = () => {
  const chat: Chat = { id: Date.now(), title: 'New Chat', messages: [] };
  setChats(prev => [chat, ...prev]);
  setCurrentId(chat.id);
};
```

#### Step 3: Sidebar Styles
```css
/* app/page.module.css */
.newChat {
  background: transparent;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 12px 16px;
  margin: 16px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: calc(100% - 24px);
}

.newChat:hover {
  background: #f3f4f6;
}
```

#### 🎤 **Live Demo**
*"Let's test our new chat button - click it and check the React DevTools to see state updates!"*

### Part B: Chat List Implementation (30 minutes)

#### Step 1: Chat List Component
```tsx
// Update chatList div
<div className={styles.chatList}>
  {chats.map(chat => (
    <div
      key={chat.id}
      className={`${styles.chatItem} ${chat.id === currentId ? styles.active : ''}`}
      onClick={() => setCurrentId(chat.id)}
    >
      <div className={styles.chatTitle}>{chat.title}</div>
      <button
        className={styles.deleteChat}
        onClick={(e) => deleteChat(chat.id, e)}
        title="Delete chat"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </button>
    </div>
  ))}
</div>
```

#### Step 2: Delete Chat Function
```tsx
const deleteChat = (chatId: number, e: React.MouseEvent) => {
  e.stopPropagation(); // Prevent triggering chat selection
  setChats(prev => {
    const updated = prev.filter(c => c.id !== chatId);
    // Handle edge cases
    if (currentId === chatId && updated.length > 0) {
      setCurrentId(updated[0].id);
    } else if (updated.length === 0) {
      const newChat: Chat = { id: Date.now(), title: 'New Chat', messages: [] };
      setCurrentId(newChat.id);
      return [newChat];
    }
    return updated;
  });
};
```

#### Step 3: Chat Item Styles
```css
.chatItem {
  padding: 12px 16px;
  cursor: pointer;
  border-radius: 8px;
  font-size: 14px;
  color: #374151;
  margin: 0 12px 4px 12px;
  transition: background-color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.chatItem:hover {
  background: #f3f4f6;
}

.chatItem.active {
  background: #e5e7eb;
  color: #111827;
}

.chatTitle {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
}

.deleteChat {
  background: transparent;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  opacity: 0;
  transition: all 0.2s ease;
}

.chatItem:hover .deleteChat {
  opacity: 1;
}

.deleteChat:hover {
  background: #f3f4f6;
  color: #ef4444;
}
```

### Part C: Main Chat Window (30 minutes)

#### Step 1: Get Current Chat
```tsx
// Add before return statement
const currentChat = chats.find(c => c.id === currentId);
```

#### Step 2: Messages Display with Modern Chat Bubbles
```tsx
// Update main chat window with proper message alignment
<main className={styles.chatWindow}>
  {currentChat?.messages.length === 0 ? (
    <div className={styles.emptyState}>
      <div className={styles.emptyStateTitle}>How can I help you today?</div>
      <div className={styles.emptyStateSubtitle}>Start a conversation or try one of these examples</div>
      <div className={styles.examplePrompts}>
        {examplePrompts.map((prompt, i) => (
          <div key={i} className={styles.examplePrompt} onClick={() => handleExampleClick(prompt.text)}>
            <div className={styles.examplePromptTitle}>{prompt.title}</div>
            <div className={styles.examplePromptText}>{prompt.text}</div>
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div className={styles.messages}>
      {currentChat?.messages.map((message, index) => (
        <div 
          key={index} 
          className={message.role === 'user' ? styles.userMessage : styles.assistantMessage}
        >
          {message.role === 'user' ? (
            // User messages on the right with blue bubbles
            <div className={styles.userMessageContent}>
              {message.content}
            </div>
          ) : (
            // AI messages on the left with gray bubbles and icon
            <div className={styles.messageContent}>
              <div className={styles.messageRow}>
                <div className={`${styles.messageIcon} ${styles.assistantIcon}`}>
                  ✨
                </div>
                <div className={styles.assistantMessageContent}>
                  {message.content}
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      
      {/* Animated loading indicator while AI processes */}
      {isLoading && (
        <div className={styles.loadingMessage}>
          <div className={styles.loadingContent}>
            <div className={`${styles.messageIcon} ${styles.assistantIcon} ${styles.spinningIcon}`}>
              ✨
            </div>
            <div className={styles.loadingText}>
              AI is thinking...
            </div>
          </div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  )}
  
  <form className={styles.inputArea} onSubmit={sendMessage}>
    <div className={styles.inputContainer}>
      <input
        className={styles.input}
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Message ChatGPT..."
      />
      <button 
        className={styles.send} 
        type="submit"
        disabled={!input.trim() || isLoading}
      >
        {isLoading ? (
          <div className={styles.spinner}>⏳</div>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
          </svg>
        )}
      </button>
    </div>
  </form>
</main>
```

### 🎯 **Session 2 Checkpoint**
Students should have:
- ✅ Functional sidebar with new chat button
- ✅ Chat list with delete functionality
- ✅ Empty state for new chats
- ✅ Message input area

---

# SESSION 3: API Integration & Logic
## ⏰ Duration: 90 minutes

### Part A: OpenAI API Setup (20 minutes)

#### Step 1: Environment Configuration
```bash
# Create environment files
touch .env.local
touch .env.example

# Add to .env.local (students use their own keys)
echo "OPENAI_API_KEY=your_actual_api_key_here" >> .env.local

# Add to .env.example (for repository)
echo "OPENAI_API_KEY=your_openai_api_key_here" >> .env.example
```

#### Step 2: Get OpenAI API Key
1. Go to https://platform.openai.com
2. Sign up/Login
3. Navigate to API Keys
4. Create new secret key
5. Copy key to .env.local

#### 🎤 **Important Security Note**
*"NEVER commit your actual API key to version control. Always use environment variables!"*

### Part B: API Route Creation (30 minutes)

#### Step 1: Create API Directory
```bash
mkdir -p app/api/chat
touch app/api/chat/route.ts
```

#### Step 2: API Route Implementation
```tsx
// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { messages = [] } = await req.json();

    // Validate API key
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ 
        reply: "OpenAI API key is not configured. Please set OPENAI_API_KEY environment variable." 
      });
    }

    // Convert our message format to OpenAI format
    const openaiMessages = [
      {
        role: "system" as const,
        content: "You are a helpful AI assistant. Be concise and helpful in your responses."
      },
      ...messages.map((msg: any) => ({
        role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }))
    ];

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: openaiMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    const reply = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
    
    return NextResponse.json({ reply });
    
  } catch (error) {
    console.error('OpenAI API error:', error);
    
    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json({ 
          reply: "Please check your OpenAI API key configuration." 
        });
      }
      if (error.message.includes('quota') || error.message.includes('billing')) {
        return NextResponse.json({ 
          reply: "OpenAI API quota exceeded. Please check your billing settings." 
        });
      }
    }

    return NextResponse.json({ 
      reply: "I'm experiencing some technical difficulties. Please try again in a moment." 
    });
  }
}
```

#### 🎤 **Teaching Points**
- *"We handle errors gracefully to provide good user experience"*
- *"The system message helps define the AI's personality"*
- *"We pass the full conversation context for better responses"*

### Part C: Frontend Integration (40 minutes)

#### Step 1: Add Loading State
```tsx
// Add to component state
const [isLoading, setIsLoading] = useState(false);
```

#### Step 2: Send Message Function
```tsx
// Add useRef for auto-scroll
import { useState, useEffect, useRef, FormEvent } from 'react';

const endRef = useRef<HTMLDivElement | null>(null);

// Auto-scroll effect
useEffect(() => {
  endRef.current?.scrollIntoView({ behavior: 'smooth' });
}, [chats, currentId]);

// Send message function
const sendMessage = async (e: FormEvent) => {
  e.preventDefault();
  if (!input.trim() || !currentChat || isLoading) return;

  const userMsg: Message = { role: 'user', content: input };
  const updated: Chat = {
    ...currentChat,
    title: currentChat.messages.length === 0 ? 
      input.slice(0, 30) + (input.length > 30 ? '...' : '') : 
      currentChat.title,
    messages: [...currentChat.messages, userMsg]
  };
  
  setChats(prev => prev.map(c => (c.id === currentId ? updated : c)));
  setInput('');
  setIsLoading(true);

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        messages: updated.messages 
      })
    });
    
    if (!res.ok) throw new Error('Failed to get response');
    
    const data = await res.json();
    const botMsg: Message = { role: 'assistant', content: data.reply };
    
    setChats(prev => prev.map(c => (
      c.id === currentId ? 
      { ...updated, messages: [...updated.messages, botMsg] } : 
      c
    )));
    
  } catch (error) {
    console.error('Chat error:', error);
    const errorMsg: Message = { 
      role: 'assistant', 
      content: 'Sorry, I encountered an error. Please try again.' 
    };
    setChats(prev => prev.map(c => (
      c.id === currentId ? 
      { ...updated, messages: [...updated.messages, errorMsg] } : 
      c
    )));
  } finally {
    setIsLoading(false);
  }
};
```

#### Step 3: Add Loading Indicator
```tsx
// Update send button
<button 
  className={styles.send} 
  type="submit"
  disabled={!input.trim() || isLoading}
>
  {isLoading ? (
    <div className={styles.spinner}>⏳</div>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
    </svg>
  )}
</button>

// Add scroll reference
<div ref={endRef} />
```

### 🎯 **Session 3 Checkpoint**
Students should have:
- ✅ Working OpenAI API integration
- ✅ Real-time chat functionality
- ✅ Error handling
- ✅ Loading states
- ✅ Auto-scroll

---

# SESSION 4: Polish & Deployment
## ⏰ Duration: 90 minutes

### Part A: Local Storage Persistence (20 minutes)

```tsx
// Add localStorage effects
useEffect(() => {
  const saved = localStorage.getItem('chats');
  if (saved) {
    const parsed: Chat[] = JSON.parse(saved);
    setChats(parsed);
    if (parsed.length > 0) setCurrentId(parsed[0].id);
  } else {
    const initial: Chat = { id: Date.now(), title: 'New Chat', messages: [] };
    setChats([initial]);
    setCurrentId(initial.id);
  }
}, []);

useEffect(() => {
  if (chats.length > 0) {
    localStorage.setItem('chats', JSON.stringify(chats));
  }
}, [chats]);
```

### Part B: UI Polish & Modern Chat Bubbles (30 minutes)

#### Complete CSS Implementation with Chat Bubbles
```css
/* Add all remaining styles for professional appearance */
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  scroll-behavior: smooth;
}

.userMessage, .assistantMessage {
  padding: 24px 0;
  border-bottom: 1px solid #f0f0f0;
}

.userMessage {
  background: #ffffff;
}

.assistantMessage {
  background: #f7f7f8;
}

.messageContent {
  max-width: 768px;
  margin: 0 auto;
  padding: 0 24px;
  line-height: 1.6;
  font-size: 16px;
}

.messageRow {
  display: flex;
  align-items: flex-start;
}

.messageIcon {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  margin-right: 16px;
  flex-shrink: 0;
}

.userIcon {
  background: #19c37d;
  color: white;
}

.assistantIcon {
  background: #ab68ff;
  color: white;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .sidebar {
    display: none; /* Hide sidebar on mobile initially */
  }
  
  .chatWindow {
    width: 100%;
  }
  
  .messageContent {
    padding: 0 16px;
  }
}
```

### Part C: Testing & Debugging (20 minutes)

#### Testing Checklist with Students
```tsx
// Add error boundaries (optional advanced feature)
const handleError = (error: Error) => {
  console.error('Application error:', error);
  // Could implement error reporting here
};

// Add validation
const validateMessage = (message: string): boolean => {
  if (!message.trim()) return false;
  if (message.length > 4000) {
    alert('Message too long. Please keep it under 4000 characters.');
    return false;
  }
  return true;
};
```

#### 🎤 **Live Testing Session**
1. Test new chat creation
2. Test message sending
3. Test chat deletion
4. Test page refresh (persistence)
5. Test mobile view
6. Test error scenarios

### Part D: Deployment (20 minutes)

#### Step 1: Prepare for Deployment
```bash
# Test production build
npm run build
npm run start

# Check for any build errors
```

#### Step 2: Vercel Deployment
```bash
# Install Vercel CLI (if not already installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# Set up and deploy "~/ai-chatbot"? [Y/n] y
# Which scope do you want to deploy to? [Select your account]
# Link to existing project? [y/N] n
# What's your project's name? ai-chatbot
# In which directory is your code located? ./
```

#### Step 3: Environment Variables Setup
1. Go to Vercel Dashboard
2. Select your project  
3. Go to Settings → Environment Variables
4. Add variable:
   - Name: `OPENAI_API_KEY`
   - Value: `your_actual_api_key`
   - Environment: Production, Preview, Development

#### Step 4: Redeploy
```bash
vercel --prod
```

### 🎯 **Final Checkpoint**
Students should have:
- ✅ Fully functional ChatGPT clone
- ✅ Data persistence
- ✅ Responsive design  
- ✅ Deployed to production
- ✅ Working HTTPS URL to share

---

## 🎉 Session Wrap-up & Q&A

### What We Built
- Full-stack AI chatbot with modern chat bubbles
- Real-time OpenAI integration with loading animations
- Proper message alignment (user right, AI left)
- Animated AI thinking indicator with spinning stars
- Modern React/Next.js application
- Production-ready deployment

### Next Steps for Students
1. Customize the design
2. Add new features (file upload, voice input)
3. Implement user authentication
4. Add database storage
5. Explore advanced OpenAI features

### Resources Provided
- Complete source code
- Deployment guide
- Advanced feature tutorials
- Community Discord/Slack

---

## 📚 Teaching Materials Checklist

### For Instructors
- [ ] Presentation slides
- [ ] Live coding repository
- [ ] Student starter template
- [ ] Common error solutions
- [ ] Q&A preparation

### For Students
- [ ] Prerequisites checklist
- [ ] Code repository access
- [ ] OpenAI account setup guide
- [ ] Deployment instructions
- [ ] Extended learning resources

---

*Ready to teach 1000+ students how to build the future of AI interfaces! 🚀*