import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Flashcards() {
  const { language } = useAuth();
  const lang = language || 'uz';

  const [decks, setDecks] = useState(() => {
    const s = localStorage.getItem('flowly-flashcards');
    return s ? JSON.parse(s) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ front: '', back: '', deck: 'default' });
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    localStorage.setItem('flowly-flashcards', JSON.stringify(decks));
  }, [decks]);

  const addCard = () => {
    if (!form.front || !form.back) return;
    setDecks([...decks, { id: Date.now(), ...form }]);
    setForm({ front: '', back: '', deck: form.deck });
    setShowForm(false);
  };

  const safeIdx = decks.length > 0 ? currentIdx % decks.length : 0;
  const card = decks[safeIdx];

  const next = () => {
    if (decks.length === 0) return;
    setCurrentIdx(i => (i + 1) % decks.length);
    setFlipped(false);
  };

  const prev = () => {
    if (decks.length === 0) return;
    setCurrentIdx(i => (i - 1 + decks.length) % decks.length);
    setFlipped(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>🧠 Flashcards</h1>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} />
        </button>
      </div>

      {showForm && (
        <div className="card animate-in space-y-3" style={{ borderColor: 'var(--accent)' }}>
          <input type="text" placeholder={lang === 'ru' ? 'Вопрос' : 'Savol'} value={form.front}
            onChange={e => setForm({ ...form, front: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <input type="text" placeholder={lang === 'ru' ? 'Ответ' : 'Javob'} value={form.back}
            onChange={e => setForm({ ...form, back: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <button className="btn-primary w-full" onClick={addCard}>
            {lang === 'ru' ? 'Добавить' : "Qo'shish"}
          </button>
        </div>
      )}

      {decks.length === 0 ? (
        <div className="card text-center py-12">
          <p style={{ color: 'var(--text-secondary)' }}>
            {lang === 'ru' ? 'Нет карточек' : lang === 'en' ? 'No cards' : "Kartochka yo'q"}
          </p>
        </div>
      ) : (
        <>
          <div onClick={() => setFlipped(!flipped)}
            className="card cursor-pointer min-h-[200px] flex items-center justify-center text-center transition-all hover:shadow-2xl">
            <div>
              <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
                {flipped ? (lang === 'ru' ? 'Ответ' : 'Javob') : (lang === 'ru' ? 'Вопрос' : 'Savol')} ({currentIdx + 1}/{decks.length})
              </p>
              <p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                {flipped ? card?.back : card?.front}
              </p>
              <p className="text-xs mt-4" style={{ color: 'var(--accent)' }}>↻ {lang === 'ru' ? 'Перевернуть' : 'Aylantirish'}</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button onClick={prev} className="p-3 rounded-2xl"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <ChevronLeft size={20} style={{ color: 'var(--text-secondary)' }} />
            </button>
            <button onClick={() => {
              setDecks(decks.filter(d => d.id !== card?.id));
              setCurrentIdx(i => Math.max(0, i - 1));
              setFlipped(false);
            }} className="p-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/20">
              <Trash2 size={18} className="text-red-400" />
            </button>
            <button onClick={next} className="p-3 rounded-2xl"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
              <ChevronRight size={20} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
