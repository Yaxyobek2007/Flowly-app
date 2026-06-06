import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Globe, User, LogOut, Shield, Bell, Palette, BellRing, BellOff, Vibrate, Mail, Clock, Calendar, Monitor, Smartphone, Tablet, Wifi, WifiOff, Trash2 } from 'lucide-react';
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
      weeklyReport: false,
      taskReminder: false,
      vibration: false,
      sound: false,
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
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        setPermissionStatus(permission);
        if (permission === 'granted') {
          new Notification('Flowly 🎉', {
            body: lang === 'ru' ? 'Уведомления включены!' : lang === 'en' ? 'Notifications enabled!' : 'Bildirishnomalar yoqildi!',
            icon: '/favicon.svg',
          });
        }
      }
    } catch(e) { /* Permission request may fail in some contexts */ }
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

  // Notification items config - only essential ones
  const notifItems = [
    { key: 'email', icon: Mail, label: t('emailNotifs'), desc: lang === 'ru' ? 'Важные события на email' : lang === 'en' ? 'Important events to email' : 'Muhim voqealar emailga' },
    { key: 'reminders', icon: Clock, label: t('reminders'), desc: lang === 'ru' ? 'Напоминание за 5 мин до задачи' : lang === 'en' ? 'Remind 5 min before task' : 'Vazifadan 5 daqiqa oldin eslatma' },
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

      {/* Active Devices / Sessions */}
      <ActiveDevices lang={lang} currentUser={currentUser} />

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



// ===== Active Devices Component (Firebase Real-time) =====
function ActiveDevices({ lang, currentUser }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const sessionIdRef = useRef(null);

  // Detect current device info
  const getCurrentDevice = () => {
    const ua = navigator.userAgent;
    let deviceType = 'desktop';
    let browser = 'Browser';
    let os = 'Unknown';

    if (/Mobi|Android/i.test(ua)) deviceType = 'mobile';
    else if (/Tablet|iPad/i.test(ua)) deviceType = 'tablet';

    if (/Chrome/i.test(ua) && !/Edge/i.test(ua)) browser = 'Chrome';
    else if (/Firefox/i.test(ua)) browser = 'Firefox';
    else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
    else if (/Edge/i.test(ua)) browser = 'Edge';
    else if (/Opera|OPR/i.test(ua)) browser = 'Opera';

    if (/Windows/i.test(ua)) os = 'Windows';
    else if (/Mac/i.test(ua)) os = 'macOS';
    else if (/Linux/i.test(ua) && !/Android/i.test(ua)) os = 'Linux';
    else if (/Android/i.test(ua)) os = 'Android';
    else if (/iPhone|iPad/i.test(ua)) os = 'iOS';

    return { deviceType, browser, os };
  };

  useEffect(() => {
    if (!currentUser?.id) { setLoading(false); return; }

    // Import firebase functions
    import('../firebase').then(({ addDeviceSession, updateDeviceSession, removeDeviceSession, removeAllDeviceSessions, onSessionsChange }) => {
      // Generate unique session ID for this browser tab
      const existingId = sessionStorage.getItem('flowly-session-id');
      const sessionId = existingId || `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem('flowly-session-id', sessionId);
      sessionIdRef.current = sessionId;

      const device = getCurrentDevice();

      // Register this session in Firebase
      addDeviceSession(currentUser.id, {
        id: sessionId,
        ...device,
        isCurrent: true,
      }).catch(() => {});

      // Listen to all sessions in real-time
      const unsubscribe = onSessionsChange(currentUser.id, (firebaseSessions) => {
        // Mark current session
        const mapped = firebaseSessions.map(s => ({
          ...s,
          isCurrent: s.id === sessionId,
          // Convert Firestore timestamp to Date string
          lastActive: s.lastActive?.toDate?.() ? s.lastActive.toDate().toISOString() : s.lastActive || new Date().toISOString(),
          loginAt: s.createdAt?.toDate?.() ? s.createdAt.toDate().toISOString() : s.createdAt || new Date().toISOString(),
        }));
        setSessions(mapped);
        setLoading(false);
      });

      // Update lastActive every 45 seconds
      const interval = setInterval(() => {
        updateDeviceSession(currentUser.id, sessionId).catch(() => {});
      }, 45000);

      // Cleanup on unmount
      return () => {
        unsubscribe();
        clearInterval(interval);
      };
    });
  }, [currentUser?.id]);

  const removeSession = async (targetSessionId) => {
    if (!currentUser?.id) return;
    const { removeDeviceSession } = await import('../firebase');
    await removeDeviceSession(currentUser.id, targetSessionId).catch(() => {});
  };

  const removeAll = async () => {
    if (!currentUser?.id) return;
    const currentId = sessionIdRef.current;
    const { removeAllDeviceSessions } = await import('../firebase');
    await removeAllDeviceSessions(currentUser.id, currentId).catch(() => {});
  };

  const getDeviceIcon = (type) => {
    if (type === 'mobile') return Smartphone;
    if (type === 'tablet') return Tablet;
    return Monitor;
  };

  const getTimeAgo = (dateStr) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 2) return lang === 'ru' ? 'Сейчас' : lang === 'en' ? 'Now' : 'Hozir';
    if (mins < 60) return `${mins} ${lang === 'ru' ? 'мин назад' : lang === 'en' ? 'min ago' : 'daq oldin'}`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} ${lang === 'ru' ? 'ч назад' : lang === 'en' ? 'h ago' : 'soat oldin'}`;
    const days = Math.floor(hrs / 24);
    return `${days} ${lang === 'ru' ? 'дн назад' : lang === 'en' ? 'd ago' : 'kun oldin'}`;
  };

  const isOnline = (dateStr) => {
    if (!dateStr) return false;
    return (Date.now() - new Date(dateStr).getTime()) < 90000; // 1.5 min
  };

  const L = {
    title: lang === 'ru' ? 'Активные устройства' : lang === 'en' ? 'Active Devices' : 'Faol qurilmalar',
    current: lang === 'ru' ? 'Это устройство' : lang === 'en' ? 'This device' : 'Bu qurilma',
    online: lang === 'ru' ? 'Онлайн' : lang === 'en' ? 'Online' : 'Online',
    logoutAll: lang === 'ru' ? 'Завершить все' : lang === 'en' ? 'End all others' : 'Barchasini tugatish',
    remove: lang === 'ru' ? 'Завершить' : lang === 'en' ? 'End' : 'Tugatish',
    loginAt: lang === 'ru' ? 'Вход' : lang === 'en' ? 'Login' : 'Kirish',
    noOther: lang === 'ru' ? 'Других устройств нет' : lang === 'en' ? 'No other devices' : 'Boshqa qurilma yo\'q',
  };

  if (loading) {
    return (
      <div className="card flex items-center justify-center py-6">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Monitor size={20} style={{ color: 'var(--accent)' }} />
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{L.title}</h3>
          <span className="text-[10px] px-2 py-0.5 rounded-full font-bold" style={{ background: 'var(--bg-secondary)', color: 'var(--accent)' }}>{sessions.length}</span>
        </div>
        {sessions.length > 1 && (
          <button onClick={removeAll} className="text-[10px] px-2.5 py-1 rounded-lg font-medium transition-colors hover:bg-red-50 dark:hover:bg-red-900/10 text-red-500">
            {L.logoutAll}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {sessions
          .sort((a, b) => (b.isCurrent ? 1 : 0) - (a.isCurrent ? 1 : 0) || new Date(b.lastActive || 0) - new Date(a.lastActive || 0))
          .map(session => {
            const DeviceIcon = getDeviceIcon(session.deviceType);
            const online = isOnline(session.lastActive);
            return (
              <div key={session.id} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${session.isCurrent ? 'ring-1 ring-blue-500/30' : ''}`}
                style={{ background: 'var(--bg-secondary)' }}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${session.isCurrent ? 'bg-blue-500/10' : online ? 'bg-green-500/10' : 'bg-gray-100 dark:bg-gray-800'}`}>
                  <DeviceIcon size={18} className={session.isCurrent ? 'text-blue-500' : online ? 'text-green-500' : ''} style={!session.isCurrent && !online ? { color: 'var(--text-secondary)' } : {}} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {session.browser || '?'} • {session.os || '?'}
                    </p>
                    {session.isCurrent && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 font-bold flex-shrink-0">
                        {L.current}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${online ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                    <span className="text-[10px]" style={{ color: online ? '#22c55e' : 'var(--text-secondary)' }}>
                      {online ? L.online : getTimeAgo(session.lastActive)}
                    </span>
                    {session.loginAt && (
                      <>
                        <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>•</span>
                        <span className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>
                          {new Date(session.loginAt).toLocaleDateString()}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {!session.isCurrent && (
                  <button onClick={() => removeSession(session.id)}
                    className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 flex-shrink-0 transition-colors"
                    title={L.remove}>
                    <Trash2 size={14} className="text-red-400" />
                  </button>
                )}
              </div>
            );
          })}
      </div>

      {sessions.length <= 1 && (
        <p className="text-center text-xs py-2" style={{ color: 'var(--text-secondary)' }}>✓ {L.noOther}</p>
      )}
    </div>
  );
}
