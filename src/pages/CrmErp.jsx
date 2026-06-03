import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Shield, Users, BarChart3, TrendingUp, Activity, Calendar, Target, FileText, Download, Filter } from 'lucide-react';

export default function CrmErp() {
  const { currentUser, users } = useAuth();
  const { tasks, habits, goals, events, notes } = useApp();
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState('week');

  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <Shield size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Ruxsat yo'q</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Bu bo'lim faqat boshqaruvchilar uchun ochiq</p>
      </div>
    );
  }

  const tabs = [
    { key: 'overview', label: 'Umumiy', icon: BarChart3 },
    { key: 'users', label: 'Foydalanuvchilar', icon: Users },
    { key: 'content', label: 'Kontent', icon: FileText },
    { key: 'growth', label: "O'sish", icon: TrendingUp },
  ];

  // KPI data
  const totalUsers = users.length;
  const premiumUsers = users.filter(u => u.plan !== 'free').length;
  const freeUsers = users.filter(u => u.plan === 'free').length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalGoals = goals.length;
  const totalHabits = habits.length;
  const totalEvents = events.length;
  const totalNotes = notes.length;
  const conversionRate = totalUsers > 0 ? Math.round((premiumUsers / totalUsers) * 100) : 0;
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Simulated revenue data
  const monthlyRevenue = premiumUsers * 7.9 + users.filter(u => u.plan === 'pro_plus').length * 7;
  const projectedAnnual = monthlyRevenue * 12;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>CRM / ERP</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Biznes boshqaruv paneli</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={dateRange} onChange={e => setDateRange(e.target.value)}
            className="px-3 py-1.5 rounded-lg border text-sm"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
            <option value="day">Bugun</option>
            <option value="week">Bu hafta</option>
            <option value="month">Bu oy</option>
            <option value="year">Bu yil</option>
          </select>
          <button className="btn-primary flex items-center gap-1 text-sm">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b pb-2" style={{ borderColor: 'var(--border)' }}>
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key ? 'bg-blue-500 text-white' : ''
            }`}
            style={activeTab !== tab.key ? { color: 'var(--text-secondary)' } : {}}>
            <tab.icon size={16} />{tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <Users size={24} className="text-blue-500 mx-auto mb-2" />
              <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{totalUsers}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Jami foydalanuvchilar</p>
            </div>
            <div className="card text-center">
              <TrendingUp size={24} className="text-green-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-green-500">${monthlyRevenue.toFixed(1)}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Oylik daromad</p>
            </div>
            <div className="card text-center">
              <Activity size={24} className="text-purple-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-purple-500">{conversionRate}%</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Konversiya</p>
            </div>
            <div className="card text-center">
              <Target size={24} className="text-orange-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-orange-500">{taskCompletionRate}%</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Task bajarish</p>
            </div>
          </div>

          {/* Revenue Summary */}
          <div className="card">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>💰 Daromad xulosasi</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Oylik</p>
                <p className="text-xl font-bold text-green-500">${monthlyRevenue.toFixed(1)}</p>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Yillik prognoz</p>
                <p className="text-xl font-bold text-blue-500">${projectedAnnual.toFixed(0)}</p>
              </div>
              <div className="p-4 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>O'rtacha ARPU</p>
                <p className="text-xl font-bold text-purple-500">${totalUsers > 0 ? (monthlyRevenue / totalUsers).toFixed(1) : 0}</p>
              </div>
            </div>
          </div>

          {/* Platform Stats */}
          <div className="card">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>📊 Platform statistikasi</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: 'Vazifalar', value: totalTasks, icon: '✅' },
                { label: 'Odatlar', value: totalHabits, icon: '🔥' },
                { label: 'Maqsadlar', value: totalGoals, icon: '🎯' },
                { label: 'Voqealar', value: totalEvents, icon: '📅' },
                { label: 'Yozuvlar', value: totalNotes, icon: '📝' },
              ].map((stat, idx) => (
                <div key={idx} className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-xl">{stat.icon}</span>
                  <p className="text-lg font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="card text-center">
              <p className="text-2xl font-bold text-blue-500">{totalUsers}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Jami</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl font-bold text-green-500">{premiumUsers}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Premium</p>
            </div>
            <div className="card text-center">
              <p className="text-2xl font-bold text-gray-500">{freeUsers}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Bepul</p>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Foydalanuvchilar ro'yxati</h3>
            <div className="space-y-3">
              {users.map(user => (
                <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{(user.name?.[0] || 'U').toUpperCase()}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{user.name} {user.surname}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{user.email} • {user.phone}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${user.plan === 'pro_plus' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : user.plan === 'pro' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>
                    {user.plan}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{user.joinedAt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Kontent tahlili</h3>
            <div className="space-y-3">
              {[
                { label: 'Jami vazifalar yaratildi', value: totalTasks, change: '+12%' },
                { label: 'Bajarilgan vazifalar', value: completedTasks, change: `${taskCompletionRate}%` },
                { label: 'Bajarilmagan', value: totalTasks - completedTasks, change: `-${100 - taskCompletionRate}%` },
                { label: 'Faol odatlar', value: habits.filter(h => h.todayDone).length + '/' + totalHabits, change: '' },
                { label: 'Yillik maqsadlar progressi', value: `${goals.length > 0 ? Math.round(goals.reduce((a, g) => a + g.progress, 0) / goals.length) : 0}%`, change: '' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                    {item.change && <span className={`text-xs ${item.change.startsWith('+') || !item.change.startsWith('-') ? 'text-green-500' : 'text-red-500'}`}>{item.change}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Growth Tab */}
      {activeTab === 'growth' && (
        <div className="space-y-4">
          <div className="card">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>📈 O'sish ko'rsatkichlari</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Haftalik o'sish</p>
                <p className="text-2xl font-bold text-green-500">+{Math.round(totalUsers * 0.15)}</p>
                <p className="text-xs text-green-500">▲ 15%</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Oylik o'sish</p>
                <p className="text-2xl font-bold text-blue-500">+{Math.round(totalUsers * 0.45)}</p>
                <p className="text-xs text-blue-500">▲ 45%</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Retention Rate</p>
                <p className="text-2xl font-bold text-purple-500">78%</p>
                <p className="text-xs text-purple-500">30 kunlik</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Churn Rate</p>
                <p className="text-2xl font-bold text-orange-500">4.2%</p>
                <p className="text-xs text-orange-500">Oylik</p>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>🎯 Maqsadlar (OKRs)</h3>
            <div className="space-y-3">
              {[
                { goal: '1000 foydalanuvchi', progress: Math.min(totalUsers / 10, 100), current: totalUsers },
                { goal: '$500 MRR', progress: Math.min((monthlyRevenue / 500) * 100, 100), current: `$${monthlyRevenue.toFixed(0)}` },
                { goal: '50% Premium konversiya', progress: Math.min(conversionRate * 2, 100), current: `${conversionRate}%` },
                { goal: '90% task completion', progress: Math.min((taskCompletionRate / 90) * 100, 100), current: `${taskCompletionRate}%` },
              ].map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.goal}</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--accent)' }}>{item.current}</span>
                  </div>
                  <div className="w-full h-2 rounded-full" style={{ background: 'var(--border)' }}>
                    <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500 transition-all" style={{ width: `${item.progress}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
