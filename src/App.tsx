import React, { useState, useEffect } from "react";
import { BookOpen, Award, Edit3, ClipboardList, Sparkles, Calendar, Layers, Check, Clock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { IELTS_SCHEDULE, TaskStatus, INITIAL_STATUS } from "./data/scheduleData";
import CalendarView from "./components/CalendarView";
import DayDetails from "./components/DayDetails";
import AnalyticsPanel from "./components/AnalyticsPanel";
import Scratchpad from "./components/Scratchpad";
import LexicalTuner from "./components/LexicalTuner";

export default function App() {
  const [activeTab, setActiveTab] = useState<"board" | "editor" | "lexical" | "analytics">("board");
  const [selectedDayId, setSelectedDayId] = useState<string>("2026-05-26");

  // Load state from LocalStorage
  const [taskStatus, setTaskStatus] = useState<TaskStatus>(() => {
    const saved = localStorage.getItem("ielts_task_status");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure all days are seeded, back-compatibility guard
        IELTS_SCHEDULE.forEach(day => {
          if (!parsed[day.id]) {
            parsed[day.id] = { ...INITIAL_STATUS[day.id] };
          }
        });
        return parsed;
      } catch (e) {
        return { ...INITIAL_STATUS };
      }
    }
    return { ...INITIAL_STATUS };
  });

  // Sync back to local storage on changes
  useEffect(() => {
    localStorage.setItem("ielts_task_status", JSON.stringify(taskStatus));
  }, [taskStatus]);

  const activeDay = IELTS_SCHEDULE.find(day => day.id === selectedDayId) || IELTS_SCHEDULE[0];

  // Global actions
  const handleToggleStatus = (key: keyof Omit<TaskStatus[string], "listening" | "notes">) => {
    setTaskStatus(prev => {
      const currentDayStatus = prev[selectedDayId] || { ...INITIAL_STATUS[selectedDayId] };
      return {
        ...prev,
        [selectedDayId]: {
          ...currentDayStatus,
          [key]: !currentDayStatus[key]
        }
      };
    });
  };

  const handleToggleListening = (index: number) => {
    setTaskStatus(prev => {
      const currentDayStatus = prev[selectedDayId] || { ...INITIAL_STATUS[selectedDayId] };
      const updatedListening = [...currentDayStatus.listening];
      updatedListening[index] = !updatedListening[index];
      return {
        ...prev,
        [selectedDayId]: {
          ...currentDayStatus,
          listening: updatedListening
        }
      };
    });
  };

  const handleUpdateNotes = (text: string) => {
    setTaskStatus(prev => {
      const currentDayStatus = prev[selectedDayId] || { ...INITIAL_STATUS[selectedDayId] };
      return {
        ...prev,
        [selectedDayId]: {
          ...currentDayStatus,
          notes: text
        }
      };
    });
  };

  const handleClearProgress = () => {
    const cleared = { ...INITIAL_STATUS };
    // Clear custom writing sandboxes
    localStorage.removeItem("ielts_draft_task1");
    localStorage.removeItem("ielts_draft_task2");
    // Clear scores
    localStorage.removeItem("ielts_mock_results");
    setTaskStatus(cleared);
  };

  // Jump to Writing Screen with proper setup
  const [sandboxTaskType, setSandboxTaskType] = useState<"task1" | "task2">("task2");
  
  const handleTriggerWriteMode = (taskType: "task1" | "task2") => {
    setSandboxTaskType(taskType);
    setActiveTab("editor");
  };

  // Days left helper
  const getDaysLeft = () => {
    const today = new Date("2026-05-26"); // Static anchor corresponding to initial system clock
    const lastDay = new Date("2026-06-26");
    const diffTime = Math.abs(lastDay.getTime() - today.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Global Progress computation
  const getGlobalCompletionRate = () => {
    let totalTasks = 0;
    let completedTasks = 0;

    IELTS_SCHEDULE.forEach(day => {
      const status = taskStatus[day.id];
      if (!status) return;

      if (day.reading) {
        if (day.reading.timed) { totalTasks++; if (status.readingTimed) completedTasks++; }
        if (day.reading.intensive) { totalTasks++; if (status.readingIntensive) completedTasks++; }
      }
      day.listening.forEach((_, lIndex) => {
        totalTasks++;
        if (status.listening[lIndex]) completedTasks++;
      });
      if (day.writing) { totalTasks++; if (status.writing) completedTasks++; }
      if (day.speaking) {
        if (day.speaking.part1 && day.speaking.part1.length > 0) { totalTasks++; if (status.speakingPart1) completedTasks++; }
        if (day.speaking.part2) { totalTasks++; if (status.speakingPart2) completedTasks++; }
      }
      if (day.review && day.review.length > 0) {
        totalTasks++;
        if (status.review) completedTasks++;
      }
    });

    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  };

  const globalCompletionRate = getGlobalCompletionRate();

  return (
    <div id="ielts-dashboard-app" className="min-h-screen bg-[#F8FAFC] pb-12 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      
      {/* Visual Top Branding Bar */}
      <div className="w-full bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Logo / Title of Hub */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 flex items-center justify-center shadow-md shadow-teal-500/10 shrink-0">
              <Award className="h-5.5 w-5.5 text-white stroke-[2.2]" />
            </div>
            <div className="text-left">
              <h1 className="text-xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-teal-100 to-white tracking-tight flex items-center gap-2">
                IELTS Study Master
                <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded border border-teal-500/30 uppercase tracking-wider font-mono">32-Day Sprint</span>
              </h1>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">雅思短期高效智能化学习备考看板 · 进度可视化中心</p>
            </div>
          </div>

          {/* Quick Stats Panel */}
          <div className="flex items-center gap-4 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/60 self-start md:self-auto shadow-sm">
            
            <div className="text-left pr-4 border-r border-slate-700">
              <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-slate-400 block">距离最终复盘</span>
              <span className="text-md font-mono font-bold text-teal-400 flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-teal-400" />
                {getDaysLeft()} 天
              </span>
            </div>

            <div className="text-left">
              <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-slate-400 block">总进度率</span>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-sm font-mono font-bold text-slate-250">{globalCompletionRate}%</span>
                <div className="w-20 bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full transition-all duration-1000" style={{ width: `${globalCompletionRate}%` }} />
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Main Tab Options Selector */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex gap-2 bg-white p-1 rounded-xl shadow-xs border border-slate-200/50">
          
          <button
            onClick={() => setActiveTab("board")}
            className={`flex-1 py-3 px-4 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === "board"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <ClipboardList className="h-4 w-4" />
            备考大盘打卡
          </button>

          <button
            onClick={() => setActiveTab("analytics")}
            className={`flex-1 py-3 px-4 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === "analytics"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Layers className="h-4 w-4" />
            数据分析及模考
          </button>

          <button
            onClick={() => setActiveTab("editor")}
            className={`flex-1 py-3 px-4 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === "editor"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Edit3 className="h-4 w-4" />
            大/小作文沙箱
          </button>

          <button
            onClick={() => setActiveTab("lexical")}
            className={`flex-1 py-3 px-4 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
              activeTab === "lexical"
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            考点词句速查
          </button>

        </div>
      </div>

      {/* Primary Workspace container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 mt-6 flex-1 flex flex-col justify-start">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: CALENDAR ROADMAP WORKSPACE */}
          {activeTab === "board" && (
            <motion.div
              key="board-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
            >
              {/* Left Calendar Grid (8 cols) */}
              <div className="lg:col-span-7 flex flex-col gap-6">
                <CalendarView
                  taskStatus={taskStatus}
                  selectedDayId={selectedDayId}
                  onSelectDay={setSelectedDayId}
                />
              </div>

              {/* Right Checklist pane (5 cols) */}
              <div className="lg:col-span-5">
                <DayDetails
                  day={activeDay}
                  status={taskStatus[selectedDayId]}
                  onToggleStatus={handleToggleStatus}
                  onToggleListening={handleToggleListening}
                  onUpdateNotes={handleUpdateNotes}
                  onTriggerWriteMode={handleTriggerWriteMode}
                />
              </div>
            </motion.div>
          )}

          {/* TAB 2: ANALYTICS & SCORE HISTORY PROGRESS */}
          {activeTab === "analytics" && (
            <motion.div
              key="analytics-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <AnalyticsPanel
                taskStatus={taskStatus}
                onClearProgress={handleClearProgress}
              />
            </motion.div>
          )}

          {/* TAB 3: WRITING SCRATCHPAD EDITOR */}
          {activeTab === "editor" && (
            <motion.div
              key="editor-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="w-full flex-1"
            >
              <Scratchpad />
            </motion.div>
          )}

          {/* TAB 4: VOCAB BOOSTERS */}
          {activeTab === "lexical" && (
            <motion.div
              key="lexical-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="w-full"
            >
              <LexicalTuner />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Micro copyright and details */}
      <footer className="mt-12 text-center text-slate-400 max-w-xl mx-auto font-sans space-y-1">
        <p className="text-xs">
          雅思备考计划智能中心是由 Google AI Studio 驱动的本地私有沙箱。稿件、备考打卡、模考记录以及错题笔记 100% 留存在你的浏览器中，不会上传到任何服务器。
        </p>
        <p className="text-[10px] mt-2 font-semibold">
          © 2026 Academic Study Space. Built for high band achievers.
        </p>
      </footer>

    </div>
  );
}
