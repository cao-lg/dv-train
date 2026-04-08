// 大屏管理模块 - 版本1.2
class DashboardManager {
  constructor() {
    this.dashboardLayout = {
      grid: [
        { id: 'chart1', x: 0, y: 0, width: 6, height: 4 },
        { id: 'chart2', x: 6, y: 0, width: 6, height: 4 },
        { id: 'chart3', x: 0, y: 4, width: 4, height: 4 },
        { id: 'chart4', x: 4, y: 4, width: 4, height: 4 },
        { id: 'chart5', x: 8, y: 4, width: 4, height: 4 }
      ],
      theme: 'tech-dark',
      atmosphere: {
        particles: true,
        glow: true,
        animated: true
      }
    };
  }

  initializeDashboard() {
    try {
      this.renderDashboardLayout();
      this.bindDashboardEvents();
      this.setupAtmosphereEffects();
    } catch (error) {
      console.error('初始化大屏出错:', error);
      alert('初始化大屏时出错，请刷新页面重试');
    }
  }

  renderDashboardLayout() {
    const container = document.getElementById('dashboard-container');
    if (!container) return;

    container.className = `dashboard-container ${this.dashboardLayout.theme}`;
    container.innerHTML = `
      <div class="dashboard-header">
          <h2>炫酷大屏布局</h2>
          <div class="dashboard-controls">
            <select id="dashboard-theme">
              <option value="tech-dark">科技暗黑风</option>
              <option value="neon-blue">霓虹蓝光</option>
              <option value="cyberpunk">赛博朋克</option>
              <option value="business-light">轻奢商务风</option>
            </select>
            <button id="load-sample-dashboard" class="secondary-btn">加载示例大屏</button>
            <button id="save-layout" class="secondary-btn">保存布局</button>
            <button id="preview-dashboard" class="primary-btn">预览大屏</button>
          </div>
        </div>
      
      <div class="dashboard-grid" style="display: grid; grid-template-columns: repeat(12, 1fr); grid-template-rows: repeat(8, 1fr); gap: 20px; height: 70vh; margin: 20px 0;">
        ${this.dashboardLayout.grid.map(item => `
          <div 
            class="dashboard-item" 
            data-id="${item.id}"
            style="grid-column: ${item.x + 1} / ${item.x + item.width + 1}; grid-row: ${item.y + 1} / ${item.y + item.height + 1}; background: rgba(255,255,255,0.1); border-radius: 8px; padding: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.3);">
            <div class="dashboard-item-header" style="font-weight: bold; margin-bottom: 10px; color: #e0e0e0; display: flex; justify-content: space-between; align-items: center;">
              <span>${this.dashboardLayout.charts?.[item.id]?.title || `图表 ${item.id.replace('chart', '')}`}</span>
              <div class="dashboard-item-controls">
                <button class="chart-select-btn" style="margin-right: 10px; padding: 4px 8px; background: #667eea; color: white; border: none; border-radius: 4px; cursor: pointer;">选择图表</button>
                <button class="remove-chart-btn" style="padding: 4px 8px; background: #ef4444; color: white; border: none; border-radius: 4px; cursor: pointer;">×</button>
              </div>
            </div>
            <div class="dashboard-item-content" data-chart-container="${item.id}" style="width: 100%; height: calc(100% - 40px);"></div>
          </div>
        `).join('')}
      </div>
      
      <div class="dashboard-atmosphere">
        <h3>氛围效果</h3>
        <div class="atmosphere-controls">
          <label><input type="checkbox" id="atmosphere-particles" ${this.dashboardLayout.atmosphere.particles ? 'checked' : ''}> 粒子效果</label>
          <label><input type="checkbox" id="atmosphere-glow" ${this.dashboardLayout.atmosphere.glow ? 'checked' : ''}> 发光效果</label>
          <label><input type="checkbox" id="atmosphere-animated" ${this.dashboardLayout.atmosphere.animated ? 'checked' : ''}> 动画效果</label>
        </div>
      </div>
    `;
  }

