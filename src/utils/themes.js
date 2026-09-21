export const THEMES = {
  sunset: {
    id: 'sunset',
    name: 'Modern Sunset',
    description: 'Iconic Pomofocus coral, teal, and slate with rich modern gradient depth',
    previewColor: '#ba4949',
    modes: {
      pomodoro: {
        bg: 'from-[#ba4949] via-[#9e3a3a] to-[#7f2d2d]',
        glass: 'bg-white/10 border-white/15',
        accentText: 'text-[#ba4949]',
        accentBg: 'bg-[#ba4949]',
        ringColor: '#f87171',
        glow: 'shadow-[0_0_50px_rgba(186,73,73,0.35)]',
        badge: 'bg-red-500/20 text-red-100 border-red-400/30',
        activePill: 'bg-white/20 text-white shadow-sm'
      },
      shortBreak: {
        bg: 'from-[#38858a] via-[#2c6d71] to-[#205357]',
        glass: 'bg-white/10 border-white/15',
        accentText: 'text-[#38858a]',
        accentBg: 'bg-[#38858a]',
        ringColor: '#4fd1c5',
        glow: 'shadow-[0_0_50px_rgba(56,133,138,0.35)]',
        badge: 'bg-teal-500/20 text-teal-100 border-teal-400/30',
        activePill: 'bg-white/20 text-white shadow-sm'
      },
      longBreak: {
        bg: 'from-[#397097] via-[#2b5877] to-[#1f4058]',
        glass: 'bg-white/10 border-white/15',
        accentText: 'text-[#397097]',
        accentBg: 'bg-[#397097]',
        ringColor: '#63b3ed',
        glow: 'shadow-[0_0_50px_rgba(57,112,151,0.35)]',
        badge: 'bg-blue-500/20 text-blue-100 border-blue-400/30',
        activePill: 'bg-white/20 text-white shadow-sm'
      }
    }
  },

  aurora: {
    id: 'aurora',
    name: 'Deep Aurora',
    description: 'Electric neon indigo, cyan glow, and celestial deep midnight',
    previewColor: '#6366f1',
    modes: {
      pomodoro: {
        bg: 'from-[#4f46e5] via-[#4338ca] to-[#312e81]',
        glass: 'bg-white/10 border-white/20',
        accentText: 'text-[#4f46e5]',
        accentBg: 'bg-[#4f46e5]',
        ringColor: '#818cf8',
        glow: 'shadow-[0_0_50px_rgba(99,102,241,0.4)]',
        badge: 'bg-indigo-500/25 text-indigo-100 border-indigo-400/30',
        activePill: 'bg-white/20 text-white shadow-sm'
      },
      shortBreak: {
        bg: 'from-[#0891b2] via-[#0e7490] to-[#155e75]',
        glass: 'bg-white/10 border-white/20',
        accentText: 'text-[#0891b2]',
        accentBg: 'bg-[#0891b2]',
        ringColor: '#22d3ee',
        glow: 'shadow-[0_0_50px_rgba(8,145,178,0.4)]',
        badge: 'bg-cyan-500/25 text-cyan-100 border-cyan-400/30',
        activePill: 'bg-white/20 text-white shadow-sm'
      },
      longBreak: {
        bg: 'from-[#7c3aed] via-[#6d28d9] to-[#4c1d95]',
        glass: 'bg-white/10 border-white/20',
        accentText: 'text-[#7c3aed]',
        accentBg: 'bg-[#7c3aed]',
        ringColor: '#c084fc',
        glow: 'shadow-[0_0_50px_rgba(124,58,237,0.4)]',
        badge: 'bg-purple-500/25 text-purple-100 border-purple-400/30',
        activePill: 'bg-white/20 text-white shadow-sm'
      }
    }
  },

  emerald: {
    id: 'emerald',
    name: 'Emerald Calm',
    description: 'Refreshing pine greens, eucalyptus herbs, and forest tranquility',
    previewColor: '#059669',
    modes: {
      pomodoro: {
        bg: 'from-[#047857] via-[#065f46] to-[#064e3b]',
        glass: 'bg-white/10 border-white/20',
        accentText: 'text-[#047857]',
        accentBg: 'bg-[#047857]',
        ringColor: '#34d399',
        glow: 'shadow-[0_0_50px_rgba(5,150,105,0.35)]',
        badge: 'bg-emerald-500/20 text-emerald-100 border-emerald-400/30',
        activePill: 'bg-white/20 text-white shadow-sm'
      },
      shortBreak: {
        bg: 'from-[#0d9488] via-[#0f766e] to-[#115e59]',
        glass: 'bg-white/10 border-white/20',
        accentText: 'text-[#0d9488]',
        accentBg: 'bg-[#0d9488]',
        ringColor: '#2dd4bf',
        glow: 'shadow-[0_0_50px_rgba(13,148,136,0.35)]',
        badge: 'bg-teal-500/20 text-teal-100 border-teal-400/30',
        activePill: 'bg-white/20 text-white shadow-sm'
      },
      longBreak: {
        bg: 'from-[#1e40af] via-[#1e3a8a] to-[#172554]',
        glass: 'bg-white/10 border-white/20',
        accentText: 'text-[#1e40af]',
        accentBg: 'bg-[#1e40af]',
        ringColor: '#60a5fa',
        glow: 'shadow-[0_0_50px_rgba(30,64,175,0.35)]',
        badge: 'bg-blue-500/20 text-blue-100 border-blue-400/30',
        activePill: 'bg-white/20 text-white shadow-sm'
      }
    }
  },

  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Dark',
    description: 'Sleek monochromatic dark with subtle titanium and slate accents',
    previewColor: '#334155',
    modes: {
      pomodoro: {
        bg: 'from-[#1e293b] via-[#0f172a] to-[#020617]',
        glass: 'bg-white/5 border-white/10',
        accentText: 'text-slate-900',
        accentBg: 'bg-white',
        ringColor: '#f8fafc',
        glow: 'shadow-[0_0_50px_rgba(255,255,255,0.15)]',
        badge: 'bg-slate-700/50 text-slate-200 border-slate-600/40',
        activePill: 'bg-white/15 text-white shadow-sm'
      },
      shortBreak: {
        bg: 'from-[#334155] via-[#1e293b] to-[#0f172a]',
        glass: 'bg-white/5 border-white/10',
        accentText: 'text-slate-900',
        accentBg: 'bg-cyan-200',
        ringColor: '#67e8f9',
        glow: 'shadow-[0_0_50px_rgba(103,232,249,0.2)]',
        badge: 'bg-cyan-900/40 text-cyan-200 border-cyan-700/40',
        activePill: 'bg-white/15 text-white shadow-sm'
      },
      longBreak: {
        bg: 'from-[#27272a] via-[#18181b] to-[#09090b]',
        glass: 'bg-white/5 border-white/10',
        accentText: 'text-slate-900',
        accentBg: 'bg-purple-200',
        ringColor: '#d8b4fe',
        glow: 'shadow-[0_0_50px_rgba(216,180,254,0.2)]',
        badge: 'bg-purple-900/40 text-purple-200 border-purple-700/40',
        activePill: 'bg-white/15 text-white shadow-sm'
      }
    }
  }
};

export const DEFAULT_THEME = 'sunset';
