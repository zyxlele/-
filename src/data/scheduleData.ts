export interface ReadingTask {
  timed?: string;
  intensive?: string;
  focus?: string;
}

export interface SpeakingTask {
  part1?: string[];
  part2?: string;
}

export interface DayPlan {
  id: string; // "YYYY-MM-DD" style
  date: string; // e.g. "5月26日"
  weekday: string; // e.g. "周二"
  isMockDay?: boolean;
  isHalfMock?: boolean;
  reading?: ReadingTask;
  listening: string[];
  writing: string;
  speaking?: SpeakingTask;
  review?: string[];
}

export const IELTS_SCHEDULE: DayPlan[] = [
  {
    id: "2026-05-26",
    date: "5月26日",
    weekday: "周二",
    reading: {
      timed: "C12-Test5-Passage1",
      intensive: "C20-Test3-Passage3 Robots and us",
      focus: "concept paraphrase (概念替换), opinion matching (观点匹配)"
    },
    listening: ["C15-Test2-Section4", "C16-Test2-Section1"],
    writing: "Task2: C7-Test1-Task2",
    speaking: {
      part1: ["Spare time", "Work or studies"],
      part2: "为家人骄傲的人"
    }
  },
  {
    id: "2026-05-27",
    date: "5月27日",
    weekday: "周三",
    reading: {
      timed: "C13-Test4-Passage1",
      intensive: "C11-Test2-Passage3",
      focus: "heading (段落小标题), abstract concepts (抽象概念识别)"
    },
    listening: ["C13-Test1-Section1", "C14-Test1-Section4"],
    writing: "Task1: C15-Test1-Task1",
    speaking: {
      part1: ["Music", "The city you live in"],
      part2: "喜欢种植物的人"
    }
  },
  {
    id: "2026-05-28",
    date: "5月28日",
    weekday: "周四",
    reading: {
      timed: "C16-Test2-Passage1",
      intensive: "C17-Test1-Passage2",
      focus: "matching information (信息匹配题)"
    },
    listening: ["C16-Test3-Part1", "C9-Test1-Section4"],
    writing: "Task2: C12-Test7-Task2",
    speaking: {
      part1: ["Gifts", "Reading"],
      part2: "环保法律"
    }
  },
  {
    id: "2026-05-29",
    date: "5月29日",
    weekday: "周五",
    reading: {
      timed: "C18-Test1-Passage1",
      intensive: "C16-Test2-Passage2",
      focus: "sentence matching (句子匹配/半句合并)"
    },
    listening: ["C15-Test4-Section4", "C19-Test2-Part2"],
    writing: "Task1: C17-Test3-Task1",
    speaking: {
      part1: ["Art", "Headphones"],
      part2: "对家庭重要的东西"
    }
  },
  {
    id: "2026-05-30",
    date: "5月30日",
    weekday: "周六",
    reading: {
      timed: "C14-Test1-Passage2",
      intensive: "C18-Test1-Passage2",
      focus: "段落逻辑与脉络衔接"
    },
    listening: ["C11-Test2-Section4", "C17-Test1-Part2"],
    writing: "Task2: C17-Test2-Task2",
    speaking: {
      part1: ["Memory", "Science"],
      part2: "很久没回复的信息"
    }
  },
  {
    id: "2026-05-31",
    date: "5月31日",
    weekday: "周日",
    isHalfMock: true,
    reading: {
      timed: "C18-Test2-Passage1 & Passage2 (限时40分钟完成)",
      focus: "半模考限时训练 (Passage 1 & 2)"
    },
    listening: ["C18-Test1-Section1+2"],
    writing: "Task1: C18-Test2-Task1",
    speaking: {
      part1: ["Food", "Dream and ambition"]
    }
  },
  {
    id: "2026-06-01",
    date: "6月1日",
    weekday: "周一",
    reading: {
      timed: "C13-Test4-Passage1",
      intensive: "C20-Test1-Passage3",
      focus: "Passage 3 推理题与主旨把握"
    },
    listening: ["C19-Test1-Part3", "C10-Test4-Section1"],
    writing: "Task1: C7-Test1-Task1",
    speaking: {
      part1: ["Morning time", "Social media"],
      part2: "想颁布的新法律"
    }
  },
  {
    id: "2026-06-02",
    date: "6月2日",
    weekday: "周二",
    reading: {
      timed: "C15-Test3-Passage1",
      intensive: "C16-Test4-Passage3",
      focus: "attitude questions (作者态度与倾向性题)"
    },
    listening: ["C13-Test1-Section2", "C20-Test4-Part4"],
    writing: "Task2: C10-Test3-Task2",
    speaking: {
      part1: ["Mirrors", "History"],
      part2: "河流/湖泊"
    }
  },
  {
    id: "2026-06-03",
    date: "6月3日",
    weekday: "周三",
    reading: {
      timed: "C17-Test4-Passage1",
      intensive: "C9-Test3-Passage2",
      focus: "matching features (特征匹配题/学术分类)"
    },
    listening: ["C16-Test1-Part2", "C14-Test4-Section2"],
    writing: "Task1: C5-Test1-Task1",
    speaking: {
      part1: ["Hobby", "Sports programs"],
      part2: "喜欢的城市"
    }
  },
  {
    id: "2026-06-04",
    date: "6月4日",
    weekday: "周四",
    reading: {
      timed: "C20-Test1-Passage1",
      intensive: "C15-Test3-Passage3",
      focus: "difficult paraphrase (高难度跨段落同义替换)"
    },
    listening: ["C14-Test2-Section1", "C15-Test3-Section1"],
    writing: "Task2: C8-Test3-Task2",
    speaking: {
      part1: ["Hometown", "Life stages"],
      part2: "动物故事"
    }
  },
  {
    id: "2026-06-05",
    date: "6月5日",
    weekday: "周五",
    reading: {
      timed: "C13-Test3-Passage1",
      intensive: "C19-Test2-Passage2",
      focus: "Passage 3 同义替换与长难句突破"
    },
    listening: ["C17-Test3-Part2", "C19-Test2-Part3"],
    writing: "Task1: C18-Test2-Task1",
    speaking: {
      part1: ["Cars", "Childhood activities"],
      part2: "安静的地方"
    }
  },
  {
    id: "2026-06-06",
    date: "6月6日",
    weekday: "周六",
    reading: {
      timed: "C18-Test4-Passage1",
      intensive: "C17-Test4-Passage3",
      focus: "abstract idea (理论与复杂学术抽象概念)"
    },
    listening: ["C20-Test3-Part2", "C19-Test1-Part2"],
    writing: "Task2: C20-Test4-Task2",
    speaking: {
      part1: ["Walking", "Building"],
      part2: "喜欢的电视节目"
    }
  },
  {
    id: "2026-06-07",
    date: "6月7日",
    weekday: "周日",
    isMockDay: true,
    reading: {
      timed: "C19-Test1 整套阅读 (限时60分钟)",
      focus: "全真模考环境限时挑战"
    },
    listening: ["C19-Test1 整套听力"],
    writing: "全套写作模考 & 深度复盘与重写"
  },
  {
    id: "2026-06-08",
    date: "6月8日",
    weekday: "周一",
    reading: {
      timed: "C16-Test1-Passage2",
      intensive: "C17-Test4-Passage3",
      focus: "writer's attitude (作者态度), concept paraphrase (同义概念提取)"
    },
    listening: ["C8-Test3-Section4", "C10-Test2-Section1"],
    writing: "Task1: C8-Test4-Task1",
    speaking: {
      part1: ["Watch", "Films/cinemas"],
      part2: "在团队中工作"
    },
    review: ["Passage3 错题深度分析表"]
  },
  {
    id: "2026-06-09",
    date: "6月9日",
    weekday: "周二",
    reading: {
      timed: "C16-Test4-Passage1",
      intensive: "C12-Test8-Passage3",
      focus: "paragraph matching (段落信息匹配), abstract replacement (抽象表达替换)"
    },
    listening: ["C7-Test1-Section4", "C14-Test4-Section1"],
    writing: "Task2: 0455 新闻媒体的重要性及主要影响",
    speaking: {
      part1: ["Evening time", "Shopping"],
      part2: "环保法律"
    },
    review: ["听力 Section 4 精细单句听写与总结"]
  },
  {
    id: "2026-06-10",
    date: "6月10日",
    weekday: "周三",
    reading: {
      timed: "C15-Test3-Passage2",
      intensive: "C7-Test1-Passage3",
      focus: "difficult sentence parsing (超长长难句拆解), author opinion"
    },
    listening: ["C19-Test4-Part1", "C18-Test2-Part1"],
    writing: "Task1: C20-Test4-Task1",
    speaking: {
      part1: ["Singing", "Parks"],
      part2: "乐于助人的人"
    },
    review: ["阅读核心同义替换表及词汇归档"]
  },
  {
    id: "2026-06-11",
    date: "6月11日",
    weekday: "周四",
    reading: {
      timed: "C6-Test1-Passage1",
      intensive: "C18-Test3-Passage2",
      focus: "matching information (细节信息匹配), logic chain analysis"
    },
    listening: ["C14-Test3-Section4", "C13-Test3-Section1"],
    writing: "Task2: 0389 道路安全处罚多样化探讨",
    speaking: {
      part1: ["Pets", "Jokes & comedies"],
      part2: "发挥想象力的人"
    },
    review: ["Passage 3 长难句成分拆解与主谓宾画线"]
  },
  {
    id: "2026-06-12",
    date: "6月12日",
    weekday: "周五",
    reading: {
      timed: "C15-Test4-Passage3",
      intensive: "C17-Test2-Passage2",
      focus: "attitude cues (情感倾向暗示词), hidden meaning (弦外之音推断)"
    },
    listening: ["C15-Test3-Section2", "C12-Test8-Section1"],
    writing: "Task1: 40494 航班取消投诉信 (G类高分技巧)" ,
    speaking: {
      part1: ["Sports team", "Tidiness"],
      part2: "给别人给建议"
    },
    review: ["听力高频核心场景词与拼写复核"]
  },
  {
    id: "2026-06-13",
    date: "6月13日",
    weekday: "周六",
    reading: {
      timed: "C7-Test3-Passage2",
      intensive: "C9-Test1-Passage3",
      focus: "inference (严密逻辑推断), concept paraphrase"
    },
    listening: ["C15-Test1-Section2", "C10-Test3-Section3"],
    writing: "Task2: 0101 广告对消费者个性的潜移默化影响",
    speaking: {
      part1: ["Teachers"],
      part2: "特别场合的食物"
    },
    review: ["分类阅读错题分析表自我诊断"]
  },
  {
    id: "2026-06-14",
    date: "6月14日",
    weekday: "周日",
    isMockDay: true,
    reading: {
      timed: "C18-Test3 整套阅读 (限时60分钟)",
      focus: "第二轮系统模考阅读测试"
    },
    listening: ["C18-Test3 整套听力"],
    writing: "模考全阶段复盘与范文对比"
  },
  {
    id: "2026-06-15",
    date: "6月15日",
    weekday: "周一",
    reading: {
      timed: "C17-Test1-Passage3",
      intensive: "C15-Test3-Passage3",
      focus: "writer stance (作者政治/学术立场辨析), difficult paraphrase"
    },
    listening: ["C8-Test2-Section4", "C13-Test3-Section2"],
    writing: "Task1: 40185 国际学生人数趋势图表分析",
    speaking: {
      part1: ["Travel"],
      part2: "最近改变的计划"
    },
    review: ["雅思高频同义替换表达整理与背诵"]
  },
  {
    id: "2026-06-16",
    date: "6月16日",
    weekday: "周二",
    reading: {
      timed: "C12-Test8-Passage2",
      intensive: "C20-Test2-Passage2",
      focus: "scientific logic links (科学类文章实验链), paragraph relationship"
    },
    listening: ["C11-Test3-Section2", "C6-Test4-Section4"],
    writing: "Task2: 0129 中学教育内容侧重点（学术 vs 实用）",
    speaking: {
      part1: ["Decisions"],
      part2: "重要决定"
    },
    review: ["Passage 3 终极概念同义替换归档"]
  },
  {
    id: "2026-06-17",
    date: "6月17日",
    weekday: "周三",
    reading: {
      timed: "C15-Test2-Passage3",
      intensive: "C19-Test2-Passage1",
      focus: "logical mapping (逻辑导图与论点分布关系)"
    },
    listening: ["C13-Test4-Section3", "C20-Test3-Part4"],
    writing: "Task1: 40197 历史气温变化线图描述",
    speaking: {
      part1: ["Communication"],
      part2: "医疗行业的人"
    },
    review: ["听力高难度 Section 4 结构听力精复盘"]
  },
  {
    id: "2026-06-18",
    date: "6月18日",
    weekday: "周四",
    reading: {
      timed: "C11-Test4-Passage1",
      intensive: "C9-Test3-Passage3",
      focus: "abstract idea identification (极度抽象、宏观学术论调理解)"
    },
    listening: ["C8-Test1-Section4", "C15-Test4-Section3"],
    writing: "Task2: 0313 网上购物趋势利弊分析",
    speaking: {
      part1: ["Online shopping"],
      part2: "令人快乐的户外活动"
    },
    review: ["阅读定位失败与回读问题溯源诊断"]
  },
  {
    id: "2026-06-19",
    date: "6月19日",
    weekday: "周五",
    reading: {
      timed: "C19-Test1-Passage1",
      intensive: "C12-Test6-Passage3",
      focus: "inference (复合论证推演), opinion matching (观点匹配进阶)"
    },
    listening: ["C7-Test2-Section2", "C19-Test2-Part4"],
    writing: "Task1: C11-Test1-Task1",
    speaking: {
      part1: ["Work"],
      part2: "有趣的视频"
    },
    review: ["Task 1 卓越 Overview (总述段) 写作专项训练"]
  },
  {
    id: "2026-06-20",
    date: "6月20日",
    weekday: "周六",
    reading: {
      timed: "C7-Test1-Passage2",
      intensive: "C19-Test1-Passage3",
      focus: "hidden attitude check (学术隐晦态度及修辞反讽意图判断)"
    },
    listening: ["C8-Test4-Section4", "C14-Test2-Section2"],
    writing: "Task2: C15-Test3-Task2",
    speaking: {
      part1: ["Campus"],
      part2: "体育赛事"
    },
    review: ["高阶学科话题 concept paraphrase 高频储备"]
  },
  {
    id: "2026-06-21",
    date: "6月21日",
    weekday: "周日",
    isMockDay: true,
    reading: {
      timed: "C20-Test1 全套阅读(三篇限时60分钟)",
      focus: "第三轮冲刺大模考"
    },
    listening: ["C20-Test1 全套听力"],
    writing: "模考精细复盘并修正时间分配",
    speaking: {
      part1: ["Technology"],
      part2: "环境问题讨论"
    }
  },
  {
    id: "2026-06-22",
    date: "6月22日",
    weekday: "周一",
    reading: {
      timed: "C13-Test4-Passage1",
      intensive: "C20-Test3-Passage2",
      focus: "summary completion (阅读摘要挖空、词性预判)"
    },
    listening: ["C16-Test3-Part2", "C19-Test4-Part3"],
    writing: "Task1: 40181 报考大学因素多柱状图解析",
    speaking: {
      part1: ["University"],
      part2: "航空旅行"
    },
    review: ["阅读错题诊断卡、原因标记及核心对齐"]
  },
  {
    id: "2026-06-23",
    date: "6月23日",
    weekday: "周二",
    reading: {
      timed: "C10-Test2-Passage2",
      intensive: "C14-Test2-Passage3",
      focus: "difficult paraphrase (高级虚词与连接副词同义代换)"
    },
    listening: ["C18-Test2-Part4", "C20-Test4-Part2"],
    writing: "Task2: 0083 自然环境旅游的长期社会与生态影响",
    speaking: {
      part1: ["Environment"],
      part2: "向往的旅游地点"
    },
    review: ["Passage 3 重难点词汇考点句超精读"]
  },
  {
    id: "2026-06-24",
    date: "6月24日",
    weekday: "周三",
    reading: {
      timed: "C14-Test4-Passage2",
      intensive: "C15-Test1-Passage3",
      focus: "concept understanding (多维跨学科背景学术术语剥离)"
    },
    listening: ["C19-Test1-Part4", "C8-Test3-Section1"],
    writing: "Task1: 40497 家电拥有率与日常耗时变化描述",
    speaking: {
      part1: ["Sports"],
      part2: "学校里的艺术课程"
    },
    review: ["全真模拟场景高频同义替换终极回顾"]
  },
  {
    id: "2026-06-25",
    date: "6月25日",
    weekday: "周四",
    reading: {
      timed: "C17-Test2-Passage1",
      intensive: "C20-Test1-Passage2",
      focus: "logical relation (连贯性与主辅观点关联机制)"
    },
    listening: ["C12-Test7-Section1", "C11-Test3-Section4"],
    writing: "Task2: C9-Test3-Task2",
    speaking: {
      part1: ["School"],
      part2: "科技发展和未来生活"
    },
    review: ["Task 2 核心高分框架及模版高阶重写定型"]
  },
  {
    id: "2026-06-26",
    date: "6月26日",
    weekday: "周五",
    reading: {
      timed: "C16-Test3-Passage3",
      intensive: "C15-Test4-Passage2",
      focus: "Passage 3 综合逻辑深度排查回顾"
    },
    listening: ["C12-Test5-Section1", "C14-Test4-Section4"],
    writing: "Task1: 40188 被赡养人数统计比例图分析",
    speaking: {
      part1: ["Future plans"],
      part2: "你心中成功的人"
    },
    review: [
      "阅读所有错题类型和典型坑点完整查阅总归档",
      "高阶同义转换词汇（Concept Paraphrase）高频背诵复检",
      "Section 4 高频听力拼写及常考近音干扰词极速过筛",
      "Task 1 (段落精简) & Task 2 开头背景引入和结尾高大上模版闭环"
    ]
  }
];

export interface TaskStatus {
  [dayId: string]: {
    readingTimed: boolean;
    readingIntensive: boolean;
    listening: boolean[];
    writing: boolean;
    speakingPart1: boolean;
    speakingPart2: boolean;
    review: boolean;
    notes?: string;
  };
}

export const INITIAL_STATUS: TaskStatus = {};

IELTS_SCHEDULE.forEach(day => {
  INITIAL_STATUS[day.id] = {
    readingTimed: false,
    readingIntensive: false,
    listening: day.listening.map(() => false),
    writing: false,
    speakingPart1: false,
    speakingPart2: false,
    review: false,
    notes: ""
  };
});
