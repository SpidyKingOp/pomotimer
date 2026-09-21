const SETTINGS_KEY = 'pomotimer_settings_v1';
const TASKS_KEY = 'pomotimer_tasks_v1';
const STATS_KEY = 'pomotimer_stats_v1';

export const DEFAULT_SETTINGS = {
  pomodoro: 25,
  shortBreak: 5,
  longBreak: 15,
  autoStartBreaks: false,
  autoStartPomodoros: false,
  longBreakInterval: 4,
  alarmSound: 'bell', // 'bell' | 'digital' | 'zen' | 'kitchen'
  volume: 0.7,
  theme: 'sunset', // 'sunset' | 'aurora' | 'emerald' | 'obsidian'
  backgroundEffect: 'dots', // 'dots' | 'none'
  dotMatrixMods: {
    enableRipple: true,
    enableRepulsion: true,
    enableIdleWave: true,
    enableColorTint: true,
  },
};

export function loadSettings() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
      dotMatrixMods: {
        ...DEFAULT_SETTINGS.dotMatrixMods,
        ...(parsed.dotMatrixMods || {}),
      },
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings to localStorage', e);
  }
}

export function loadTasks() {
  try {
    const raw = localStorage.getItem(TASKS_KEY);
    if (!raw) {
      return [
        { id: '1', title: 'Plan priorities for the day', completed: false, active: true },
        { id: '2', title: 'Focus session without distractions', completed: false, active: false }
      ];
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks to localStorage', e);
  }
}

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function loadStats() {
  const today = getTodayStr();
  const defaultStats = {
    streak: 1,
    lastActiveDate: today,
    todayMinutes: 0,
    todaySessions: 0,
    totalMinutes: 0,
    totalSessions: 0,
    tasksCompleted: 0,
    dailyHistory: {
      [today]: 0
    }
  };

  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) return defaultStats;

    const data = JSON.parse(raw);
    const lastDate = data.lastActiveDate;

    // Check streak logic
    let streak = data.streak || 1;
    if (lastDate && lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
      
      if (lastDate === yesterdayStr) {
        // Kept streak alive
      } else {
        // Streak broken
        streak = 1;
      }
    }

    const dailyHistory = data.dailyHistory || {};
    const todayMinutes = dailyHistory[today] || 0;

    return {
      ...defaultStats,
      ...data,
      streak,
      lastActiveDate: today,
      todayMinutes,
      dailyHistory: {
        ...dailyHistory,
        [today]: todayMinutes
      }
    };
  } catch {
    return defaultStats;
  }
}

export function recordCompletedSession(mode, durationMinutes) {
  try {
    const stats = loadStats();
    const today = getTodayStr();

    if (mode === 'pomodoro') {
      const todayMins = (stats.dailyHistory[today] || 0) + durationMinutes;
      const totalMins = (stats.totalMinutes || 0) + durationMinutes;
      const todaySessions = (stats.todaySessions || 0) + 1;
      const totalSessions = (stats.totalSessions || 0) + 1;

      const updated = {
        ...stats,
        lastActiveDate: today,
        todayMinutes: todayMins,
        todaySessions,
        totalMinutes: totalMins,
        totalSessions,
        dailyHistory: {
          ...stats.dailyHistory,
          [today]: todayMins
        }
      };

      localStorage.setItem(STATS_KEY, JSON.stringify(updated));
      return updated;
    }
    return stats;
  } catch (e) {
    console.error('Failed to record session stats', e);
    return null;
  }
}

export function incrementTasksCompleted() {
  try {
    const stats = loadStats();
    stats.tasksCompleted = (stats.tasksCompleted || 0) + 1;
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    return stats;
  } catch {
    return null;
  }
}

export function resetAllStats() {
  try {
    localStorage.removeItem(STATS_KEY);
    return loadStats();
  } catch {
    return null;
  }
}
