'use client';
import { useState, useEffect, useRef, FormEvent } from 'react';
import styles from './page.module.css';

type Message = { role: 'user' | 'assistant'; content: string };
type Chat = { id: number; title: string; messages: Message[] };

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('chats');
    if (saved) {
      const parsed: Chat[] = JSON.parse(saved);
      if (parsed.length > 0) {
        setChats(parsed);
        setCurrentId(parsed[0].id);
      } else {
        // If saved chats exist but are empty, create initial empty chat
        const initial: Chat = { id: Date.now(), title: 'New Chat', messages: [] };
        setChats([initial]);
        setCurrentId(initial.id);
      }
    } else {
      // No saved chats, create initial empty chat
      const initial: Chat = { id: Date.now(), title: 'New Chat', messages: [] };
      setChats([initial]);
      setCurrentId(initial.id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, currentId]);

  const currentChat = chats.find(c => c.id === currentId);

  const newChat = () => {
    const chat: Chat = { id: Date.now(), title: 'New Chat', messages: [] };
    setChats(prev => [chat, ...prev]);
    setCurrentId(chat.id);
  };

  const deleteChat = (chatId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setChats(prev => {
      const updated = prev.filter(c => c.id !== chatId);
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

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentChat || isLoading) return;

    const userMsg: Message = { role: 'user', content: input };
    const updated: Chat = {
      ...currentChat,
      title: currentChat.messages.length === 0 ? input.slice(0, 30) + (input.length > 30 ? '...' : '') : currentChat.title,
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
          message: input,
          messages: updated.messages 
        })
      });
      
      if (!res.ok) throw new Error('Failed to get response');
      
      const data = await res.json();
      const botMsg: Message = { role: 'assistant', content: data.reply };
      setChats(prev => prev.map(c => (c.id === currentId ? { ...updated, messages: [...updated.messages, botMsg] } : c)));
    } catch (error) {
      console.error('Chat error:', error);
      const botMsg: Message = { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' };
      setChats(prev => prev.map(c => (c.id === currentId ? { ...updated, messages: [...updated.messages, botMsg] } : c)));
    } finally {
      setIsLoading(false);
    }
  };

  const examplePrompts = [
    { title: "Explain concepts", text: "Explain quantum computing in simple terms" },
    { title: "Help with code", text: "Write a Python function to sort a list" },
    { title: "Creative writing", text: "Write a short story about a time traveler" },
    { title: "Answer questions", text: "What are the benefits of meditation?" }
  ];

  const handleExampleClick = (text: string) => {
    setInput(text);
    // If there's no current chat, create one
    if (!currentChat) {
      const newChatForExample: Chat = { id: Date.now(), title: 'New Chat', messages: [] };
      setChats(prev => [newChatForExample, ...prev]);
      setCurrentId(newChatForExample.id);
    }
  };

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <button className={styles.newChat} onClick={newChat}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14m-7-7h14" />
          </svg>
          New chat
        </button>
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
      </aside>
      <main className={styles.chatWindow}>
        {currentChat?.messages.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateTitle}>How can I help you today?</div>
            <div className={styles.emptyStateSubtitle}>Start a conversation or try one of these examples</div>
            <div className={styles.examplePrompts}>
              {examplePrompts.map((prompt, i) => (
                <div
                  key={i}
                  className={styles.examplePrompt}
                  onClick={() => handleExampleClick(prompt.text)}
                >
                  <div className={styles.examplePromptTitle}>{prompt.title}</div>
                  <div className={styles.examplePromptText}>{prompt.text}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={styles.messages}>
            {currentChat?.messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? styles.userMessage : styles.assistantMessage}>
                {m.role === 'user' ? (
                  <div className={styles.userMessageContent}>
                    {m.content}
                  </div>
                ) : (
                  <div className={styles.messageContent}>
                    <div className={styles.messageRow}>
                      <div className={`${styles.messageIcon} ${styles.assistantIcon}`}>
                        ✨
                      </div>
                      <div className={styles.assistantMessageContent}>
                        {m.content}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
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
              <svg className={styles.sendIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
