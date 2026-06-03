import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Copy, Share2, Gift, Check } from 'lucide-react';

export default function Friends() {
  const { currentUser, users } = useAuth();
  const [copied, setCopied] = useState(false);

  const friendsList = users.filter(u => currentUser?.friends?.includes(u.id));
  const referralLink = `https://flowly.uz/join?ref=${currentUser?.referralCode}`;

  const copyCode = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getReferralRewards = () => {
    const count = friendsList.length;
    return [
      { friends: 1, reward: '10 ball', achieved: count >= 1 },
      { friends: 3, reward: '$1 chegirma', achieved: count >= 3 },
      { friends: 5, reward: '$2 chegirma', achieved: count >= 5 },
      { friends: 10, reward: '$6 chegirma (Pro: $1.9/oy)', achieved: count >= 10 },
      { friends: 20, reward: '1 oy bepul Pro', achieved: count >= 20 },
      { friends: 50, reward: 'Umrbod Pro', achieved: count >= 50 },
    ];
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Do'stlar & Referral</h1>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Do'stlarni taklif qiling va bonuslar oling</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <Users size={24} className="text-blue-500 mx-auto mb-2" />
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{friendsList.length}</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Taklif qilganlar</p>
        </div>
        <div className="card text-center">
          <Gift size={24} className="text-green-500 mx-auto mb-2" />
          <p className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{friendsList.length * 10}</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Ball olindi</p>
        </div>
        <div className="card text-center">
          <Share2 size={24} className="text-purple-500 mx-auto mb-2" />
          <p className="text-lg font-bold text-purple-500">{currentUser?.referralCode}</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Referral kod</p>
        </div>
      </div>

      {/* Referral Link */}
      <div className="card">
        <h3 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Taklif havolasi</h3>
        <div className="flex items-center gap-2">
          <div className="flex-1 px-4 py-3 rounded-xl text-sm truncate" style={{ background: 'var(--bg-secondary)', color: 'var(--text-secondary)' }}>
            {referralLink}
          </div>
          <button onClick={copyCode} className="btn-primary flex items-center gap-2 whitespace-nowrap">
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'Nusxalandi!' : 'Nusxalash'}
          </button>
        </div>
        <p className="text-xs mt-2" style={{ color: 'var(--text-secondary)' }}>Har bir yangi foydalanuvchi uchun 10 ball olasiz</p>
      </div>

      {/* Reward Levels */}
      <div className="card">
        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Mukofotlar darajasi</h3>
        <div className="space-y-3">
          {getReferralRewards().map((r, idx) => (
            <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${r.achieved ? 'bg-green-50 dark:bg-green-900/10' : ''}`}
              style={{ background: r.achieved ? undefined : 'var(--bg-secondary)' }}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${r.achieved ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                {r.achieved ? <Check size={14} className="text-white" /> : <span className="text-xs font-bold" style={{ color: 'var(--text-secondary)' }}>{r.friends}</span>}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{r.friends} ta do'st taklif qiling</p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Mukofot: {r.reward}</p>
              </div>
              {r.achieved && <span className="text-xs text-green-500 font-bold">✓ Olingan</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Friends List */}
      <div className="card">
        <h3 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Do'stlar ro'yxati</h3>
        {friendsList.length === 0 ? (
          <p className="text-center py-6 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Hali do'stlar taklif qilinmagan. Yuqoridagi havolani ulashing!
          </p>
        ) : (
          <div className="space-y-3">
            {friendsList.map(friend => (
              <div key={friend.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-secondary)' }}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{(friend.name?.[0] || 'U').toUpperCase()}</span>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{friend.name} {friend.surname}</p>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>A'zo: {friend.joinedAt}</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">{friend.plan}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
