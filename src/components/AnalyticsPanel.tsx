import React, { useState, useEffect } from "react";
import { Award, Zap, CheckSquare, BarChart3, TrendingUp, Calendar, Save, Trash2 } from "lucide-react";
import { IELTS_SCHEDULE, DayPlan, TaskStatus } from "../data/scheduleData";

interface AnalyticsPanelProps {
  taskStatus: TaskStatus;
  onClearProgress: () => void;
}

interface MockResult {
  id: string; // "mock_1" | "mock_2" | "mock_3"
  date: string;
  name: string;
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
}

const DEFAULT_MOCK_RESULTS: MockResult[] = [
  { id: "mock_1", date: "6月7日", name: "模考一 (C19-T1)", listening: 6.5, reading: 6.5, writing: 5.5, speaking: 6.0 },
  { id: "mock_2", date: "6月14日", name: "模考二 (C18-T3)", listening: 7.0, reading: 7.5, writing: 6.0, speaking: 6.5 },
  { id: "mock_3", date: "6月21日", name: "模考三 (C20-T1)", listening: 7.5, reading: 8.0, writing: 6.5, speaking: 7.0 }
];

export default function AnalyticsPanel({ taskStatus, onClearProgress }: AnalyticsPanelProps) {
  const [targetScore, setTargetScore] = useState<number>(7.5);
  const [mockResults, setMockResults] = useState<MockResult[]>(() => {
    const saved = localStorage.getItem("ielts_mock_results");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { return DEFAULT_MOCK_RESULTS; }
    }
    return DEFAULT_MOCK_RESULTS;
  });

  const [activeScoreType, setActiveScoreType] = useState<"average" | "listening" | "reading" | "writing" | "speaking">("average");

  const [scoresDraft, setScoresDraft] = useState({
    listening: 7.0,
    reading: 7.0,
    writing: 6.0,
    speaking: 6.5
  });

  const saveMockResults = (newResults: MockResult[]) => {
    setMockResults(newResults);
    localStorage.setItem("ielts_mock_results", JSON.stringify(newResults));
  };

  const handleUpdateScore = (idx: number, key: keyof Omit<MockResult, "id" | "date" | "name">, value: number) => {
    const updated = [...mockResults];
    updated[idx] = {
      ...updated[idx],
      [key]: value
    };
    saveMockResults(updated);
  };

  // Calculations
  let totalScheduledTasks = 0;
  let totalCompletedTasks = 0;

  let readingTotal = 0, readingDone = 0;
  let listeningTotal = 0, listeningDone = 0;
  let writingTotal = 0, writingDone = 0;
  let speakingTotal = 0, speakingDone = 0;
  let reviewTotal = 0, reviewDone = 0;

  IELTS_SCHEDULE.forEach(day => {
    const status = taskStatus[day.id];
    if (!status) return;

    // Reading
    if (day.reading) {
      if (day.reading.timed) {
        readingTotal++;
        if (status.readingTimed) readingDone++;
      }
      if (day.reading.intensive) {
        readingTotal++;
        if (status.readingIntensive) readingDone++;
      }
    }

    // Listening
    day.listening.forEach((_, lIdx) => {
      listeningTotal++;
      if (status.listening[lIdx]) listeningDone++;
    });

    // Writing
    if (day.writing) {
      writingTotal++;
      if (status.writing) writingDone++;
    }

    // Speaking
    if (day.speaking) {
      if (day.speaking.part1 && day.speaking.part1.length > 0) {
        speakingTotal++;
        if (status.speakingPart1) speakingDone++;
      }
      if (day.speaking.part2) {
        speakingTotal++;
        if (status.speakingPart2) speakingDone++;
      }
    }

    // Review
    if (day.review) {
      day.review.forEach(() => {
        reviewTotal++;
        // If daily review is marked complete as a whole, or we map review to status.review
      });
      if (day.review.length > 0) {
        if (status.review) reviewDone++;
      }
    }
  });

  // Since review details is checked collectively via status.review
  // let's adjust review metrics to match the unique days that have review
  const reviewTotalAdjusted = IELTS_SCHEDULE.filter(d => d.review && d.review.length > 0).length;

  totalScheduledTasks = readingTotal + listeningTotal + writingTotal + speakingTotal + reviewTotalAdjusted;
  totalCompletedTasks = readingDone + listeningDone + writingDone + speakingDone + reviewDone;

  const totalPercentage = totalScheduledTasks > 0 
    ? Math.round((totalCompletedTasks / totalScheduledTasks) * 100) 
    : 0;

  // Streak counter calculation
  const getStreak = () => {
    let currentStreak = 0;
    let maxStreak = 0;
    
    // Sort schedules chronologically (already sorted in constant)
    for (let i = 0; i < IELTS_SCHEDULE.length; i++) {
      const day = IELTS_SCHEDULE[i];
      const status = taskStatus[day.id];
      if (!status) continue;

      // Count many items exist for this day
      let dayTasks = 0;
      let dayDone = 0;

      if (day.reading) {
        if (day.reading.timed) { dayTasks++; if (status.readingTimed) dayDone++; }
        if (day.reading.intensive) { dayTasks++; if (status.readingIntensive) dayDone++; }
      }
      day.listening.forEach((_, lIdx) => {
        dayTasks++;
        if (status.listening[lIdx]) dayDone++;
      });
      if (day.writing) { dayTasks++; if (status.writing) dayDone++; }
      if (day.speaking) {
        if (day.speaking.part1 && day.speaking.part1.length > 0) { dayTasks++; if (status.speakingPart1) dayDone++; }
        if (day.speaking.part2) { dayTasks++; if (status.speakingPart2) dayDone++; }
      }
      if (day.review && day.review.length > 0) {
        dayTasks++;
        if (status.review) dayDone++;
      }

      // Check if day is at least 60% finished or fully checked to count towards streak
      const dayFinished = dayTasks > 0 && dayDone >= Math.ceil(dayTasks * 0.6);

      if (dayFinished) {
        currentStreak++;
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
        }
      } else {
        // Only reset current streak if it has some counts
        if (dayTasks > 0) {
          currentStreak = 0;
        }
      }
    }
    return { currentStreak, maxStreak };
  };

  const { currentStreak, maxStreak } = getStreak();

  // Categories progress
  const categories = [
    { name: "📖 阅读限时与精读", done: readingDone, total: readingTotal, color: "bg-teal-600", text: "text-teal-600" },
    { name: "👂 听力 Section 练习", done: listeningDone, total: listeningTotal, color: "bg-blue-600", text: "text-blue-600" },
    { name: "✍️ 写作习作与范文", done: writingDone, total: writingTotal, color: "bg-amber-600", text: "text-amber-600" },
    { name: "🗣️ 口语 Part 练习", done: speakingDone, total: speakingTotal, color: "bg-rose-600", text: "text-rose-600" },
    { name: "🔁 错题梳理与精听复盘", done: reviewDone, total: reviewTotalAdjusted, color: "bg-purple-600", text: "text-purple-600" }
  ];

  // Draw Line plot of Mock Results
  const getScoreValue = (mock: MockResult) => {
    switch (activeScoreType) {
      case "listening": return mock.listening;
      case "reading": return mock.reading;
      case "writing": return mock.writing;
      case "speaking": return mock.speaking;
      case "average":
      default:
        return Math.round(((mock.listening + mock.reading + mock.writing + mock.speaking) / 4) * 4) / 4; // Round to nearest 0.5/0.25
    }
  };

  const chartPoints = mockResults.map((mock, idx) => {
    const val = getScoreValue(mock);
    return {
      x: 60 + idx * 120,
      y: 200 - (val / 9) * 160, // Maps score 0..9 to y-coord 200..40
      label: mock.date,
      score: val
    };
  });

  const targetY = 200 - (targetScore / 9) * 160;

  return (
    <div id="analytics-panel-root" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Dynamic Summary Panel */}
      <div className="lg:col-span-4 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-teal-600 font-bold block mb-1.5">雅思备考进程</span>
          <h3 className="text-xl font-display font-semibold text-slate-900 flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-teal-600" />
            任务统计大览
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            实时汇总32天共计 {totalScheduledTasks} 个备考任务。
          </p>
        </div>

        {/* Circular Progress Bar */}
        <div className="my-6 flex items-center justify-center relative">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r="62"
              stroke="#F1F5F9"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="72"
              cy="72"
              r="62"
              stroke="#0D9488"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 62}
              strokeDashoffset={2 * Math.PI * 62 * (1 - totalPercentage / 100)}
              className="transition-all duration-1000 ease-out"
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-3xl font-display font-extrabold text-slate-900 tracking-tight">{totalPercentage}%</span>
            <span className="text-[10px] block text-slate-400 font-bold uppercase mt-0.5">完成进度</span>
          </div>
        </div>

        {/* Total stats counters */}
        <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
          <div className="text-center">
            <span className="text-2xl font-mono font-bold text-slate-800">{totalCompletedTasks}</span>
            <span className="text-[10px] block text-slate-400 font-medium">已完成任务</span>
          </div>
          <div className="text-center border-l border-slate-200">
            <span className="text-2xl font-mono font-bold text-slate-800">{totalScheduledTasks - totalCompletedTasks}</span>
            <span className="text-[10px] block text-slate-400 font-medium">剩余待办项</span>
          </div>
        </div>
      </div>

      {/* GitHub Contributions-alike Day Progress Grid */}
      <div className="lg:col-span-8 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-display font-semibold text-slate-900 flex items-center gap-1.5">
              <Calendar className="h-4.5 w-4.5 text-teal-600" />
              短期冲刺日历图 (32天脉络)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">格子颜色深浅代表每日雅思任务的完成饱和度。</p>
          </div>

          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-1.5 text-xs">
              <Zap className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
              <span className="text-slate-600">当前连续: <strong className="font-mono text-slate-800">{currentStreak} 天</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Award className="h-3.5 w-3.5 text-teal-600" />
              <span className="text-slate-600">最长连击: <strong className="font-mono text-slate-800">{maxStreak} 天</strong></span>
            </div>
          </div>
        </div>

        {/* 32 Day Blocks Matrix */}
        <div className="grid grid-cols-4 sm:grid-cols-8 md:grid-cols-8 lg:grid-cols-8 gap-2.5 my-6">
          {IELTS_SCHEDULE.map((day, idx) => {
            const status = taskStatus[day.id];
            let doneCount = 0;
            let totalCount = 0;

            if (day.reading) {
              if (day.reading.timed) { totalCount++; if (status?.readingTimed) doneCount++; }
              if (day.reading.intensive) { totalCount++; if (status?.readingIntensive) doneCount++; }
            }
            day.listening.forEach((_, lIdx) => {
              totalCount++;
              if (status?.listening[lIdx]) doneCount++;
            });
            if (day.writing) { totalCount++; if (status?.writing) doneCount++; }
            if (day.speaking) {
              if (day.speaking.part1 && day.speaking.part1.length > 0) { totalCount++; if (status?.speakingPart1) doneCount++; }
              if (day.speaking.part2) { totalCount++; if (status?.speakingPart2) doneCount++; }
            }
            if (day.review && day.review.length > 0) {
              totalCount++;
              if (status?.review) doneCount++;
            }

            const percentage = totalCount > 0 ? doneCount / totalCount : 0;
            
            // Set colors based on completion fraction
            let bgColor = "bg-slate-50 border-slate-200/50 hover:bg-slate-100";
            if (percentage > 0 && percentage <= 0.25) bgColor = "bg-teal-50 border-teal-100 hover:bg-teal-100/55 text-teal-800";
            else if (percentage > 0.25 && percentage <= 0.5) bgColor = "bg-teal-100 border-teal-200 hover:bg-teal-200/70 text-teal-900";
            else if (percentage > 0.5 && percentage <= 0.8) bgColor = "bg-teal-500 border-teal-600 hover:bg-teal-600 text-white";
            else if (percentage > 0.8) bgColor = "bg-teal-700 border-teal-800 hover:bg-teal-800 text-white";

            const isCurrentYearDay = day.isMockDay || day.isHalfMock;

            return (
              <div
                key={day.id}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl border text-center transition-all cursor-pointer relative group ${bgColor}`}
              >
                <span className="text-[10px] font-bold block leading-none">{day.date.replace("月", "/").replace("日", "")}</span>
                <span className="text-[9px] block opacity-70 mt-0.5">{day.weekday}</span>
                {isCurrentYearDay && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white" title={day.isMockDay ? "全真模考日" : "半模考"} />
                )}

                {/* Micro tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col items-center pointer-events-none z-50">
                  <div className="bg-slate-900 text-white text-[10px] font-sans px-2.5 py-1 rounded shadow-sm whitespace-nowrap">
                    {day.date} (进度: {doneCount}/{totalCount})
                    {day.isMockDay ? "【全真模考日】" : day.isHalfMock ? "【半模考日】" : ""}
                  </div>
                  <div className="w-1.5 h-1.5 bg-slate-900 rotate-45 -mt-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend color explain */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <span>低完成</span>
            <span className="w-2.5 h-2.5 rounded bg-slate-50 border border-slate-200 inline-block" />
            <span className="w-2.5 h-2.5 rounded bg-teal-50 border border-teal-100 inline-block" />
            <span className="w-2.5 h-2.5 rounded bg-teal-100 border border-teal-200 inline-block" />
            <span className="w-2.5 h-2.5 rounded bg-teal-500 border border-teal-600 inline-block" />
            <span className="w-2.5 h-2.5 rounded bg-teal-700 border border-teal-800 inline-block" />
            <span>高精通</span>
          </div>

          <button
            onClick={() => {
              if (window.confirm("确定要清空这 32 天来所有的打卡记录和学习笔记吗？此操作无法撤销。")) {
                onClearProgress();
              }
            }}
            className="text-slate-400 hover:text-red-500 flex items-center gap-1 font-medium transition cursor-pointer text-[11px]"
          >
            <Trash2 className="h-3.5 w-3.5" />
            清空所有学习记录
          </button>
        </div>
      </div>

      {/* Progress detail bars */}
      <div className="lg:col-span-6 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-base font-display font-semibold text-slate-900 flex items-center gap-1.5">
            <BarChart3 className="h-4.5 w-4.5 text-teal-600" />
            分阶段/类别备考占比
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            各科目当前备考任务的完成度和通过比例。
          </p>
        </div>

        <div className="space-y-4 my-5 flex-1 flex flex-col justify-center">
          {categories.map((cat, idx) => {
            const ratio = cat.total > 0 ? Math.round((cat.done / cat.total) * 100) : 0;
            return (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-slate-700/90">
                  <span className="flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                    {cat.name}
                  </span>
                  <span>{cat.done}/{cat.total} ({ratio}%)</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${cat.color}`}
                    style={{ width: `${ratio}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-slate-400 leading-relaxed italic bg-slate-50 p-3 rounded-lg border border-slate-100/50">
          * 根据雅思备考心理，听力和阅读属于客观输入科目，见效较快；口语和写作需要重写跟读反馈，建议保持高频每日输入。
        </p>
      </div>

      {/* Score and Target charts */}
      <div className="lg:col-span-6 bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-display font-semibold text-slate-900 flex items-center gap-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-teal-600" />
              模考成绩进展曲线 (IELTS Progress)
            </h3>
            
            {/* Target band configuration */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-500">目标分数:</span>
              <select
                value={targetScore}
                onChange={(e) => setTargetScore(parseFloat(e.target.value))}
                className="bg-slate-100 text-slate-800 font-mono font-bold rounded px-1.5 py-0.5 focus:outline-none"
              >
                {[6.0, 6.5, 7.0, 7.5, 8.0, 8.5, 9.0].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            绘制三次全真模考中的实战分数演进趋势。
          </p>
        </div>

        {/* Score category controls */}
        <div className="flex gap-1 bg-slate-100 p-0.5 rounded-lg my-3 self-start">
          {[
            { id: "average", name: "总分" },
            { id: "listening", name: "听力" },
            { id: "reading", name: "阅读" },
            { id: "writing", name: "写作" },
            { id: "speaking", name: "口语" }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setActiveScoreType(btn.id as any)}
              className={`px-2.5 py-1 text-[10px] font-semibold rounded-md transition ${
                activeScoreType === btn.id
                  ? "bg-white text-teal-800 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {btn.name}
            </button>
          ))}
        </div>

        {/* Vector SVG Line Plot */}
        <div className="relative h-[220px] w-full flex items-center justify-center bg-slate-50/50 rounded-xl border border-slate-100/50 p-3">
          <svg className="w-full h-full" viewBox="0 0 320 220">
            {/* Y Axis markings */}
            {[9, 8, 7, 6, 5, 4].map(s => {
              const y = 200 - (s / 9) * 160;
              return (
                <g key={s} className="opacity-40">
                  <line x1="40" y1={y} x2="300" y2={y} stroke="#CBD5E1" strokeWidth="0.5" strokeDasharray="3 3" />
                  <text x="18" y={y + 4} fill="#64748B" fontSize="9" fontFamily="monospace" textAnchor="right">{s}.0</text>
                </g>
              );
            })}

            {/* Target Line */}
            <line
              x1="40"
              y1={targetY}
              x2="300"
              y2={targetY}
              stroke="#F43F5E"
              strokeWidth="1.2"
              strokeDasharray="4 4"
              className="opacity-70"
            />
            <text x="302" y={targetY + 3} fill="#F43F5E" fontSize="8" fontWeight="bold">目标 ({targetScore})</text>

            {/* Plot path logic */}
            {chartPoints.length > 1 && (
              <path
                d={`M ${chartPoints.map(p => `${p.x} ${p.y}`).join(" L ")}`}
                fill="none"
                stroke="#0D9488"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* High-contrast node circles */}
            {chartPoints.map((pt, pIdx) => (
              <g key={pIdx}>
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="6"
                  fill="#0D9488"
                  stroke="#FFFFFF"
                  strokeWidth="2"
                  className="hover:scale-125 transition-transform cursor-pointer"
                  title={`${pt.label}: ${pt.score}`}
                />
                <text x={pt.x} y={pt.y - 12} fill="#0F172A" fontWeight="bold" fontSize="10" fontFamily="monospace" textAnchor="middle">
                  {pt.score}
                </text>
                <text x={pt.x} y="212" fill="#64748B" fontSize="9" textAnchor="middle">
                  {pt.label}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Input scores editor panel */}
        <div className="border-t border-slate-100 pt-3.5 space-y-3">
          <h4 className="text-xs font-semibold text-slate-800">登记/修改实战得分:</h4>
          <div className="grid grid-cols-3 gap-2">
            {mockResults.map((mockResult, mIdx) => (
              <div key={mockResult.id} className="p-2 bg-slate-50 border border-slate-200/60 rounded-xl text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-500">{mockResult.name.split(" ")[0]}</span>
                <div className="grid grid-cols-2 gap-1 text-[10px]">
                  <div>
                    <label className="text-[9px] text-slate-400 block">听力</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="9"
                      value={mockResult.listening}
                      onChange={(e) => handleUpdateScore(mIdx, "listening", parseFloat(e.target.value) || 0)}
                      className="w-full bg-white text-center font-mono font-bold text-slate-700 rounded border border-slate-200 py-0.5 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 block">阅读</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="9"
                      value={mockResult.reading}
                      onChange={(e) => handleUpdateScore(mIdx, "reading", parseFloat(e.target.value) || 0)}
                      className="w-full bg-white text-center font-mono font-bold text-slate-700 rounded border border-slate-200 py-0.5 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 block">写作</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="9"
                      value={mockResult.writing}
                      onChange={(e) => handleUpdateScore(mIdx, "writing", parseFloat(e.target.value) || 0)}
                      className="w-full bg-white text-center font-mono font-bold text-slate-700 rounded border border-slate-200 py-0.5 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] text-slate-400 block">口语</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="9"
                      value={mockResult.speaking}
                      onChange={(e) => handleUpdateScore(mIdx, "speaking", parseFloat(e.target.value) || 0)}
                      className="w-full bg-white text-center font-mono font-bold text-slate-700 rounded border border-slate-200 py-0.5 focus:outline-none focus:border-teal-500"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
