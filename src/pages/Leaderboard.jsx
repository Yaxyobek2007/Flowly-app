import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Trophy, Medal, Crown, Flame } from 'lucide-react';
import DevBadge from '../components/DevBadge';

export default function Leaderboard() {
  const { currentUser, users, language } = useAuth();
  const { tasks, habits } = useApp();
  const lang = language || 'uz';

  const devMsg = lang === 'ru' ? '⚠️ Лидерборд с локальными данными' : lang === 'en' ? '⚠️ Local data leaderboard' : '⚠️ Lokal reytingl';

  // Calculate scores for all users
  const leaderboard = users
    .filter(u => !u.deleted && !u.blocked)
    .map(u => {
      const isMe = u.id === currentUser?.id;
      const score = (u.points || 0) + (u.loginStreak || 0) * 5 +
        (isMe ? tasks.filter(t => t.completed).length * 10 + habits.filter(h => h.todayDone).length * 15 : 0);
      return { ...u, score, isMe };
    })
    .sort((a, b) => b.score - a.score);

  const myRank = leaderboard.findIndex(u => u.isMe) + 1;

  const getRank = (i) => {
    if (i === 0) return <Crown size={18} className="text-yellow-500" />;
    if (i === 1) return <Medal size={18} className="text-gray-400" />;
    if (i === 2) return <Medal size={18} className="text-orange-400" />;
    return <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>{i + 1}</span>;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
        🏆 {lang === 'ru' ? 'Лидерборд' : lang === 'en' ? 'Leaderboard' : 'Reyting'}
      </h1>

      <DevBadge message={devMsg} />

      {/* My rank card */}
      <div className="card flex items-center gap-4" style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.05), rgba(139,92,246,0.05))' }}>
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg">
          <span className="text-white font-bold text-xl">#{myRank}</span>
        </div>
        <div className="flex-1">
          <p className="font-bold" style={{ color: 'var(--text-primary)' }}>{currentUser?.name}</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
            {leaderboard.find(u => u.isMe)?.score || 0} ball
          </p>
        </div>
        <Flame size={24} className="text-orange-500" />
      </div>

      {/* Leaderboard list */}
      <div className="card space-y-2">
        {leaderboard.slice(0, 10).map((u, i) => (
          <div key={u.id}
            className={`flex items-center gap-3 p-3 rounded-xl ${u.isMe ? 'ring-2 ring-blue-500' : ''} ${i < 3 ? 'bg-yellow-50/30 dark:bg-yellow-900/5' : ''}`}
            style={i >= 3 && !u.isMe ? { background: 'var(--bg-secondary)' } : {}}>
            <div className="w-7 flex justify-center">{getRank(i)}</div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center overflow-hidden">
              {u.avatar ? (
                <img src={u.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white text-[10px] font-bold">{(u.name?.[0] || '?').toUpperCase()}</span>
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                {u.name} {u.isMe ? '(Siz)' : ''}
              </p>
              <p className="text-[9px]" style={{ color: 'var(--text-secondary)' }}>
                🔥{u.loginStreak || 0} ⭐{u.points || 0}
              </p>
            </div>
            <span className="text-sm font-bold" style={{ color: i < 3 ? '#eab308' : 'var(--accent)' }}>
              {u.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
