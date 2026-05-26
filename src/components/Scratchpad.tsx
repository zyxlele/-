import React, { useState, useEffect, useRef } from "react";
import { Edit3, Clock, RotateCcw, Play, Pause, FileText, CheckCircle, Info } from "lucide-react";

interface WritingTemplate {
  name: string;
  outline: string;
  usefulPhrases: string[];
}

const TEMPLATES: Record<"task1" | "task2", WritingTemplate[]> = {
  task1: [
    {
      name: "📊 线图/柱状图趋势描述",
      outline: "第1段 (Introduction): 改写题目 (Introduce the graph/chart details)\n第2段 (Overview): 总结主要特征、最高/最低点以及总体走向 (Highlight main trends/peaks)\n第3段 (Details 1): 描述第一个数据组的具体走势、交汇点和数值 (Analyze first half of data in depth)\n第4段 (Details 2): 描述对比数据组的走势、倍数关系及尾期状态 (Contrast and describe final states)",
      usefulPhrases: [
        "The line graph delineates the fluctuation... (图表描绘了波动的...)",
        "It is manifest that... (很明显的是...)",
        "A striking variation occurred... (出现了显著的变动...)",
        "experienced a conspicuous/marginal drop... (经历了明显/轻微的下滑)",
        "reached a pinnacle of X... (达到了X的高峰)",
        "stabilized at approximately Y... (稳定在接近Y的水平)",
        "represented a twofold increase... (是对上一期的两倍增长)"
      ]
    },
    {
      name: "🗺️ 地图变迁对比描述",
      outline: "第1段 (Introduction): 改写题目描述何地发生了何种变迁 (Restate site modification details)\n第2段 (Overview): 总结地图最大的两个转变（例如：住宅化、设施完善化、绿地缩水）(Highlight largest structural transformations)\n第3段 (Details 1): 描述地图北部/东部的演变，哪些设施被取代、移位或新开辟\n第4段 (Details 2): 描述南部/西部的演变以及道路交通格局、桥梁的演进",
      usefulPhrases: [
        "The layouts illustrate the spatial modifications in... (平面图展示了空间形变...)",
        "It is apparent that the region underwent massive conversion... (很明显该区域进行了大幅改造...)",
        "was demolished to make room for... (被拆除以为...让出空间)",
        "was redeveloped into... (被重新开发为...)",
        "was relocated adjacent to... (被移位到了...的隔壁)",
        "witnessed the expansion of... (目睹了...的扩建)"
      ]
    }
  ],
  task2: [
    {
      name: "🏛️ 辩论双边观点类 (Discuss Both Views)",
      outline: "第1段 (Introduction): 引入话题背景 + 改写两边观点 + 给出个人鲜明态度/折中倾向\n第2段 (Body 1): 论述第一方观点的合理性、支撑依据以及代表性论点\n第3段 (Body 2): 论述第二方观点的合理性与核心论据，并表明自己为什么更支持这一方\n第4段 (Conclusion): 总结两边，深化自己的折中或偏向立场 (Confirm and reinforce stance)",
      usefulPhrases: [
        "There has been an ongoing societal debate regarding... (围绕...有着长久社会辩论)",
        "Admittedly, the initial perspective is grounded in the belief that... (诚然，第一种观点基于...)",
        "Consequently, this leads to... (结果，这导致了...)",
        "However, I maintain that option B yields more profound benefits because... (然而我坚信B由于...产生更加深远的好处...)",
        "An compelling illustration of this is... (关于此点的一个说服性实例是...)",
        "To culminate, while there are valid reasoning on both sides, I hold that... (总之，虽然两方都有道理，我持...立场)"
      ]
    },
    {
      name: "⚖️ 利弊权衡类 (Do advantages outweigh disadvantages?)",
      outline: "第1段 (Introduction): 阐述当前核心热门事实 + 表明个人鲜明态度（利大于弊或弊大于利）\n第2段 (Body 1): 论述较弱的一方（如果是利大于弊，在这里先写弊端/反面论据以显客观）\n第3段 (Body 2): 详细论述支持的强势一方（提供两个强大的论点和充实的数据/案例支撑）\n第4段 (Conclusion): 重申立场 + 概括利大于弊或弊大于利的决定性因素",
      usefulPhrases: [
        "This notable phenomenon presents a complex host of outcomes... (此瞩目现象带有一系列复合结果)",
        "The primary drawback lies in the risk of... (首要弊端在于...的风险)",
        "Nonetheless, the advantages are distinct and multifold... (尽管如此，其优势是清晰而多样的)",
        "A central merit is that... (核心长处是...)",
        "My opinion is firmly rooted in the premise that... (我的看法稳固扎根于...的前提)",
        "In deduction, although this trend might engender certain pitfalls, the benefits are far more significant... (归结起来，即使该趋势带来一定陷阱，好处大得多)"
      ]
    }
  ]
};

