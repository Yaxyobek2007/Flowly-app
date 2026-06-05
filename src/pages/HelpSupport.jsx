import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HelpCircle, MessageCircle, Phone, Send, ChevronDown, ChevronRight, BookOpen, Shield, Zap, Users, Star, Calendar, Target, Bell } from 'lucide-react';

const faqs = [
  // Ilova haqida umumiy
  {
    category: 'general',
    q: { uz: "Flowly nima va u qanday ishlaydi?", ru: "Что такое Flowly и как он работает?", en: "What is Flowly and how does it work?" },
    a: { uz: "Flowly — bu shaxsiy hayotni boshqarish platformasi. Siz kunlik, haftalik, oylik va yillik rejalarni tuzasiz. Ilova ularni kuzatib boradi, eslatmalar yuboradi va statistika ko'rsatadi. Qisqacha: Plan → Act → Achieve!", ru: "Flowly — платформа управления жизнью. Вы создаёте планы (ежедневные, недельные, месячные, годовые). Приложение отслеживает их, отправляет напоминания и показывает статистику. Кратко: Plan → Act → Achieve!", en: "Flowly is a life management platform. You create plans (daily, weekly, monthly, yearly). The app tracks them, sends reminders, and shows statistics. Simply: Plan → Act → Achieve!" }
  },
  {
    category: 'general',
    q: { uz: "Ilova qanday tillarda ishlaydi?", ru: "На каких языках работает приложение?", en: "What languages does the app support?" },
    a: { uz: "Flowly 3 tilda ishlaydi: O'zbek 🇺🇿, Rus 🇷🇺 va Ingliz 🇺🇸. Tilni o'zgartirish uchun: Sozlamalar → Til bo'limiga o'ting va kerakli tilni tanlang. Barcha matn, tugmalar va sahifalar darhol o'zgaradi.", ru: "Flowly работает на 3 языках: Узбекский 🇺🇿, Русский 🇷🇺 и Английский 🇺🇸. Для смены: Настройки → Язык → выберите нужный. Все тексты, кнопки и страницы сразу изменятся.", en: "Flowly supports 3 languages: Uzbek 🇺🇿, Russian 🇷🇺, English 🇺🇸. To change: Settings → Language → select. All text, buttons, and pages will change immediately." }
  },
  // Rejalar va vazifalar
  {
    category: 'tasks',
    q: { uz: "Kunlik vazifa qanday qo'shiladi?", ru: "Как добавить ежедневную задачу?", en: "How to add a daily task?" },
    a: { uz: "Kunlik reja → 'Yangi vazifa' tugmasini bosing → Vazifa nomi, vaqti, prioriteti va kategoriyasini kiriting → 'Qo'shish' bosing. Vazifa avtomatik haftalik rejaga ham qo'shiladi.", ru: "Дневной план → нажмите 'Новая задача' → введите название, время, приоритет и категорию → нажмите 'Добавить'. Задача автоматически появится и в недельном плане.", en: "Daily Plan → click 'New task' → enter name, time, priority and category → click 'Add'. The task automatically appears in the weekly plan too." }
  },
  {
    category: 'tasks',
    q: { uz: "Nima uchun vazifani tahrirlash tugmasi yo'qolib qoldi?", ru: "Почему исчезла кнопка редактирования?", en: "Why did the edit button disappear?" },
    a: { uz: "Xavfsizlik va intizom uchun: agar vazifa vaqti o'tib ketgan bo'lsa (masalan, bugun soat 10:00 da qilish kerak edi, hozir 11:00), uni endi tahrirlash MUMKIN EMAS. Bu siz uchun motivatsiya — rejaga amal qiling! Bajarilmagan vazifalar qizil rangda ko'rinadi.", ru: "Для дисциплины: если время задачи прошло (например, нужно было в 10:00, а сейчас 11:00), редактировать НЕЛЬЗЯ. Это мотивирует следовать плану! Просроченные задачи отображаются красным.", en: "For discipline: if the task time has passed (e.g., was due at 10:00, now 11:00), editing is DISABLED. This motivates you to follow your plan! Missed tasks appear in red." }
  },
  {
    category: 'tasks',
    q: { uz: "Haftalik va oylik rejalar qanday bog'langan?", ru: "Как связаны недельный и месячный планы?", en: "How are weekly and monthly plans connected?" },
    a: { uz: "Kunlik reja → avtomatik haftalikda ko'rinadi. Oylik kalendarda har bir kunga bosganda, o'sha kunning vazifalari va voqealari ko'rinadi. Barchasi bir-biriga bog'langan — bir joyda qo'shsangiz, boshqasida ham ko'rinadi.", ru: "Дневной план → автоматически виден в недельном. В месячном календаре при нажатии на день видны задачи и события. Всё связано — добавляете в одном месте, видите в другом.", en: "Daily plan → automatically shows in weekly. In monthly calendar, clicking a day shows its tasks and events. Everything is connected — add in one place, see it everywhere." }
  },
  // Premium va to'lov
  {
    category: 'premium',
    q: { uz: "Premium (VIP) reja nimalar beradi?", ru: "Что даёт Premium (VIP) план?", en: "What does Premium (VIP) plan include?" },
    a: { uz: "VIP beradi: ✅ Cheksiz vazifalar va odatlar ✅ To'liq statistika ✅ AI tavsiyalar ✅ Geolokatsiya va xarita ✅ Sertifikatlar bo'limi ✅ SMS bildirishnomalar. Narxlar: 1 oy — $2.9 | 3 oy — $6.9 | 1 yil — $15", ru: "VIP включает: ✅ Безлимит задач и привычек ✅ Полная статистика ✅ ИИ рекомендации ✅ Геолокация и карта ✅ Сертификаты ✅ SMS уведомления. Цены: 1 мес — $2.9 | 3 мес — $6.9 | 1 год — $15", en: "VIP includes: ✅ Unlimited tasks & habits ✅ Full analytics ✅ AI recommendations ✅ Geolocation & map ✅ Certificates ✅ SMS notifications. Prices: 1 month — $2.9 | 3 months — $6.9 | 1 year — $15" }
  },
  {
    category: 'premium',
    q: { uz: "To'lovni qanday amalga oshiraman?", ru: "Как оплатить?", en: "How to make a payment?" },
    a: { uz: "Premium → Tarifni tanlang → 'Sotib olish' bosing → Karta raqami, amal qilish muddati va CVV kiriting → 'To'lash' bosing. To'lov xavfsiz (SSL). Agar ballaringiz bo'lsa, chegirma qo'llashingiz mumkin.", ru: "Premium → выберите тариф → нажмите 'Купить' → введите номер карты, срок и CVV → нажмите 'Оплатить'. Оплата безопасна (SSL). Если есть баллы, можно применить скидку.", en: "Premium → select plan → click 'Buy' → enter card number, expiry and CVV → click 'Pay'. Payment is secure (SSL). If you have points, you can apply a discount." }
  },
  {
    category: 'premium',
    q: { uz: "7 kunlik bepul VIP sinov nima?", ru: "Что такое 7-дневный бесплатный VIP?", en: "What is the 7-day free VIP trial?" },
    a: { uz: "Har bir YANGI ro'yxatdan o'tgan foydalanuvchi 7 kun davomida VIP paketning BARCHA funksiyalaridan bepul foydalanadi. 7 kundan keyin avtomatik bepul rejaga o'tadi. Davom ettirish uchun VIP tarif sotib oling.", ru: "Каждый НОВЫЙ зарегистрированный пользователь получает ВСЕ функции VIP на 7 дней БЕСПЛАТНО. Через 7 дней автоматически переходит на бесплатный план. Чтобы продолжить — купите VIP тариф.", en: "Every NEW registered user gets ALL VIP features for 7 days FREE. After 7 days, it automatically switches to free plan. To continue — purchase a VIP plan." }
  },
  // Ballar va chegirmalar
  {
    category: 'points',
    q: { uz: "Ballarni qanday to'playman?", ru: "Как копить баллы?", en: "How to earn points?" },
    a: { uz: "Ballar 2 usulda to'planadi:\n1️⃣ Kunlik kirish (streak): 1-kun=1 ball, 2-kun=2, 3-kun=5, 4-kun=7, 5-kun=8, 6-kun=12, 7-kun=15 ball\n2️⃣ Do'stlarni taklif qilish: 3 do'st=5 ball, 10=10, 50=15, 100=25, 500=49, 1000=199 ball\n\nHar kuni ilova ochilganda bonus popup chiqadi!", ru: "Баллы копятся 2 способами:\n1️⃣ Ежедневный вход (стрик): 1-день=1, 2=2, 3=5, 4=7, 5=8, 6=12, 7=15 баллов\n2️⃣ Приглашение друзей: 3 друга=5, 10=10, 50=15, 100=25, 500=49, 1000=199 баллов\n\nКаждый день при входе появляется бонус!", en: "Points earned 2 ways:\n1️⃣ Daily login (streak): Day 1=1, 2=2, 3=5, 4=7, 5=8, 6=12, 7=15 points\n2️⃣ Invite friends: 3 friends=5, 10=10, 50=15, 100=25, 500=49, 1000=199 points\n\nBonus popup appears every day when you open the app!" }
  },
  {
    category: 'points',
    q: { uz: "Ballarni nimaga ishlataman?", ru: "На что тратить баллы?", en: "What can I spend points on?" },
    a: { uz: "Ballar VIP tarifdan CHEGIRMA olish uchun ishlatiladi:\n⭐ 50 ball = 1% chegirma\n⭐ 100 ball = 3% chegirma\n⭐ 250 ball = 10% chegirma\n⭐ 1000 ball = 50% chegirma!\n\nPremium sahifasida tarif tanlaganda 'Ballarni ishlatish' tugmasini yoqing.", ru: "Баллы используются для СКИДКИ на VIP тариф:\n⭐ 50 = 1% скидка\n⭐ 100 = 3%\n⭐ 250 = 10%\n⭐ 1000 = 50%!\n\nНа странице Premium при выборе тарифа включите 'Использовать баллы'.", en: "Points are used for DISCOUNTS on VIP plans:\n⭐ 50 = 1% off\n⭐ 100 = 3% off\n⭐ 250 = 10% off\n⭐ 1000 = 50% off!\n\nOn Premium page when selecting a plan, toggle 'Use points' on." }
  },
  // Profil va akkaunt
  {
    category: 'account',
    q: { uz: "Loginni qanday o'zgartiraman?", ru: "Как изменить логин?", en: "How to change my login?" },
    a: { uz: "Profil sahifasiga o'ting → Login yonidagi 'O'zgartirish' bosing → Yangi login kiriting → Saqlang.\n\n⏳ Qoidalar: Ro'yxatdan o'tganingizdan 7 kun keyin BEPUL o'zgartiriladi. 7 kun o'tmagan bo'lsa — 100 ball evaziga o'zgartirish mumkin.", ru: "Профиль → нажмите 'Изменить' рядом с логином → введите новый → Сохранить.\n\n⏳ Правила: Через 7 дней после регистрации меняется БЕСПЛАТНО. До 7 дней — за 100 баллов.", en: "Profile → click 'Change' next to login → enter new one → Save.\n\n⏳ Rules: After 7 days from registration, change is FREE. Before 7 days — costs 100 points." }
  },
  {
    category: 'account',
    q: { uz: "Parol qanday bo'lishi kerak?", ru: "Какой должен быть пароль?", en: "What should my password be?" },
    a: { uz: "Kuchli parol talablari:\n✅ Kamida 8 ta belgi\n✅ Katta harf (A-Z)\n✅ Kichik harf (a-z)\n✅ Raqam (0-9)\n✅ Maxsus belgi (@, !, #, $ va h.k.)\n\nMisol: Mening1@Parol", ru: "Требования к паролю:\n✅ Минимум 8 символов\n✅ Заглавная буква (A-Z)\n✅ Строчная буква (a-z)\n✅ Цифра (0-9)\n✅ Спецсимвол (@, !, #, $ и т.д.)\n\nПример: Moy1@Parol", en: "Password requirements:\n✅ Minimum 8 characters\n✅ Uppercase letter (A-Z)\n✅ Lowercase letter (a-z)\n✅ Number (0-9)\n✅ Special character (@, !, #, $ etc.)\n\nExample: My1@Password" }
  },
  // Odatlar
  {
    category: 'habits',
    q: { uz: "Odat streak nima va qanday ishlaydi?", ru: "Что такое стрик привычки?", en: "What is a habit streak and how does it work?" },
    a: { uz: "Streak — bu odatni ketma-ket necha KUN bajargningiz. Har kuni odatni belgilasangiz streak oshadi. 1 kun o'tkazib yuborsangiz — streak 0 ga qaytadi!\n\nRanglar: 🟢 80%+ = Ajoyib | 🟡 50-79% = O'rtacha | 🔴 <50% = Yaxshilash kerak\n\nMishka olib borganda foiz ko'rinadi.", ru: "Стрик — это сколько ДНЕЙ подряд вы выполняли привычку. Каждый день отмечаете — стрик растёт. Пропустили 1 день — стрик обнуляется!\n\nЦвета: 🟢 80%+ = Отлично | 🟡 50-79% = Средне | 🔴 <50% = Нужно улучшить\n\nПри наведении мыши виден процент.", en: "Streak is how many consecutive DAYS you've completed a habit. Mark it daily — streak grows. Miss 1 day — streak resets to 0!\n\nColors: 🟢 80%+ = Excellent | 🟡 50-79% = Average | 🔴 <50% = Needs improvement\n\nHover over to see percentage." }
  },
  // Xarita
  {
    category: 'location',
    q: { uz: "Xaritaga joy qanday qo'shiladi?", ru: "Как добавить место на карту?", en: "How to add a place to the map?" },
    a: { uz: "Xarita → 'Joy qo'shish' bosing → Xarita ochiladi → Kerakli joyga BOSING (📍 metka qo'yiladi) → 'Metkani saqlash' → Nom va manzilni kiriting → 'Qo'shish'. Saqlangan joyga yo'l ko'rsatish uchun 🟢 tugmani bosing.", ru: "Карта → 'Добавить место' → откроется карта → НАЖМИТЕ на нужное место (появится 📍) → 'Сохранить метку' → введите имя и адрес → 'Добавить'. Для навигации к месту нажмите 🟢 кнопку.", en: "Map → 'Add place' → map opens → CLICK on desired location (📍 pin appears) → 'Save pin' → enter name and address → 'Add'. To get directions to a saved place, click the 🟢 button." }
  },
];

