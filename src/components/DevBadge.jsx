import { AlertTriangle } from 'lucide-react';

// Shows a small warning badge on features that need backend to work fully
export default function DevBadge({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-xl mb-4 text-xs animate-in"
      style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.25)' }}>
      <AlertTriangle size={14} className="text-yellow-500 flex-shrink-0" />
      <span className="text-yellow-700 dark:text-yellow-400">{message}</span>
    </div>
  );
}
