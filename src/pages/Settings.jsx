import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Globe, User, LogOut, Shield, Bell, Palette, BellRing, BellOff, Vibrate, Mail, Clock, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { currentUser, logout, language, setLanguage, t, updateProfile } = useAuth();
  const { darkMode, toggleDark } = useTheme();
  const navigate = useNavigate();
  const lang = language || 'uz';

  // Notification settings - stored per user
  const [notifSettings, setNotifSettings] = useState(() => {
    const saved = localStorage.getItem('flowly-notif-settings');
    return saved ? JSON.parse(saved) : {
      push: true,
      email: true,
      reminders: true,
      weeklyReport: true,
      taskReminder: true,
      vibration: true,
      sound: true,
      reminderMinutes: 5,
    };
  });
  const [permissionStatus, setPermissionStatus] = useState('default');
  const [testSent, setTestSent] = useState(false);

  // Check notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setPermissionStatus(Notification.permission);
    }
  }, []);

  // Save settings
  useEffect(() => {
    localStorage.setItem('flowly-notif-settings', JSON.stringify(notifSettings));
  }, [notifSettings]);

  const toggleSetting = (key) => {
    setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Request notification permission
  const requestPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setPermissionStatus(permission);
      if (permission === 'granted') {
        // Show a test notification
        new Notification('Flowly 🎉', {
          body: lang === 'ru' ? 'Уведомления включены!' : lang === 'en' ? 'Notifications enabled!' : 'Bildirishnomalar yoqildi!',
          icon: '/favicon.svg',
        });
      }
    }
  };

  // Play sound effect
  const playSound = (type) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.connect(g);
      g.connect(ctx.destination);
      if (type === 'default') {
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);
        g.gain.setValueAtTime(0.3, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.start(); osc.stop(ctx.currentTime + 0.5);
      } else if (type === 'success') {
        osc.frequency.setValueAtTime(523, ctx.currentTime);
        osc.frequency.setValueAtTime(659, ctx.currentTime + 0.1);
        osc.frequency.setValueAtTime(784, ctx.currentTime + 0.2);
        g.gain.setValueAtTime(0.25, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        osc.start(); osc.stop(ctx.currentTime + 0.4);
      } else if (type === 'warning') {
        osc.type = 'square';
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        g.gain.setValueAtTime(0.15, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        osc.start(); osc.stop(ctx.currentTime + 0.3);
      }
    } catch(e) {}
  };

  // Send test notification with sound
  const sendTestNotification = () => {
    if (notifSettings.sound) playSound('default');
    if (notifSettings.vibration && 'vibrate' in navigator) navigator.vibrate([200, 100, 200]);

    if (permissionStatus === 'granted') {
      new Notification('Flowly — Test ✅', {
        body: lang === 'ru' ? 'Это тестовое уведомление! Всё работает.' : lang === 'en' ? 'This is a test notification! Everything works.' : 'Bu test bildirishnomasi! Hammasi ishlayapti.',
        icon: '/favicon.svg',
        tag: 'test-notif',
      });
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    } else {
      requestPermission();
    }
  };

  const handleLogout = () => { logout(); };

  // Notification items config
  const notifItems = [
    { key: 'push', icon: BellRing, label: t('pushNotifs'), desc: lang === 'ru' ? 'Всплывающие уведомления в браузере' : lang === 'en' ? 'Browser push notifications' : 'Brauzerda popup bildirishnomalar' },
    { key: 'email', icon: Mail, label: t('emailNotifs'), desc: lang === 'ru' ? 'Важные события на email' : lang === 'en' ? 'Important events to email' : 'Muhim voqealar emailga' },
    { key: 'reminders', icon: Clock, label: t('reminders'), desc: lang === 'ru' ? 'Напоминание за 5 мин до задачи' : lang === 'en' ? 'Remind 5 min before task' : 'Vazifadan 5 daqiqa oldin eslatma' },
    { key: 'weeklyReport', icon: Calendar, label: t('weeklyReport'), desc: lang === 'ru' ? 'Еженедельный отчёт по воскресеньям' : lang === 'en' ? 'Weekly report on Sundays' : 'Yakshanba kuni haftalik hisobot' },
    { key: 'taskReminder', icon: Bell, label: lang === 'ru' ? 'Напоминание о задачах' : lang === 'en' ? 'Task reminders' : 'Vazifa eslatmalari', desc: lang === 'ru' ? 'Звук и вибрация при напоминании' : lang === 'en' ? 'Sound and vibration for reminders' : 'Eslatmada tovush va vibratsiya' },
    { key: 'vibration', icon: Vibrate, label: lang === 'ru' ? 'Вибрация' : lang === 'en' ? 'Vibration' : 'Vibratsiya', desc: lang === 'ru' ? 'Вибрировать при уведомлениях' : lang === 'en' ? 'Vibrate on notifications' : 'Bildirishnomada tebranish' },
    { key: 'sound', icon: BellRing, label: lang === 'ru' ? 'Звук' : lang === 'en' ? 'Sound' : 'Tovush', desc: lang === 'ru' ? 'Звуковой эффект при уведомлении' : lang === 'en' ? 'Sound effect on notification' : 'Bildirishnomada ovoz effekti' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('settingsTitle')}</h1>

      {/* Appearance */}
      <div className="card space-y-4">
        <div className="flex items-center gap-3">
          <Palette size={20} style={{ color: 'var(--accent)' }} />
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t('appearance')}</h3>
        </div>
        <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex items-center gap-3">
            {darkMode ? <Moon size={18} className="text-blue-400" /> : <Sun size={18} className="text-yellow-500" />}
            <span style={{ color: 'var(--text-primary)' }}>{darkMode ? t('darkTheme') : t('lightTheme')}</span>
          </div>
          <button onClick={toggleDark}
            className={`w-14 h-7 rounded-full relative transition-all ${darkMode ? 'bg-blue-500' : 'bg-gray-300'}`}>
            <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all shadow ${darkMode ? 'right-1' : 'left-1'}`}></div>
          </button>
        </div>
      </div>

      {/* Language */}
      <div className="card space-y-4">
        <div className="flex items-center gap-3">
          <Globe size={20} style={{ color: 'var(--accent)' }} />
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t('languageLabel')}</h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { code: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
            { code: 'ru', label: 'Русский', flag: '🇷🇺' },
            { code: 'en', label: 'English', flag: '🇺🇸' },
          ].map(l => (
            <button key={l.code} onClick={() => setLanguage(l.code)}
              className={`p-3 rounded-xl border text-center transition-all ${language === l.code ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}
              style={{ borderColor: 'var(--border)' }}>
              <span className="text-2xl">{l.flag}</span>
              <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-primary)' }}>{l.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* ===== NOTIFICATIONS - FULL WORKING ===== */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell size={20} style={{ color: 'var(--accent)' }} />
            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t('notificationsLabel')}</h3>
          </div>
          {/* Permission status badge */}
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
            permissionStatus === 'granted' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
            permissionStatus === 'denied' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
            'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
          }`}>
            {permissionStatus === 'granted' ? '✓ ' + (lang === 'ru' ? 'Разрешено' : lang === 'en' ? 'Allowed' : 'Ruxsat berilgan') :
             permissionStatus === 'denied' ? '✗ ' + (lang === 'ru' ? 'Заблокировано' : lang === 'en' ? 'Blocked' : 'Bloklangan') :
             '⚠ ' + (lang === 'ru' ? 'Не запрошено' : lang === 'en' ? 'Not requested' : "So'ralmagan")}
          </span>
        </div>

        {/* Permission request button */}
        {permissionStatus !== 'granted' && (
          <button onClick={requestPermission}
            className="w-full p-3 rounded-xl border-2 border-dashed transition-all hover:bg-blue-50 dark:hover:bg-blue-900/10 flex items-center justify-center gap-2"
            style={{ borderColor: 'var(--accent)' }}>
            <BellRing size={18} style={{ color: 'var(--accent)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
              {lang === 'ru' ? 'Разрешить уведомления' : lang === 'en' ? 'Allow Notifications' : 'Bildirishnomalarni yoqish'}
            </span>
          </button>
        )}

        {/* Notification toggles */}
        <div className="space-y-2">
          {notifItems.map(item => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-xl transition-all" style={{ background: 'var(--bg-secondary)' }}>
              <div className="flex items-center gap-3">
                <item.icon size={16} style={{ color: notifSettings[item.key] ? 'var(--accent)' : 'var(--text-secondary)' }} />
                <div>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.label}</span>
                  <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{item.desc}</p>
                </div>
              </div>
              <button onClick={() => toggleSetting(item.key)}
                className={`w-12 h-6 rounded-full relative transition-all ${notifSettings[item.key] ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all shadow ${notifSettings[item.key] ? 'right-1' : 'left-1'}`}></div>
              </button>
            </div>
          ))}
        </div>

        {/* Reminder time setting */}
        <div className="p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {lang === 'ru' ? 'Напомнить за' : lang === 'en' ? 'Remind before' : 'Eslatma vaqti'}
              </p>
              <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                {lang === 'ru' ? 'Минут до начала задачи' : lang === 'en' ? 'Minutes before task starts' : 'Vazifa boshlanishidan necha daqiqa oldin'}
              </p>
            </div>
            <select value={notifSettings.reminderMinutes}
              onChange={e => setNotifSettings(prev => ({...prev, reminderMinutes: parseInt(e.target.value)}))}
              className="px-3 py-1.5 rounded-lg border text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'var(--bg-primary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}>
              <option value={1}>1 {lang === 'ru' ? 'мин' : 'min'}</option>
              <option value={5}>5 {lang === 'ru' ? 'мин' : 'min'}</option>
              <option value={10}>10 {lang === 'ru' ? 'мин' : 'min'}</option>
              <option value={15}>15 {lang === 'ru' ? 'мин' : 'min'}</option>
              <option value={30}>30 {lang === 'ru' ? 'мин' : 'min'}</option>
              <option value={60}>1 {lang === 'ru' ? 'час' : lang === 'en' ? 'hour' : 'soat'}</option>
            </select>
          </div>
        </div>

        {/* Test notification button */}
        <button onClick={sendTestNotification}
          className={`w-full p-3 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 ${
            testSent ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'
          }`}>
          {testSent ? (
            <>✓ {lang === 'ru' ? 'Отправлено!' : lang === 'en' ? 'Sent!' : 'Yuborildi!'}</>
          ) : (
            <><BellRing size={16} /> {lang === 'ru' ? 'Отправить тестовое уведомление' : lang === 'en' ? 'Send test notification' : 'Test bildirishnoma yuborish'}</>
          )}
        </button>

        {/* Info */}
        {permissionStatus === 'denied' && (
          <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800">
            <p className="text-xs text-red-600 dark:text-red-400">
              ⚠️ {lang === 'ru' ? 'Уведомления заблокированы в настройках браузера. Разрешите их вручную в настройках сайта.' :
                   lang === 'en' ? 'Notifications are blocked in browser settings. Please allow them manually in site settings.' :
                   'Bildirishnomalar brauzer sozlamalarida bloklangan. Sayt sozlamalarida qo\'lda ruxsat bering.'}
            </p>
          </div>
        )}
      </div>

      {/* Account Actions */}
      <div className="card space-y-3">
        <div className="flex items-center gap-3">
          <Shield size={20} style={{ color: 'var(--accent)' }} />
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t('account')}</h3>
        </div>
        <button onClick={() => navigate('/profile')}
          className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/10"
          style={{ background: 'var(--bg-secondary)' }}>
          <User size={18} style={{ color: 'var(--text-secondary)' }} />
          <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{t('viewProfile')}</span>
        </button>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-red-50 dark:hover:bg-red-900/10"
          style={{ background: 'var(--bg-secondary)' }}>
          <LogOut size={18} className="text-red-500" />
          <span className="text-sm text-red-500">{t('logout')}</span>
        </button>
      </div>
    </div>
  );
}
