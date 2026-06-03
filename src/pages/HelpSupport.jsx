import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { HelpCircle, MessageCircle, Phone, Send, ChevronDown, ChevronRight } from 'lucide-react';

const faqs = [
  {
    q: { uz: "Nechta til bor?", ru: "Сколько языков?", en: "How many languages?" },
    a: { uz: "Flowly'da 3 ta til mavjud: O'zbek, Rus va Ingliz tillari. Tilni Settings yoki Auth sahifasidan o'zgartirish mumkin.", ru: "В Flowly 3 языка: узбекский, русский и английский. Язык можно изменить в Настройках или на странице входа.", en: "Flowly has 3 languages: Uzbek, Russian, and English. You can change it in Settings or on the Auth page." }
  },
  {
    q: { uz: "Premium narxlari qanday?", ru: "Какие цены Premium?", en: "What are Premium prices?" },
    a: { uz: "VIP: 1 oylik — $2.9, 3 oylik — $6.9, 1 yillik — $15. Referral orqali chegirma olish mumkin.", ru: "VIP: 1 месяц — $2.9, 3 месяца — $6.9, 1 год — $15. Скидки через реферальную программу.", en: "VIP: 1 month — $2.9, 3 months — $6.9, 1 year — $15. Discounts available through referral program." }
  },
  {
    q: { uz: "Do'stni qanday taklif qilaman?", ru: "Как пригласить друга?", en: "How to invite a friend?" },
    a: { uz: "Do'stlar bo'limiga o'ting → Taklif havolasini nusxalang → Do'stingizga yuboring. Har bir yangi foydalanuvchi uchun 10 ball olasiz.", ru: "Перейдите в раздел Друзья → Скопируйте ссылку → Отправьте другу. За каждого нового пользователя вы получаете 10 баллов.", en: "Go to Friends section → Copy invite link → Send to friend. You get 10 points for each new user." }
  },
  {
    q: { uz: "7 kunlik VIP sinov nima?", ru: "Что такое 7-дневный VIP?", en: "What is the 7-day VIP trial?" },
    a: { uz: "Har bir yangi foydalanuvchi 7 kun bepul VIP paketda ishlata oladi. 7 kundan keyin bepul rejaga o'tadi yoki pullik tarif sotib oladi.", ru: "Каждый новый пользователь получает 7 дней VIP. После переходит на бесплатный план или покупает подписку.", en: "Every new user gets 7 days of free VIP. After that, they switch to free plan or purchase a subscription." }
  },
  {
    q: { uz: "Odatlarni qanday belgilayman?", ru: "Как отмечать привычки?", en: "How to mark habits?" },
    a: { uz: "Habit Tracker bo'limida odat ustiga bosing. Agar kunlik maqsad 2x bo'lsa, 2 marta bajarilganini belgilang.", ru: "В разделе Привычки нажмите на привычку. Если дневная цель 2x, отметьте 2 раза.", en: "In Habit Tracker, click on the habit. If daily target is 2x, mark it twice." }
  },
  {
    q: { uz: "Bildirishnomalar qanday ishlaydi?", ru: "Как работают уведомления?", en: "How do notifications work?" },
    a: { uz: "Har bir vazifa vaqtidan 5 daqiqa oldin eslatma keladi. Muhim voqealar uchun 1 kun, 1 soat va 5 daqiqa oldin bildirishnoma yuboriladi.", ru: "За 5 минут до задачи приходит напоминание. Для важных событий — за 1 день, 1 час и 5 минут.", en: "Reminders come 5 minutes before each task. For important events — 1 day, 1 hour, and 5 minutes before." }
  },
  {
    q: { uz: "Geolokatsiya qanday ishlaydi?", ru: "Как работает геолокация?", en: "How does geolocation work?" },
    a: { uz: "Xarita bo'limida joylarni saqlang. Voqea vaqti kelganda, Google Maps orqali yo'l ko'rsatish olasiz.", ru: "Сохраняйте места на Карте. Когда придёт время, получите маршрут через Google Maps.", en: "Save places in Map. When event time comes, get directions via Google Maps." }
  },
];

export default function HelpSupport() {
  const { t, language } = useAuth();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { from: 'bot', text: language === 'ru' ? 'Здравствуйте! Чем могу помочь?' : language === 'en' ? 'Hello! How can I help you?' : 'Salom! Flowly yordam xizmatiga xush kelibsiz. Qanday yordam bera olaman?' }
  ]);

  const handleSendChat = () => {
    if (!chatMessage.trim()) return;
    setChatHistory([...chatHistory, { from: 'user', text: chatMessage }]);
    setTimeout(() => {
      const reply = language === 'ru' ? 'Спасибо! Сообщение принято. Оператор скоро ответит.' : language === 'en' ? 'Thank you! Message received. An operator will respond shortly.' : 'Rahmat! Xabaringiz qabul qilindi. Operator tez orada javob beradi.';
      setChatHistory(prev => [...prev, { from: 'bot', text: reply }]);
    }, 1000);
    setChatMessage('');
  };

  const lang = language || 'uz';

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
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-900/20"><Send size={22} className="text-blue-500" /></div>
          <div><p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t('telegram')}</p><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>@flowly_support</p></div>
        </a>
        <div className="card flex items-center gap-3">
          <div className="p-2 rounded-xl bg-green-50 dark:bg-green-900/20"><Phone size={22} className="text-green-500" /></div>
          <div><p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t('phoneSupport')}</p><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>+998 98 765 43 21</p></div>
        </div>
        <div className="card flex items-center gap-3">
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-900/20"><MessageCircle size={22} className="text-purple-500" /></div>
          <div><p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{t('liveChat')}</p><p className="text-xs" style={{ color: 'var(--text-secondary)' }}>24/7 online</p></div>
        </div>
      </div>

      {/* FAQ */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <HelpCircle size={20} style={{ color: 'var(--accent)' }} />
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{t('faq')}</h3>
        </div>
        <div className="space-y-2">
          {faqs.map((faq, idx) => (
            <div key={idx} className="rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              <button onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left transition-colors hover:bg-blue-50/50 dark:hover:bg-blue-900/10">
                <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{faq.q[lang]}</span>
                {expandedFaq === idx ? <ChevronDown size={16} style={{ color: 'var(--text-secondary)' }} /> : <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} />}
              </button>
              {expandedFaq === idx && (
                <div className="px-4 pb-4 animate-in">
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{faq.a[lang]}</p>
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
        </div>
        <div className="h-48 overflow-y-auto mb-3 space-y-2 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
          {chatHistory.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${msg.from === 'user' ? 'bg-blue-500 text-white' : ''}`}
                style={msg.from === 'bot' ? { background: 'var(--bg-card)', color: 'var(--text-primary)', border: '1px solid var(--border)' } : {}}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder={language === 'ru' ? 'Напишите сообщение...' : language === 'en' ? 'Type a message...' : 'Xabar yozing...'}
            value={chatMessage} onChange={e => setChatMessage(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSendChat()}
            className="flex-1 px-4 py-2 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
          <button onClick={handleSendChat} className="btn-primary px-4"><Send size={16} /></button>
        </div>
      </div>
    </div>
  );
}
