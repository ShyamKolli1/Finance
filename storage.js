// Shared storage and defaults for Finance Tracker
var defaultLabels = {
  expense: ["Rent", "Food", "Groceries / Daily", "Energy Bill", "Credit Card", "Rides", "Subscriptions", "Curry Leaves", "Omis Liquor", "Misc", "Other"],
  income: ["Salary", "Bonus", "Refund", "Gift", "Other Income"],
  transfer: ["Bank Transfer", "Cash Transfer", "Other Transfer"],
  saving: ["Emergency Fund", "Investment", "Savings", "Other Saving"],
  debt: ["Personal Loan", "Friend", "Family", "Business", "Other Debt"],
  owe: ["Lent to Friend", "Lent to Family", "Business Receivable", "Other Receivable"]
};

// Global data and label map (shared)
var data = [];
var labelMap = {};

function parseJsonSafe(raw, fallback) {
  try {
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}

function normalizeLabels(rawLabels) {
  const source = rawLabels && typeof rawLabels === 'object' ? rawLabels : {};
  const normalized = {};

  Object.keys(defaultLabels).forEach((key) => {
    const incoming = source[key];
    normalized[key] = Array.isArray(incoming) ? incoming.slice() : defaultLabels[key].slice();
  });

  return normalized;
}

function loadData() {
  const storedData = parseJsonSafe(localStorage.getItem("financeData"), []);
  const storedLabels = parseJsonSafe(localStorage.getItem("financeLabels"), {});
  const normalizedLabels = normalizeLabels(storedLabels);

  data.length = 0;
  if (Array.isArray(storedData)) {
    data.push(...storedData);
  }

  Object.keys(labelMap).forEach((key) => delete labelMap[key]);
  Object.keys(normalizedLabels).forEach((key) => {
    labelMap[key] = normalizedLabels[key];
  });

  window.data = data;
  window.labelMap = labelMap;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

loadData();

function saveData() {
  localStorage.setItem("financeData", JSON.stringify(data));
  // keep window.data in sync and log for debugging
  try { window.data = data; } catch(e) {}
  console.log('storage.js: saveData called, items=', data.length);
}

function saveLabelMap() {
  localStorage.setItem("financeLabels", JSON.stringify(labelMap));
  try { window.labelMap = labelMap; } catch(e) {}
  console.log('storage.js: saveLabelMap called');
}

// Helper to normalize account strings (remove emojis/non-ASCII and trim)
function normalizeAccount(acc) {
  return (acc || '').toString().replace(/[^\u0000-\u007F]/g, '').trim();
}

// Expose helper names on window for older scripts (globals expected)
window.defaultLabels = defaultLabels;
window.data = data;
window.labelMap = labelMap;
window.saveData = saveData;
window.saveLabelMap = saveLabelMap;
window.loadData = loadData;
window.normalizeAccount = normalizeAccount;
window.escapeHtml = escapeHtml;
