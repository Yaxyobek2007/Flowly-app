import { X } from 'lucide-react';

// Red badge marking pages that may be removed in future
// These pages have limited functionality or are redundant
export default function RemovableBadge({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl mb-4 text-xs animate-in"
      style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.3)' }}>
      <X size={14} className="text-red-500 flex-shrink-0" />
      <span className="text-red-600 dark:text-red-400 font-medium">{message}</span>
    </div>
  );
}
