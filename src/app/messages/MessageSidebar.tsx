'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, Lock, GraduationCap, Users } from 'lucide-react';

interface User {
  id: string;
  name: string;
  imageUrl?: string | null;
  role: string;
  lastMessage?: string;
  lastMessageAt?: Date;
  unread?: boolean;
}

export default function MessageSidebar({ users, activeUserId }: { users: User[], activeUserId?: string }) {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'ALUMNI' | 'STUDENT'>('ALUMNI');

  const filtered = users.filter(u =>
    u.role === tab &&
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const alumniCount = users.filter(u => u.role === 'ALUMNI').length;
  const studentCount = users.filter(u => u.role === 'STUDENT').length;

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', overflow: 'hidden',
      background: 'var(--bg-color)', borderRight: '1px solid var(--card-border)',
    }}>
      {/* Sidebar Header */}
      <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--card-border)', flexShrink: 0 }}>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <Lock size={10} /> Encrypted Contacts
        </div>

        {/* Tab Toggle */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem' }}>
          <button
            onClick={() => setTab('ALUMNI')}
            style={{
              flex: 1, padding: '0.5rem 0.25rem', borderRadius: '8px',
              border: tab === 'ALUMNI' ? '1px solid var(--primary-color)' : '1px solid var(--card-border)',
              background: tab === 'ALUMNI' ? 'rgba(123,97,255,0.15)' : 'transparent',
              color: tab === 'ALUMNI' ? 'var(--primary-color)' : 'var(--text-secondary)',
              fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
              transition: 'all 0.15s',
            }}
          >
            <Users size={12} /> Alumni
            <span style={{
              background: tab === 'ALUMNI' ? 'var(--primary-color)' : 'var(--card-border)',
              color: 'white', borderRadius: '10px', padding: '0 0.4rem', fontSize: '0.65rem'
            }}>{alumniCount}</span>
          </button>
          <button
            onClick={() => setTab('STUDENT')}
            style={{
              flex: 1, padding: '0.5rem 0.25rem', borderRadius: '8px',
              border: tab === 'STUDENT' ? '1px solid #22c55e' : '1px solid var(--card-border)',
              background: tab === 'STUDENT' ? 'rgba(34,197,94,0.12)' : 'transparent',
              color: tab === 'STUDENT' ? '#22c55e' : 'var(--text-secondary)',
              fontWeight: 700, fontSize: '0.75rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem',
              transition: 'all 0.15s',
            }}
          >
            <GraduationCap size={12} /> Students
            <span style={{
              background: tab === 'STUDENT' ? '#22c55e' : 'var(--card-border)',
              color: 'white', borderRadius: '10px', padding: '0 0.4rem', fontSize: '0.65rem'
            }}>{studentCount}</span>
          </button>
        </div>

        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={13} style={{ position: 'absolute', left: '0.7rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={`Search ${tab === 'ALUMNI' ? 'alumni' : 'students'}...`}
            style={{
              width: '100%', padding: '0.6rem 0.75rem 0.6rem 2rem',
              background: 'var(--bg-elevated)', border: '1px solid var(--card-border)',
              borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.82rem',
              fontWeight: 500, outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Contacts List */}
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        {filtered.length === 0 && (
          <p style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
            No {tab === 'ALUMNI' ? 'alumni' : 'students'} found.
          </p>
        )}
        {filtered.map(u => {
          const isActive = activeUserId === u.id;
          const avatarBg = u.role === 'ALUMNI' ? '7B61FF' : '22c55e';
          const avatarUrl = u.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=${avatarBg}&color=fff&bold=true`;
          return (
            <Link
              key={u.id}
              href={`/messages?to=${u.id}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.85rem',
                padding: '0.9rem 1.25rem', textDecoration: 'none',
                borderBottom: '1px solid var(--card-border)',
                background: isActive ? (u.role === 'ALUMNI' ? 'rgba(123,97,255,0.12)' : 'rgba(34,197,94,0.08)') : 'transparent',
                borderLeft: isActive ? `3px solid ${u.role === 'ALUMNI' ? '#7B61FF' : '#22c55e'}` : '3px solid transparent',
                transition: 'background 0.15s',
              }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <img src={avatarUrl} alt={u.name} style={{ width: 42, height: 42, borderRadius: '10px', objectFit: 'cover' }} />
                {u.unread && (
                  <span style={{
                    position: 'absolute', top: -3, right: -3, width: 10, height: 10,
                    background: '#22c55e', borderRadius: '50%', border: '2px solid var(--bg-color)',
                  }} />
                )}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                  <span style={{ fontWeight: u.unread ? 700 : 600, fontSize: '0.88rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {u.name}
                  </span>
                  {u.lastMessageAt && u.lastMessageAt.getTime() > 0 && (
                    <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', fontWeight: 500, flexShrink: 0, marginLeft: '0.5rem' }}>
                      {new Date(u.lastMessageAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
                {u.lastMessage ? (
                  <p style={{ fontSize: '0.78rem', color: u.unread ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: u.unread ? 700 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                    {u.lastMessage.length > 32 ? u.lastMessage.substring(0, 32) + '…' : u.lastMessage}
                  </p>
                ) : (
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', opacity: 0.5, margin: 0, fontStyle: 'italic' }}>
                    {u.role === 'ALUMNI' ? 'Alumni' : 'Student'} · say hello!
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
