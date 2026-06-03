import { useAuth } from '../context/AuthContext';
import { Crown, Check, X, Zap, Star } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: { uz: 'Bepul', ru: 'Бесплатно', en: 'Free' },
    price: '$0',
    period: { uz: 'Abadiy', ru: 'Навсегда', en: 'Forever' },
    color: 'from-gray-500 to-gray-600',
    features: [
      { uz: 'Kunlik rejalashtirish', ru: 'Ежедневное планирование', en: 'Daily planning', included: true },
      { uz: 'Haftalik rejalashtirish', ru: 'Еженедельное планирование', en: 'Weekly planning', included: true },
      { uz: '3 ta odat tracking', ru: '3 привычки', en: '3 habits tracking', included: true },
      { uz: '5 ta yozuv', ru: '5 заметок', en: '5 notes', included: true },
      { uz: 'AI tavsiyalar', ru: 'ИИ рекомендации', en: 'AI recommendations', included: false },
      { uz: 'Statistika', ru: 'Статистика', en: 'Statistics', included: false },
      { uz: 'Geolokatsiya', ru: 'Геолокация', en: 'Geolocation', included: false },
      { uz: 'Cheksiz odatlar', ru: 'Безлимит привычек', en: 'Unlimited habits', included: false },
    ]
  },
  {
    id: 'vip',
    name: { uz: 'VIP', ru: 'VIP', en: 'VIP' },
    prices: [
      { period: { uz: '1 oylik', ru: '1 месяц', en: '1 month' }, price: '$2.9' },
      { period: { uz: '3 oylik', ru: '3 месяца', en: '3 months' }, price: '$6.9' },
      { period: { uz: '1 yillik', ru: '1 год', en: '1 year' }, price: '$15' },
    ],
    color: 'from-blue-500 to-purple-500',
    popular: true,
    features: [
      { uz: 'Bepul rejadagi barcha xususiyatlar', ru: 'Все бесплатные функции', en: 'All free features', included: true },
      { uz: 'Cheksiz vazifalar', ru: 'Безлимит задач', en: 'Unlimited tasks', included: true },
      { uz: 'Cheksiz odatlar', ru: 'Безлимит привычек', en: 'Unlimited habits', included: true },
      { uz: "To'liq statistika", ru: 'Полная статистика', en: 'Full statistics', included: true },
      { uz: 'AI tavsiyalar', ru: 'ИИ рекомендации', en: 'AI recommendations', included: true },
      { uz: "Sertifikatlar bo'limi", ru: 'Сертификаты', en: 'Certificates', included: true },
      { uz: 'Geolokatsiya & Xarita', ru: 'Геолокация и карта', en: 'Geolocation & Map', included: true },
      { uz: 'SMS bildirishnomalar', ru: 'SMS уведомления', en: 'SMS notifications', included: true },
    ]
  },
];

export default function Premium() {
  const { currentUser, language, t } = useAuth();
  const lang = language || 'uz';

  const getReferralDiscount = () => {
    const friends = currentUser?.friends?.length || 0;
    if (friends >= 10) return { discount: '30%', monthlyPrice: '$2.0' };
    if (friends >= 5) return { discount: '20%', monthlyPrice: '$2.3' };
    if (friends >= 3) return { discount: '10%', monthlyPrice: '$2.6' };
    return { discount: '0%', monthlyPrice: '$2.9' };
  };

  const { discount, monthlyPrice } = getReferralDiscount();
  const isTrialActive = currentUser?.trialEndsAt && new Date(currentUser.trialEndsAt) > new Date();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{t('premiumTitle')}</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{t('premiumDesc')}</p>
      </div>

      {/* Trial Banner */}
      {isTrialActive && (
        <div className="card text-center" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(147,51,234,0.1))' }}>
          <Zap size={24} className="text-blue-500 mx-auto mb-2" />
          <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>{t('trialBanner')}</h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            {t('trialEnds')}: {new Date(currentUser.trialEndsAt).toLocaleDateString()}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{t('allFeaturesOpen')}</p>
        </div>
      )}

      {/* Referral Discount */}
      {discount !== '0%' && (
        <div className="card flex items-center gap-3 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
          <Star size={24} className="text-green-500" />
          <div>
            <p className="font-semibold text-green-700 dark:text-green-400">{t('referralDiscount')}</p>
            <p className="text-sm text-green-600 dark:text-green-500">
              {currentUser?.friends?.length || 0} {t('friends')} — VIP: <b>{monthlyPrice}/{lang === 'ru' ? 'мес' : lang === 'en' ? 'mo' : 'oy'}</b> ({discount} {lang === 'ru' ? 'скидка' : lang === 'en' ? 'off' : 'chegirma'})
            </p>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className={`card relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-bold">
                {t('popular')}
              </div>
            )}
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mx-auto mb-4`}>
              <Crown size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-center" style={{ color: 'var(--text-primary)' }}>{plan.name[lang]}</h3>
            
            {/* Pricing */}
            {plan.prices ? (
              <div className="mt-3 space-y-2">
                {plan.prices.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{p.period[lang]}</span>
                    <span className="text-lg font-bold" style={{ color: 'var(--accent)' }}>{p.price}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center mt-2">
                <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{plan.price}</span>
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}> {plan.period[lang]}</span>
              </div>
            )}

            <div className="space-y-2 mt-5">
              {plan.features.map((f, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {f.included ? <Check size={16} className="text-green-500" /> : <X size={16} className="text-gray-300" />}
                  <span className={`text-sm ${f.included ? '' : 'opacity-50'}`} style={{ color: 'var(--text-primary)' }}>{f[lang]}</span>
                </div>
              ))}
            </div>
            <button className={`w-full mt-5 py-3 rounded-xl font-semibold transition-all ${
              currentUser?.plan === plan.id
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 cursor-default'
                : `bg-gradient-to-r ${plan.color} text-white hover:opacity-90 shadow-lg`
            }`} disabled={currentUser?.plan === plan.id}>
              {currentUser?.plan === plan.id ? `✓ ${t('currentPlan')}` : t('selectPlan')}
            </button>
          </div>
        ))}
      </div>

      {/* Points */}
      <div className="card">
        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>⭐ {t('pointsSystem')}</h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{t('pointsDesc')}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
            <p className="text-lg font-bold text-orange-500">2</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>1 {t('dayActivity')}</p>
          </div>
          <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
            <p className="text-lg font-bold text-orange-500">4</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>2 {t('consecutive')}</p>
          </div>
          <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
            <p className="text-lg font-bold text-orange-500">6</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>5 {t('consecutive')}</p>
          </div>
          <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
            <p className="text-lg font-bold text-orange-500">14</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>7 {t('fullWeek')}</p>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10">
          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
            <b>VIP:</b> 300 {t('points')} = 1 {lang === 'ru' ? 'месяц' : lang === 'en' ? 'month' : 'oylik'} VIP
          </p>
        </div>
      </div>
    </div>
  );
}
