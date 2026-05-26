import React, { useState } from "react";
import { Search, Sparkles, BookOpen, Check, Copy } from "lucide-react";
import { motion } from "motion/react";

interface SynonymPair {
  source: string;
  advanced: string[];
  example: string;
  category: "verb" | "adj" | "noun" | "adv";
}

const SHIFTED_VOCAB: SynonymPair[] = [
  {
    source: "change",
    advanced: ["alter", "modify", "transform", "fluctuate"],
    example: "The climate patterns began to alter dramatically due to human activity.",
    category: "verb"
  },
  {
    source: "important",
    advanced: ["paramount", "crucial", "indispensable", "pivotal"],
    example: "Achieving carbon neutrality is paramount to preventing environmental collapse.",
    category: "adj"
  },
  {
    source: "improve",
    advanced: ["enhance", "ameliorate", "augment", "bolster"],
    example: "Educational reforms are designed to bolster students' analytical capabilities.",
    category: "verb"
  },
  {
    source: "bad",
    advanced: ["detrimental", "adverse", "deleterious", "destructive"],
    example: "Inadequate sleep has highly detrimental effects on cognitive function.",
    category: "adj"
  },
  {
    source: "good",
    advanced: ["beneficial", "advantageous", "favorable", "salutary"],
    example: "Physical activity is highly beneficial for both somatic and psychological health.",
    category: "adj"
  },
  {
    source: "many",
    advanced: ["myriad", "innumerable", "abundant", "copious"],
    example: "Digitalization has generated myriad opportunities for remote businesses.",
    category: "noun"
  },
  {
    source: "solve",
    advanced: ["tackle", "address", "resolve", "mitigate"],
    example: "Governments must tackle this housing crisis with regulatory frameworks.",
    category: "verb"
  },
  {
    source: "difference",
    advanced: ["discrepancy", "divergence", "distinction", "disparity"],
    example: "There is a massive economic disparity between urban and rural demographics.",
    category: "noun"
  },
  {
    source: "use",
    advanced: ["utilize", "exploit", "harness", "employ"],
    example: "Developing nations must harness sustainable wind energy structures.",
    category: "verb"
  },
  {
    source: "think",
    advanced: ["deem", "reckon", "contemplate", "maintain (立场)"],
    example: "Experts maintain that current emission caps are insufficient.",
    category: "verb"
  },
  {
    source: "danger",
    advanced: ["jeopardy", "peril", "hazard", "vulnerability"],
    example: "Endangered marine species are in severe jeopardy due to overfishing.",
    category: "noun"
  },
  {
    source: "explain",
    advanced: ["elucidate", "illustrate", "clarify", "demystify"],
    example: "We must elucidate the exact mechanism behind global warmings.",
    category: "verb"
  },
  {
    source: "artificial",
    advanced: ["synthetic", "man-made", "simulated", "contrived"],
    example: "Engineers are manufacturing synthetic enzymes to digest plastic debris.",
    category: "adj"
  },
  {
    source: "common",
    advanced: ["ubiquitous", "prevalent", "widespread", "pervasive"],
    example: "Mobile application checking is now fully ubiquitous in modern offices.",
    category: "adj"
  },
  {
    source: "people",
    advanced: ["individuals", "demographics", "citizens", "the populace"],
    example: "The populace was deeply affected by the soaring fuel tax index.",
    category: "noun"
  }
];

// Pre-packaged high frequency Cambridge IELTS Paraphrases (Reading Matchers)
interface ParaphrasePair {
  textQuestion: string;
  textPassage: string;
  sourceExam: string;
}

const CAMBRIDGE_PARAPHRASES: ParaphrasePair[] = [
  {
    textQuestion: "artificial intelligence has exceeded humans",
    textPassage: "computers are now outperforming human intellect",
    sourceExam: "C20-Test3 Robots and us"
  },
  {
    textQuestion: "the ignored value of standard techniques",
    textPassage: "traditional methods were long neglected but highly beneficial",
    sourceExam: "C11-Test2-Passage3"
  },
  {
    textQuestion: "factors affecting domestic flight cancellations",
    textPassage: "reasons underlying local airport flight suspensions",
    sourceExam: "C15-Test4-Passage3"
  },
  {
    textQuestion: "unexpected weather shifts inside continents",
    textPassage: "unforeseen temperature swings in landlocked areas",
    sourceExam: "C17-Test3-Passage1"
  },
  {
    textQuestion: "the correlation between noise and low output",
    textPassage: "acoustic disruptions resulting in diminished yields",
    sourceExam: "C18-Test2-Passage2"
  },
  {
    textQuestion: "financial aid for international scholars",
    textPassage: "monetary grants provided to students coming from abroad",
    sourceExam: "C15-Test3-Passage3"
  },
  {
    textQuestion: "restricting access to specific heritage parks",
    textPassage: "curbing visitors to designated historic preservation spots",
    sourceExam: "C19-Test1-Passage2"
  }
];

