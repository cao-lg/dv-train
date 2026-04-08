// 大屏管理模块
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
    this.renderDashboardLayout();
    this.setupAtmosphereEffects();
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
          <button id="save-layout" class="secondary-btn">保存布局</button>
          <button id="preview-dashboard" class="primary-btn">预览大屏</button>
        </div>
      </div>
      
      <div class="dashboard-grid">
        ${this.dashboardLayout.grid.map(item => `
          <div 
            class="dashboard-item" 
            data-id="${item.id}"
            style="grid-column: ${item.x + 1} / ${item.x + item.width + 1}; grid-row: ${item.y + 1} / ${item.y + item.height + 1};">
            <div class="dashboard-item-header">
              <span>图表 ${item.id.replace('chart', '')}</span>
              <div class="dashboard-item-controls">
                <button class="chart-select-btn">选择图表</button>
                <button class="remove-chart-btn">×</button>
              </div>
            </div>
            <div class="dashboard-item-content" data-chart-container="${item.id}">
              <p>点击选择图表</p>
            </div>
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

    this.bindDashboardEvents();
  }

  bindDashboardEvents() {
    // 主题选择
    document.getElementById('dashboard-theme').addEventListener('change', (e) => {
      this.dashboardLayout.theme = e.target.value;
      document.getElementById('dashboard-container').className = `dashboard-container ${e.target.value}`;
    });

    // 氛围效果
    document.getElementById('atmosphere-particles').addEventListener('change', (e) => {
      this.dashboardLayout.atmosphere.particles = e.target.checked;
      this.updateAtmosphereEffects();
    });

    document.getElementById('atmosphere-glow').addEventListener('change', (e) => {
      this.dashboardLayout.atmosphere.glow = e.target.checked;
      this.updateAtmosphereEffects();
    });

    document.getElementById('atmosphere-animated').addEventListener('change', (e) => {
      this.dashboardLayout.atmosphere.animated = e.target.checked;
      this.updateAtmosphereEffects();
    });

    // 选择图表
    document.querySelectorAll('.chart-select-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const item = e.target.closest('.dashboard-item');
        const chartId = item.dataset.id;
        this.showChartSelector(chartId);
      });
    });

    // 保存布局
    document.getElementById('save-layout').addEventListener('click', () => {
      this.saveDashboardLayout();
    });

    // 预览大屏
    document.getElementById('preview-dashboard').addEventListener('click', () => {
      this.previewDashboard();
    });
  }

  showChartSelector(chartId) {
    // 这里可以实现一个图表选择对话框
    // 允许学生选择要在该位置显示的图表类型
    alert(`选择图表类型 for ${chartId}`);
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
        colors: ['#00d4ff', '#ff00d4', '#00ff88', '#ffd700', '#ff6b6b', '#4ecdc4']
      },
      'neon-blue': {
        colors: ['#00ffff', '#0088ff', '#0044ff', '#00ffff', '#0088ff', '#0044ff']
      },
      'cyberpunk': {
        colors: ['#ff006e', '#00f5ff', '#ffff00', '#00ff00', '#bf00ff', '#ff6600']
      },
      'business-light': {
        colors: ['#1e40af', '#059669', '#d97706', '#7c3aed', '#db2777', '#0891b2']
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
    // 全屏预览大屏
    const preview = window.open('', '_blank', 'width=1920,height=1080');
    if (preview) {
      preview.document.write(`
        <!DOCTYPE html>
        <html lang="zh-CN">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>大屏预览</title>
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
          ${this.dashboardLayout.atmosphere.particles ? '<div class="particles-container"></div>' : ''}
          <div class="dashboard-container">
            ${this.dashboardLayout.grid.map(item => `
              <div 
                class="dashboard-item" 
                style="grid-column: ${item.x + 1} / ${item.x + item.width + 1}; grid-row: ${item.y + 1} / ${item.y + item.height + 1};">
                <div class="dashboard-item-header">图表 ${item.id.replace('chart', '')}</div>
                <div style="height: 80%; display: flex; align-items: center; justify-content: center;">
                  <p>图表内容</p>
                </div>
              </div>
            `).join('')}
          </div>
        </body>
        </html>
      `);
      preview.document.close();
    }
  }
}

window.DashboardManager = DashboardManager;