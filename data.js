window.TASKS = [
  {
    id: 1,
    module: '模块一：基础认知实训',
    name: '1-1 月度销售额柱状图',
    scenario: '某零售企业 1–12 月销售额数据，需展示趋势与对比。',
    goals: [
      '理解柱状图适用场景',
      '区分维度（月份）与度量（销售额）',
      '掌握基础图表标题规范'
    ],
    dataset: {
      fields: ['月份', '销售额', '利润', '门店数量'],
      data: [
        ['1月', 12000, 3600, 5],
        ['2月', 15000, 4500, 5],
        ['3月', 18000, 5400, 6],
        ['4月', 16000, 4800, 6],
        ['5月', 22000, 6600, 7],
        ['6月', 28000, 8400, 7],
        ['7月', 32000, 9600, 8],
        ['8月', 30000, 9000, 8],
        ['9月', 26000, 7800, 7],
        ['10月', 24000, 7200, 7],
        ['11月', 35000, 10500, 8],
        ['12月', 42000, 12600, 9]
      ]
    },
    configOptions: {
      chartTypes: [
        { value: 'bar', label: '柱状图' },
        { value: 'line', label: '折线图' },
        { value: 'pie', label: '饼图' }
      ],
      dimensions: [
        { value: '月份', label: '月份' },
        { value: '', label: '无' }
      ],
      measures: [
        { value: '销售额', label: '销售额' },
        { value: '利润', label: '利润' },
        { value: '门店数量', label: '门店数量' }
      ]
    },
    answer: {
      chartType: 'bar',
      dimension: '月份',
      measure: '销售额',
      title: '2025 年度月度销售额对比'
    },
    scoringRules: {
      chartType: { score: 30, hint: '图表类型应选择柱状图' },
      dimension: { score: 25, hint: '维度应选择月份' },
      measure: { score: 25, hint: '度量应选择销售额' },
      title: { score: 20, hint: '标题应包含"销售额"且语义清晰', check: (title) => title && title.includes('销售额') }
    }
  },
  {
    id: 2,
    module: '模块一：基础认知实训',
    name: '1-2 各产品销售额占比饼图',
    scenario: '展示不同品类销售额占比结构。',
    goals: [
      '理解饼图用于占比与结构分析',
      '区分分类与数值字段'
    ],
    dataset: {
      fields: ['产品类别', '销售额', '销量', '利润率'],
      data: [
        ['电子产品', 450000, 1200, 0.25],
        ['服装鞋帽', 320000, 3500, 0.35],
        ['食品饮料', 280000, 8000, 0.20],
        ['家居用品', 180000, 2200, 0.30],
        ['美妆个护', 150000, 3000, 0.40]
      ]
    },
    configOptions: {
      chartTypes: [
        { value: 'pie', label: '饼图' },
        { value: 'bar', label: '柱状图' },
        { value: 'line', label: '折线图' }
      ],
      categories: [
        { value: '产品类别', label: '产品类别' }
      ],
      values: [
        { value: '销售额', label: '销售额' },
        { value: '销量', label: '销量' },
        { value: '利润率', label: '利润率' }
      ]
    },
    answer: {
      chartType: 'pie',
      category: '产品类别',
      value: '销售额',
      title: '各产品类别销售额占比'
    },
    scoringRules: {
      chartType: { score: 30, hint: '图表类型应选择饼图' },
      category: { score: 25, hint: '分类应选择产品类别' },
      value: { score: 25, hint: '数值应选择销售额' },
      title: { score: 20, hint: '标题应包含"销售额"且语义清晰', check: (title) => title && title.includes('销售额') }
    }
  },
  {
    id: 3,
    module: '模块二：趋势与对比分析',
    name: '2-1 月度销售额趋势折线图',
    scenario: '观察全年销售变化趋势、波峰波谷。',
    goals: [
      '理解折线图用于时间序列趋势分析'
    ],
    dataset: {
      fields: ['月份', '销售额', '利润'],
      data: [
        ['1月', 12000, 3600],
        ['2月', 15000, 4500],
        ['3月', 18000, 5400],
        ['4月', 16000, 4800],
        ['5月', 22000, 6600],
        ['6月', 28000, 8400],
        ['7月', 32000, 9600],
        ['8月', 30000, 9000],
        ['9月', 26000, 7800],
        ['10月', 24000, 7200],
        ['11月', 35000, 10500],
        ['12月', 42000, 12600]
      ]
    },
    configOptions: {
      chartTypes: [
        { value: 'line', label: '折线图' },
        { value: 'bar', label: '柱状图' },
        { value: 'pie', label: '饼图' }
      ],
      dimensions: [
        { value: '月份', label: '月份' },
        { value: '', label: '无' }
      ],
      measures: [
        { value: '销售额', label: '销售额' },
        { value: '利润', label: '利润' }
      ]
    },
    answer: {
      chartType: 'line',
      dimension: '月份',
      measure: '销售额',
      title: '月度销售额趋势变化'
    },
    scoringRules: {
      chartType: { score: 30, hint: '图表类型应选择折线图' },
      dimension: { score: 25, hint: '维度应选择月份' },
      measure: { score: 25, hint: '度量应选择销售额' },
      title: { score: 20, hint: '标题应包含"趋势"或"变化"且语义清晰', check: (title) => title && (title.includes('趋势') || title.includes('变化')) }
    }
  },
  {
    id: 4,
    module: '模块二：趋势与对比分析',
    name: '2-2 多门店销售额横向对比柱状图',
    scenario: '对比不同门店的销售业绩。',
    goals: [
      '掌握多分类对比场景的图表选型'
    ],
    dataset: {
      fields: ['门店名称', '销售额', '利润'],
      data: [
        ['朝阳店', 280000, 84000],
        ['海淀店', 320000, 96000],
        ['西城店', 250000, 75000],
        ['东城店', 290000, 87000],
        ['丰台店', 210000, 63000]
      ]
    },
    configOptions: {
      chartTypes: [
        { value: 'bar', label: '柱状图' },
        { value: 'line', label: '折线图' },
        { value: 'pie', label: '饼图' }
      ],
      dimensions: [
        { value: '门店名称', label: '门店名称' },
        { value: '', label: '无' }
      ],
      measures: [
        { value: '销售额', label: '销售额' },
        { value: '利润', label: '利润' }
      ]
    },
    answer: {
      chartType: 'bar',
      dimension: '门店名称',
      measure: '销售额',
      title: '各门店销售额对比'
    },
    scoringRules: {
      chartType: { score: 30, hint: '图表类型应选择柱状图' },
      dimension: { score: 25, hint: '维度应选择门店名称' },
      measure: { score: 25, hint: '度量应选择销售额' },
      title: { score: 20, hint: '标题应包含"门店"和"销售额"且语义清晰', check: (title) => title && title.includes('门店') && title.includes('销售额') }
    }
  },
  {
    id: 5,
    module: '模块三：复合指标与双轴图表',
    name: '3-1 销售额 + 利润双轴图',
    scenario: '同时展示收入规模与盈利水平。',
    goals: [
      '理解双轴图适用场景',
      '区分两个度量的含义'
    ],
    dataset: {
      fields: ['月份', '销售额', '利润'],
      data: [
        ['1月', 12000, 3600],
        ['2月', 15000, 4500],
        ['3月', 18000, 5400],
        ['4月', 16000, 4800],
        ['5月', 22000, 6600],
        ['6月', 28000, 8400],
        ['7月', 32000, 9600],
        ['8月', 30000, 9000],
        ['9月', 26000, 7800],
        ['10月', 24000, 7200],
        ['11月', 35000, 10500],
        ['12月', 42000, 12600]
      ]
    },
    configOptions: {
      chartTypes: [
        { value: 'dual', label: '双轴图（柱+线）' },
        { value: 'bar', label: '柱状图' },
        { value: 'line', label: '折线图' }
      ],
      dimensions: [
        { value: '月份', label: '月份' }
      ],
      mainMeasures: [
        { value: '销售额', label: '销售额' },
        { value: '利润', label: '利润' }
      ],
      subMeasures: [
        { value: '利润', label: '利润' },
        { value: '销售额', label: '销售额' }
      ]
    },
    answer: {
      chartType: 'dual',
      dimension: '月份',
      mainMeasure: '销售额',
      subMeasure: '利润',
      title: '月度销售额与利润双轴分析'
    },
    scoringRules: {
      chartType: { score: 30, hint: '图表类型应选择双轴图' },
      dimension: { score: 25, hint: '维度应选择月份' },
      mainMeasure: { score: 12, hint: '主度量应选择销售额' },
      subMeasure: { score: 13, hint: '次度量应选择利润' },
      title: { score: 20, hint: '标题应包含"销售额"和"利润"且语义清晰', check: (title) => title && title.includes('销售额') && title.includes('利润') }
    }
  },
  {
    id: 6,
    module: '模块三：复合指标与双轴图表',
    name: '3-2 区域销量与利润率对比',
    scenario: '分析各区域的销量规模与盈利能力。',
    goals: [
      '掌握双轴图在区域分析中的应用'
    ],
    dataset: {
      fields: ['地区', '销量', '利润率'],
      data: [
        ['华北', 15000, 0.28],
        ['华东', 18000, 0.32],
        ['华南', 12000, 0.25],
        ['西南', 9000, 0.22],
        ['华中', 11000, 0.26],
        ['西北', 7000, 0.20]
      ]
    },
    configOptions: {
      chartTypes: [
        { value: 'dual', label: '双轴图（柱+线）' },
        { value: 'bar', label: '柱状图' },
        { value: 'line', label: '折线图' }
      ],
      dimensions: [
        { value: '地区', label: '地区' }
      ],
      mainMeasures: [
        { value: '销量', label: '销量' },
        { value: '利润率', label: '利润率' }
      ],
      subMeasures: [
        { value: '利润率', label: '利润率' },
        { value: '销量', label: '销量' }
      ]
    },
    answer: {
      chartType: 'dual',
      dimension: '地区',
      mainMeasure: '销量',
      subMeasure: '利润率',
      title: '各区域销量与利润率对比'
    },
    scoringRules: {
      chartType: { score: 30, hint: '图表类型应选择双轴图' },
      dimension: { score: 25, hint: '维度应选择地区' },
      mainMeasure: { score: 12, hint: '主度量应选择销量' },
      subMeasure: { score: 13, hint: '次度量应选择利润率' },
      title: { score: 20, hint: '标题应包含"销量"和"利润率"且语义清晰', check: (title) => title && title.includes('销量') && title.includes('利润率') }
    }
  },
  {
    id: 7,
    module: '模块四：综合仪表盘实训',
    name: '4-1 销售概况综合看板',
    scenario: '构建销售数据综合分析看板。',
    goals: [
      '综合运用多种图表类型',
      '培养业务看板设计能力'
    ],
    dataset: {
      fields: ['月份', '销售额', '利润', '产品类别', '类别销售额'],
      data: {
        monthly: [
          ['1月', 12000, 3600],
          ['2月', 15000, 4500],
          ['3月', 18000, 5400],
          ['4月', 16000, 4800],
          ['5月', 22000, 6600],
          ['6月', 28000, 8400]
        ],
        category: [
          ['电子产品', 450000],
          ['服装鞋帽', 320000],
          ['食品饮料', 280000],
          ['家居用品', 180000]
        ]
      }
    },
    isDashboard: true,
    subTasks: [
      {
        name: '月度销售额柱状图',
        answer: { chartType: 'bar', dimension: '月份', measure: '销售额', title: '月度销售额柱状图' },
        score: 30
      },
      {
        name: '产品占比饼图',
        answer: { chartType: 'pie', category: '产品类别', value: '类别销售额', title: '产品类别占比' },
        score: 30
      },
      {
        name: '趋势折线图',
        answer: { chartType: 'line', dimension: '月份', measure: '利润', title: '利润趋势图' },
        score: 30
      }
    ],
    scoringRules: {
      subTasks: 90,
      layout: 10
    }
  },
  {
    id: 8,
    module: '模块四：综合仪表盘实训',
    name: '4-2 异常数据分析图表',
    scenario: '找出销售额异常月份并可视化分析。',
    goals: [
      '培养数据解读能力',
      '学会用图表表达异常分析'
    ],
    dataset: {
      fields: ['月份', '销售额'],
      data: [
        ['1月', 12000],
        ['2月', 15000],
        ['3月', 5000],
        ['4月', 16000],
        ['5月', 22000],
        ['6月', 28000],
        ['7月', 32000],
        ['8月', 8000],
        ['9月', 26000],
        ['10月', 24000],
        ['11月', 35000],
        ['12月', 42000]
      ]
    },
    configOptions: {
      chartTypes: [
        { value: 'bar', label: '柱状图' },
        { value: 'line', label: '折线图' }
      ],
      dimensions: [
        { value: '月份', label: '月份' }
      ],
      measures: [
        { value: '销售额', label: '销售额' }
      ]
    },
    answer: {
      chartType: 'bar',
      dimension: '月份',
      measure: '销售额',
      title: '月度销售额异常分析'
    },
    scoringRules: {
      chartType: { score: 30, hint: '建议使用柱状图或折线图展示异常' },
      dimension: { score: 25, hint: '维度应选择月份' },
      measure: { score: 25, hint: '度量应选择销售额' },
      title: { score: 20, hint: '标题应包含"异常"且语义清晰', check: (title) => title && title.includes('异常') }
    }
  },
  {
    id: 9,
    module: '模块五：炫酷大屏实训',
    name: '5-1 科技风销售趋势图',
    scenario: '使用科技暗黑风格展示全年销售数据，选择合适的图表类型和配色方案。',
    goals: [
      '掌握科技科幻风图表配色',
      '学习3D效果和发光样式',
      '培养炫酷大屏设计思维'
    ],
    theme: 'tech-dark',
    dataset: {
      fields: ['月份', '销售额', '利润'],
      data: [
        ['1月', 185000, 52000],
        ['2月', 212000, 59000],
        ['3月', 245000, 68000],
        ['4月', 228000, 64000],
        ['5月', 265000, 74000],
        ['6月', 298000, 83000],
        ['7月', 312000, 87000],
        ['8月', 289000, 81000],
        ['9月', 256000, 72000],
        ['10月', 278000, 78000],
        ['11月', 302000, 85000],
        ['12月', 286000, 80000]
      ]
    },
    configOptions: {
      chartTypes: [
        { value: 'bar', label: '3D柱状图' },
        { value: 'line', label: '流光折线图' },
        { value: 'bar3d', label: '立体柱状图' }
      ],
      dimensions: [
        { value: '月份', label: '月份' }
      ],
      measures: [
        { value: '销售额', label: '销售额' },
        { value: '利润', label: '利润' }
      ],
      themes: [
        { value: 'tech-dark', label: '科技暗黑风' },
        { value: 'neon-blue', label: '霓虹蓝光' },
        { value: 'cyber-purple', label: '赛博紫' }
      ]
    },
    answer: {
      chartType: 'bar',
      dimension: '月份',
      measure: '销售额',
      theme: 'tech-dark',
      title: '2025年度销售数据全景（科技风）'
    },
    scoringRules: {
      chartType: { score: 25, hint: '建议选择3D柱状图或流光折线图' },
      dimension: { score: 20, hint: '维度应选择月份' },
      measure: { score: 20, hint: '度量应选择销售额' },
      theme: { score: 15, hint: '选择科技暗黑风格主题' },
      title: { score: 20, hint: '标题应包含"科技风"和"销售"', check: (title) => title && title.includes('科技') && title.includes('销售') }
    }
  },
  {
    id: 10,
    module: '模块五：炫酷大屏实训',
    name: '5-2 商务风格品类分析',
    scenario: '使用轻奢商务风格展示各品类销售占比，专业大气适合汇报。',
    goals: [
      '掌握商务精致风配色',
      '学习专业数据展示规范',
      '培养管理层汇报思维'
    ],
    theme: 'business-light',
    dataset: {
      fields: ['品类', '销售额', '占比'],
      data: [
        ['数码电子', 3500000, 35],
        ['服装配饰', 2500000, 25],
        ['食品生鲜', 2000000, 20],
        ['家居用品', 1200000, 12],
        ['其他', 800000, 8]
      ]
    },
    configOptions: {
      chartTypes: [
        { value: 'pie', label: '环形饼图' },
        { value: 'bar', label: '横向柱状图' },
        { value: 'rose', label: '玫瑰图' }
      ],
      categories: [
        { value: '品类', label: '品类' }
      ],
      values: [
        { value: '销售额', label: '销售额' },
        { value: '占比', label: '占比' }
      ],
      themes: [
        { value: 'business-light', label: '轻奢商务风' },
        { value: 'professional-blue', label: '专业蓝' },
        { value: 'elegant-gray', label: '优雅灰' }
      ]
    },
    answer: {
      chartType: 'pie',
      category: '品类',
      value: '销售额',
      theme: 'business-light',
      title: '各品类销售占比分析报告'
    },
    scoringRules: {
      chartType: { score: 25, hint: '建议选择环形饼图展示占比' },
      category: { score: 20, hint: '分类应选择品类' },
      value: { score: 20, hint: '数值应选择销售额' },
      theme: { score: 15, hint: '选择轻奢商务风格主题' },
      title: { score: 20, hint: '标题应包含"占比"和"分析"', check: (title) => title && title.includes('占比') && title.includes('分析') }
    }
  },
  {
    id: 11,
    module: '模块五：炫酷大屏实训',
    name: '5-3 赛博朋克转化漏斗',
    scenario: '使用赛博朋克风格展示电商用户转化漏斗，荧光色高对比超炫酷！',
    goals: [
      '掌握赛博朋克配色方案',
      '学习漏斗图的业务应用',
      '培养炫酷数据表达能力'
    ],
    theme: 'cyberpunk',
    dataset: {
      fields: ['转化阶段', '人数', '转化率'],
      data: [
        ['访问首页', 85600, 100],
        ['浏览商品', 52300, 61.1],
        ['加入购物车', 15800, 18.5],
        ['提交订单', 4250, 5.0],
        ['完成支付', 2740, 3.2]
      ]
    },
    configOptions: {
      chartTypes: [
        { value: 'funnel', label: '漏斗图' },
        { value: 'bar', label: '对比柱状图' },
        { value: 'line', label: '趋势折线图' }
      ],
      dimensions: [
        { value: '转化阶段', label: '转化阶段' }
      ],
      measures: [
        { value: '人数', label: '人数' },
        { value: '转化率', label: '转化率' }
      ],
      themes: [
        { value: 'cyberpunk', label: '赛博朋克' },
        { value: 'neon-pink', label: '荧光粉' },
        { value: 'matrix-green', label: '矩阵绿' }
      ]
    },
    answer: {
      chartType: 'funnel',
      dimension: '转化阶段',
      measure: '人数',
      theme: 'cyberpunk',
      title: '电商用户转化漏斗分析（赛博朋克版）'
    },
    scoringRules: {
      chartType: { score: 25, hint: '图表类型应选择漏斗图' },
      dimension: { score: 20, hint: '维度应选择转化阶段' },
      measure: { score: 20, hint: '度量应选择人数' },
      theme: { score: 15, hint: '选择赛博朋克风格主题' },
      title: { score: 20, hint: '标题应包含"漏斗"和"赛博"', check: (title) => title && title.includes('漏斗') && title.includes('赛博') }
    }
  }
];

