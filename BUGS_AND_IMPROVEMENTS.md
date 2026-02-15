# 🐛 Bugs & ✨ New Features — Checklist

Use this list to fix bugs and add new product features. Do one item at a time.

---

## 🐛 BUGS (Fix These)

### 1. **Duplicate or unused HTML files in root**
- **What’s wrong:** Root has `analytics.html`, `compare_labels.html`, `monthly_analytics.html`, and `label.html`. They only redirect to `pages/analytics/` or `pages/labels.html`. So you have two ways to reach the same pages, which can be confusing.
- **Fix:** Either delete these root files and make sure all links use `pages/...` URLs, or add a short note in the README that they are redirects. Then there’s one clear place for each screen.

### 2. **Receivable/Payable amount not validated**
- **Status:** ✅ **Fixed** — `payables-receivables.html` now checks `Number.isFinite(amount) || amount <= 0` for both Add Receivable and Add Payable. You can remove this from the list.

---

## ✨ NEW FEATURES (With descriptions)

Add these features so the app does more for the user. Each has a short description of what it is and what it does.

### 1. **Export data (CSV / JSON)**
- **What it is:** A button (e.g. in user menu or Dashboard) that downloads all transactions and labels as a file.
- **Description:** User can export their data as CSV (for Excel) or JSON (for backup or import elsewhere). File name could include date (e.g. `finance-export-2025-02-15.json`). Keeps data portable and gives peace of mind.

### 2. **Import data (CSV / JSON)**
- **What it is:** A way to upload a previously exported file and load it into the app.
- **Description:** User selects a file; app parses it and either merges with existing data or replaces it (with a clear “Replace all” vs “Merge” choice and confirmation). After import, call `loadData()` and re-render so the UI shows the new data. Helps when switching devices or restoring a backup.

### 3. **Search and filter transactions**
- **What it is:** A search box and/or filters above the transaction list on the Dashboard.
- **Description:** User can filter by: text (label or notes), date range (from–to), type (income/expense/transfer/saving), or label/category. Filtered list updates as they type or change options. Makes it easy to find specific transactions without scrolling.

### 4. **Edit transaction**
- **What it is:** An “Edit” action on each transaction row that opens a form with current values.
- **Description:** User can change amount, label, type, account, or date and save. Same validation as “Add transaction.” No need to delete and re-add. Store updated transaction in `data` and call `saveData()` then re-render.

### 5. **Recurring transactions**
- **What it is:** Option to mark a transaction as repeating (e.g. monthly rent, weekly subscription).
- **Description:** When adding (or editing) a transaction, user can set “Repeat” (e.g. monthly, weekly). App can either auto-create the next occurrence on the due date or show a “Add again” quick button that pre-fills the same details. Reduces data entry for regular items.

### 6. **Due date for payables and receivables**
- **What it is:** An optional “Due date” field when adding a receivable or payable.
- **Description:** User picks a date; it’s stored with the item. In the list, show “Due in 3 days” or “Overdue by 2 days.” Optionally a “Due soon” block on Dashboard showing items due in the next 7 days. Helps users stay on top of who owes what and when.

### 7. **Budget or spending limit per category**
- **What it is:** User sets a monthly (or weekly) limit per category (e.g. Food: $500).
- **Description:** Store budgets in `localStorage` (e.g. `financeBudgets`: `{ "Food": 500, "Rides": 100 }`). On Dashboard or Analytics, show “Spent $320 / $500” per category and a simple warning (e.g. orange/red) when over or close to the limit. Encourages controlled spending.

### 8. **Notes on main transactions**
- **What it is:** An optional “Notes” field on the main “Add Transaction” form (like payables/receivables already have).
- **Description:** User can add a short note to any income or expense. Show the note in the transaction list (e.g. under the label). Stored in the transaction object. Helps remember what a transaction was for.

### 9. **Multiple accounts (e.g. Wallet, Credit card)**
- **What it is:** Besides Cash and Bank, user can add custom account names.
- **Description:** Store a list of accounts (e.g. in `labelMap` or a dedicated `accounts` array). In “Add Transaction,” account is a dropdown filled from this list. Balance breakdown and analytics show per-account totals. Makes the app fit real-life accounts.

### 10. **Undo after delete**
- **What it is:** After deleting a transaction or a payable/receivable, show “Deleted — Undo” for a few seconds.
- **Description:** Keep the deleted item in memory; if user clicks “Undo” before the timer ends, put it back and call `saveData()` and re-render. If they don’t, confirm the delete. Reduces regret from accidental deletes.

### 11. **Sort transactions and lists**
- **What it is:** Sort options for the transaction list and for payables/receivables.
- **Description:** User can sort by: date (newest or oldest first), amount (highest or lowest), type, or label. A small “Sort by” dropdown or toggle above the list applies the sort. Same idea for payables/receivables (e.g. by person, amount, date). Makes long lists easier to scan.

