import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Mic, MicOff } from 'lucide-react';
import { useApp } from '../context/AppContext';

const searchablePages = [
  { path: '/', label: 'Dashboard', keywords: ['bosh sahifa', 'dashboard', 'asosiy'] },
  { path: '/daily', label: 'Daily Planner', keywords: ['kunlik', 'reja', 'daily', 'vazifa'] },
  { path: '/weekly', label: 'Weekly Planner', keywords: ['haftalik', 'weekly', 'hafta'] },
  { path: '/monthly', label: 'Monthly Planner', keywords: ['oylik', 'monthly', 'kalendar', 'oy'] },
  { path: '/goals', label: 'Yearly Goals', keywords: ['yillik', 'maqsad', 'goals', 'target'] },
  { path: '/habits', label: 'Habit Tracker', keywords: ['odat', 'habit', 'streak'] },
  { path: '/notes', label: 'Notes', keywords: ['yozuv', 'notes', 'eslatma'] },
  { path: '/analytics', label: 'Analytics', keywords: ['statistika', 'analytics', 'hisobot'] },
  { path: '/achievements', label: 'Achievements', keywords: ['yutuq', 'medal', 'achievement'] },
  { path: '/certificates', label: 'Certificates', keywords: ['sertifikat', 'diplom', 'mukofot'] },
  { path: '/friends', label: 'Friends', keywords: ["do'st", 'friend', 'taklif'] },
  { path: '/premium', label: 'Premium', keywords: ['premium', 'pro', 'plan', 'obuna'] },
  { path: '/settings', label: 'Settings', keywords: ['sozlama', 'settings', 'nastroyka'] },
  { path: '/profile', label: 'Profile', keywords: ['profil', 'akkaunt', 'shaxsiy'] },
  { path: '/location', label: 'Xarita', keywords: ['xarita', 'lokatsiya', 'map', 'joy', 'geolokatsiya'] },
  { path: '/crm', label: 'CRM/ERP', keywords: ['crm', 'erp', 'boshqaruv', 'biznes', 'daromad'] },
];

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { tasks, habits, goals, notes, events } = useApp();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const q = query.toLowerCase();
    const pageResults = searchablePages.filter(p =>
      p.label.toLowerCase().includes(q) || p.keywords.some(k => k.includes(q))
    ).map(p => ({ type: 'page', ...p }));

    const taskResults = tasks.filter(t =>
      t.title.toLowerCase().includes(q)
    ).slice(0, 5).map(t => ({ type: 'task', label: t.title, path: '/daily', detail: `${t.time} - ${t.day}` }));

    const habitResults = habits.filter(h =>
      h.name.toLowerCase().includes(q)
    ).slice(0, 3).map(h => ({ type: 'habit', label: `${h.icon} ${h.name}`, path: '/habits', detail: `🔥 ${h.streak} kun streak` }));

    const goalResults = goals.filter(g =>
      g.title.toLowerCase().includes(q)
    ).slice(0, 3).map(g => ({ type: 'goal', label: g.title, path: '/goals', detail: `${g.progress}% bajarildi` }));

    const noteResults = notes.filter(n =>
      n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q)
    ).slice(0, 3).map(n => ({ type: 'note', label: n.title, path: '/notes', detail: n.category }));

    const eventResults = events.filter(e =>
      e.title.toLowerCase().includes(q)
    ).slice(0, 3).map(e => ({ type: 'event', label: `${e.icon} ${e.title}`, path: '/monthly', detail: e.date }));

    setResults([...pageResults, ...taskResults, ...habitResults, ...goalResults, ...noteResults, ...eventResults]);
  }, [query, tasks, habits, goals, notes, events]);

  const handleSelect = (result) => {
    navigate(result.path);
    onClose();
    setQuery('');
  };

  const startVoiceSearch = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'uz-UZ';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
      };
      recognition.onerror = () => setIsListening(false);
      
      recognition.start();
    } else {
      alert("Brauzeringiz ovozli qidiruvni qo'llab-quvvatlamaydi");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative w-full max-w-lg mx-4 animate-in" onClick={e => e.stopPropagation()}>
        <div className="rounded-2xl overflow-hidden shadow-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
          {/* Search Input */}
          <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <Search size={20} style={{ color: 'var(--text-secondary)' }} />
            <input ref={inputRef} type="text" placeholder="Qidirish..." value={query}
              onChange={e => setQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-lg" style={{ color: 'var(--text-primary)' }} />
            <button onClick={startVoiceSearch} className={`p-2 rounded-lg transition-all ${isListening ? 'bg-red-100 dark:bg-red-900/30' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
              {isListening ? <MicOff size={18} className="text-red-500 animate-pulse" /> : <Mic size={18} style={{ color: 'var(--text-secondary)' }} />}
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <X size={18} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>

          {/* Results */}
          <div className="max-h-80 overflow-y-auto p-2">
            {results.length === 0 && query && (
              <p className="text-center py-8 text-sm" style={{ color: 'var(--text-secondary)' }}>Natija topilmadi</p>
            )}
            {results.length === 0 && !query && (
              <div className="py-6 px-4 space-y-2">
                <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Tez qidiruv:</p>
                <div className="flex flex-wrap gap-2">
                  {['Dashboard', 'Vazifalar', 'Odatlar', 'Maqsadlar', 'Yozuvlar'].map(s => (
                    <button key={s} onClick={() => setQuery(s)}
                      className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {results.map((result, idx) => (
              <button key={idx} onClick={() => handleSelect(result)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors text-left">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                  style={{ background: 'var(--bg-secondary)', color: 'var(--accent)' }}>
                  {result.type === 'page' ? '📄' : result.type === 'task' ? '✅' : result.type === 'habit' ? '🔥' : result.type === 'goal' ? '🎯' : result.type === 'note' ? '📝' : '📅'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate" style={{ color: 'var(--text-primary)' }}>{result.label}</p>
                  {result.detail && <p className="text-xs truncate" style={{ color: 'var(--text-secondary)' }}>{result.detail}</p>}
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{result.type}</span>
              </button>
            ))}
          </div>

          {/* Keyboard shortcut hint */}
          <div className="flex items-center justify-between px-4 py-2 border-t" style={{ borderColor: 'var(--border)' }}>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>↑↓ harakatlanish</span>
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>ESC yopish</span>
          </div>
        </div>
      </div>
    </div>
  );
}
