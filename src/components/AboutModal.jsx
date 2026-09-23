import React, { useState } from 'react';
import { 
  X, BookOpen, Clock, CheckCircle2, Flame, Sparkles, 
  Keyboard, Coffee, Target, ExternalLink, HelpCircle,
  Lightbulb, Zap, ShieldCheck, ArrowRight
} from 'lucide-react';
import { playClick } from '../utils/sound';

export default function AboutModal({
  isOpen,
  onClose,
  themeConfig
}) {
  const [activeTab, setActiveTab] = useState('pomodoro'); // 'pomodoro' | 'guide' | 'features' | 'tips' | 'shortcuts'

  if (!isOpen) return null;

  const tabs = [
    { id: 'pomodoro', label: 'The Technique', icon: BookOpen },
    { id: 'guide', label: 'How to Use', icon: Target },
    { id: 'features', label: 'Features', icon: Sparkles },
    { id: 'tips', label: 'Pro Tips', icon: Flame },
    { id: 'shortcuts', label: 'Shortcuts', icon: Keyboard },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in select-none">
      <div 
        className={`w-full max-w-2xl ${themeConfig?.modalBg || 'bg-slate-900/95 border-white/20 shadow-2xl'} backdrop-blur-2xl text-white rounded-3xl border overflow-hidden animate-scale-up max-h-[90vh] flex flex-col transition-colors duration-500`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center p-1.5 border border-white/15">
              <img 
                src="/logo.png" 
                alt="PomoTimer" 
                className="w-full h-full object-contain"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            <div>
              <h2 className="text-base font-bold tracking-wide">About PomoTimer & Technique</h2>
              <p className="text-[11px] text-white/60">An online Pomodoro Timer to boost your productivity</p>
            </div>
          </div>
          <button
            onClick={() => {
              playClick(0.2);
              onClose();
            }}
            className="p-1.5 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            aria-label="Close About Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-1.5 px-6 py-3 border-b border-white/10 bg-white/5 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playClick(0.15);
                  setActiveTab(tab.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-white/20 text-white shadow-sm ring-1 ring-white/30'
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto text-sm leading-relaxed text-white/90">
          {/* TAB 1: The Technique */}
          {activeTab === 'pomodoro' && (
            <div className="space-y-5 animate-fade-in">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <h3 className="text-base font-bold text-white mb-1.5 flex items-center gap-2">
                  <span>🍅</span> What is PomoTimer?
                </h3>
                <p className="text-white/80 text-xs sm:text-sm">
                  <strong>PomoTimer</strong> is an aesthetic, customizable Pomodoro timer that runs right in your browser. 
                  Its purpose is to help you maintain deep, undistracted focus on whatever you are working on—whether studying, 
                  writing, coding, or organizing your day.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" /> What is the Pomodoro Technique?
                </h3>
                <p className="text-white/80 text-xs sm:text-sm">
                  The <strong>Pomodoro Technique</strong> is a world-renowned time management methodology created in the late 1980s by 
                  <strong> Francesco Cirillo</strong>. 
                </p>
                <p className="text-white/80 text-xs sm:text-sm">
                  As a university student, Cirillo struggled to stay focused and procrastinated often. He challenged himself to commit to 
                  just 10 minutes of uninterrupted study using a tomato-shaped kitchen timer (<em>pomodoro</em> is Italian for tomato). 
                  Seeing how dramatically his concentration improved, he refined the system into the 25-minute sprint followed by a 5-minute break.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-300 flex items-center justify-center font-bold text-xs mb-2">
                    01
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">Overcome Inertia</h4>
                  <p className="text-[11px] text-white/60">
                    Committing to just 25 minutes lowers the psychological resistance to starting heavy or daunting tasks.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-7 h-7 rounded-lg bg-teal-500/20 text-teal-300 flex items-center justify-center font-bold text-xs mb-2">
                    02
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">Prevent Burnout</h4>
                  <p className="text-[11px] text-white/60">
                    Frequent scheduled breaks allow your brain’s attention networks to reset and recharge dopamine levels.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold text-xs mb-2">
                    03
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1">Defeat Parkinson's Law</h4>
                  <p className="text-[11px] text-white/60">
                    "Work expands to fill the time available." Clear intervals instill a healthy sense of urgency and progress.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: How to Use */}
          {activeTab === 'guide' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-sm font-bold uppercase tracking-wider text-white/70">
                  6-Step Focus Routine
                </h3>
                <span className="text-[11px] text-emerald-400 font-semibold">Standard Cycle</span>
              </div>

              <div className="space-y-2.5">
                {[
                  {
                    step: '1',
                    title: 'Add your priority tasks',
                    desc: 'Open the task checklist on the left edge and list the key items you want to accomplish today.',
                    badge: 'Plan'
                  },
                  {
                    step: '2',
                    title: 'Estimate Pomodoro units',
                    desc: 'Assign estimated pomodoros (1 🍅 = 25 minutes of work) to calibrate your expectations.',
                    badge: 'Estimate'
                  },
                  {
                    step: '3',
                    title: 'Select your active task',
                    desc: 'Choose one single task to focus on. Single-tasking eliminates mental clutter and context switching.',
                    badge: 'Select'
                  },
                  {
                    step: '4',
                    title: 'Start the timer & focus',
                    desc: 'Hit Space or START. Work with full immersion until the chime rings. Avoid all unrelated distractions.',
                    badge: 'Sprint 25m'
                  },
                  {
                    step: '5',
                    title: 'Take a 5-minute break',
                    desc: 'When the timer ends, take a restorative rest. Stand up, stretch, hydrate, or gaze out a window.',
                    badge: 'Rest 5m'
                  },
                  {
                    step: '6',
                    title: 'Repeat & take a Long Break',
                    desc: 'After completing 4 Pomodoros, reward yourself with an extended 15–30 minute long break to reset.',
                    badge: 'Long Break'
                  },
                ].map((item) => (
                  <div 
                    key={item.step}
                    className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors"
                  >
                    <div className="w-7 h-7 rounded-xl bg-white/10 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {item.step}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-white">{item.title}</h4>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-[11px] sm:text-xs text-white/60 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Features */}
          {activeTab === 'features' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-rose-400">
                  <Sparkles className="w-4 h-4" />
                  <h4 className="text-xs font-bold text-white">Interactive Dot Matrix Canvas</h4>
                </div>
                <p className="text-[11px] text-white/60">
                  Dynamic ambient kinetic canvas with breathing idle waves, mouse shockwaves, and elastic physics repulsion.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-400">
                  <Coffee className="w-4 h-4" />
                  <h4 className="text-xs font-bold text-white">Fullscreen Zen Mode</h4>
                </div>
                <p className="text-[11px] text-white/60">
                  Press <kbd className="px-1 py-0.5 rounded bg-white/10 text-[10px] font-mono">F</kbd> anytime for an immersive, distraction-free timer that fills your screen.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Flame className="w-4 h-4" />
                  <h4 className="text-xs font-bold text-white">Focus Analytics & Streaks</h4>
                </div>
                <p className="text-[11px] text-white/60">
                  View completed sessions, total minutes focused, and daily streak tracking in the Report dashboard (<kbd className="px-1 py-0.5 rounded bg-white/10 text-[10px] font-mono">R</kbd>).
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400">
                  <Clock className="w-4 h-4" />
                  <h4 className="text-xs font-bold text-white">Sound Chimes & Push Alerts</h4>
                </div>
                <p className="text-[11px] text-white/60">
                  Choose between Crystal Bell, Digital Chime, Zen Gong, and Mechanical Timer, with native browser notifications.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-sky-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <h4 className="text-xs font-bold text-white">Slide-Out Task Checklist</h4>
                </div>
                <p className="text-[11px] text-white/60">
                  A seamless left-edge notch keeps your tasks one click away without cluttering your visual workspace.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
                <div className="flex items-center gap-2 text-purple-400">
                  <ShieldCheck className="w-4 h-4" />
                  <h4 className="text-xs font-bold text-white">100% Private & Local</h4>
                </div>
                <p className="text-[11px] text-white/60">
                  Your data stays on your machine in localStorage. No tracking, no mandatory sign-ups, and no paywalls.
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: Pro Tips */}
          {activeTab === 'tips' && (
            <div className="space-y-3 animate-fade-in">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <Lightbulb className="w-4 h-4" />
                  <span>Rule 1: A Pomodoro is Indivisible</span>
                </div>
                <p className="text-xs text-white/70">
                  There is no such thing as "half a pomodoro." If an urgent, unavoidable interruption pulls you away, cancel the session and start a new one when you return.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-teal-300 font-bold text-xs">
                  <Zap className="w-4 h-4" />
                  <span>Rule 2: Capture Distractions on Paper</span>
                </div>
                <p className="text-xs text-white/70">
                  When random thoughts pop up ("I need to reply to that email", "check the score"), quickly write them down in your task list and immediately return to your sprint.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                  <Coffee className="w-4 h-4" />
                  <span>Rule 3: Real Rest Means Stepping Away</span>
                </div>
                <p className="text-xs text-white/70">
                  Don't spend your 5-minute break scrolling social feeds. Give your eyes and dopamine circuits a true rest by looking outside, stretching, or drinking water.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                  <Target className="w-4 h-4" />
                  <span>Rule 4: Break Down Big Tasks</span>
                </div>
                <p className="text-xs text-white/70">
                  If a project requires more than 5–7 pomodoros, divide it into smaller, concrete actionable steps. If a task takes less than 1 pomodoro, bundle it with others.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: Shortcuts */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-3 animate-fade-in">
              <p className="text-xs text-white/60">
                PomoTimer is built for keyboard-driven focus. Use these shortcuts anywhere:
              </p>
              <div className="divide-y divide-white/10 rounded-2xl bg-white/5 border border-white/10 overflow-hidden">
                {[
                  { key: 'Space', desc: 'Start or Pause the timer countdown' },
                  { key: 'Alt + R', desc: 'Reset current session timer' },
                  { key: 'Alt + S', desc: 'Skip to the next session mode' },
                  { key: 'F', desc: 'Toggle Fullscreen Zen Mode' },
                  { key: 'S', desc: 'Open Settings & Sound controls' },
                  { key: 'R', desc: 'Open Focus Report & Activity dashboard' },
                  { key: 'A or ?', desc: 'Open this About & Guide modal' },
                  { key: 'Esc', desc: 'Close any open modal or Zen mode' },
                ].map((s) => (
                  <div key={s.key} className="flex items-center justify-between px-4 py-2.5">
                    <span className="text-xs text-white/75 font-medium">{s.desc}</span>
                    <kbd className="px-2 py-1 rounded-lg bg-black/40 border border-white/20 text-white font-mono text-[11px] font-bold shadow-sm">
                      {s.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-white/5 flex items-center justify-between">
          <a
            href="https://pomofocus.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-white/50 hover:text-white/80 transition-colors"
          >
            <span>Inspired by Pomofocus.io</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <button
            onClick={() => {
              playClick(0.2);
              onClose();
            }}
            className="px-5 py-2 text-xs font-bold bg-white text-slate-900 rounded-xl hover:bg-white/90 active:scale-95 transition-all"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