  bindDashboardEvents() {
    try {
      // 主题选择
      const themeEl = document.getElementById('dashboard-theme');
      if (themeEl) {
        themeEl.addEventListener('change', (e) => {
          this.dashboardLayout.theme = e.target.value;
          const container = document.getElementById('dashboard-container');
          if (container) {
            container.className = `dashboard-container ${e.target.value}`;
          }
        });
      }

      // 加载示例大屏
      const loadSampleEl = document.getElementById('load-sample-dashboard');
      if (loadSampleEl) {
        loadSampleEl.addEventListener('click', () => {
          this.loadSampleDashboard();
        });
      }

      // 氛围效果
      const particlesEl = document.getElementById('atmosphere-particles');
      if (particlesEl) {
        particlesEl.addEventListener('change', (e) => {
          this.dashboardLayout.atmosphere.particles = e.target.checked;
          this.updateAtmosphereEffects();
        });
      }

      const glowEl = document.getElementById('atmosphere-glow');
      if (glowEl) {
        glowEl.addEventListener('change', (e) => {
          this.dashboardLayout.atmosphere.glow = e.target.checked;
          this.updateAtmosphereEffects();
        });
      }

      const animatedEl = document.getElementById('atmosphere-animated');
      if (animatedEl) {
        animatedEl.addEventListener('change', (e) => {
          this.dashboardLayout.atmosphere.animated = e.target.checked;
          this.updateAtmosphereEffects();
        });
      }

      // 选择图表
      document.querySelectorAll('.chart-select-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const item = e.target.closest('.dashboard-item');
          if (item) {
            const chartId = item.dataset.id;
            this.showChartSelector(chartId);
          }
        });
      });

      // 保存布局
      const saveEl = document.getElementById('save-layout');
      if (saveEl) {
        saveEl.addEventListener('click', () => {
          this.saveDashboardLayout();
        });
      }

      // 预览大屏
      const previewEl = document.getElementById('preview-dashboard');
      if (previewEl) {
        previewEl.addEventListener('click', () => {
          this.previewDashboard();
        });
      }

      // 双击编辑图表
      const gridEl = document.querySelector('.dashboard-grid');
      if (gridEl) {
        gridEl.addEventListener('dblclick', (e) => {
          const item = e.target.closest('.dashboard-item');
          if (item) {
            this.editDashboardItem(item);
          }
        });
      }
    } catch (error) {
      console.error('绑定大屏事件出错:', error);
    }
  }

  loadSampleDashboard() {
    try {
      // 示例大屏布局
      this.dashboardLayout = {
        grid: [
          { id: 'chart1', x: 0, y: 0, width: 6, height: 4 },
          { id: 'chart2', x: 6, y: 0, width: 6, height: 4 },
          { id: 'chart3', x: 0, y: 4, width: 4, height: 4 },
          { id: 'chart4', x: 4, y: 4, width: 4, height: 4 },
          { id: 'chart5', x: 8, y: 4, width: 4, height: 4 }
        ],
        theme: 'tech-dark',
        atmosphere: {
          particles: true,
          glow: true,
          animated: true
        },
        charts: {
          chart1: {
            type: 'bar',
            title: '月度销售额',
            data: [12000, 15000, 18000, 16000, 22000, 28000]
          },
          chart2: {
            type: 'pie',
            title: '产品占比',
            data: [450000, 320000, 280000, 180000]
          },
          chart3: {
            type: 'line',
            title: '利润趋势',
            data: [3600, 4500, 5400, 4800, 6600, 8400]
          },
          chart4: {
            type: 'funnel',
            title: '转化漏斗',
            data: [85600, 52300, 15800, 4250, 2740]
          },
          chart5: {
            type: 'bar',
            title: '门店销售',
            data: [280000, 320000, 250000, 290000, 210000]
          }
        }
      };
      
      this.renderDashboardLayout();
      this.bindDashboardEvents();
      this.setupAtmosphereEffects();
      
      // 延迟渲染示例图表
      setTimeout(() => {
        this.renderSampleCharts();
      }, 300);
      
      alert('示例大屏加载成功！');
    } catch (error) {
      console.error('加载示例大屏出错:', error);
      alert('加载示例大屏时出错：' + error.message);
    }
  }

  renderSampleCharts() {
    try {
      this.dashboardLayout.grid.forEach(item => {
        const chartInfo = this.dashboardLayout.charts[item.id];
        if (chartInfo) {
          const container = document.querySelector(`[data-id="${item.id}"] .dashboard-item-content`) || 
                            document.getElementById(`chart-${item.id}`);
          if (container) {
            const chart = echarts.init(container);
            const option = {
              backgroundColor: 'rgba(0,0,0,0.3)',
              title: {
                text: chartInfo.title,
                textStyle: { color: '#e0e0e0' }
              },
              tooltip: {
                trigger: chartInfo.type === 'pie' ? 'item' : 'axis'
              },
              xAxis: chartInfo.type !== 'pie' ? {
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月'],
                axisLabel: { color: '#e0e0e0' }
              } : undefined,
              yAxis: chartInfo.type !== 'pie' ? {
                type: 'value',
                axisLabel: { color: '#e0e0e0' }
              } : undefined,
              series: [{
                type: chartInfo.type,
                data: chartInfo.type === 'pie' 
                  ? chartInfo.data.map((v, i) => ({ name: `数据${i+1}`, value: v }))
                  : chartInfo.data
              }]
            };
            chart.setOption(option);
          }
        }
      });
    } catch (error) {
      console.error('渲染示例图表出错:', error);
    }
  }

  editDashboardItem(item) {
    const chartId = item.dataset.id;
    const chartInfo = this.dashboardLayout.charts?.[chartId];
    
    const newTitle = prompt('请输入图表标题：', chartInfo?.title || `图表 ${chartId}`);
    if (newTitle) {
      if (!this.dashboardLayout.charts) {
        this.dashboardLayout.charts = {};
      }
      if (!this.dashboardLayout.charts[chartId]) {
        this.dashboardLayout.charts[chartId] = {};
      }
      this.dashboardLayout.charts[chartId].title = newTitle;
      
      // 更新UI
      const titleElement = item.querySelector('.dashboard-item-header span');
      if (titleElement) {
        titleElement.textContent = newTitle;
      }
      
      alert('图表标题已更新！');
    }
  }

  showChartSelector(chartId) {
    // 创建图表选择对话框
    const dialog = document.createElement('div');
    dialog.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
    `;
    
    const dialogContent = document.createElement('div');
    dialogContent.style.cssText = `
      background: #1a1a2e;
      border-radius: 10px;
      padding: 30px;
      width: 400px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
    `;
    
    dialogContent.innerHTML = `
      <h3 style="color: #e0e0e0; margin-top: 0;">选择图表类型</h3>
      <div style="margin: 20px 0;">
        <label style="display: block; color: #e0e0e0; margin-bottom: 10px;">图表类型</label>
        <select id="chart-type-select" style="width: 100%; padding: 10px; border: 1px solid #333; border-radius: 4px; background: #2a2a3e; color: #e0e0e0;">
          <option value="bar">柱状图</option>
          <option value="line">折线图</option>
          <option value="pie">饼图</option>
          <option value="funnel">漏斗图</option>
        </select>
      </div>
      <div style="margin: 20px 0;">
        <label style="display: block; color: #e0e0e0; margin-bottom: 10px;">图表标题</label>
        <input type="text" id="chart-title-input" placeholder="请输入图表标题" style="width: 100%; padding: 10px; border: 1px solid #333; border-radius: 4px; background: #2a2a3e; color: #e0e0e0;">
      </div>
      <div style="margin: 20px 0;">
        <label style="display: block; color: #e0e0e0; margin-bottom: 10px;">
          <input type="checkbox" id="chart-dynamic" style="margin-right: 8px;"> 启用动态数据
        </label>
        <small style="color: #999; display: block; margin-top: 5px;">数据将随时间自动变化</small>
      </div>
      <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
        <button id="cancel-btn" style="padding: 10px 20px; border: 1px solid #666; border-radius: 4px; background: #333; color: #e0e0e0; cursor: pointer;">取消</button>
        <button id="confirm-btn" style="padding: 10px 20px; border: none; border-radius: 4px; background: #667eea; color: white; cursor: pointer;">确定</button>
      </div>
    `;
    
    dialog.appendChild(dialogContent);
    document.body.appendChild(dialog);
    
    // 获取现有图表配置
    const existingChart = this.dashboardLayout.charts?.[chartId];
    if (existingChart) {
      document.getElementById('chart-type-select').value = existingChart.type || 'bar';
      document.getElementById('chart-title-input').value = existingChart.title || '';
    }
    
    // 绑定事件
    document.getElementById('cancel-btn').addEventListener('click', () => {
      document.body.removeChild(dialog);
    });
    
    document.getElementById('confirm-btn').addEventListener('click', () => {
      const chartType = document.getElementById('chart-type-select').value;
      const chartTitle = document.getElementById('chart-title-input').value;
      const isDynamic = document.getElementById('chart-dynamic').checked;
      
      // 更新图表配置
      if (!this.dashboardLayout.charts) {
        this.dashboardLayout.charts = {};
      }
      
      this.dashboardLayout.charts[chartId] = {
        type: chartType,
        title: chartTitle || `图表 ${chartId.replace('chart', '')}`,
        data: this.getDefaultChartData(chartType),
        dynamic: isDynamic
      };
      
      // 重新渲染图表
      this.renderSingleChart(chartId);
      
      // 更新标题
      const item = document.querySelector(`[data-id="${chartId}"]`);
      if (item) {
        const titleElement = item.querySelector('.dashboard-item-header span');
        if (titleElement) {
          titleElement.textContent = this.dashboardLayout.charts[chartId].title + (isDynamic ? ' (动态)' : '');
        }
      }
      
      document.body.removeChild(dialog);
      alert('图表配置已更新！');
    });
  }

  getDefaultChartData(chartType) {
    switch (chartType) {
      case 'bar':
      case 'line':
        return [12000, 15000, 18000, 16000, 22000, 28000];
      case 'pie':
        return [450000, 320000, 280000, 180000];
      case 'funnel':
        return [85600, 52300, 15800, 4250, 2740];
      default:
        return [120, 200, 150, 80, 70, 110, 130];
    }
  }

  renderSingleChart(chartId) {
    try {
      const chartInfo = this.dashboardLayout.charts?.[chartId];
      if (!chartInfo) return;
      
      const container = document.querySelector(`[data-id="${chartId}"] .dashboard-item-content`);
      if (!container) return;
      
      const chart = echarts.init(container);
      const chartType = chartInfo.type || 'bar';
      
      // 生成初始数据
      let data = chartInfo.data || this.getDefaultChartData(chartType);
      
      const themeColors = this.getThemeColors(this.dashboardLayout.theme);
      const option = {
        backgroundColor: 'rgba(0,0,0,0.3)',
        title: {
          text: chartInfo.title,
          textStyle: { color: themeColors.text || '#e0e0e0' }
        },
        tooltip: {
          trigger: chartType === 'pie' ? 'item' : 'axis'
        },
        xAxis: chartType !== 'pie' ? {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月'],
          axisLabel: { color: themeColors.text || '#e0e0e0' }
        } : undefined,
        yAxis: chartType !== 'pie' ? {
          type: 'value',
          axisLabel: { color: themeColors.text || '#e0e0e0' }
        } : undefined,
        series: [{
          type: chartType,
          data: chartType === 'pie' 
            ? data.map((v, i) => ({ name: `数据${i+1}`, value: v }))
            : data,
          itemStyle: {
            color: function(params) {
              return themeColors.colors[params.dataIndex % themeColors.colors.length];
            }
          }
        }]
      };
      
      chart.setOption(option);
      
      // 启用动态数据
      if (chartInfo.dynamic) {
        // 清除之前的定时器
        if (window.dynamicChartTimers) {
          clearInterval(window.dynamicChartTimers[chartId]);
        }
        
        if (!window.dynamicChartTimers) {
          window.dynamicChartTimers = {};
        }
        
        // 设置新的定时器，每2秒更新一次数据
        window.dynamicChartTimers[chartId] = setInterval(() => {
          try {
            // 生成新的随机数据
            if (chartType === 'pie' || chartType === 'funnel') {
              // 饼图和漏斗图：保持总和不变，随机分配
              const total = data.reduce((sum, v) => sum + v, 0);
              const newData = [];
              let remaining = total;
              
              for (let i = 0; i < data.length - 1; i++) {
                const value = Math.floor(Math.random() * remaining * 0.8);
                newData.push(value);
                remaining -= value;
              }
              newData.push(remaining);
              data = newData;
            } else {
              // 柱状图和折线图：随机波动
              data = data.map(value => {
                const change = value * 0.2 * (Math.random() - 0.5);
                return Math.max(0, Math.floor(value + change));
              });
            }
            
            // 更新图表数据
            chart.setOption({
              series: [{
                data: chartType === 'pie' 
                  ? data.map((v, i) => ({ name: `数据${i+1}`, value: v }))
                  : data
              }]
            });
          } catch (error) {
            console.error('更新动态数据出错:', error);
          }
        }, 2000);
      } else {
        // 禁用动态数据时清除定时器
        if (window.dynamicChartTimers) {
          clearInterval(window.dynamicChartTimers[chartId]);
        }
      }
    } catch (error) {
      console.error('渲染单个图表出错:', error);
    }
  }

  setupAtmosphereEffects() {
    this.updateAtmosphereEffects();
  }

  updateAtmosphereEffects() {
    const container = document.getElementById('dashboard-container');
    if (!container) return;

    // 清除现有的效果
    container.style.filter = '';
    container.style.animation = '';

    // 应用发光效果
    if (this.dashboardLayout.atmosphere.glow) {
      container.style.filter = 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.5))';
    }

    // 应用动画效果
    if (this.dashboardLayout.atmosphere.animated) {
      container.style.animation = 'pulse 3s infinite';
    }

    // 应用粒子效果
    if (this.dashboardLayout.atmosphere.particles) {
      this.createParticles();
    }
  }

  createParticles() {
    // 简单的粒子效果实现
    const container = document.getElementById('dashboard-container');
    if (!container) return;

    // 清除现有的粒子
    const existingParticles = container.querySelector('.particles-container');
    if (existingParticles) {
      existingParticles.remove();
    }

    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    container.appendChild(particlesContainer);

    // 创建粒子
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: absolute;
        width: ${Math.random() * 3 + 1}px;
        height: ${Math.random() * 3 + 1}px;
        background: ${this.getThemeColors(this.dashboardLayout.theme).colors[Math.floor(Math.random() * 6)]};
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float ${Math.random() * 10 + 5}s infinite ease-in-out;
        animation-delay: ${Math.random() * 5}s;
        opacity: ${Math.random() * 0.5 + 0.3};
      `;
      particlesContainer.appendChild(particle);
    }
  }

  getThemeColors(theme) {
    const themes = {
      'tech-dark': {
        colors: ['#00d4ff', '#ff00d4', '#00ff88', '#ffd700', '#ff6b6b', '#4ecdc4'],
        bg: '#0a0a1a',
        text: '#e0e0e0'
      },
      'neon-blue': {
        colors: ['#00ffff', '#0088ff', '#0044ff', '#00ffff', '#0088ff', '#0044ff'],
        bg: '#000a1a',
        text: '#00ffff'
      },
      'cyberpunk': {
        colors: ['#ff006e', '#00f5ff', '#ffff00', '#00ff00', '#bf00ff', '#ff6600'],
        bg: '#1a001a',
        text: '#ff006e'
      },
      'business-light': {
        colors: ['#1e40af', '#059669', '#d97706', '#7c3aed', '#db2777', '#0891b2'],
        bg: '#f8fafc',
        text: '#1e293b'
      }
    };
    return themes[theme] || themes['tech-dark'];
  }

  saveDashboardLayout() {
    localStorage.setItem('dashboardLayout', JSON.stringify(this.dashboardLayout));
    alert('布局已保存！');
  }

  loadDashboardLayout() {
    const saved = localStorage.getItem('dashboardLayout');
    if (saved) {
      this.dashboardLayout = JSON.parse(saved);
    }
  }

  previewDashboard() {
    try {
      // 尝试打开预览窗口
      const preview = window.open('', '_blank', 'width=1920,height=1080,menubar=no,toolbar=no,location=yes,scrollbars=yes');
      
      if (preview) {
        // 等待窗口加载
        preview.onload = function() {
          // 防止弹出窗口被阻止
          if (preview.closed) {
            alert('预览窗口被阻止，请检查浏览器设置并允许弹出窗口');
            return;
          }
        };
        
        const chartContents = this.dashboardLayout.grid.map(item => {
          const chartInfo = this.dashboardLayout.charts?.[item.id];
          const title = chartInfo?.title || `图表 ${item.id.replace('chart', '')}`;
          
          return `
            <div 
              class="dashboard-item" 
              style="grid-column: ${item.x + 1} / ${item.x + item.width + 1}; grid-row: ${item.y + 1} / ${item.y + item.height + 1};">
              <div class="dashboard-item-header" style="color: ${this.getThemeColors(this.dashboardLayout.theme).text || '#e0e0e0'};">${title}</div>
              <div id="chart-${item.id}" style="width: 100%; height: calc(100% - 40px);"></div>
            </div>
          `;
        }).join('');
        
        const chartScripts = this.dashboardLayout.grid.map(item => {
          const chartInfo = this.dashboardLayout.charts?.[item.id];
          const chartType = chartInfo?.type || 'bar';
          const data = chartInfo?.data || [120, 200, 150, 80, 70, 110, 130];
          const isDynamic = chartInfo?.dynamic || false;
          
          return `
            try {
              const chart${item.id} = echarts.init(document.getElementById('chart-${item.id}'));
              let data${item.id} = ${JSON.stringify(data)};
              const chartType${item.id} = '${chartType}';
              
              const option${item.id} = {
                backgroundColor: 'rgba(0,0,0,0.3)',
                title: {
                  text: '${chartInfo?.title || `图表 ${item.id.replace('chart', '')}`}' + ${isDynamic ? "' (动态)'" : "''"},
                  textStyle: { color: '${this.getThemeColors(this.dashboardLayout.theme).text || '#e0e0e0'}' }
                },
                tooltip: {
                  trigger: '${chartType === "pie" ? "item" : "axis"}'
                },
                xAxis: ${chartType !== 'pie' ? `{
                  type: 'category',
                  data: ['1月', '2月', '3月', '4月', '5月', '6月'],
                  axisLabel: { color: '${this.getThemeColors(this.dashboardLayout.theme).text || '#e0e0e0'}' }
                }` : 'undefined'},
                yAxis: ${chartType !== 'pie' ? `{
                  type: 'value',
                  axisLabel: { color: '${this.getThemeColors(this.dashboardLayout.theme).text || '#e0e0e0'}' }
                }` : 'undefined'},
                series: [{
                  type: '${chartType}',
                  data: ${JSON.stringify(chartType === 'pie' ? data.map((v, i) => ({ name: `数据${i+1}`, value: v })) : data)},
                  itemStyle: {
                    color: function(params) {
                      const colors = ${JSON.stringify(this.getThemeColors(this.dashboardLayout.theme).colors)};
                      return colors[params.dataIndex % colors.length];
                    }
                  }
                }]
              };
              chart${item.id}.setOption(option${item.id});
              
              ${isDynamic ? `
              // 动态数据更新
              setInterval(() => {
                try {
                  if (chartType${item.id} === 'pie' || chartType${item.id} === 'funnel') {
                    // 饼图和漏斗图：保持总和不变，随机分配
                    const total = data${item.id}.reduce((sum, v) => sum + v, 0);
                    const newData = [];
                    let remaining = total;
                    
                    for (let i = 0; i < data${item.id}.length - 1; i++) {
                      const value = Math.floor(Math.random() * remaining * 0.8);
                      newData.push(value);
                      remaining -= value;
                    }
                    newData.push(remaining);
                    data${item.id} = newData;
                  } else {
                    // 柱状图和折线图：随机波动
                    data${item.id} = data${item.id}.map(value => {
                      const change = value * 0.2 * (Math.random() - 0.5);
                      return Math.max(0, Math.floor(value + change));
                    });
                  }
                  
                  chart${item.id}.setOption({
                    series: [{
                      data: chartType${item.id} === 'pie' 
                        ? data${item.id}.map((v, i) => ({ name: '数据' + (i+1), value: v }))
                        : data${item.id}
                    }]
                  });
                } catch (error) {
                  console.error('更新动态数据出错:', error);
                }
              }, 2000);
              ` : ''}
            } catch (error) {
              console.error('图表渲染错误:', error);
            }
          `;
        }).join('');
        
        const particlesHTML = this.dashboardLayout.atmosphere.particles ? `
          <div class="particles-container">
            ${Array.from({length: 50}).map((_, i) => `
              <div class="particle" style="
                width: ${Math.random() * 3 + 1}px;
                height: ${Math.random() * 3 + 1}px;
                background: ${this.getThemeColors(this.dashboardLayout.theme).colors[Math.floor(Math.random() * 6)]};
                border-radius: 50%;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 5}s infinite ease-in-out;
                animation-delay: ${Math.random() * 5}s;
                opacity: ${Math.random() * 0.5 + 0.3};
              "></div>
            `).join('')}
          </div>
        ` : '';
        
        preview.document.write(`
          <!DOCTYPE html>
          <html lang="zh-CN">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>大屏预览</title>
            <script src="https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js"></script>
            <style>
              body {
                margin: 0;
                padding: 0;
                background: ${this.getThemeColors(this.dashboardLayout.theme).bg || '#0a0a1a'};
                color: ${this.getThemeColors(this.dashboardLayout.theme).text || '#e0e0e0'};
                font-family: Arial, sans-serif;
                overflow: hidden;
              }
              .dashboard-container {
                width: 100vw;
                height: 100vh;
                display: grid;
                grid-template-columns: repeat(12, 1fr);
                grid-template-rows: repeat(8, 1fr);
                gap: 20px;
                padding: 20px;
                box-sizing: border-box;
              }
              .dashboard-item {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 15px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
              }
              .dashboard-item-header {
                font-weight: bold;
                margin-bottom: 10px;
                color: #e0e0e0;
              }
              ${this.dashboardLayout.atmosphere.glow ? 'body { filter: drop-shadow(0 0 10px rgba(0, 255, 255, 0.5)); }' : ''}
              ${this.dashboardLayout.atmosphere.animated ? 'body { animation: pulse 3s infinite; } @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.9; } }' : ''}
              .particles-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
              }
              .particle {
                position: absolute;
                border-radius: 50%;
                animation: float 10s infinite ease-in-out;
              }
              @keyframes float {
                0%, 100% { transform: translateY(0px) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(180deg); }
              }
            </style>
          </head>
          <body>
            ${particlesHTML}
            <div class="dashboard-container">
              ${chartContents}
            </div>
            <script>
              ${chartScripts}
              window.addEventListener('resize', function() {
                ${this.dashboardLayout.grid.map(item => `try { chart${item.id}.resize(); } catch (e) {}`).join('')}
              });
            </script>
          </body>
          </html>
        `);
        preview.document.close();
      } else {
        alert('无法打开预览窗口，请检查浏览器是否阻止了弹出窗口');
      }
    } catch (error) {
      console.error('预览失败:', error);
      alert('预览失败：' + error.message);
    }
  }
}

window.DashboardManager = DashboardManager;