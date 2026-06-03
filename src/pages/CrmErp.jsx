import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Shield, Users, BarChart3, TrendingUp, Activity, Target, Download, Search, Edit2, Save, X, Eye, Ban, DollarSign, Calendar, Clock } from 'lucide-react';

export default function CrmErp() {
  const { currentUser, users, updateUserByAdmin, t, language } = useAuth();
  const { tasks, habits, goals } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);

  // Staff login check - only admin/staff can access
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
    { key: 'dashboard', label: language === 'ru' ? 'Дашборд' : language === 'en' ? 'Dashboard' : 'Boshqaruv paneli', icon: BarChart3 },
    { key: 'users', label: language === 'ru' ? 'Пользователи' : language === 'en' ? 'Users' : 'Foydalanuvchilar', icon: Users },
    { key: 'finance', label: language === 'ru' ? 'Финансы' : language === 'en' ? 'Finance' : 'Moliya', icon: DollarSign },
    { key: 'analytics', label: language === 'ru' ? 'Аналитика' : language === 'en' ? 'Analytics' : 'Tahlil', icon: TrendingUp },
  ];

  // KPIs
  const totalUsers = users.length;
  const premiumUsers = users.filter(u => u.plan === 'vip').length;
  const freeUsers = users.filter(u => u.plan === 'free').length;
  const activeToday = users.filter(u => u.lastLoginDate === new Date().toISOString().split('T')[0]).length;
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;

  // Revenue calculation
  const monthlyRevenue = premiumUsers * 2.9;
  const projectedAnnual = monthlyRevenue * 12;
  const avgPointsPerUser = totalUsers > 0 ? Math.round(users.reduce((a, u) => a + (u.points || 0), 0) / totalUsers) : 0;

  const filteredUsers = users.filter(u => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (u.name?.toLowerCase().includes(q) || u.surname?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q) || u.phone?.includes(q) || u.login?.toLowerCase().includes(q));
  });

  const handleEdit = (user) => {
    setEditingUser(user.id);
    setEditForm({ name: user.name, surname: user.surname, email: user.email, phone: user.phone, login: user.login, plan: user.plan, role: user.role, points: user.points });
  };

  const handleSave = () => {
    updateUserByAdmin(editingUser, editForm);
    setEditingUser(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {language === 'ru' ? 'Панель управления' : language === 'en' ? 'Management Panel' : 'Boshqaruv Paneli'}
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            CRM / ERP — {language === 'ru' ? 'Для сотрудников' : language === 'en' ? 'Staff only' : 'Xodimlar uchun'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs px-3 py-1 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 font-medium">
            👤 {currentUser.login} (Admin)
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : ''
            }`}
            style={activeTab !== tab.key ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' } : {}}>
            <tab.icon size={16} />{tab.label}
          </button>
        ))}
      </div>

      {/* ===== DASHBOARD TAB ===== */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* KPI Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <Users size={28} className="text-blue-500 mx-auto mb-2" />
              <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{totalUsers}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{language === 'ru' ? 'Всего' : language === 'en' ? 'Total Users' : 'Jami foydalanuvchilar'}</p>
            </div>
            <div className="card text-center">
              <Activity size={28} className="text-green-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-green-500">{activeToday}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{language === 'ru' ? 'Активные сегодня' : language === 'en' ? 'Active today' : 'Bugun faol'}</p>
            </div>
            <div className="card text-center">
              <DollarSign size={28} className="text-emerald-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-emerald-500">${monthlyRevenue.toFixed(1)}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{language === 'ru' ? 'MRR' : 'Oylik daromad'}</p>
            </div>
            <div className="card text-center">
              <Target size={28} className="text-purple-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-purple-500">{totalUsers > 0 ? Math.round((premiumUsers / totalUsers) * 100) : 0}%</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{language === 'ru' ? 'Конверсия' : language === 'en' ? 'Conversion' : 'Konversiya'}</p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>📊 {language === 'ru' ? 'Статистика платформы' : language === 'en' ? 'Platform Stats' : 'Platforma statistikasi'}</h3>
              <div className="space-y-3">
                {[
                  { label: language === 'ru' ? 'Задачи создано' : 'Vazifalar yaratildi', value: totalTasks, color: 'text-blue-500' },
                  { label: language === 'ru' ? 'Выполнено' : 'Bajarildi', value: completedTasks, color: 'text-green-500' },
                  { label: language === 'ru' ? 'VIP пользователи' : 'VIP foydalanuvchilar', value: premiumUsers, color: 'text-purple-500' },
                  { label: language === 'ru' ? 'Среднее кол-во баллов' : "O'rtacha ball", value: avgPointsPerUser, color: 'text-orange-500' },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{item.label}</span>
                    <span className={`font-bold ${item.color}`}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>👥 {language === 'ru' ? 'Последние пользователи' : language === 'en' ? 'Recent Users' : 'Oxirgi foydalanuvchilar'}</h3>
              <div className="space-y-3">
                {users.slice(-5).reverse().map(user => (
                  <div key={user.id} className="flex items-center gap-3 p-2 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{(user.name?.[0] || 'U').toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{user.name} {user.surname}</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>@{user.login} • {user.joinedAt}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${user.plan === 'vip' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>{user.plan}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== USERS TAB ===== */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="card">
            <div className="flex items-center gap-3">
              <Search size={18} style={{ color: 'var(--text-secondary)' }} />
              <input type="text" placeholder={language === 'ru' ? 'Поиск (имя, email, логин, телефон)...' : language === 'en' ? 'Search (name, email, login, phone)...' : 'Qidirish (ism, email, login, telefon)...'}
                value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent outline-none" style={{ color: 'var(--text-primary)' }} />
              <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>{filteredUsers.length} ta</span>
            </div>
          </div>

          {/* Users List */}
          <div className="space-y-3">
            {filteredUsers.map(user => (
              <div key={user.id} className="card">
                {editingUser === user.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} placeholder="Ism"
                        className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                      <input type="text" value={editForm.surname} onChange={e => setEditForm({...editForm, surname: e.target.value})} placeholder="Familya"
                        className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                      <input type="text" value={editForm.login} onChange={e => setEditForm({...editForm, login: e.target.value})} placeholder="Login"
                        className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                      <input type="text" value={editForm.email} onChange={e => setEditForm({...editForm, email: e.target.value})} placeholder="Email"
                        className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                      <input type="text" value={editForm.phone} onChange={e => setEditForm({...editForm, phone: e.target.value})} placeholder="Telefon"
                        className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                      <select value={editForm.plan} onChange={e => setEditForm({...editForm, plan: e.target.value})}
                        className="px-3 py-2 rounded-lg border text-sm outline-none" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
                        <option value="free">Free</option><option value="vip">VIP</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleSave} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500 text-white text-sm"><Save size={14} /> Saqlash</button>
                      <button onClick={() => setEditingUser(null)} className="flex items-center gap-1 px-3 py-1.5 rounded-lg border text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}><X size={14} /> Bekor</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold">{(user.name?.[0] || 'U').toUpperCase()}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{user.name} {user.surname}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>@{user.login} • {user.email} • {user.phone}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${user.plan === 'vip' ? 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'}`}>{user.plan}</span>
                        <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>⭐ {user.points || 0} ball</span>
                        <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>🔥 {user.loginStreak || 0} kun</span>
                        <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>📅 {user.joinedAt}</span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                        className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20" title="Ko'rish">
                        <Eye size={15} className="text-blue-500" />
                      </button>
                      <button onClick={() => handleEdit(user)}
                        className="p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20" title="Tahrirlash">
                        <Edit2 size={15} className="text-green-500" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Expanded user detail */}
                {selectedUser?.id === user.id && !editingUser && (
                  <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-3 animate-in" style={{ borderColor: 'var(--border)' }}>
                    <div className="p-2 rounded-lg text-center" style={{ background: 'var(--bg-secondary)' }}>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Login</p>
                      <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>@{user.login}</p>
                    </div>
                    <div className="p-2 rounded-lg text-center" style={{ background: 'var(--bg-secondary)' }}>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Kirish soni</p>
                      <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{user.totalLogins || 0}</p>
                    </div>
                    <div className="p-2 rounded-lg text-center" style={{ background: 'var(--bg-secondary)' }}>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Streak</p>
                      <p className="font-bold text-sm text-orange-500">{user.loginStreak || 0} kun</p>
                    </div>
                    <div className="p-2 rounded-lg text-center" style={{ background: 'var(--bg-secondary)' }}>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Oxirgi kirish</p>
                      <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{user.lastLoginDate || '—'}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== FINANCE TAB ===== */}
      {activeTab === 'finance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="card text-center">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>MRR</p>
              <p className="text-2xl font-bold text-green-500">${monthlyRevenue.toFixed(1)}</p>
            </div>
            <div className="card text-center">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>ARR (prognoz)</p>
              <p className="text-2xl font-bold text-blue-500">${projectedAnnual.toFixed(0)}</p>
            </div>
            <div className="card text-center">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>VIP obunalar</p>
              <p className="text-2xl font-bold text-purple-500">{premiumUsers}</p>
            </div>
            <div className="card text-center">
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>ARPU</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>${totalUsers > 0 ? (monthlyRevenue / totalUsers).toFixed(2) : '0'}</p>
            </div>
          </div>

          {/* Pricing tiers */}
          <div className="card">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>💳 {language === 'ru' ? 'Тарифы' : language === 'en' ? 'Pricing Tiers' : 'Tariflar'}</h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                <p className="font-bold" style={{ color: 'var(--text-primary)' }}>Free</p>
                <p className="text-lg font-bold text-gray-500">$0</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{freeUsers} ta</p>
              </div>
              <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                <p className="font-bold" style={{ color: 'var(--text-primary)' }}>1 oy</p>
                <p className="text-lg font-bold text-blue-500">$2.9</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>VIP</p>
              </div>
              <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                <p className="font-bold" style={{ color: 'var(--text-primary)' }}>3 oy</p>
                <p className="text-lg font-bold text-purple-500">$6.9</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>VIP</p>
              </div>
              <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
                <p className="font-bold" style={{ color: 'var(--text-primary)' }}>1 yil</p>
                <p className="text-lg font-bold text-green-500">$15</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>VIP</p>
              </div>
            </div>
          </div>

          {/* Paid users list */}
          <div className="card">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>👑 {language === 'ru' ? 'Активные подписчики' : 'Aktiv ishtirokchilar'}</h3>
            {premiumUsers > 0 ? (
              <div className="space-y-2">
                {users.filter(u => u.plan === 'vip').map(u => (
                  <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{(u.name?.[0] || '?').toUpperCase()}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{u.name} {u.surname}</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>@{u.login} • {u.planExpiry ? `Amal qiladi: ${new Date(u.planExpiry).toLocaleDateString()}` : 'Umrbod'}</p>
                    </div>
                    <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400 font-bold">VIP</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-sm" style={{ color: 'var(--text-secondary)' }}>Hali VIP foydalanuvchilar yo'q</p>
            )}
          </div>
        </div>
      )}

      {/* ===== ANALYTICS TAB ===== */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="card">
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>📈 {language === 'ru' ? 'Рост' : "O'sish"}</h4>
              <div className="space-y-2">
                <div className="flex justify-between p-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{language === 'ru' ? 'Недельный' : 'Haftalik'}</span>
                  <span className="text-xs font-bold text-green-500">+{Math.max(1, Math.round(totalUsers * 0.12))}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{language === 'ru' ? 'Месячный' : 'Oylik'}</span>
                  <span className="text-xs font-bold text-green-500">+{Math.max(3, Math.round(totalUsers * 0.35))}</span>
                </div>
              </div>
            </div>
            <div className="card">
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>🎯 Retention</h4>
              <div className="space-y-2">
                <div className="flex justify-between p-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>7 kun</span>
                  <span className="text-xs font-bold text-blue-500">82%</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>30 kun</span>
                  <span className="text-xs font-bold text-blue-500">64%</span>
                </div>
              </div>
            </div>
            <div className="card">
              <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>⚡ {language === 'ru' ? 'Активность' : 'Faollik'}</h4>
              <div className="space-y-2">
                <div className="flex justify-between p-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>DAU</span>
                  <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{activeToday}</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Task/user</span>
                  <span className="text-xs font-bold" style={{ color: 'var(--text-primary)' }}>{totalUsers > 0 ? (totalTasks / totalUsers).toFixed(1) : 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* User engagement */}
          <div className="card">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>🏆 {language === 'ru' ? 'Топ активных' : 'Eng faol foydalanuvchilar'}</h3>
            <div className="space-y-2">
              {[...users].sort((a, b) => (b.totalLogins || 0) - (a.totalLogins || 0)).slice(0, 5).map((user, idx) => (
                <div key={user.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <span className="text-lg font-bold w-6 text-center" style={{ color: idx < 3 ? '#eab308' : 'var(--text-secondary)' }}>#{idx + 1}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{user.name} {user.surname}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>@{user.login}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{user.totalLogins || 0} kirish</p>
                    <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>🔥 {user.loginStreak || 0} streak</p>
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
