'use client';
import { useState, useEffect } from 'react';
import { sendMessage, markAsRead } from '@/actions/messages';
import styles from './page.module.css';

export default function ChatUI({ receiverId, initialMessages, currentUserId }: { receiverId: string, initialMessages: any[], currentUserId: string }) {
  const [content, setContent] = useState('');

  // Mark as read when messages load
  useEffect(() => {
    markAsRead(receiverId);
  }, [receiverId, initialMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    await sendMessage(receiverId, content);
    setContent('');
  };

  return (
    <div className={styles.chatBox}>
      <div className={styles.messagesList}>
        {initialMessages.map(msg => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`${styles.messageBubble} ${isMe ? styles.myMessage : styles.theirMessage}`}>
              <div className={styles.msgText}>{msg.content}</div>
              <div className={styles.msgTime}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          );
        })}
        {initialMessages.length === 0 && (
          <p className={styles.noMessages}>No messages yet. Say hi!</p>
        )}
      </div>
      <form onSubmit={handleSend} className={styles.messageForm}>
        <input 
          type="text" 
          value={content} 
          onChange={e => setContent(e.target.value)} 
          placeholder="Type your message..." 
          className={styles.messageInput} 
        />
        <button type="submit" className={styles.sendButton}>Send</button>
      </form>
    </div>
  );
}
