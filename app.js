let currentStudent = null;
let currentTask = null;
let chartInstance = null;
let currentSection = 'student';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initStudentForm();
  initTaskList();
  initConfigActions();
  initTeacherSection();
});

function initNavigation() {
  document.getElementById('nav-student').addEventListener('click', () => {
    switchSection('student');
  });
  
  document.getElementById('nav-teacher').addEventListener('click', () => {
    switchSection('teacher');
  });
}

function switchSection(section) {
  currentSection = section;
  
  document.getElementById('nav-student').classList.toggle('active', section === 'student');
  document.getElementById('nav-teacher').classList.toggle('active', section === 'teacher');
  
  document.getElementById('student-section').style.display = section === 'student' ? 'block' : 'none';
  document.getElementById('teacher-section').style.display = section === 'teacher' ? 'block' : 'none';
  
  if (section === 'teacher') {
    loadTeacherData();
  }
}

function initStudentForm() {
  document.getElementById('enter-platform').addEventListener('click', () => {
    const stuId = document.getElementById('stu-id').value.trim();
    const name = document.getElementById('stu-name').value.trim();
    
    if (!stuId || !name) {
      alert('请填写学号和姓名！');
      return;
    }
    
    currentStudent = { stuId, name };
    showTrainingArea();
    loadTask(TASKS[0]);
  });
}

function showTrainingArea() {
  document.querySelector('.student-form').style.display = 'none';
  document.getElementById('training-area').style.display = 'flex';
  document.getElementById('my-scores').style.display = 'none';
}

function initTaskList() {
  const taskList = document.getElementById('task-list');
  let currentModule = '';
  
  TASKS.forEach(task => {
    if (task.module !== currentModule) {
      currentModule = task.module;
      const moduleHeader = document.createElement('div');
      moduleHeader.className = 'module-header';
      moduleHeader.style.cssText = 'font-weight: 600; color: #667eea; margin: 15px 0 10px; font-size: 13px;';
      moduleHeader.textContent = currentModule;
      taskList.appendChild(moduleHeader);
    }
    
    const taskItem = document.createElement('div');
    taskItem.className = 'task-item';
    taskItem.textContent = task.name;
    taskItem.dataset.taskId = task.id;
    
    taskItem.addEventListener('click', () => {
      loadTask(task);
    });
    
    taskList.appendChild(taskItem);
  });
}

function loadTask(task) {
  currentTask = task;
  
  document.querySelectorAll('.task-item').forEach(item => {
    item.classList.toggle('active', parseInt(item.dataset.taskId) === task.id);
  });
  
  renderTaskDetail(task);
  renderConfigForm(task);
  
  document.getElementById('score-report').style.display = 'none';
  document.querySelector('.chart-workspace').style.display = 'flex';
  
  if (chartInstance) {
    chartInstance.dispose();
  }
}

