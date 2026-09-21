import React, { useEffect, useState } from 'react';
import { Play, Pause, SkipForward, RotateCcw, Target } from 'lucide-react';
import { playClick } from '../utils/sound';

export default function Timer({
  mode,
  setMode,
  timeLeft,
  totalTime,
  isRunning,
  onStartPause,
  onSkip,
  onReset,
  cycleCount,
  activeTask,
  themeConfig
}) {
  // SVG circle calculation
  const size = 260;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = totalTime > 0 ? (totalTime - timeLeft) / totalTime : 0;
  const strokeDashoffset = circumference - progress * circumference;

  // Format time display (MM:SS)
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const modes = [
    { id: 'pomodoro', label: 'Pomodoro' },
    { id: 'shortBreak', label: 'Short Break' },
    { id: 'longBreak', label: 'Long Break' },
  ];

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      {/* Active Task Badge (if any) */}
      {activeTask && (
        <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/20 backdrop-blur-md border border-white/20 text-xs font-semibold text-white/90 shadow-sm animate-fade-in">
          <Target className="w-3.5 h-3.5 text-red-300 animate-pulse" />
          <span className="text-white/60">Focusing on:</span>
          <span className="truncate max-w-[220px] text-white font-bold">{activeTask.title}</span>
        </div>
      )}

      {/* Main Glassmorphic Timer Card with Paper-Cut Outline */}
      <div className="w-full bg-white/10 backdrop-blur-md border-2 border-dashed border-white/50 p-6 sm:p-8 rounded-3xl flex flex-col items-center relative overflow-hidden transition-all duration-500 shadow-none">

        {/* Mode Selector Tabs with Slick Sliding Indicator */}
        <div className="relative flex items-center p-1.5 rounded-2xl bg-black/25 backdrop-blur-md border border-white/10 mb-8 w-full max-w-sm select-none">
          {/* Smooth Sliding Pill Indicator */}
          <div
            className="absolute top-1.5 bottom-1.5 rounded-xl bg-white/25 backdrop-blur-lg border border-white/30 shadow-[0_4px_16px_rgba(0,0,0,0.18)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
            style={{
              width: 'calc((100% - 12px) / 3)',
              left: '6px',
              transform: `translateX(${
                mode === 'pomodoro' ? '0%' : mode === 'shortBreak' ? '100%' : '200%'
              })`,
            }}
          />

          {modes.map((m) => {
            const isActive = mode === m.id;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`relative z-10 flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-colors duration-200 select-none text-center ${
                  isActive
                    ? 'text-white font-bold drop-shadow-sm'
                    : 'text-white/65 hover:text-white'
                }`}
              >
                {m.label}
              </button>
            );
          })}
        </div>

        {/* Circular Progress Ring & Digital Countdown */}
        <div className="relative flex items-center justify-center my-2 select-none">
          <svg
            width={size}
            height={size}
            className="transform -rotate-90 drop-shadow-md"
          >
            {/* Background Track */}
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              stroke="currentColor"
              strokeWidth={strokeWidth}
              className="text-white/10"
              fill="transparent"
            />
            {/* Animated Progress Stroke */}
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
                filter: `drop-shadow(0 0 8px ${themeConfig.ringColor}99)`
              }}
            />
          </svg>

          {/* Centered Digital Display with Smooth Mode Transition */}
          <div 
            key={mode}
            className="absolute inset-0 flex flex-col items-center justify-center text-center animate-scale-up"
          >
            <span className="font-mono text-5xl sm:text-6xl font-bold tracking-tight text-white drop-shadow-md tabular-nums transition-all">
              {formattedTime}
            </span>
            <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-white/80">
              <span className={`px-2 py-0.5 rounded-full text-[11px] border transition-colors duration-500 ${themeConfig.badge}`}>
                #{cycleCount}
              </span>
              <span className="transition-opacity duration-300">
                {mode === 'pomodoro' ? 'Time to focus!' : 'Rest & recharge'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="mt-8 flex items-center gap-4 w-full justify-center">
          {/* Reset button */}
          <button
            onClick={() => {
              playClick(0.2);
              onReset();
            }}
            className="p-3.5 rounded-2xl glass-pill text-white/80 hover:text-white active:scale-95 transition-transform"
            title="Reset Session"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          {/* Big START / PAUSE Button */}
          <button
            onClick={() => {
              playClick(0.25);
              onStartPause();
            }}
            className={`flex items-center justify-center gap-2.5 px-9 py-4 rounded-2xl bg-white text-lg font-bold shadow-lg active:scale-95 transition-all select-none glass-button-primary ${themeConfig.accentText}`}
            style={{ minWidth: '170px' }}
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

          {/* Fast-forward / Skip button */}
          <button
            onClick={() => {
              playClick(0.2);
              onSkip();
            }}
            className="p-3.5 rounded-2xl glass-pill text-white/80 hover:text-white active:scale-95 transition-transform"
            title="Skip to Next Mode (Alt+S)"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Keyboard shortcut hint */}
        <p className="mt-5 text-[11px] text-white/50 font-medium tracking-wide">
          Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-black/25 text-white/80 font-mono text-[10px] border border-white/10">Space</kbd> to toggle, <kbd className="px-1.5 py-0.5 rounded bg-black/25 text-white/80 font-mono text-[10px] border border-white/10">F</kbd> for Zen mode
        </p>
      </div>
    </div>
  );
}
