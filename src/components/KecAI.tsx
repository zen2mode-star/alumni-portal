'use client';
import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Minus, MessageSquare, Sparkles } from 'lucide-react';
import { askKecAI } from '@/actions/ai';
import styles from './KecAI.module.css';

export default function KecAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'ai' | 'user', text: string }[]>([
    { role: 'ai', text: 'Hello! I am KecAI. Ask me anything about our Alumni network or KEC campus!' }
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const res = await askKecAI(userMsg);
    setLoading(false);

    if (res.error) {
      setMessages(prev => [...prev, { role: 'ai', text: `⚠️ ${res.error}` }]);
    } else {
      setMessages(prev => [...prev, { role: 'ai', text: res.answer || '' }]);
    }
  }

  if (!isOpen) {
    return (
      <button className={styles.launcher} onClick={() => setIsOpen(true)}>
        <Bot size={24} />
        <span className={styles.launcherText}>Ask KecAI</span>
      </button>
    );
  }

  return (
    <div className={`${styles.chatContainer} ${isMinimized ? styles.minimized : ''}`}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <Sparkles size={16} />
          <span>KecAI Assistant</span>
        </div>
        <div className={styles.headerActions}>
          <button onClick={() => setIsMinimized(!isMinimized)}><Minus size={16} /></button>
          <button onClick={() => setIsOpen(false)}><X size={16} /></button>
        </div>
      </header>

      {!isMinimized && (
        <>
          <div className={styles.messages} ref={scrollRef}>
            {messages.map((m, i) => (
              <div key={i} className={`${styles.message} ${styles[m.role]}`}>
                <div className={styles.bubble}>{m.text}</div>
              </div>
            ))}
            {loading && <div className={styles.loading}>KecAI is thinking...</div>}
          </div>

          <form onSubmit={handleSend} className={styles.footer}>
            <input 
              type="text" 
              value={input} 
              onChange={e => setInput(e.target.value)} 
              placeholder="Ask about alumni, jobs..." 
              autoFocus
            />
            <button type="submit" disabled={loading}><Send size={18} /></button>
          </form>
        </>
      )}
    </div>
  );
}
