import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Crown, Check, X, Zap, Star, CreditCard, Lock } from 'lucide-react';

export default function Premium() {
  const { currentUser, language, t, purchasePlan, spendPoints, getPointsDiscount } = useAuth();
  const [selectedTier, setSelectedTier] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [cardForm, setCardForm] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [usePointsDiscount, setUsePointsDiscount] = useState(false);

  const lang = language || 'uz';

  const tiers = [
    { id: 'free', months: 0, price: 0, label: { uz: 'Bepul', ru: 'Бесплатно', en: 'Free' }, period: { uz: 'Abadiy', ru: 'Навсегда', en: 'Forever' } },
    { id: 'vip-1', months: 1, price: 2.9, label: { uz: '1 oylik VIP', ru: '1 месяц VIP', en: '1 Month VIP' }, period: { uz: '1 oy', ru: '1 мес', en: '1 mo' } },
    { id: 'vip-3', months: 3, price: 6.9, label: { uz: '3 oylik VIP', ru: '3 месяца VIP', en: '3 Months VIP' }, period: { uz: '3 oy', ru: '3 мес', en: '3 mo' }, save: '21%' },
    { id: 'vip-12', months: 12, price: 15, label: { uz: '1 yillik VIP', ru: '1 год VIP', en: '1 Year VIP' }, period: { uz: '1 yil', ru: '1 год', en: '1 yr' }, save: '57%', popular: true },
  ];

  const freeFeatures = [
    { uz: 'Kunlik rejalashtirish', ru: 'Ежедневное планирование', en: 'Daily planning' },
    { uz: 'Haftalik rejalashtirish', ru: 'Еженедельное планирование', en: 'Weekly planning' },
    { uz: '3 ta odat', ru: '3 привычки', en: '3 habits' },
    { uz: '5 ta yozuv', ru: '5 заметок', en: '5 notes' },
  ];

  const vipFeatures = [
    { uz: 'Cheksiz vazifalar va odatlar', ru: 'Безлимит задач и привычек', en: 'Unlimited tasks & habits' },
    { uz: "To'liq statistika va AI", ru: 'Полная статистика и ИИ', en: 'Full analytics & AI' },
    { uz: 'Geolokatsiya & Xarita', ru: 'Геолокация и карта', en: 'Geolocation & Map' },
    { uz: 'Sertifikatlar', ru: 'Сертификаты', en: 'Certificates' },
    { uz: 'SMS bildirishnomalar', ru: 'SMS уведомления', en: 'SMS notifications' },
    { uz: 'Ustuvor yordam', ru: 'Приоритетная поддержка', en: 'Priority support' },
  ];

  const userPoints = currentUser?.points || 0;
  const discountPercent = getPointsDiscount(userPoints);
  const isTrialActive = currentUser?.trialEndsAt && new Date(currentUser.trialEndsAt) > new Date();

  const getDiscountedPrice = (price) => {
    if (!usePointsDiscount || discountPercent === 0) return price;
    return (price * (100 - discountPercent) / 100).toFixed(2);
  };

  const getPointsCost = () => {
    if (discountPercent >= 50) return 1000;
    if (discountPercent >= 10) return 250;
    if (discountPercent >= 3) return 100;
    if (discountPercent >= 1) return 50;
    return 0;
  };

  const handleSelectTier = (tier) => {
    if (tier.id === 'free') return;
    setSelectedTier(tier);
    setShowPayment(true);
    setSuccess(false);
  };

  const handlePay = (e) => {
    e.preventDefault();
    if (!cardForm.number || !cardForm.expiry || !cardForm.cvv) return;
    setProcessing(true);

    setTimeout(() => {
      // Deduct points if using discount
      if (usePointsDiscount && discountPercent > 0) {
        spendPoints(getPointsCost());
      }
      purchasePlan('vip', selectedTier.months);
      setProcessing(false);
      setSuccess(true);
    }, 2000);
  };

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
        </div>
      )}

      {/* Points Discount Banner */}
      {discountPercent > 0 && (
        <div className="card flex items-center gap-3" style={{ background: 'rgba(234,179,8,0.05)', borderColor: 'rgba(234,179,8,0.3)' }}>
          <Star size={24} className="text-yellow-500" />
          <div className="flex-1">
            <p className="font-semibold text-yellow-700 dark:text-yellow-400">
              ⭐ {userPoints} {t('points')} = {discountPercent}% {lang === 'ru' ? 'скидка' : lang === 'en' ? 'discount' : 'chegirma'}!
            </p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {lang === 'ru' ? 'Используйте баллы при оплате' : lang === 'en' ? 'Use points at checkout' : "To'lovda ballarni ishlating"}
            </p>
          </div>
        </div>
      )}

      {/* Pricing Tiers - Each Separate */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {tiers.map(tier => {
          const isCurrent = (tier.id === 'free' && currentUser?.plan === 'free') || (tier.id !== 'free' && currentUser?.plan === 'vip');
          return (
            <div key={tier.id} className={`card relative ${tier.popular ? 'ring-2 ring-blue-500' : ''}`}>
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-500 text-white text-[10px] font-bold">
                  {t('popular')}
                </div>
              )}
              {tier.save && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 text-[10px] font-bold">
                  -{tier.save}
                </div>
              )}
              <div className="text-center pt-2 pb-4">
                <Crown size={28} className={tier.id === 'free' ? 'text-gray-400 mx-auto' : 'text-purple-500 mx-auto'} />
                <h3 className="font-bold mt-2" style={{ color: 'var(--text-primary)' }}>{tier.label[lang]}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>${tier.price}</span>
                  {tier.id !== 'free' && <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>/{tier.period[lang]}</span>}
                </div>
              </div>
              <button onClick={() => handleSelectTier(tier)}
                disabled={isCurrent || tier.id === 'free'}
                className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  isCurrent ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                  tier.id === 'free' ? 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 cursor-default' :
                  'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90 shadow-lg'
                }`}>
                {isCurrent ? `✓ ${t('currentPlan')}` : tier.id === 'free' ? 'Free' : lang === 'ru' ? 'Купить' : lang === 'en' ? 'Buy' : 'Sotib olish'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Features Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <span className="text-gray-400">Free</span>
          </h4>
          <div className="space-y-2">
            {freeFeatures.map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check size={14} className="text-green-500" />
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{f[lang]}</span>
              </div>
            ))}
            {vipFeatures.map((f, i) => (
              <div key={i} className="flex items-center gap-2 opacity-40">
                <X size={14} className="text-gray-400" />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{f[lang]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card" style={{ borderColor: 'rgba(139,92,246,0.3)' }}>
          <h4 className="font-semibold mb-3 flex items-center gap-2 text-purple-500">
            <Crown size={18} /> VIP
          </h4>
          <div className="space-y-2">
            {[...freeFeatures, ...vipFeatures].map((f, i) => (
              <div key={i} className="flex items-center gap-2">
                <Check size={14} className="text-green-500" />
                <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{f[lang]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Points System */}
      <div className="card">
        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>⭐ {t('pointsSystem')}</h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{t('pointsDesc')}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { points: 50, discount: '1%' },
            { points: 100, discount: '3%' },
            { points: 250, discount: '10%' },
            { points: 1000, discount: '50%' },
          ].map((item, idx) => (
            <div key={idx} className={`p-3 rounded-xl text-center ${userPoints >= item.points ? 'ring-2 ring-green-500 bg-green-50 dark:bg-green-900/10' : ''}`}
              style={userPoints < item.points ? { background: 'var(--bg-secondary)' } : {}}>
              <p className="text-lg font-bold" style={{ color: userPoints >= item.points ? '#22c55e' : 'var(--text-primary)' }}>⭐ {item.points}</p>
              <p className="text-sm font-bold text-purple-500">{item.discount}</p>
              <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'скидка' : lang === 'en' ? 'discount' : 'chegirma'}</p>
              {userPoints >= item.points && <span className="text-[9px] text-green-500 font-bold">✓</span>}
            </div>
          ))}
        </div>
      </div>

      {/* ===== PAYMENT MODAL ===== */}
      {showPayment && selectedTier && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={() => { setShowPayment(false); setSuccess(false); }}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <div className="relative w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in" onClick={e => e.stopPropagation()}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>

            {success ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-green-500" />
                </div>
                <h3 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
                  {lang === 'ru' ? 'Успешно!' : lang === 'en' ? 'Success!' : 'Muvaffaqiyatli!'}
                </h3>
                <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                  {lang === 'ru' ? `VIP активирован на ${selectedTier.months} мес.` : lang === 'en' ? `VIP activated for ${selectedTier.months} months` : `VIP ${selectedTier.months} oyga faollashtirildi`}
                </p>
                <button onClick={() => { setShowPayment(false); setSuccess(false); }}
                  className="btn-primary mt-4">{t('close')}</button>
              </div>
            ) : (
              <form onSubmit={handlePay} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                    💳 {lang === 'ru' ? 'Оплата' : lang === 'en' ? 'Payment' : "To'lov"}
                  </h3>
                  <button type="button" onClick={() => setShowPayment(false)}>
                    <X size={20} style={{ color: 'var(--text-secondary)' }} />
                  </button>
                </div>

                {/* Order summary */}
                <div className="p-4 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                  <div className="flex items-center justify-between">
                    <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{selectedTier.label[lang]}</span>
                    <div className="text-right">
                      {usePointsDiscount && discountPercent > 0 && (
                        <span className="text-xs line-through mr-2" style={{ color: 'var(--text-secondary)' }}>${selectedTier.price}</span>
                      )}
                      <span className="text-lg font-bold" style={{ color: 'var(--accent)' }}>${getDiscountedPrice(selectedTier.price)}</span>
                    </div>
                  </div>
                </div>

                {/* Points discount toggle */}
                {discountPercent > 0 && (
                  <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(234,179,8,0.05)', border: '1px solid rgba(234,179,8,0.2)' }}>
                    <div>
                      <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">⭐ {discountPercent}% chegirma ({getPointsCost()} ball)</p>
                      <p className="text-[10px]" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'Списать баллы?' : 'Ballarni ishlatish?'}</p>
                    </div>
                    <button type="button" onClick={() => setUsePointsDiscount(!usePointsDiscount)}
                      className={`w-12 h-6 rounded-full relative transition-all ${usePointsDiscount ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                      <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${usePointsDiscount ? 'right-1' : 'left-1'}`}></div>
                    </button>
                  </div>
                )}

                {/* Card form */}
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                      {lang === 'ru' ? 'Номер карты' : lang === 'en' ? 'Card Number' : 'Karta raqami'}
                    </label>
                    <div className="relative">
                      <input type="text" placeholder="0000 0000 0000 0000" value={cardForm.number}
                        onChange={e => setCardForm({...cardForm, number: e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19)})}
                        className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                      <CreditCard size={18} className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>MM/YY</label>
                      <input type="text" placeholder="12/28" value={cardForm.expiry}
                        onChange={e => setCardForm({...cardForm, expiry: e.target.value.replace(/\D/g, '').replace(/^(.{2})/, '$1/').slice(0, 5)})}
                        className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                    <div>
                      <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>CVV</label>
                      <input type="password" placeholder="•••" maxLength={3} value={cardForm.cvv}
                        onChange={e => setCardForm({...cardForm, cvv: e.target.value.replace(/\D/g, '').slice(0, 3)})}
                        className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>
                      {lang === 'ru' ? 'Имя на карте' : lang === 'en' ? 'Cardholder name' : 'Karta egasi'}
                    </label>
                    <input type="text" placeholder="YAXYOBEK NEMATILLAEV" value={cardForm.name}
                      onChange={e => setCardForm({...cardForm, name: e.target.value.toUpperCase()})}
                      className="w-full px-4 py-3 rounded-xl border outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }} />
                  </div>
                </div>

                {/* Security note */}
                <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                  <Lock size={12} />
                  <span>{lang === 'ru' ? 'Безопасная оплата — SSL шифрование' : lang === 'en' ? 'Secure payment — SSL encrypted' : "Xavfsiz to'lov — SSL shifrlangan"}</span>
                </div>

                <button type="submit" disabled={processing}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold transition-all shadow-lg disabled:opacity-50">
                  {processing ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>
                      {lang === 'ru' ? 'Обработка...' : lang === 'en' ? 'Processing...' : "Jarayonda..."}
                    </span>
                  ) : (
                    `${lang === 'ru' ? 'Оплатить' : lang === 'en' ? 'Pay' : "To'lash"} $${getDiscountedPrice(selectedTier.price)}`
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
