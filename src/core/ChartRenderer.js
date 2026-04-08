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

    this.chartInstance = echarts.init(container);
    window.chartInstance = this.chartInstance;

    const option = this.buildChartOption(task, config);
    this.chartInstance.setOption(option);

    window.addEventListener('resize', () => {
      this.chartInstance.resize();
    });
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