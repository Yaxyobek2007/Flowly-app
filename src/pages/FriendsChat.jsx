import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Send, Image, Trophy, Camera, X, Plus, Users } from 'lucide-react';
import DevBadge from '../components/DevBadge';
import RemovableBadge from '../components/RemovableBadge';

export default function FriendsChat() {
  const { currentUser, users, language } = useAuth();
  const lang = language || 'uz';

  const [messages, setMessages] = useState(() => {
    const s = localStorage.getItem('flowly-group-chat');
    return s ? JSON.parse(s) : [];
  });
  const [text, setText] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [showChallengeForm, setShowChallengeForm] = useState(false);
  const [challengeForm, setChallengeForm] = useState({ title: '', days: 7, type: 'daily' });
  const [challenges, setChallenges] = useState(() => {
    const s = localStorage.getItem('flowly-group-challenges');
    return s ? JSON.parse(s) : [];
  });
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => { localStorage.setItem('flowly-group-chat', JSON.stringify(messages)); }, [messages]);
  useEffect(() => { localStorage.setItem('flowly-group-challenges', JSON.stringify(challenges)); }, [challenges]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const today = new Date().toISOString().split('T')[0];

  const sendMessage = (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    const msg = {
      id: Date.now(),
      userId: currentUser?.id,
      userName: currentUser?.name || 'User',
      text: text.trim(),
      image: imagePreview,
      time: new Date().toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' }),
      date: today,
    };
    setMessages(prev => [...prev, msg]);
    setText('');
    setImagePreview(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setImagePreview(ev.target.result); };
    reader.readAsDataURL(file);
  };

  const createChallenge = () => {
    if (!challengeForm.title) return;
    const challenge = {
      id: Date.now(),
      ...challengeForm,
      createdBy: currentUser?.name || 'User',
      createdAt: today,
      participants: [{ userId: currentUser?.id, name: currentUser?.name, completedDays: [] }],
    };
    setChallenges(prev => [...prev, challenge]);
    setShowChallengeForm(false);
    setChallengeForm({ title: '', days: 7, type: 'daily' });
    // Send system message
    setMessages(prev => [...prev, {
      id: Date.now() + 1,
      userId: 'system',
      userName: 'System',
      text: `🏆 ${currentUser?.name} yangi challenge boshladi: "${challengeForm.title}" (${challengeForm.days} kun)`,
      time: new Date().toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' }),
      date: today,
    }]);
  };

  const joinChallenge = (challengeId) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === challengeId && !c.participants.find(p => p.userId === currentUser?.id)) {
        return { ...c, participants: [...c.participants, { userId: currentUser?.id, name: currentUser?.name, completedDays: [] }] };
      }
      return c;
    }));
  };

  const toggleChallengeDay = (challengeId) => {
    setChallenges(prev => prev.map(c => {
      if (c.id === challengeId) {
        return {
          ...c,
          participants: c.participants.map(p => {
            if (p.userId === currentUser?.id) {
              const done = p.completedDays.includes(today);
              return { ...p, completedDays: done ? p.completedDays.filter(d => d !== today) : [...p.completedDays, today] };
            }
            return p;
          }),
        };
      }
      return c;
    }));
  };

  const friendCount = currentUser?.friends?.length || 0;

  const L = {
    title: lang === 'ru' ? 'Групповой чат' : lang === 'en' ? 'Group Chat' : 'Guruh chat',
    desc: lang === 'ru' ? `${friendCount} друзей в группе` : lang === 'en' ? `${friendCount} friends in group` : `${friendCount} ta do'st guruhda`,
    placeholder: lang === 'ru' ? 'Сообщение...' : lang === 'en' ? 'Message...' : 'Xabar...',
    challenge: lang === 'ru' ? 'Челлендж' : lang === 'en' ? 'Challenge' : 'Challenge',
    newChallenge: lang === 'ru' ? 'Новый челлендж' : lang === 'en' ? 'New Challenge' : 'Yangi Challenge',
    challengeName: lang === 'ru' ? 'Название' : lang === 'en' ? 'Name' : 'Nomi',
    days: lang === 'ru' ? 'дней' : lang === 'en' ? 'days' : 'kun',
    join: lang === 'ru' ? 'Участвовать' : lang === 'en' ? 'Join' : 'Qo\'shilish',
    todayDone: lang === 'ru' ? 'Сегодня ✓' : lang === 'en' ? 'Today ✓' : 'Bugun ✓',
    empty: lang === 'ru' ? 'Начните общение!' : lang === 'en' ? 'Start chatting!' : 'Suhbat boshlang!',
    photoProof: lang === 'ru' ? '📸 Фото-доказательство' : lang === 'en' ? '📸 Photo proof' : '📸 Rasm tasdiqlash',
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>💬 {L.title}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{L.desc}</p>
        </div>
        <button onClick={() => setShowChallengeForm(!showChallengeForm)}
          className="btn-primary flex items-center gap-2 text-sm">
          <Trophy size={16} /> {L.challenge}
        </button>
      </div>
      <RemovableBadge message="❌ Bu sahifa o'chirilishi mumkin — lokal chat, backend yo'q" />
      <DevBadge message={lang === 'ru' ? '⚠️ Чат работает локально. Для реального обмена нужен backend' : lang === 'en' ? '⚠️ Chat works locally. Real messaging needs backend' : "⚠️ Chat lokal ishlaydi. Real xabar uchun backend kerak"} />

      {/* Challenge form */}
      {showChallengeForm && (
        <div className="card animate-in space-y-3" style={{ borderColor: 'var(--accent)' }}>
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>🏆 {L.newChallenge}</h3>
            <button onClick={() => setShowChallengeForm(false)}><X size={16} style={{ color: 'var(--text-secondary)' }} /></button>
          </div>
          <input type="text" placeholder={L.challengeName} value={challengeForm.title}
            onChange={e => setChallengeForm({ ...challengeForm, title: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <div className="flex gap-2">
            {[3, 5, 7, 14, 21, 30].map(d => (
              <button key={d} onClick={() => setChallengeForm({ ...challengeForm, days: d })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${challengeForm.days === d ? 'bg-blue-500 text-white' : ''}`}
                style={challengeForm.days !== d ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' } : {}}>
                {d} {L.days}
              </button>
            ))}
          </div>
          <button onClick={createChallenge} className="btn-primary w-full text-sm">{L.newChallenge}</button>
        </div>
      )}

      {/* Active challenges */}
      {challenges.length > 0 && (
        <div className="space-y-2">
          {challenges.slice(0, 3).map(ch => {
            const myParticipation = ch.participants.find(p => p.userId === currentUser?.id);
            const todayDone = myParticipation?.completedDays?.includes(today);
            const progress = myParticipation ? Math.round((myParticipation.completedDays.length / ch.days) * 100) : 0;
            return (
              <div key={ch.id} className="card py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-yellow-50 dark:bg-yellow-900/20 flex items-center justify-center"><Trophy size={18} className="text-yellow-500" /></div>
                <div className="flex-1">
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{ch.title}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{ch.participants.length} <Users size={10} className="inline" /> • {progress}%</p>
                </div>
                {myParticipation ? (
                  <button onClick={() => toggleChallengeDay(ch.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${todayDone ? 'bg-green-500 text-white' : 'bg-blue-500 text-white'}`}>
                    {todayDone ? '✓' : L.todayDone}
                  </button>
                ) : (
                  <button onClick={() => joinChallenge(ch.id)} className="px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-500 text-white">{L.join}</button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Chat area */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Messages */}
        <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto scrollbar-hide" style={{ minHeight: '250px' }}>
          {messages.length === 0 && (
            <div className="text-center py-12">
              <Users size={40} className="text-blue-300 mx-auto mb-3" />
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{L.empty}</p>
            </div>
          )}
          {messages.map(msg => {
            const isMe = msg.userId === currentUser?.id;
            const isSystem = msg.userId === 'system';
            if (isSystem) {
              return (
                <div key={msg.id} className="text-center">
                  <span className="text-[10px] px-3 py-1 rounded-full" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{msg.text}</span>
                </div>
              );
            }
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] ${isMe ? '' : ''}`}>
                  {!isMe && <p className="text-[9px] font-medium mb-0.5 ml-1" style={{ color: 'var(--accent)' }}>{msg.userName}</p>}
                  <div className={`px-3.5 py-2.5 rounded-2xl text-sm ${
                    isMe ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md' : 'rounded-bl-md'
                  }`} style={!isMe ? { background: 'var(--bg-secondary)', color: 'var(--text-primary)' } : {}}>
                    {msg.image && (
                      <img src={msg.image} alt="Shared photo" className="w-full max-w-[200px] rounded-xl mb-2 cursor-pointer" />
                    )}
                    {msg.text && <p>{msg.text}</p>}
                    <p className={`text-[9px] mt-1 ${isMe ? 'text-blue-200 text-right' : ''}`} style={!isMe ? { color: 'var(--text-secondary)' } : {}}>{msg.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Image preview */}
        {imagePreview && (
          <div className="px-4 pb-2 flex items-center gap-2">
            <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-xl object-cover" />
            <button onClick={() => setImagePreview(null)} className="p-1 rounded-full bg-red-500 text-white"><X size={12} /></button>
            <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{L.photoProof}</span>
          </div>
        )}

        {/* Input */}
        <form onSubmit={sendMessage} className="flex items-center gap-2 p-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageUpload} />
          <button type="button" onClick={() => fileInputRef.current?.click()}
            className="p-2.5 rounded-xl transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20" style={{ border: '1px solid var(--border)' }}>
            <Camera size={18} style={{ color: 'var(--text-secondary)' }} />
          </button>
          <input type="text" value={text} onChange={e => setText(e.target.value)}
            placeholder={L.placeholder}
            className="flex-1 px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <button type="submit" className="p-2.5 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors">
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
