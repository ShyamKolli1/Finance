(function () {
  function ensureToastContainer() {
    let container = document.querySelector('.ui-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'ui-toast-container';
      document.body.appendChild(container);
    }
    return container;
  }

  function notify(message, type = 'info', duration = 2600) {
    const container = ensureToastContainer();
    const toast = document.createElement('div');
    toast.className = `ui-toast ${type}`;
    toast.textContent = String(message || '');
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      setTimeout(() => toast.remove(), 160);
    }, Math.max(1200, duration));
  }

  async function uiConfirm(message, title = 'Please Confirm') {
    return new Promise((resolve) => {
      let backdrop = document.querySelector('.ui-confirm-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.className = 'ui-confirm-backdrop';
        backdrop.innerHTML = `
          <div class="ui-confirm" role="dialog" aria-modal="true">
            <h3 id="uiConfirmTitle"></h3>
            <pre id="uiConfirmMessage"></pre>
            <div class="ui-confirm-actions">
              <button id="uiConfirmNo" class="btn-secondary" type="button">Cancel</button>
              <button id="uiConfirmYes" class="btn-primary" type="button">Confirm</button>
            </div>
          </div>
        `;
        document.body.appendChild(backdrop);
      }

      const titleEl = backdrop.querySelector('#uiConfirmTitle');
      const msgEl = backdrop.querySelector('#uiConfirmMessage');
      const noBtn = backdrop.querySelector('#uiConfirmNo');
      const yesBtn = backdrop.querySelector('#uiConfirmYes');

      titleEl.textContent = title;
      msgEl.textContent = String(message || '');

      const cleanup = () => {
        backdrop.classList.remove('show');
        noBtn.onclick = null;
        yesBtn.onclick = null;
      };

      noBtn.onclick = () => {
        cleanup();
        resolve(false);
      };
      yesBtn.onclick = () => {
        cleanup();
        resolve(true);
      };

      backdrop.classList.add('show');
      yesBtn.focus();
    });
  }

  function formatAmount(value) {
    const num = Number(value || 0);
    if (!Number.isFinite(num)) return '0.00';
    return num.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function addSkipLink() {
    if (document.querySelector('.skip-link')) return;
    const skip = document.createElement('a');
    skip.href = '#mainContent';
    skip.className = 'skip-link';
    skip.textContent = 'Skip to main content';
    document.body.prepend(skip);
  }

  function attachFirstTimeHint() {
    const key = `hintSeen:${location.pathname}`;
    if (localStorage.getItem(key) === '1') return;

    const target = document.querySelector('.container') || document.body;
    if (!target) return;

    const hint = document.createElement('div');
    hint.className = 'ui-hint';
    hint.innerHTML = `
      <span>Tip: Use keyboard Tab to move through actions, and Enter/Space to activate buttons.</span>
      <button class="btn-primary" type="button">Got it</button>
    `;

    const btn = hint.querySelector('button');
    btn.onclick = () => {
      localStorage.setItem(key, '1');
      hint.remove();
    };

    target.prepend(hint);
  }

  function showSkeleton(targetSelector, lines = 4) {
    const target = document.querySelector(targetSelector);
    if (!target) return;
    target.innerHTML = '';
    for (let index = 0; index < lines; index++) {
      const row = document.createElement('div');
      row.className = 'skeleton';
      row.style.height = '18px';
      row.style.marginBottom = '8px';
      row.style.opacity = String(1 - index * 0.08);
      target.appendChild(row);
    }
  }

  function hideSkeleton(targetSelector) {
    const target = document.querySelector(targetSelector);
    if (!target) return;
    target.querySelectorAll('.skeleton').forEach((item) => item.remove());
  }

  window.notify = notify;
  window.uiConfirm = uiConfirm;
  window.formatAmount = formatAmount;
  window.showSkeleton = showSkeleton;
  window.hideSkeleton = hideSkeleton;

  const nativeAlert = window.alert.bind(window);
  window.alert = function patchedAlert(message) {
    try {
      notify(message, 'info', 3200);
    } catch (error) {
      nativeAlert(message);
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    addSkipLink();
    attachFirstTimeHint();
  });
})();