const categories = [
  { key: 'all', icon: BookOpen, label: { uz: 'Barchasi', ru: 'Все', en: 'All' } },
  { key: 'general', icon: HelpCircle, label: { uz: 'Umumiy', ru: 'Общее', en: 'General' } },
  { key: 'tasks', icon: Calendar, label: { uz: 'Vazifalar', ru: 'Задачи', en: 'Tasks' } },
  { key: 'premium', icon: Star, label: { uz: 'Premium', ru: 'Премиум', en: 'Premium' } },
  { key: 'points', icon: Zap, label: { uz: 'Ballar', ru: 'Баллы', en: 'Points' } },
  { key: 'account', icon: Shield, label: { uz: 'Akkaunt', ru: 'Аккаунт', en: 'Account' } },
  { key: 'habits', icon: Target, label: { uz: 'Odatlar', ru: 'Привычки', en: 'Habits' } },
  { key: 'location', icon: Bell, label: { uz: 'Xarita', ru: 'Карта', en: 'Map' } },
];

export default function HelpSupport() {
  const { t, language } = useAuth();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { from: 'bot', text: language === 'ru' ? 'Здравствуйте! Чем могу помочь?' : language === 'en' ? 'Hello! How can I help you?' : 'Salom! Flowly yordam xizmatiga xush kelibsiz. Qanday yordam bera olaman?' }
  ]);

  const lang = language || 'uz';

  const handleSendChat = () => {
    if (!chatMessage.trim()) return;
    const msg = chatMessage.toLowerCase().trim();
    setChatHistory(prev => [...prev, { from: 'user', text: chatMessage }]);
    setChatMessage('');

    setTimeout(() => {
      let reply = '';
      if (msg.includes('salom') || msg.includes('hello') || msg.includes('привет') || msg.includes('hi')) {
        reply = lang === 'ru' ? 'Здравствуйте! 👋 Чем могу помочь?' : lang === 'en' ? 'Hello! 👋 How can I help?' : 'Vaalaykum assalom! 👋 Qanday yordam bera olaman?';
      } else if (msg.includes('rahmat') || msg.includes('thanks') || msg.includes('спасибо')) {
        reply = lang === 'ru' ? 'Пожалуйста! 😊' : lang === 'en' ? "You're welcome! 😊" : "Arzimaydi! 😊";
      } else if (msg.includes('royxat') || msg.includes('register') || msg.includes('регистр') || msg.includes('kirish') || msg.includes('login')) {
        reply = lang === 'ru' ? '📝 Регистрация: нажмите Sign Up → заполните данные → пароль мин 8 символов с большой буквой и спецсимволом' : lang === 'en' ? '📝 Register: click Sign Up → fill data → password min 8 chars with uppercase and special char' : "📝 Ro'yxatdan o'tish: Sign Up bosing → ma'lumotlarni to'ldiring → parol 8+ belgi, katta harf va @!# kerak";
      } else if (msg.includes('premium') || msg.includes('tolov') || msg.includes('tarif') || msg.includes('оплат') || msg.includes('vip') || msg.includes('pul')) {
        reply = lang === 'ru' ? '💳 VIP: 1 мес — $2.9 | 3 мес — $6.9 | 1 год — $15\nPremium → выберите → введите карту → оплатите' : lang === 'en' ? '💳 VIP: 1mo — $2.9 | 3mo — $6.9 | 1yr — $15\nPremium → select → enter card → pay' : "💳 VIP: 1 oy — $2.9 | 3 oy — $6.9 | 1 yil — $15\nPremium → tanlang → karta → to'lang";
      } else if (msg.includes('bonus') || msg.includes('ball') || msg.includes('бонус') || msg.includes('point')) {
        reply = lang === 'ru' ? '⭐ Бонусы: Д1=1 | Д2=2 | Д3=5 | Д4=7 | Д5=8 | Д6=12 | Д7=15\nБаллы → скидка: 50=1% | 100=3% | 250=10% | 1000=50%' : lang === 'en' ? '⭐ Bonus: D1=1 | D2=2 | D3=5 | D4=7 | D5=8 | D6=12 | D7=15\nPoints → discount: 50=1% | 100=3% | 250=10% | 1000=50%' : "⭐ Bonus: 1-kun=1 | 2=2 | 3=5 | 4=7 | 5=8 | 6=12 | 7=15\nBall → chegirma: 50=1% | 100=3% | 250=10% | 1000=50%";
      } else if (msg.includes('dost') || msg.includes('friend') || msg.includes('друг') || msg.includes('taklif') || msg.includes('referral')) {
        reply = lang === 'ru' ? '👥 Друзья → Скопируйте ссылку → отправьте другу → он регистрируется → вы получаете баллы!' : lang === 'en' ? '👥 Friends → Copy link → send to friend → they register → you get points!' : "👥 Do'stlar → Havola nusxalang → do'stga yuboring → u ro'yxatdan o'tadi → sizga ball tushadi!";
      } else if (msg.includes('parol') || msg.includes('password') || msg.includes('пароль')) {
        reply = lang === 'ru' ? '🔑 Пароль: мин 8 символов + большая + маленькая + цифра + спецсимвол (@!#)\nЗабыли? → "Забыл пароль" → email → код (тест: 1234)' : lang === 'en' ? '🔑 Password: min 8 + uppercase + lowercase + number + special (@!#)\nForgot? → "Forgot" → email → code (test: 1234)' : "🔑 Parol: 8+ belgi + katta harf + kichik harf + raqam + @!#\nUnutdingiz? → 'Parolni unutdingizmi?' → email → kod (test: 1234)";
      } else if (msg.includes('til') || msg.includes('язык') || msg.includes('language')) {
        reply = lang === 'ru' ? '🌐 Настройки → Язык → выберите (узб/рус/англ)' : lang === 'en' ? '🌐 Settings → Language → select (uz/ru/en)' : "🌐 Sozlamalar → Til → tanlang (uz/ru/en)";
      } else if (msg.includes('operator') || msg.includes('odam') || msg.includes('человек') || msg.includes('human') || msg.includes('yordam')) {
        reply = lang === 'ru' ? '👨‍💻 Оператор подключается...\n📱 Telegram: @flowly_support\n📞 +998 98 765 43 21' : lang === 'en' ? '👨‍💻 Connecting to operator...\n📱 Telegram: @flowly_support\n📞 +998 98 765 43 21' : "👨‍💻 Operator ulanmoqda...\n📱 Telegram: @flowly_support\n📞 +998 98 765 43 21";
      } else if (msg.includes('reja') || msg.includes('vazifa') || msg.includes('task') || msg.includes('план') || msg.includes('задач')) {
        reply = lang === 'ru' ? '📋 Дневной план → "Новая задача" → заполните → "Добавить"\n⚠️ Просроченные задачи блокируются!' : lang === 'en' ? '📋 Daily → "New task" → fill → "Add"\n⚠️ Past-due tasks get locked!' : "📋 Kunlik reja → 'Yangi vazifa' → to'ldiring → 'Qo'shish'\n⚠️ Vaqti o'tgan vazifalar bloklanadi!";
      } else {
        reply = lang === 'ru' ? '🤔 Не понял. Попробуйте:\n• Опишите подробнее\n• 📸 Отправьте скриншот\n• Напишите "оператор" для связи' : lang === 'en' ? "🤔 Didn't understand. Try:\n• Describe in detail\n• 📸 Send screenshot\n• Type 'operator' for human" : "🤔 Tushunmadim. Sinab ko'ring:\n• Batafsilroq yozing\n• 📸 Rasm yuboring\n• 'operator' deb yozing";
      }
      setChatHistory(prev => [...prev, { from: 'bot', text: reply }]);
    }, 800);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setChatHistory(prev => [...prev, { from: 'user', text: '📸', image: ev.target.result }]);
      setTimeout(() => {
        const reply = lang === 'ru' ? '📸 Скриншот получен! Оператор скоро ответит.' : lang === 'en' ? '📸 Screenshot received! Operator will respond.' : "📸 Rasm qabul qilindi! Operator tez orada javob beradi.";
        setChatHistory(prev => [...prev, { from: 'bot', text: reply }]);
      }, 1000);
    };
    reader.readAsDataURL(file);
  };

  const filteredFaqs = activeCategory === 'all' ? faqs : faqs.filter(f => f.category === activeCategory);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('helpTitle')}</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('helpDesc')}</p>
      </div>

      {/* Contact Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <a href="https://t.me/flowly_support" target="_blank" rel="noopener noreferrer"
          className="card flex items-center gap-3 hover:ring-2 hover:ring-blue-300 transition-all cursor-pointer">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/20"><Send size={22} className="text-blue-500" /></div>
          <div><p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Telegram</p><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>@flowly_support</p></div>
        </a>
        <div className="card flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-green-50 dark:bg-green-900/20"><Phone size={22} className="text-green-500" /></div>
          <div><p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t('phoneSupport')}</p><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>+998 98 765 43 21</p></div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-900/20"><MessageCircle size={22} className="text-purple-500" /></div>
          <div><p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t('liveChat')}</p><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>24/7 online</p></div>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="flex gap-2 flex-wrap">
        {categories.map(cat => (
          <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${activeCategory === cat.key ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : ''}`}
            style={activeCategory !== cat.key ? { background: 'var(--bg-secondary)', color: 'var(--text-secondary)' } : {}}>
            <cat.icon size={13} />
            {cat.label[lang]}
          </button>
        ))}
      </div>

      {/* FAQ */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle size={20} style={{ color: 'var(--accent)' }} />
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t('faq')} ({filteredFaqs.length})</h3>
        </div>
        <div className="space-y-2">
          {filteredFaqs.map((faq, idx) => (
            <div key={idx} className="rounded-xl overflow-hidden transition-all" style={{ border: '1px solid var(--border)' }}>
              <button onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-900/10">
                <span className="font-medium text-sm pr-4" style={{ color: 'var(--text-primary)' }}>{faq.q[lang]}</span>
                {expandedFaq === idx ? <ChevronDown size={16} className="flex-shrink-0" style={{ color: 'var(--text-secondary)' }} /> : <ChevronRight size={16} className="flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />}
              </button>
              {expandedFaq === idx && (
                <div className="px-4 pb-4 animate-in">
                  <p className="text-sm whitespace-pre-line leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{faq.a[lang]}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Live Chat */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <MessageCircle size={20} style={{ color: 'var(--accent)' }} />
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t('liveChat')}</h3>
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-[10px] text-green-500 font-medium">Online</span>
        </div>
        <div className="h-52 overflow-y-auto mb-3 space-y-2 p-3 rounded-xl scrollbar-hide" style={{ background: 'var(--bg-secondary)' }}>
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'} animate-in`} style={{ animationDelay: `${idx * 50}ms` }}>
              <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${msg.from === 'user' ? 'bg-blue-500 text-white rounded-br-sm' : 'rounded-bl-sm'}`}
                style={msg.from === 'bot' ? { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' } : {}}>
                {msg.image && <img src={msg.image} alt="" className="w-40 h-40 object-cover rounded-lg mb-1" />}
                <span className="whitespace-pre-line">{msg.text}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder={lang === 'ru' ? 'Напишите сообщение...' : lang === 'en' ? 'Type a message...' : 'Xabar yozing...'}
            value={chatMessage} onChange={e => setChatMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendChat()}
            className="flex-1 px-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <label className="p-2.5 rounded-xl cursor-pointer transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20" style={{ border: '1px solid var(--border)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
          <button onClick={handleSendChat} className="btn-primary px-4"><Send size={16} /></button>
        </div>
      </div>
    </div>
  );
}
