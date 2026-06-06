import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { createUserInDB, updateUserInDB, getAllUsersFromDB, onUsersChange, setUserOnline, updateUserLocation, findUserByReferralCode, firebaseSignUp, firebaseSignIn, firebaseSignOut } from '../firebase';
import { translations } from '../translations';

const AuthContext = createContext();

// Admin credentials — encoded for basic protection
const _a = atob('WWFhMDcwNzIwMDdA'); // decoded at runtime
const defaultUsers = [
  {
    id: 'admin',
    email: 'admin@flowly.uz',
    phone: '+998930057077',
    password: _a,
    login: 'Nemchik',
    name: 'Yaxyobek',
    surname: 'Nematillaev',
    age: 18,
    address: 'Andijon, O\'zbekiston',
    avatar: null,
    role: 'admin',
    plan: 'vip',
    planExpiry: null,
    points: 500,
    trialEndsAt: null,
    joinedAt: '2026-01-01',
    referralCode: 'YAXY2026',
    referredBy: null,
    friends: [],
    language: 'uz',
    loginStreak: 7,
    lastLoginDate: '2026-06-02',
    totalLogins: 120,
    blocked: false,
    deleted: false,
  }
];

// Translations imported from separate file

export function AuthProvider({ children }) {
  // Data version — only reset if major breaking change (not on every deploy)
  const DATA_VERSION = 'v7';
  if (localStorage.getItem('flowly-data-version') !== DATA_VERSION) {
    localStorage.removeItem('flowly-users');
    localStorage.removeItem('flowly-current-user');
    localStorage.removeItem('flowly-tasks');
    localStorage.removeItem('flowly-habits');
    localStorage.removeItem('flowly-goals');
    localStorage.removeItem('flowly-notes');
    localStorage.removeItem('flowly-events');
    localStorage.removeItem('flowly-notifications');
    localStorage.removeItem('flowly-certificates');
    localStorage.removeItem('flowly-locations');
    localStorage.removeItem('flowly-notif-settings');
    localStorage.removeItem('flowly-last-activity');
    localStorage.setItem('flowly-data-version', DATA_VERSION);
  }

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('flowly-users');
    return saved ? JSON.parse(saved) : defaultUsers;
  });

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('flowly-current-user');
    return saved ? JSON.parse(saved) : null;
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('flowly-language') || 'uz';
  });

  useEffect(() => { localStorage.setItem('flowly-users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('flowly-current-user', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('flowly-language', language); }, [language]);

  // ===== FIREBASE SYNC =====
  const firebaseListenerRef = useRef(null);

  // Sync current user to Firebase on any change
  useEffect(() => {
    if (currentUser && currentUser.id) {
      const syncData = { ...currentUser };
      delete syncData.password;
      try { createUserInDB(syncData).catch(() => {}); } catch(e) {}
    }
  }, [currentUser?.id, currentUser?.points, currentUser?.plan, currentUser?.avatar, currentUser?.name]);

  // Listen to ALL users from Firebase (real-time) for admin panel
  useEffect(() => {
    if (firebaseListenerRef.current) return; // already listening
    firebaseListenerRef.current = onUsersChange((firebaseUsers) => {
      if (firebaseUsers.length > 0) {
        // Merge firebase users with local (keep passwords from local)
        setUsers(prev => {
          const merged = [...prev];
          firebaseUsers.forEach(fbUser => {
            const existsIdx = merged.findIndex(u => u.id === fbUser.id);
            if (existsIdx >= 0) {
              // Keep local password, merge rest from firebase
              merged[existsIdx] = { ...merged[existsIdx], ...fbUser, password: merged[existsIdx].password };
            } else {
              // New user from another device — add to local
              merged.push({ ...fbUser, password: '' });
            }
          });
          return merged;
        });
      }
    });
    return () => { if (firebaseListenerRef.current) firebaseListenerRef.current(); };
  }, []);

  // Online status + auto-register device session on login
  useEffect(() => {
    if (!currentUser) return;

    // Set online
    setUserOnline(currentUser.id, true).catch(() => {});

    // Register device session in Firebase (so other devices can see it)
    const registerSession = async () => {
      try {
        const { addDeviceSession, updateDeviceSession } = await import('../firebase');
        const existingId = sessionStorage.getItem('flowly-session-id');
        const sessionId = existingId || `s_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
        sessionStorage.setItem('flowly-session-id', sessionId);

        const ua = navigator.userAgent;
        let deviceType = 'desktop', browser = 'Browser', os = 'Unknown';
        if (/Mobi|Android/i.test(ua)) deviceType = 'mobile';
        else if (/Tablet|iPad/i.test(ua)) deviceType = 'tablet';
        if (/Chrome/i.test(ua) && !/Edge/i.test(ua)) browser = 'Chrome';
        else if (/Firefox/i.test(ua)) browser = 'Firefox';
        else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
        else if (/Edge/i.test(ua)) browser = 'Edge';
        if (/Windows/i.test(ua)) os = 'Windows';
        else if (/Mac/i.test(ua)) os = 'macOS';
        else if (/Android/i.test(ua)) os = 'Android';
        else if (/iPhone|iPad/i.test(ua)) os = 'iOS';
        else if (/Linux/i.test(ua)) os = 'Linux';

        await addDeviceSession(currentUser.id, { id: sessionId, deviceType, browser, os });

        // Keep session alive every 45 sec
        const interval = setInterval(() => {
          updateDeviceSession(currentUser.id, sessionId).catch(() => {});
        }, 45000);

        return () => clearInterval(interval);
      } catch(e) {}
    };
    const cleanup = registerSession();

    // Set offline on page close
    const handleUnload = () => {
      setUserOnline(currentUser.id, false).catch(() => {});
    };
    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
      if (currentUser?.id) setUserOnline(currentUser.id, false).catch(() => {});
      if (cleanup && typeof cleanup.then === 'function') cleanup.then(fn => fn && fn());
    };
  }, [currentUser?.id]);

  // Auto-renewal check: if plan expired and autoRenew is on, renew automatically
  useEffect(() => {
    if (!currentUser || !currentUser.planExpiry || !currentUser.autoRenew) return;
    const expiry = new Date(currentUser.planExpiry);
    const now = new Date();
    if (now > expiry && currentUser.plan === 'vip' && currentUser.lastCard) {
      // Auto-renew for 1 month
      const newExpiry = new Date();
      newExpiry.setMonth(newExpiry.getMonth() + 1);
      const autoPayment = {
        date: new Date().toISOString(),
        amount: 2.9,
        cardLast4: currentUser.lastCard.last4,
        cardExpiry: currentUser.lastCard.expiry,
        plan: 'vip',
        months: 1,
        discount: 0,
        type: 'auto-renewal',
      };
      const updated = {
        ...currentUser,
        planExpiry: newExpiry.toISOString(),
        payments: [...(currentUser.payments || []), autoPayment],
      };
      setCurrentUser(updated);
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
    }
  }, [currentUser]);

  const t = (key) => translations[language]?.[key] || translations['en'][key] || key;

  const login = (emailOrPhone, password) => {
    // Admin shortcut: yaxyobek + admin123 goes directly to admin panel
    const user = users.find(u => (u.email === emailOrPhone || u.phone === emailOrPhone || u.login === emailOrPhone) && u.password === password);
    if (user) {
      if (user.blocked) return { success: false, error: language === 'ru' ? 'Аккаунт заблокирован' : language === 'en' ? 'Account blocked' : 'Akkaunt bloklangan' };
      const updated = { ...user, totalLogins: (user.totalLogins || 0) + 1 };
      setCurrentUser(updated);
      setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
      return { success: true, isAdmin: user.role === 'admin' };
    }
    return { success: false, error: language === 'ru' ? 'Неверные данные' : language === 'en' ? 'Invalid credentials' : 'Noto\'g\'ri ma\'lumotlar' };
  };

  const loginWithGoogle = () => {
    // Google/iCloud tugmasi - foydalanuvchi avval ro'yxatdan o'tishi kerak
    return { success: false, error: language === 'ru' ? 'Сначала зарегистрируйтесь через форму' : language === 'en' ? 'Please register via form first' : "Avval forma orqali ro'yxatdan o'ting" };
  };

  const loginWithPhone = (phone, code) => {
    const user = users.find(u => u.phone === phone);
    if (user && code === '1234') { setCurrentUser(user); return { success: true }; }
    return { success: false, error: 'Invalid code' };
  };

  const signup = (userData) => {
    const exists = users.find(u => u.email === userData.email || u.phone === userData.phone || u.login === userData.login);
    if (exists) return { success: false, error: t('haveAccount') };

    // Password validation: min 8 chars, uppercase, lowercase, number, special char
    const pass = userData.password;
    if (pass.length < 8) return { success: false, error: language === 'ru' ? 'Пароль мин. 8 символов' : language === 'en' ? 'Password min 8 characters' : 'Parol kamida 8 ta belgi' };
    if (!/[A-Z]/.test(pass)) return { success: false, error: language === 'ru' ? 'Нужна заглавная буква' : language === 'en' ? 'Need uppercase letter' : 'Katta harf kerak' };
    if (!/[a-z]/.test(pass)) return { success: false, error: language === 'ru' ? 'Нужна строчная буква' : language === 'en' ? 'Need lowercase letter' : 'Kichik harf kerak' };
    if (!/[0-9]/.test(pass)) return { success: false, error: language === 'ru' ? 'Нужна цифра' : language === 'en' ? 'Need a number' : 'Raqam kerak' };
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pass)) return { success: false, error: language === 'ru' ? 'Нужен спецсимвол (@, !, # и т.д.)' : language === 'en' ? 'Need special char (@, !, # etc.)' : 'Maxsus belgi kerak (@, !, # va h.k.)' };

    const newUser = {
      id: Date.now().toString(),
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      login: userData.login || userData.email.split('@')[0],
      name: userData.name || '',
      surname: userData.surname || '',
      age: userData.age || '',
      address: userData.address || '',
      avatar: null,
      role: 'user',
      plan: 'free',
      planExpiry: null,
      points: 10,
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      joinedAt: new Date().toISOString().split('T')[0],
      referralCode: 'FL' + Date.now().toString(36).toUpperCase(),
      referredBy: userData.referralCode || null,
      friends: [],
      language: language,
      loginStreak: 1,
      lastLoginDate: new Date().toISOString().split('T')[0],
      totalLogins: 1,
    };

    // Save new user
    const updatedUsers = [...users, newUser];
    
    // Referral bonus: if signed up via referral, reward the referrer
    if (userData.referralCode) {
      const referrer = updatedUsers.find(u => u.referralCode === userData.referralCode);
      if (referrer) {
        const referrerFriends = [...(referrer.friends || []), newUser.id];
        const friendCount = referrerFriends.length;
        let bonus = 2;
        if (friendCount >= 1000) bonus = 199;
        else if (friendCount >= 500) bonus = 49;
        else if (friendCount >= 100) bonus = 25;
        else if (friendCount >= 50) bonus = 15;
        else if (friendCount >= 10) bonus = 10;
        else if (friendCount >= 3) bonus = 5;

        const finalUsers = updatedUsers.map(u => u.id === referrer.id ? {
          ...u,
          friends: referrerFriends,
          points: (u.points || 0) + bonus,
        } : u);
        setUsers(finalUsers);
        // Update referrer in Firebase
        updateUserInDB(referrer.id, { friends: referrerFriends, points: (referrer.points || 0) + bonus }).catch(() => {});
      } else {
        setUsers(updatedUsers);
      }
    } else {
      setUsers(updatedUsers);
    }

    setCurrentUser(newUser);
    // Save to Firebase
    const fbData = { ...newUser };
    delete fbData.password;
    createUserInDB(fbData).catch(() => {});

    return { success: true };
  };

  const logout = () => { setCurrentUser(null); };

  const updateProfile = (data) => {
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers(users.map(u => u.id === updated.id ? updated : u));
  };

  const updateUserByAdmin = (userId, data) => {
    setUsers(users.map(u => u.id === userId ? { ...u, ...data } : u));
  };

  const addPoints = (amount) => {
    if (currentUser) {
      const updated = { ...currentUser, points: currentUser.points + amount };
      setCurrentUser(updated);
      setUsers(users.map(u => u.id === updated.id ? updated : u));
    }
  };

  // Daily bonus check - returns bonus info if applicable
  const checkDailyBonus = () => {
    if (!currentUser) return null;
    const today = new Date().toISOString().split('T')[0];
    if (currentUser.lastLoginDate === today) return null; // already claimed today

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const isConsecutive = currentUser.lastLoginDate === yesterday;
    const newStreak = isConsecutive ? (currentUser.loginStreak || 0) + 1 : 1;

    // Bonus table: day 1=1, 2=2, 3=5, 4=7, 5=8, 6=12, 7=15
    const bonusTable = [0, 1, 2, 5, 7, 8, 12, 15];
    const dayIndex = Math.min(newStreak, 7);
    const bonus = bonusTable[dayIndex];

    return { streak: newStreak, bonus, dayIndex };
  };

  const claimDailyBonus = () => {
    const bonusInfo = checkDailyBonus();
    if (!bonusInfo || !currentUser) return null;

    const today = new Date().toISOString().split('T')[0];
    const updated = {
      ...currentUser,
      points: currentUser.points + bonusInfo.bonus,
      loginStreak: bonusInfo.streak,
      lastLoginDate: today,
      totalLogins: (currentUser.totalLogins || 0) + 1,
    };
    setCurrentUser(updated);
    setUsers(users.map(u => u.id === updated.id ? updated : u));
    return bonusInfo;
  };

  // Points shop - discount calculation
  const getPointsDiscount = (points) => {
    if (points >= 1000) return 50;
    if (points >= 250) return 10;
    if (points >= 100) return 3;
    if (points >= 50) return 1;
    return 0;
  };

  // Purchase plan with card
  const purchasePlan = (planType, months, paymentRecord) => {
    if (!currentUser) return false;
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + months);
    const payments = currentUser.payments || [];
    const updated = {
      ...currentUser,
      plan: planType,
      planExpiry: expiry.toISOString(),
      autoRenew: true,
      lastCard: paymentRecord ? { last4: paymentRecord.cardLast4, expiry: paymentRecord.cardExpiry } : currentUser.lastCard,
      payments: [...payments, paymentRecord].filter(Boolean),
    };
    setCurrentUser(updated);
    setUsers(users.map(u => u.id === updated.id ? updated : u));
    return true;
  };

  // Change login - allowed after 7 days OR costs 100 points
  const canChangeLogin = () => {
    if (!currentUser) return { canFree: false, canWithPoints: false };
    const joinDate = new Date(currentUser.joinedAt);
    const now = new Date();
    const daysSinceJoin = Math.floor((now - joinDate) / (1000 * 60 * 60 * 24));
    const canFree = daysSinceJoin >= 7;
    const canWithPoints = currentUser.points >= 100;
    return { canFree, canWithPoints, daysSinceJoin };
  };

  const changeLogin = (newLogin) => {
    if (!currentUser) return { success: false };
    const { canFree, canWithPoints } = canChangeLogin();
    if (!canFree && !canWithPoints) return { success: false, error: language === 'ru' ? '7 дней не прошло и мало баллов' : language === 'en' ? '7 days not passed and not enough points' : '7 kun o\'tmagan va ball yetarli emas' };

    // Check if login taken
    const taken = users.find(u => u.login === newLogin && u.id !== currentUser.id);
    if (taken) return { success: false, error: language === 'ru' ? 'Логин занят' : language === 'en' ? 'Login taken' : 'Login band' };

    let pointsToDeduct = 0;
    if (!canFree) pointsToDeduct = 100;

    const updated = { ...currentUser, login: newLogin, points: currentUser.points - pointsToDeduct };
    setCurrentUser(updated);
    setUsers(users.map(u => u.id === updated.id ? updated : u));
    return { success: true };
  };

  // Referral rewards table: friends_count → bonus_points
  const getReferralBonus = (friendsCount) => {
    if (friendsCount >= 1000) return 199;
    if (friendsCount >= 500) return 49;
    if (friendsCount >= 100) return 25;
    if (friendsCount >= 50) return 15;
    if (friendsCount >= 10) return 10;
    if (friendsCount >= 3) return 5;
    return 0;
  };

  // Spend points for discount
  const spendPoints = (amount) => {
    if (!currentUser || currentUser.points < amount) return false;
    const updated = { ...currentUser, points: currentUser.points - amount };
    setCurrentUser(updated);
    setUsers(users.map(u => u.id === updated.id ? updated : u));
    return true;
  };

  return (
    <AuthContext.Provider value={{
      currentUser, users, language, setLanguage, t,
      login, loginWithGoogle, loginWithPhone, signup, logout,
      updateProfile, updateUserByAdmin, addPoints,
      checkDailyBonus, claimDailyBonus, getPointsDiscount, purchasePlan, spendPoints,
      changeLogin, canChangeLogin, getReferralBonus,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
