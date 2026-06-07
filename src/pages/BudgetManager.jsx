import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Edit2, Save, X, TrendingUp, TrendingDown, Wallet, Bus, UtensilsCrossed, Home, Gamepad2, PiggyBank, ShoppingBag, Phone, Zap, AlertTriangle, CheckCircle2 } from 'lucide-react';

// Kategoriyalar
const CATEGORIES = [
  { key: 'transport', icon: Bus, color: '#3b82f6', uz: 'Transport', ru: 'Транспорт', en: 'Transport' },
  { key: 'food', icon: UtensilsCrossed, color: '#f97316', uz: 'Ovqat', ru: 'Еда', en: 'Food' },
  { key: 'rent', icon: Home, color: '#ef4444', uz: 'Arenda/Uy', ru: 'Аренда/Дом', en: 'Rent/Home' },
  { key: 'fun', icon: Gamepad2, color: '#8b5cf6', uz: "O'yin-kulgi", ru: 'Развлечения', en: 'Entertainment' },
  { key: 'savings', icon: PiggyBank, color: '#22c55e', uz: "Jamg'arma", ru: 'Накопления', en: 'Savings' },
  { key: 'shopping', icon: ShoppingBag, color: '#ec4899', uz: 'Xarid', ru: 'Покупки', en: 'Shopping' },
  { key: 'phone', icon: Phone, color: '#06b6d4', uz: 'Telefon/Internet', ru: 'Телефон/Интернет', en: 'Phone/Internet' },
  { key: 'other', icon: Zap, color: '#64748b', uz: 'Boshqa', ru: 'Другое', en: 'Other' },
];

function safeParse(key, fallback) {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; }
  catch(e) { return fallback; }
}

