# Finance Tracker

A production-style personal finance web app for day-to-day money management, including transaction tracking, label management, analytics dashboards, payables/receivables workflows, authentication, and optional cloud sync.

## Project Overview

This project provides a complete personal finance workspace for tracking and analyzing financial activity across multiple pages and workflows.

Key capabilities include:
- Managing transactions and financial records with customizable labels
- Analyzing trends using dedicated analytics and monthly/compare views
- Tracking receivables and payables with **full and partial settlement** support
- Visualizing data with Chart.js-powered summaries and comparisons
- Maintaining state in local storage with optional Firebase cloud synchronization

## Why This Project Is Hiring-Relevant

This codebase demonstrates practical front-end engineering skills used in real product work:
- **State management in vanilla JavaScript** without framework dependency
- **Domain modeling** for financial transactions (`owe` vs `debt`, settlement lifecycle)
- **UX-focused interaction design** (summary cards, drill-down detail sections, guided settlement flows)
- **Defensive input validation** for financial correctness
- **Progressive enhancement** with optional cloud sync instead of hard dependency
- **Responsive design** for desktop and mobile usage

## Core Features

### 1) Finance Tracking
- Track financial records across the main tracker workflows
- Organize records with category labels and label-management tools
- Maintain structured entries with dates, notes, and typed categories

### 2) Payables & Receivables Module
- Add receivables (money others owe you)
- Add payables (money you owe)
- Mark items as fully settled
- Handle partial payments and automatically reduce remaining balance
- Persist partial payment history for auditability

### 3) Analytics Module
- Dedicated analytics pages for comparison and monthly insights
- Chart-based summaries for faster decision-making
- Snapshot views for current financial position

### 4) Authentication & Sync
- Firebase-based login gating for protected pages
- Local-first persistence with optional cloud synchronization
- Cross-device continuity when cloud sync is enabled

## Technical Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6)
- **Charts:** Chart.js 3.9.1
- **Authentication:** Firebase Auth
- **Persistence:** Local storage (`storage.js`)
- **Sync (optional):** Firebase Cloud Sync (`firebase-sync.js`)

## Architecture Notes

The `payables-receivables.html` page is built around clear functional separation:
- `loadLabels()` – initializes category labels from configured label maps
- `addReceivable()` / `addPayable()` – input capture + model creation + persistence
- `markAsSettled()` – full/partial settlement logic + validation + history tracking
- `renderAll()` – single render orchestrator for totals, lists, charts, and overview
- `renderReceivables()` / `renderPayables()` – grouped display by category
- `renderCharts()` – person-level aggregation and chart rendering lifecycle
- `showSection()` – navigation between overview and detailed views

This structure keeps business logic explicit and easy to maintain in a no-framework environment.

## Data Model

Each financial item includes:
- `id`
- `type` (`"owe"` | `"debt"`)
- `person`
- `amount`
- `label`
- `date`
- `notes`
- `settled`
- `createdAt`
- `settledDate` (when fully settled)
- `settlementAmount` (full settlement amount)
- `paymentHistory[]` for partial settlements

## Auth & Security Behavior

On page load:
1. UI is hidden until auth state is resolved.
2. Firebase auth state is checked.
3. Unauthenticated users are redirected to `login.html`.
4. Authenticated users are granted access to the full page UI.

## Setup

Quick start: Run `npx serve .` then open the URL shown, or open `index.html` directly (some features work best on a local server).

1. Configure Firebase in `firebase-config.js`.
2. Ensure authentication pages/routes are available (`login.html`).
3. Verify required files are present:
   - `payables-receivables.html`
   - `storage.js`
   - `firebase-config.js`
   - `firebase-sync.js`
   - `styles/main.css`
4. Open the app from your local/static server and sign in.

For production, load Firebase config from environment/build injection instead of committing keys directly in the repo.

Legacy compatibility note: root files (`analytics.html`, `monthly_analytics.html`, `compare_labels.html`, `label.html`) are redirect stubs to the canonical `pages/...` routes.

## Product Quality Highlights

- Handles invalid settlement amounts (zero/negative/overpayment)
- Keeps settled records visible for transparency
- Preserves historical context through payment history entries
- Uses responsive breakpoints for small-screen usability
- Gracefully supports local-only mode when cloud sync is disabled

## Next Improvements (Roadmap)

- Export/import transaction history (CSV/JSON)
- Search and filter by person/category/date
- Unit tests for settlement calculations and render helpers
- Accessibility pass (ARIA labels, keyboard navigation, contrast checks)

## Author Note

This project is intentionally built with plain JavaScript to show strong fundamentals in data modeling, UI state orchestration, and maintainable front-end architecture without relying on heavy frameworks.
