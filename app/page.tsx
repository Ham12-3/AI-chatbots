'use client';
import { useState, useEffect, useRef, FormEvent } from 'react';
import styles from './page.module.css';

type Message = { role: 'user' | 'assistant'; content: string };
type Chat = { id: number; title: string; messages: Message[] };

export default function Home() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const endRef = useRef<HTMLDivElement | null>(null);

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

  const sendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentChat) return;

    const userMsg: Message = { role: 'user', content: input };
    const updated: Chat = {
      ...currentChat,
      title: currentChat.messages.length === 0 ? input.slice(0, 20) : currentChat.title,
      messages: [...currentChat.messages, userMsg]
    };
    setChats(prev => prev.map(c => (c.id === currentId ? updated : c)));
    setInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      const botMsg: Message = { role: 'assistant', content: data.reply };
      setChats(prev => prev.map(c => (c.id === currentId ? { ...updated, messages: [...updated.messages, botMsg] } : c)));
    } catch {
      const botMsg: Message = { role: 'assistant', content: 'Error getting response.' };
      setChats(prev => prev.map(c => (c.id === currentId ? { ...updated, messages: [...updated.messages, botMsg] } : c)));
    }
  };

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <button className={styles.newChat} onClick={newChat}>+ New Chat</button>
        <div className={styles.chatList}>
          {chats.map(chat => (
            <div
              key={chat.id}
              className={`${styles.chatItem} ${chat.id === currentId ? styles.active : ''}`}
              onClick={() => setCurrentId(chat.id)}
            >
              {chat.title}
            </div>
          ))}
        </div>
      </aside>
      <main className={styles.chatWindow}>
        <div className={styles.messages}>
          {currentChat?.messages.map((m, i) => (
            <div key={i} className={m.role === 'user' ? styles.userMessage : styles.assistantMessage}>
              {m.content}
            </div>
          ))}
          <div ref={endRef} />
        </div>
        <form className={styles.inputArea} onSubmit={sendMessage}>
          <input
            className={styles.input}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button className={styles.send} type="submit">Send</button>
        </form>
      </main>
    </div>
  );
}