export default function BudgetManager() {
  const { language } = useAuth();
  const lang = language || 'uz';

  const today = new Date().toISOString().split('T')[0];
  const currentMonth = today.slice(0, 7); // "2026-06"
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const currentDay = new Date().getDate();
  const daysLeft = daysInMonth - currentDay;

  // State
  const [budget, setBudget] = useState(() => safeParse(`flowly-budget-${currentMonth}`, {
    salary: 0,
    extraIncome: 0,
    categories: {},
    expenses: [],
    savings: 0,
    savingsGoal: 0,
  }));
  const [showSetup, setShowSetup] = useState(!budget.salary);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [setupForm, setSetupForm] = useState({
    salary: budget.salary || '',
    rent: '',
    savings: '',
    transport: '',
    food: '',
    phone: '',
    fun: '',
  });
  const [expenseForm, setExpenseForm] = useState({ amount: '', category: 'food', note: '' });

  // Save
  useEffect(() => {
    localStorage.setItem(`flowly-budget-${currentMonth}`, JSON.stringify(budget));
  }, [budget]);

  // Calculations
  const totalIncome = budget.salary + (budget.extraIncome || 0);
  const fixedExpenses = (budget.categories?.rent || 0) + (budget.categories?.phone || 0) + (budget.categories?.savings || 0);
  const flexBudget = totalIncome - fixedExpenses;
  const dailyLimit = daysInMonth > 0 ? Math.floor(flexBudget / daysInMonth) : 0;

  const todayExpenses = useMemo(() => {
    return budget.expenses?.filter(e => e.date === today) || [];
  }, [budget.expenses, today]);

  const todaySpent = todayExpenses.reduce((a, e) => a + e.amount, 0);
  const todayRemaining = dailyLimit - todaySpent;

  const monthSpent = useMemo(() => {
    return (budget.expenses || []).reduce((a, e) => a + e.amount, 0);
  }, [budget.expenses]);

  const monthRemaining = flexBudget - monthSpent;
  const monthPercent = flexBudget > 0 ? Math.round((monthSpent / flexBudget) * 100) : 0;

  // Category spending
  const categorySpending = useMemo(() => {
    const result = {};
    CATEGORIES.forEach(c => { result[c.key] = 0; });
    (budget.expenses || []).forEach(e => {
      result[e.category] = (result[e.category] || 0) + e.amount;
    });
    return result;
  }, [budget.expenses]);

  // Last 7 days spending
  const weeklyData = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const daySpent = (budget.expenses || []).filter(e => e.date === dateStr).reduce((a, e) => a + e.amount, 0);
      return { day: d.getDate(), spent: daySpent, over: daySpent > dailyLimit };
    });
  }, [budget.expenses, dailyLimit]);

  // Setup
  const handleSetup = () => {
    const salary = parseInt(setupForm.salary) || 0;
    if (!salary) return;
    setBudget({
      ...budget,
      salary,
      categories: {
        rent: parseInt(setupForm.rent) || 0,
        savings: parseInt(setupForm.savings) || 0,
        transport: parseInt(setupForm.transport) || 0,
        food: parseInt(setupForm.food) || 0,
        phone: parseInt(setupForm.phone) || 0,
        fun: parseInt(setupForm.fun) || 0,
      },
      savingsGoal: parseInt(setupForm.savings) || 0,
    });
    setShowSetup(false);
  };

  // Add expense
  const addExpense = () => {
    const amount = parseInt(expenseForm.amount);
    if (!amount || amount <= 0) return;
    const expense = {
      id: Date.now(),
      amount,
      category: expenseForm.category,
      note: expenseForm.note,
      date: today,
      time: new Date().toLocaleTimeString('uz', { hour: '2-digit', minute: '2-digit' }),
    };
    setBudget(prev => ({ ...prev, expenses: [...(prev.expenses || []), expense] }));
    setExpenseForm({ amount: '', category: 'food', note: '' });
    setShowExpenseForm(false);
    if ('vibrate' in navigator) navigator.vibrate(30);
  };

  // Add extra income
  const addIncome = (amount) => {
    if (!amount || amount <= 0) return;
    setBudget(prev => ({ ...prev, extraIncome: (prev.extraIncome || 0) + amount }));
  };

  const deleteExpense = (id) => {
    setBudget(prev => ({ ...prev, expenses: (prev.expenses || []).filter(e => e.id !== id) }));
  };

  const formatMoney = (n) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + ' mln';
    if (n >= 1000) return Math.round(n).toLocaleString('ru-RU');
    return n.toString();
  };

  const L = {
    title: lang === 'ru' ? 'Бюджет на месяц' : lang === 'en' ? 'Monthly Budget' : 'Oylik Budjet',
    desc: lang === 'ru' ? 'Управляйте зарплатой — растяните на месяц' : lang === 'en' ? 'Manage salary — stretch it for a month' : "Oylikni 1 oyga yetkazish — kunlik limitlar",
    salary: lang === 'ru' ? 'Зарплата' : lang === 'en' ? 'Salary' : 'Oylik',
    daily: lang === 'ru' ? 'Дневной лимит' : lang === 'en' ? 'Daily limit' : 'Kunlik limit',
    today: lang === 'ru' ? 'Сегодня' : lang === 'en' ? 'Today' : 'Bugun',
    spent: lang === 'ru' ? 'Потрачено' : lang === 'en' ? 'Spent' : 'Sarflandi',
    remaining: lang === 'ru' ? 'Осталось' : lang === 'en' ? 'Remaining' : 'Qoldi',
    addExpense: lang === 'ru' ? 'Расход' : lang === 'en' ? 'Expense' : 'Chiqim',
    addIncome: lang === 'ru' ? 'Доход' : lang === 'en' ? 'Income' : 'Kirim',
    setup: lang === 'ru' ? 'Настроить бюджет' : lang === 'en' ? 'Setup Budget' : 'Budjetni sozlash',
    rent: lang === 'ru' ? 'Аренда/Дом' : lang === 'en' ? 'Rent' : 'Arenda/Uy',
    savings: lang === 'ru' ? 'Накопления' : lang === 'en' ? 'Savings' : "Jamg'arma",
    transport: 'Transport',
    food: lang === 'ru' ? 'Еда' : lang === 'en' ? 'Food' : 'Ovqat',
    phone: lang === 'ru' ? 'Телефон' : lang === 'en' ? 'Phone' : 'Telefon',
    fun: lang === 'ru' ? 'Развлечения' : lang === 'en' ? 'Fun' : "O'yin-kulgi",
    daysLeft: lang === 'ru' ? 'дн. осталось' : lang === 'en' ? 'days left' : 'kun qoldi',
    overBudget: lang === 'ru' ? 'Превышение!' : lang === 'en' ? 'Over budget!' : 'Limitdan oshdi!',
    onTrack: lang === 'ru' ? 'В норме' : lang === 'en' ? 'On track' : 'Normal',
    week: lang === 'ru' ? '7 дней' : lang === 'en' ? '7 days' : '7 kun',
    categories: lang === 'ru' ? 'По категориям' : lang === 'en' ? 'By category' : 'Kategoriyalar',
    note: lang === 'ru' ? 'Заметка' : lang === 'en' ? 'Note' : 'Izoh',
    amount: lang === 'ru' ? 'Сумма' : lang === 'en' ? 'Amount' : 'Summa',
    todayExpenses: lang === 'ru' ? 'Сегодняшние расходы' : lang === 'en' ? "Today's expenses" : 'Bugungi chiqimlar',
    monthProgress: lang === 'ru' ? 'Прогресс месяца' : lang === 'en' ? 'Month progress' : 'Oy progressi',
    reset: lang === 'ru' ? 'Сбросить' : lang === 'en' ? 'Reset' : 'Qayta sozlash',
  };

  // Setup screen
  if (showSetup) {
    return (
      <div className="max-w-lg mx-auto space-y-5">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>💰 {L.setup}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{L.desc}</p>
        </div>

        <div className="card space-y-4" style={{ borderColor: 'var(--accent)' }}>
          {/* Salary */}
          <div>
            <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>💵 {L.salary} (so'm)</label>
            <input type="number" value={setupForm.salary} onChange={e => setSetupForm({ ...setupForm, salary: e.target.value })}
              placeholder="5000000" className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 text-lg font-bold"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          </div>

          <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
            <p className="text-xs font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              📋 {lang === 'ru' ? 'Фиксированные расходы (в месяц):' : 'Doimiy chiqimlar (oylik):'}
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] mb-1 block" style={{ color: 'var(--text-secondary)' }}>🏠 {L.rent}</label>
                <input type="number" value={setupForm.rent} onChange={e => setSetupForm({ ...setupForm, rent: e.target.value })}
                  placeholder="1000000" className="w-full px-3 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label className="text-[10px] mb-1 block" style={{ color: 'var(--text-secondary)' }}>🐷 {L.savings}</label>
                <input type="number" value={setupForm.savings} onChange={e => setSetupForm({ ...setupForm, savings: e.target.value })}
                  placeholder="500000" className="w-full px-3 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label className="text-[10px] mb-1 block" style={{ color: 'var(--text-secondary)' }}>🚌 {L.transport} (oylik)</label>
                <input type="number" value={setupForm.transport} onChange={e => setSetupForm({ ...setupForm, transport: e.target.value })}
                  placeholder="200000" className="w-full px-3 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              </div>
              <div>
                <label className="text-[10px] mb-1 block" style={{ color: 'var(--text-secondary)' }}>📱 {L.phone}</label>
                <input type="number" value={setupForm.phone} onChange={e => setSetupForm({ ...setupForm, phone: e.target.value })}
                  placeholder="50000" className="w-full px-3 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
              </div>
            </div>
          </div>

          {/* Preview */}
          {setupForm.salary && (
            <div className="p-4 rounded-xl space-y-2" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}>
              <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>📊 {lang === 'ru' ? 'Расчёт:' : 'Hisob:'}</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <span style={{ color: 'var(--text-secondary)' }}>{L.salary}:</span>
                <span className="font-bold text-right" style={{ color: 'var(--text-primary)' }}>{formatMoney(parseInt(setupForm.salary) || 0)} so'm</span>
                <span style={{ color: 'var(--text-secondary)' }}>– Doimiy:</span>
                <span className="font-bold text-right text-red-500">−{formatMoney((parseInt(setupForm.rent) || 0) + (parseInt(setupForm.phone) || 0) + (parseInt(setupForm.savings) || 0))}</span>
                <span style={{ color: 'var(--text-secondary)' }}>= Erkin pul:</span>
                <span className="font-bold text-right" style={{ color: 'var(--accent)' }}>{formatMoney((parseInt(setupForm.salary) || 0) - (parseInt(setupForm.rent) || 0) - (parseInt(setupForm.phone) || 0) - (parseInt(setupForm.savings) || 0))}</span>
                <span style={{ color: 'var(--text-secondary)' }}>÷ {daysInMonth} kun =</span>
                <span className="font-bold text-right text-green-500">{formatMoney(Math.floor(((parseInt(setupForm.salary) || 0) - (parseInt(setupForm.rent) || 0) - (parseInt(setupForm.phone) || 0) - (parseInt(setupForm.savings) || 0)) / daysInMonth))} /kun</span>
              </div>
            </div>
          )}

          <button onClick={handleSetup} className="btn-primary w-full text-lg py-3.5">{L.setup}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>💰 {L.title}</h1>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{daysLeft} {L.daysLeft} • {formatMoney(totalIncome)} so'm</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowExpenseForm(!showExpenseForm)} className="btn-primary flex items-center gap-1.5 text-sm">
            <Plus size={15} /> {L.addExpense}
          </button>
          <button onClick={() => setShowSetup(true)} className="p-2.5 rounded-xl" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}>
            <Edit2 size={15} style={{ color: 'var(--text-secondary)' }} />
          </button>
        </div>
      </div>

      {/* Today Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card text-center" style={{ padding: '1rem' }}>
          <p className="text-[9px] mb-1" style={{ color: 'var(--text-secondary)' }}>{L.daily}</p>
          <p className="text-xl font-bold" style={{ color: 'var(--accent)' }}>{formatMoney(dailyLimit)}</p>
          <p className="text-[8px]" style={{ color: 'var(--text-secondary)' }}>so'm/kun</p>
        </div>
        <div className="card text-center" style={{ padding: '1rem' }}>
          <p className="text-[9px] mb-1" style={{ color: 'var(--text-secondary)' }}>{L.today} {L.spent}</p>
          <p className={`text-xl font-bold ${todaySpent > dailyLimit ? 'text-red-500' : 'text-orange-500'}`}>{formatMoney(todaySpent)}</p>
          <p className="text-[8px]" style={{ color: 'var(--text-secondary)' }}>so'm</p>
        </div>
        <div className="card text-center" style={{ padding: '1rem' }}>
          <p className="text-[9px] mb-1" style={{ color: 'var(--text-secondary)' }}>{L.remaining}</p>
          <p className={`text-xl font-bold ${todayRemaining < 0 ? 'text-red-500' : 'text-green-500'}`}>{formatMoney(Math.abs(todayRemaining))}</p>
          <p className="text-[8px]" style={{ color: todayRemaining < 0 ? '#ef4444' : 'var(--text-secondary)' }}>{todayRemaining < 0 ? L.overBudget : L.onTrack}</p>
        </div>
      </div>

      {/* Warning if over budget */}
      {todayRemaining < 0 && (
        <div className="flex items-center gap-2 p-3 rounded-xl animate-in" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}>
          <AlertTriangle size={16} className="text-red-500" />
          <span className="text-xs font-medium text-red-600 dark:text-red-400">
            {lang === 'ru' ? `Сегодня превышение на ${formatMoney(Math.abs(todayRemaining))} so'm!` : `Bugun ${formatMoney(Math.abs(todayRemaining))} so'm oshib ketdi!`}
          </span>
        </div>
      )}

      {/* Add Expense Form */}
      {showExpenseForm && (
        <div className="card animate-in space-y-3" style={{ borderColor: 'var(--accent)' }}>
          <input type="number" value={expenseForm.amount} onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
            placeholder={L.amount} onKeyDown={e => e.key === 'Enter' && addExpense()}
            className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 text-lg font-bold"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} autoFocus />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.filter(c => c.key !== 'savings').map(cat => (
              <button key={cat.key} onClick={() => setExpenseForm({ ...expenseForm, category: cat.key })}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${expenseForm.category === cat.key ? 'text-white shadow-lg' : ''}`}
                style={expenseForm.category === cat.key ? { background: cat.color } : { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
                <cat.icon size={13} /> {cat[lang]}
              </button>
            ))}
          </div>
          <input type="text" value={expenseForm.note} onChange={e => setExpenseForm({ ...expenseForm, note: e.target.value })}
            placeholder={L.note + " (ixtiyoriy)"} onKeyDown={e => e.key === 'Enter' && addExpense()}
            className="w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <button onClick={addExpense} className="btn-primary w-full">{L.addExpense}</button>
        </div>
      )}

      {/* Month Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{L.monthProgress}</h3>
          <span className="text-xs font-bold" style={{ color: monthPercent > 80 ? '#ef4444' : monthPercent > 60 ? '#eab308' : 'var(--accent)' }}>{monthPercent}%</span>
        </div>
        <div className="w-full h-3 rounded-full mb-2" style={{ background: 'var(--bg-secondary)' }}>
          <div className="h-3 rounded-full transition-all" style={{ width: `${Math.min(monthPercent, 100)}%`, background: monthPercent > 80 ? '#ef4444' : monthPercent > 60 ? '#eab308' : '#22c55e' }} />
        </div>
        <div className="flex justify-between text-[10px]">
          <span style={{ color: 'var(--text-secondary)' }}>{L.spent}: {formatMoney(monthSpent)}</span>
          <span style={{ color: monthRemaining < 0 ? '#ef4444' : '#22c55e' }}>{L.remaining}: {formatMoney(Math.abs(monthRemaining))} {monthRemaining < 0 ? '⚠️' : ''}</span>
        </div>
      </div>

      {/* Weekly chart */}
      <div className="card">
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>📊 {L.week}</h3>
        <div className="flex items-end justify-between gap-1" style={{ height: '80px' }}>
          {weeklyData.map((d, i) => {
            const maxH = Math.max(...weeklyData.map(x => x.spent), dailyLimit);
            const h = maxH > 0 ? (d.spent / maxH) * 70 : 0;
            const limitH = maxH > 0 ? (dailyLimit / maxH) * 70 : 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative" style={{ height: '70px' }}>
                  {/* Limit line */}
                  <div className="absolute w-full border-t border-dashed" style={{ bottom: `${limitH}px`, borderColor: 'rgba(59,130,246,0.3)' }} />
                  {/* Bar */}
                  <div className={`absolute bottom-0 w-full rounded-t-md transition-all ${d.over ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ height: `${Math.max(h, 2)}px`, opacity: d.spent > 0 ? 1 : 0.2 }} />
                </div>
                <span className="text-[8px] font-medium" style={{ color: i === 6 ? 'var(--accent)' : 'var(--text-secondary)' }}>{d.day}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-[8px]" style={{ color: 'var(--text-secondary)' }}>Normal</span></div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div><span className="text-[8px]" style={{ color: 'var(--text-secondary)' }}>{L.overBudget}</span></div>
          <div className="flex items-center gap-1"><div className="w-3 h-0 border-t border-dashed border-blue-400"></div><span className="text-[8px]" style={{ color: 'var(--text-secondary)' }}>Limit</span></div>
        </div>
      </div>

      {/* Categories breakdown */}
      <div className="card">
        <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>📂 {L.categories}</h3>
        <div className="space-y-2.5">
          {CATEGORIES.filter(c => categorySpending[c.key] > 0 || budget.categories?.[c.key] > 0).map(cat => {
            const spent = categorySpending[cat.key] || 0;
            const limit = budget.categories?.[cat.key] || 0;
            const pct = limit > 0 ? Math.round((spent / limit) * 100) : 0;
            const Icon = cat.icon;
            return (
              <div key={cat.key} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${cat.color}15` }}>
                  <Icon size={14} style={{ color: cat.color }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] font-medium" style={{ color: 'var(--text-primary)' }}>{cat[lang]}</span>
                    <span className="text-[9px] font-bold" style={{ color: pct > 100 ? '#ef4444' : cat.color }}>{formatMoney(spent)}{limit > 0 ? ` / ${formatMoney(limit)}` : ''}</span>
                  </div>
                  {limit > 0 && (
                    <div className="h-1.5 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                      <div className="h-1.5 rounded-full transition-all" style={{ width: `${Math.min(pct, 100)}%`, background: pct > 100 ? '#ef4444' : cat.color }} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's expenses */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>🧾 {L.todayExpenses}</h3>
          <span className="text-xs font-bold" style={{ color: todaySpent > dailyLimit ? '#ef4444' : 'var(--accent)' }}>{formatMoney(todaySpent)} so'm</span>
        </div>
        {todayExpenses.length === 0 ? (
          <p className="text-center text-xs py-4" style={{ color: 'var(--text-secondary)' }}>
            {lang === 'ru' ? 'Нет расходов' : "Bugun chiqim yo'q"} ✓
          </p>
        ) : (
          <div className="space-y-1.5">
            {todayExpenses.map(e => {
              const cat = CATEGORIES.find(c => c.key === e.category);
              const Icon = cat?.icon || Zap;
              return (
                <div key={e.id} className="flex items-center gap-3 p-2 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${cat?.color || '#64748b'}15` }}>
                    <Icon size={13} style={{ color: cat?.color || '#64748b' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{e.note || cat?.[lang] || e.category}</p>
                    <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{e.time}</p>
                  </div>
                  <span className="text-xs font-bold text-red-500">−{formatMoney(e.amount)}</span>
                  <button onClick={() => deleteExpense(e.id)} className="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20">
                    <Trash2 size={12} className="text-red-400" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Savings progress */}
      {budget.savingsGoal > 0 && (
        <div className="card" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.03), rgba(16,185,129,0.05))' }}>
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank size={16} className="text-green-500" />
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>🐷 {L.savings}</h3>
          </div>
          <p className="text-2xl font-bold text-green-500">{formatMoney(budget.savingsGoal)} so'm</p>
          <p className="text-[10px] mt-1" style={{ color: 'var(--text-secondary)' }}>
            {lang === 'ru' ? 'Отложено в этом месяце' : "Bu oyda yig'ildi"} ✓
          </p>
        </div>
      )}

      {/* Add income button */}
      <div className="card flex items-center gap-3" style={{ padding: '0.75rem 1rem' }}>
        <TrendingUp size={16} className="text-green-500" />
        <span className="text-xs flex-1" style={{ color: 'var(--text-primary)' }}>
          {lang === 'ru' ? 'Получили доп. доход?' : "Qo'shimcha pul kirdimi?"}
        </span>
        <button onClick={() => {
          const amount = prompt(lang === 'ru' ? 'Сумма дополнительного дохода:' : "Qo'shimcha kirim summasi:", '');
          if (amount) addIncome(parseInt(amount));
        }} className="px-3 py-1.5 rounded-xl text-xs font-medium bg-green-500 text-white">+ {L.addIncome}</button>
      </div>
    </div>
  );
}
