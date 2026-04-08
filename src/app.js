// 主应用模块
class App {
  constructor() {
    this.taskManager = new TaskManager();
    this.chartRenderer = new ChartRenderer();
    this.scoreManager = new ScoreManager();
    this.dashboardManager = new DashboardManager();
    this.currentSection = 'student';
  }

  initialize() {
    this.initNavigation();
    this.initStudentForm();
    this.initTaskList();
    this.initConfigActions();
    this.initTeacherSection();
    this.initDashboardSection();
  }

  initNavigation() {
    document.getElementById('nav-student').addEventListener('click', () => {
      this.switchSection('student');
    });
    
    document.getElementById('nav-teacher').addEventListener('click', () => {
      this.switchSection('teacher');
    });
    
    document.getElementById('nav-dashboard').addEventListener('click', () => {
      this.switchSection('dashboard');
    });
  }

  switchSection(section) {
    this.currentSection = section;
    
    document.getElementById('nav-student').classList.toggle('active', section === 'student');
    document.getElementById('nav-teacher').classList.toggle('active', section === 'teacher');
    document.getElementById('nav-dashboard').classList.toggle('active', section === 'dashboard');
    
    document.getElementById('student-section').style.display = section === 'student' ? 'block' : 'none';
    document.getElementById('teacher-section').style.display = section === 'teacher' ? 'block' : 'none';
    document.getElementById('dashboard-section').style.display = section === 'dashboard' ? 'block' : 'none';
    
    if (section === 'teacher') {
      this.loadTeacherData();
    } else if (section === 'dashboard') {
      this.dashboardManager.initializeDashboard();
    }
  }

  initStudentForm() {
    document.getElementById('enter-platform').addEventListener('click', () => {
      const stuId = document.getElementById('stu-id').value.trim();
      const name = document.getElementById('stu-name').value.trim();
      
      if (!stuId || !name) {
        alert('请填写学号和姓名！');
        return;
      }
      
      const student = { stuId, name };
      this.taskManager.setCurrentStudent(student);
      this.showTrainingArea();
      this.taskManager.loadTask(window.TASKS[0]);
    });
  }

  showTrainingArea() {
    document.querySelector('.student-form').style.display = 'none';
    document.getElementById('training-area').style.display = 'flex';
    document.getElementById('my-scores').style.display = 'none';
  }

  initTaskList() {
    const taskList = document.getElementById('task-list');
    let currentModule = '';
    
    window.TASKS.forEach(task => {
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
        this.taskManager.loadTask(task);
      });
      
      taskList.appendChild(taskItem);
    });
  }

  initConfigActions() {
    document.getElementById('preview-chart').addEventListener('click', () => {
      this.previewChart();
    });
    
    document.getElementById('submit-answer').addEventListener('click', () => {
      this.submitAnswer();
    });
  }

  previewChart() {
    const task = this.taskManager.getCurrentTask();
    if (!task) return;
    
    const config = this.scoreManager.getConfig();
    this.chartRenderer.renderChart(task, config);
  }

  submitAnswer() {
    const task = this.taskManager.getCurrentTask();
    const student = this.taskManager.getCurrentStudent();
    this.scoreManager.submitAnswer(task, student);
  }

  initTeacherSection() {
    const filterTask = document.getElementById('filter-task');
    filterTask.innerHTML = '<option value="">全部任务</option>' + 
      window.TASKS.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
    
    filterTask.addEventListener('change', () => this.loadTeacherData());
    document.getElementById('filter-keyword').addEventListener('input', () => this.loadTeacherData());
    document.getElementById('export-csv').addEventListener('click', () => this.scoreManager.exportToCSV());
  }

  loadTeacherData() {
    const taskId = document.getElementById('filter-task').value;
    const keyword = document.getElementById('filter-keyword').value.trim();
    
    const filters = {};
    if (taskId) filters.taskId = parseInt(taskId);
    if (keyword) filters.keyword = keyword;
    
    const data = this.scoreManager.getSubmissions(filters);
    this.renderTeacherStats(data);
    this.renderErrorStats(data);
    this.renderSubmissionsTable(data);
  }

  renderTeacherStats(data) {
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

  renderErrorStats(data) {
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

  renderSubmissionsTable(data) {
    const tbody = document.getElementById('submissions-tbody');
    
    if (data.length === 0) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 40px; color: #999;">暂无提交记录</td></tr>';
      return;
    }
    
    tbody.innerHTML = data.map(sub => {
      const task = window.TASKS.find(t => t.id === sub.taskId);
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

  initDashboardSection() {
    // 大屏模块初始化
  }
}

// 全局函数
window.retryTask = function() {
  document.getElementById('score-report').style.display = 'none';
  if (window.chartInstance) {
    window.chartInstance.dispose();
  }
};

window.viewMyScores = function() {
  const app = window.app;
  const student = app.taskManager.getCurrentStudent();
  if (!student) return;
  
  const scores = app.scoreManager.getStudentScores(student.stuId);
  
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
    const task = window.TASKS.find(t => t.id === s.taskId);
    const scoreClass = s.score >= 90 ? 'score-high' : s.score >= 60 ? 'score-medium' : 'score-low';
    html += `<tr>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${task?.name || '未知任务'}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;" class="${scoreClass}">${s.score}分</td>
      <td style="padding: 12px; border-bottom: 1px solid #e0e0e0;">${new Date(s.submitTime).toLocaleString()}</td>
    </tr>`;
  });
  
  html += '</tbody></table>';
  
  scoresList.innerHTML = html;
};

window.viewSubmissionDetail = function(sub) {
  const task = window.TASKS.find(t => t.id === sub.taskId);
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
};

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
  window.app.initialize();
});