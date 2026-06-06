import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const { login, loginWithPhone, signup, language, setLanguage, t } = useAuth();
  const [mode, setMode] = useState('login');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [logoRotation, setLogoRotation] = useState(0);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetCodeSent, setResetCodeSent] = useState(false);
  const [resetCodeVerified, setResetCodeVerified] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [signupData, setSignupData] = useState({ name: '', surname: '', email: '', phone: '', password: '', age: '', address: '', login: '', referralCode: '' });

  // Check URL for referral code on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref) {
      setSignupData(prev => ({ ...prev, referralCode: ref }));
      setMode('signup'); // auto-switch to signup if referral link
    }
  }, []);

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
      // If admin logs in (yaxyobek/admin123), they'll see CRM in sidebar
      setLoading(false);
    }, 600);
  };

  const handleGoogleLogin = () => {
    setMode('signup');
    setError('');
  };

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (!phone) return setError(t('enterPhone'));
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
    if (!signupData.email || !signupData.password) return setError(t('requiredFields'));
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
        {/* Language Toggle */}
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
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder={t('password')} value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 transition-all pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 text-sm">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
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

              <div className="grid grid-cols-1 gap-2">
                <button type="button" onClick={() => setMode('phone')} className="flex items-center justify-center gap-2 p-3 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 transition-all">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                  <span className="text-sm text-white/80 font-medium">{t('phoneLogin')}</span>
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
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder={t('password')} value={signupData.password} onChange={e => setSignupData({...signupData, password: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 text-sm pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 text-sm">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input type="number" placeholder={t('age')} value={signupData.age} onChange={e => setSignupData({...signupData, age: e.target.value})}
                  className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
                <input type="text" placeholder={t('address')} value={signupData.address} onChange={e => setSignupData({...signupData, address: e.target.value})}
                  className="px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
              </div>
              <input type="text" placeholder={language === 'ru' ? 'Реферальный код (если есть)' : language === 'en' ? 'Referral code (if any)' : 'Referral kod (agar bo\'lsa)'}
                value={signupData.referralCode} onChange={e => setSignupData({...signupData, referralCode: e.target.value.toUpperCase()})}
                className="w-full px-3 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
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
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-white text-center">{t('resetPassword')}</h2>
              {!resetCodeSent ? (
                <>
                  <input type="text" placeholder={t('email')} value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500" />
                  {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                  <button type="button" onClick={() => { if (!email) { setError(t('requiredFields')); return; } setResetCodeSent(true); setError(''); }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg">{t('sendCode')}</button>
                </>
              ) : !resetCodeVerified ? (
                <>
                  <p className="text-xs text-center text-white/50">{email} {language === 'ru' ? 'отправлен код' : language === 'en' ? 'code sent' : 'ga kod yuborildi'}</p>
                  <div className="flex justify-center gap-2">
                    {[0,1,2,3].map(i => (
                      <input key={i} type="text" maxLength="1" value={resetCode[i] || ''}
                        onChange={e => { const v = e.target.value; const c = resetCode.split(''); c[i] = v; setResetCode(c.join('')); if (v && e.target.nextSibling) e.target.nextSibling.focus(); }}
                        className="w-12 h-12 text-center text-xl font-bold rounded-xl bg-white/10 border border-white/20 text-white outline-none focus:ring-2 focus:ring-blue-500" />
                    ))}
                  </div>
                  {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                  <button type="button" onClick={() => { if (resetCode === '1234') { setResetCodeVerified(true); setError(''); } else { setError(language === 'ru' ? 'Неверный код (тест: 1234)' : language === 'en' ? 'Wrong code (test: 1234)' : 'Kod noto\'g\'ri (test: 1234)'); } }}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold shadow-lg">{t('verifyCode')}</button>
                </>
              ) : (
                <>
                  <p className="text-xs text-center text-green-400">✓ {language === 'ru' ? 'Код подтверждён! Введите новый пароль:' : language === 'en' ? 'Code verified! Enter new password:' : 'Kod tasdiqlandi! Yangi parol kiriting:'}</p>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} placeholder={language === 'ru' ? 'Новый пароль' : language === 'en' ? 'New password' : 'Yangi parol'} value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 pr-12" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 text-sm">{showPassword ? '🙈' : '👁️'}</button>
                  </div>
                  <div className="relative">
                    <input type={showPassword ? 'text' : 'password'} placeholder={language === 'ru' ? 'Повторите пароль' : language === 'en' ? 'Confirm password' : 'Parolni tasdiqlang'} value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 outline-none focus:ring-2 focus:ring-blue-500 pr-12" />
                  </div>
                  {error && <p className="text-red-400 text-xs text-center">{error}</p>}
                  <button type="button" onClick={() => {
                    if (newPassword !== confirmPassword) { setError(language === 'ru' ? 'Пароли не совпадают' : language === 'en' ? 'Passwords don\'t match' : 'Parollar mos emas'); return; }
                    if (newPassword.length < 8) { setError(language === 'ru' ? 'Мин. 8 символов' : language === 'en' ? 'Min 8 chars' : 'Kamida 8 belgi'); return; }
                    // Reset successful
                    setMode('login'); setResetCodeSent(false); setResetCodeVerified(false); setResetCode(''); setNewPassword(''); setConfirmPassword('');
                  }} className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold shadow-lg">
                    {language === 'ru' ? 'Сохранить новый пароль' : language === 'en' ? 'Save new password' : 'Yangi parolni saqlash'}
                  </button>
                </>
              )}
              <button type="button" onClick={() => { setMode('login'); setResetCodeSent(false); setResetCodeVerified(false); setResetCode(''); }} className="w-full text-xs text-white/40">{t('back')}</button>
            </div>
          )}
        </div>

        <p className="text-center text-[10px] text-white/20 mt-4">© 2026 Flowly. Yaxyobek Nematillaev</p>
      </div>
    </div>
  );
}
