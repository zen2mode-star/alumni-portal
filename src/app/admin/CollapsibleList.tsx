'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import styles from './page.module.css';

interface Props {
  title: string;
  count: number;
  children: React.ReactNode;
}

export default function CollapsibleList({ title, count, children }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ marginBottom: '1rem', border: '1px solid var(--card-border)', borderRadius: '12px', overflow: 'hidden' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          padding: '1rem 1.25rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--card-bg)',
          border: 'none',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          textAlign: 'left'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</span>
          <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.5rem', background: 'var(--accent-glow)', borderRadius: '4px', color: 'var(--accent-color)' }}>{count} Records</span>
        </div>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
      {isOpen && (
        <div style={{ padding: '0 1.25rem 1.25rem', background: 'var(--bg-elevated)' }}>
          {children}
        </div>
      )}
    </div>
  );
}
