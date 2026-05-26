import React from "react";
import { BookOpen, Headphones, Edit2, Mic, RotateCcw, AlertCircle, FileText, Check, ShieldAlert, Sparkles } from "lucide-react";
import { IELTS_SCHEDULE, DayPlan, TaskStatus } from "../data/scheduleData";

interface DayDetailsProps {
  day: DayPlan;
  status: TaskStatus[string];
  onToggleStatus: (key: keyof Omit<TaskStatus[string], "listening" | "notes">) => void;
  onToggleListening: (index: number) => void;
  onUpdateNotes: (text: string) => void;
  onTriggerWriteMode: (taskType: "task1" | "task2") => void;
}

export default function DayDetails({
  day,
  status,
  onToggleStatus,
  onToggleListening,
  onUpdateNotes,
  onTriggerWriteMode
}: DayDetailsProps) {
  if (!status) return null;

  const isWritingTask1 = day.writing && day.writing.toLowerCase().includes("task1");
  const isWritingTask2 = day.writing && day.writing.toLowerCase().includes("task2");

  // Determine completions for progress badge
  let totalNum = 0;
  let doneNum = 0;

  if (day.reading) {
    if (day.reading.timed) { totalNum++; if (status.readingTimed) doneNum++; }
    if (day.reading.intensive) { totalNum++; if (status.readingIntensive) doneNum++; }
  }
  day.listening.forEach((_, lIdx) => {
    totalNum++;
    if (status.listening[lIdx]) doneNum++;
  });
  if (day.writing) { totalNum++; if (status.writing) doneNum++; }
  if (day.speaking) {
    if (day.speaking.part1 && day.speaking.part1.length > 0) { totalNum++; if (status.speakingPart1) doneNum++; }
    if (day.speaking.part2) { totalNum++; if (status.speakingPart2) doneNum++; }
  }
  if (day.review && day.review.length > 0) {
    totalNum++;
    if (status.review) doneNum++;
  }

  const completionPercent = totalNum > 0 ? Math.round((doneNum / totalNum) * 100) : 0;

  const handleOpenSandbox = () => {
    if (isWritingTask1) {
      onTriggerWriteMode("task1");
    } else {
      onTriggerWriteMode("task2");
    }
  };

  return (
    <div id="day-details-root" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
      
      {/* Target day title and stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl font-display font-extrabold text-slate-900 tracking-tight">{day.date}</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
              day.isMockDay 
                ? "bg-rose-100 text-rose-800" 
                : day.isHalfMock 
                  ? "bg-amber-100 text-amber-800" 
                  : "bg-slate-100 text-slate-700"
            }`}>
              {day.isMockDay ? "全真模考日" : day.isHalfMock ? "半模考日" : day.weekday}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            雅思备考计划第 {IELTS_SCHEDULE.findIndex(d => d.id === day.id) + 1} 天进程。
          </p>
        </div>

        {/* Completion percentage indicator */}
        <div className="flex items-center gap-2.5">
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">当日任务进度</span>
            <span className="text-sm font-bold font-mono text-slate-800">{doneNum}/{totalNum} 已学完</span>
          </div>
          <div className="w-12 h-12 rounded-full border-4 border-slate-100 flex items-center justify-center relative">
            <span className="text-[10px] font-mono font-extrabold text-teal-700">{completionPercent}%</span>
            {/* Visual circle fill could go here */}
          </div>
        </div>
      </div>

      {/* Focus Warning details */}
      {day.reading?.focus && (
        <div className="bg-teal-50/70 border border-teal-100/70 rounded-xl p-3.5 flex items-start gap-2.5 text-xs">
          <Sparkles className="h-4.5 w-4.5 text-teal-600 mt-0.5 shrink-0" />
          <div className="space-y-0.5 text-slate-700 text-left">
            <strong className="text-teal-900 font-semibold">💡 当日考点聚焦 (Focus Point):</strong>
            <p className="leading-relaxed">{day.reading.focus}</p>
          </div>
        </div>
      )}

      {/* Checklist items block */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">科目打卡清单</h4>
        
        {/* READING SECTION */}
        {day.reading && (
          <div className="border border-slate-100 rounded-xl p-4 space-y-3 shadow-2xs hover:border-slate-200 transition-all text-left">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <BookOpen className="h-4 w-4 text-teal-600" />
                📖 阅读理解 (Reading Area)
              </span>
              <span className="text-[9px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.2 rounded font-semibold">限时+精读</span>
            </div>

            <div className="space-y-2">
              {day.reading.timed && (
                <div className="flex items-center justify-between text-xs py-1 hover:bg-slate-50/50 rounded px-1 transition">
                  <span className="text-slate-600 truncate flex-1 mr-3 leading-relaxed">
                    ⏱️ <strong>限时训练:</strong> <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[11px] text-slate-700">{day.reading.timed}</span>
                  </span>
                  <button
                    onClick={() => onToggleStatus("readingTimed")}
                    className={`h-5 w-5 rounded-md border flex items-center justify-center cursor-pointer transition ${
                      status.readingTimed 
                        ? "bg-emerald-500 border-emerald-500 text-white" 
                        : "border-slate-300 bg-white hover:border-teal-500"
                    }`}
                  >
                    {status.readingTimed && <Check className="h-3 w-3 stroke-[3]" />}
                  </button>
                </div>
              )}

              {day.reading.intensive && (
                <div className="flex items-center justify-between text-xs py-1 hover:bg-slate-50/50 rounded px-1 transition">
                  <span className="text-slate-600 truncate flex-1 mr-3 leading-relaxed">
                    🎓 <strong>长句精读:</strong> <span className="font-semibold text-slate-800">{day.reading.intensive}</span>
                  </span>
                  <button
                    onClick={() => onToggleStatus("readingIntensive")}
                    className={`h-5 w-5 rounded-md border flex items-center justify-center cursor-pointer transition ${
                      status.readingIntensive 
                        ? "bg-emerald-500 border-emerald-500 text-white" 
                        : "border-slate-300 bg-white hover:border-teal-500"
                    }`}
                  >
                    {status.readingIntensive && <Check className="h-3 w-3 stroke-[3]" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LISTENING SECTIONS */}
        {day.listening.length > 0 && (
          <div className="border border-slate-100 rounded-xl p-4 space-y-3 shadow-2xs hover:border-slate-200 transition-all text-left">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Headphones className="h-4 w-4 text-blue-600" />
                👂 听力强化 (Listening Area)
              </span>
              <span className="text-[9px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.2 rounded font-semibold">各Section分开清扫</span>
            </div>

            <div className="space-y-2">
              {day.listening.map((section, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 hover:bg-slate-50/50 rounded px-1 transition">
                  <span className="text-slate-600 truncate flex-1 mr-3 leading-relaxed">
                    🔊 <strong>{section.includes("Part") ? "Part" : "Section"}:</strong> <span className="font-mono font-medium text-slate-800">{section}</span>
                  </span>
                  <button
                    onClick={() => onToggleListening(idx)}
                    className={`h-5 w-5 rounded-md border flex items-center justify-center cursor-pointer transition ${
                      status.listening[idx] 
                        ? "bg-emerald-500 border-emerald-500 text-white" 
                        : "border-slate-300 bg-white hover:border-teal-500"
                    }`}
                  >
                    {status.listening[idx] && <Check className="h-3 w-3 stroke-[3]" />}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* WRITING SECTION */}
        {day.writing && (
          <div className="border border-slate-100 rounded-xl p-4 space-y-3 shadow-2xs hover:border-slate-200 transition-all text-left">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Edit2 className="h-4 w-4 text-amber-600" />
                ✍️ 写作专攻 (Writing Test)
              </span>
              <span className="text-[9px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.2 rounded font-semibold">大/小作文范文对比</span>
            </div>

            <div className="flex items-center justify-between text-xs gap-4">
              <div className="flex-1 text-slate-600 text-xs leading-relaxed">
                ✏️ <strong>命题题目:</strong> <span className="font-semibold text-slate-800 block sm:inline mt-1 sm:mt-0">{day.writing}</span>
              </div>
              <div className="flex items-center gap-2">
                {/* Sandbox Link button */}
                <button
                  onClick={handleOpenSandbox}
                  className="bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200/50 py-1 px-2 rounded-lg text-[10px] font-bold cursor-pointer transition-all flex items-center gap-1 shrink-0"
                  title="开往写作练习大厅"
                >
                  <FileText className="h-3 w-3" />
                  写草稿
                </button>
                
                <button
                  onClick={() => onToggleStatus("writing")}
                  className={`h-5 w-5 rounded-md border flex items-center justify-center cursor-pointer transition shrink-0 ${
                    status.writing 
                      ? "bg-emerald-500 border-emerald-500 text-white" 
                      : "border-slate-300 bg-white hover:border-teal-500"
                  }`}
                >
                  {status.writing && <Check className="h-3 w-3 stroke-[3]" />}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SPEAKING SECTION */}
        {day.speaking && (
          <div className="border border-slate-100 rounded-xl p-4 space-y-3 shadow-2xs hover:border-slate-200 transition-all text-left">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Mic className="h-4 w-4 text-rose-600" />
                🗣️ 口语热身 (Speaking Topics)
              </span>
              <span className="text-[9px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.2 rounded font-semibold">Part 1 & 2 脑暴与录音</span>
            </div>

            <div className="space-y-2 text-xs">
              {day.speaking.part1 && day.speaking.part1.length > 0 && (
                <div className="flex items-start justify-between py-1 px-1 rounded hover:bg-slate-50/50 transition">
                  <div className="text-slate-600 flex-1 mr-3 leading-relaxed">
                    🗣️ <strong>Part 1 答辨:</strong> 
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {day.speaking.part1.map((p, idx) => (
                        <span key={idx} className="bg-rose-50 text-rose-800 px-2 py-0.5 rounded font-mono font-medium text-[10px] border border-rose-100/30">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => onToggleStatus("speakingPart1")}
                    className={`h-5 w-5 rounded-md border flex items-center justify-center cursor-pointer transition shrink-0 mt-0.5 ${
                      status.speakingPart1 
                        ? "bg-emerald-500 border-emerald-500 text-white" 
                        : "border-slate-300 bg-white hover:border-teal-500"
                    }`}
                  >
                    {status.speakingPart1 && <Check className="h-3 w-3 stroke-[3]" />}
                  </button>
                </div>
              )}

              {day.speaking.part2 && (
                <div className="flex items-start justify-between py-1 px-1 rounded hover:bg-slate-50/50 transition border-t border-slate-100/40 pt-2 mt-2">
                  <div className="text-slate-600 flex-1 mr-3 leading-relaxed">
                    🌟 <strong>Part 2 复述:</strong> 
                    <span className="font-semibold text-slate-800 block sm:inline mt-1 sm:mt-0 font-sans text-rose-900 border-l-2 border-rose-400 pl-2 ml-1">
                      {day.speaking.part2}
                    </span>
                  </div>
                  <button
                    onClick={() => onToggleStatus("speakingPart2")}
                    className={`h-5 w-5 rounded-md border flex items-center justify-center cursor-pointer transition shrink-0 mt-0.5 ${
                      status.speakingPart2 
                        ? "bg-emerald-500 border-emerald-500 text-white" 
                        : "border-slate-300 bg-white hover:border-teal-500"
                    }`}
                  >
                    {status.speakingPart2 && <Check className="h-3 w-3 stroke-[3]" />}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* REVIEW SECTION */}
        {day.review && day.review.length > 0 && (
          <div className="border border-slate-100 rounded-xl p-4 space-y-3 shadow-2xs hover:border-slate-200 transition-all text-left">
            <div className="flex items-center justify-between border-b border-slate-50 pb-2">
              <span className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <RotateCcw className="h-4 w-4 text-purple-600" />
                🔁 复盘与纠错归纳 (Error Analysis)
              </span>
              <span className="text-[9px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.2 rounded font-semibold">难点清扫</span>
            </div>

            <div className="space-y-1.5">
              <div className="text-[11px] text-slate-500 mb-2 leading-relaxed font-sans">
                今日重点复盘科目：
                <div className="space-y-1 mt-1 pl-3 text-slate-700 list-disc font-medium">
                  {day.review.map((item, keyIdx) => (
                    <div key={keyIdx} className="flex items-center gap-1.5 text-xs text-purple-900 font-sans">
                      <AlertCircle className="h-3.5 w-3.5 text-purple-500 inline shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => onToggleStatus("review")}
                  className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition ${
                    status.review 
                      ? "bg-emerald-500 border border-emerald-500 text-white" 
                      : "bg-purple-50 border border-purple-200/50 text-purple-700 hover:bg-purple-100"
                  }`}
                >
                  <Check className="h-3.5 w-3.5 stroke-[2]" />
                  {status.review ? "复盘已总结" : "标记复盘总结完毕"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* NOTES WRITING AREA */}
      <div className="bg-slate-50/50 border border-slate-200/60 rounded-xl p-4 space-y-2.5 text-left">
        <h4 className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1">
          <FileText className="h-3.5 w-3.5 text-slate-500" />
          📓 当日个性纠错记本 / 单词积累
        </h4>
        <textarea
          placeholder="在此记录今日阅读错题原因、听力场景生词或口语备考金句大纲...（笔记会自动同步存储到本地）"
          value={status.notes || ""}
          onChange={(e) => onUpdateNotes(e.target.value)}
          className="w-full min-h-[100px] p-3 text-slate-800 text-xs border border-slate-200/80 rounded-lg focus:outline-none focus:border-teal-500 focus:bg-white transition bg-stone-50/50"
        />
      </div>

    </div>
  );
}
