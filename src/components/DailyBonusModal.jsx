import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Gift, X, Star } from 'lucide-react';

const bonusTable = [0, 1, 2, 5, 7, 8, 12, 15];

export default function DailyBonusModal() {
  const { currentUser, checkDailyBonus, claimDailyBonus, language } = useAuth();
  const [show, setShow] = useState(false);
  const [bonusInfo, setBonusInfo] = useState(null);
  const [claimed, setClaimed] = useState(false);

  const lang = language || 'uz';

  useEffect(() => {
    if (!currentUser) return;
    const info = checkDailyBonus();
    if (info) {
      // Small delay to show after page loads
      const timer = setTimeout(() => {
        setBonusInfo(info);
        setShow(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [currentUser]);

  const handleClaim = () => {
    const result = claimDailyBonus();
    if (result) {
      setClaimed(true);
    }
  };

  const handleClose = () => {
    if (!claimed && bonusInfo) {
      handleClaim(); // Auto claim on close
    }
    setShow(false);
  };

  if (!show || !bonusInfo) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={handleClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      <div className="relative w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden animate-in" onClick={e => e.stopPropagation()}
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
        
        {/* Header gradient */}
        <div className="relative h-32 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899)' }}>
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-2 left-4 text-4xl animate-bounce" style={{ animationDelay: '0.1s' }}>⭐</div>
            <div className="absolute top-6 right-8 text-3xl animate-bounce" style={{ animationDelay: '0.3s' }}>🎁</div>
            <div className="absolute bottom-4 left-12 text-2xl animate-bounce" style={{ animationDelay: '0.5s' }}>✨</div>
            <div className="absolute bottom-2 right-4 text-3xl animate-bounce" style={{ animationDelay: '0.7s' }}>🌟</div>
          </div>
          <div className="relative text-center">
            <Gift size={40} className="text-white mx-auto mb-2" />
            <h2 className="text-xl font-bold text-white">
              {lang === 'ru' ? 'Ежедневный бонус!' : lang === 'en' ? 'Daily Bonus!' : 'Kunlik bonus!'}
            </h2>
          </div>
          <button onClick={handleClose} className="absolute top-3 right-3 p-1 rounded-full bg-white/20 hover:bg-white/30">
            <X size={16} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Streak display */}
          <p className="text-center text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
            🔥 {lang === 'ru' ? `Серия: ${bonusInfo.streak} дней` : lang === 'en' ? `Streak: ${bonusInfo.streak} days` : `Streak: ${bonusInfo.streak} kun`}
          </p>

          {/* 7-day bonus grid */}
          <div className="grid grid-cols-7 gap-1.5 mb-6">
            {[1,2,3,4,5,6,7].map(day => {
              const isCurrentDay = day === bonusInfo.dayIndex;
              const isPast = day < bonusInfo.dayIndex;
              const bonus = bonusTable[day];
              return (
                <div key={day} className={`relative flex flex-col items-center p-2 rounded-xl transition-all ${
                  isCurrentDay ? 'ring-2 ring-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 scale-110' :
                  isPast ? 'bg-green-50 dark:bg-green-900/20' : ''
                }`} style={!isCurrentDay && !isPast ? { background: 'var(--bg-secondary)' } : {}}>
                  <span className="text-[9px] font-bold" style={{ color: 'var(--text-secondary)' }}>
                    {lang === 'ru' ? `Д${day}` : `D${day}`}
                  </span>
                  <span className="text-lg mt-0.5">{isPast ? '✅' : isCurrentDay ? '🎁' : '🔒'}</span>
                  <span className={`text-[10px] font-bold mt-0.5 ${isCurrentDay ? 'text-yellow-600' : isPast ? 'text-green-500' : ''}`}
                    style={!isCurrentDay && !isPast ? { color: 'var(--text-secondary)' } : {}}>
                    +{bonus}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Current bonus */}
          {!claimed ? (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 mb-4">
                <Star size={24} className="text-yellow-500" />
                <span className="text-2xl font-bold text-yellow-600">+{bonusInfo.bonus}</span>
                <span className="text-sm text-yellow-700 dark:text-yellow-400">{lang === 'ru' ? 'баллов' : lang === 'en' ? 'points' : 'ball'}</span>
              </div>
              <button onClick={handleClaim}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition-all shadow-lg shadow-orange-500/30">
                {lang === 'ru' ? 'Забрать!' : lang === 'en' ? 'Claim!' : 'Olish!'}
              </button>
            </div>
          ) : (
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-3 animate-bounce">
                <span className="text-3xl">🎉</span>
              </div>
              <p className="font-bold text-green-600 dark:text-green-400">
                +{bonusInfo.bonus} {lang === 'ru' ? 'баллов получено!' : lang === 'en' ? 'points claimed!' : 'ball olindi!'}
              </p>
              <button onClick={handleClose} className="mt-4 px-6 py-2 rounded-xl border text-sm" style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                {t?.('close') || 'OK'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
