// ============================================================
// INTUNE LEARNING HUB — APP CONTROLLER
// ============================================================

const TOTAL_MODULES = 16;
let completedModules = new Set(JSON.parse(localStorage.getItem('intuneCompleted') || '[]'));

// ──────────────────────────────────────────────
// SIDEBAR MOBILE TOGGLE
// ──────────────────────────────────────────────
function toggleSidebar() {
  const sidebar  = document.getElementById('sidebar');
  const overlay  = document.getElementById('overlay');
  const menuBtn  = document.getElementById('menu-btn');
  const isOpen   = sidebar.classList.toggle('open');
  overlay.classList.toggle('show', isOpen);
  menuBtn.classList.toggle('open', isOpen);
  menuBtn.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

function closeSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const menuBtn = document.getElementById('menu-btn');
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
  menuBtn.classList.remove('open');
  menuBtn.setAttribute('aria-label', 'Open menu');
  document.body.style.overflow = '';
}

// navTo — closes sidebar on mobile then navigates
function navTo(id) {
  if (window.innerWidth <= 768) closeSidebar();
  showPage(id);
}

// ──────────────────────────────────────────────
// PAGE ROUTING
// ──────────────────────────────────────────────
function showPage(id) {
  const main = document.getElementById('main-content');

  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const navEl = document.getElementById('nav-' + id);
  if (navEl) navEl.classList.add('active');

  if (PAGES[id]) {
    main.innerHTML = PAGES[id].render();
  } else if (QUIZZES[id]) {
    main.innerHTML = renderQuiz(id);
  } else {
    main.innerHTML = `<h2 style="padding:20px">Page not found: ${id}</h2>`;
  }

  // scroll to top (handles both mobile body scroll and desktop main scroll)
  main.scrollTop = 0;
  window.scrollTo(0, 0);

  if (id === 'e3') setTimeout(restoreLabTasks, 50);

  updateProgress();
  updateDashboardStats();
}

// ──────────────────────────────────────────────
// PROGRESS TRACKING
// ──────────────────────────────────────────────
function markComplete(id) {
  completedModules.add(id);
  localStorage.setItem('intuneCompleted', JSON.stringify([...completedModules]));
  const navEl = document.getElementById('nav-' + id);
  if (navEl) navEl.classList.add('completed');
  updateProgress();
  updateDashboardStats();
  updateModuleCards();
}

function updateProgress() {
  const count = completedModules.size;
  const pct   = Math.min(100, Math.round((count / TOTAL_MODULES) * 100));
  const fill  = document.getElementById('prog-fill');
  const pctEl = document.getElementById('prog-pct');
  const tbPct = document.getElementById('topbar-prog');
  if (fill)  fill.style.width = pct + '%';
  if (pctEl) pctEl.textContent = pct + '%';
  if (tbPct) tbPct.textContent = pct + '%';

  document.querySelectorAll('.nav-item').forEach(n => {
    const id = n.id.replace('nav-', '');
    if (completedModules.has(id)) n.classList.add('completed');
  });
}

function updateDashboardStats() {
  const cEl = document.getElementById('dash-completed');
  const qEl = document.getElementById('dash-quizzes');
  const lEl = document.getElementById('dash-level');
  if (!cEl) return;

  const count  = completedModules.size;
  cEl.textContent = count;

  const qPasses = parseInt(localStorage.getItem('intuneQuizPasses') || '0');
  if (qEl) qEl.textContent = qPasses;

  if (lEl) {
    let level = 'Beginner';
    if (count >= 4)  level = 'Intermediate';
    if (count >= 9)  level = 'Advanced';
    if (count >= 13) level = 'Expert';
    lEl.textContent = level;
  }
  updateModuleCards();
}

function updateModuleCards() {
  completedModules.forEach(id => {
    const statusEl = document.getElementById('mc-status-' + id);
    if (statusEl) statusEl.textContent = '✓ Completed';
  });
}

// ──────────────────────────────────────────────
// TABS (used in Lab)
// ──────────────────────────────────────────────
function switchTab(panelId) {
  const panels = ['lab-phase1','lab-phase2','lab-phase3','lab-phase4'];
  const tabs   = document.querySelectorAll('.tab');
  const idx    = panels.indexOf(panelId);

  tabs.forEach((t, i) => t.classList.toggle('active', i === idx));
  panels.forEach(p => {
    const el = document.getElementById(p);
    if (el) el.classList.toggle('active', p === panelId);
  });
}

// ──────────────────────────────────────────────
// LAB TASK CHECKBOXES
// ──────────────────────────────────────────────
const labTasks = new Set(JSON.parse(localStorage.getItem('intuneLabTasks') || '[]'));

function toggleTask(taskId) {
  const check = document.getElementById(taskId)?.querySelector('.task-check');
  if (!check) return;
  if (labTasks.has(taskId)) {
    labTasks.delete(taskId);
    check.classList.remove('done');
    check.textContent = '';
  } else {
    labTasks.add(taskId);
    check.classList.add('done');
    check.textContent = '✓';
  }
  localStorage.setItem('intuneLabTasks', JSON.stringify([...labTasks]));
}

function restoreLabTasks() {
  labTasks.forEach(id => {
    const check = document.getElementById(id)?.querySelector('.task-check');
    if (check) { check.classList.add('done'); check.textContent = '✓'; }
  });
}

// ──────────────────────────────────────────────
// KEYBOARD: close sidebar with Escape
// ──────────────────────────────────────────────
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSidebar();
});

// ──────────────────────────────────────────────
// INIT
// ──────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  showPage('dashboard');
  updateProgress();

  // Register service worker for offline support
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
});
