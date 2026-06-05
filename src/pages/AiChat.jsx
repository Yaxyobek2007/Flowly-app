import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Send, Bot, Sparkles, Trash2 } from 'lucide-react';

function generateAIResponse(message, { tasks, habits, goals, currentUser, lang }) {
  const msg = message.toLowerCase().trim();
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const activeHabits = habits.filter(h => h.todayDone).length;
  const totalHabits = habits.length;
  const avgGoalProgress = goals.length > 0 ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length) : 0;
  const userName = currentUser?.name || 'Do\'st';

  if (msg.match(/salom|hello|привет|hi|hey|assalom/)) {
    return lang === 'ru' ? `Привет, ${userName}! 👋 Я AI-помощник Flowly. Помогу с планами и целями. Напишите "помощь"!` : lang === 'en' ? `Hi ${userName}! 👋 I'm Flowly AI. I help with plans and goals. Type "help"!` : `Salom, ${userName}! 👋 Men Flowly AI yordamchisiman. "yordam" deb yozing!`;
  }
  if (msg.match(/holat|status|progress|прогресс|как дела|how am i/)) {
    return lang === 'ru' ? `📊 ${userName}:\n✅ Задачи: ${completedTasks}/${totalTasks}\n🔥 Привычки: ${activeHabits}/${totalHabits}\n🎯 Цели: ${avgGoalProgress}%\n⭐ ${currentUser?.points || 0} баллов\n\n${completedTasks > totalTasks/2 ? '💪 Отлично!' : '🚀 Продолжайте!'}` : lang === 'en' ? `📊 ${userName}:\n✅ Tasks: ${completedTasks}/${totalTasks}\n🔥 Habits: ${activeHabits}/${totalHabits}\n🎯 Goals: ${avgGoalProgress}%\n⭐ ${currentUser?.points || 0} points\n\n${completedTasks > totalTasks/2 ? '💪 Great!' : '🚀 Keep going!'}` : `📊 ${userName}:\n✅ Vazifalar: ${completedTasks}/${totalTasks}\n🔥 Odatlar: ${activeHabits}/${totalHabits}\n🎯 Maqsadlar: ${avgGoalProgress}%\n⭐ ${currentUser?.points || 0} ball\n\n${completedTasks > totalTasks/2 ? '💪 Ajoyib!' : '🚀 Davom eting!'}`;
  }
  if (msg.match(/motivat|motiv|rag'bat|мотивац|ilhom|вдохнов|inspire/)) {
    const q = { uz: ["💡 \"Kelajak bugun qilgan ishlar bilan yaratiladi\" — Gandi","🔥 \"1% har kuni = yil oxiriga 37x yaxshiroq\" — James Clear","💪 \"Intizom — erkinlikka olib boruvchi ko'prik\"","⭐ \"Muvaffaqiyat — har kuni kichik qadam\""], ru: ["💡 \"Будущее создаётся сегодня\" — Ганди","🔥 \"1% в день = 37x за год\" — Клир","💪 \"Дисциплина — мост к свободе\"","⭐ \"Успех — маленькие шаги каждый день\""], en: ["💡 \"The future depends on today\" — Gandhi","🔥 \"1% daily = 37x in a year\" — Clear","💪 \"Discipline equals freedom\"","⭐ \"Success is small steps repeated\""] };
    return q[lang][Math.floor(Math.random() * q[lang].length)];
  }
  if (msg.match(/maslahat|maslaxat|advice|совет|tip|nma qilsam|что делать|what should/)) {
    return lang === 'ru' ? `💡 Советы:\n1️⃣ Утром — главная задача\n2️⃣ Точное время каждому делу\n3️⃣ Маленькие привычки (5 мин)\n4️⃣ Еженедельный обзор целей\n5️⃣ Планируйте завтра перед сном` : lang === 'en' ? `💡 Tips:\n1️⃣ Most important task first\n2️⃣ Exact time for each task\n3️⃣ Tiny habits (5 min)\n4️⃣ Review goals weekly\n5️⃣ Plan tomorrow before sleep` : `💡 Maslahatlar:\n1️⃣ Ertalab eng muhim vazifani qiling\n2️⃣ Har vazifaga aniq vaqt\n3️⃣ Kichik odatlardan boshlang (5 daq)\n4️⃣ Har hafta maqsadlarni tekshiring\n5️⃣ Uxlashdan oldin ertani rejalashtiring`;
  }
  if (msg.match(/odat|habit|привычк|streak/)) {
    if (totalHabits === 0) return lang === 'ru' ? '🔥 Добавьте привычку в разделе Привычки!' : lang === 'en' ? '🔥 Add a habit in Habits section!' : "🔥 Odatlar bo'limiga odat qo'shing!";
    const notDone = habits.filter(h => !h.todayDone).map(h => h.name);
    return notDone.length === 0 ? (lang === 'ru' ? '🎉 Все привычки выполнены!' : lang === 'en' ? '🎉 All habits done!' : '🎉 Barcha odatlar bajarildi!') : (lang === 'ru' ? `🔥 Осталось: ${notDone.join(', ')}` : lang === 'en' ? `🔥 Remaining: ${notDone.join(', ')}` : `🔥 Qoldi: ${notDone.join(', ')}`);
  }
  if (msg.match(/maqsad|goal|цел|target/)) {
    if (goals.length === 0) return lang === 'ru' ? '🎯 Добавьте цель!' : lang === 'en' ? '🎯 Add a goal!' : "🎯 Maqsad qo'shing!";
    return goals.map(g => `• ${g.title}: ${g.progress}%`).join('\n');
  }
  if (msg.match(/reja|plan|расписан|schedule|bugun|сегодня|today/)) {
    const dayKeys = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
    const todayTasks = tasks.filter(t => t.day === dayKeys[new Date().getDay()]).sort((a, b) => a.time.localeCompare(b.time));
    if (todayTasks.length === 0) return lang === 'ru' ? '📋 Нет задач на сегодня!' : lang === 'en' ? '📋 No tasks today!' : "📋 Bugunga vazifa yo'q!";
    return todayTasks.map(t => `${t.completed ? '✅' : '⬜'} ${t.time} — ${t.title}`).join('\n');
  }
  if (msg.match(/vaqt|time|время|soat/)) {
    return lang === 'ru' ? '⏰ Помодоро: 25 мин работа + 5 отдых\nСложное — утром\nТелефон — DND' : lang === 'en' ? '⏰ Pomodoro: 25min work + 5 rest\nHard stuff — morning\nPhone — DND' : "⏰ Pomodoro: 25 daq ish + 5 dam\nQiyin ish — ertalab\nTelefon — DND";
  }
  if (msg.match(/sport|sog'liq|здоров|health/)) {
    return lang === 'ru' ? '🏃 30 мин активности\n7-8 ч сна\n2л воды\nУтренняя зарядка' : lang === 'en' ? '🏃 30min activity\n7-8h sleep\n2L water\nMorning exercise' : "🏃 30 daq harakat\n7-8 soat uyqu\n2L suv\nErtalab mashq";
  }
  if (msg.match(/rahmat|спасибо|thanks/)) {
    return lang === 'ru' ? `😊 Пожалуйста, ${userName}!` : lang === 'en' ? `😊 You're welcome, ${userName}!` : `😊 Arzimaydi, ${userName}!`;
  }
  if (msg.match(/qanday|yordam|помоги|help|how/)) {
    return lang === 'ru' ? `🆘 Команды:\n• "статус" — прогресс\n• "план" — задачи\n• "совет" — советы\n• "мотивация" — цитаты\n• "привычки" — статус\n• "цели" — прогресс` : lang === 'en' ? `🆘 Commands:\n• "status" — progress\n• "plan" — tasks\n• "advice" — tips\n• "motivation" — quotes\n• "habits" — status\n• "goals" — progress` : `🆘 Buyruqlar:\n• "holat" — progress\n• "reja" — vazifalar\n• "maslahat" — tavsiyalar\n• "motivatsiya" — iqtiboslar\n• "odat" — odatlar\n• "maqsad" — maqsadlar`;
  }
  return lang === 'ru' ? `🤔 Не понял. Напишите "помощь" для списка команд!` : lang === 'en' ? `🤔 Didn't get that. Type "help" for commands!` : `🤔 Tushunmadim. "yordam" deb yozing!`;
}

export default function AiChat() {
  const { currentUser, language, t } = useAuth();
  const { tasks, habits, goals } = useApp();
  const lang = language || 'uz';
  const chatEndRef = useRef(null);
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('flowly-ai-chat');
    return saved ? JSON.parse(saved) : [{ from: 'ai', text: lang === 'ru' ? 'Привет! 🤖 Я AI-помощник. Напишите "помощь"!' : lang === 'en' ? 'Hi! 🤖 I\'m AI assistant. Type "help"!' : 'Salom! 🤖 Men AI yordamchiman. "yordam" deb yozing!' }];
  });
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);

  useEffect(() => { localStorage.setItem('flowly-ai-chat', JSON.stringify(messages.slice(-50))); }, [messages]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, typing]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: 'user', text: input.trim() }]);
    const userMsg = input.trim();
    setInput('');
    setTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'ai', text: generateAIResponse(userMsg, { tasks, habits, goals, currentUser, lang }) }]);
      setTyping(false);
    }, 600 + Math.random() * 600);
  };

  const quickActions = [
    { label: '📊', msg: lang === 'ru' ? 'статус' : lang === 'en' ? 'status' : 'holat' },
    { label: '📋', msg: lang === 'ru' ? 'план' : lang === 'en' ? 'plan' : 'reja' },
    { label: '💡', msg: lang === 'ru' ? 'совет' : lang === 'en' ? 'advice' : 'maslahat' },
    { label: '🔥', msg: lang === 'ru' ? 'мотивация' : lang === 'en' ? 'motivation' : 'motivatsiya' },
    { label: '🎯', msg: lang === 'ru' ? 'цели' : lang === 'en' ? 'goals' : 'maqsad' },
  ];

  return (
    <div className="max-w-3xl mx-auto flex flex-col" style={{ height: 'calc(100vh - 140px)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
            <Bot size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Flowly AI</h1>
            <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Online</p>
          </div>
        </div>
        <button onClick={() => setMessages([{ from: 'ai', text: lang === 'ru' ? 'Чат очищен!' : lang === 'en' ? 'Chat cleared!' : 'Chat tozalandi!' }])} className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20"><Trash2 size={18} className="text-red-400" /></button>
      </div>

      <div className="flex gap-2 mb-3 overflow-x-auto scrollbar-hide">
        {quickActions.map((a, i) => (
          <button key={i} onClick={() => { setInput(a.msg); }} className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap hover:scale-105 transition-all" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>{a.label} {a.msg}</button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 p-4 rounded-2xl scrollbar-hide" style={{ background: 'var(--bg-secondary)' }}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} animate-in`}>
            <div className={`flex items-end gap-2 max-w-[85%] ${msg.from === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${msg.from === 'user' ? 'bg-blue-500' : 'bg-gradient-to-br from-purple-500 to-blue-500'}`}>
                {msg.from === 'user' ? <span className="text-white text-[10px] font-bold">{(currentUser?.name?.[0] || 'U').toUpperCase()}</span> : <Sparkles size={12} className="text-white" />}
              </div>
              <div className={`px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line leading-relaxed ${msg.from === 'user' ? 'bg-blue-500 text-white rounded-br-sm' : 'rounded-bl-sm'}`} style={msg.from === 'ai' ? { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' } : {}}>{msg.text}</div>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex items-end gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center"><Sparkles size={12} className="text-white" /></div>
            <div className="px-4 py-3 rounded-2xl rounded-bl-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
              <div className="flex gap-1"><div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div><div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-3 flex gap-2">
        <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder={lang === 'ru' ? 'Спросите что-нибудь...' : lang === 'en' ? 'Ask something...' : 'Biror narsa so\'rang...'}
          className="flex-1 px-4 py-3 rounded-2xl border outline-none focus:ring-2 focus:ring-purple-500 transition-all"
          style={{ background: 'var(--bg-card)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
        <button onClick={handleSend} disabled={!input.trim()}
          className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium disabled:opacity-40 transition-all hover:shadow-lg hover:shadow-purple-500/30 active:scale-95">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
