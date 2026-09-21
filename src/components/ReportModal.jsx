import React from 'react';
import { X, Flame, Clock, CheckCircle, BarChart, RotateCcw } from 'lucide-react';
import { playClick } from '../utils/sound';

export default function ReportModal({
  isOpen,
  onClose,
  stats,
  onResetStats
}) {
  if (!isOpen) return null;

  // Compute 7 days history
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const last7Days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayLabel = daysOfWeek[d.getDay()];
    const minutes = stats.dailyHistory?.[dateStr] || 0;
    last7Days.push({ dateStr, dayLabel, minutes });
  }

  const maxMinutes = Math.max(60, ...last7Days.map(d => d.minutes));

  // Convert minutes to readable hours/mins
  const formatMinutes = (mins) => {
    if (mins < 60) return `${mins}m`;
    const hours = (mins / 60).toFixed(1);
    return `${hours}h`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-md bg-slate-900/95 text-white rounded-3xl border border-white/20 shadow-2xl overflow-hidden animate-scale-up max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <h2 className="text-base font-bold tracking-wide">Focus Report & Activity</h2>
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Streak Banner */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border border-orange-500/30">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-orange-500/30 border border-orange-400/40 text-orange-300">
                <Flame className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <p className="text-xs font-semibold text-orange-200">Current Focus Streak</p>
                <h3 className="text-2xl font-extrabold text-white leading-tight">
                  {stats.streak} {stats.streak === 1 ? 'Day' : 'Days'}
                </h3>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-500/30 text-orange-200 border border-orange-400/30">
              Active
            </span>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <Clock className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{formatMinutes(stats.todayMinutes || 0)}</p>
              <p className="text-[10px] text-white/50 font-medium">Today Focus</p>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-sm block mb-0.5">🍅</span>
              <p className="text-lg font-bold text-white">{stats.todaySessions || 0}</p>
              <p className="text-[10px] text-white/50 font-medium">Sessions Today</p>
            </div>

            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-center">
              <CheckCircle className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-white">{stats.tasksCompleted || 0}</p>
              <p className="text-[10px] text-white/50 font-medium">Tasks Done</p>
            </div>
          </div>

          {/* 7-Day Focus Activity Chart */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white/80">
                <BarChart className="w-4 h-4 text-white/60" />
                <span>Last 7 Days (Minutes)</span>
              </div>
              <span className="text-[11px] text-white/40">Total: {formatMinutes(stats.totalMinutes || 0)}</span>
            </div>

            {/* Bars */}
            <div className="h-32 flex items-end justify-between gap-2 pt-2 pb-1 px-1">
              {last7Days.map((d, i) => {
                const heightPercent = maxMinutes > 0 ? Math.round((d.minutes / maxMinutes) * 100) : 0;
                const isToday = i === 6;

                return (
                  <div key={d.dateStr} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                    {/* Tooltip on hover */}
                    <div className="text-[10px] font-mono text-white/70 opacity-0 group-hover:opacity-100 transition-opacity">
                      {d.minutes}m
                    </div>

                    {/* Bar */}
                    <div 
                      className={`w-full max-w-[28px] rounded-t-lg transition-all duration-500 relative ${
                        isToday 
                          ? 'bg-gradient-to-t from-red-500 to-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.5)]' 
                          : d.minutes > 0 
                            ? 'bg-white/40 hover:bg-white/60' 
                            : 'bg-white/10'
                      }`}
                      style={{ height: `${Math.max(6, heightPercent)}%` }}
                    />

                    {/* Day label */}
                    <span className={`text-[10px] font-semibold ${isToday ? 'text-white font-bold' : 'text-white/50'}`}>
                      {d.dayLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reset Stats Option */}
          <div className="flex items-center justify-between pt-1">
            <p className="text-[11px] text-white/40">Clear focus history and counters</p>
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all focus stats?')) {
                  playClick(0.2);
                  onResetStats();
                }
              }}
              className="text-[11px] font-semibold text-red-400/80 hover:text-red-300 flex items-center gap-1 hover:underline"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Stats
            </button>
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
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
