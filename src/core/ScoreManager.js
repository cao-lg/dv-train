// 评分管理模块
class ScoreManager {
  constructor() {
    this.submissions = JSON.parse(localStorage.getItem('submissions') || '[]');
  }

  getConfig() {
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

  submitAnswer(task, student) {
    if (!task || !student) {
      alert('请先选择任务并填写学生信息！');
      return null;
    }

    const config = this.getConfig();
    const result = this.scoreAnswer(task, config);

    const submission = {
      stuId: student.stuId,
      name: student.name,
      taskId: task.id,
      config: config,
      score: result.totalScore,
      details: result.details,
      submitTime: new Date().toISOString()
    };

    this.addSubmission(submission);
    this.showScoreReport(result);
    return submission;
  }

  scoreAnswer(task, config) {
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

  showScoreReport(result) {
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

  addSubmission(submission) {
    this.submissions.push(submission);
    this.saveSubmissions();
  }

  saveSubmissions() {
    localStorage.setItem('submissions', JSON.stringify(this.submissions));
  }

  getSubmissions(filters = {}) {
    let result = [...this.submissions];
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

  getStudentScores(stuId) {
    const studentSubs = this.submissions.filter(s => s.stuId === stuId);
    const bestScores = {};
    studentSubs.forEach(s => {
      if (!bestScores[s.taskId] || bestScores[s.taskId].score < s.score) {
        bestScores[s.taskId] = s;
      }
    });
    return Object.values(bestScores);
  }

  exportToCSV() {
    const headers = ['学号', '姓名', '任务ID', '任务名称', '分数', '提交时间'];
    const rows = this.submissions.map(s => [
      s.stuId,
      s.name,
      s.taskId,
      window.TASKS.find(t => t.id === s.taskId)?.name || '',
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
}

window.ScoreManager = ScoreManager;