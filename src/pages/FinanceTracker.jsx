import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { DollarSign, Plus, Trash2, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function FinanceTracker() {
  const { language } = useAuth();
  const lang = language || 'uz';

  const [transactions, setTransactions] = useState(() => {
    try { const s = localStorage.getItem('flowly-finance'); return s ? JSON.parse(s) : []; }
    catch(e) { return []; }
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: 'income', amount: '', category: '', note: '' });

  useEffect(() => {
    localStorage.setItem('flowly-finance', JSON.stringify(transactions));
  }, [transactions]);

  const addTx = () => {
    if (!form.amount) return;
    setTransactions([
      { id: Date.now(), ...form, amount: parseFloat(form.amount), date: new Date().toISOString().split('T')[0] },
      ...transactions
    ]);
    setForm({ type: 'income', amount: '', category: '', note: '' });
    setShowForm(false);
  };

  const income = transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0);
  const expense = transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0);
  const balance = income - expense;

  const L = {
    title: lang === 'ru' ? 'Финансы' : lang === 'en' ? 'Finance' : 'Moliya',
    income: lang === 'ru' ? 'Доход' : lang === 'en' ? 'Income' : 'Kirim',
    expense: lang === 'ru' ? 'Расход' : lang === 'en' ? 'Expense' : 'Chiqim',
    balance: lang === 'ru' ? 'Баланс' : lang === 'en' ? 'Balance' : 'Balans',
    add: lang === 'ru' ? 'Добавить' : lang === 'en' ? 'Add' : "Qo'shish",
    amount: lang === 'ru' ? 'Сумма' : lang === 'en' ? 'Amount' : 'Summa',
    note: lang === 'ru' ? 'Заметка' : lang === 'en' ? 'Note' : 'Izoh',
    empty: lang === 'ru' ? 'Нет транзакций' : lang === 'en' ? 'No transactions' : "Tranzaksiya yo'q",
  };

  const cats = lang === 'ru'
    ? ['Зарплата', 'Еда', 'Транспорт', 'Развлечения', 'Учёба', 'Другое']
    : lang === 'en'
    ? ['Salary', 'Food', 'Transport', 'Fun', 'Education', 'Other']
    : ['Maosh', 'Ovqat', 'Transport', "Ko'ngil", "Ta'lim", 'Boshqa'];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>💰 {L.title}</h1>
        <button className="btn-primary flex items-center gap-2" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} /> {L.add}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="card text-center" style={{ padding: '1rem' }}>
          <ArrowUpRight size={18} className="text-green-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-green-500">{income.toLocaleString()}</p>
          <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{L.income}</p>
        </div>
        <div className="card text-center" style={{ padding: '1rem' }}>
          <ArrowDownRight size={18} className="text-red-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-red-500">{expense.toLocaleString()}</p>
          <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{L.expense}</p>
        </div>
        <div className="card text-center" style={{ padding: '1rem' }}>
          <DollarSign size={18} className={`mx-auto mb-1 ${balance >= 0 ? 'text-blue-500' : 'text-red-500'}`} />
          <p className={`text-lg font-bold ${balance >= 0 ? 'text-blue-500' : 'text-red-500'}`}>{balance.toLocaleString()}</p>
          <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{L.balance}</p>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <div className="card animate-in space-y-3" style={{ borderColor: 'var(--accent)' }}>
          {/* Type selector */}
          <div className="flex gap-2">
            {['income', 'expense'].map(type => (
              <button key={type} onClick={() => setForm({ ...form, type })}
                className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  form.type === type
                    ? (type === 'income' ? 'bg-green-500 text-white' : 'bg-red-500 text-white')
                    : ''
                }`}
                style={form.type !== type ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' } : {}}>
                {type === 'income' ? L.income : L.expense}
              </button>
            ))}
          </div>

          {/* Amount */}
          <input type="number" placeholder={L.amount} value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {cats.map(c => (
              <button key={c} onClick={() => setForm({ ...form, category: c })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${form.category === c ? 'bg-blue-500 text-white' : ''}`}
                style={form.category !== c ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' } : {}}>
                {c}
              </button>
            ))}
          </div>

          {/* Note */}
          <input type="text" placeholder={L.note} value={form.note}
            onChange={e => setForm({ ...form, note: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />

          <button className="btn-primary w-full" onClick={addTx}>{L.add}</button>
        </div>
      )}

      {/* Transactions List */}
      {transactions.length === 0 && !showForm ? (
        <div className="card text-center py-12">
          <DollarSign size={40} className="text-blue-300 mx-auto mb-3" />
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{L.empty}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {transactions.slice(0, 20).map(tx => (
            <div key={tx.id} className="card flex items-center gap-3" style={{ padding: '0.75rem 1rem' }}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                tx.type === 'income' ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'
              }`}>
                {tx.type === 'income'
                  ? <TrendingUp size={16} className="text-green-500" />
                  : <TrendingDown size={16} className="text-red-500" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{tx.category || tx.type}</p>
                <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{tx.note} • {tx.date}</p>
              </div>
              <span className={`text-sm font-bold ${tx.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                {tx.type === 'income' ? '+' : '-'}{tx.amount.toLocaleString()}
              </span>
              <button onClick={() => setTransactions(transactions.filter(t => t.id !== tx.id))}
                className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
                <Trash2 size={13} className="text-red-400" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
