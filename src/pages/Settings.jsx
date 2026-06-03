import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, Globe, User, LogOut, Shield, Bell, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Settings() {
  const { currentUser, logout, language, setLanguage, t } = useAuth();
  const { darkMode, toggleDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); };

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
            <div className={`w-5 h-5 rounded-full bg-white absolute top-1 transition-all ${darkMode ? 'right-1' : 'left-1'}`}></div>
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
          ].map(lang => (
            <button key={lang.code} onClick={() => setLanguage(lang.code)}
              className={`p-3 rounded-xl border text-center transition-all ${language === lang.code ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}
              style={{ borderColor: 'var(--border)' }}>
              <span className="text-2xl">{lang.flag}</span>
              <p className="text-sm font-medium mt-1" style={{ color: 'var(--text-primary)' }}>{lang.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Notifications */}
      <div className="card space-y-4">
        <div className="flex items-center gap-3">
          <Bell size={20} style={{ color: 'var(--accent)' }} />
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t('notificationsLabel')}</h3>
        </div>
        {[t('pushNotifs'), t('emailNotifs'), t('reminders'), t('weeklyReport')].map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{item}</span>
            <button className="w-12 h-6 rounded-full relative bg-blue-500">
              <div className="w-4 h-4 rounded-full bg-white absolute top-1 right-1"></div>
            </button>
          </div>
        ))}
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