export default function LexicalTuner() {
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const filteredVocab = SHIFTED_VOCAB.filter(item => {
    const matchesSearch = 
      item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.advanced.some(word => word.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.example.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategory === "all") return matchesSearch;
    return matchesSearch && item.category === selectedCategory;
  });

  return (
    <div id="lexical-tuner-root" className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-display font-semibold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-teal-600" />
            IELTS 词汇升级与同义替换
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            雅思高分命脉在于表达多样性（Concept Paraphrase）。
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1.5 bg-slate-50 p-1 rounded-lg">
          {["all", "verb", "adj", "noun", "adv"].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-all ${
                selectedCategory === cat
                  ? "bg-white text-teal-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {cat === "all" ? "全部" : cat === "verb" ? "动词" : cat === "adj" ? "形容词" : cat === "noun" ? "名词" : "副词"}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout of Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Core Lexical Booster */}
        <div className="lg:col-span-8 flex flex-col">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索基础词或同义替换 (例如: change, important...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:bg-white transition-all text-slate-800"
            />
          </div>

          <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
            {filteredVocab.length > 0 ? (
              filteredVocab.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 border border-slate-100 hover:border-teal-100 rounded-xl transition-all hover:bg-slate-50/50 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono bg-slate-200/70 text-slate-600 px-2 py-0.5 rounded uppercase">
                        {item.category === "adj" ? "形容" : item.category === "noun" ? "名词" : "动词"}
                      </span>
                      <span className="text-sm font-semibold text-slate-700 group-hover:text-teal-700 transition">
                        基础表达: <span className="underline decoration-slate-300 font-mono text-slate-500">{item.source}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {item.advanced.map((advWord, aIdx) => (
                      <button
                        key={aIdx}
                        onClick={() => handleCopy(advWord)}
                        className="flex items-center gap-1 bg-white border border-slate-200/80 hover:bg-teal-50 hover:border-teal-300 px-2.5 py-1 rounded-lg text-xs font-mono font-medium text-slate-800 hover:text-teal-800 cursor-pointer shadow-2xs transition-all"
                      >
                        {advWord}
                        {copiedText === advWord ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-2.5 w-2.5 text-slate-400 group-hover:block hidden" />
                        )}
                      </button>
                    ))}
                  </div>

                  <p className="text-xs text-slate-500 italic mt-2 bg-white/70 px-2.5 py-1.5 rounded border border-slate-100/50">
                    <strong className="text-[10px] font-sans font-medium uppercase text-teal-600 mr-1 not-italic">Band 8 例句:</strong>
                    {item.example}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-400 border border-dashed border-slate-200 rounded-xl">
                没有找到相关推荐词语，试着换个词搜搜吧！
              </div>
            )}
          </div>
        </div>

        {/* Cambridge Reading Synonyms Sidebar */}
        <div className="lg:col-span-4 bg-teal-50/50 border border-teal-100/70 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3.5">
            <BookOpen className="h-4.5 w-4.5 text-teal-700" />
            <h3 className="text-sm font-display font-semibold text-teal-900">
              剑桥雅思真题阅读对齐题
            </h3>
          </div>
          <p className="text-xs text-teal-700/80 mb-4 font-sans leading-relaxed">
            极速感知真题中的同义改写套路。考题中的核心短语（Question）在真题文章（Passage）中是如何改写的：
          </p>

          <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
            {CAMBRIDGE_PARAPHERNALIA_VIEWS().map((item, idx) => (
              <div 
                key={idx} 
                className="p-3 bg-white border border-teal-100 rounded-xl shadow-2xs space-y-1.5 text-xs text-slate-700"
              >
                <div className="flex justify-between text-[10px] font-mono font-semibold text-teal-700 mb-1">
                  <span>{item.sourceExam}</span>
                  <span className="bg-teal-100 text-teal-800 px-1.5 py-0.2 rounded-sm text-[9px]">段落同义改写</span>
                </div>
                <div>
                  <span className="font-semibold text-amber-700 mr-1">📜 题目:</span>
                  <span className="italic font-mono">{item.textQuestion}</span>
                </div>
                <div className="border-t border-slate-100 my-1 pt-1.5">
                  <span className="font-semibold text-emerald-700 mr-1">🔍 原文:</span>
                  <span className="italic font-semibold text-slate-800 font-mono">{item.textPassage}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

function CAMBRIDGE_PARAPHERNALIA_VIEWS() {
  return CAMBRIDGE_PARAPHRASES;
}
