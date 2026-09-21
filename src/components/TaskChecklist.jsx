import React, { useState } from 'react';
import { 
  Check, 
  Plus, 
  Trash2, 
  ChevronUp, 
  ChevronDown, 
  CheckCircle2, 
  Circle, 
  Target, 
  ListTodo, 
  Pin, 
  PinOff, 
  ChevronLeft 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClick } from '../utils/sound';

export default function TaskChecklist({
  tasks,
  setTasks,
  onTaskCompleted,
  themeConfig
}) {
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPinned, setIsPinned] = useState(false);

  const completedCount = tasks.filter((t) => t.completed).length;
  const isExpanded = isHovered || isPinned || isAdding;

  const handleAddTask = (e) => {
    e?.preventDefault();
    if (!newTitle.trim()) return;

    playClick(0.2);
    const newTask = {
      id: Date.now().toString(),
      title: newTitle.trim(),
      completed: false,
      active: tasks.length === 0 // If first task, make active
    };

    setTasks([...tasks, newTask]);
    setNewTitle('');
    setIsAdding(false);
  };

  const handleToggleComplete = (id) => {
    playClick(0.25);
    setTasks((prev) => {
      const next = prev.map((t) => {
        if (t.id === id) {
          const updatedState = !t.completed;
          if (updatedState) {
            onTaskCompleted?.();
            // Celebrate if all completed
            const otherIncomplete = prev.filter((x) => x.id !== id && !x.completed);
            if (otherIncomplete.length === 0) {
              confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.8 }
              });
            }
          }
          return { ...t, completed: updatedState, active: updatedState ? false : t.active };
        }
        return t;
      });
      return next;
    });
  };

  const handleSetActive = (id) => {
    playClick(0.2);
    setTasks((prev) =>
      prev.map((t) => ({
        ...t,
        active: t.id === id ? !t.active : false
      }))
    );
  };

  const handleDeleteTask = (id) => {
    playClick(0.2);
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleMove = (index, direction) => {
    playClick(0.15);
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= tasks.length) return;

    const updated = [...tasks];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setTasks(updated);
  };

  const handleClearCompleted = () => {
    playClick(0.2);
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed left-0 top-1/2 -translate-y-1/2 z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
        isExpanded ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Extended Checklist Panel */}
      <div className={`w-80 sm:w-96 max-h-[82vh] ${themeConfig?.modalBg || 'bg-slate-900/95 border-white/20 shadow-2xl'} backdrop-blur-2xl border rounded-r-3xl p-5 flex flex-col justify-between overflow-hidden transition-all duration-500`}>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
          <div className="flex items-center gap-2">
            <ListTodo className={`w-4 h-4 ${themeConfig?.accentIcon || 'text-emerald-400'}`} />
            <h2 className="text-sm font-bold text-white tracking-wide">
              Focus Checklist
            </h2>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${themeConfig?.badge || 'bg-white/15 text-white/80 border-white/10'}`}>
              {completedCount}/{tasks.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Pin / Keep Open Toggle */}
            <button
              onClick={() => {
                playClick(0.2);
                setIsPinned(!isPinned);
              }}
              className={`p-1.5 rounded-lg border transition-all ${
                isPinned
                  ? 'bg-emerald-500/25 border-emerald-400/40 text-emerald-300'
                  : 'border-white/10 text-white/50 hover:text-white hover:bg-white/10'
              }`}
              title={isPinned ? 'Unpin checklist' : 'Pin checklist open'}
            >
              {isPinned ? <Pin className="w-3.5 h-3.5 fill-current" /> : <Pin className="w-3.5 h-3.5" />}
            </button>

            {/* Collapse button */}
            <button
              onClick={() => {
                playClick(0.15);
                setIsPinned(false);
                setIsHovered(false);
                setIsAdding(false);
              }}
              className="p-1.5 rounded-lg border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-colors"
              title="Collapse checklist"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scrollable Tasks List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 max-h-[50vh]">
          {tasks.length === 0 ? (
            <div className="text-center py-6 text-xs text-white/40">
              No tasks yet. Click below to add one!
            </div>
          ) : (
            tasks.map((task, index) => (
              <div
                key={task.id}
                className={`group relative flex items-center justify-between p-3 rounded-xl transition-all duration-200 border ${
                  task.active
                    ? 'bg-white/20 border-white/40 shadow-sm ring-1 ring-white/30'
                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                }`}
              >
                {/* Left: Checkbox & Title */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <button
                    onClick={() => handleToggleComplete(task.id)}
                    className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
                    title={task.completed ? 'Mark as incomplete' : 'Mark as completed'}
                  >
                    {task.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </button>

                  <span
                    onClick={() => handleSetActive(task.id)}
                    className={`text-xs font-medium cursor-pointer truncate select-none transition-all ${
                      task.completed
                        ? 'line-through text-white/40'
                        : 'text-white hover:text-white/90'
                    }`}
                    title="Click to set as active focus item"
                  >
                    {task.title}
                  </span>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  {/* Set Active Target Button */}
                  {!task.completed && (
                    <button
                      onClick={() => handleSetActive(task.id)}
                      className={`p-1 rounded-md transition-colors text-xs flex items-center gap-1 ${
                        task.active
                          ? 'bg-white/30 text-white font-semibold'
                          : 'hover:bg-white/15 text-white/40 hover:text-white'
                      }`}
                      title={task.active ? 'Currently active focus task' : 'Set as active focus task'}
                    >
                      <Target className={`w-3 h-3 ${task.active ? 'text-amber-300' : ''}`} />
                    </button>
                  )}

                  {/* Move Up */}
                  <button
                    disabled={index === 0}
                    onClick={() => handleMove(index, -1)}
                    className="p-1 rounded text-white/30 hover:text-white disabled:opacity-20 disabled:hover:text-white/30 transition-colors"
                    title="Move up"
                  >
                    <ChevronUp className="w-3 h-3" />
                  </button>

                  {/* Move Down */}
                  <button
                    disabled={index === tasks.length - 1}
                    onClick={() => handleMove(index, 1)}
                    className="p-1 rounded text-white/30 hover:text-white disabled:opacity-20 disabled:hover:text-white/30 transition-colors"
                    title="Move down"
                  >
                    <ChevronDown className="w-3 h-3" />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1 rounded text-white/30 hover:text-red-300 hover:bg-white/10 transition-colors"
                    title="Delete task"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}

          {/* Inline Add Task Form */}
          {isAdding ? (
            <form
              onSubmit={handleAddTask}
              className="p-3 rounded-xl bg-white/10 border border-white/20 flex flex-col gap-2.5 animate-scale-up mt-2"
            >
              <input
                type="text"
                autoFocus
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="What are you working on?"
                className="w-full bg-black/20 text-white placeholder-white/40 text-xs px-3 py-2 rounded-lg border border-white/15 focus:outline-none focus:border-white/40 font-mono"
              />
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    playClick(0.15);
                    setIsAdding(false);
                    setNewTitle('');
                  }}
                  className="px-2.5 py-1 text-[11px] font-semibold text-white/60 hover:text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 text-[11px] font-bold bg-white text-slate-900 rounded-lg shadow-sm hover:bg-white/90 active:scale-95"
                >
                  Add Task
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => {
                playClick(0.2);
                setIsAdding(true);
              }}
              className="w-full py-2.5 px-3 rounded-xl border-2 border-dashed border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all mt-2"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Focus Task</span>
            </button>
          )}
        </div>

        {/* Footer info */}
        {completedCount > 0 && (
          <div className="pt-3 border-t border-white/10 mt-3 flex justify-end">
            <button
              onClick={handleClearCompleted}
              className="text-[11px] font-medium text-white/50 hover:text-white transition-colors"
            >
              Clear completed
            </button>
          </div>
        )}
      </div>

      {/* Vertical Wall Notch (The Tab Attached to the Left Screen Edge) */}
      <div
        onClick={() => {
          playClick(0.2);
          setIsPinned(!isPinned);
        }}
        className={`absolute left-full top-1/2 -translate-y-1/2 flex flex-col items-center justify-center py-5 px-3 rounded-r-2xl ${themeConfig?.notchBg || 'bg-slate-900/95 border-white/30 text-white'} backdrop-blur-2xl border-2 border-l-0 shadow-2xl cursor-pointer select-none group transition-all duration-500 ${
          isExpanded ? 'opacity-90' : 'opacity-100 hover:pl-4'
        }`}
        style={{ minWidth: '42px' }}
        title={isExpanded ? 'Click to pin / unpin' : 'Hover to open checklist'}
      >
        <ListTodo className={`w-4 h-4 ${themeConfig?.accentIcon || 'text-emerald-400'} group-hover:scale-110 transition-transform mb-2.5 drop-shadow-sm`} />

        {/* Vertical Text */}
        <span className="[writing-mode:vertical-lr] text-[10px] tracking-widest font-extrabold uppercase text-white/90 group-hover:text-white transition-colors py-1">
          Tasks
        </span>

        {/* Mini Completed Counter Badge */}
        <span className={`mt-2.5 px-1.5 py-0.5 text-[9px] font-bold rounded-full border tabular-nums ${themeConfig?.badge || 'bg-emerald-500/25 text-emerald-200 border-emerald-400/40'}`}>
          {completedCount}/{tasks.length}
        </span>
      </div>
    </div>
  );
}
