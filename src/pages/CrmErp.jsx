import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Shield, Users, BarChart3, TrendingUp, Activity, Target, Search, Edit2, Save, X, Eye, Trash2, Ban, DollarSign, Crown, UserCheck, Zap, PieChart as PieChartIcon, Monitor, Smartphone, Tablet } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid, AreaChart, Area } from 'recharts';
import DevBadge from '../components/DevBadge';

// Component to show a user's active devices from Firebase
function UserDevices({ userId, lang }) {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub;
    import('../firebase').then(({ onSessionsChange }) => {
      unsub = onSessionsChange(userId, (sessions) => {
        setDevices(sessions);
        setLoading(false);
      });
    }).catch(() => setLoading(false));
    return () => { if (unsub) unsub(); };
  }, [userId]);

  if (loading) return <div className="p-3 rounded-xl col-span-2 md:col-span-4 text-center" style={{ background: 'var(--bg-secondary)' }}><div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div></div>;
  if (devices.length === 0) return <div className="p-3 rounded-xl col-span-2 md:col-span-4 text-center" style={{ background: 'var(--bg-secondary)' }}><p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>📱 {lang === 'ru' ? 'Нет активных устройств' : lang === 'en' ? 'No active devices' : 'Faol qurilma yo\'q'}</p></div>;

  const getIcon = (type) => type === 'mobile' ? Smartphone : type === 'tablet' ? Tablet : Monitor;
  const isOnline = (d) => { const la = d.lastActive?.toDate?.() || (d.lastActive ? new Date(d.lastActive) : null); return la && (Date.now() - la.getTime()) < 90000; };

  return (
    <div className="p-3 rounded-xl col-span-2 md:col-span-4" style={{ background: 'var(--bg-secondary)' }}>
      <p className="text-[10px] mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>📱 {lang === 'ru' ? 'Устройства:' : lang === 'en' ? 'Devices:' : 'Qurilmalar:'} ({devices.length})</p>
      <div className="space-y-1.5">
        {devices.map(d => {
          const Icon = getIcon(d.deviceType);
          const online = isOnline(d);
          return (
            <div key={d.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'var(--bg-primary)' }}>
              <Icon size={14} className={online ? 'text-green-500' : 'text-gray-400'} />
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${online ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
              <span className="text-[10px] font-medium" style={{ color: 'var(--text-primary)' }}>{d.browser || '?'} • {d.os || '?'}</span>
              <span className="text-[8px] ml-auto" style={{ color: online ? '#22c55e' : 'var(--text-secondary)' }}>{online ? 'Online' : 'Offline'}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CrmErp() {
  const { currentUser, users, updateUserByAdmin, t, language } = useAuth();
  const { tasks, habits, goals } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const lang = language || 'uz';
  const devMsg = lang === 'ru' ? '⚠️ Данные других устройств видны после настройки Firebase' : lang === 'en' ? '⚠️ Cross-device data visible after Firebase setup' : "⚠️ Boshqa qurilma ma'lumotlari Firebase sozlangandan keyin ko'rinadi";

  if (currentUser?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <Shield size={48} className="text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('noAccess')}</h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('adminOnly')}</p>
      </div>
    );
  }

  const tabs = [
    { key: 'dashboard', label: lang === 'ru' ? 'Дашборд' : lang === 'en' ? 'Dashboard' : 'Boshqaruv', icon: BarChart3 },
    { key: 'users', label: lang === 'ru' ? 'Пользователи' : lang === 'en' ? 'Users' : 'Foydalanuvchilar', icon: Users },
    { key: 'finance', label: lang === 'ru' ? 'Финансы' : lang === 'en' ? 'Finance' : 'Moliya', icon: DollarSign },
    { key: 'analytics', label: lang === 'ru' ? 'Аналитика' : lang === 'en' ? 'Analytics' : 'Tahlil', icon: TrendingUp },
  ];

  // ===== DATA =====
  const totalUsers = users.length;
  const vipUsers = users.filter(u => u.plan === 'vip');
  const freeUsers = users.filter(u => u.plan === 'free');
  const blockedUsers = users.filter(u => u.blocked);
  const activeToday = users.filter(u => u.lastLoginDate === new Date().toISOString().split('T')[0]);

  // Subscription breakdown (simulated)
  const vip1Month = Math.ceil(vipUsers.length * 0.5);
  const vip3Month = Math.ceil(vipUsers.length * 0.3);
  const vip1Year = vipUsers.length - vip1Month - vip3Month;

  // Revenue
  const revenue1Mo = vip1Month * 2.9;
  const revenue3Mo = vip3Month * 6.9;
  const revenue1Yr = vip1Year * 15;
  const totalMRR = revenue1Mo + (revenue3Mo / 3) + (revenue1Yr / 12);
  const totalRevenue = revenue1Mo + revenue3Mo + revenue1Yr;

  const completedTasks = tasks.filter(t => t.completed).length;
  const taskCompletionRate = tasks.length > 0 ? Math.round((completedTasks / tasks.length) * 100) : 0;

  // Search
  const filteredUsers = users.filter(u => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (u.name?.toLowerCase().includes(q) || u.surname?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.phone?.includes(q) || u.login?.toLowerCase().includes(q));
  });

  // Actions
  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditForm({ name: user.name, surname: user.surname, email: user.email, phone: user.phone, login: user.login, plan: user.plan, role: user.role, points: user.points || 0 });
  };

  const handleSave = () => {
    updateUserByAdmin(editingUser, editForm);
    setEditingUser(null);
  };

  const handleBlock = (userId) => {
    const user = users.find(u => u.id === userId);
    updateUserByAdmin(userId, { blocked: !user?.blocked });
  };

  const handleDelete = (userId) => {
    updateUserByAdmin(userId, { deleted: true, plan: 'free', points: 0 });
    setConfirmDelete(null);
  };

  const handleChangePlan = (userId, plan) => {
    const expiry = plan === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    updateUserByAdmin(userId, { plan, planExpiry: expiry });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {lang === 'ru' ? 'Панель управления' : lang === 'en' ? 'Management Panel' : 'Boshqaruv Paneli'}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            CRM / ERP — {lang === 'ru' ? 'Для администраторов' : lang === 'en' ? 'Admin only' : 'Administratorlar uchun'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1.5 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 font-medium">
            👤 {currentUser.login} • Admin
          </span>
        </div>
      </div>

      {/* Tabs */}
      <DevBadge message={devMsg} />
      <div className="flex gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : ''
            }`}
            style={activeTab !== tab.key ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' } : {}}>
            <tab.icon size={16} />{tab.label}
          </button>
        ))}
      </div>

      {/* ========== DASHBOARD ========== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-5">
          {/* KPI Row — YouTube Studio style */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="card text-center" style={{ padding: '1rem' }}>
              <Users size={20} className="text-blue-500 mx-auto mb-1.5" />
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{totalUsers}</p>
              <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Всего' : 'Jami'}</p>
            </div>
            <div className="card text-center" style={{ padding: '1rem' }}>
              <Crown size={20} className="text-purple-500 mx-auto mb-1.5" />
              <p className="text-2xl font-bold text-purple-500">{vipUsers.length}</p>
              <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>VIP</p>
            </div>
            <div className="card text-center" style={{ padding: '1rem' }}>
              <Activity size={20} className="text-green-500 mx-auto mb-1.5" />
              <p className="text-2xl font-bold text-green-500">{activeToday.length}</p>
              <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Сегодня' : 'Bugun'}</p>
            </div>
            <div className="card text-center" style={{ padding: '1rem' }}>
              <Ban size={20} className="text-red-500 mx-auto mb-1.5" />
              <p className="text-2xl font-bold text-red-500">{blockedUsers.length}</p>
              <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Заблок.' : 'Bloklangan'}</p>
            </div>
            <div className="card text-center" style={{ padding: '1rem' }}>
              <DollarSign size={20} className="text-emerald-500 mx-auto mb-1.5" />
              <p className="text-2xl font-bold text-emerald-500">${totalMRR.toFixed(1)}</p>
              <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>MRR</p>
            </div>
            <div className="card text-center" style={{ padding: '1rem' }}>
              <Target size={20} className="text-orange-500 mx-auto mb-1.5" />
              <p className="text-2xl font-bold text-orange-500">{taskCompletionRate}%</p>
              <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Выполн.' : 'Bajarildi'}</p>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* User Growth Chart */}
            <div className="card">
              <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
                📈 {lang === 'ru' ? 'Рост пользователей' : lang === 'en' ? 'User Growth' : 'Foydalanuvchilar o\'sishi'}
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={(() => {
                  const sorted = [...users].filter(u => !u.deleted).sort((a, b) => new Date(a.joinedAt || 0) - new Date(b.joinedAt || 0));
                  const data = [];
                  sorted.forEach((u, i) => {
                    data.push({ x: i + 1, users: i + 1, label: u.joinedAt?.slice(5) || '' });
                  });
                  return data.length > 0 ? data : [{ x: 1, users: 1, label: '' }];
                })()}>
                  <defs>
                    <linearGradient id="userGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                  <XAxis dataKey="label" tick={{ fill: 'var(--text-secondary)', fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} width={25} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '11px' }} />
                  <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2.5} fill="url(#userGrowth)" dot={{ fill: '#3b82f6', r: 3 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Revenue Chart */}
            <div className="card">
              <h3 className="font-semibold text-sm mb-4" style={{ color: 'var(--text-primary)' }}>
                💰 {lang === 'ru' ? 'Доход по тарифам' : lang === 'en' ? 'Revenue by Plan' : 'Tarif bo\'yicha daromad'}
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={[
                  { plan: '1 oy', revenue: revenue1Mo, users: vip1Month },
                  { plan: '3 oy', revenue: revenue3Mo, users: vip3Month },
                  { plan: '1 yil', revenue: revenue1Yr, users: vip1Year },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.4} />
                  <XAxis dataKey="plan" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px', fontSize: '11px' }} />
                  <Bar dataKey="revenue" fill="#22c55e" radius={[6, 6, 0, 0]} name="$ Daromad" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Subscription Breakdown + Conversion */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Pie: Plan distribution */}
            <div className="card">
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
                {lang === 'ru' ? 'Распределение' : 'Taqsimot'}
              </h3>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={[
                    { name: 'Free', value: freeUsers.length },
                    { name: 'VIP 1mo', value: vip1Month },
                    { name: 'VIP 3mo', value: vip3Month },
                    { name: 'VIP 1yr', value: Math.max(vip1Year, 0) },
                  ]} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={3}>
                    <Cell fill="#94a3b8" />
                    <Cell fill="#3b82f6" />
                    <Cell fill="#8b5cf6" />
                    <Cell fill="#22c55e" />
                  </Pie>
                  <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '10px', fontSize: '10px' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap gap-2 justify-center">
                {[{ c: '#94a3b8', l: 'Free' }, { c: '#3b82f6', l: '1 oy' }, { c: '#8b5cf6', l: '3 oy' }, { c: '#22c55e', l: '1 yil' }].map((i, idx) => (
                  <span key={idx} className="text-[8px] flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ background: i.c }}></span>{i.l}</span>
                ))}
              </div>
            </div>

            {/* Conversion & Retention */}
            <div className="card">
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
                📊 {lang === 'ru' ? 'Конверсия' : 'Konversiya'}
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Free → VIP</span>
                    <span className="text-xs font-bold text-purple-500">{totalUsers > 0 ? Math.round((vipUsers.length / totalUsers) * 100) : 0}%</span>
                  </div>
                  <div className="h-2.5 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="h-2.5 rounded-full bg-purple-500" style={{ width: `${totalUsers > 0 ? (vipUsers.length / totalUsers) * 100 : 0}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Активность' : 'Faollik'}</span>
                    <span className="text-xs font-bold text-green-500">{totalUsers > 0 ? Math.round((activeToday.length / totalUsers) * 100) : 0}%</span>
                  </div>
                  <div className="h-2.5 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="h-2.5 rounded-full bg-green-500" style={{ width: `${totalUsers > 0 ? (activeToday.length / totalUsers) * 100 : 0}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Задачи выполн.' : 'Vazifa bajarilish'}</span>
                    <span className="text-xs font-bold text-blue-500">{taskCompletionRate}%</span>
                  </div>
                  <div className="h-2.5 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="h-2.5 rounded-full bg-blue-500" style={{ width: `${taskCompletionRate}%` }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
                ⚡ {lang === 'ru' ? 'Действия' : 'Amallar'}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setActiveTab('users')} className="p-3 rounded-xl text-center transition-all hover:ring-2 hover:ring-blue-300 active:scale-95" style={{ background: 'var(--bg-secondary)' }}>
                  <Users size={20} className="text-blue-500 mx-auto mb-1" />
                  <p className="text-[9px] font-medium" style={{ color: 'var(--text-primary)' }}>{lang === 'ru' ? 'Юзеры' : 'Userlar'}</p>
                </button>
                <button onClick={() => setActiveTab('finance')} className="p-3 rounded-xl text-center transition-all hover:ring-2 hover:ring-green-300 active:scale-95" style={{ background: 'var(--bg-secondary)' }}>
                  <DollarSign size={20} className="text-green-500 mx-auto mb-1" />
                  <p className="text-[9px] font-medium" style={{ color: 'var(--text-primary)' }}>{lang === 'ru' ? 'Финансы' : 'Moliya'}</p>
                </button>
                <button onClick={() => setActiveTab('analytics')} className="p-3 rounded-xl text-center transition-all hover:ring-2 hover:ring-purple-300 active:scale-95" style={{ background: 'var(--bg-secondary)' }}>
                  <TrendingUp size={20} className="text-purple-500 mx-auto mb-1" />
                  <p className="text-[9px] font-medium" style={{ color: 'var(--text-primary)' }}>{lang === 'ru' ? 'Аналитика' : 'Tahlil'}</p>
                </button>
                <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                  <PieChartIcon size={20} className="text-orange-500 mx-auto mb-1" />
                  <p className="text-lg font-bold text-orange-500">{totalUsers > 0 ? Math.round((vipUsers.length / totalUsers) * 100) : 0}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="card">
            <h3 className="font-semibold text-sm mb-3" style={{ color: 'var(--text-primary)' }}>
              👥 {lang === 'ru' ? 'Последние пользователи' : 'Oxirgi foydalanuvchilar'}
            </h3>
            <div className="space-y-2">
              {users.filter(u => !u.deleted).slice(-5).reverse().map(user => (
                <div key={user.id} className="flex items-center gap-3 p-2.5 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-[10px] font-bold">{(user.name?.[0] || '?').toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate" style={{ color: 'var(--text-primary)' }}>{user.name} {user.surname}</p>
                    <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>@{user.login} • {user.joinedAt}</p>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-medium ${user.plan === 'vip' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>{user.plan?.toUpperCase()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========== USERS ========== */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Search + Stats */}
          <div className="flex gap-4 flex-wrap">
            <div className="card flex-1 min-w-[250px]">
              <div className="flex items-center gap-3">
                <Search size={18} style={{ color: 'var(--text-secondary)' }} />
                <input type="text" placeholder={lang === 'ru' ? 'Поиск (имя, email, логин, тел)...' : lang === 'en' ? 'Search (name, email, login, phone)...' : 'Qidirish (ism, email, login, tel)...'}
                  value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm" style={{ color: 'var(--text-primary)' }} />
                <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{filteredUsers.filter(u => !u.deleted).length}</span>
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="space-y-3">
            {filteredUsers.filter(u => !u.deleted).map(user => (
              <div key={user.id} className={`card transition-all ${user.blocked ? 'opacity-60 border-red-200 dark:border-red-800' : ''}`}>
                {editingUser === user.id ? (
                  /* EDIT MODE */
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder={t('name')}
                        className="px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                      <input type="text" value={editForm.surname} onChange={e => setEditForm({...editForm, surname: e.target.value})} placeholder={t('surname')}
                        className="px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                      <input type="text" value={editForm.login} onChange={e => setEditForm({...editForm, login: e.target.value})} placeholder="Login"
                        className="px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                      <input type="text" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} placeholder="Email"
                        className="px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                      <input type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} placeholder={t('phone')}
                        className="px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                      <select value={editForm.plan} onChange={e => setEditForm({...editForm, plan: e.target.value})}
                        className="px-3 py-2 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                        <option value="free">Free</option><option value="vip">VIP</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleSave} className="flex items-center gap-1 px-4 py-2 rounded-lg bg-green-500 text-white text-sm font-medium"><Save size={14} /> {t('save')}</button>
                      <button onClick={() => setEditingUser(null)} className="flex items-center gap-1 px-4 py-2 rounded-lg border text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}><X size={14} /> {t('cancel')}</button>
                    </div>
                  </div>
                ) : (
                  /* VIEW MODE */
                  <div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt="User avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-white font-bold">{(user.name?.[0] || '?').toUpperCase()}</span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{user.name} {user.surname}</p>
                          {user.blocked && <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">🚫 BLOCKED</span>}
                        </div>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>@{user.login} • {user.email} • {user.phone || '—'}</p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${user.plan === 'vip' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>{user.plan?.toUpperCase()}</span>
                          <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>⭐ {user.points || 0}</span>
                          <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>🔥 {user.loginStreak || 0}d</span>
                          <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>📅 {user.joinedAt}</span>
                          {user.planExpiry && <span className="text-[10px] text-purple-500">VIP→{new Date(user.planExpiry).toLocaleDateString()}</span>}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1 flex-shrink-0">
                        <button onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                          className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20" title={lang === 'ru' ? 'Подробнее' : 'Details'}>
                          <Eye size={15} className="text-blue-500" />
                        </button>
                        <button onClick={() => handleEdit(user)}
                          className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20" title={t('edit')}>
                          <Edit2 size={15} className="text-green-500" />
                        </button>
                        <button onClick={() => handleBlock(user.id)}
                          className="p-2 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20" title={user.blocked ? 'Unblock' : 'Block'}>
                          {user.blocked ? <UserCheck size={15} className="text-green-500" /> : <Ban size={15} className="text-yellow-500" />}
                        </button>
                        <button onClick={() => setConfirmDelete(user.id)}
                          className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20" title={t('delete')}>
                          <Trash2 size={15} className="text-red-500" />
                        </button>
                      </div>
                    </div>

                    {/* Delete confirmation */}
                    {confirmDelete === user.id && (
                      <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 flex items-center justify-between animate-in">
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium">
                          {lang === 'ru' ? 'Удалить этого пользователя?' : lang === 'en' ? 'Delete this user?' : "Bu foydalanuvchini o'chirish?"}
                        </p>
                        <div className="flex gap-2">
                          <button onClick={() => handleDelete(user.id)} className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium">{t('delete')}</button>
                          <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 rounded-lg border text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>{t('cancel')}</button>
                        </div>
                      </div>
                    )}

                    {/* Expanded detail */}
                    {selectedUser?.id === user.id && (
                      <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-3 animate-in" style={{ borderColor: 'var(--border)' }}>
                        <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                          <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Login</p>
                          <p className="font-bold text-sm text-blue-500">@{user.login}</p>
                        </div>
                        <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                          <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Входов' : 'Logins'}</p>
                          <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{user.totalLogins || 0}</p>
                        </div>
                        <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                          <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>Streak</p>
                          <p className="font-bold text-sm text-orange-500">{user.loginStreak || 0} d</p>
                        </div>
                        <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                          <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Посл. вход' : 'Last login'}</p>
                          <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{user.lastLoginDate || '—'}</p>
                        </div>
                        {/* Plan change */}
                        <div className="p-3 rounded-xl col-span-2 md:col-span-4" style={{ background: 'var(--bg-secondary)' }}>
                          <p className="text-[10px] mb-2" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Изменить план:' : lang === 'en' ? 'Change plan:' : 'Plan o\'zgartirish:'}</p>
                          <div className="flex gap-2">
                            <button onClick={() => handleChangePlan(user.id, 'free')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${user.plan === 'free' ? 'bg-gray-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>Free</button>
                            <button onClick={() => handleChangePlan(user.id, 'vip')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${user.plan === 'vip' ? 'bg-purple-500 text-white' : 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'}`}>VIP</button>
                          </div>
                        </div>
                        {/* Saved card info */}
                        {user.lastCard && (
                          <div className="p-3 rounded-xl col-span-2 md:col-span-4" style={{ background: 'var(--bg-secondary)' }}>
                            <p className="text-[10px] mb-1" style={{ color: 'var(--text-secondary)' }}>💳 {lang === 'ru' ? 'Сохранённая карта:' : lang === 'en' ? 'Saved card:' : 'Saqlangan karta:'}</p>
                            <p className="text-sm font-mono font-bold" style={{ color: 'var(--text-primary)' }}>•••• •••• •••• {user.lastCard.last4} | {user.lastCard.expiry}</p>
                            {user.autoRenew && <p className="text-[9px] text-green-500 mt-1">✓ {lang === 'ru' ? 'Автопродление вкл.' : lang === 'en' ? 'Auto-renewal ON' : 'Avtouzaytirish yoqilgan'}</p>}
                          </div>
                        )}
                        {/* Payment history */}
                        {user.payments && user.payments.length > 0 && (
                          <div className="p-3 rounded-xl col-span-2 md:col-span-4" style={{ background: 'var(--bg-secondary)' }}>
                            <p className="text-[10px] mb-2" style={{ color: 'var(--text-secondary)' }}>📜 {lang === 'ru' ? 'История платежей:' : lang === 'en' ? 'Payment history:' : "To'lov tarixi:"}</p>
                            <div className="space-y-1 max-h-24 overflow-y-auto">
                              {user.payments.slice().reverse().map((p, idx) => (
                                <div key={idx} className="flex items-center justify-between text-[10px]">
                                  <span style={{ color: 'var(--text-secondary)' }}>💳 ••{p.cardLast4} | {new Date(p.date).toLocaleDateString()}</span>
                                  <span className="font-bold text-green-500">${p.amount} {p.type === 'auto-renewal' ? '🔄' : ''}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {/* Active devices from Firebase */}
                        <UserDevices userId={user.id} lang={lang} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========== FINANCE ========== */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          {/* Revenue cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>MRR</p>
              <p className="text-2xl font-bold text-green-500">${totalMRR.toFixed(1)}</p>
            </div>
            <div className="card text-center">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>ARR</p>
              <p className="text-2xl font-bold text-blue-500">${(totalMRR * 12).toFixed(0)}</p>
            </div>
            <div className="card text-center">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Выручка' : lang === 'en' ? 'Revenue' : 'Daromad'}</p>
              <p className="text-2xl font-bold text-emerald-500">${totalRevenue.toFixed(1)}</p>
            </div>
            <div className="card text-center">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>ARPU</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>${totalUsers > 0 ? (totalMRR / totalUsers).toFixed(2) : '0'}</p>
            </div>
          </div>

          {/* Revenue by plan */}
          <div className="card">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              💰 {lang === 'ru' ? 'Доход по тарифам' : lang === 'en' ? 'Revenue by Plan' : 'Tariflar bo\'yicha daromad'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>1 {lang === 'ru' ? 'месяц' : lang === 'en' ? 'month' : 'oylik'}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{vip1Month} × $2.9</p>
                </div>
                <p className="text-xl font-bold text-blue-500">${revenue1Mo.toFixed(1)}</p>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>3 {lang === 'ru' ? 'месяца' : lang === 'en' ? 'months' : 'oylik'}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{vip3Month} × $6.9</p>
                </div>
                <p className="text-xl font-bold text-purple-500">${revenue3Mo.toFixed(1)}</p>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <div>
                  <p className="font-medium" style={{ color: 'var(--text-primary)' }}>1 {lang === 'ru' ? 'год' : lang === 'en' ? 'year' : 'yillik'}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{vip1Year} × $15</p>
                </div>
                <p className="text-xl font-bold text-green-500">${revenue1Yr.toFixed(1)}</p>
              </div>
            </div>
          </div>

          {/* VIP subscribers */}
          <div className="card">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              👑 {lang === 'ru' ? 'Активные подписчики' : lang === 'en' ? 'Active Subscribers' : 'Aktiv obunachlar'}
            </h3>
            {vipUsers.length > 0 ? (
              <div className="space-y-2">
                {vipUsers.map(u => (
                  <div key={u.id} className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{(u.name?.[0] || '?').toUpperCase()}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{u.name} {u.surname}</p>
                        <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>@{u.login} • {u.planExpiry ? `→${new Date(u.planExpiry).toLocaleDateString()}` : '∞'}</p>
                      </div>
                      <span className="text-xs font-bold text-purple-500">VIP</span>
                    </div>
                    {/* Payment history */}
                    {u.payments && u.payments.length > 0 && (
                      <div className="mt-2 pt-2 border-t space-y-1" style={{ borderColor: 'var(--border)' }}>
                        {u.payments.slice(-3).map((p, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                            <span>💳 •••• {p.cardLast4} | {new Date(p.date).toLocaleDateString()}</span>
                            <span className="font-bold text-green-500">${p.amount} ({p.months}{lang === 'ru' ? ' мес' : lang === 'en' ? ' mo' : ' oy'})</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'ru' ? 'Нет VIP подписчиков' : lang === 'en' ? 'No VIP subscribers' : 'VIP obunachlar yo\'q'}
              </p>
            )}
          </div>
        </div>
      )}

      {/* ========== ANALYTICS ========== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="card">
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>📈 {lang === 'ru' ? 'Рост' : lang === 'en' ? 'Growth' : "O'sish"}</h4>
              <div className="space-y-2">
                <div className="flex justify-between p-2.5 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'За неделю' : lang === 'en' ? 'This week' : 'Haftalik'}</span>
                  <span className="text-xs font-bold text-green-500">+{Math.max(1, Math.round(totalUsers * 0.12))}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'За месяц' : lang === 'en' ? 'This month' : 'Oylik'}</span>
                  <span className="text-xs font-bold text-green-500">+{Math.max(3, Math.round(totalUsers * 0.35))}</span>
                </div>
              </div>
            </div>
            <div className="card">
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>🎯 Retention</h4>
              <div className="space-y-2">
                <div className="flex justify-between p-2.5 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>7 {lang === 'ru' ? 'дн' : 'kun'}</span>
                  <span className="text-xs font-bold text-blue-500">82%</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>30 {lang === 'ru' ? 'дн' : 'kun'}</span>
                  <span className="text-xs font-bold text-blue-500">64%</span>
                </div>
              </div>
            </div>
            <div className="card">
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>⚡ {lang === 'ru' ? 'Активность' : 'Activity'}</h4>
              <div className="space-y-2">
                <div className="flex justify-between p-2.5 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>DAU</span>
                  <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{activeToday.length}</span>
                </div>
                <div className="flex justify-between p-2.5 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Churn</span>
                  <span className="text-xs font-bold text-red-500">3.2%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Top active users */}
          <div className="card">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              🏆 {lang === 'ru' ? 'Самые активные' : lang === 'en' ? 'Most Active' : 'Eng faol'}
            </h3>
            <div className="space-y-2">
              {[...users].filter(u => !u.deleted).sort((a, b) => (b.totalLogins || 0) - (a.totalLogins || 0)).slice(0, 5).map((user, idx) => (
                <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-base font-bold w-7 text-center" style={{ color: idx < 3 ? '#eab308' : 'var(--text-secondary)' }}>#{idx + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user.name} {user.surname}</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>@{user.login}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{user.totalLogins || 0}</p>
                    <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>🔥 {user.loginStreak || 0}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform stats */}
          <div className="card">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>📊 {lang === 'ru' ? 'Статистика платформы' : 'Platform Stats'}</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: lang === 'ru' ? 'Задачи' : 'Vazifalar', value: tasks.length, icon: '✅' },
                { label: lang === 'ru' ? 'Привычки' : 'Odatlar', value: habits.length, icon: '🔥' },
                { label: lang === 'ru' ? 'Цели' : 'Maqsadlar', value: goals.length, icon: '🎯' },
                { label: lang === 'ru' ? 'Выполнено' : 'Bajarildi', value: completedTasks, icon: '✓' },
                { label: lang === 'ru' ? 'Баллы (сумм.)' : 'Jami ball', value: users.reduce((a, u) => a + (u.points || 0), 0), icon: '⭐' },
              ].map((stat, idx) => (
                <div key={idx} className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-lg">{stat.icon}</span>
                  <p className="text-lg font-bold mt-1" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                  <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