### 12. **Dark mode**
- **What it is:** A toggle (in top bar or user menu) to switch between light and dark theme.
- **Description:** Store choice in `localStorage` (e.g. `theme: 'dark'`). When dark, apply a dark background to sidebar and content, light text, and adjust card and button colors. One CSS class on `body` or a data attribute that all styles use. Popular for evening use.

### 13. **“Due soon” on Dashboard**
- **What it is:** A small card or list on the Dashboard showing payables (and optionally receivables) due in the next 7 days or already overdue.
- **Description:** Read `data` for type `debt` and `owe`; filter by optional `dueDate` if you added it. Show item, amount, and “Due in X days” or “Overdue.” Link to Payables & Receivables for details. Surfaces what needs attention without opening that section.

### 14. **Quick add from recent**
- **What it is:** Under “Add Transaction,” show a row of recent combinations (e.g. “Food $20”, “Rent $500”).
- **Description:** From the last 5–10 transactions, build quick buttons (label + amount). One click fills the form with that type, label, amount (user can change account or date). Speeds up repeat entries.

### 15. **Settlement modal (no prompt)**
- **What it is:** When user clicks “Got Paid” or “Paid Back,” open a small modal instead of using `prompt()`.
- **Description:** Modal has: title (“Record payment”), input for amount, “Full amount” button that fills the remaining balance, and “Apply” / “Cancel.” Reuse the same validation and update logic as today; just replace the prompt UI. Feels modern and works better on mobile.

### 16. **Reports or printable summary**
- **What it is:** A “Report” or “Print summary” that shows a clean view of transactions (and optionally payables/receivables) for a chosen period.
- **Description:** User picks date range (e.g. this month, last month). Page or modal shows: totals by type, list of transactions, maybe a simple chart. “Print” hides sidebar and nav so the printout is clean. Useful for personal review or sharing.

### 17. **Forgot password / reset**
- **What it is:** On the login page, a “Forgot password?” link that sends a reset email.
- **Description:** Use Firebase `sendPasswordResetEmail(auth, email)`. User enters email; they get a link to set a new password. May already exist — if so, skip. Otherwise it’s a must for real use.

### 18. **Password change (logged in)**
- **What it is:** In account or user menu, “Change password” that lets the user set a new password while logged in.
- **Description:** Firebase Auth supports updating password for the current user. Show a small form (current password, new password, confirm); on submit call the Firebase API and show success or error. Improves security and control.

### 19. **Net worth or balance over time**
- **What it is:** A chart (e.g. line chart) showing total Cash + Bank balance over time (daily or monthly).
- **Description:** Compute running balance from transactions by date; plot it. Optionally show “Net position” (receivables − payables) over time if you store history. Gives a sense of trend, not just current snapshot.

### 20. **Comparison: this month vs last month**
- **What it is:** In Analytics, a comparison view: income and expense this month vs same for last month.
- **Description:** Use existing monthly helpers; show two columns or a bar chart (this month vs last month). Highlights whether spending or income is up or down. Simple and very useful.

### 21. **Categories with icons or colors**
- **What it is:** Each label/category can have an optional icon (emoji or SVG) and color.
- **Description:** Store in label config (e.g. `labelMeta: { "Food": { icon: "🍔", color: "#4CAF50" } }`). Use in transaction list, analytics charts, and dropdowns. Makes scanning by category faster and more visual.

### 22. **Savings or goals**
- **What it is:** User can set a savings goal (e.g. “Emergency fund: $5,000”) and track progress.
- **Description:** Store goals (name, target amount, optional deadline). Dashboard or a small “Goals” section shows progress (e.g. “$2,300 / $5,000”). Optionally link to “Saving” transactions. Motivates saving.

### 23. **Keyboard shortcuts**
- **What it is:** Shortcuts like “N” for new transaction, “/” to focus search, “Escape” to close modal.
- **Description:** Add a `keydown` listener; when focus is not in an input, map keys to actions (e.g. N → focus first field of Add Transaction). Document in a “Shortcuts” tooltip or Help. Power users love it.

### 24. **Data backup reminder**
- **What it is:** Optional reminder (e.g. once a month) to export a backup.
- **Description:** Store last export date in `localStorage`. If more than 30 days (or user-chosen interval), show a small banner or toast: “It’s been a while since you exported. Backup your data?” with a link to Export. Encourages good habits.

### 25. **Filter payables/receivables by person or label**
- **What it is:** Search or filter on the Payables & Receivables page by person name or category.
- **Description:** A search box or dropdown that filters the list to matching person or label. Same list UI, just filtered. Helps when the list is long.

### 26. **Scheduled or future transactions**
- **What it is:** Allow adding a transaction with a future date and optionally “Schedule” so it appears when that date is reached.
- **Description:** Transactions already have a date; you can allow future dates. Optionally mark as “scheduled” and on app load (or a daily check), “confirm” or auto-add when date is today. Useful for planned expenses.

### 27. **Multi-currency (optional)**
- **What it is:** Support more than one currency (e.g. USD and INR) with an exchange rate or manual conversion.
- **Description:** Store preferred currency and optionally a second currency + rate. Show amounts in both where relevant, or let user tag a transaction with a currency. Advanced; add only if you need it.

