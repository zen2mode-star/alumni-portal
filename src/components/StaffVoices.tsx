'use client';
import { Quote } from 'lucide-react';
import styles from './StaffVoices.module.css';

interface Message {
  id: string;
  title: string;
  content: string;
  designation: string;
}

interface Props {
  messages: Message[];
}

export default function StaffVoices({ messages }: Props) {
  if (messages.length === 0) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.badge}>Institutional Voices</div>
        <h2 className={styles.title}>KEC Officials</h2>
        <p className={styles.subtitle}>Strategic insights and messages from the leadership at BTKIT Dwarahat</p>
      </div>
      
      <div className={styles.grid}>
        {messages.map((msg) => (
          <div key={msg.id} className={styles.voiceCard}>
            <div className={styles.quoteIcon}>
              <Quote size={20} fill="currentColor" />
            </div>
            <div className={styles.cardContent}>
              <h3 className={styles.msgTitle}>{msg.title}</h3>
              <p className={styles.msgText}>{msg.content}</p>
              <div className={styles.meta}>
                <div className={styles.divider} />
                <span className={styles.author}>{msg.designation}</span>
                <span className={styles.inst}>BTKIT Dwarahat</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
