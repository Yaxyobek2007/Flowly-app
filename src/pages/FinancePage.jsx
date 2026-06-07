import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import FinanceTracker from './FinanceTracker';
import InvestmentPlanner from './InvestmentPlanner';
import BudgetManager from './BudgetManager';
import { Wallet, TrendingUp, PiggyBank } from 'lucide-react';

const tabs = [
  { key: 'budget', icon: PiggyBank, uz: 'Budjet', ru: 'Бюджет', en: 'Budget' },
  { key: 'finance', icon: Wallet, uz: 'Kirim/Chiqim', ru: 'Доходы/Расходы', en: 'Income/Expense' },
  { key: 'invest', icon: TrendingUp, uz: 'Investitsiya', ru: 'Инвестиции', en: 'Investment' },
];

export default function FinancePage() {
  const { language } = useAuth();
  const lang = language || 'uz';
  const [activeTab, setActiveTab] = useState('budget');

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30' : ''}`}
            style={activeTab !== tab.key ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)', border: '1px solid var(--border)' } : {}}>
            <tab.icon size={16} />
            {tab[lang]}
          </button>
        ))}
      </div>

      {activeTab === 'budget' && <BudgetManager />}
      {activeTab === 'finance' && <FinanceTracker />}
      {activeTab === 'invest' && <InvestmentPlanner />}
    </div>
  );
}
