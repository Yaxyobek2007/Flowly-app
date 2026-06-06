import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, MapPin, Camera, Bell, Wifi, Activity, User, Lock, Unlock } from 'lucide-react';

const permissionsList = [
  { key: 'geolocation', icon: MapPin, color: 'text-blue-500', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
  { key: 'camera', icon: Camera, color: 'text-purple-500', bgColor: 'bg-purple-50 dark:bg-purple-900/20' },
  { key: 'notifications', icon: Bell, color: 'text-orange-500', bgColor: 'bg-orange-50 dark:bg-orange-900/20' },
  { key: 'online', icon: Wifi, color: 'text-green-500', bgColor: 'bg-green-50 dark:bg-green-900/20' },
  { key: 'activity', icon: Activity, color: 'text-red-500', bgColor: 'bg-red-50 dark:bg-red-900/20' },
  { key: 'profile', icon: User, color: 'text-indigo-500', bgColor: 'bg-indigo-50 dark:bg-indigo-900/20' },
];

const labels = {
  uz: {
    title: 'Maxfiylik va Ruxsatlar',
    desc: 'Shaxsiy ma\'lumotlaringizni boshqaring',
    geolocation: 'Geolokatsiya',
    geoDesc: 'Joylashuvingizni kuzatish (xarita, do\'stlar)',
    camera: 'Kamera',
    cameraDesc: 'Avatar o\'zgartirish, rasm yuklash',
    notifications: 'Bildirishnomalar',
    notifDesc: 'Push bildirishnomalar, eslatmalar',
    online: 'Online holat',
    onlineDesc: 'Do\'stlarga online ekanligingiz ko\'rinadi',
    activity: 'Faollik kuzatuvi',
    activityDesc: 'Statistika, Life Score hisoblash',
    profile: 'Profil ko\'rinishi',
    profileDesc: 'Profilingiz boshqalarga ko\'rinadi',
    on: 'Yoniq',
    off: 'O\'chiq',
    warning: '⚠️ O\'chirish ba\'zi funksiyalarga ta\'sir qiladi',
    allOn: 'Hammasini yoqish',
    allOff: 'Hammasini o\'chirish',
  },
  ru: {
    title: 'Конфиденциальность',
    desc: 'Управляйте личными данными',
    geolocation: 'Геолокация',
    geoDesc: 'Отслеживание местоположения (карта, друзья)',
    camera: 'Камера',
    cameraDesc: 'Смена аватара, загрузка фото',
    notifications: 'Уведомления',
    notifDesc: 'Push уведомления, напоминания',
    online: 'Онлайн статус',
    onlineDesc: 'Друзья видят что вы онлайн',
    activity: 'Трекинг активности',
    activityDesc: 'Статистика, Life Score',
    profile: 'Видимость профиля',
    profileDesc: 'Ваш профиль виден другим',
    on: 'Вкл',
    off: 'Выкл',
    warning: '⚠️ Отключение влияет на функции',
    allOn: 'Включить все',
    allOff: 'Выключить все',
  },
  en: {
    title: 'Privacy & Permissions',
    desc: 'Manage your personal data',
    geolocation: 'Geolocation',
    geoDesc: 'Location tracking (map, friends)',
    camera: 'Camera',
    cameraDesc: 'Change avatar, upload photos',
    notifications: 'Notifications',
    notifDesc: 'Push notifications, reminders',
    online: 'Online Status',
    onlineDesc: 'Friends can see you\'re online',
    activity: 'Activity Tracking',
    activityDesc: 'Statistics, Life Score calculation',
    profile: 'Profile Visibility',
    profileDesc: 'Your profile is visible to others',
    on: 'On',
    off: 'Off',
    warning: '⚠️ Disabling affects some features',
    allOn: 'Enable All',
    allOff: 'Disable All',
  },
};

export default function PrivacyPermissions() {
  const { language } = useAuth();
  const lang = language || 'uz';
  const L = labels[lang] || labels.uz;

  const [permissions, setPermissions] = useState(() => {
    const saved = localStorage.getItem('flowly-privacy');
    return saved ? JSON.parse(saved) : {
      geolocation: true,
      camera: true,
      notifications: true,
      online: true,
      activity: true,
      profile: true,
    };
  });

  useEffect(() => {
    localStorage.setItem('flowly-privacy', JSON.stringify(permissions));
  }, [permissions]);

  const toggle = (key) => {
    setPermissions(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allOn = () => {
    const all = {};
    permissionsList.forEach(p => { all[p.key] = true; });
    setPermissions(all);
  };

  const allOff = () => {
    const all = {};
    permissionsList.forEach(p => { all[p.key] = false; });
    setPermissions(all);
  };

  const enabledCount = Object.values(permissions).filter(Boolean).length;
  const totalCount = permissionsList.length;

  const descKeys = {
    geolocation: 'geoDesc',
    camera: 'cameraDesc',
    notifications: 'notifDesc',
    online: 'onlineDesc',
    activity: 'activityDesc',
    profile: 'profileDesc',
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>🔒 {L.title}</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{L.desc}</p>
        </div>
        <div className="flex items-center gap-2">
          <Shield size={20} className={enabledCount === totalCount ? 'text-green-500' : 'text-yellow-500'} />
          <span className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{enabledCount}/{totalCount}</span>
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3">
        <button onClick={allOn} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', color: '#22c55e' }}>
          <Unlock size={16} /> {L.allOn}
        </button>
        <button onClick={allOff} className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all hover:scale-[1.02]"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}>
          <Lock size={16} /> {L.allOff}
        </button>
      </div>

      {/* Permissions list */}
      <div className="space-y-3">
        {permissionsList.map((perm, idx) => {
          const isOn = permissions[perm.key];
          const Icon = perm.icon;
          return (
            <div key={perm.key} className="card flex items-center gap-4 animate-in" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${perm.bgColor}`}>
                <Icon size={22} className={perm.color} />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  {L[perm.key]}
                </h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {L[descKeys[perm.key]]}
                </p>
              </div>
              {/* Toggle switch */}
              <button onClick={() => toggle(perm.key)}
                className={`relative w-14 h-7 rounded-full transition-all duration-300 ${isOn ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${isOn ? 'left-7.5 translate-x-0.5' : 'left-0.5'}`}
                  style={{ left: isOn ? '30px' : '2px' }} />
              </button>
              <span className={`text-xs font-bold w-10 text-right ${isOn ? 'text-green-500' : 'text-red-500'}`}>
                {isOn ? L.on : L.off}
              </span>
            </div>
          );
        })}
      </div>

      {/* Warning */}
      <div className="card text-center" style={{ background: 'rgba(234,179,8,0.05)', borderColor: 'rgba(234,179,8,0.3)' }}>
        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{L.warning}</p>
      </div>
    </div>
  );
}
