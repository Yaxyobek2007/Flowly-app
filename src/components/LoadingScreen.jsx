import { useState, useEffect } from 'react';

export default function LoadingScreen({ onFinish }) {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => { setVisible(false); onFinish?.(); }, 200);
          return 100;
        }
        return prev + Math.random() * 25 + 10;
      });
    }, 80);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
      
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10 animate-pulse"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }}></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-10 animate-pulse"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', animationDelay: '0.5s' }}></div>
      </div>

      {/* Logo */}
      <div className="relative mb-8">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/40 animate-bounce"
          style={{ animationDuration: '2s' }}>
          <span className="text-white font-bold text-3xl">F</span>
        </div>
        {/* Spinning ring */}
        <div className="absolute -inset-3 rounded-[2rem] border-2 border-blue-500/20 animate-spin" style={{ animationDuration: '3s' }}></div>
        <div className="absolute -inset-5 rounded-[2.5rem] border border-purple-500/10 animate-spin" style={{ animationDuration: '5s', animationDirection: 'reverse' }}></div>
      </div>

      {/* Text */}
      <h1 className="text-3xl font-bold text-white mb-1 animate-pulse">Flowly</h1>
      <p className="text-blue-300 text-sm font-medium mb-8">Plan. Act. Achieve.</p>

      {/* Progress bar */}
      <div className="w-48 h-1.5 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${Math.min(progress, 100)}%` }}></div>
      </div>
      <p className="text-white/30 text-xs mt-3">{Math.min(Math.round(progress), 100)}%</p>
    </div>
  );
}
