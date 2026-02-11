// Utility functions for Finance Tracker

function normalizeAccount(acc) {
  return (acc || '').toString().replace(/[^\x00-\x7F]/g, '').trim();
}

function getMonthKey(dateStr) {
  const [month, day, year] = dateStr.split('/');
  return year + '-' + String(month).padStart(2, '0');
}

function getCurrentMonthKey() {
  const now = new Date();
  return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
}

function formatCurrency(amount) {
  return '$' + parseFloat(amount).toFixed(2);
}

function formatMonthName(monthKey) {
  const [year, month] = monthKey.split('-');
  return new Date(year, parseInt(month) - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
}

function getMonthlyTransactions(transactions, monthKey) {
  return transactions.filter(t => getMonthKey(t.date) === monthKey);
}

function calculateMonthStats(transactions, monthKey) {
  const monthTx = getMonthlyTransactions(transactions, monthKey);
  let income = 0, expense = 0;
  
  monthTx.forEach(t => {
    const amt = parseFloat(t.amount);
    if (t.type === 'income') income += amt;
    else if (t.type === 'expense') expense += amt;
  });
  
  return { income, expense, net: income - expense, count: monthTx.length };
}

function getUniqueMonths(transactions) {
  const months = new Set();
  transactions.forEach(t => months.add(getMonthKey(t.date)));
  return Array.from(months).sort().reverse();
}

function getUniqueLabelsByType(transactions, type = null) {
  const labels = new Set();
  transactions.forEach(t => {
    if (!type || t.type === type) {
      labels.add(t.label);
    }
  });
  return Array.from(labels).sort();
}

function getAccountBreakdown(transactions) {
  let cashIncome = 0, cashExpense = 0, bankIncome = 0, bankExpense = 0;
  
  transactions.forEach(t => {
    const amount = parseFloat(t.amount);
    const account = normalizeAccount(t.account);
    const isCash = /cash/i.test(account);
    
    if (t.type === 'income') {
      if (isCash) cashIncome += amount;
      else bankIncome += amount;
    } else if (t.type === 'expense') {
      if (isCash) cashExpense += amount;
      else bankExpense += amount;
    }
  });
  
  return { cashIncome, cashExpense, bankIncome, bankExpense };
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(
    () => alert('Copied to clipboard!'),
    (err) => alert('Failed to copy: ' + err)
  );
}

function showAlert(message, type = 'info') {
  const alertDiv = document.createElement('div');
  alertDiv.className = 'alert alert-' + type;
  alertDiv.textContent = message;
  document.body.insertBefore(alertDiv, document.body.firstChild);
  
  setTimeout(() => alertDiv.remove(), 3000);
}

// Color palette for charts
const chartColors = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
  '#FF9F40', '#FF6384', '#C9CBCF', '#4BC0C0', '#FF6384'
];
