import React, { useState } from 'react';
import { X, Volume2, VolumeX, Sparkles, Clock, Bell, Palette, Settings, Layers } from 'lucide-react';
import { THEMES } from '../utils/themes';
import { playAlarm, playClick } from '../utils/sound';
import { getNotificationPermission, requestNotificationPermission, sendPushNotification } from '../utils/notifications';

export default function SettingsModal({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  themeConfig
}) {
  const [notifPermission, setNotifPermission] = useState(getNotificationPermission);
  if (!isOpen) return null;

  const handleChange = (key, value) => {
    onUpdateSettings({ ...settings, [key]: value });
  };

  const handleTimeChange = (key, rawValue) => {
    if (rawValue === '') {
      handleChange(key, '');
      return;
    }
    const val = parseInt(rawValue, 10);
    if (!isNaN(val)) {
      handleChange(key, Math.max(0, val));
    }
  };

  const handleTimeBlur = (key, defaultVal = 1, min = 0) => {
    if (settings[key] === '') {
      handleChange(key, defaultVal);
    } else {
      const val = Number(settings[key]);
      if (isNaN(val) || val < min) {
        handleChange(key, defaultVal);
      }
    }
  };

  const handleCloseModal = () => {
    const sanitized = {
      ...settings,
      pomodoro: settings.pomodoro === '' ? 25 : Math.max(0, Number(settings.pomodoro) || 0),
      shortBreak: settings.shortBreak === '' ? 5 : Math.max(0, Number(settings.shortBreak) || 0),
      longBreak: settings.longBreak === '' ? 15 : Math.max(0, Number(settings.longBreak) || 0),
      longBreakInterval: settings.longBreakInterval === '' ? 4 : Math.max(1, Number(settings.longBreakInterval) || 1),
    };
    onUpdateSettings(sanitized);
    playClick(0.2);
    onClose();
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
        className={`w-full max-w-md ${themeConfig?.modalBg || 'bg-slate-900/95 border-white/20'} backdrop-blur-2xl text-white rounded-3xl border overflow-hidden animate-scale-up max-h-[90vh] flex flex-col transition-colors duration-500 shadow-none`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-white/90" />
            <h2 className="text-base font-bold tracking-wide">Settings</h2>
          </div>
          <button
            onClick={handleCloseModal}
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
                  min="0"
                  max="120"
                  value={settings.pomodoro}
                  onChange={(e) => handleTimeChange('pomodoro', e.target.value)}
                  onBlur={() => handleTimeBlur('pomodoro', 25, 0)}
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm font-semibold text-center focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block text-[11px] text-white/70 mb-1 font-medium">
                  Short Break
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  value={settings.shortBreak}
                  onChange={(e) => handleTimeChange('shortBreak', e.target.value)}
                  onBlur={() => handleTimeBlur('shortBreak', 5, 0)}
                  className="w-full bg-white/10 border border-white/15 rounded-xl px-3 py-2 text-sm font-semibold text-center focus:outline-none focus:border-white/40"
                />
              </div>

              <div>
                <label className="block text-[11px] text-white/70 mb-1 font-medium">
                  Long Break
                </label>
                <input
                  type="number"
                  min="0"
                  max="90"
                  value={settings.longBreak}
                  onChange={(e) => handleTimeChange('longBreak', e.target.value)}
                  onBlur={() => handleTimeBlur('longBreak', 15, 0)}
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
                onChange={(e) => handleTimeChange('longBreakInterval', e.target.value)}
                onBlur={() => handleTimeBlur('longBreakInterval', 4, 1)}
                className="w-16 bg-white/10 border border-white/15 rounded-xl px-2.5 py-1 text-xs font-semibold text-center focus:outline-none focus:border-white/40"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div>
                <p className="text-xs font-semibold">Desktop Push Alerts</p>
                <p className="text-[11px] text-white/50">Notify when timer ends</p>
              </div>
              <button
                type="button"
                onClick={async () => {
                  const perm = await requestNotificationPermission();
                  setNotifPermission(perm);
                  if (perm === 'granted') {
                    sendPushNotification('PomoTimer', 'Desktop alerts are now active!');
                  }
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                  notifPermission === 'granted'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    : notifPermission === 'denied'
                    ? 'bg-red-500/20 text-red-300 border-red-400/30 cursor-not-allowed'
                    : 'bg-white/15 text-white/80 hover:text-white border-white/20'
                }`}
              >
                {notifPermission === 'granted' ? 'Enabled' : notifPermission === 'denied' ? 'Blocked' : 'Enable'}
              </button>
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

          {/* Section 5: Dot Matrix Atmosphere & Modifiers */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60">
                <Layers className="w-3.5 h-3.5" />
                <span>Dot Matrix Grid</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const current = settings.backgroundEffect || 'dots';
                  handleChange('backgroundEffect', current === 'dots' ? 'none' : 'dots');
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all ${
                  (settings.backgroundEffect || 'dots') === 'dots'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30'
                    : 'bg-white/10 text-white/60 border-white/15 hover:text-white'
                }`}
              >
                {(settings.backgroundEffect || 'dots') === 'dots' ? 'Enabled' : 'Disabled'}
              </button>
            </div>

            {(settings.backgroundEffect || 'dots') === 'dots' && (
              <div className="space-y-2 pt-1">
                <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Active Modifiers</p>
                
                {[
                  { key: 'enableRipple', label: 'Click Shockwave Ripple', desc: 'Expanding wave across dots on click' },
                  { key: 'enableRepulsion', label: 'Elastic Repulsion', desc: 'Dots push away and snap back from mouse' },
                  { key: 'enableIdleWave', label: 'Ambient Idle Wave', desc: 'Gentle breathing undulation when idle' },
                  { key: 'enableColorTint', label: 'Theme Color Glow', desc: 'Tints dots to match Pomodoro & break modes' },
                ].map((mod) => {
                  const currentMods = settings.dotMatrixMods || {
                    enableRipple: true,
                    enableRepulsion: true,
                    enableIdleWave: true,
                    enableColorTint: true,
                  };
                  const isChecked = currentMods[mod.key] !== false;

                  return (
                    <label
                      key={mod.key}
                      className="flex items-center justify-between p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer transition-colors"
                    >
                      <div className="pr-3">
                        <p className="text-xs font-medium text-white">{mod.label}</p>
                        <p className="text-[10px] text-white/50">{mod.desc}</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          handleChange('dotMatrixMods', {
                            ...currentMods,
                            [mod.key]: e.target.checked,
                          });
                        }}
                        className="w-4 h-4 rounded accent-rose-500 cursor-pointer"
                      />
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-white/5 flex justify-end">
          <button
            onClick={handleCloseModal}
            className="px-5 py-2 text-xs font-bold bg-white text-slate-900 rounded-xl hover:bg-white/90 active:scale-95 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
