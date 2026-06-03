import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const { login, loginWithGoogle, loginWithPhone, signup, language, setLanguage, t, users } = useAuth();
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoRotation, setLogoRotation] = useState(0);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [signupData, setSignupData] = useState({ name: '', surname: '', email: '', phone: '', password: '', age: '', address: '', login: '' });

  const LANGUAGES = [
    { code: 'uz', label: "O'zbekcha", flag: '🇺🇿' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
  ];

  const currentLang = LANGUAGES.find(l => l.code === language) || LANGUAGES[0];

  const handleLogoClick = () => {
    setLogoRotation(prev => prev + 360);
    window.location.reload();
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) setError(result.error);
      setLoading(false);
    }, 600);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => { loginWithGoogle(); setLoading(false); }, 800);
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!phone) return setError(t('enterPhone') || 'Telefon raqamni kiriting');
    setMode('code');
    setError('');
  };

  const handleCodeSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      const result = loginWithPhone(phone, code);
      if (!result.success) setError('Kod noto\'g\'ri. Test: 1234');
      setLoading(false);
    }, 600);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');
    if (!signupData.email || !signupData.password) return setError(t('requiredFields') || 'Email va parol majburiy');
    setLoading(true);
    setTimeout(() => {
      const result = signup(signupData);
      if (!result.success) setError(result.error);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 w-full h-full flex items-center justify-center overflow-auto"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
      
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)' }}></div>
      </div>

      <div className="w-full max-w-md px-4 py-6 relative z-10">
        {/* Language Toggle - Single Button */}
        <div className="flex justify-center mb-6 relative">
          <button onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all">
            <span>{currentLang.flag}</span>
            <span className="text-sm font-medium">{currentLang.label}</span>
            <svg className={`w-4 h-4 transition-transform ${showLangMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
          </button>
          {showLangMenu && (
            <div className="absolute top-full mt-2 w-48 rounded-xl overflow-hidden shadow-2xl animate-in z-50" style={{ background: 'rgba(30,41,59,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {LANGUAGES.map(lang => (
                <button key={lang.code} onClick={() => { setLanguage(lang.code); setShowLangMenu(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:bg-white/10 ${language === lang.code ? 'bg-blue-500/20 text-blue-300' : 'text-white/70'}`}>
                  <span className="text-lg">{lang.flag}</span>
                  <span className="text-sm font-medium">{lang.label}</span>
                  {language === lang.code && <span className="ml-auto text-blue-400">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Logo */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center cursor-pointer" onClick={handleLogoClick}>
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl shadow-blue-500/30 transition-transform duration-700"
              style={{ transform: `rotate(${logoRotation}deg)` }}>
              <span className="text-white font-bold text-xl">F</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mt-3">Flowly</h1>
          <p className="text-blue-300 font-medium text-sm mt-1">{t('slogan')}</p>
          <p className="text-white/40 text-xs mt-1">{t('description')}</p>
        </div>

        {/* Auth Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-5 shadow-2xl">
          
          {/* LOGIN */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3">
              <h2 className="text-lg font-bold text-white text-center">{t('login')}</h2>
              <input type="text" placeholder={t('email')} value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              <input type="password" placeholder={t('password')} value={password} onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
              {error && <p className="text-red-400 text-xs text-center">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold transition-all shadow-lg shadow-blue-500/30 disabled:opacity-50 hover:from-blue-600 hover:to-blue-700">
                {loading ? '...' : t('login')}
              </button>
              <button type="button" onClick={() => setMode('reset')} className="w-full text-xs text-blue-300 hover:text-blue-200">{t('forgotPassword')}</button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/20"></div></div>
                <div className="relative flex justify-center"><span className="px-3 text-xs text-white/40">{t('orLoginWith')}</span></div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button type="button" onClick={handleGoogleLogin} className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  <span className="text-[10px] text-white/60">Google</span>
                </button>
                <button type="button" className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  <span className="text-[10px] text-white/60">iCloud</span>
                </button>
                <button type="button" onClick={() => setMode('phone')} className="flex flex-col items-center gap-1 p-2.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                  <span className="text-[10px] text-white/60">{t('phoneLogin')}</span>
                </button>
              </div>

              <p className="text-center text-xs text-white/40">
                {t('noAccount')} <button type="button" onClick={() => setMode('signup')} className="text-blue-300 font-medium">{t('signup')}</button>
              </p>
            </form>
          )}

          {/* SIGNUP */}
          {mode === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-3">
              <h2 className="text-lg font-bold text-white text-center">{t('signup')}</h2>
              <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder={t('name')} value={signupData.name} onChange={e => setSignupData({...signupData, name: e.target.value})}
                  className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                <input type="text" placeholder={t('surname')} value={signupData.surname} onChange={e => setSignupData({...signupData, surname: e.target.value})}
                  className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <input type="email" placeholder="Email" value={signupData.email} onChange={e => setSignupData({...signupData, email: e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              <input type="text" placeholder="Login (@username)" value={signupData.login} onChange={e => setSignupData({...signupData, login: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '')})}
                className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              <input type="tel" placeholder={t('phone')} value={signupData.phone} onChange={e => setSignupData({...signupData, phone: e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              <input type="password" placeholder={t('password')} value={signupData.password} onChange={e => setSignupData({...signupData, password: e.target.value})}
                className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder={t('age')} value={signupData.age} onChange={e => setSignupData({...signupData, age: e.target.value})}
                  className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                <input type="text" placeholder={t('address')} value={signupData.address} onChange={e => setSignupData({...signupData, address: e.target.value})}
                  className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              {error && <p className="text-red-400 text-xs text-center">{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold transition-all shadow-lg disabled:opacity-50">
                {loading ? '...' : t('createAccount')}
              </button>
              <p className="text-center text-xs text-white/40">
                {t('haveAccount')} <button type="button" onClick={() => setMode('login')} className="text-blue-300 font-medium">{t('login')}</button>
              </p>
            </form>
          )}

          {/* PHONE */}
          {mode === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-3">
              <h2 className="text-lg font-bold text-white text-center">{t('phoneLogin')}</h2>
              <input type="tel" placeholder="+998 XX XXX XX XX" value={phone} onChange={e => setPhone(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500" />
              {error && <p className="text-red-400 text-xs text-center">{error}</p>}
              <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg">{t('sendCode')}</button>
              <button type="button" onClick={() => setMode('login')} className="w-full text-xs text-white/40">{t('back')}</button>
            </form>
          )}

          {/* CODE */}
          {mode === 'code' && (
            <form onSubmit={handleCodeSubmit} className="space-y-3">
              <h2 className="text-lg font-bold text-white text-center">{t('enterCode')}</h2>
              <p className="text-xs text-center text-white/50">{phone}</p>
              <div className="flex justify-center gap-2">
                {[0,1,2,3].map(i => (
                  <input key={i} type="text" maxLength="1" value={code[i] || ''}
                    onChange={e => { const v = e.target.value; const c = code.split(''); c[i] = v; setCode(c.join('')); if (v && e.target.nextSibling) e.target.nextSibling.focus(); }}
                    className="w-12 h-12 text-center text-xl font-bold rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:ring-2 focus:ring-blue-500" />
                ))}
              </div>
              {error && <p className="text-red-400 text-xs text-center">{error}</p>}
              <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg disabled:opacity-50">
                {loading ? '...' : t('verifyCode')}
              </button>
              <button type="button" onClick={() => setMode('phone')} className="w-full text-xs text-white/40">{t('back')}</button>
            </form>
          )}

          {/* RESET */}
          {mode === 'reset' && (
            <form onSubmit={e => { e.preventDefault(); setMode('login'); }} className="space-y-3">
              <h2 className="text-lg font-bold text-white text-center">{t('resetPassword')}</h2>
              <input type="text" placeholder={t('email')} value={email} onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg">{t('sendCode')}</button>
              <button type="button" onClick={() => setMode('login')} className="w-full text-xs text-white/40">{t('back')}</button>
            </form>
          )}

          {/* STAFF ANALYTICS */}
          {mode === 'staff' && (
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white text-center">
                {language === 'ru' ? 'Аналитика' : language === 'en' ? 'Staff Analytics' : 'Xodimlar Analizi'}
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-white/10 text-center">
                  <p className="text-2xl font-bold text-blue-300">{users.length}</p>
                  <p className="text-[10px] text-white/50">{language === 'ru' ? 'Всего пользователей' : language === 'en' ? 'Total users' : 'Jami foydalanuvchilar'}</p>
                </div>
                <div className="p-3 rounded-xl bg-white/10 text-center">
                  <p className="text-2xl font-bold text-green-300">{users.filter(u => u.plan !== 'free').length}</p>
                  <p className="text-[10px] text-white/50">Premium</p>
                </div>
              </div>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {users.map(u => (
                  <div key={u.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                    <div>
                      <p className="text-xs text-white/80 font-medium">{u.name} {u.surname}</p>
                      <p className="text-[10px] text-white/40">{u.email}</p>
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${u.plan === 'vip' ? 'bg-purple-500/30 text-purple-300' : 'bg-white/10 text-white/50'}`}>{u.plan}</span>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setMode('login')} className="w-full text-xs text-white/40">{t('back')}</button>
            </div>
          )}
        </div>

        <p className="text-center text-[10px] text-white/20 mt-4">© 2026 Flowly. Yaxyobek Nematillaev</p>

        {/* Staff Analytics Access */}
        <div className="text-center mt-3">
          <button onClick={() => setMode('staff')}
            className="text-[11px] text-white/30 hover:text-white/60 transition-colors underline">
            {language === 'ru' ? 'Аналитика (для сотрудников)' : language === 'en' ? 'Analytics (staff)' : 'Analiz (xodimlar uchun)'}
          </button>
        </div>
      </div>
    </div>
  );
}
