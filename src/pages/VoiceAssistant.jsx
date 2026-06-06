import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Mic, MicOff, Volume2, Send, X, HelpCircle } from 'lucide-react';
import DevBadge from '../components/DevBadge';

const dayOfWeekToKey = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];

export default function VoiceAssistant() {
  const { language, currentUser } = useAuth();
  const { tasks, addTask, habits, toggleHabit } = useApp();
  const lang = language || 'uz';

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Finance state (localStorage)
  const [finance, setFinance] = useState(() => {
    const s = localStorage.getItem('flowly-finance');
    return s ? JSON.parse(s) : [];
  });
  useEffect(() => { localStorage.setItem('flowly-finance', JSON.stringify(finance)); }, [finance]);

  // Auto-scroll to bottom
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Get today info
  const now = new Date();
  const todayKey = dayOfWeekToKey[now.getDay()];
  const todayTasks = tasks.filter(t => t.day === todayKey);
  const completedToday = todayTasks.filter(t => t.completed).length;

  // Speech Recognition setup
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      addBotMessage(L.noSupport);
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'ru' ? 'ru-RU' : lang === 'en' ? 'en-US' : 'uz-UZ';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const text = event.results[0][0].transcript;
      setTranscript(text);
      processCommand(text);
      setListening(false);
    };

    recognition.onerror = () => {
      setListening(false);
      addBotMessage(lang === 'ru' ? 'Не расслышал. Повторите.' : lang === 'en' ? "Didn't catch that. Try again." : "Eshitmadim. Qayta ayting.");
    };

    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const addBotMessage = (text) => {
    setMessages(prev => [...prev, { id: Date.now(), type: 'bot', text, time: new Date().toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' }) }]);
  };

  const addUserMessage = (text) => {
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text, time: new Date().toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' }) }]);
  };

  // Process voice/text command
  const processCommand = (input) => {
    const text = input.toLowerCase().trim();
    addUserMessage(input);

    // === "bugun reja" / "today plan" ===
    if (text.includes('bugun') && (text.includes('reja') || text.includes('vazifa')) || text.includes('today') || text.includes('сегодня')) {
      if (todayTasks.length === 0) {
        addBotMessage(lang === 'ru' ? '📋 Сегодня задач нет.' : lang === 'en' ? '📋 No tasks today.' : '📋 Bugun vazifa yo\'q.');
      } else {
        const list = todayTasks.map(t => `${t.completed ? '✅' : '⬜'} ${t.time} — ${t.title}`).join('\n');
        addBotMessage(`📋 ${lang === 'ru' ? 'Задачи на сегодня' : lang === 'en' ? "Today's tasks" : 'Bugungi vazifalar'} (${completedToday}/${todayTasks.length}):\n${list}`);
      }
      return;
    }

    // === "holat" / "status" ===
    if (text.includes('holat') || text.includes('status') || text.includes('статус') || text.includes('progress')) {
      const habitsToday = habits.filter(h => h.todayDone).length;
      const points = currentUser?.points || 0;
      addBotMessage(`📊 ${lang === 'ru' ? 'Статус' : lang === 'en' ? 'Status' : 'Holat'}:\n✅ Vazifalar: ${completedToday}/${todayTasks.length}\n💪 Odatlar: ${habitsToday}/${habits.length}\n⭐ Ball: ${points}`);
      return;
    }

    // === Income: "200 ming berdi" / "200k earned" ===
    const incomeMatch = text.match(/(\d[\d\s]*)\s*(ming|000|k)?\s*(berdi|oldi|kirim|earned|income|доход|получил)/i) || 
                        text.match(/(kirim|income|доход)\s*(\d[\d\s]*)\s*(ming|000|k)?/i);
    if (incomeMatch) {
      let amount = parseInt(incomeMatch[1]?.replace(/\s/g, '') || incomeMatch[2]?.replace(/\s/g, ''));
      if (text.includes('ming') || text.includes('000') || text.includes('k')) amount *= 1000;
      const tx = { id: Date.now(), type: 'income', amount, category: 'Kirim', note: `Ovozli: "${input}"`, date: new Date().toISOString().split('T')[0] };
      setFinance(prev => [tx, ...prev]);
      addBotMessage(`✅ +${amount.toLocaleString()} ${lang === 'ru' ? 'добавлено в доход' : lang === 'en' ? 'added to income' : "so'm kirimga qo'shildi"} 💰`);
      return;
    }

    // === Expense: "60 ming ishlatdim" / "spent 60k" ===
    const expenseMatch = text.match(/(\d[\d\s]*)\s*(ming|000|k)?\s*(ishlatdim|sarfladim|chiqim|spent|expense|расход|потратил)/i) ||
                         text.match(/(chiqim|expense|расход)\s*(\d[\d\s]*)\s*(ming|000|k)?/i);
    if (expenseMatch) {
      let amount = parseInt(expenseMatch[1]?.replace(/\s/g, '') || expenseMatch[2]?.replace(/\s/g, ''));
      if (text.includes('ming') || text.includes('000') || text.includes('k')) amount *= 1000;
      const tx = { id: Date.now(), type: 'expense', amount, category: 'Chiqim', note: `Ovozli: "${input}"`, date: new Date().toISOString().split('T')[0] };
      setFinance(prev => [tx, ...prev]);
      addBotMessage(`✅ -${amount.toLocaleString()} ${lang === 'ru' ? 'записано в расход' : lang === 'en' ? 'recorded as expense' : "so'm chiqimga yozildi"} 💸`);
      return;
    }

    // === Add task: "qosh vazifa kitob o'qi" / "add task read book" ===
    const taskMatch = text.match(/(qo'sh|qosh|add|добавь|создай)\s*(vazifa|task|задач[уа])?\s*(.+)/i);
    if (taskMatch) {
      const title = taskMatch[3].trim();
      if (title) {
        addTask({ title, time: new Date().toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' }), priority: 'medium', day: todayKey, category: 'personal', completed: false });
        addBotMessage(`✅ "${title}" ${lang === 'ru' ? 'добавлена в задачи' : lang === 'en' ? 'added to tasks' : "vazifaga qo'shildi"} 📝`);
        return;
      }
    }

    // === "yordam" / "help" ===
    if (text.includes('yordam') || text.includes('help') || text.includes('помощь') || text.includes('buyruq')) {
      setShowHelp(true);
      addBotMessage(lang === 'ru' ? '📖 Вот список команд ⬇️' : lang === 'en' ? '📖 Here are the commands ⬇️' : '📖 Buyruqlar ro\'yxati ⬇️');
      return;
    }

    // === Unknown command ===
    addBotMessage(lang === 'ru' ? '🤔 Не понял. Скажите "помощь" для списка команд.' : lang === 'en' ? '🤔 Didn\'t understand. Say "help" for commands.' : '🤔 Tushunmadim. "Yordam" deb ayting.');
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    processCommand(textInput);
    setTextInput('');
  };

  const L = {
    title: lang === 'ru' ? 'Голосовой помощник' : lang === 'en' ? 'Voice Assistant' : 'Ovozli yordamchi',
    desc: lang === 'ru' ? 'Говорите команды или пишите текст' : lang === 'en' ? 'Speak commands or type text' : 'Buyruq ayting yoki yozing',
    placeholder: lang === 'ru' ? 'Введите команду...' : lang === 'en' ? 'Type a command...' : 'Buyruq yozing...',
    listening: lang === 'ru' ? 'Слушаю...' : lang === 'en' ? 'Listening...' : 'Tinglamoqdaman...',
    tapToSpeak: lang === 'ru' ? 'Нажмите для голоса' : lang === 'en' ? 'Tap to speak' : 'Gapirish uchun bosing',
    noSupport: lang === 'ru' ? '⚠️ Браузер не поддерживает распознавание речи' : lang === 'en' ? '⚠️ Browser doesn\'t support speech recognition' : '⚠️ Brauzer ovoz tanishni qo\'llab-quvvatlamaydi',
  };

  const commands = [
    { cmd: lang === 'ru' ? '"сегодня"' : lang === 'en' ? '"today"' : '"bugun reja"', desc: lang === 'ru' ? 'Показать задачи' : lang === 'en' ? 'Show tasks' : 'Vazifalarni ko\'rsatish' },
    { cmd: lang === 'ru' ? '"200 получил"' : lang === 'en' ? '"200k earned"' : '"200 ming berdi"', desc: lang === 'ru' ? '+200,000 доход' : lang === 'en' ? '+200,000 income' : '+200,000 kirim' },
    { cmd: lang === 'ru' ? '"60 потратил"' : lang === 'en' ? '"spent 60k"' : '"60 ming ishlatdim"', desc: lang === 'ru' ? '-60,000 расход' : lang === 'en' ? '-60,000 expense' : '-60,000 chiqim' },
    { cmd: lang === 'ru' ? '"добавь задачу X"' : lang === 'en' ? '"add task X"' : '"qosh vazifa X"', desc: lang === 'ru' ? 'Создать задачу' : lang === 'en' ? 'Create task' : 'Vazifa yaratish' },
    { cmd: lang === 'ru' ? '"статус"' : lang === 'en' ? '"status"' : '"holat"', desc: lang === 'ru' ? 'Прогресс' : lang === 'en' ? 'Progress' : 'Progress ko\'rish' },
    { cmd: lang === 'ru' ? '"помощь"' : lang === 'en' ? '"help"' : '"yordam"', desc: lang === 'ru' ? 'Команды' : lang === 'en' ? 'Commands' : 'Buyruqlar' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>🎤 {L.title}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{L.desc}</p>
        </div>
        <button onClick={() => setShowHelp(!showHelp)} className="p-2 rounded-xl transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20" style={{ border: '1px solid var(--border)' }}>
          <HelpCircle size={20} style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>
      <DevBadge message={lang === 'ru' ? '⚠️ Работает только в Chrome/Edge (Web Speech API). В Safari/Firefox текстом.' : lang === 'en' ? '⚠️ Voice works in Chrome/Edge only. Type commands in other browsers.' : "⚠️ Ovoz faqat Chrome/Edge da ishlaydi. Boshqa brauzerlarda matn bilan yozing."} />

      {/* Help panel */}
      {showHelp && (
        <div className="card animate-in" style={{ borderColor: 'var(--accent)' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>📖 {lang === 'ru' ? 'Команды' : lang === 'en' ? 'Commands' : 'Buyruqlar'}</h3>
            <button onClick={() => setShowHelp(false)} className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"><X size={16} style={{ color: 'var(--text-secondary)' }} /></button>
          </div>
          <div className="space-y-2">
            {commands.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <code className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{c.cmd}</code>
                <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{c.desc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chat messages */}
      <div className="card" style={{ minHeight: '300px', maxHeight: '450px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className="flex-1 overflow-y-auto space-y-3 mb-4 scrollbar-hide">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">🎤</div>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{L.tapToSpeak}</p>
            </div>
          )}
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line ${
                msg.type === 'user'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                  : 'rounded-bl-md'
              }`} style={msg.type === 'bot' ? { background: 'var(--bg-secondary)', color: 'var(--text-primary)' } : {}}>
                {msg.text}
                <div className={`text-[9px] mt-1 ${msg.type === 'user' ? 'text-blue-200 text-right' : ''}`} style={msg.type === 'bot' ? { color: 'var(--text-secondary)' } : {}}>{msg.time}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form onSubmit={handleTextSubmit} className="flex items-center gap-2 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <input type="text" value={textInput} onChange={e => setTextInput(e.target.value)}
            placeholder={L.placeholder}
            className="flex-1 px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <button type="submit" className="p-2.5 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors">
            <Send size={18} />
          </button>
        </form>
      </div>

      {/* Mic button */}
      <div className="flex justify-center">
        <button onClick={listening ? stopListening : startListening}
          className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 ${
            listening
              ? 'bg-red-500 shadow-red-500/40 animate-pulse'
              : 'bg-gradient-to-br from-blue-500 to-purple-500 shadow-blue-500/40 hover:scale-105'
          }`}>
          {listening ? <MicOff size={32} className="text-white" /> : <Mic size={32} className="text-white" />}
        </button>
      </div>
      <p className="text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
        {listening ? `🔴 ${L.listening}` : L.tapToSpeak}
      </p>
      {transcript && (
        <p className="text-center text-xs px-4 py-2 rounded-xl" style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
          🗣️ "{transcript}"
        </p>
      )}
    </div>
  );
}
