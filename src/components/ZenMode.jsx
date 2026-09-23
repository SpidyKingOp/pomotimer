import React from 'react';
import { Minimize2, Play, Pause, SkipForward, RotateCcw, Target } from 'lucide-react';
import { playClick } from '../utils/sound';

export default function ZenMode({
  isOpen,
  onClose,
  timeLeft,
  totalTime,
  isRunning,
  onStartPause,
  onSkip,
  onReset,
  mode,
  activeTask,
  themeConfig
}) {
  if (!isOpen) return null;

  // SVG calculations for larger Zen ring
  const size = 320;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const strokeDashoffset = circumference - progress * circumference;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex flex-col items-center justify-between p-8 text-white select-none animate-fade-in">
      {/* Top Bar: Close button & Mode */}
      <div className="w-full max-w-4xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="PomoTimer Logo" className="w-8 h-8 object-contain" style={{ imageRendering: 'pixelated' }} />
          <span className="text-xs uppercase tracking-widest font-bold text-white/60">
            Zen Focus Mode
          </span>
        </div>

        <button
          onClick={() => {
            playClick(0.2);
            onClose();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-white/80 hover:text-white transition-all active:scale-95"
          title="Exit Zen Mode (Esc)"
        >
          <Minimize2 className="w-4 h-4" />
          <span>Exit (Esc)</span>
        </button>
      </div>

      {/* Center Focus Area */}
      <div className="flex flex-col items-center justify-center my-auto">
        {/* Active Task (if any) */}
        {activeTask && (
          <div className="mb-6 flex items-center gap-2 px-5 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-md">
            <Target className="w-4 h-4 text-red-300 animate-pulse" />
            <span className="text-sm font-semibold tracking-wide text-white">
              {activeTask.title}
            </span>
          </div>
        )}

        {/* Big Circular Progress Ring */}
        <div className="relative flex items-center justify-center">
          <svg
            width={size}
            height={size}
            className="transform -rotate-90"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-white/10"
              fill="transparent"
            />
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke={themeConfig.ringColor}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-linear"
              style={{
                filter: `drop-shadow(0 0 16px ${themeConfig.ringColor}aa)`
              }}
            />
          </svg>

          {/* Time & Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-6xl sm:text-7xl font-bold tracking-tight text-white drop-shadow-lg tabular-nums">
              {formattedTime}
            </span>
            <span className="mt-3 text-xs uppercase tracking-widest text-white/60 font-semibold">
              {mode === 'pomodoro' ? 'Deep Work' : 'Resting'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="mt-10 flex items-center gap-4">
          {/* Reset Button */}
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              playClick(0.2);
              onReset();
            }}
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white active:scale-95 transition-all"
            title="Reset Session (Alt+R)"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Start/Pause Button */}
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              playClick(0.25);
              onStartPause();
            }}
            className={`px-10 py-4 rounded-2xl bg-white text-base font-bold shadow-xl active:scale-95 transition-all flex items-center gap-2 ${themeConfig.accentText}`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current ml-0.5" />
                <span>START</span>
              </>
            )}
          </button>

          {/* Skip Button */}
          <button
            type="button"
            onClick={(e) => {
              e.currentTarget.blur();
              playClick(0.2);
              onSkip();
            }}
            className="p-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white active:scale-95 transition-all"
            title="Skip to next session (Alt+S)"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-xs text-white/30 tracking-wide">
        Press <kbd className="font-mono text-white/50">Space</kbd> to play/pause, <kbd className="font-mono text-white/50">Esc</kbd> to return
      </div>
    </div>
  );
}