let submissions = JSON.parse(localStorage.getItem('submissions') || '[]');

function saveSubmissions() {
  localStorage.setItem('submissions', JSON.stringify(submissions));
}

function addSubmission(submission) {
  submissions.push(submission);
  saveSubmissions();
}

function getSubmissions(filters = {}) {
  let result = [...submissions];
  if (filters.taskId) {
    result = result.filter(s => s.taskId === filters.taskId);
  }
  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase();
    result = result.filter(s => 
      s.stuId.toLowerCase().includes(kw) || 
      s.name.toLowerCase().includes(kw)
    );
  }
  return result.sort((a, b) => new Date(b.submitTime) - new Date(a.submitTime));
}

function getStudentScores(stuId) {
  const studentSubs = submissions.filter(s => s.stuId === stuId);
  const bestScores = {};
  studentSubs.forEach(s => {
    if (!bestScores[s.taskId] || bestScores[s.taskId].score < s.score) {
      bestScores[s.taskId] = s;
    }
  });
  return Object.values(bestScores);
}

function exportToCSV() {
  const headers = ['学号', '姓名', '任务ID', '任务名称', '分数', '提交时间'];
  const rows = submissions.map(s => [
    s.stuId,
    s.name,
    s.taskId,
    TASKS.find(t => t.id === s.taskId)?.name || '',
    s.score,
    s.submitTime
  ]);
  
  const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = '成绩表_' + new Date().toISOString().slice(0, 10) + '.csv';
  link.click();
}
