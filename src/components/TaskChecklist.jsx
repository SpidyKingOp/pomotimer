import React, { useState } from 'react';
import { Check, Plus, Trash2, ChevronUp, ChevronDown, CheckCircle2, Circle, Target, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClick } from '../utils/sound';

export default function TaskChecklist({
  tasks,
  setTasks,
  onTaskCompleted
}) {
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const completedCount = tasks.filter(t => t.completed).length;

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
    setTasks(prev => {
      const next = prev.map(t => {
        if (t.id === id) {
          const updatedState = !t.completed;
          if (updatedState) {
            onTaskCompleted?.();
            // Celebrate if all completed
            const otherIncomplete = prev.filter(x => x.id !== id && !x.completed);
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
    setTasks(prev =>
      prev.map(t => ({
        ...t,
        active: t.id === id ? !t.active : false
      }))
    );
  };

  const handleDeleteTask = (id) => {
    playClick(0.2);
    setTasks(prev => prev.filter(t => t.id !== id));
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
    setTasks(prev => prev.filter(t => !t.completed));
  };

  return (
    <div className="w-full max-w-lg mx-auto mt-8">
      {/* Checklist Header */}
      <div className="flex items-center justify-between px-2 mb-3">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-white tracking-wide">
            Focus Checklist
          </h2>
          <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-white/15 text-white/80 border border-white/10">
            {completedCount}/{tasks.length}
          </span>
        </div>

        {completedCount > 0 && (
          <button
            onClick={handleClearCompleted}
            className="text-xs font-medium text-white/60 hover:text-white transition-colors"
          >
            Clear completed
          </button>
        )}
      </div>

      {/* Checklist Container */}
      <div className="space-y-2">
        {tasks.map((task, index) => (
          <div
            key={task.id}
            className={`group relative flex items-center justify-between p-3.5 rounded-2xl transition-all duration-200 backdrop-blur-md border ${
              task.active
                ? 'bg-white/20 border-white/40 shadow-md ring-1 ring-white/30'
                : 'bg-white/10 border-white/15 hover:bg-white/15'
            }`}
          >
            {/* Left: Checkbox & Title */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <button
                onClick={() => handleToggleComplete(task.id)}
                className="flex-shrink-0 text-white/70 hover:text-white transition-colors"
                title={task.completed ? "Mark as incomplete" : "Mark as completed"}
              >
                {task.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : (
                  <Circle className="w-5 h-5" />
                )}
              </button>

              <span
                onClick={() => handleSetActive(task.id)}
                className={`text-sm font-medium cursor-pointer truncate select-none transition-all ${
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
            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
              {/* Set Active Target Button */}
              {!task.completed && (
                <button
                  onClick={() => handleSetActive(task.id)}
                  className={`p-1.5 rounded-lg transition-colors text-xs flex items-center gap-1 ${
                    task.active
                      ? 'bg-white/30 text-white font-semibold'
                      : 'hover:bg-white/15 text-white/50 hover:text-white'
                  }`}
                  title={task.active ? "Currently active focus task" : "Set as active focus task"}
                >
                  <Target className={`w-3.5 h-3.5 ${task.active ? 'text-amber-300' : ''}`} />
                </button>
              )}

              {/* Move Up */}
              <button
                disabled={index === 0}
                onClick={() => handleMove(index, -1)}
                className="p-1 rounded text-white/40 hover:text-white disabled:opacity-20 disabled:hover:text-white/40 transition-colors"
                title="Move up"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>

              {/* Move Down */}
              <button
                disabled={index === tasks.length - 1}
                onClick={() => handleMove(index, 1)}
                className="p-1 rounded text-white/40 hover:text-white disabled:opacity-20 disabled:hover:text-white/40 transition-colors"
                title="Move down"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Delete */}
              <button
                onClick={() => handleDeleteTask(task.id)}
                className="p-1.5 rounded text-white/40 hover:text-red-300 hover:bg-white/10 transition-colors ml-1"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {/* Inline Add Task Form */}
        {isAdding ? (
          <form
            onSubmit={handleAddTask}
            className="p-3.5 rounded-2xl glass-panel flex flex-col gap-3 animate-scale-up"
          >
            <input
              type="text"
              autoFocus
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="What are you working on?"
              className="w-full bg-black/20 text-white placeholder-white/50 text-sm px-3.5 py-2.5 rounded-xl border border-white/15 focus:outline-none focus:border-white/40"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  playClick(0.15);
                  setIsAdding(false);
                  setNewTitle('');
                }}
                className="px-3 py-1.5 text-xs font-semibold text-white/70 hover:text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-bold bg-white text-slate-900 rounded-lg shadow-sm hover:bg-white/90 active:scale-95"
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
            className="w-full py-3.5 px-4 rounded-2xl border-2 border-dashed border-white/20 hover:border-white/40 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Focus Task</span>
          </button>
        )}
      </div>
    </div>
  );
}
