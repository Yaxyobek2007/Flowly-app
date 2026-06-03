import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const defaultUsers = [
  {
    id: 'admin',
    email: 'admin@flowly.uz',
    phone: '+998930057077',
    password: 'admin123',
    name: 'Yaxyobek',
    surname: 'Nematillaev',
    age: 18,
    address: 'Andijon, O\'zbekiston',
    avatar: null,
    role: 'admin',
    plan: 'pro_plus',
    points: 500,
    trialEndsAt: null,
    joinedAt: '2026-01-01',
    referralCode: 'YAXY2026',
    referredBy: null,
    friends: [],
    language: 'uz',
    loginCode: null,
  }
];

export function AuthProvider({ children }) {
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

  const translations = {
    uz: {
      welcome: "Xush kelibsiz",
      login: "Kirish",
      signup: "Ro'yxatdan o'tish",
      email: "Email yoki telefon",
      password: "Parol",
      phone: "Telefon raqam",
      code: "Tasdiqlash kodi",
      sendCode: "Kod yuborish",
      verifyCode: "Kodni tasdiqlash",
      resetPassword: "Parolni tiklash",
      orLoginWith: "Yoki kirish",
      google: "Google",
      icloud: "iCloud",
      phoneLogin: "Telefon orqali",
      forgotPassword: "Parolni unutdingizmi?",
      noAccount: "Akkauntingiz yo'qmi?",
      haveAccount: "Akkauntingiz bormi?",
      name: "Ism",
      surname: "Familya",
      age: "Yosh",
      address: "Manzil",
      selectLanguage: "Tilni tanlang",
      createAccount: "Akkaunt yaratish",
      enterCode: "Kodni kiriting",
      back: "Orqaga",
      slogan: "Plan. Act. Achieve.",
      description: "Hayotingizni boshqaring — kunlik, haftalik, oylik va yillik rejalar bilan",
    },
    ru: {
      welcome: "Добро пожаловать",
      login: "Войти",
      signup: "Регистрация",
      email: "Email или телефон",
      password: "Пароль",
      phone: "Номер телефона",
      code: "Код подтверждения",
      sendCode: "Отправить код",
      verifyCode: "Подтвердить код",
      resetPassword: "Сбросить пароль",
      orLoginWith: "Или войти через",
      google: "Google",
      icloud: "iCloud",
      phoneLogin: "По телефону",
      forgotPassword: "Забыли пароль?",
      noAccount: "Нет аккаунта?",
      haveAccount: "Уже есть аккаунт?",
      name: "Имя",
      surname: "Фамилия",
      age: "Возраст",
      address: "Адрес",
      selectLanguage: "Выберите язык",
      createAccount: "Создать аккаунт",
      enterCode: "Введите код",
      back: "Назад",
      slogan: "Plan. Act. Achieve.",
      description: "Управляйте жизнью — ежедневные, еженедельные, ежемесячные и годовые планы",
    },
    en: {
      welcome: "Welcome",
      login: "Sign In",
      signup: "Sign Up",
      email: "Email or phone",
      password: "Password",
      phone: "Phone number",
      code: "Verification code",
      sendCode: "Send Code",
      verifyCode: "Verify Code",
      resetPassword: "Reset Password",
      orLoginWith: "Or sign in with",
      google: "Google",
      icloud: "iCloud",
      phoneLogin: "Phone",
      forgotPassword: "Forgot password?",
      noAccount: "Don't have an account?",
      haveAccount: "Already have an account?",
      name: "First Name",
      surname: "Last Name",
      age: "Age",
      address: "Address",
      selectLanguage: "Select Language",
      createAccount: "Create Account",
      enterCode: "Enter code",
      back: "Back",
      slogan: "Plan. Act. Achieve.",
      description: "Manage your life — daily, weekly, monthly, and yearly plans",
    }
  };

  const t = (key) => translations[language]?.[key] || translations['en'][key] || key;

  const login = (emailOrPhone, password) => {
    const user = users.find(u => (u.email === emailOrPhone || u.phone === emailOrPhone) && u.password === password);
    if (user) {
      setCurrentUser(user);
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const loginWithGoogle = () => {
    // Simulated Google login
    const gUser = users.find(u => u.email === 'admin@flowly.uz') || users[0];
    if (gUser) {
      setCurrentUser(gUser);
      return { success: true };
    }
    return { success: false };
  };

  const loginWithPhone = (phone, code) => {
    const user = users.find(u => u.phone === phone);
    if (user && code === '1234') {
      setCurrentUser(user);
      return { success: true };
    }
    return { success: false, error: 'Invalid code' };
  };

  const signup = (userData) => {
    const exists = users.find(u => u.email === userData.email || u.phone === userData.phone);
    if (exists) return { success: false, error: 'User already exists' };

    const newUser = {
      id: Date.now().toString(),
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      name: userData.name || '',
      surname: userData.surname || '',
      age: userData.age || '',
      address: userData.address || '',
      avatar: null,
      role: 'user',
      plan: 'free',
      points: 0,
      trialEndsAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      joinedAt: new Date().toISOString().split('T')[0],
      referralCode: 'FL' + Date.now().toString(36).toUpperCase(),
      referredBy: userData.referralCode || null,
      friends: [],
      language: language,
      loginCode: null,
    };

    setUsers([...users, newUser]);
    setCurrentUser(newUser);

    // If referred, give bonus to referrer
    if (userData.referralCode) {
      const referrer = users.find(u => u.referralCode === userData.referralCode);
      if (referrer) {
        setUsers(prev => prev.map(u => u.id === referrer.id ? { ...u, points: u.points + 10, friends: [...u.friends, newUser.id] } : u));
      }
    }

    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

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

  return (
    <AuthContext.Provider value={{
      currentUser, users, language, setLanguage, t,
      login, loginWithGoogle, loginWithPhone, signup, logout,
      updateProfile, updateUserByAdmin, addPoints,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
