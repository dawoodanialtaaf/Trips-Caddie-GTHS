
import React, { useState } from 'react';
import { Task } from '../types';
import { X, CheckSquare, Plus, Trash2, Square, Calendar } from 'lucide-react';

interface TaskManagerModalProps {
  tasks: Task[];
  onAddTask: (text: string) => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onClose: () => void;
}

const TaskManagerModal: React.FC<TaskManagerModalProps> = ({ tasks, onAddTask, onToggleTask, onDeleteTask, onClose }) => {
  const [newTaskText, setNewTaskText] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      onAddTask(newTaskText);
      setNewTaskText('');
    }
  };

  const pendingTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-xl">
          <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-emerald-600" />
              Planner Tasks
            </h3>
            <p className="text-xs text-slate-500">Manage your to-do list.</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Input Area */}
        <form onSubmit={handleAdd} className="p-4 border-b border-slate-100 bg-white">
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={newTaskText}
                    onChange={(e) => setNewTaskText(e.target.value)}
                    placeholder="Add a new task..."
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 bg-slate-50 focus:bg-white transition-colors"
                    autoFocus
                />
                <button 
                    type="submit" 
                    disabled={!newTaskText.trim()}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded-lg transition-colors flex items-center justify-center"
                >
                    <Plus className="w-5 h-5" />
                </button>
            </div>
        </form>

        {/* Task List */}
        <div className="flex-1 overflow-y-auto p-2 bg-slate-50">
            {tasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                    <CheckSquare className="w-12 h-12 mb-2 opacity-20" />
                    <p className="text-sm">No tasks yet. Add one above!</p>
                </div>
            ) : (
                <div className="space-y-6 p-2">
                    {/* Pending Tasks */}
                    {pendingTasks.length > 0 && (
                         <div className="space-y-2">
                            {pendingTasks.map(task => (
                                <div key={task.id} className="group flex items-start gap-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:border-emerald-300 transition-colors">
                                    <button 
                                        onClick={() => onToggleTask(task.id)}
                                        className="mt-0.5 text-slate-400 hover:text-emerald-500 transition-colors"
                                    >
                                        <Square className="w-5 h-5" />
                                    </button>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-slate-800 font-medium leading-tight">{task.text}</p>
                                        <div className="flex items-center gap-1 mt-1.5 text-[10px] text-slate-400">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(task.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => onDeleteTask(task.id)}
                                        className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Delete Task"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                         </div>
                    )}

                    {/* Completed Tasks */}
                    {completedTasks.length > 0 && (
                        <div>
                            <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-2 px-1">Completed</h4>
                            <div className="space-y-2">
                                {completedTasks.map(task => (
                                    <div key={task.id} className="group flex items-start gap-3 bg-slate-100 p-3 rounded-lg border border-slate-200/50">
                                        <button 
                                            onClick={() => onToggleTask(task.id)}
                                            className="mt-0.5 text-emerald-500 hover:text-emerald-600 transition-colors"
                                        >
                                            <CheckSquare className="w-5 h-5" />
                                        </button>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-slate-500 line-through leading-tight decoration-slate-400/50">{task.text}</p>
                                        </div>
                                        <button 
                                            onClick={() => onDeleteTask(task.id)}
                                            className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                                            title="Delete Task"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
        
        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
            <p className="text-[10px] text-slate-400">
                {pendingTasks.length} pending • {completedTasks.length} completed
            </p>
        </div>
      </div>
    </div>
  );
};

export default TaskManagerModal;
