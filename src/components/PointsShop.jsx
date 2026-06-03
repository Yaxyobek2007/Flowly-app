import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Star, X, Crown, Gift, Zap, Check } from 'lucide-react';

export default function PointsShop({ isOpen, onClose }) {
  const { currentUser, language, spendPoints, getPointsDiscount } = useAuth();
  const [redeemed, setRedeemed] = useState(null);
  const lang = language || 'uz';

  if (!isOpen) return null;

  const userPoints = currentUser?.points || 0;
  const currentDiscount = getPointsDiscount(userPoints);

  const shopItems = [
    {
      id: 1,
      points: 50,
      icon: '🎫',
      title: { uz: "Tarif uchun 1% chegirma", ru: "1% скидка на тариф", en: "1% off subscription" },
      desc: { uz: "Keyingi VIP tarifdan 1% chegirma", ru: "1% скидка на следующую подписку VIP", en: "1% discount on next VIP plan" },
    },
    {
      id: 2,
      points: 100,
      icon: '🏷️',
      title: { uz: "Tarif uchun 3% chegirma", ru: "3% скидка на тариф", en: "3% off subscription" },
      desc: { uz: "VIP tarifdan 3% chegirma oling", ru: "Получите 3% скидку на VIP", en: "Get 3% off your VIP plan" },
    },
    {
      id: 3,
      points: 250,
      icon: '💎',
      title: { uz: "Tarif uchun 10% chegirma", ru: "10% скидка на тариф", en: "10% off subscription" },
      desc: { uz: "Katta chegirma — 10% VIP tarifdan", ru: "Большая скидка — 10% на VIP", en: "Big discount — 10% off VIP" },
    },
    {
      id: 4,
      points: 1000,
      icon: '👑',
      title: { uz: "Tarif uchun 50% chegirma!", ru: "50% скидка на тариф!", en: "50% off subscription!" },
      desc: { uz: "Mega chegirma! VIP yarim narxda", ru: "Мега скидка! VIP за пол цены", en: "Mega discount! VIP at half price" },
    },
  ];

  const handleRedeem = (item) => {
    if (userPoints < item.points) return;
    // Don't actually spend here - discount is applied at Premium checkout
    setRedeemed(item.id);
    setTimeout(() => setRedeemed(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl shadow-2xl animate-in" onClick={e => e.stopPropagation()}
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        
        {/* Header */}
        <div className="sticky top-0 p-5 pb-3 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-card)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift size={22} className="text-yellow-500" />
              <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>
                {lang === 'ru' ? 'Магазин баллов' : lang === 'en' ? 'Points Shop' : 'Ball do\'koni'}
              </h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
              <X size={18} style={{ color: 'var(--text-secondary)' }} />
            </button>
          </div>
          {/* Balance */}
          <div className="flex items-center gap-2 mt-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
            <Star size={20} className="text-yellow-500" />
            <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>{userPoints}</span>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{lang === 'ru' ? 'баллов' : lang === 'en' ? 'points' : 'ball'}</span>
            {currentDiscount > 0 && (
              <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                {lang === 'ru' ? `Доступна ${currentDiscount}% скидка` : `${currentDiscount}% ${lang === 'en' ? 'available' : 'chegirma mavjud'}`}
              </span>
            )}
          </div>
        </div>

        {/* Shop Items */}
        <div className="p-5 space-y-3">
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {lang === 'ru' ? 'Используйте баллы для получения скидок на VIP тариф в разделе Premium →' : lang === 'en' ? 'Use points for discounts on VIP plans in Premium section →' : "Ballarni Premium bo'limida VIP tarifga chegirma olish uchun ishlating →"}
          </p>

          {shopItems.map(item => {
            const canAfford = userPoints >= item.points;
            const isRedeemed = redeemed === item.id;

            return (
              <div key={item.id} className={`p-4 rounded-xl border transition-all ${canAfford ? 'hover:ring-2 hover:ring-yellow-300' : 'opacity-50'}`}
                style={{ borderColor: 'var(--border)', background: 'var(--bg-secondary)' }}>
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{item.icon}</span>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{item.title[lang]}</h4>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{item.desc[lang]}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 mb-1">
                      <Star size={12} className="text-yellow-500" />
                      <span className="font-bold text-sm" style={{ color: canAfford ? '#eab308' : 'var(--text-secondary)' }}>{item.points}</span>
                    </div>
                    {isRedeemed ? (
                      <div className="flex items-center gap-1 text-green-500">
                        <Check size={14} />
                        <span className="text-[10px] font-bold">OK!</span>
                      </div>
                    ) : (
                      <button onClick={() => handleRedeem(item)} disabled={!canAfford}
                        className={`text-[10px] px-3 py-1 rounded-full font-bold transition-all ${
                          canAfford ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 hover:bg-yellow-200' : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                        }`}>
                        {canAfford ? (lang === 'ru' ? 'Доступно' : lang === 'en' ? 'Available' : 'Mavjud') : (lang === 'ru' ? 'Мало' : lang === 'en' ? 'Not enough' : 'Yetmaydi')}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* How it works */}
          <div className="mt-4 p-4 rounded-xl" style={{ background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              {lang === 'ru' ? '💡 Как это работает?' : lang === 'en' ? '💡 How it works?' : "💡 Qanday ishlaydi?"}
            </h4>
            <ul className="space-y-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <li>• {lang === 'ru' ? 'Баллы накапливаются при ежедневном входе' : lang === 'en' ? 'Points accumulate from daily login streaks' : "Ballar kunlik kirishda to'planadi"}</li>
              <li>• {lang === 'ru' ? 'Чем больше баллов — тем больше скидка' : lang === 'en' ? 'More points = bigger discount' : "Ko'p ball = katta chegirma"}</li>
              <li>• {lang === 'ru' ? 'Скидка применяется при покупке VIP' : lang === 'en' ? 'Discount applied when buying VIP' : "Chegirma VIP sotib olishda qo'llanadi"}</li>
              <li>• {lang === 'ru' ? 'Перейдите в Premium → выберите тариф → включите скидку' : lang === 'en' ? 'Go to Premium → select plan → enable discount' : "Premium → tarif tanlash → chegirma yoqish"}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
