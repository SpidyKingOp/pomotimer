import React from 'react';
import { X, Volume2, VolumeX, Sparkles, Clock, Bell, Palette } from 'lucide-react';
import { THEMES } from '../utils/themes';
import { playAlarm, playClick } from '../utils/sound';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  themeConfig
}) {
  if (!isOpen) return null;

  const handleChange = (key, value) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  const handleTestSound = () => {
    playAlarm(settings.alarmSound, settings.volume);
  };

  const soundOptions = [
    { id: 'bell', name: 'Crystal Bell' },
    { id: 'digital', name: 'Digital Chime' },
    { id: 'zen', name: 'Zen Bowl / Gong' },
    { id: 'kitchen', name: 'Kitchen Mechanical' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className={`w-full max-w-md ${themeConfig?.modalBg || 'bg-slate-900/95 border-white/20 shadow-2xl'} backdrop-blur-2xl text-white rounded-3xl border overflow-hidden animate-scale-up max-h-[90vh] flex flex-col transition-colors duration-500`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <span className="text-lg">⚙️</span>
            <h2 className="text-base font-bold tracking-wide">Settings</h2>
          </div>
          <button
            onClick={() => {
              playClick(0.2);
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Section 1: Timer Durations */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-bold uppercase tracking-wider text-white/60">
              <Clock className="w-3.5 h-3.5" />
              <span>Timer Durations (minutes)</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] text-white/70 mb-1 font-medium">
                  Pomodoro
                </label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={settings.pomodoro}
                  onChange={(e) => handleChange('pomodoro', Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm font-semibold text-center focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block text-[11px] text-white/70 mb-1 font-medium">
                  Short Break
                </label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.shortBreak}
                  onChange={(e) => handleChange('shortBreak', Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm font-semibold text-center focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block text-[11px] text-white/70 mb-1 font-medium">
                  Long Break
                </label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={settings.longBreak}
                  onChange={(e) => handleChange('longBreak', Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm font-semibold text-center focus:outline-none focus:border-white/40"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Automation & Intervals */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold">Auto-start Breaks</p>
                <p className="text-[11px] text-white/50">Automatically begin rest countdown</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoStartBreaks}
                onChange={(e) => handleChange('autoStartBreaks', e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold">Auto-start Pomodoros</p>
                <p className="text-[11px] text-white/50">Automatically begin work cycle after break</p>
              </div>
              <input
                type="checkbox"
                checked={settings.autoStartPomodoros}
                onChange={(e) => handleChange('autoStartPomodoros', e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-xs font-semibold">Long Break Interval</p>
                <p className="text-[11px] text-white/50">Sessions before long break</p>
              </div>
              <input
                type="number"
                min="1"
                max="12"
                value={settings.longBreakInterval}
                onChange={(e) => handleChange('longBreakInterval', Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 bg-white/10 border border-white/15 rounded-xl px-2.5 py-1 text-xs font-semibold text-center focus:outline-none focus:border-white/40"
              />
            </div>
          </div>

          {/* Section 3: Sound Alerts & Volume */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60">
              <Bell className="w-3.5 h-3.5" />
              <span>Alarm Sound Alert</span>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={settings.alarmSound}
                onChange={(e) => handleChange('alarmSound', e.target.value)}
                className="flex-1 bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-xs font-medium text-white focus:outline-none focus:border-white/40"
              >
                {soundOptions.map((opt) => (
                  <option key={opt.id} value={opt.id} className="bg-slate-800 text-white">
                    {opt.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={handleTestSound}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-white/15 hover:bg-white/25 border border-white/20 text-white transition-colors active:scale-95"
              >
                Test Sound
              </button>
            </div>

            {/* Volume Slider */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-white/70 mb-1 font-medium">
                <span className="flex items-center gap-1">
                  {settings.volume === 0 ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  Alarm Volume
                </span>
                <span>{Math.round(settings.volume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.volume}
                onChange={(e) => handleChange('volume', parseFloat(e.target.value))}
                className="w-full accent-white h-1.5 bg-white/20 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Section 4: Curated Themes */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60">
              <Palette className="w-3.5 h-3.5" />
              <span>Theme Aesthetics</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {Object.values(THEMES).map((th) => {
                const isSelected = settings.theme === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => handleChange('theme', th.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-white/20 border-white/50 shadow-md ring-1 ring-white/40'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                      style={{ backgroundColor: th.previewColor }}
                    />
                    <div className="truncate">
                      <p className="text-xs font-semibold text-white leading-tight">{th.name}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-white/5 flex justify-end">
          <button
            onClick={() => {
              playClick(0.2);
              onClose();
            }}
            className="px-5 py-2 text-xs font-bold bg-white text-slate-900 rounded-xl hover:bg-white/90 active:scale-95 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
