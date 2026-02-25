(function () {
  const path = (location.pathname || '').replace(/\\/g, '/').toLowerCase();
  const normalizedPath = path.endsWith('/') ? `${path}index.html` : path;
  const isLogin = path.endsWith('/login.html') || path.endsWith('login.html');
  if (isLogin) return;

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: '📊', href: '../../index.html', match: [/\/index\.html$/] },
    { key: 'transactions', label: 'Transactions', icon: '📋', href: '../../transactions.html', match: [/\/transactions\.html$/] },
    { key: 'accounts', label: 'Accounts, Budgets & Goals', icon: '⚙️', href: '../../accounts-budgets-goals.html', match: [/\/accounts-budgets-goals\.html$/] },
    { key: 'savings-goals', label: 'Savings Goals', icon: '🎯', href: '../../pages/savings-goals.html', match: [/\/pages\/savings-goals\.html$/] },
    { key: 'analytics', label: 'Analytics', icon: '📈', href: '../../pages/analytics/', match: [/\/pages\/analytics\//] },
    { key: 'labels', label: 'Manage Labels', icon: '⚙', href: '../../pages/labels.html', match: [/\/pages\/labels\.html$/] },
    { key: 'payables', label: 'Payables & Receivables', icon: '💰', href: '../../payables-receivables.html', match: [/\/payables-receivables\.html$/] }
  ];

  function relHref(target) {
    if (!target.startsWith('../../')) return target;
    if (path.includes('/pages/analytics/')) return target;
    if (path.includes('/pages/')) return target.replace('../../', '../');
    return target.replace('../../', '');
  }

  function isActive(matchers) {
    return matchers.some((matcher) => matcher.test(normalizedPath));
  }

  function applyTheme() {
    const mode = localStorage.getItem('themeMode') || 'light';
    document.body.classList.toggle('theme-dark', mode === 'dark');
  }

  function syncStatusText() {
    if (!navigator.onLine) return { label: 'Offline', color: '#f44336' };
    const synced = window.CloudSync && window.CloudSync.isEnabled && window.CloudSync.isEnabled();
    return synced ? { label: 'Synced', color: '#4caf50' } : { label: 'Local only', color: '#ff9800' };
  }

  function computeQuickStats() {
    try {
      const raw = localStorage.getItem('financeData');
      const tx = raw ? JSON.parse(raw) : [];
      let cash = 0;
      let bank = 0;
      tx.forEach((item) => {
        const amount = Number(item.amount || 0);
        if (!Number.isFinite(amount)) return;
        const isCash = String(item.account || '').toLowerCase().includes('cash');
        const sign = item.type === 'expense' ? -1 : 1;
        if (isCash) cash += sign * amount;
        else bank += sign * amount;
      });
      const format = (n) => Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      return `Cash $${format(cash)} · Bank $${format(bank)}`;
    } catch (error) {
      return 'Quick stats unavailable';
    }
  }

  function currentSectionLabel() {
    const match = navItems.find((item) => isActive(item.match));
    return match ? match.label : 'Dashboard';
  }

  function currentSectionKey() {
    const match = navItems.find((item) => isActive(item.match));
    return match ? match.key : 'dashboard';
  }

  function cleanupMainContent(contentRoot, sectionKey) {
    if (!contentRoot) return;

    if (sectionKey === 'dashboard') {
      contentRoot.querySelectorAll('.top-buttons').forEach((node) => node.remove());
    }
  }

  function buildShell() {
    if (document.querySelector('.app-shell')) return;

    const shell = document.createElement('div');
    shell.className = 'app-shell';

    const sidebar = document.createElement('aside');
    sidebar.className = 'app-sidebar';

    const brand = document.createElement('div');
    brand.className = 'app-brand';
    brand.innerHTML = '<div class="brand-title">💰 Finance Tracker</div>';

    const collapseBtn = document.createElement('button');
    collapseBtn.className = 'sidebar-toggle';
    collapseBtn.type = 'button';
    collapseBtn.textContent = '⟨';
    collapseBtn.setAttribute('aria-label', 'Collapse sidebar');
    collapseBtn.onclick = () => {
      const collapsed = document.body.classList.toggle('sidebar-collapsed');
      localStorage.setItem('sidebarCollapsed', collapsed ? '1' : '0');
      collapseBtn.textContent = collapsed ? '⟩' : '⟨';
    };
    brand.appendChild(collapseBtn);

    const nav = document.createElement('nav');
    nav.className = 'app-nav';
    nav.innerHTML = '<div class="app-nav-group">Main</div>';

    navItems.forEach((item) => {
      const link = document.createElement('a');
      link.href = relHref(item.href);
      const active = isActive(item.match);
      link.innerHTML = `
        <div class="app-nav-item ${active ? 'active' : ''}" title="${item.label}">
          <span class="app-nav-icon">${item.icon}</span>
          <span class="app-nav-label">${item.label}</span>
        </div>
      `;
      nav.appendChild(link);
    });

    const footer = document.createElement('div');
    footer.className = 'app-sidebar-footer';
    footer.innerHTML = `<div>${computeQuickStats()}</div>`;

    sidebar.append(brand, nav, footer);

    const main = document.createElement('div');
    main.className = 'app-main';

    const topbar = document.createElement('div');
    topbar.className = 'app-topbar';

    const left = document.createElement('div');
    left.className = 'topbar-left';
    left.innerHTML = `
      <button class="menu-toggle btn-secondary" aria-label="Open menu">☰</button>
      <div>
        <div class="app-page-title">${currentSectionLabel()}</div>
        <div class="app-breadcrumb">Dashboard > ${currentSectionLabel()}</div>
      </div>
    `;

    const right = document.createElement('div');
    right.className = 'topbar-right';
    const sync = syncStatusText();
    right.innerHTML = `
      <span class="status-pill"><span class="status-dot" style="background:${sync.color}"></span>${sync.label}</span>
      <button class="btn-info" type="button" aria-label="Toggle dark mode">🌓</button>
      <span class="user-chip" title="Account">👤</span>
    `;

    topbar.append(left, right);

    const content = document.createElement('main');
    content.className = 'shell-content';
    content.id = 'mainContent';

    main.append(topbar, content);
    shell.append(sidebar, main);

    const overlay = document.createElement('div');
    overlay.className = 'app-drawer-overlay';
    overlay.onclick = () => document.body.classList.remove('sidebar-open');

    const bodyChildren = Array.from(document.body.childNodes).filter((node) => {
      if (node.nodeType === 3) return node.textContent.trim() !== '';
      if (node.nodeType !== 1) return false;
      return node.tagName !== 'SCRIPT';
    });

    document.body.prepend(overlay);
    document.body.prepend(shell);
    bodyChildren.forEach((node) => content.appendChild(node));
    cleanupMainContent(content, currentSectionKey());

    const menuToggle = topbar.querySelector('.menu-toggle');
    menuToggle.onclick = () => document.body.classList.toggle('sidebar-open');

    const darkToggle = right.querySelector('button');
    darkToggle.onclick = () => {
      const dark = !document.body.classList.contains('theme-dark');
      document.body.classList.toggle('theme-dark', dark);
      localStorage.setItem('themeMode', dark ? 'dark' : 'light');
    };

    if (localStorage.getItem('sidebarCollapsed') === '1') {
      document.body.classList.add('sidebar-collapsed');
      collapseBtn.textContent = '⟩';
    }

    const email = window.firebaseAuth && window.firebaseAuth.currentUser ? window.firebaseAuth.currentUser.email : '';
    if (email) {
      right.querySelector('.user-chip').textContent = email.charAt(0).toUpperCase();
      right.querySelector('.user-chip').title = email;
    }

    applyTheme();
    document.body.classList.add('shell-ready');

    if (typeof window.testSync === 'function') {
      const testBtn = document.createElement('button');
      testBtn.className = 'btn-secondary app-topbar-btn';
      testBtn.type = 'button';
      testBtn.textContent = 'Test Sync';
      testBtn.onclick = () => window.testSync();
      right.insertBefore(testBtn, right.querySelector('.user-chip'));
    }

    if (typeof window.toggleCloudSync === 'function') {
      const syncBtn = document.createElement('button');
      syncBtn.className = 'btn-primary app-topbar-btn';
      syncBtn.type = 'button';
      syncBtn.textContent = 'Sync';
      syncBtn.onclick = () => window.toggleCloudSync();
      right.insertBefore(syncBtn, right.querySelector('.user-chip'));
    }

    if (typeof window.logoutUser === 'function') {
      right.querySelector('.user-chip').style.cursor = 'pointer';
      right.querySelector('.user-chip').addEventListener('click', () => window.logoutUser());
    }

    const statusPill = right.querySelector('.status-pill');
    const updateStatusPill = () => {
      if (!statusPill) return;
      const next = syncStatusText();
      statusPill.innerHTML = `<span class="status-dot" style="background:${next.color}"></span>${next.label}`;
    };

    window.addEventListener('online', updateStatusPill);
    window.addEventListener('offline', updateStatusPill);
  }

  document.addEventListener('DOMContentLoaded', buildShell);
})();
