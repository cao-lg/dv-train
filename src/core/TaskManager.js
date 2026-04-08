// 任务管理核心模块
class TaskManager {
  constructor() {
    this.currentTask = null;
    this.currentStudent = null;
  }

  setCurrentTask(task) {
    this.currentTask = task;
  }

  getCurrentTask() {
    return this.currentTask;
  }

  setCurrentStudent(student) {
    this.currentStudent = student;
  }

  getCurrentStudent() {
    return this.currentStudent;
  }

  loadTask(task) {
    this.currentTask = task;
    this.updateTaskListUI(task);
    this.renderTaskDetail(task);
    this.renderConfigForm(task);
    this.hideScoreReport();
    this.disposeChart();
  }

  updateTaskListUI(task) {
    document.querySelectorAll('.task-item').forEach(item => {
      item.classList.toggle('active', parseInt(item.dataset.taskId) === task.id);
    });
  }

  renderTaskDetail(task) {
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

  renderConfigForm(task) {
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

  hideScoreReport() {
    document.getElementById('score-report').style.display = 'none';
  }

  disposeChart() {
    if (window.chartInstance) {
      window.chartInstance.dispose();
    }
  }
}

window.TaskManager = TaskManager;