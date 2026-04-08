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
    this.bindDataEvents();
    this.bindChartEditEvents();
    
    // 如果是仪表盘任务，设置默认配置
    if (task.isDashboard && task.subTasks) {
      this.initDashboardDefaults(task);
    }
  }

  initDashboardDefaults(task) {
    // 为仪表盘子任务设置默认值
    setTimeout(() => {
      task.subTasks.forEach((subTask, index) => {
        const chartTypeEl = document.getElementById(`config-subtask-${index}-chartType`);
        if (chartTypeEl) {
          chartTypeEl.value = subTask.answer.chartType;
        }
        
        const titleEl = document.getElementById(`config-subtask-${index}-title`);
        if (titleEl) {
          titleEl.value = subTask.answer.title;
        }
      });
    }, 100);
  }

  bindDataEvents() {
    // 数据导入事件
    const importInput = document.getElementById('data-import');
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          this.importData(file);
        }
      });
    }

    // 加载示例数据事件
    const sampleBtn = document.getElementById('load-sample-data');
    if (sampleBtn) {
      sampleBtn.addEventListener('click', () => {
        this.loadSampleData();
      });
    }

    // 数据处理事件
    const processBtn = document.getElementById('process-data');
    if (processBtn) {
      processBtn.addEventListener('click', () => {
        this.processData();
      });
    }

    // 清空数据事件
    const clearBtn = document.getElementById('clear-data');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.clearData();
      });
    }
  }

  loadSampleData() {
    try {
      // 示例销售数据
      const sampleData = {
        headers: ['月份', '销售额', '利润', '门店数量'],
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
      };
      
      localStorage.setItem('importedData', JSON.stringify(sampleData));
      
      // 在界面上显示数据导入成功的提示
      const dataPreview = document.querySelector('.data-preview');
      if (dataPreview) {
        const table = dataPreview.querySelector('table');
        if (table) {
          // 显示导入的数据
          let newTableHTML = `<h4>数据预览</h4><table>`;
          newTableHTML += `<thead><tr>${sampleData.headers.map(h => `<th>${h}</th>`).join('')}</tr></thead>`;
          newTableHTML += `<tbody>`;
          sampleData.data.slice(0, 5).forEach(row => {
            newTableHTML += `<tr>${row.map(cell => `<td>${cell}</td>`).join('')}</tr>`;
          });
          newTableHTML += `</tbody></table>`;
          newTableHTML += `<p style="margin-top: 10px; font-size: 12px; color: #999;">显示前 5 条，共 ${sampleData.data.length} 条</p>`;
          dataPreview.innerHTML = newTableHTML;
        }
      }
      
      alert('示例数据加载成功！\n数据包含：12个月的销售数据，共4列12行');
    } catch (error) {
      alert('数据加载失败：' + error.message);
      console.error('loadSampleData error:', error);
    }
  }

  bindChartEditEvents() {
    // 图表元素修改事件
    const chartContainer = document.getElementById('chart-container');
    if (chartContainer) {
      chartContainer.addEventListener('dblclick', (e) => {
        if (e.target.closest('.dashboard-chart')) {
          this.editChartElement(e.target.closest('.dashboard-chart'));
        }
      });
    }
  }

  importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target.result;
        // 简单处理CSV文件
        if (file.name.endsWith('.csv')) {
          const lines = content.split('\n');
          const headers = lines[0].split(',');
          const data = lines.slice(1).filter(line => line.trim()).map(line => line.split(','));
          alert(`成功导入数据：${headers.length}列，${data.length}行`);
          // 这里可以将数据存储起来供后续使用
          localStorage.setItem('importedData', JSON.stringify({ headers, data }));
        } else {
          alert('Excel文件处理功能正在开发中');
        }
      } catch (error) {
        alert('数据导入失败：' + error.message);
      }
    };
    reader.readAsText(file);
  }

  processData() {
    const importedData = localStorage.getItem('importedData');
    if (importedData) {
      const data = JSON.parse(importedData);
      // 简单的数据处理示例
      const processedData = {
        ...data,
        processedAt: new Date().toISOString()
      };
      alert('数据处理完成！');
      localStorage.setItem('processedData', JSON.stringify(processedData));
    } else {
      alert('请先导入数据');
    }
  }

  clearData() {
    if (confirm('确定要清空所有导入的数据吗？')) {
      localStorage.removeItem('importedData');
      localStorage.removeItem('processedData');
      alert('数据已清空');
    }
  }

  editChartElement(chartElement) {
    const chartTitle = chartElement.querySelector('h4').textContent;
    const newTitle = prompt('请输入新的图表标题：', chartTitle);
    if (newTitle) {
      chartElement.querySelector('h4').textContent = newTitle;
      alert('图表标题已更新');
    }
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

    if (task.isDashboard) {
      // 处理仪表盘任务
      html = `
        <div class="data-import-section">
          <h4>数据管理</h4>
          <div class="form-group">
          <label>导入数据</label>
          <input type="file" id="data-import" accept=".csv,.xlsx" style="width: 100%;">
          <small style="color: #999; display: block; margin-top: 5px;">支持CSV和Excel文件</small>
        </div>
        <div class="form-group">
          <button id="load-sample-data" class="secondary-btn" style="margin-right: 10px;">加载示例数据</button>
          <button id="process-data" class="secondary-btn" style="margin-right: 10px;">处理数据</button>
          <button id="clear-data" class="secondary-btn">清空数据</button>
        </div>
        </div>
        <hr style="margin: 20px 0; border: 1px solid #333;">
        <div class="dashboard-config">
          <h4>综合仪表盘配置</h4>
          <p>请配置以下子任务：</p>
          <div class="subtasks-container">
            ${task.subTasks.map((subTask, index) => `
              <div class="subtask-item">
                <h5>${index + 1}. ${subTask.name}</h5>
                <div class="subtask-form">
                  <div class="form-group">
                    <label>图表类型</label>
                    <select id="config-subtask-${index}-chartType">
                      <option value="bar">柱状图</option>
                      <option value="line">折线图</option>
                      <option value="pie">饼图</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>标题</label>
                    <input type="text" id="config-subtask-${index}-title" placeholder="请输入图表标题">
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="form-group">
            <label>布局风格</label>
            <select id="config-layout">
              <option value="grid">网格布局</option>
              <option value="vertical">垂直布局</option>
              <option value="horizontal">水平布局</option>
            </select>
          </div>
        </div>
      `;
    } else {
      // 为普通任务添加数据导入功能
      html += `
        <div class="data-import-section">
          <h4>数据管理</h4>
          <div class="form-group">
            <label>导入数据</label>
            <input type="file" id="data-import" accept=".csv,.xlsx" style="width: 100%;">
            <small style="color: #999; display: block; margin-top: 5px;">支持CSV和Excel文件</small>
          </div>
          <div class="form-group">
            <button id="load-sample-data" class="secondary-btn" style="margin-right: 10px;">加载示例数据</button>
            <button id="process-data" class="secondary-btn" style="margin-right: 10px;">处理数据</button>
            <button id="clear-data" class="secondary-btn">清空数据</button>
          </div>
        </div>
        <hr style="margin: 20px 0; border: 1px solid #333;">
      `;
      
      // 为普通任务添加图表配置
      if (task.configOptions && task.configOptions.chartTypes) {
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
      }
    }

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