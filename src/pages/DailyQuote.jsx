import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { RefreshCw, Heart, Copy, Check } from 'lucide-react';

const quotes = [
  { uz: "Kelajak bugun qilgan ishlar bilan yaratiladi", ru: "Будущее создаётся сегодняшними делами", en: "The future is created by what you do today", author: "Mahatma Gandhi" },
  { uz: "Har kuni 1% yaxshilaning — yil oxiriga 37 marta yaxshiroq bo'lasiz", ru: "Улучшайся на 1% каждый день — за год будешь в 37 раз лучше", en: "Get 1% better daily — you'll be 37x better in a year", author: "James Clear" },
  { uz: "Intizom — bu erkinlikka olib boruvchi ko'prik", ru: "Дисциплина — мост к свободе", en: "Discipline is the bridge to freedom", author: "Jim Rohn" },
  { uz: "Muvaffaqiyat — bu har kuni takrorlanadigan kichik harakatlar", ru: "Успех — это маленькие действия каждый день", en: "Success is small actions repeated daily", author: "Robert Collier" },
  { uz: "Eng yaxshi vaqt — hozir. Eng yaxshi joy — shu yer", ru: "Лучшее время — сейчас. Лучшее место — здесь", en: "The best time is now. The best place is here", author: "Buddha" },
  { uz: "O'zingizga ishoning — siz o'ylayotganingizdan kuchlirsiz", ru: "Верьте в себя — вы сильнее, чем думаете", en: "Believe in yourself — you're stronger than you think", author: "Unknown" },
  { uz: "Katta maqsadlar kichik qadamlardan boshlanadi", ru: "Большие цели начинаются с маленьких шагов", en: "Big goals start with small steps", author: "Lao Tzu" },
  { uz: "Bugun qiyin — ertaga oson bo'ladi", ru: "Сегодня трудно — завтра будет легче", en: "Today is hard — tomorrow will be easier", author: "Jack Ma" },
  { uz: "Vaqt — eng qimmat boylik. Uni sarflang", ru: "Время — самое ценное. Тратьте его мудро", en: "Time is the most valuable thing. Spend it wisely", author: "Theophrastus" },
  { uz: "Dangasa bo'lmang — harakatda bo'ling", ru: "Не ленитесь — будьте в движении", en: "Don't be lazy — stay in motion", author: "Newton" },
  { uz: "Bilim — kuch. O'rganishni hech qachon to'xtatmang", ru: "Знание — сила. Никогда не прекращайте учиться", en: "Knowledge is power. Never stop learning", author: "Francis Bacon" },
  { uz: "Orzularingiz katta bo'lsin — harakatingiz undan kattaroq", ru: "Мечтайте масштабно — действуйте ещё масштабнее", en: "Dream big — act even bigger", author: "Flowly" },
  { uz: "Har bir yangi kun — yangi imkoniyat", ru: "Каждый новый день — новая возможность", en: "Every new day is a new opportunity", author: "Unknown" },
  { uz: "Muvaffaqiyatga yo'l — intizom + sabr + harakat", ru: "Путь к успеху — дисциплина + терпение + действие", en: "Path to success — discipline + patience + action", author: "Flowly" },
  { uz: "O'tmishni o'zgartira olmaysiz, lekin kelajakni yaratishingiz mumkin", ru: "Прошлое не изменить, но можно создать будущее", en: "You can't change the past, but you can create the future", author: "Unknown" },
];

export default function DailyQuote() {
  const { language } = useAuth();
  const lang = language || 'uz';
  const [idx, setIdx] = useState(() => { const saved = localStorage.getItem('flowly-quote-idx'); const savedDate = localStorage.getItem('flowly-quote-date'); const today = new Date().toISOString().split('T')[0]; if (savedDate === today && saved) return parseInt(saved); const newIdx = Math.floor(Math.random() * quotes.length); localStorage.setItem('flowly-quote-idx', newIdx); localStorage.setItem('flowly-quote-date', today); return newIdx; });
  const [liked, setLiked] = useState(false);
  const [copied, setCopied] = useState(false);
  const quote = quotes[idx];
  const refresh = () => { const n = (idx + 1) % quotes.length; setIdx(n); localStorage.setItem('flowly-quote-idx', n); setLiked(false); };
  const copy = () => { navigator.clipboard.writeText(`"${quote[lang]}" — ${quote.author}`); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center"><h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>📖 {lang === 'ru' ? 'Цитата дня' : lang === 'en' ? 'Daily Quote' : 'Kunlik iqtibos'}</h1></div>
      <div className="card relative overflow-hidden py-12 px-8 text-center" style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.05), rgba(59,130,246,0.05))' }}>
        <div className="absolute top-4 left-6 text-6xl opacity-10" style={{ color: 'var(--accent)' }}>"</div>
        <p className="text-xl font-medium leading-relaxed relative z-10" style={{ color: 'var(--text-primary)' }}>"{quote[lang]}"</p>
        <p className="mt-4 text-sm font-medium" style={{ color: 'var(--accent)' }}>— {quote.author}</p>
        <div className="absolute bottom-4 right-6 text-6xl opacity-10 rotate-180" style={{ color: 'var(--accent)' }}>"</div>
      </div>
      <div className="flex items-center justify-center gap-4">
        <button onClick={() => setLiked(!liked)} className={`p-3 rounded-2xl transition-all active:scale-90 ${liked ? 'bg-red-50 dark:bg-red-900/20' : ''}`} style={{ border: '1px solid var(--border)' }}><Heart size={22} className={liked ? 'text-red-500 fill-red-500' : ''} style={!liked ? { color: 'var(--text-secondary)' } : {}} /></button>
        <button onClick={copy} className="p-3 rounded-2xl transition-all active:scale-90" style={{ border: '1px solid var(--border)' }}>{copied ? <Check size={22} className="text-green-500" /> : <Copy size={22} style={{ color: 'var(--text-secondary)' }} />}</button>
        <button onClick={refresh} className="p-3 rounded-2xl transition-all active:scale-90 hover:bg-blue-50 dark:hover:bg-blue-900/20" style={{ border: '1px solid var(--border)' }}><RefreshCw size={22} style={{ color: 'var(--text-secondary)' }} /></button>
      </div>
      <div className="card"><h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>{lang === 'ru' ? 'Все цитаты' : lang === 'en' ? 'All quotes' : 'Barcha iqtiboslar'} ({quotes.length})</h4><div className="space-y-2 max-h-60 overflow-y-auto scrollbar-hide">{quotes.map((q, i) => (<div key={i} onClick={() => { setIdx(i); setLiked(false); }} className={`p-3 rounded-xl cursor-pointer transition-all text-xs ${i === idx ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/10' : ''}`} style={i !== idx ? { background: 'var(--bg-secondary)' } : {}}><p style={{ color: 'var(--text-primary)' }}>"{q[lang]}"</p><p className="mt-1 font-medium" style={{ color: 'var(--text-secondary)' }}>— {q.author}</p></div>))}</div></div>
    </div>
  );
}
