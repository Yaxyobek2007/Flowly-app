import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Edit2, TrendingUp, TrendingDown, Wallet, Bus, UtensilsCrossed, Home, Gamepad2, PiggyBank, ShoppingBag, Phone, Zap, AlertTriangle } from 'lucide-react';

const CATEGORIES = [
  { key: 'transport', icon: Bus, color: '#3b82f6', uz: 'Transport', ru: 'Транспорт', en: 'Transport' },
  { key: 'food', icon: UtensilsCrossed, color: '#f97316', uz: 'Ovqat', ru: 'Еда', en: 'Food' },
  { key: 'rent', icon: Home, color: '#ef4444', uz: 'Arenda/Uy', ru: 'Аренда', en: 'Rent' },
  { key: 'fun', icon: Gamepad2, color: '#8b5cf6', uz: "O'yin-kulgi", ru: 'Развлечения', en: 'Fun' },
  { key: 'savings', icon: PiggyBank, color: '#22c55e', uz: "Jamg'arma", ru: 'Накопления', en: 'Savings' },
  { key: 'shopping', icon: ShoppingBag, color: '#ec4899', uz: 'Xarid', ru: 'Покупки', en: 'Shopping' },
  { key: 'phone', icon: Phone, color: '#06b6d4', uz: 'Telefon', ru: 'Телефон', en: 'Phone' },
  { key: 'other', icon: Zap, color: '#64748b', uz: 'Boshqa', ru: 'Другое', en: 'Other' },
];

function safeParse(key, fallback) {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch(e) { return fallback; }
}

function formatMoney(n) {
  if (n === 0) return '0';
  const abs = Math.abs(n);
  if (abs >= 1000000) return (n / 1000000).toFixed(1) + ' mln';
  return Math.round(n).toLocaleString('ru-RU');
}

