import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { X, Send, Sparkles, Trash2 } from 'lucide-react';

function generateAIResponse(message, { tasks, habits, goals, currentUser, lang }) {
  const msg = message.toLowerCase().trim();
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const activeHabits = habits.filter(h => h.todayDone).length;
  const totalHabits = habits.length;
  const avgGoalProgress = goals.length > 0 ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length) : 0;
  const userName = currentUser?.name || 'Do\'st';

  if (msg.match(/salom|hello|привет|hi|hey|assalom/)) return lang === 'ru' ? `Привет, ${userName}! 👋` : lang === 'en' ? `Hi ${userName}! 👋` : `Salom, ${userName}! 👋`;
  if (msg.match(/holat|status|progress|прогресс|как дела|how am i/)) return `📊 ✅${completedTasks}/${totalTasks} 🔥${activeHabits}/${totalHabits} 🎯${avgGoalProgress}% ⭐${currentUser?.points||0}`;
  if (msg.match(/motivat|motiv|мотивац|ilhom/)) { const q = ["💡 Kelajak bugun yaratiladi","🔥 1% = 37x yil oxiriga","💪 Intizom = erkinlik","⭐ Har kuni 1 qadam"]; return q[Math.floor(Math.random()*q.length)]; }
  if (msg.match(/maslahat|advice|совет|tip/)) return lang === 'ru' ? '💡 1.Утром главное\n2.Точное время\n3.Мини привычки\n4.Обзор целей\n5.Сон план' : lang === 'en' ? '💡 1.Important first\n2.Exact time\n3.Tiny habits\n4.Review goals\n5.Plan before bed' : '💡 1.Ertalab muhim ish\n2.Aniq vaqt\n3.Kichik odat\n4.Maqsad tekshirish\n5.Uxlashdan oldin reja';
  if (msg.match(/odat|habit|привычк/)) { const nd = habits.filter(h=>!h.todayDone).map(h=>h.name); return nd.length===0 ? '🎉 Barchasi bajarildi!' : `🔥 Qoldi: ${nd.join(', ')}`; }
  if (msg.match(/maqsad|goal|цел/)) { return goals.length===0 ? '🎯 Maqsad qo\'shing!' : goals.map(g=>`• ${g.title}: ${g.progress}%`).join('\n'); }
  if (msg.match(/reja|plan|bugun|today|сегодня/)) { const dk=['sunday','monday','tuesday','wednesday','thursday','friday','saturday']; const tt=tasks.filter(t=>t.day===dk[new Date().getDay()]).sort((a,b)=>a.time.localeCompare(b.time)); return tt.length===0 ? '📋 Vazifa yo\'q!' : tt.map(t=>`${t.completed?'✅':'⬜'} ${t.time} ${t.title}`).join('\n'); }
  if (msg.match(/rahmat|спасибо|thanks/)) return `😊 Arzimaydi!`;
  if (msg.match(/qayer|manzil|locat|место|адрес|where|map|xarita|карта/)) return lang === 'ru' ? '📍 Карта → добавьте место → навигация\nВ дневном плане можете указать место для задачи' : lang === 'en' ? '📍 Map → add place → navigate\nIn daily plan you can add location to tasks' : "📍 Xarita → joy qo'shing → yo'l ko'rsatish\nKunlik rejada vazifaga joy qo'shish mumkin";
  if (msg.match(/qanday|yordam|помоги|help/)) return lang === 'ru' ? '🆘 статус•план•совет•мотивация•привычки•цели•место' : lang === 'en' ? '🆘 status•plan•advice•motivation•habits•goals•location' : '🆘 holat•reja•maslahat•motivatsiya•odat•maqsad•manzil';
  return lang === 'ru' ? '🤔 "помощь"!' : lang === 'en' ? '🤔 Type "help"!' : '🤔 "yordam" deb yozing!';
}

export default function AiFloatingButton() {
  const { currentUser, language } = useAuth();
  const { tasks, habits, goals } = useApp();
  const lang = language || 'uz';
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    try { const s = localStorage.getItem('flowly-ai-float'); return s ? JSON.parse(s) : [{ from: 'ai', text: lang === 'ru' ? 'Привет! 🤖' : lang === 'en' ? 'Hi! 🤖' : 'Salom! 🤖 "yordam" deb yozing' }]; }
    catch(e) { return [{ from: 'ai', text: 'Salom! 🤖' }]; }
  });
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => { localStorage.setItem('flowly-ai-float', JSON.stringify(messages.slice(-30))); }, [messages]);
  useEffect(() => { if(chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight; }, [messages, typing]);

  if (!currentUser) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(p => [...p, { from: 'user', text: input.trim() }]);
    const userMsg = input.trim();
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages(p => [...p, { from: 'ai', text: generateAIResponse(userMsg, { tasks, habits, goals, currentUser, lang }) }]);
      setTyping(false);
    }, 400 + Math.random() * 400);
  };

  return (
    <>
      {/* Floating Circle Button - bottom right */}
      <button onClick={() => setOpen(!open)}
        className={`fixed bottom-5 right-5 z-[80] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-90 ${open ? 'bg-red-500 shadow-red-500/40 rotate-90' : 'bg-gradient-to-br from-purple-500 to-blue-500 shadow-purple-500/40'}`}>
        {open ? <X size={22} className="text-white" /> : <Sparkles size={22} className="text-white" />}
      </button>

      {/* Chat Popup */}
      {open && (
        <div className="fixed bottom-22 right-5 z-[79] w-[85vw] sm:w-[360px] max-h-[70vh] sm:max-h-[480px] rounded-2xl shadow-2xl overflow-hidden animate-scale-in flex flex-col"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--border)', background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.08))' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Flowly AI <span className="text-[8px] px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 font-bold ml-1">Beta</span></p>
                <p className="text-[9px] flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span> Online
                </p>
              </div>
            </div>
            <button onClick={() => setMessages([{ from: 'ai', text: '🗑️ OK!' }])} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
              <Trash2 size={14} className="text-red-400" />
            </button>
          </div>

          {/* Messages */}
          <div ref={chatRef} className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide" style={{ background: 'var(--bg-secondary)', maxHeight: '340px' }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[82%] px-3 py-2 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
                  msg.from === 'user' ? 'bg-blue-500 text-white rounded-br-sm' : 'rounded-bl-sm'
                }`} style={msg.from === 'ai' ? { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' } : {}}>
                  {msg.text}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex justify-start">
                <div className="px-3 py-2.5 rounded-2xl rounded-bl-sm flex gap-1" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1.5 h-1.5 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-2.5 border-t flex gap-2" style={{ borderColor: 'var(--border)' }}>
            <input type="text" value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={lang === 'ru' ? 'Спросите...' : lang === 'en' ? 'Ask...' : "So'rang..."}
              className="flex-1 px-3 py-2.5 rounded-xl border text-xs outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            <button onClick={handleSend} disabled={!input.trim()}
              className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white disabled:opacity-30 transition-all active:scale-90 hover:shadow-lg hover:shadow-purple-500/30">
              <Send size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
