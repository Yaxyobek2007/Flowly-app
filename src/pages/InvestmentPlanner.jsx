import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Plus, Trash2, Target, TrendingUp, Calendar, ChevronDown, Check, ArrowUpRight } from 'lucide-react';

// Valyuta kurslari (approximate)
const RATES = {
  "so'm": 1,
  "$": 12850,
  "€": 14000,
  "£": 16300,
  "₽": 140,
};

const CURRENCY_SYMBOLS = { "so'm": "so'm", "$": "$", "€": "€", "£": "£", "₽": "₽" };

function convertCurrency(amount, from, to) {
  if (from === to) return amount;
  const inSom = amount * RATES[from];
  return Math.round(inSom / RATES[to]);
}

function formatMoney(n, currency) {
  if (currency === "so'm") {
    if (n >= 1000000000) return (n / 1000000000).toFixed(1) + ' mlrd';
    if (n >= 1000000) return (n / 1000000).toFixed(1) + ' mln';
    if (n >= 1000) return Math.round(n).toLocaleString('ru-RU');
    return n.toString();
  }
  if (n >= 1000000) return (n / 1000000).toFixed(2) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toLocaleString('en-US');
}

export default function InvestmentPlanner() {
  const { language } = useAuth();
  const lang = language || 'uz';

  const [goals, setGoals] = useState(() => {
    const s = localStorage.getItem('flowly-invest');
    return s ? JSON.parse(s) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', icon: '🚗', targetAmount: '', currency: "so'm",
    period: '1y', saved: 0, startSmall: true,
  });
  const [displayCurrency, setDisplayCurrency] = useState("so'm");
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [expandedGoal, setExpandedGoal] = useState(null);

  useEffect(() => {
    localStorage.setItem('flowly-invest', JSON.stringify(goals));
  }, [goals]);

  const icons = ['🚗', '🏠', '💻', '📱', '✈️', '🎓', '💍', '🏋️', '📚', '🎯', '💰', '🏢', '👗', '🎮', '⌚', '🏍️'];
  const periods = [
    { key: '3m', days: 90, uz: '3 oy', ru: '3 мес', en: '3 months' },
    { key: '6m', days: 180, uz: '6 oy', ru: '6 мес', en: '6 months' },
    { key: '1y', days: 365, uz: '1 yil', ru: '1 год', en: '1 year' },
    { key: '2y', days: 730, uz: '2 yil', ru: '2 года', en: '2 years' },
    { key: '3y', days: 1095, uz: '3 yil', ru: '3 года', en: '3 years' },
    { key: '5y', days: 1825, uz: '5 yil', ru: '5 лет', en: '5 years' },
  ];

  const currencies = Object.keys(RATES);

  // Progressive daily plan: starts small, increases weekly
  function generateDailyPlan(totalAmount, totalDays, startSmall) {
    if (!startSmall) {
      // Equal distribution
      const daily = Math.ceil(totalAmount / totalDays);
      return Array.from({ length: totalDays }, (_, i) => ({
        day: i + 1,
        amount: daily,
        cumulative: daily * (i + 1),
      }));
    }

    // Progressive: start at 50% of average, increase by ~7% each week
    const avgDaily = totalAmount / totalDays;
    const startAmount = avgDaily * 0.5;
    const weeks = Math.ceil(totalDays / 7);
    
    // Calculate growth factor to reach target
    let plan = [];
    let cumulative = 0;
    let weeklyBase = startAmount;
    const growthFactor = Math.pow((avgDaily * 1.5) / startAmount, 1 / Math.max(weeks - 1, 1));

    for (let day = 1; day <= totalDays; day++) {
      const week = Math.floor((day - 1) / 7);
      const dailyAmount = Math.round(startAmount * Math.pow(growthFactor, week));
      cumulative += dailyAmount;
      plan.push({ day, amount: dailyAmount, cumulative });
    }

    // Adjust last day to hit exact target
    const diff = totalAmount - cumulative;
    if (plan.length > 0) {
      plan[plan.length - 1].amount += diff;
      plan[plan.length - 1].cumulative = totalAmount;
    }

    return plan;
  }

  const handleAdd = () => {
    if (!form.title || !form.targetAmount) return;
    const target = parseFloat(form.targetAmount);
    const saved = parseFloat(form.saved) || 0;
    const remaining = target - saved;
    const periodObj = periods.find(p => p.key === form.period);
    const totalDays = periodObj?.days || 365;

    const dailyPlan = generateDailyPlan(remaining, totalDays, form.startSmall);

    const newGoal = {
      id: Date.now(),
      title: form.title,
      icon: form.icon,
      targetAmount: target,
      currency: form.currency,
      period: form.period,
      totalDays,
      saved,
      remaining,
      startSmall: form.startSmall,
      dailyPlan,
      deposits: [], // { date, amount }
      createdAt: new Date().toISOString().split('T')[0],
    };

    setGoals([...goals, newGoal]);
    setForm({ title: '', icon: '🚗', targetAmount: '', currency: "so'm", period: '1y', saved: 0, startSmall: true });
    setShowForm(false);
  };

  const addDeposit = (goalId, amount) => {
    if (!amount || amount <= 0) return;
    setGoals(goals.map(g => {
      if (g.id !== goalId) return g;
      const newDeposit = { date: new Date().toISOString().split('T')[0], amount: parseFloat(amount) };
      const deposits = [...(g.deposits || []), newDeposit];
      const totalDeposited = deposits.reduce((a, d) => a + d.amount, 0);
      const saved = (g.saved || 0) + parseFloat(amount);
      return { ...g, deposits, saved, remaining: Math.max(0, g.targetAmount - saved) };
    }));
  };

  const progress = (g) => Math.min(Math.round(((g.saved || 0) / g.targetAmount) * 100), 100);

  const getCurrentDay = (g) => {
    const start = new Date(g.createdAt);
    const now = new Date();
    return Math.min(Math.max(Math.floor((now - start) / 86400000) + 1, 1), g.totalDays);
  };

  const L = {
    title: lang === 'ru' ? 'Инвестиции и накопления' : lang === 'en' ? 'Savings Goals' : 'Yig\'ish va Investitsiya',
    desc: lang === 'ru' ? 'Ставьте цели и копите пошагово' : lang === 'en' ? 'Set goals and save step by step' : 'Maqsad qo\'ying — kunlik reja avtomatik',
    add: lang === 'ru' ? 'Новая цель' : lang === 'en' ? 'New Goal' : 'Yangi maqsad',
    name: lang === 'ru' ? 'Что копите?' : lang === 'en' ? 'What are you saving for?' : 'Nima uchun yig\'asz?',
    price: lang === 'ru' ? 'Целевая сумма' : lang === 'en' ? 'Target amount' : 'Maqsad summa',
    saved: lang === 'ru' ? 'Уже накоплено' : lang === 'en' ? 'Already saved' : 'Allaqachon bor',
    period: lang === 'ru' ? 'Срок' : lang === 'en' ? 'Period' : 'Muddat',
    startSmall: lang === 'ru' ? 'Начать с малого (увеличивать)' : lang === 'en' ? 'Start small (progressive)' : 'Ozroqdan boshlash (oshib boradi)',
    equalDaily: lang === 'ru' ? 'Равными частями' : lang === 'en' ? 'Equal daily' : 'Teng bo\'lib',
    daily: lang === 'ru' ? 'день' : lang === 'en' ? 'day' : 'kun',
    today: lang === 'ru' ? 'Сегодня нужно' : lang === 'en' ? 'Today\'s target' : 'Bugun qo\'shish',
    addMoney: lang === 'ru' ? 'Внести' : lang === 'en' ? 'Deposit' : 'Qo\'shish',
    schedule: lang === 'ru' ? 'График по дням' : lang === 'en' ? 'Daily schedule' : 'Kunlik jadval',
    deposited: lang === 'ru' ? 'Внесено' : lang === 'en' ? 'Deposited' : 'Qo\'shildi',
    remaining: lang === 'ru' ? 'Осталось' : lang === 'en' ? 'Remaining' : 'Qoldi',
    currency: lang === 'ru' ? 'Валюта' : lang === 'en' ? 'Currency' : 'Valyuta',
    empty: lang === 'ru' ? 'Поставьте цель и начните копить' : lang === 'en' ? 'Set a goal and start saving' : 'Maqsad qo\'ying va yig\'ishni boshlang',
    week: lang === 'ru' ? 'нед' : lang === 'en' ? 'wk' : 'hafta',
    done: lang === 'ru' ? 'Цель достигнута!' : lang === 'en' ? 'Goal reached!' : 'Maqsadga erishdingiz!',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>💎 {L.title}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{L.desc}</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Display Currency Selector */}
          <div className="relative">
            <button onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
              {CURRENCY_SYMBOLS[displayCurrency]} <ChevronDown size={14} />
            </button>
            {showCurrencyMenu && (
              <div className="absolute right-0 top-full mt-1 w-32 rounded-xl shadow-2xl overflow-hidden z-50 animate-in" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                {currencies.map(c => (
                  <button key={c} onClick={() => { setDisplayCurrency(c); setShowCurrencyMenu(false); }}
                    className="w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/10"
                    style={{ color: 'var(--text-primary)' }}>
                    <span>{CURRENCY_SYMBOLS[c]}</span>
                    {displayCurrency === c && <Check size={14} className="text-blue-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button className="btn-primary flex items-center gap-2 text-sm" onClick={() => setShowForm(!showForm)}>
            <Plus size={16} />{L.add}
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="card animate-in space-y-4" style={{ borderColor: 'var(--accent)' }}>
          {/* Icons */}
          <div className="flex flex-wrap gap-1.5">
            {icons.map(ic => (
              <button key={ic} onClick={() => setForm({ ...form, icon: ic })}
                className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center transition-all ${form.icon === ic ? 'ring-2 ring-blue-500 scale-110 shadow-lg' : ''}`}
                style={{ background: form.icon !== ic ? 'var(--bg-secondary)' : undefined }}>
                {ic}
              </button>
            ))}
          </div>

          {/* Title */}
          <input type="text" placeholder={L.name} value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />

          {/* Amount + Currency */}
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2 relative">
              <input type="number" placeholder={L.price} value={form.targetAmount}
                onChange={e => setForm({ ...form, targetAmount: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
            </div>
            <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}
              className="px-3 py-3 rounded-xl border text-sm font-medium outline-none"
              style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              {currencies.map(c => <option key={c} value={c}>{CURRENCY_SYMBOLS[c]}</option>)}
            </select>
          </div>

          {/* Already saved */}
          <input type="number" placeholder={L.saved} value={form.saved || ''}
            onChange={e => setForm({ ...form, saved: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />

          {/* Period */}
          <div>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>{L.period}:</p>
            <div className="flex flex-wrap gap-2">
              {periods.map(p => (
                <button key={p.key} onClick={() => setForm({ ...form, period: p.key })}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${form.period === p.key ? 'bg-blue-500 text-white shadow-lg' : ''}`}
                  style={form.period !== p.key ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' } : {}}>
                  {p[lang]}
                </button>
              ))}
            </div>
          </div>

          {/* Start small toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{form.startSmall ? L.startSmall : L.equalDaily}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                {form.startSmall
                  ? (lang === 'ru' ? '1-hafta kam, keyingi haftalar ko\'proq' : 'Birinchi hafta kam — keyingilari oshib boradi')
                  : (lang === 'ru' ? 'Каждый день одинаковая сумма' : 'Har kuni bir xil summa')}
              </p>
            </div>
            <button onClick={() => setForm({ ...form, startSmall: !form.startSmall })}
              className={`relative w-12 h-6 rounded-full transition-all ${form.startSmall ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
              <div className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all"
                style={{ left: form.startSmall ? '26px' : '2px' }} />
            </button>
          </div>

          {/* Preview */}
          {form.targetAmount && (
            <div className="p-4 rounded-xl space-y-2" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}>
              <p className="text-xs font-medium text-center" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'ru' ? 'Предварительный расчёт' : lang === 'en' ? 'Preview' : 'Oldindan hisob'}
              </p>
              {(() => {
                const target = parseFloat(form.targetAmount) || 0;
                const saved = parseFloat(form.saved) || 0;
                const remaining = target - saved;
                const periodObj = periods.find(p => p.key === form.period);
                const days = periodObj?.days || 365;
                const dailyAvg = Math.ceil(remaining / days);
                const weeklyAvg = Math.ceil(remaining / (days / 7));
                const monthlyAvg = Math.ceil(remaining / (days / 30));
                const startDaily = form.startSmall ? Math.round(dailyAvg * 0.5) : dailyAvg;
                return (
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    <div className="text-center">
                      <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>{formatMoney(startDaily, form.currency)}</p>
                      <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{form.currency}/{L.daily} {form.startSmall ? '(1-hafta)' : ''}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-purple-500">{formatMoney(weeklyAvg, form.currency)}</p>
                      <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{form.currency}/{L.week}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-green-500">{formatMoney(monthlyAvg, form.currency)}</p>
                      <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{form.currency}/oy</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          <button className="btn-primary w-full" onClick={handleAdd}>{L.add}</button>
        </div>
      )}

      {/* Empty state */}
      {goals.length === 0 && !showForm && (
        <div className="card text-center py-16">
          <Target size={48} className="text-blue-300 mx-auto mb-4" />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{L.empty}</p>
          <button onClick={() => setShowForm(true)} className="mt-4 btn-primary">{L.add}</button>
        </div>
      )}

      {/* Goals List */}
      <div className="space-y-4">
        {goals.map((g, idx) => {
          const pct = progress(g);
          const done = pct >= 100;
          const curDay = getCurrentDay(g);
          const todayPlan = g.dailyPlan?.[curDay - 1];
          const isExpanded = expandedGoal === g.id;

          // Convert for display
          const displayTarget = convertCurrency(g.targetAmount, g.currency, displayCurrency);
          const displaySaved = convertCurrency(g.saved || 0, g.currency, displayCurrency);
          const displayTodayAmount = todayPlan ? convertCurrency(todayPlan.amount, g.currency, displayCurrency) : 0;

          return (
            <div key={g.id} className={`card animate-in ${done ? 'ring-2 ring-green-500' : ''}`} style={{ animationDelay: `${idx * 50}ms` }}>
              {/* Header */}
              <div className="flex items-center gap-4 mb-3">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${done ? 'bg-green-100 dark:bg-green-900/20' : 'bg-blue-50 dark:bg-blue-900/20'}`}>
                  {done ? '🏆' : g.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate" style={{ color: 'var(--text-primary)' }}>{g.title}</h3>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    {formatMoney(displayTarget, displayCurrency)} {CURRENCY_SYMBOLS[displayCurrency]} • {periods.find(p => p.key === g.period)?.[lang]}
                    {g.currency !== displayCurrency && <span className="opacity-50"> ({formatMoney(g.targetAmount, g.currency)} {g.currency})</span>}
                  </p>
                </div>
                <button onClick={() => setGoals(goals.filter(x => x.id !== g.id))}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0">
                  <Trash2 size={14} className="text-red-400" />
                </button>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-3 mb-3">
                <div className="flex-1 h-3 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                  <div className={`h-3 rounded-full transition-all duration-500 ${done ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}
                    style={{ width: `${pct}%` }} />
                </div>
                <span className={`text-sm font-bold ${done ? 'text-green-500' : ''}`} style={!done ? { color: 'var(--accent)' } : {}}>{pct}%</span>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-3">
                <div className="p-2.5 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                  <p className="text-xs font-bold text-green-500">{formatMoney(displaySaved, displayCurrency)}</p>
                  <p className="text-[8px]" style={{ color: 'var(--text-secondary)' }}>{L.deposited}</p>
                </div>
                <div className="p-2.5 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                  <p className="text-xs font-bold text-orange-500">{formatMoney(convertCurrency(g.remaining || 0, g.currency, displayCurrency), displayCurrency)}</p>
                  <p className="text-[8px]" style={{ color: 'var(--text-secondary)' }}>{L.remaining}</p>
                </div>
                <div className="p-2.5 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                  <p className="text-xs font-bold" style={{ color: 'var(--accent)' }}>{curDay}/{g.totalDays}</p>
                  <p className="text-[8px]" style={{ color: 'var(--text-secondary)' }}>{L.daily}</p>
                </div>
              </div>

              {/* Today's target + deposit */}
              {!done && todayPlan && (
                <div className="p-3 rounded-xl flex items-center gap-3 mb-3" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.1)' }}>
                  <div className="flex-1">
                    <p className="text-[10px] font-medium" style={{ color: 'var(--text-secondary)' }}>{L.today}:</p>
                    <p className="text-lg font-bold" style={{ color: 'var(--accent)' }}>
                      {formatMoney(displayTodayAmount, displayCurrency)} {CURRENCY_SYMBOLS[displayCurrency]}
                    </p>
                  </div>
                  <button
                    onClick={() => addDeposit(g.id, todayPlan.amount)}
                    className="px-4 py-2.5 rounded-xl bg-green-500 text-white font-bold text-sm flex items-center gap-1.5 hover:bg-green-600 transition-colors active:scale-95">
                    <Check size={14} /> {L.addMoney}
                  </button>
                </div>
              )}

              {done && <p className="text-center font-bold text-green-500 py-3 text-lg">🎉 {L.done}</p>}

              {/* Expand/Collapse daily schedule */}
              {!done && g.dailyPlan && (
                <button onClick={() => setExpandedGoal(isExpanded ? null : g.id)}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-xl transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/10"
                  style={{ color: 'var(--accent)' }}>
                  <Calendar size={14} />
                  {L.schedule}
                  <ChevronDown size={14} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
              )}

              {/* Daily Schedule Table */}
              {isExpanded && g.dailyPlan && (
                <div className="mt-3 max-h-[300px] overflow-y-auto rounded-xl border scrollbar-hide" style={{ borderColor: 'var(--border)' }}>
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ background: 'var(--bg-secondary)' }}>
                        <th className="py-2 px-3 text-left font-medium" style={{ color: 'var(--text-secondary)' }}>{L.daily}</th>
                        <th className="py-2 px-3 text-right font-medium" style={{ color: 'var(--text-secondary)' }}>{CURRENCY_SYMBOLS[displayCurrency]}</th>
                        <th className="py-2 px-3 text-right font-medium" style={{ color: 'var(--text-secondary)' }}>Jami</th>
                        <th className="py-2 px-3 text-center font-medium" style={{ color: 'var(--text-secondary)' }}>✓</th>
                      </tr>
                    </thead>
                    <tbody>
                      {g.dailyPlan.slice(0, Math.min(curDay + 14, g.dailyPlan.length)).map((p, i) => {
                        const isToday = i + 1 === curDay;
                        const isPast = i + 1 < curDay;
                        const deposited = (g.deposits || []).find(d => {
                          const startDate = new Date(g.createdAt);
                          startDate.setDate(startDate.getDate() + i);
                          return d.date === startDate.toISOString().split('T')[0];
                        });
                        const displayAmount = convertCurrency(p.amount, g.currency, displayCurrency);
                        const displayCumulative = convertCurrency(p.cumulative, g.currency, displayCurrency);

                        return (
                          <tr key={i}
                            className={`border-t ${isToday ? 'ring-1 ring-inset ring-blue-500/30' : ''}`}
                            style={{ borderColor: 'var(--border)', background: isToday ? 'rgba(59,130,246,0.05)' : isPast ? 'rgba(34,197,94,0.02)' : undefined }}>
                            <td className="py-2 px-3" style={{ color: 'var(--text-primary)' }}>
                              <span className={`font-medium ${isToday ? 'text-blue-500' : ''}`}>
                                {isToday ? '▶ ' : ''}{i + 1}-{L.daily}
                              </span>
                              {i % 7 === 0 && <span className="ml-1 text-[8px] px-1 rounded bg-gray-100 dark:bg-gray-800" style={{ color: 'var(--text-secondary)' }}>{Math.floor(i / 7) + 1}-{L.week}</span>}
                            </td>
                            <td className="py-2 px-3 text-right font-medium" style={{ color: isToday ? 'var(--accent)' : 'var(--text-primary)' }}>
                              {formatMoney(displayAmount, displayCurrency)}
                            </td>
                            <td className="py-2 px-3 text-right" style={{ color: 'var(--text-secondary)' }}>
                              {formatMoney(displayCumulative, displayCurrency)}
                            </td>
                            <td className="py-2 px-3 text-center">
                              {isPast ? (deposited ? '✅' : '⚠️') : isToday ? '📍' : '○'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {g.dailyPlan.length > curDay + 14 && (
                    <p className="text-center py-2 text-[10px]" style={{ color: 'var(--text-secondary)' }}>... +{g.dailyPlan.length - curDay - 14} {lang === 'ru' ? 'дней' : 'kun'}</p>
                  )}
                </div>
              )}

              {/* Recent deposits */}
              {(g.deposits || []).length > 0 && (
                <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
                  <p className="text-[10px] font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    {lang === 'ru' ? 'Последние взносы' : lang === 'en' ? 'Recent deposits' : 'Oxirgi qo\'shimchalar'}:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {(g.deposits || []).slice(-7).map((d, i) => (
                      <span key={i} className="text-[9px] px-2 py-1 rounded-lg font-medium" style={{ background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>
                        {d.date.slice(5)} +{formatMoney(convertCurrency(d.amount, g.currency, displayCurrency), displayCurrency)}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
