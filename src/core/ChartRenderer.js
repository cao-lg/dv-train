// 图表渲染模块
class ChartRenderer {
  constructor() {
    this.chartInstance = null;
  }

  renderChart(task, config) {
    const container = document.getElementById('chart-container');

    if (this.chartInstance) {
      this.chartInstance.dispose();
    }

    if (task.isDashboard) {
      // 渲染仪表盘
      this.renderDashboard(task, config);
    } else {
      // 渲染普通图表
      this.chartInstance = echarts.init(container);
      window.chartInstance = this.chartInstance;

      const option = this.buildChartOption(task, config);
      this.chartInstance.setOption(option);

      window.addEventListener('resize', () => {
        this.chartInstance.resize();
      });
    }
  }

  renderDashboard(task, config) {
    const container = document.getElementById('chart-container');
    
    // 确保config有subTasks
    if (!config.subTasks) {
      config.subTasks = [];
    }
    
    // 确保每个子任务都有配置
    task.subTasks.forEach((subTask, index) => {
      if (!config.subTasks[index]) {
        config.subTasks[index] = {
          chartType: subTask.answer.chartType,
          title: subTask.answer.title
        };
      }
    });
    
    container.innerHTML = `
      <div class="dashboard-preview" style="display: ${config.layout === 'grid' ? 'grid' : config.layout === 'vertical' ? 'flex' : 'flex'}; grid-template-columns: ${config.layout === 'grid' ? 'repeat(2, 1fr)' : '1fr'}; flex-direction: ${config.layout === 'vertical' ? 'column' : 'row'}; gap: 20px; height: 100%;">
        ${task.subTasks.map((subTask, index) => {
          const subConfig = config.subTasks[index];
          return `
            <div class="dashboard-chart" style="background: rgba(255,255,255,0.1); border-radius: 8px; padding: 15px; min-height: 300px;">
              <h4 style="margin-top: 0; color: #e0e0e0;">${subConfig.title || subTask.name}</h4>
              <div id="subchart-${index}" style="width: 100%; height: 250px;"></div>
            </div>
          `;
        }).join('')}
      </div>
    `;

    // 延迟渲染，确保DOM已准备好
    setTimeout(() => {
      task.subTasks.forEach((subTask, index) => {
        const subConfig = config.subTasks[index];
        const subChartContainer = document.getElementById(`subchart-${index}`);
        
        if (subChartContainer) {
          try {
            const subChart = echarts.init(subChartContainer);
            
            // 获取合适的数据
            let chartData = [];
            if (task.dataset.data) {
              if (Array.isArray(task.dataset.data)) {
                chartData = task.dataset.data;
              } else if (task.dataset.data.monthly && index === 0) {
                chartData = task.dataset.data.monthly;
              } else if (task.dataset.data.category && index === 1) {
                chartData = task.dataset.data.category;
              } else if (task.dataset.data.monthly && index === 2) {
                chartData = task.dataset.data.monthly;
              } else {
                chartData = [
                  ['1月', 12000, 3600],
                  ['2月', 15000, 4500],
                  ['3月', 18000, 5400],
                  ['4月', 16000, 4800],
                  ['5月', 22000, 6600],
                  ['6月', 28000, 8400]
                ];
              }
            }
            
            // 构建简单可靠的图表选项
            const chartType = subConfig.chartType || 'bar';
            const option = {
              backgroundColor: 'rgba(0,0,0,0.3)',
              title: {
                text: subConfig.title || subTask.name,
                textStyle: { color: '#e0e0e0' }
              },
              tooltip: {
                trigger: chartType === 'pie' ? 'item' : 'axis'
              },
              xAxis: chartType !== 'pie' ? {
                type: 'category',
                data: chartData.map(row => row[0]),
                axisLabel: { color: '#e0e0e0' }
              } : undefined,
              yAxis: chartType !== 'pie' ? {
                type: 'value',
                axisLabel: { color: '#e0e0e0' }
              } : undefined,
              series: [{
                type: chartType,
                data: chartType === 'pie' 
                  ? chartData.map((row, i) => ({ name: row[0], value: row[1] }))
                  : chartData.map(row => row[1])
              }]
            };
            
            subChart.setOption(option);
          } catch (error) {
            console.error('图表渲染错误:', error);
          }
        }
      });
    }, 200);
  }

  getThemeColors(theme) {
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

  buildChartOption(task, config) {
    const dataset = task.dataset;
    const theme = this.getThemeColors(config.theme || task.theme);

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

  getChartInstance() {
    return this.chartInstance;
  }
}

window.ChartRenderer = ChartRenderer;