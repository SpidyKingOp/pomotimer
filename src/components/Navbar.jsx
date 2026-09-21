import React from 'react';
import { BarChart3, Settings, Maximize2, Sparkles } from 'lucide-react';
import { playClick } from '../utils/sound';

export default function Navbar({
  onOpenReport,
  onOpenSettings,
  onToggleZen,
  activeThemeConfig
}) {
  const handleAction = (cb) => {
    playClick(0.2);
    cb();
  };

  return (
    <header className="w-full px-6 sm:px-10 lg:px-12 py-5 flex items-center justify-between z-20">
      {/* Brand / Logo */}
      <div className="flex items-center gap-2.5 group cursor-pointer select-none">
        <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-white/15 backdrop-blur-md border border-white/25 shadow-md group-hover:scale-105 transition-transform duration-300 p-1">
          <img 
            src="/logo.png" 
            alt="PomoTimer Logo" 
            className="w-7 h-7 object-contain transform group-hover:rotate-12 transition-transform duration-300 drop-shadow-sm" 
            style={{ imageRendering: 'pixelated' }}
          />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-white/30 animate-pulse" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-xl font-bold tracking-tight text-white drop-shadow-sm">
              PomoTimer
            </h1>
          </div>
          <p className="text-[11px] font-medium text-white/70 hidden sm:block tracking-wide">
            Distraction-Free Focus
          </p>
        </div>
      </div>

      {/* Nav Actions */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Fullscreen Zen Mode Button */}
        <button
          onClick={() => handleAction(onToggleZen)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/90 glass-pill active:scale-95"
          title="Fullscreen Zen Mode (Key: F)"
        >
          <Maximize2 className="w-4 h-4 text-white/90" />
          <span className="hidden md:inline">Zen Mode</span>
        </button>

        {/* Report / Stats Button */}
        <button
          onClick={() => handleAction(onOpenReport)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/90 glass-pill active:scale-95"
          title="Focus Stats & Activity (Key: R)"
        >
          <BarChart3 className="w-4 h-4 text-white/90" />
          <span className="hidden sm:inline">Report</span>
        </button>

        {/* Settings Button */}
        <button
          onClick={() => handleAction(onOpenSettings)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white/90 glass-pill active:scale-95"
          title="Settings & Audio (Key: S)"
        >
          <Settings className="w-4 h-4 text-white/90" />
          <span className="hidden sm:inline">Settings</span>
        </button>
      </div>
    </header>
  );
}
