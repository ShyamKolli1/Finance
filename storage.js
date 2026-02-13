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
var data = JSON.parse(localStorage.getItem("financeData")) || [];
var labelMap = JSON.parse(localStorage.getItem("financeLabels")) || defaultLabels;

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
window.normalizeAccount = normalizeAccount;
