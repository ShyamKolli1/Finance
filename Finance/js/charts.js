// Chart creation utilities

let chartInstances = {};

function destroyChart(name) {
  if (chartInstances[name]) {
    chartInstances[name].destroy();
    chartInstances[name] = null;
  }
}

function createIncomeExpenseChart(containerId, totalIncome, totalExpense) {
  const ctx = document.getElementById(containerId)?.getContext('2d');
  if (!ctx) return;
  
  destroyChart(containerId);
  
  chartInstances[containerId] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Income', 'Expense'],
      datasets: [{
        label: 'Amount ($)',
        data: [totalIncome, totalExpense],
        backgroundColor: ['#f093fb', '#4facfe'],
        borderColor: ['#f5576c', '#00f2fe'],
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true } },
      scales: { y: { beginAtZero: true, ticks: { callback: (v) => '$' + v.toFixed(0) } } }
    }
  });
}

function createDoughnutChart(containerId, labels, data, title = '') {
  const ctx = document.getElementById(containerId)?.getContext('2d');
  if (!ctx || labels.length === 0) return;
  
  destroyChart(containerId);
  
  chartInstances[containerId] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: chartColors.slice(0, labels.length),
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { position: 'right' } }
    }
  });
}

function createStackedBarChart(containerId, labels, dataset1, dataset2, label1 = 'Income', label2 = 'Expense') {
  const ctx = document.getElementById(containerId)?.getContext('2d');
  if (!ctx) return;
  
  destroyChart(containerId);
  
  chartInstances[containerId] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: label1,
          data: dataset1,
          backgroundColor: '#f093fb',
          borderColor: '#f5576c',
          borderWidth: 1
        },
        {
          label: label2,
          data: dataset2,
          backgroundColor: '#4facfe',
          borderColor: '#00f2fe',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: true } },
      scales: { y: { beginAtZero: true, ticks: { callback: (v) => '$' + v.toFixed(0) } } }
    }
  });
}

function zoomChart(fromCanvasId, title) {
  const modal = document.getElementById('zoomModal');
  if (!modal) return;
  
  document.getElementById('zoomTitle').textContent = title;
  
  const originalCanvas = document.getElementById(fromCanvasId);
  if (!originalCanvas) return;
  
  // Find chart instance
  const chart = Chart.instances?.find(c => c.canvas === originalCanvas);
  if (!chart) return;
  
  const zoomCanvas = document.getElementById('zoomChartCanvas');
  const ctx = zoomCanvas.getContext('2d');
  
  destroyChart('zoom');
  
  chartInstances['zoom'] = new Chart(ctx, {
    type: chart.config.type,
    data: JSON.parse(JSON.stringify(chart.data)),
    options: JSON.parse(JSON.stringify(chart.options))
  });
  
  modal.classList.add('show');
}

function closeZoom() {
  const modal = document.getElementById('zoomModal');
  if (modal) modal.classList.remove('show');
  destroyChart('zoom');
}
