import { useAuth } from '../context/AuthContext';
import { Crown, Check, X, Zap, Star } from 'lucide-react';

const plans = [
  {
    id: 'free',
    name: 'Bepul',
    price: '$0',
    period: 'Abadiy',
    color: 'from-gray-500 to-gray-600',
    features: [
      { text: 'Kunlik rejalashtirish', included: true },
      { text: 'Haftalik rejalashtirish', included: true },
      { text: '3 ta odat tracking', included: true },
      { text: '5 ta yozuv', included: true },
      { text: 'AI tavsiyalar', included: false },
      { text: 'Statistika', included: false },
      { text: 'Geolokatsiya', included: false },
      { text: 'Cheksiz odatlar', included: false },
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$7.9',
    period: '/oy',
    color: 'from-blue-500 to-blue-600',
    popular: true,
    features: [
      { text: 'Bepul rejadagi barcha xususiyatlar', included: true },
      { text: 'Cheksiz vazifalar', included: true },
      { text: 'Cheksiz odatlar', included: true },
      { text: 'To\'liq statistika', included: true },
      { text: 'AI tavsiyalar', included: true },
      { text: 'Sertifikatlar bo\'limi', included: true },
      { text: 'Geolokatsiya', included: false },
      { text: 'CRM/ERP', included: false },
    ]
  },
  {
    id: 'pro_plus',
    name: 'Pro+',
    price: '$14.9',
    period: '/oy',
    color: 'from-purple-500 to-pink-500',
    features: [
      { text: 'Pro rejadagi barcha xususiyatlar', included: true },
      { text: 'Geolokatsiya & Xarita', included: true },
      { text: 'CRM/ERP tizimi', included: true },
      { text: 'Admin panel', included: true },
      { text: 'SMS bildirishnomalar', included: true },
      { text: 'Ustuvor texnik yordam', included: true },
      { text: 'API integratsiya', included: true },
      { text: 'Custom branding', included: true },
    ]
  },
];

export default function Premium() {
  const { currentUser, updateProfile } = useAuth();

  const getReferralDiscount = () => {
    const friends = currentUser?.friends?.length || 0;
    if (friends >= 10) return { discount: 6, price: '$1.9' };
    if (friends >= 5) return { discount: 2, price: '$5.9' };
    if (friends >= 3) return { discount: 1, price: '$6.9' };
    return { discount: 0, price: '$7.9' };
  };

  const { discount, price } = getReferralDiscount();
  const isTrialActive = currentUser?.trialEndsAt && new Date(currentUser.trialEndsAt) > new Date();

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Premium</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Flowly'ning to'liq quvvatidan foydalaning</p>
      </div>

      {/* Trial Banner */}
      {isTrialActive && (
        <div className="card text-center" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(147,51,234,0.1))' }}>
          <Zap size={24} className="text-blue-500 mx-auto mb-2" />
          <h3 className="font-bold" style={{ color: 'var(--text-primary)' }}>7 kunlik VIP sinov davri</h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Tugash sanasi: {new Date(currentUser.trialEndsAt).toLocaleDateString('uz-UZ')}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Barcha Premium funksiyalar sizga ochiq!</p>
        </div>
      )}

      {/* Referral Discount */}
      {discount > 0 && (
        <div className="card flex items-center gap-3 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800">
          <Star size={24} className="text-green-500" />
          <div>
            <p className="font-semibold text-green-700 dark:text-green-400">Do'stlar chegirmasi!</p>
            <p className="text-sm text-green-600 dark:text-green-500">
              {currentUser.friends.length} ta do'st taklif qildingiz — Pro reja narxi: <b>{price}/oy</b> (${discount} chegirma)
            </p>
          </div>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className={`card relative ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-bold">
                Mashhur
              </div>
            )}
            <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mx-auto mb-4`}>
              <Crown size={24} className="text-white" />
            </div>
            <h3 className="text-xl font-bold text-center" style={{ color: 'var(--text-primary)' }}>{plan.name}</h3>
            <div className="text-center mt-2">
              <span className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{plan.id === 'pro' && discount > 0 ? price : plan.price}</span>
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{plan.period}</span>
            </div>
            <div className="space-y-3 mt-6">
              {plan.features.map((f, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {f.included ? <Check size={16} className="text-green-500" /> : <X size={16} className="text-gray-300" />}
                  <span className={`text-sm ${f.included ? '' : 'opacity-50'}`} style={{ color: 'var(--text-primary)' }}>{f.text}</span>
                </div>
              ))}
            </div>
            <button className={`w-full mt-6 py-3 rounded-xl font-semibold transition-all ${
              currentUser?.plan === plan.id
                ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 cursor-default'
                : `bg-gradient-to-r ${plan.color} text-white hover:opacity-90 shadow-lg`
            }`} disabled={currentUser?.plan === plan.id}>
              {currentUser?.plan === plan.id ? '✓ Joriy reja' : 'Tanlash'}
            </button>
          </div>
        ))}
      </div>

      {/* Points System */}
      <div className="card">
        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>⭐ Ball tizimi</h3>
        <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Ballar yordamida Premium reja sotib olish mumkin</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
            <p className="text-lg font-bold text-orange-500">2</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>1 kun faollik</p>
          </div>
          <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
            <p className="text-lg font-bold text-orange-500">4</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>2 kun ketma-ket</p>
          </div>
          <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
            <p className="text-lg font-bold text-orange-500">6</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>5 kun ketma-ket</p>
          </div>
          <div className="p-3 rounded-xl text-center" style={{ background: 'var(--bg-secondary)' }}>
            <p className="text-lg font-bold text-orange-500">14</p>
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>7 kun (to'liq hafta)</p>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/10">
          <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
            <b>Pro reja:</b> 500 ball = 1 oylik Pro | <b>Pro+:</b> 1000 ball = 1 oylik Pro+
          </p>
        </div>
      </div>
    </div>
  );
}
