import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import Navbar from './components/Navbar';
import Timer from './components/Timer';
import TaskChecklist from './components/TaskChecklist';
import SettingsModal from './components/SettingsModal';
import ReportModal from './components/ReportModal';
import ZenMode from './components/ZenMode';
import BackgroundController from './components/backgrounds/BackgroundController';
import { THEMES, DEFAULT_THEME } from './utils/themes';
import { playAlarm } from './utils/sound';
import { sendPushNotification } from './utils/notifications';
import {
  loadSettings,
  saveSettings,
  loadTasks,
  saveTasks,
  loadStats,
  recordCompletedSession,
  incrementTasksCompleted,
  resetAllStats
} from './utils/storage';

export default function App() {
  // Persistence state
  const [settings, setSettings] = useState(loadSettings);
  const [tasks, setTasks] = useState(loadTasks);
  const [stats, setStats] = useState(loadStats);

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isZenOpen, setIsZenOpen] = useState(false);

  // Timer state
  const [mode, setMode] = useState('pomodoro'); // 'pomodoro' | 'shortBreak' | 'longBreak'
  const [timeLeft, setTimeLeft] = useState(settings.pomodoro * 60);
  const [sessionDuration, setSessionDuration] = useState(settings.pomodoro * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(1);

  const timerRef = useRef(null);

  // Active theme configuration
  const currentTheme = THEMES[settings.theme] || THEMES[DEFAULT_THEME];
  const activeModeTheme = currentTheme.modes[mode] || currentTheme.modes.pomodoro;

  // Active task (if any)
  const activeTask = tasks.find((t) => t.active && !t.completed);

  // Get duration in seconds for a specific mode
  const getModeDuration = (m, currentSettings = settings) => {
    switch (m) {
      case 'pomodoro':
        return currentSettings.pomodoro * 60;
      case 'shortBreak':
        return currentSettings.shortBreak * 60;
      case 'longBreak':
        return currentSettings.longBreak * 60;
      default:
        return 25 * 60;
    }
  };

  // Sync settings updates without restarting ongoing (running or paused) sessions
  const handleUpdateSettings = (newSettings) => {
    const oldModeDuration = getModeDuration(mode, settings);
    const newModeDuration = getModeDuration(mode, newSettings);
    const modeDurationChanged = oldModeDuration !== newModeDuration;

    setSettings(newSettings);
    saveSettings(newSettings);

    // Only update timeLeft if the current mode's duration actually changed
    // AND the timer was pristine (at full duration and unstarted).
    // NEVER reset an ongoing session (running or paused midway)!
    if (modeDurationChanged && !isRunning && timeLeft === oldModeDuration) {
      setTimeLeft(newModeDuration);
      setSessionDuration(newModeDuration);
    }
  };

  // Sync tasks
  const handleTasksChange = (newTasks) => {
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  // Reset stats
  const handleResetStats = () => {
    const fresh = resetAllStats();
    if (fresh) setStats(fresh);
  };

  // Task completed callback
  const handleTaskCompleted = () => {
    const updated = incrementTasksCompleted();
    if (updated) setStats(updated);
  };

  // Change mode manually
  const handleSwitchMode = (newMode) => {
    const dur = getModeDuration(newMode);
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(dur);
    setSessionDuration(dur);
  };

  // Skip session
  const handleSkip = () => {
    advanceToNextMode();
  };

  // Reset current timer
  const handleReset = () => {
    const dur = getModeDuration(mode);
    setIsRunning(false);
    setTimeLeft(dur);
    setSessionDuration(dur);
  };

  // Advance to the next mode after timer ends or skip
  const advanceToNextMode = () => {
    if (mode === 'pomodoro') {
      sendPushNotification('Focus Session Complete!', 'Time to rest and recharge.');

      // Record completed work session
      const updatedStats = recordCompletedSession('pomodoro', settings.pomodoro);
      if (updatedStats) setStats(updatedStats);

      // Trigger celebratory confetti for completing a work session
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Check if long break interval is reached
      const isLongBreakTime = cycleCount % settings.longBreakInterval === 0;
      const nextMode = isLongBreakTime ? 'longBreak' : 'shortBreak';
      const dur = getModeDuration(nextMode);

      setMode(nextMode);
      setTimeLeft(dur);
      setSessionDuration(dur);
      setIsRunning(settings.autoStartBreaks);
    } else {
      sendPushNotification('Break Finished!', 'Ready to dive back in? Time to focus.');

      // Break finished, go back to pomodoro
      const nextCycle = cycleCount + 1;
      const dur = getModeDuration('pomodoro');
      setCycleCount(nextCycle);
      setMode('pomodoro');
      setTimeLeft(dur);
      setSessionDuration(dur);
      setIsRunning(settings.autoStartPomodoros);
    }
  };

  // Main countdown ticker effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            playAlarm(settings.alarmSound, settings.volume);
            advanceToNextMode();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, cycleCount, settings]);

  // Sync document title
  useEffect(() => {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    const modeLabel = mode === 'pomodoro' ? 'Focus' : 'Break';
    document.title = `${formatted} - ${modeLabel} | PomoTimer`;
  }, [timeLeft, mode]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // If a modal is open, allow Escape to close it and prevent other shortcuts
      if (isSettingsOpen || isReportOpen) {
        if (e.key === 'Escape') {
          setIsSettingsOpen(false);
          setIsReportOpen(false);
        }
        return;
      }

      // Ignore shortcut if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
        return;
      }

      // Space: Toggle Play/Pause
      if (e.code === 'Space') {
        e.preventDefault();
        setIsRunning((r) => !r);
      }

      // 'F': Toggle Zen mode
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setIsZenOpen((z) => !z);
      }

      // 'S': Toggle Settings
      if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setIsSettingsOpen((s) => !s);
      }

      // 'R': Toggle Report
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        setIsReportOpen((ro) => !ro);
      }

      // Alt+S: Skip session
      if (e.altKey && (e.key === 's' || e.key === 'S')) {
        e.preventDefault();
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mode, cycleCount, settings, isSettingsOpen, isReportOpen]);

  return (
    <div
      className={`min-h-screen relative overflow-x-hidden select-none bg-gradient-to-br ${activeModeTheme.bg} transition-colors duration-700 ease-in-out text-white flex flex-col justify-between`}
    >
      {/* Background Atmosphere Layer */}
      <BackgroundController
        effect={settings.backgroundEffect || 'dots'}
        mode={mode}
        mods={settings.dotMatrixMods}
      />

      {/* Navbar */}
      <Navbar
        onOpenReport={() => setIsReportOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleZen={() => setIsZenOpen(true)}
        activeThemeConfig={activeModeTheme}
      />

      {/* Main Core Content Container (Shifted up to occupy empty space) */}
      <main className="flex-1 w-full max-w-xl mx-auto px-4 pt-1 sm:pt-3 pb-8 flex flex-col items-center justify-start z-10">
        {/* Timer Card */}
        <Timer
          mode={mode}
          setMode={handleSwitchMode}
          timeLeft={timeLeft}
          totalTime={sessionDuration}
          isRunning={isRunning}
          onStartPause={() => setIsRunning(!isRunning)}
          onSkip={handleSkip}
          onReset={handleReset}
          cycleCount={cycleCount}
          activeTask={activeTask}
          themeConfig={activeModeTheme}
        />
      </main>

      {/* Left Wall Slide-Out Notch & Focus Checklist */}
      <TaskChecklist
        tasks={tasks}
        setTasks={handleTasksChange}
        onTaskCompleted={handleTaskCompleted}
        themeConfig={activeModeTheme}
      />

      {/* Modals & Overlays */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        themeConfig={activeModeTheme}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        stats={stats}
        onResetStats={handleResetStats}
        themeConfig={activeModeTheme}
      />

      <ZenMode
        isOpen={isZenOpen}
        onClose={() => setIsZenOpen(false)}
        timeLeft={timeLeft}
        totalTime={sessionDuration}
        isRunning={isRunning}
        onStartPause={() => setIsRunning(!isRunning)}
        onSkip={handleSkip}
        mode={mode}
        activeTask={activeTask}
        themeConfig={activeModeTheme}
      />
    </div>
  );
}