function renderTaskDetail(task) {
  const detail = document.getElementById('task-detail');
  
  let dataTable = '';
  if (task.dataset.data && Array.isArray(task.dataset.data)) {
    dataTable = `
      <div class="data-preview">
        <h4>数据预览</h4>
        <table>
          <thead>
            <tr>
              ${task.dataset.fields.map(f => `<th>${f}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${task.dataset.data.slice(0, 5).map(row => `
              <tr>
                ${row.map(cell => `<td>${cell}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
        <p style="margin-top: 10px; font-size: 12px; color: #999;">显示前 5 条，共 ${task.dataset.data.length} 条</p>
      </div>
    `;
  }
  
  detail.innerHTML = `
    <h2>${task.name}</h2>
    <div class="scenario">
      <strong>业务场景：</strong>${task.scenario}
    </div>
    <div class="goals">
      <h4>训练目标</h4>
      <ul>
        ${task.goals.map(g => `<li>${g}</li>`).join('')}
      </ul>
    </div>
    ${dataTable}
  `;
}

function renderConfigForm(task) {
  const form = document.getElementById('config-form');
  const chartWorkspace = document.querySelector('.chart-workspace');
  chartWorkspace.style.display = 'flex';
  
  let html = '';
  
  if (!task.configOptions || !task.configOptions.chartTypes) {
    form.innerHTML = '<p style="color: red; padding: 20px;">任务配置有误，请检查数据配置。</p>';
    return;
  }
  
  html += `
    <div class="form-group">
      <label>图表类型</label>
      <select id="config-chartType">
        ${task.configOptions.chartTypes.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}
      </select>
    </div>
  `;
  
  if (task.configOptions.dimensions) {
    html += `
      <div class="form-group">
        <label>维度（X轴/分类）</label>
        <select id="config-dimension">
          ${task.configOptions.dimensions.map(d => `<option value="${d.value}">${d.label}</option>`).join('')}
        </select>
      </div>
    `;
  }
  
  if (task.configOptions.categories) {
    html += `
      <div class="form-group">
        <label>分类字段</label>
        <select id="config-category">
          ${task.configOptions.categories.map(c => `<option value="${c.value}">${c.label}</option>`).join('')}
        </select>
      </div>
    `;
  }
  
  if (task.configOptions.measures) {
    html += `
      <div class="form-group">
        <label>度量（Y轴/数值）</label>
        <select id="config-measure">
          ${task.configOptions.measures.map(m => `<option value="${m.value}">${m.label}</option>`).join('')}
        </select>
      </div>
    `;
  }
  
  if (task.configOptions.values) {
    html += `
      <div class="form-group">
        <label>数值字段</label>
        <select id="config-value">
          ${task.configOptions.values.map(v => `<option value="${v.value}">${v.label}</option>`).join('')}
        </select>
      </div>
    `;
  }
  
  if (task.configOptions.mainMeasures) {
    html += `
      <div class="form-group">
        <label>主度量</label>
        <select id="config-mainMeasure">
          ${task.configOptions.mainMeasures.map(m => `<option value="${m.value}">${m.label}</option>`).join('')}
        </select>
      </div>
    `;
  }
  
  if (task.configOptions.subMeasures) {
    html += `
      <div class="form-group">
        <label>次度量</label>
        <select id="config-subMeasure">
          ${task.configOptions.subMeasures.map(m => `<option value="${m.value}">${m.label}</option>`).join('')}
        </select>
      </div>
    `;
  }
  
  if (task.configOptions.themes) {
    html += `
      <div class="form-group">
        <label>主题风格</label>
        <select id="config-theme">
          ${task.configOptions.themes.map(t => `<option value="${t.value}">${t.label}</option>`).join('')}
        </select>
      </div>
    `;
  }
  
  html += `
    <div class="form-group">
      <label>图表标题</label>
      <input type="text" id="config-title" placeholder="请输入图表标题">
    </div>
  `;
  
  form.innerHTML = html;
}

function initConfigActions() {
  document.getElementById('preview-chart').addEventListener('click', previewChart);
  document.getElementById('submit-answer').addEventListener('click', submitAnswer);
}

function getConfig() {
  const config = {};
  
  const chartTypeEl = document.getElementById('config-chartType');
  if (chartTypeEl) config.chartType = chartTypeEl.value;
  
  const dimensionEl = document.getElementById('config-dimension');
  if (dimensionEl) config.dimension = dimensionEl.value;
  
  const categoryEl = document.getElementById('config-category');
  if (categoryEl) config.category = categoryEl.value;
  
  const measureEl = document.getElementById('config-measure');
  if (measureEl) config.measure = measureEl.value;
  
  const valueEl = document.getElementById('config-value');
  if (valueEl) config.value = valueEl.value;
  
  const mainMeasureEl = document.getElementById('config-mainMeasure');
  if (mainMeasureEl) config.mainMeasure = mainMeasureEl.value;
  
  const subMeasureEl = document.getElementById('config-subMeasure');
  if (subMeasureEl) config.subMeasure = subMeasureEl.value;
  
  const themeEl = document.getElementById('config-theme');
  if (themeEl) config.theme = themeEl.value;
  
  const titleEl = document.getElementById('config-title');
  if (titleEl) config.title = titleEl.value;
  
  return config;
}

function previewChart() {
  if (!currentTask) return;
  
  const config = getConfig();
  renderChart(currentTask, config);
}

function renderChart(task, config) {
  const container = document.getElementById('chart-container');
  
  if (chartInstance) {
    chartInstance.dispose();
  }
  
  chartInstance = echarts.init(container);
  
  const option = buildChartOption(task, config);
  chartInstance.setOption(option);
  
  window.addEventListener('resize', () => {
    chartInstance.resize();
  });
}

function getThemeColors(theme) {
  const themes = {
    'tech-dark': {
      bg: '#0a0a1a',
      text: '#e0e0e0',
      colors: ['#00d4ff', '#ff00d4', '#00ff88', '#ffd700', '#ff6b6b', '#4ecdc4'],
      gridColor: 'rgba(255,255,255,0.1)'
    },
    'neon-blue': {
      bg: '#001a33',
      text: '#00ffff',
      colors: ['#00ffff', '#0088ff', '#0044ff', '#00ffff', '#0088ff', '#0044ff'],
      gridColor: 'rgba(0,255,255,0.2)'
    },
    'cyber-purple': {
      bg: '#0d001a',
      text: '#ff00ff',
      colors: ['#ff00ff', '#8800ff', '#4400ff', '#ff00ff', '#8800ff', '#4400ff'],
      gridColor: 'rgba(255,0,255,0.2)'
    },
    'business-light': {
      bg: '#ffffff',
      text: '#333333',
      colors: ['#1e40af', '#059669', '#d97706', '#7c3aed', '#db2777', '#0891b2'],
      gridColor: 'rgba(0,0,0,0.1)'
    },
    'professional-blue': {
      bg: '#f8fafc',
      text: '#1e3a5f',
      colors: ['#1e40af', '#3b82f6', '#60a5fa', '#1e40af', '#3b82f6', '#60a5fa'],
      gridColor: 'rgba(30,64,175,0.2)'
    },
    'elegant-gray': {
      bg: '#f5f5f5',
      text: '#444444',
      colors: ['#4a5568', '#718096', '#a0aec0', '#4a5568', '#718096', '#a0aec0'],
      gridColor: 'rgba(74,85,104,0.2)'
    },
    'cyberpunk': {
      bg: '#0d0221',
      text: '#00f5ff',
      colors: ['#ff006e', '#00f5ff', '#ffff00', '#00ff00', '#bf00ff', '#ff6600'],
      gridColor: 'rgba(0,245,255,0.2)'
    },
    'neon-pink': {
      bg: '#1a001a',
      text: '#ff66cc',
      colors: ['#ff006e', '#ff66cc', '#ff3399', '#ff006e', '#ff66cc', '#ff3399'],
      gridColor: 'rgba(255,0,110,0.2)'
    },
    'matrix-green': {
      bg: '#001100',
      text: '#00ff00',
      colors: ['#00ff00', '#00cc00', '#009900', '#00ff00', '#00cc00', '#009900'],
      gridColor: 'rgba(0,255,0,0.2)'
    }
  };
  return themes[theme] || themes['business-light'];
}

function buildChartOption(task, config) {
  const dataset = task.dataset;
  const theme = getThemeColors(config.theme || task.theme);
  
  let option = {
    backgroundColor: theme.bg,
    title: {
      text: config.title || '图表预览',
      left: 'center',
      textStyle: {
        color: theme.text,
        fontSize: 18,
        fontWeight: 'bold'
      }
    },
    tooltip: {
      trigger: config.chartType === 'pie' || config.chartType === 'funnel' || config.chartType === 'rose' ? 'item' : 'axis',
      backgroundColor: 'rgba(0,0,0,0.8)',
      textStyle: { color: '#fff' }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    color: theme.colors
  };
  
  if (config.chartType === 'pie' || config.chartType === 'rose') {
    const catIndex = dataset.fields.indexOf(config.category);
    const valIndex = dataset.fields.indexOf(config.value);
    
    option.series = [{
      type: 'pie',
      data: dataset.data.map((row, i) => ({
        name: row[catIndex],
        value: row[valIndex],
        itemStyle: { 
          color: theme.colors[i % theme.colors.length],
          ...(config.chartType === 'rose' ? {} : { borderRadius: 10 })
        }
      })),
      ...(config.chartType === 'rose' ? {
        radius: ['30%', '70%'],
        roseType: 'area'
      } : {
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderColor: theme.bg,
          borderWidth: 2
        }
      }),
      label: { 
        show: true, 
        color: theme.text,
        formatter: '{b}: {c}'
      },
      emphasis: {
        label: { show: true, fontSize: 16, fontWeight: 'bold' }
      }
    }];
    
    option.legend = {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { color: theme.text }
    };
  } else if (config.chartType === 'funnel') {
    const dimIndex = dataset.fields.indexOf(config.dimension);
    const meaIndex = dataset.fields.indexOf(config.measure);
    
    option.series = [{
      type: 'funnel',
      left: '10%',
      top: 60,
      bottom: 60,
      width: '80%',
      min: 0,
      max: dataset.data[0][meaIndex],
      minSize: '0%',
      maxSize: '100%',
      sort: 'descending',
      gap: 10,
      label: { 
        show: true, 
        position: 'inside',
        color: '#fff',
        fontSize: 14
      },
      labelLine: {
        length: 10,
        lineStyle: {
          width: 1,
          type: 'solid'
        }
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 1
      },
      emphasis: {
        label: {
          fontSize: 20
        }
      },
      data: dataset.data.map((row, i) => ({
        name: row[dimIndex],
        value: row[meaIndex],
        itemStyle: { color: theme.colors[i % theme.colors.length] }
      }))
    }];
  } else if (config.chartType === 'dual') {
    const dimIndex = dataset.fields.indexOf(config.dimension);
    const mainIndex = dataset.fields.indexOf(config.mainMeasure);
    const subIndex = dataset.fields.indexOf(config.subMeasure);
    
    option.xAxis = {
      type: 'category',
      data: dataset.data.map(row => row[dimIndex]),
      axisLine: { lineStyle: { color: theme.text } },
      axisLabel: { color: theme.text }
    };
    option.yAxis = [
      {
        type: 'value',
        name: config.mainMeasure,
        position: 'left',
        axisLine: { lineStyle: { color: theme.colors[0] } },
        axisLabel: { color: theme.colors[0] },
        splitLine: { lineStyle: { color: theme.gridColor } }
      },
      {
        type: 'value',
        name: config.subMeasure,
        position: 'right',
        axisLine: { lineStyle: { color: theme.colors[1] } },
        axisLabel: { color: theme.colors[1] },
        splitLine: { show: false }
      }
    ];
    option.series = [
      {
        name: config.mainMeasure,
        type: 'bar',
        data: dataset.data.map(row => row[mainIndex]),
        itemStyle: { color: theme.colors[0] }
      },
      {
        name: config.subMeasure,
        type: 'line',
        yAxisIndex: 1,
        data: dataset.data.map(row => row[subIndex]),
        itemStyle: { color: theme.colors[1] },
        smooth: true
      }
    ];
  } else {
    const dimIndex = dataset.fields.indexOf(config.dimension);
    const meaIndex = dataset.fields.indexOf(config.measure);
    
    option.xAxis = {
      type: config.chartType === 'line' ? 'category' : 'value',
      data: config.chartType === 'line' ? dataset.data.map(row => row[dimIndex]) : undefined,
      axisLine: { lineStyle: { color: theme.text } },
      axisLabel: { color: theme.text },
      splitLine: { lineStyle: { color: theme.gridColor } }
    };
    option.yAxis = {
      type: config.chartType === 'line' ? 'value' : 'category',
      data: config.chartType === 'line' ? undefined : dataset.data.map(row => row[dimIndex]),
      axisLine: { lineStyle: { color: theme.text } },
      axisLabel: { color: theme.text },
      splitLine: { lineStyle: { color: theme.gridColor } }
    };
    
    let seriesType = config.chartType;
    if (config.chartType === 'bar3d') seriesType = 'bar';
    if (config.chartType === 'bar' || config.chartType === 'bar3d') {
      option.xAxis = {
        type: 'category',
        data: dataset.data.map(row => row[dimIndex]),
        axisLine: { lineStyle: { color: theme.text } },
        axisLabel: { color: theme.text, rotate: 30 },
        splitLine: { lineStyle: { color: theme.gridColor } }
      };
      option.yAxis = {
        type: 'value',
        axisLine: { lineStyle: { color: theme.text } },
        axisLabel: { color: theme.text },
        splitLine: { lineStyle: { color: theme.gridColor } }
      };
    }
    
    option.series = [{
      name: config.measure,
      type: seriesType,
      data: dataset.data.map((row, i) => ({
        value: row[meaIndex],
        itemStyle: { 
          color: theme.colors[i % theme.colors.length],
          ...(config.chartType === 'bar3d' ? { opacity: 0.8 } : {})
        }
      })),
      ...(config.chartType === 'line' ? { 
        smooth: true,
        lineStyle: { width: 3 },
        areaStyle: { opacity: 0.3 }
      } : {}),
      ...(config.chartType === 'bar' || config.chartType === 'bar3d' ? { 
        label: { 
          show: true, 
          position: 'top',
          color: theme.text 
        }
      } : {})
    }];
    
    if (config.chartType === 'bar3d') {
      option.series[0].itemStyle = {
        borderRadius: [4, 4, 0, 0]
      };
    }
  }
  
  return option;
}

function submitAnswer() {
  if (!currentTask || !currentStudent) {
    alert('请先选择任务并填写学生信息！');
    return;
  }
  
  const config = getConfig();
  const result = scoreAnswer(currentTask, config);
  
  const submission = {
    stuId: currentStudent.stuId,
    name: currentStudent.name,
    taskId: currentTask.id,
    config: config,
    score: result.totalScore,
    details: result.details,
    submitTime: new Date().toISOString()
  };
  
  addSubmission(submission);
  showScoreReport(result);
}

function scoreAnswer(task, config) {
  const answer = task.answer;
  const rules = task.scoringRules;
  const details = [];
  let totalScore = 0;
  
  for (const [key, rule] of Object.entries(rules)) {
    if (key === 'subTasks' || key === 'layout') continue;
    
    let correct = false;
    let hint = rule.hint;
    
    if (key === 'title' && rule.check) {
      correct = rule.check(config.title);
    } else if (config[key] !== undefined && answer[key] !== undefined) {
      correct = config[key] === answer[key];
    }
    
    if (correct) {
      totalScore += rule.score;
    }
    
    details.push({
      item: key,
      score: correct ? rule.score : 0,
      maxScore: rule.score,
      correct,
      hint,
      userValue: config[key],
      answerValue: answer[key]
    });
  }
  
  return { totalScore, details };
}

function showScoreReport(result) {
  const report = document.getElementById('score-report');
  
  let scoreClass = 'need-improve';
  if (result.totalScore >= 90) scoreClass = 'excellent';
  else if (result.totalScore >= 60) scoreClass = 'good';
  
  const itemLabels = {
    chartType: '图表类型',
    dimension: '维度选择',
    category: '分类选择',
    measure: '度量选择',
    value: '数值选择',
    mainMeasure: '主度量',
    subMeasure: '次度量',
    theme: '主题风格',
    title: '图表标题'
  };
  
  const wrongItems = result.details.filter(d => !d.correct);
  
  report.innerHTML = `
    <div class="score-header">
      <div class="score-circle ${scoreClass}">${result.totalScore}</div>
      <h3>${result.totalScore >= 90 ? '优秀！' : result.totalScore >= 60 ? '不错！' : '继续努力！'}</h3>
    </div>
    
    <div class="score-details">
      ${result.details.map(d => `
        <div class="score-item ${d.correct ? 'correct' : 'wrong'}">
          <span>${itemLabels[d.item] || d.item}</span>
          <span>${d.score}/${d.maxScore}</span>
        </div>
      `).join('')}
    </div>
    
    ${wrongItems.length > 0 ? `
      <div class="error-hint">
        <strong>错误提示：</strong>
        <ul style="margin-top: 10px; margin-left: 20px;">
          ${wrongItems.map(d => `<li>${d.hint}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
    
    <div class="score-actions">
      <button class="secondary-btn" onclick="retryTask()">重做本题</button>
      <button class="primary-btn" onclick="viewMyScores()">查看我的成绩</button>
    </div>
  `;
  
  report.style.display = 'block';
}

function retryTask() {
  document.getElementById('score-report').style.display = 'none';
  if (chartInstance) {
    chartInstance.dispose();
  }
}

function viewMyScores() {
  if (!currentStudent) return;
  
  const scores = getStudentScores(currentStudent.stuId);
  
  document.getElementById('training-area').style.display = 'none';
  document.getElementById('my-scores').style.display = 'block';
  
  const scoresList = document.getElementById('scores-list');
  
  if (scores.length === 0) {
    scoresList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">暂无成绩记录</p>';
    return;
  }
  
  let html = '<table style="width: 100%; border-collapse: collapse;">';
  html += '<thead><tr><th style="text-align: left; padding: 12px; background: #f5f5f5;">任务</th><th style="text-align: left; padding: 12px; background: #f5f5f5;">最高分</th><th style="text-align: left; padding: 12px; background: #f5f5f5;">提交时间</th></tr></thead>';
  html += '<tbody>';
  
  scores.forEach(s => {
    const task = TASKS.find(t => t.id === s.taskId);
    const scoreClass = s.score >= 90 ? 'score-high' : s.score >= 60 ? 'score-medium' : 'score-low';
    html += `<tr>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${task?.name || '未知任务'}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;" class="${scoreClass}">${s.score}分</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${new Date(s.submitTime).toLocaleString()}</td>
    </tr>`;
  });
  
  html += '</tbody></table>';
  
  scoresList.innerHTML = html;
}

document.getElementById('back-to-training')?.addEventListener('click', showTrainingArea);

function initTeacherSection() {
  const filterTask = document.getElementById('filter-task');
  filterTask.innerHTML = '<option value="">全部任务</option>' + 
    TASKS.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  
  filterTask.addEventListener('change', loadTeacherData);
  document.getElementById('filter-keyword').addEventListener('input', loadTeacherData);
  document.getElementById('export-csv').addEventListener('click', exportToCSV);
}

function loadTeacherData() {
  const taskId = document.getElementById('filter-task').value;
  const keyword = document.getElementById('filter-keyword').value.trim();
  
  const filters = {};
  if (taskId) filters.taskId = parseInt(taskId);
  if (keyword) filters.keyword = keyword;
  
  const data = getSubmissions(filters);
  renderTeacherStats(data);
  renderErrorStats(data);
  renderSubmissionsTable(data);
}

function renderTeacherStats(data) {
  document.getElementById('stat-total').textContent = data.length;
  
  if (data.length > 0) {
    const avg = (data.reduce((sum, s) => sum + s.score, 0) / data.length).toFixed(1);
    const passRate = ((data.filter(s => s.score >= 60).length / data.length) * 100).toFixed(1);
    
    document.getElementById('stat-avg').textContent = avg;
    document.getElementById('stat-pass').textContent = passRate + '%';
  } else {
    document.getElementById('stat-avg').textContent = '0';
    document.getElementById('stat-pass').textContent = '0%';
  }
}

function renderErrorStats(data) {
  const errorList = document.getElementById('error-list');
  
  const errorCounts = {
    chartType: 0,
    dimension: 0,
    category: 0,
    measure: 0,
    value: 0,
    theme: 0,
    title: 0
  };
  
  data.forEach(sub => {
    if (sub.details) {
      sub.details.forEach(d => {
        if (!d.correct && errorCounts[d.item] !== undefined) {
          errorCounts[d.item]++;
        }
      });
    }
  });
  
  const itemLabels = {
    chartType: '图表类型选错',
    dimension: '维度选择错误',
    category: '分类选择错误',
    measure: '度量选择错误',
    value: '数值选择错误',
    theme: '主题选择错误',
    title: '标题不规范'
  };
  
  const total = data.length || 1;
  const sortedErrors = Object.entries(errorCounts)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);
  
  if (sortedErrors.length === 0) {
    errorList.innerHTML = '<p style="color: #999; text-align: center; padding: 20px;">暂无错误数据</p>';
    return;
  }
  
  errorList.innerHTML = sortedErrors.map(([key, count]) => {
    const percent = ((count / total) * 100).toFixed(1);
    return `
      <div class="error-bar">
        <div class="error-bar-label">
          <span>${itemLabels[key]}</span>
          <span>${count}次 (${percent}%)</span>
        </div>
        <div class="error-bar-track">
          <div class="error-bar-fill" style="width: ${percent}%;"></div>
        </div>
      </div>
    `;
  }).join('');
}

function renderSubmissionsTable(data) {
  const tbody = document.getElementById('submissions-tbody');
  
  if (data.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #999;">暂无提交记录</td></tr>';
    return;
  }
  
  tbody.innerHTML = data.map(sub => {
    const task = TASKS.find(t => t.id === sub.taskId);
    const scoreClass = sub.score >= 90 ? 'score-high' : sub.score >= 60 ? 'score-medium' : 'score-low';
    return `
      <tr>
        <td>${sub.stuId}</td>
        <td>${sub.name}</td>
        <td>${task?.name || '未知'}</td>
        <td class="${scoreClass}">${sub.score}分</td>
        <td>${new Date(sub.submitTime).toLocaleString()}</td>
        <td><button class="view-btn" onclick='viewSubmissionDetail(${JSON.stringify(sub).replace(/'/g, "\\'")})'>查看</button></td>
      </tr>
    `;
  }).join('');
}

function viewSubmissionDetail(sub) {
  const task = TASKS.find(t => t.id === sub.taskId);
  let detailHtml = `
    <strong>学号：</strong>${sub.stuId}<br>
    <strong>姓名：</strong>${sub.name}<br>
    <strong>任务：</strong>${task?.name || '未知'}<br>
    <strong>分数：</strong>${sub.score}分<br>
    <strong>提交时间：</strong>${new Date(sub.submitTime).toLocaleString()}<br><br>
    <strong>配置详情：</strong><br>
  `;
  
  for (const [key, value] of Object.entries(sub.config)) {
    detailHtml += `- ${key}: ${value || '(空)'}<br>`;
  }
  
  alert(detailHtml);
}