### 28. **Notifications (browser or in-app)**
- **What it is:** Reminders like “X owes you $50 due tomorrow.”
- **Description:** Use optional due dates on receivables/payables; if the browser supports notifications, ask permission and send a simple “Due tomorrow: …” when due date is near. Or show an in-app “Reminders” section. Increases follow-up on money owed.

### 29. **Split transaction**
- **What it is:** One payment split across multiple categories (e.g. $100 at a store: $60 Food, $40 Misc).
- **Description:** When adding a transaction, user can choose “Split” and add two or more (label, amount) lines that sum to the total. Store as one transaction with a `splits` array; in lists show as one row with “Split” badge; in analytics allocate to each label. More accurate categorization.

### 30. **Help or onboarding**
- **What it is:** A short “How to use” or first-time tips (e.g. “Add a transaction to get started,” “Use the sidebar to switch sections”).
- **Description:** Optional “Help” link in top bar or user menu that opens a modal or page with bullet points. Or a first-visit overlay with 2–3 tips and “Got it”; store “seen” in `localStorage`. Makes the app easier for new users.

---

## Order to Do Things

1. Fix bugs **1** and **2** first (and remove bug 2 from the list if amount validation is already in place).
2. Pick new features **1–30** in any order. Good starting points: **1–2** (Export/Import), **3** (Search/filter), **4** (Edit transaction), **15** (Settlement modal), **12** (Dark mode). Then add **6** (Due date), **7** (Budget), **13** (Due soon), and others as needed.

When you’re done, you can delete or archive this file.

---

## ✅ Feature status (what’s done vs not)

Checked against the current codebase. **✅ = implemented.** **❌ = not yet.**

| # | Feature | Status |
|---|---------|--------|
| 1 | Export data (CSV / JSON) | ✅ Done — `exportDataAsJson()`, `exportDataAsCsv()`, Export buttons on Dashboard |
| 2 | Import data (CSV / JSON) | ✅ Done — `openImportDialog()`, `handleImportFile()`, merge/replace, CSV + JSON |
| 3 | Search and filter transactions | ✅ Done — Search box (label/notes), type filter, `getFilteredSortedTransactions()` |
| 4 | Edit transaction | ✅ Done — `startEditTransaction()`, “Save Changes”, edit button on each row |
| 5 | Recurring transactions | ❌ Not done |
| 6 | Due date for payables/receivables | ✅ Done — Due Date field in forms, `dueDate` stored, `getDueStatusText()`, “Due in X days” in list |
| 7 | Budget or spending limit per category | ❌ Not done |
| 8 | Notes on main transactions | ✅ Done — Notes field in Add Transaction form and in list |
| 9 | Multiple accounts (Wallet, Credit card, etc.) | ❌ Not done — only Cash and Bank in account dropdown |
| 10 | Undo after delete | ❌ Not done |
| 11 | Sort transactions and lists | ✅ Done — `transactionSort` (date, amount, label), sort dropdown |
| 12 | Dark mode | ✅ Done — theme toggle, `themeMode` in localStorage, `theme-dark` in CSS |
| 13 | “Due soon” on Dashboard | ✅ Done — “Due Soon” section, `calculateDueSoonItems()`, `renderDueSoon()`, links to P/R page |
| 14 | Quick add from recent | ❌ Not done |
| 15 | Settlement modal (no prompt) | ✅ Done — `payment-modal`, `askSettlementAmount()` modal; no `prompt()` |
| 16 | Reports / printable summary | ✅ Done — Report modal, `generateReport()`, copy in Analytics |
| 17 | Forgot password | ✅ Done — “Forgot Password?” and `sendPasswordResetEmail` on login |
| 18 | Change password (logged in) | ❌ Not done |
| 19 | Net worth / balance over time | ❌ Not done |
| 20 | This month vs last month | ❌ Not done — Compare page compares labels, not months |
| 21 | Categories with icons/colors | ❌ Not done |
| 22 | Savings goals | ❌ Not done |
| 23 | Keyboard shortcuts (N, /, etc.) | ❌ Not done — only a tip about Tab/Enter in first-time hint |
| 24 | Data backup reminder | ❌ Not done |
| 25 | Filter payables/receivables by person or label | ❌ Not done |
| 26 | Scheduled / future transactions | ❌ Not done |
| 27 | Multi-currency | ❌ Not done |
| 28 | Notifications (e.g. due tomorrow) | ❌ Not done |
| 29 | Split transaction | ❌ Not done |
| 30 | Help / onboarding | ✅ Partial — first-time hint (keyboard tip + “Got it”) in `ui-enhancements.js` |

**Bugs:** Bug 1 (duplicate root HTML files) — **not fixed** (analytics.html, label.html, compare_labels.html, monthly_analytics.html still in root). Bug 2 (amount validation) — **fixed.**

**Summary:** **14 features done** (1–4, 6, 8, 11–13, 15–17, 30 partial). **16 not done** (5, 7, 9–10, 14, 18–29). One bug left (clean up or document root HTML files).
