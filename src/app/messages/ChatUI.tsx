'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { sendMessage, markAsRead, deleteConversation } from '@/actions/messages';
import { Send, Trash2, ImageIcon, ShieldCheck } from 'lucide-react';

export default function ChatUI({
  receiverId,
  receiverName,
  initialMessages,
  currentUserId
}: {
  receiverId: string;
  receiverName: string;
  initialMessages: any[];
  currentUserId: string;
}) {
  const [content, setContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [initialMessages]);

  useEffect(() => {
    if (receiverId) markAsRead(receiverId);
  }, [receiverId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDeleteChat = async (mode: 'self' | 'both') => {
    setShowDeleteModal(false);
    const res = await deleteConversation(receiverId, mode);
    if (res.success) router.push('/messages');
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!content.trim() && !selectedImage) || loading) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('receiverId', receiverId);
    formData.append('content', content);
    if (selectedImage) formData.append('image', selectedImage);
    try {
      const res = await sendMessage(formData);
      if (res.success) {
        setContent('');
        setSelectedImage(null);
        setPreviewUrl(null);
        router.refresh();
      } else alert(res.error || 'Failed to send.');
    } catch { alert('Network error.'); }
    finally { setLoading(false); }
  };

  // Empty state — no contact selected
  if (!receiverId) {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '1rem',
        color: 'var(--text-secondary)',
      }}>
        <ShieldCheck size={56} color="#7B61FF" strokeWidth={1.5} />
        <p style={{ fontSize: '1rem', fontWeight: 600 }}>Select a contact to start a secure chat</p>
        <p style={{ fontSize: '0.78rem', opacity: 0.6 }}>All messages are AES-256-GCM encrypted</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'var(--card-bg)', border: '1px solid var(--card-border)',
            borderRadius: '16px', padding: '2rem', width: '340px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
          }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1.1rem', fontWeight: 700 }}>Delete Chat</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
              This will permanently remove messages. Choose who it applies to.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button onClick={() => handleDeleteChat('self')} style={{
                padding: '0.85rem', borderRadius: '10px', border: '1px solid var(--card-border)',
                background: 'var(--bg-elevated)', color: 'var(--text-primary)',
                fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left'
              }}>
                🙈 Delete for Me only
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.2rem', fontWeight: 400 }}>The other person can still see the conversation</div>
              </button>
              <button onClick={() => handleDeleteChat('both')} style={{
                padding: '0.85rem', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.3)',
                background: 'rgba(239,68,68,0.08)', color: '#ef4444',
                fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer', textAlign: 'left'
              }}>
                🗑️ Delete for Everyone
                <div style={{ fontSize: '0.72rem', color: 'rgba(239,68,68,0.7)', marginTop: '0.2rem', fontWeight: 400 }}>Permanently removes for both sides</div>
              </button>
              <button onClick={() => setShowDeleteModal(false)} style={{
                padding: '0.7rem', borderRadius: '10px', border: '1px solid var(--card-border)',
                background: 'transparent', color: 'var(--text-secondary)',
                fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer'
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1rem 1.5rem', borderBottom: '1px solid var(--card-border)',
        background: 'var(--bg-color)', flexShrink: 0,
      }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{receiverName}</div>
          <div style={{ fontSize: '0.65rem', color: '#22c55e', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ShieldCheck size={10} /> End-to-End Encrypted
          </div>
        </div>
        <button onClick={() => setShowDeleteModal(true)} style={{
          display: 'flex', alignItems: 'center', gap: '0.4rem',
          background: 'rgba(239,68,68,0.1)', color: '#ef4444',
          border: '1px solid rgba(239,68,68,0.2)', padding: '0.4rem 0.9rem',
          borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer',
        }}>
          <Trash2 size={14} /> Delete Chat
        </button>
      </div>

      {/* Messages List */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '1.5rem',
        display: 'flex', flexDirection: 'column', gap: '0.75rem',
        minHeight: 0,
      }}>
        {initialMessages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', marginTop: '3rem', fontSize: '0.85rem' }}>
            No messages yet. Say hello!
          </div>
        )}
        {initialMessages.map(msg => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} style={{
              display: 'flex', flexDirection: 'column',
              alignItems: isMe ? 'flex-end' : 'flex-start',
            }}>
              {msg.imageUrl && (
                <img src={msg.imageUrl} alt="Media" style={{
                  maxWidth: '240px', borderRadius: '12px', marginBottom: '0.4rem'
                }} />
              )}
              {msg.content && (
                <div style={{
                  maxWidth: '65%', padding: '0.75rem 1rem', borderRadius: '16px',
                  background: isMe ? 'var(--primary-color)' : 'var(--bg-color)',
                  color: isMe ? 'white' : 'var(--text-primary)',
                  border: isMe ? 'none' : '1px solid var(--card-border)',
                  fontSize: '0.9rem', lineHeight: 1.5, fontWeight: 500,
                  borderBottomRightRadius: isMe ? '4px' : '16px',
                  borderBottomLeftRadius: isMe ? '16px' : '4px',
                }}>
                  {msg.content}
                </div>
              )}
              <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginTop: '0.25rem', fontWeight: 500 }}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {previewUrl && (
        <div style={{
          padding: '0.75rem 1.5rem', background: 'var(--bg-elevated)',
          borderTop: '1px solid var(--card-border)', display: 'flex',
          alignItems: 'center', gap: '0.75rem', flexShrink: 0,
        }}>
          <img src={previewUrl} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover' }} />
          <button onClick={() => { setSelectedImage(null); setPreviewUrl(null); }} style={{
            background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%',
            width: 22, height: 22, fontSize: 12, cursor: 'pointer', fontWeight: 700,
          }}>×</button>
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={handleSend} style={{
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        padding: '1rem 1.5rem', borderTop: '1px solid var(--card-border)',
        background: 'var(--bg-color)', flexShrink: 0,
      }}>
        <label style={{ color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}>
          <ImageIcon size={22} />
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
        </label>
        <input
          type="text"
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Type an encrypted message..."
          disabled={loading}
          style={{
            flex: 1, padding: '0.8rem 1.2rem',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--card-border)',
            borderRadius: '50px', color: 'var(--text-primary)',
            fontSize: '0.9rem', fontWeight: 500, outline: 'none',
          }}
        />
        <button type="submit" disabled={loading} style={{
          background: 'var(--primary-color)', color: 'white', border: 'none',
          padding: '0.8rem 1.1rem', borderRadius: '50px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', opacity: loading ? 0.5 : 1,
        }}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
