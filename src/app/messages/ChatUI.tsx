'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { sendMessage, markAsRead, deleteConversation, toggleBlockUser } from '@/actions/messages';
import { issueStrike } from '@/actions/moderation';
import { Send, Trash2, ImageIcon, ShieldCheck, Flag, Mic, Square, Volume2, Ban, Lock, Unlock, Box } from 'lucide-react';

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
  const [strikeLoading, setStrikeLoading] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Voice Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access denied or not available.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleBlock = async () => {
    if (!confirm(`Block ${receiverName} from contacting you?`)) return;
    const res = await toggleBlockUser(receiverId);
    if (res.success) {
      alert(res.message);
      router.refresh();
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!content.trim() && !selectedImage && !audioBlob) || loading) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('receiverId', receiverId);
    if (content) formData.append('content', content);
    if (selectedImage) formData.append('image', selectedImage);
    if (audioBlob) {
      const audioFile = new File([audioBlob], 'voice_note.webm', { type: 'audio/webm' });
      formData.append('audio', audioFile);
    }

    try {
      const res = await sendMessage(formData);
      if (res.success) {
        setContent('');
        setSelectedImage(null);
        setPreviewUrl(null);
        setAudioBlob(null);
        router.refresh();
      } else alert(res.error || 'Failed to send.');
    } catch { alert('Network error.'); }
    finally { setLoading(false); }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!receiverId) {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: '1.5rem',
        color: 'var(--text-secondary)', padding: '2rem', textAlign: 'center'
      }}>
        <div style={{ position: 'relative' }}>
          <ShieldCheck size={80} color="var(--primary-color)" strokeWidth={1} style={{ opacity: 0.2 }} />
          <Lock size={32} color="var(--primary-color)" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
        </div>
        <div>
          <h2 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Select an Institutional Contact</h2>
          <p style={{ fontSize: '0.85rem', opacity: 0.7, maxWidth: '300px' }}>Start a high-security, encrypted conversation on KecNetwork.in</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      
      {/* Delete Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{
            background: 'var(--card-bg)', border: '1px solid var(--card-border)',
            borderRadius: '24px', padding: '2.5rem', width: '380px',
            boxShadow: '0 32px 128px rgba(0,0,0,0.8)'
          }}>
            <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 800 }}>Protocol: Wipe Conversation</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '2rem', lineHeight: 1.6 }}>
              Choose the extent of data removal for this institutional channel.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button onClick={() => deleteConversation(receiverId, 'self')} style={{
                padding: '1.1rem', borderRadius: '16px', border: '1px solid var(--card-border)',
                background: 'var(--bg-elevated)', color: 'var(--text-primary)',
                fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s'
              }}>
                🔒 Local Wipe Only
                <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.3rem', fontWeight: 400 }}>Messages remain for {receiverName}</div>
              </button>
              <button onClick={() => deleteConversation(receiverId, 'both')} style={{
                padding: '1.1rem', borderRadius: '16px', border: '1px solid rgba(239,68,68,0.2)',
                background: 'rgba(239,68,68,0.05)', color: '#ef4444',
                fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer', textAlign: 'left'
              }}>
                ☢️ Institutional Purge
                <div style={{ fontSize: '0.72rem', color: 'rgba(239,68,68,0.7)', marginTop: '0.3rem', fontWeight: 400 }}>Wipes data from the entire network</div>
              </button>
              <button onClick={() => setShowDeleteModal(false)} style={{
                padding: '0.9rem', borderRadius: '16px', border: 'none',
                background: 'transparent', color: 'var(--text-secondary)',
                fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer'
              }}>Abort Operation</button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '1.25rem 2rem', borderBottom: '1px solid var(--card-border)',
        background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)', flexShrink: 0,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(receiverName)}&background=7B61FF&color=fff`} style={{ width: 40, height: 40, borderRadius: '12px' }} />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>{receiverName}</div>
            <div style={{ fontSize: '0.65rem', color: '#22c55e', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }} />
              Live & Encrypted
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button onClick={handleBlock} title="Block Member" style={{
            background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)',
            border: '1px solid var(--card-border)', padding: '0.6rem',
            borderRadius: '12px', cursor: 'pointer', display: 'flex', transition: '0.2s'
          }}>
            <Ban size={18} />
          </button>
          <button onClick={() => setShowDeleteModal(true)} style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(239,68,68,0.1)', color: '#ef4444',
            border: '1px solid rgba(239,68,68,0.2)', padding: '0.6rem 1.25rem',
            borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
          }}>
            <Trash2 size={16} /> Cleanup
          </button>
        </div>
      </div>

      {/* Messages List */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '2rem',
        display: 'flex', flexDirection: 'column', gap: '1rem',
        minHeight: 0,
        scrollBehavior: 'smooth'
      }}>
        {initialMessages.length === 0 && (
          <div style={{ 
            textAlign: 'center', color: 'var(--text-secondary)', marginTop: '4rem', 
            background: 'var(--bg-elevated)', padding: '2rem', borderRadius: '24px',
            border: '1px solid var(--card-border)', alignSelf: 'center', width: '280px'
          }}>
            <Box size={20} style={{ marginBottom: '1rem', opacity: 0.3 }} />
            <p style={{ fontSize: '0.82rem', fontWeight: 600 }}>This transmission is empty.</p>
            <p style={{ fontSize: '0.7rem', opacity: 0.6 }}>Secure data link established.</p>
          </div>
        )}
        {initialMessages.map((msg, idx) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className="message-entrance" style={{
              display: 'flex', flexDirection: 'column',
              alignItems: isMe ? 'flex-end' : 'flex-start',
              animationDelay: `${idx * 0.05}s`
            }}>
              <div style={{
                maxWidth: '75%', position: 'relative',
                display: 'flex', flexDirection: 'column', gap: '0.5rem'
              }}>
                {msg.imageUrl && (
                  <img src={msg.imageUrl} alt="Media" style={{
                    maxWidth: '100%', borderRadius: '16px', border: '1px solid var(--card-border)'
                  }} />
                )}
                {msg.type === 'AUDIO' && msg.audioUrl && (
                  <div style={{
                    minWidth: '220px', padding: '1rem', borderRadius: '20px',
                    background: isMe ? 'var(--primary-color)' : 'var(--bg-elevated)',
                    border: isMe ? 'none' : '1px solid var(--card-border)',
                    display: 'flex', alignItems: 'center', gap: '0.75rem'
                  }}>
                    <Volume2 size={20} color="white" />
                    <audio src={msg.audioUrl} controls style={{ height: '32px', width: '100%' }} />
                  </div>
                )}
                {msg.content && (
                  <div style={{
                    padding: '0.85rem 1.25rem', borderRadius: '20px',
                    background: isMe ? 'var(--primary-color)' : 'var(--card-bg)',
                    color: isMe ? 'white' : 'var(--text-primary)',
                    boxShadow: isMe ? '0 8px 20px rgba(123,97,255,0.25)' : 'none',
                    border: isMe ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--card-border)',
                    fontSize: '0.92rem', lineHeight: 1.6, fontWeight: 500,
                    borderBottomRightRadius: isMe ? '4px' : '20px',
                    borderBottomLeftRadius: isMe ? '20px' : '4px',
                  }}>
                    {msg.content}
                  </div>
                )}
              </div>
              <div style={{ 
                fontSize: '0.62rem', color: 'var(--text-secondary)', 
                marginTop: '0.4rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: '0.75rem'
              }}>
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {!isMe && (
                  <button 
                    onClick={() => issueStrike(msg.senderId)}
                    style={{
                      background: 'transparent', border: 'none', color: '#ff4d4d',
                      cursor: 'pointer', fontSize: '0.65rem', fontWeight: 800,
                      textTransform: 'uppercase', letterSpacing: '0.05em'
                    }}
                  >
                    🚀 BANISH
                  </button>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview */}
      {previewUrl && (
        <div style={{
          padding: '1rem 2rem', background: 'var(--bg-elevated)',
          borderTop: '1px solid var(--card-border)', display: 'flex',
          alignItems: 'center', gap: '1rem', flexShrink: 0,
        }}>
          <img src={previewUrl} style={{ width: 60, height: 60, borderRadius: 12, objectFit: 'cover', border: '2px solid var(--primary-color)' }} />
          <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', fontWeight: 600 }}>Ready to transmit image...</p>
          <button onClick={() => { setSelectedImage(null); setPreviewUrl(null); }} style={{
            marginLeft: 'auto', background: '#ef4444', color: 'white', border: 'none', borderRadius: '12px',
            padding: '0.4rem 0.75rem', fontSize: 11, cursor: 'pointer', fontWeight: 800,
          }}>CANCEL</button>
        </div>
      )}

      {/* Voice Preview */}
      {audioBlob && !isRecording && (
        <div style={{
          padding: '1rem 2rem', background: 'rgba(34,197,94,0.1)',
          borderTop: '1px solid rgba(34,197,94,0.2)', display: 'flex',
          alignItems: 'center', gap: '1rem', flexShrink: 0,
        }}>
          <div style={{ width: 40, height: 40, borderRadius: '10px', background: '#22c55e', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Volume2 color="white" size={18} />
          </div>
          <p style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: 700 }}>Voice Byte Captured</p>
          <button onClick={() => setAudioBlob(null)} style={{
            marginLeft: 'auto', background: 'transparent', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', 
            borderRadius: '10px', padding: '0.4rem 0.75rem', fontSize: 11, cursor: 'pointer', fontWeight: 800,
          }}>DELETE</button>
        </div>
      )}

      {/* Message Input */}
      <form onSubmit={handleSend} style={{
        display: 'flex', alignItems: 'center', gap: '1rem',
        padding: '1.25rem 2rem 2.5rem', borderTop: '1px solid var(--card-border)',
        background: 'var(--bg-color)', flexShrink: 0,
      }}>
        <label style={{ color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', padding: '0.5rem', transition: '0.2s' }}>
          <ImageIcon size={22} />
          <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
        </label>

        {isRecording ? (
          <div style={{
            flex: 1, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '50px', padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem',
            color: '#ef4444'
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite' }} />
            <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>Capturing... {formatTime(recordingTime)}</span>
            <button type="button" onClick={stopRecording} style={{ marginLeft: 'auto', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', padding: '0.4rem', cursor: 'pointer' }}>
              <Square size={14} fill="currentColor" />
            </button>
          </div>
        ) : (
          <>
            <input
              type="text"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Deploy a secured message..."
              disabled={loading}
              style={{
                flex: 1, padding: '0.9rem 1.5rem',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--card-border)',
                borderRadius: '50px', color: 'var(--text-primary)',
                fontSize: '0.95rem', fontWeight: 500, outline: 'none',
              }}
            />
            <button type="button" onClick={startRecording} style={{
              background: 'transparent', color: 'var(--text-secondary)', border: 'none',
              padding: '0.5rem', cursor: 'pointer'
            }}>
              <Mic size={22} />
            </button>
          </>
        )}

        <button type="submit" disabled={loading} style={{
          background: 'var(--primary-color)', color: 'white', border: 'none',
          padding: '0.9rem 1.5rem', borderRadius: '50px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          boxShadow: '0 8px 24px rgba(123,97,255,0.4)',
          opacity: loading || (!content.trim() && !selectedImage && !audioBlob) ? 0.5 : 1,
          transition: 'all 0.3s'
        }}>
          <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>SEND</span>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
