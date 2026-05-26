import React, { useState } from "react";
import { Filter, Calendar, List, Check, BookOpen, Mic, Headphones, Flame, Layers, Clock, ArrowRight, HelpCircle } from "lucide-react";
import { IELTS_SCHEDULE, DayPlan, TaskStatus } from "../data/scheduleData";

interface CalendarViewProps {
  taskStatus: TaskStatus;
  selectedDayId: string;
  onSelectDay: (id: string) => void;
}

export default function CalendarView({ taskStatus, selectedDayId, onSelectDay }: CalendarViewProps) {
  const [filterType, setFilterType] = useState<"all" | "mock" | "unfinished" | "writing">("all");
  const [layoutMode, setLayoutMode] = useState<"grid" | "timeline" | "weekly" | "list">("grid");
  const [selectedWeek, setSelectedWeek] = useState<number>(1);

  // Group IELTS_SCHEDULE by week (Week 1: Day 1-7, Week 2: Day 8-14, Week 3: Day 15-21, Week 4: Day 22-28, Week 5: Day 29-32)
  const getDayWeekNumber = (day: DayPlan) => {
    const idx = IELTS_SCHEDULE.findIndex(d => d.id === day.id);
    if (idx === -1) return 1;
    if (idx < 7) return 1;
    if (idx < 14) return 2;
    if (idx < 21) return 3;
    if (idx < 28) return 4;
    return 5;
  };

  const weekLabels = [
    { num: 1, name: "第一周", subtitle: "预热 & 基础突破" },
    { num: 2, name: "第二周", subtitle: "考点稳固突破" },
    { num: 3, name: "第三周", subtitle: "难度及题型稳固" },
    { num: 4, name: "第四周", subtitle: "场景冲刺突破" },
    { num: 5, name: "第五周", subtitle: "极限考前模拟" }
  ];

  const getDayStats = (day: DayPlan) => {
    const status = taskStatus[day.id];
    let total = 0;
    let done = 0;
    if (day.reading) {
      if (day.reading.timed) { total++; if (status?.readingTimed) done++; }
      if (day.reading.intensive) { total++; if (status?.readingIntensive) done++; }
    }
    day.listening.forEach((_, lIdx) => {
      total++;
      if (status?.listening[lIdx]) done++;
    });
    if (day.writing) { total++; if (status?.writing) done++; }
    if (day.speaking) {
      if (day.speaking.part1 && day.speaking.part1.length > 0) { total++; if (status?.speakingPart1) done++; }
      if (day.speaking.part2) { total++; if (status?.speakingPart2) done++; }
    }
    if (day.review && day.review.length > 0) {
      total++;
      if (status?.review) done++;
    }
    return { done, total, ratio: total > 0 ? done / total : 0, isFullyDone: total > 0 && done === total };
  };

  const filteredDays = IELTS_SCHEDULE.filter(day => {
    const { isFullyDone } = getDayStats(day);

    switch (filterType) {
      case "mock":
        return day.isMockDay || day.isHalfMock;
      case "unfinished":
        return !isFullyDone;
      case "writing":
        return day.writing && day.writing.toLowerCase().includes("task2");
      case "all":
      default:
        return true;
    }
  });

  return (
    <div id="calendar-view-root" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col gap-5">
      
      {/* Search and Filters Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="text-left">
          <h2 className="text-base font-display font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-teal-600 shrink-0" />
            雅思 32 日备考路线大盘
            <span className="text-xs bg-teal-50 text-teal-700 font-mono font-bold px-2.5 py-0.5 rounded-full border border-teal-100/60">
              {filteredDays.length} / 32 天
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            系统支持 4 种可视化排版版式，点击各卡片随时载入当日核心学习计划与错题记本。
          </p>
        </div>

        {/* Layout Selector with icons */}
        <div className="flex items-center gap-1.5 self-start md:self-auto bg-slate-50 p-1 rounded-xl border border-slate-200/50">
          {[
            { id: "grid", label: "网格卡片", icon: Calendar },
            { id: "timeline", label: "精英时间轴", icon: Clock },
            { id: "weekly", label: "周度里程碑", icon: Layers },
            { id: "list", label: "精细明细表", icon: List }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setLayoutMode(opt.id as any)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                layoutMode === opt.id
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/35"
              }`}
            >
              <opt.icon className="h-3.5 w-3.5 shadow-2xs" />
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter Options */}
      <div className="flex flex-wrap items-center gap-2 bg-stone-50/50 p-2.5 rounded-xl border border-stone-200/40">
        <span className="text-[10px] uppercase font-mono font-bold text-slate-400 tracking-wider flex items-center gap-1 mr-1">
          <Filter className="h-3 w-3 text-slate-400" /> 筛选聚焦 :
        </span>
        {[
          { id: "all", label: "全部周期 (32 Days)" },
          { id: "mock", label: "仅模考/半模节点" },
          { id: "unfinished", label: "未学完/进行中" },
          { id: "writing", label: "大作文 (Task 2) 练习日" }
        ].map(btn => (
          <button
            key={btn.id}
            onClick={() => setFilterType(btn.id as any)}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition cursor-pointer ${
              filterType === btn.id
                ? "bg-teal-600 text-white border-teal-600 shadow-2xs"
                : "bg-white text-slate-600 hover:bg-slate-50 border-slate-200"
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* RENDER VIEW ACCORDING TO SELECTED LAYOUT MODE */}

      {/* 1. GRID MODE (网格卡片版式) */}
      {layoutMode === "grid" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-[480px] overflow-y-auto pr-1">
          {filteredDays.map(day => {
            const isSelected = selectedDayId === day.id;
            const idx = IELTS_SCHEDULE.findIndex(d => d.id === day.id) + 1;
            const { done, total, ratio, isFullyDone } = getDayStats(day);

            return (
              <div
                key={day.id}
                onClick={() => onSelectDay(day.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between h-[115px] select-none text-left relative overflow-hidden ${
                  isSelected
                    ? "bg-teal-50/90 border-teal-500 shadow-xs ring-1 ring-teal-500/30"
                    : "bg-white border-slate-200 hover:border-slate-350 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    Day {idx}
                  </span>

                  {isFullyDone ? (
                    <span className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-white stroke-[3.5]" />
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded font-bold">
                      {done}/{total}
                    </span>
                  )}
                </div>

                <div className="mt-2">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                    <span>{day.date}</span>
                    <span className={`text-[9px] font-semibold ${
                      day.isMockDay ? "text-rose-650 bg-rose-50 px-1 py-0.1 rounded border border-rose-100" : day.isHalfMock ? "text-amber-605 bg-amber-50 px-1 py-0.1 rounded border border-amber-100" : "text-slate-400"
                    }`}>
                      {day.isMockDay ? "全模" : day.isHalfMock ? "半模" : day.weekday}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-normal truncate mt-1">
                    {day.isMockDay ? "📖 仿全真听说读写大考" : day.reading?.focus || day.writing || "个性错题复盘日"}
                  </div>
                </div>

                {/* Progress bar fill */}
                <div className="mt-2.5 w-full bg-slate-100 h-1 rounded-sm overflow-hidden animate-pulse">
                  <div
                    className={`h-full rounded-sm transition-all duration-300 ${
                      isFullyDone ? "bg-emerald-500" : "bg-teal-500"
                    }`}
                    style={{ width: `${ratio * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. TIMELINE MODE (渐进时间轴里程碑版式) */}
      {layoutMode === "timeline" && (
        <div className="max-h-[480px] overflow-y-auto pr-2 text-left relative pl-4 border-l-2 border-slate-100 ml-3 py-1 space-y-4">
          {filteredDays.map((day, ix) => {
            const isSelected = selectedDayId === day.id;
            const globalIndex = IELTS_SCHEDULE.findIndex(d => d.id === day.id) + 1;
            const { done, total, ratio, isFullyDone } = getDayStats(day);

            return (
              <div
                key={day.id}
                onClick={() => onSelectDay(day.id)}
                className={`relative pl-8 group cursor-pointer select-none transition-all`}
              >
                {/* Timeline node circle */}
                <div className={`absolute left-[-26px] top-1.5 w-4 h-4 rounded-full border-2 bg-white transition-all duration-300 flex items-center justify-center ${
                  isSelected
                    ? "border-teal-600 scale-125 bg-teal-500"
                    : isFullyDone
                      ? "border-emerald-500 bg-emerald-500"
                      : day.isMockDay
                        ? "border-rose-600"
                        : "border-slate-300 group-hover:border-slate-500"
                }`}>
                  {isFullyDone && <Check className="h-2 w-2 text-white stroke-[4]" />}
                </div>

                {/* Card Container */}
                <div className={`p-4 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all ${
                  isSelected
                    ? "bg-teal-50/70 border-teal-500 shadow-3xs"
                    : "bg-white border-slate-150 hover:bg-slate-50/50"
                }`}>
                  
                  <div className="space-y-1 my-0.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Day {globalIndex}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800">
                        {day.date} ({day.weekday})
                      </h4>
                      
                      {day.isMockDay && (
                        <span className="bg-rose-50 text-rose-700 text-[8px] font-bold px-2 py-0.2 rounded font-sans uppercase animate-pulse border border-rose-100">
                          全真模考节点
                        </span>
                      )}
                      {day.isHalfMock && (
                        <span className="bg-amber-50 text-amber-700 text-[8px] font-bold px-2 py-0.2 rounded font-sans uppercase border border-amber-100">
                          段落限时半模
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 font-medium truncate mt-1">
                      {day.reading?.focus ? (
                        <span className="text-teal-800">🎯 {day.reading.focus}</span>
                      ) : (
                        <span className="text-slate-400">📝 阶段重点技能整合与复盘纠错</span>
                      )}
                    </p>

                    {/* Task labels summary */}
                    <div className="flex flex-wrap gap-1.5 pt-1 text-[9px] font-semibold">
                      {day.reading?.timed && (
                        <span className="bg-teal-50 text-teal-700 px-1.5 py-0.2 rounded font-mono">
                          读: {day.reading.timed.split(" ")[0]}
                        </span>
                      )}
                      {day.listening.length > 0 && (
                        <span className="bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded font-mono">
                          听: {day.listening.length} P
                        </span>
                      )}
                      {day.writing && (
                        <span className="bg-amber-50 text-amber-700 px-1.5 py-0.2 rounded font-mono">
                          {day.writing.split(":")[0]}
                        </span>
                      )}
                      {day.speaking?.part2 && (
                        <span className="bg-rose-50 text-rose-700 px-1.5 py-0.2 rounded font-mono">
                          P2: {day.speaking.part2.substring(0, 8)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right hand side progress circle / stat */}
                  <div className="flex items-center gap-3 self-end md:self-auto shrink-0 pl-2">
                    <span className="text-xs font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded font-bold">
                      {done}/{total}
                    </span>
                    <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${isFullyDone ? 'bg-emerald-500' : 'bg-teal-500'}`} style={{ width: `${ratio * 100}%` }} />
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. WEEKLY PLAYLIST KANBAN (周里程碑板块) */}
      {layoutMode === "weekly" && (
        <div className="flex flex-col gap-4 text-left">
          
          {/* Week tabs selector */}
          <div className="grid grid-cols-5 gap-1 bg-slate-100/80 p-0.5 rounded-xl border border-slate-200/50">
            {weekLabels.map(wl => (
              <button
                key={wl.num}
                onClick={() => setSelectedWeek(wl.num)}
                className={`py-2 text-center rounded-lg transition cursor-pointer select-none ${
                  selectedWeek === wl.num
                    ? "bg-white text-slate-900 shadow-2xs font-extrabold"
                    : "text-slate-600 hover:text-slate-900 text-xs font-medium"
                }`}
              >
                <div className="text-xs font-bold">{wl.name}</div>
                <div className="text-[8px] opacity-75 hidden md:block mt-0.5 truncate max-w-[100px] mx-auto">{wl.subtitle}</div>
              </button>
            ))}
          </div>

          {/* Current Week Day Cards */}
          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {filteredDays
              .filter(day => getDayWeekNumber(day) === selectedWeek)
              .map(day => {
                const isSelected = selectedDayId === day.id;
                const idx = IELTS_SCHEDULE.findIndex(d => d.id === day.id) + 1;
                const { done, total, ratio, isFullyDone } = getDayStats(day);

                return (
                  <div
                    key={day.id}
                    onClick={() => onSelectDay(day.id)}
                    className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between select-none ${
                      isSelected
                        ? "bg-teal-50/90 border-teal-500 shadow-2xs"
                        : "bg-white border-slate-200 hover:bg-slate-50/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 text-center bg-slate-100 rounded-lg p-1.5 shrink-0">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block font-mono">Day</span>
                        <span className="text-xs font-extrabold font-mono text-slate-800">{idx}</span>
                      </div>

                      <div className="space-y-0.5 text-left">
                        <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5 flex-wrap">
                          <span>{day.date}</span>
                          <span className="text-slate-400 font-normal">({day.weekday})</span>
                          {day.isMockDay && <span className="bg-rose-50 text-rose-600 text-[8px] font-bold px-1.5 rounded uppercase">全模</span>}
                          {day.isHalfMock && <span className="bg-amber-50 text-amber-600 text-[8px] font-bold px-1.5 rounded uppercase">半模</span>}
                        </div>
                        <p className="text-[11px] text-slate-500 font-sans truncate max-w-sm md:max-w-md">
                          {day.reading?.focus ? `🎯 ${day.reading.focus}` : "📑 听说读写作专项仿真合龙与词库纠错归纳"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-mono text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded font-bold">
                        {done}/{total} done
                      </span>
                      {isFullyDone ? (
                        <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="h-3.5 w-3.5 text-white" />
                        </div>
                      ) : (
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      )}
                    </div>
                  </div>
                );
              })}
            
            {filteredDays.filter(day => getDayWeekNumber(day) === selectedWeek).length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs">
                当前筛选条件下，该周无对应的安排日。
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. COMPACT LIST MODE (表格明细版式) */}
      {layoutMode === "list" && (
        <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1 text-left">
          {filteredDays.map(day => {
            const isSelected = selectedDayId === day.id;
            const idx = IELTS_SCHEDULE.findIndex(d => d.id === day.id) + 1;
            const { done, total, isFullyDone } = getDayStats(day);

            return (
              <div
                key={day.id}
                onClick={() => onSelectDay(day.id)}
                className={`p-3 rounded-xl border select-none cursor-pointer flex items-center justify-between transition-all ${
                  isSelected
                    ? "bg-teal-50 border-teal-500 shadow-3xs"
                    : "bg-white border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-14 shrink-0 text-left">
                    <span className="text-xs font-bold text-slate-800 block">Day {idx}</span>
                    <span className="text-[10px] text-slate-400 capitalize">{day.date} ({day.weekday})</span>
                  </div>

                  <div className="h-6 w-px bg-slate-200 shrink-0" />

                  {/* Tasks indicators */}
                  <div className="space-y-1 ml-1 truncate">
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      {day.reading && (
                        <span className="bg-teal-50 text-teal-700 font-bold px-1.5 py-0.2 rounded flex items-center gap-1">
                          <BookOpen className="h-3 w-3 shrink-0" />
                          读: {day.reading.timed?.split(" ")[0] || "精学"}
                        </span>
                      )}
                      {day.listening.length > 0 && (
                        <span className="bg-blue-50 text-blue-700 font-bold px-1.5 py-0.2 rounded flex items-center gap-1">
                          <Headphones className="h-3 w-3 shrink-0" />
                          听: {day.listening.length} P
                        </span>
                      )}
                      {day.writing && (
                        <span className="bg-amber-50 text-amber-700 font-bold px-1.5 py-0.2 rounded">
                          写: {day.writing.substring(0, 15)}...
                        </span>
                      )}
                      {day.speaking?.part2 && (
                        <span className="bg-rose-50 text-rose-700 font-bold px-1.5 py-0.2 rounded flex items-center gap-1">
                          <Mic className="h-3 w-3 shrink-0" />
                          口: {day.speaking.part2.substring(0, 10)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 shrink-0 ml-3">
                  {day.isMockDay && <span className="bg-red-50 text-red-650 border border-red-200 text-[9px] font-bold px-1.5 py-0.5 rounded">模考</span>}
                  {day.isHalfMock && <span className="bg-amber-50 text-amber-650 border border-amber-200 text-[9px] font-bold px-1.5 py-0.5 rounded">半模</span>}

                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    {done}/{total} done
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info indicator */}
      <div className="bg-sky-50/50 border border-sky-100 rounded-xl p-3 flex items-start gap-2 text-xs text-slate-600 text-left">
        <HelpCircle className="h-4.5 w-4.5 text-sky-600 mt-0.5 shrink-0" />
        <p className="leading-relaxed font-sans">
          <strong>小贴士:</strong> 全真模考日（如 6/7, 6/14, 6/21）需要你腾出一段整阶段时间，模拟真实考试的无外力计时环境完成听说读写整套测试。
        </p>
      </div>

    </div>
  );
}