export default function Scratchpad() {
  const [taskType, setTaskType] = useState<"task1" | "task2">("task2");
  const [essayText, setEssayText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  
  // Timer States
  const [timerMinutes, setTimerMinutes] = useState(40);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Template States
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);

  // Load from local storage on mount
  useEffect(() => {
    const key = `ielts_draft_${taskType}`;
    const saved = localStorage.getItem(key);
    if (saved) {
      setEssayText(saved);
      calculateWordCount(saved);
    } else {
      setEssayText("");
      setWordCount(0);
    }
    
    // Set timer based on task type
    resetTimer(taskType === "task1" ? 20 : 40);
  }, [taskType]);

  // Handle Text change
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setEssayText(text);
    calculateWordCount(text);
    localStorage.setItem(`ielts_draft_${taskType}`, text);
  };

  const calculateWordCount = (text: string) => {
    const cleanText = text.trim();
    if (cleanText === "") {
      setWordCount(0);
      return;
    }
    const words = cleanText.split(/\s+/);
    setWordCount(words.length);
  };

  // Timer Handlers
  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = (customMins?: number) => {
    setIsTimerRunning(false);
    const mins = customMins !== undefined ? customMins : (taskType === "task1" ? 20 : 40);
    setTimerMinutes(mins);
    setTimerSeconds(0);
  };

  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        if (timerSeconds > 0) {
          setTimerSeconds(prev => prev - 1);
        } else if (timerSeconds === 0 && timerMinutes > 0) {
          setTimerMinutes(prev => prev - 1);
          setTimerSeconds(59);
        } else {
          // Timer finished!
          setIsTimerRunning(false);
          if (timerRef.current) clearInterval(timerRef.current);
          playTriggerBeep();
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timerMinutes, timerSeconds]);

  // Clean Audio Sound utilizing Web Audio API
  const playTriggerBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(660, audioCtx.currentTime); // Mi note
      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);

      oscillator.start();
      // stop after 0.5s
      oscillator.stop(audioCtx.currentTime + 0.4);
    } catch (e) {
      console.warn("Sound play omitted:", e);
    }
  };

  const currentTemplates = TEMPLATES[taskType];
  const template = currentTemplates[selectedTemplateIndex] || currentTemplates[0];

  const targetWordCount = taskType === "task1" ? 150 : 250;
  const progressPercent = Math.min((wordCount / targetWordCount) * 100, 100);

  // Format Timer Text
  const formattedSeconds = timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds;
  const formattedMinutes = timerMinutes < 10 ? `0${timerMinutes}` : timerMinutes;

  return (
    <div id="scratchpad-root" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col h-full">
      
      {/* Title & Task toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-display font-semibold text-slate-950 flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-teal-600" />
            雅思写作沙盒 & 高能词句指南
          </h2>
          <p className="text-sm text-slate-500 mt-0.5">
            在线限时写作环境，提供段落模版与词数校验。
          </p>
        </div>

        {/* Task Buttons & Presets */}
        <div className="flex gap-1.5 bg-slate-50 p-1 rounded-lg self-start">
          <button
            onClick={() => {
              setTaskType("task1");
              setSelectedTemplateIndex(0);
            }}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${
              taskType === "task1"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            学术 Task 1 (小作文)
          </button>
          <button
            onClick={() => {
              setTaskType("task2");
              setSelectedTemplateIndex(0);
            }}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold transition ${
              taskType === "task2"
                ? "bg-teal-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            议论 Task 2 (大作文)
          </button>
        </div>
      </div>

      {/* Grid: Editor + Guides */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-1">
        
        {/* Essay Text Area & Status Panel */}
        <div className="lg:col-span-8 flex flex-col justify-between">
          
          {/* Top Panel: Timer & Counter */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
            {/* Countdown timer */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg text-slate-700 font-mono text-sm font-semibold">
                <Clock className="h-4 w-4 text-slate-500 animate-pulse" />
                <span>{formattedMinutes}:{formattedSeconds}</span>
              </div>
              <button
                onClick={toggleTimer}
                className={`py-1.5 px-3 rounded-lg text-xs font-medium text-white flex items-center gap-1 cursor-pointer transition ${
                  isTimerRunning ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"
                }`}
              >
                {isTimerRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                {isTimerRunning ? "暂停" : "开始"}
              </button>
              <button
                onClick={() => resetTimer()}
                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg cursor-pointer transition"
                title="重置"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Word details */}
            <div className="text-right">
              <div className="text-xs text-slate-500">
                字数要求: <span className="font-semibold text-slate-700">{targetWordCount} 字</span>
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`text-sm font-bold font-mono ${
                  wordCount >= targetWordCount ? "text-emerald-600" : "text-amber-600"
                }`}>
                  {wordCount} Words
                </span>
                {wordCount >= targetWordCount && (
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-4">
            <div
              className={`h-full transition-all duration-300 ${
                wordCount >= targetWordCount ? "bg-emerald-500" : "bg-amber-500"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Text Area */}
          <div className="flex-1 min-h-[300px] flex flex-col relative">
            <textarea
              placeholder={`在此粘贴或输入你的雅思考试习作... (例如：Your introduction starts with a paraphrase of the task topic...)`}
              value={essayText}
              onChange={handleTextChange}
              className="w-full h-full p-4 border border-slate-200 focus:border-teal-500 focus:outline-none rounded-xl text-slate-800 text-sm font-mono leading-relaxed bg-slate-50/50 focus:bg-white resize-y flex-1"
            />
            {wordCount === 0 && (
              <div className="absolute left-4 top-4 text-slate-400 text-xs pointer-events-none flex items-center gap-1">
                <Info className="h-3.5 w-3.5" />
                <span>草稿会自动保存在本地浏览器内，无感保持。</span>
              </div>
            )}
          </div>
        </div>

        {/* Templates and structures sidebar */}
        <div className="lg:col-span-4 bg-slate-50/70 border border-slate-200/50 rounded-2xl p-4 flex flex-col">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
            写作黄金模板 & 表达库
          </h3>

          <div className="space-y-3 flex-1 overflow-y-auto max-h-[460px] pr-1">
            {/* Selector */}
            <div className="flex flex-col gap-1.5">
              {currentTemplates.map((tpl, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedTemplateIndex(idx)}
                  className={`text-left p-2.5 rounded-lg border text-xs font-semibold cursor-pointer transition ${
                    selectedTemplateIndex === idx
                      ? "bg-teal-50 border-teal-300 text-teal-800"
                      : "bg-white border-slate-100 text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {tpl.name}
                </button>
              ))}
            </div>

            {/* Template outline */}
            <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <FileText className="h-3.5 w-3.5 text-teal-600" />
                分段结构大纲
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap font-sans bg-slate-50 p-2.5 rounded border border-slate-100">
                {template.outline}
              </p>
            </div>

            {/* Practical transitions vocab */}
            <div className="bg-white border border-slate-100 rounded-xl p-3 shadow-2xs">
              <h4 className="text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5 text-teal-600" />
                学霸高频句型库
              </h4>
              <div className="space-y-1.5 max-h-[160px] overflow-y-auto">
                {template.usefulPhrases.map((phrase, pIdx) => {
                  const parts = phrase.split("...");
                  return (
                    <div
                      key={pIdx}
                      onClick={() => {
                        const wordToCopy = parts[0]?.trim() || phrase;
                        navigator.clipboard.writeText(wordToCopy);
                      }}
                      className="text-[11px] font-mono p-1.5 hover:bg-teal-50 border border-slate-100 rounded cursor-pointer transition text-slate-700 flex justify-between items-center group"
                      title="点击拷贝前半句"
                    >
                      <span className="truncate flex-1 group-hover:text-teal-900 leading-tight">
                        {phrase}
                      </span>
                      <span className="text-[9px] text-slate-400 group-hover:block hidden font-sans ml-1 text-teal-600">
                        点击复制
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
