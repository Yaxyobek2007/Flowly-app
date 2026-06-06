import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Heart, Zap, Star } from 'lucide-react';
import DevBadge from '../components/DevBadge';

const petStages = ['🥚','🐣','🐥','🐤','🐦','🦅','🦊','🐺','🦁','🐉'];
const petNames = { uz: ['Tuxum','Jo\'ja','Chaqaloq','Bolakay','Parvoz','Burgut','Tulki','Bo\'ri','Sher','Ajdaho'], ru: ['Яйцо','Птенец','Малыш','Юный','Летун','Орёл','Лис','Волк','Лев','Дракон'], en: ['Egg','Chick','Baby','Young','Flyer','Eagle','Fox','Wolf','Lion','Dragon'] };

export default function VirtualPet() {
  const { language } = useAuth();
  const { tasks, habits } = useApp();
  const lang = language || 'uz';
  const [pet, setPet] = useState(() => { const s = localStorage.getItem('flowly-pet'); return s ? JSON.parse(s) : { name: '' }; });
  const [showName, setShowName] = useState(!pet.name);
  const [nameInput, setNameInput] = useState('');
  useEffect(() => { localStorage.setItem('flowly-pet', JSON.stringify(pet)); }, [pet]);
  const completedToday = tasks.filter(t => t.completed).length;
  const habitsToday = habits.filter(h => h.todayDone).length;
  const totalActivity = completedToday + habitsToday;
  const petLevel = Math.min(Math.floor(totalActivity / 3), 9);
  const petEmoji = petStages[petLevel];
  const petTitle = petNames[lang]?.[petLevel] || petNames.en[petLevel];
  const hp = Math.min(100, Math.max(0, 20 + totalActivity * 10));
  const mood = hp >= 80 ? '😊' : hp >= 50 ? '😐' : '😢';
  const saveName = () => { if (nameInput.trim()) { setPet({name: nameInput.trim()}); setShowName(false); } };
  const L = { title: lang==='ru'?'Питомец':lang==='en'?'Pet':'Pet', tip: lang==='ru'?'Выполняйте задачи!':lang==='en'?'Complete tasks!':'Vazifa bajaring!', nameQ: lang==='ru'?'Имя питомца?':lang==='en'?'Pet name?':'Pet nomi?' };
  return (
    <div className="max-w-lg mx-auto space-y-6 text-center">
      <DevBadge message={lang === 'ru' ? '⚠️ Развлекательный режим — питомец растёт от вашей активности' : lang === 'en' ? '⚠️ Fun mode — pet grows from your activity' : "⚠️ Ko'ngilochar rejim — pet faolligingizdan o'sadi"} />
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>🐾 {L.title}</h1>
      {showName ? (<div className="card space-y-4 py-8"><span className="text-6xl">🥚</span><p style={{ color: 'var(--text-primary)' }}>{L.nameQ}</p><div className="flex gap-2 max-w-xs mx-auto"><input type="text" value={nameInput} onChange={e => setNameInput(e.target.value)} onKeyDown={e => e.key==='Enter'&&saveName()} className="flex-1 px-4 py-2.5 rounded-xl border outline-none text-center" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} /><button onClick={saveName} className="btn-primary px-4">OK</button></div></div>) : (<>
        <div className="card py-8" style={{ background: 'linear-gradient(180deg, rgba(139,92,246,0.05), rgba(59,130,246,0.05))' }}><div className="text-8xl mb-4 animate-bounce" style={{ animationDuration: '3s' }}>{petEmoji}</div><h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{pet.name}</h2><p className="text-sm" style={{ color: 'var(--accent)' }}>{petTitle} • Lv.{petLevel+1}</p><p className="text-lg mt-2">{mood}</p></div>
        <div className="grid grid-cols-3 gap-4"><div className="card py-3"><Zap size={18} className="text-yellow-500 mx-auto mb-1" /><p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{petLevel+1}</p><p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>Level</p></div><div className="card py-3"><Heart size={18} className="text-red-500 mx-auto mb-1" /><p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{hp}%</p><p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>HP</p></div><div className="card py-3"><Star size={18} className="text-purple-500 mx-auto mb-1" /><p className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{totalActivity}</p><p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>XP</p></div></div>
        <div className="card"><div className="w-full h-4 rounded-full overflow-hidden" style={{ background: 'var(--bg-secondary)' }}><div className={`h-4 rounded-full transition-all ${hp>=80?'bg-green-500':hp>=50?'bg-yellow-500':'bg-red-500'}`} style={{ width: `${hp}%` }}></div></div><p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>{L.tip}</p></div>
        <div className="card"><div className="flex justify-between">{petStages.map((s,i) => (<div key={i} className={`w-7 h-7 rounded-lg flex items-center justify-center text-base ${i<=petLevel?'opacity-100':'opacity-20'} ${i===petLevel?'ring-2 ring-purple-500 scale-110':''}`}>{s}</div>))}</div></div>
      </>)}
    </div>
  );
}
