import { useApp } from '../context/AppContext';
import { Trophy, Lock, Flame } from 'lucide-react';

export default function Achievements() {
  const { achievements, habits } = useApp();

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;

  const topStreaks = [...habits].sort((a, b) => b.streak - a.streak).slice(0, 5);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Achievements & Streaks</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Yutuqlar va ketma-ket muvaffaqiyatlar</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center">
          <Trophy size={32} className="text-yellow-500 mx-auto mb-2" />
          <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{unlockedCount}/{totalCount}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Ochilgan yutuqlar</p>
        </div>
        <div className="card text-center">
          <Flame size={32} className="text-orange-500 mx-auto mb-2" />
          <p className="text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>{Math.max(...habits.map(h => h.streak))}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Eng uzun streak</p>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>🏆 Medallar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {achievements.map((ach, idx) => (
            <div key={ach.id} className={`card flex items-center gap-4 animate-in ${!ach.unlocked ? 'opacity-60' : ''}`}
              style={{ animationDelay: `${idx * 50}ms` }}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${
                ach.unlocked ? 'bg-yellow-100 dark:bg-yellow-900/20' : 'bg-gray-100 dark:bg-gray-800'
              }`}>
                {ach.unlocked ? ach.icon : <Lock size={24} style={{ color: 'var(--text-secondary)' }} />}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{ach.title}</h3>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{ach.description}</p>
                {ach.unlocked ? (
                  <p className="text-xs mt-1 text-green-500 font-medium">✓ Bajarildi — {ach.date}</p>
                ) : (
                  <div className="mt-2">
                    <div className="w-full h-2 rounded-full" style={{ background: 'var(--bg-secondary)' }}>
                      <div className="h-2 rounded-full bg-blue-500 transition-all" style={{ width: `${ach.progress || 0}%` }}></div>
                    </div>
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{ach.progress || 0}% bajarildi</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Streaks */}
      <div>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>🔥 Top Streak'lar</h2>
        <div className="space-y-3">
          {topStreaks.map((habit, idx) => (
            <div key={habit.id} className="card flex items-center gap-4 animate-in" style={{ animationDelay: `${idx * 50}ms` }}>
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-900/20">
                <span className="text-lg font-bold text-orange-500">#{idx + 1}</span>
              </div>
              <span className="text-2xl">{habit.icon}</span>
              <div className="flex-1">
                <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{habit.name}</h3>
              </div>
              <div className="flex items-center gap-1">
                <Flame size={18} className="text-orange-500" />
                <span className="text-lg font-bold text-orange-500">{habit.streak} kun</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