export default function BudgetManager() {
  const { language } = useAuth();
  const lang = language || 'uz';

  const today = new Date().toISOString().split('T')[0];
  const currentMonth = today.slice(0, 7);
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const currentDay = new Date().getDate();
  const daysLeft = daysInMonth - currentDay;

  const [budget, setBudget] = useState(() => safeParse(`flowly-budget-${currentMonth}`, null));
  const [showSetup, setShowSetup] = useState(!budget);
  const [expenseForm, setExpenseForm] = useState({ amount: '', category: 'food', note: '' });
  const [showExpForm, setShowExpForm] = useState(false);
  const [incomeForm, setIncomeForm] = useState({ amount: '', note: '' });
  const [showIncForm, setShowIncForm] = useState(false);

  const [setupForm, setSetupForm] = useState({
    salary: '', rent: '', savings: '', phone: '',
  });

  useEffect(() => {
    if (budget) localStorage.setItem(`flowly-budget-${currentMonth}`, JSON.stringify(budget));
  }, [budget, currentMonth]);

  // === CALCULATIONS (real-time) ===
  const totalIncome = budget ? budget.salary + (budget.extraIncome || 0) : 0;
  const fixedExpenses = budget ? ((budget.fixed?.rent || 0) + (budget.fixed?.phone || 0) + (budget.fixed?.savings || 0)) : 0;
  const totalSpent = useMemo(() => (budget?.expenses || []).reduce((a, e) => a + e.amount, 0), [budget?.expenses]);
  
  // REAL BALANCE = oylik - barcha sarflar - doimiy chiqimlar
  const balance = totalIncome - fixedExpenses - totalSpent;
  
  const dailyLimit = daysLeft > 0 ? Math.floor(balance / daysLeft) : balance;
  const todayExpenses = useMemo(() => (budget?.expenses || []).filter(e => e.date === today), [budget?.expenses, today]);
  const todaySpent = todayExpenses.reduce((a, e) => a + e.amount, 0);
  const todayLeft = dailyLimit - todaySpent;

  // Week data
  const weekData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      const ds = d.toISOString().split('T')[0];
      return { day: d.getDate(), spent: (budget?.expenses || []).filter(e => e.date === ds).reduce((a, e) => a + e.amount, 0) };
    });
  }, [budget?.expenses]);

  // Category totals
  const catTotals = useMemo(() => {
    const r = {};
    CATEGORIES.forEach(c => { r[c.key] = 0; });
    (budget?.expenses || []).forEach(e => { r[e.category] = (r[e.category] || 0) + e.amount; });
    return r;
  }, [budget?.expenses]);

  // === ACTIONS ===
  const handleSetup = () => {
    const salary = parseInt(setupForm.salary) || 0;
    if (!salary) return;
    setBudget({
      salary,
      extraIncome: 0,
      fixed: {
        rent: parseInt(setupForm.rent) || 0,
        savings: parseInt(setupForm.savings) || 0,
        phone: parseInt(setupForm.phone) || 0,
      },
      expenses: [],
    });
    setShowSetup(false);
  };

  const addExpense = () => {
    const amount = parseInt(expenseForm.amount);
    if (!amount || amount <= 0) return;
    setBudget(prev => ({
      ...prev,
      expenses: [...(prev.expenses || []), {
        id: Date.now(),
        amount,
        category: expenseForm.category,
        note: expenseForm.note || CATEGORIES.find(c => c.key === expenseForm.category)?.[lang] || '',
        date: today,
        time: new Date().toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' }),
      }],
    }));
    setExpenseForm({ amount: '', category: expenseForm.category, note: '' });
    setShowExpForm(false);
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  const addIncome = () => {
    const amount = parseInt(incomeForm.amount);
    if (!amount || amount <= 0) return;
    setBudget(prev => ({
      ...prev,
      extraIncome: (prev.extraIncome || 0) + amount,
      expenses: [...(prev.expenses || []), {
        id: Date.now(),
        amount: -amount, // negative = income
        category: 'other',
        note: incomeForm.note || (lang === 'ru' ? 'Доп. доход' : "Qo'shimcha kirim"),
        date: today,
        time: new Date().toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' }),
        isIncome: true,
      }],
    }));
    setIncomeForm({ amount: '', note: '' });
    setShowIncForm(false);
    if ('vibrate' in navigator) navigator.vibrate([30, 50, 30]);
  };

  const deleteExpense = (id) => {
    setBudget(prev => ({ ...prev, expenses: (prev.expenses || []).filter(e => e.id !== id) }));
  };

  // === SETUP SCREEN ===
  if (showSetup) {
    const previewFlex = (parseInt(setupForm.salary) || 0) - (parseInt(setupForm.rent) || 0) - (parseInt(setupForm.savings) || 0) - (parseInt(setupForm.phone) || 0);
    const previewDaily = previewFlex > 0 ? Math.floor(previewFlex / daysInMonth) : 0;
    return (
      <div className="max-w-lg mx-auto space-y-5">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>💰 {lang === 'ru' ? 'Настройка бюджета' : 'Budjet sozlash'}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Введите зарплату и расходы' : 'Oylik va doimiy chiqimlarni kiriting'}</p>
        </div>
        <div className="card space-y-4" style={{ borderColor: 'var(--accent)' }}>
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>💵 {lang === 'ru' ? 'Зарплата' : 'Oylik maosh'} (so'm)</label>
            <input type="number" value={setupForm.salary} onChange={e => setSetupForm({ ...setupForm, salary: e.target.value })}
              placeholder="5000000" className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-500 text-xl font-bold"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} autoFocus />
          </div>
          <div className="border-t pt-4 space-y-3" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>📋 {lang === 'ru' ? 'Ежемесячные обязательные:' : 'Oylik majburiy chiqimlar:'}</p>
            {[
              { key: 'rent', icon: '🏠', label: lang === 'ru' ? 'Аренда / Коммунальные' : 'Arenda / Kommunal', ph: '1000000' },
              { key: 'savings', icon: '🐷', label: lang === 'ru' ? 'Накопления (цель)' : "Jamg'arma (maqsad)", ph: '500000' },
              { key: 'phone', icon: '📱', label: lang === 'ru' ? 'Телефон / Интернет' : 'Telefon / Internet', ph: '50000' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-[10px] mb-0.5 block" style={{ color: 'var(--text-secondary)' }}>{f.icon} {f.label}</label>
                <input type="number" value={setupForm[f.key]} onChange={e => setSetupForm({ ...setupForm, [f.key]: e.target.value })}
                  placeholder={f.ph} className="w-full px-3 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              </div>
            ))}
          </div>
          {setupForm.salary && (
            <div className="p-4 rounded-xl" style={{ background: 'rgba(34,197,94,0.05)', border: '1px solid rgba(34,197,94,0.2)' }}>
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>📊 Hisob:</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between"><span style={{ color: 'var(--text-secondary)' }}>Oylik:</span><span className="font-bold" style={{ color: 'var(--text-primary)' }}>{formatMoney(parseInt(setupForm.salary) || 0)}</span></div>
                <div className="flex justify-between"><span style={{ color: 'var(--text-secondary)' }}>- Majburiy:</span><span className="font-bold text-red-500">-{formatMoney((parseInt(setupForm.rent) || 0) + (parseInt(setupForm.savings) || 0) + (parseInt(setupForm.phone) || 0))}</span></div>
                <div className="flex justify-between border-t pt-1" style={{ borderColor: 'var(--border)' }}><span className="font-semibold" style={{ color: 'var(--text-primary)' }}>= Erkin pul:</span><span className="font-bold text-emerald-500">{formatMoney(previewFlex)}</span></div>
                <div className="flex justify-between"><span style={{ color: 'var(--text-secondary)' }}>÷ {daysInMonth} kun:</span><span className="font-bold text-blue-500">{formatMoney(previewDaily)} /kun</span></div>
              </div>
            </div>
          )}
          <button onClick={handleSetup} className="btn-primary w-full text-lg py-3.5">✅ {lang === 'ru' ? 'Начать' : 'Boshlash'}</button>
        </div>
      </div>
    );
  }

  // === MAIN SCREEN ===
  const balanceColor = balance > totalIncome * 0.3 ? '#22c55e' : balance > totalIncome * 0.1 ? '#eab308' : '#ef4444';
  const monthPct = totalIncome > 0 ? Math.round(((totalIncome - balance) / totalIncome) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* === REAL-TIME BALANCE FRAME === */}
      <div className="card overflow-hidden relative" style={{ padding: 0 }}>
        <div className="absolute inset-0 opacity-5" style={{ background: `radial-gradient(circle at 80% 20%, ${balanceColor}, transparent)` }} />
        <div className="p-5 relative">
          {/* Top row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'ru' ? 'Текущий баланс' : 'Joriy balans'}
              </p>
              <p className="text-3xl sm:text-4xl font-bold mt-1" style={{ color: balanceColor }}>
                {formatMoney(balance)} <span className="text-sm font-normal" style={{ color: 'var(--text-secondary)' }}>so'm</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{daysLeft} kun qoldi</p>
              <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>{formatMoney(dailyLimit)}<span className="text-[9px] font-normal" style={{ color: 'var(--text-secondary)' }}>/kun</span></p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2.5 rounded-full mb-2" style={{ background: 'var(--bg-secondary)' }}>
            <div className="h-2.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(monthPct, 100)}%`, background: monthPct > 80 ? '#ef4444' : monthPct > 60 ? '#eab308' : '#22c55e' }} />
          </div>
          <div className="flex justify-between text-[9px]">
            <span style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Потрачено' : 'Sarflandi'}: {formatMoney(totalSpent + fixedExpenses)}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{monthPct}% ishlatildi</span>
            <span style={{ color: balanceColor }}>{lang === 'ru' ? 'Осталось' : 'Qoldi'}: {formatMoney(balance)}</span>
          </div>
        </div>
      </div>

      {/* Today stats */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="card text-center" style={{ padding: '0.75rem' }}>
          <p className="text-[8px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Лимит' : 'Limit'}</p>
          <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>{formatMoney(dailyLimit)}</p>
        </div>
        <div className="card text-center" style={{ padding: '0.75rem' }}>
          <p className="text-[8px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Сегодня' : 'Bugun'}</p>
          <p className={`text-lg font-bold ${todaySpent > dailyLimit ? 'text-red-500' : 'text-orange-500'}`}>{formatMoney(todaySpent)}</p>
        </div>
        <div className="card text-center" style={{ padding: '0.75rem' }}>
          <p className="text-[8px] uppercase tracking-wider" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Можно' : 'Mumkin'}</p>
          <p className={`text-lg font-bold ${todayLeft < 0 ? 'text-red-500' : 'text-green-500'}`}>{todayLeft < 0 ? '-' : ''}{formatMoney(Math.abs(todayLeft))}</p>
        </div>
      </div>

      {/* Over limit warning */}
      {todayLeft < 0 && (
        <div className="flex items-center gap-2 p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
          <AlertTriangle size={15} className="text-red-500" />
          <span className="text-xs font-medium text-red-600 dark:text-red-400">{lang === 'ru' ? `Превышение на ${formatMoney(Math.abs(todayLeft))}!` : `${formatMoney(Math.abs(todayLeft))} oshib ketdi!`}</span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <button onClick={() => { setShowExpForm(!showExpForm); setShowIncForm(false); }}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all active:scale-95"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444' }}>
          <TrendingDown size={16} /> {lang === 'ru' ? '− Расход' : '− Chiqim'}
        </button>
        <button onClick={() => { setShowIncForm(!showIncForm); setShowExpForm(false); }}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all active:scale-95"
          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#22c55e' }}>
          <TrendingUp size={16} /> {lang === 'ru' ? '+ Доход' : '+ Kirim'}
        </button>
        <button onClick={() => setShowSetup(true)} className="p-3 rounded-xl transition-all active:scale-95" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
          <Edit2 size={16} style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>

      {/* Expense form */}
      {showExpForm && (
        <div className="card animate-in space-y-3" style={{ borderColor: '#ef4444' }}>
          <input type="number" value={expenseForm.amount} onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && addExpense()} placeholder={lang === 'ru' ? 'Сумма расхода' : 'Chiqim summasi'} autoFocus
            className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-red-400 text-xl font-bold"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.filter(c => c.key !== 'savings').map(cat => (
              <button key={cat.key} onClick={() => setExpenseForm({ ...expenseForm, category: cat.key })}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium transition-all ${expenseForm.category === cat.key ? 'text-white shadow' : ''}`}
                style={expenseForm.category === cat.key ? { background: cat.color } : { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                <cat.icon size={11} /> {cat[lang]}
              </button>
            ))}
          </div>
          <input type="text" value={expenseForm.note} onChange={e => setExpenseForm({ ...expenseForm, note: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && addExpense()} placeholder={lang === 'ru' ? 'На что потратили?' : 'Nimaga sarfladingiz?'}
            className="w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-red-400 text-sm"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <button onClick={addExpense} className="w-full py-3 rounded-xl bg-red-500 text-white font-bold active:scale-[0.98]">
            − {lang === 'ru' ? 'Записать расход' : 'Chiqim yozish'}
          </button>
        </div>
      )}

      {/* Income form */}
      {showIncForm && (
        <div className="card animate-in space-y-3" style={{ borderColor: '#22c55e' }}>
          <input type="number" value={incomeForm.amount} onChange={e => setIncomeForm({ ...incomeForm, amount: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && addIncome()} placeholder={lang === 'ru' ? 'Сумма дохода' : 'Kirim summasi'} autoFocus
            className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-green-400 text-xl font-bold"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <input type="text" value={incomeForm.note} onChange={e => setIncomeForm({ ...incomeForm, note: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && addIncome()} placeholder={lang === 'ru' ? 'Откуда?' : "Qayerdan keldi?"}
            className="w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-green-400 text-sm"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <button onClick={addIncome} className="w-full py-3 rounded-xl bg-green-500 text-white font-bold active:scale-[0.98]">
            + {lang === 'ru' ? 'Записать доход' : 'Kirim yozish'}
          </button>
        </div>
      )}

      {/* 7-day chart */}
      <div className="card">
        <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>📊 {lang === 'ru' ? '7 дней' : '7 kun'}</h3>
        <div className="flex items-end justify-between gap-1" style={{ height: '60px' }}>
          {weekData.map((d, i) => {
            const max = Math.max(...weekData.map(x => x.spent), dailyLimit, 1);
            const h = (d.spent / max) * 50;
            const over = d.spent > dailyLimit;
            return (
              <div key={i} className="flex-1 flex flex-col items-center">
                <div className="w-full relative" style={{ height: '50px' }}>
                  <div className="absolute w-full border-t border-dashed opacity-30" style={{ bottom: `${(dailyLimit / max) * 50}px`, borderColor: 'var(--accent)' }} />
                  <div className={`absolute bottom-0 w-full rounded-t transition-all ${over ? 'bg-red-500' : 'bg-emerald-500'}`} style={{ height: `${Math.max(h, 1)}px`, opacity: d.spent > 0 ? 1 : 0.15 }} />
                </div>
                <span className="text-[7px] mt-1 font-medium" style={{ color: i === 6 ? 'var(--accent)' : 'var(--text-secondary)' }}>{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      {Object.values(catTotals).some(v => v > 0) && (
        <div className="card">
          <h3 className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>📂 {lang === 'ru' ? 'Категории' : 'Kategoriyalar'}</h3>
          <div className="space-y-2">
            {CATEGORIES.filter(c => catTotals[c.key] > 0).sort((a, b) => catTotals[b.key] - catTotals[a.key]).map(cat => {
              const spent = catTotals[cat.key];
              const pct = totalSpent > 0 ? Math.round((spent / totalSpent) * 100) : 0;
              const Icon = cat.icon;
              return (
                <div key={cat.key} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${cat.color}15` }}>
                    <Icon size={13} style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[10px] font-medium" style={{ color: 'var(--text-primary)' }}>{cat[lang]}</span>
                      <span className="text-[9px] font-bold" style={{ color: cat.color }}>{formatMoney(spent)} ({pct}%)</span>
                    </div>
                    <div className="h-1.5 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                      <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: cat.color }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Today's transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-semibold" style={{ color: 'var(--text-primary)' }}>🧾 {lang === 'ru' ? 'Сегодня' : 'Bugun'}</h3>
          <span className="text-[10px] font-bold" style={{ color: todaySpent > dailyLimit ? '#ef4444' : 'var(--accent)' }}>{formatMoney(todaySpent)}</span>
        </div>
        {todayExpenses.length === 0 ? (
          <p className="text-center text-xs py-3" style={{ color: 'var(--text-secondary)' }}>✓ {lang === 'ru' ? 'Нет расходов' : "Chiqim yo'q"}</p>
        ) : (
          <div className="space-y-1.5">
            {todayExpenses.map(e => {
              const cat = CATEGORIES.find(c => c.key === e.category);
              const Icon = cat?.icon || Zap;
              return (
                <div key={e.id} className="flex items-center gap-2.5 p-2 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${e.isIncome ? '#22c55e' : (cat?.color || '#64748b')}15` }}>
                    {e.isIncome ? <TrendingUp size={13} className="text-green-500" /> : <Icon size={13} style={{ color: cat?.color || '#64748b' }} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-medium truncate" style={{ color: 'var(--text-primary)' }}>{e.note}</p>
                    <p className="text-[8px]" style={{ color: 'var(--text-secondary)' }}>{e.time} • {cat?.[lang] || ''}</p>
                  </div>
                  <span className={`text-xs font-bold ${e.isIncome ? 'text-green-500' : 'text-red-500'}`}>
                    {e.isIncome ? '+' : '−'}{formatMoney(Math.abs(e.amount))}
                  </span>
                  <button onClick={() => deleteExpense(e.id)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 size={11} className="text-red-400" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Savings */}
      {budget?.fixed?.savings > 0 && (
        <div className="card flex items-center gap-3" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.03), rgba(16,185,129,0.06))' }}>
          <PiggyBank size={20} className="text-green-500" />
          <div className="flex-1">
            <p className="text-xs font-medium" style={{ color: 'var(--text-primary)' }}>🐷 {lang === 'ru' ? 'Накопления' : "Jamg'arma"}</p>
            <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Отложено в этом месяце' : "Bu oyda ajratildi"}</p>
          </div>
          <span className="text-lg font-bold text-green-500">{formatMoney(budget.fixed.savings)}</span>
        </div>
      )}
    </div>
  );
}
