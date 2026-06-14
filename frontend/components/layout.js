// ═══════════════════════════════════════════════════
//  Noor Al-Tareeq — Shared Layout + API Client
//  الطريقة البيومية الأحمدية — السادة آل سلَّام
// ═══════════════════════════════════════════════════
(function () {
  'use strict';

  // ── API Base URL (auto-detect) ────────────────────
  window.API = window.API || {};
  window.API.BASE = window.location.origin;

  // ── API Helper ────────────────────────────────────
  window.API.get = async function (path) {
    const r = await fetch(`${window.API.BASE}/api${path}`);
    if (!r.ok) throw new Error(`API ${path} → ${r.status}`);
    return r.json();
  };
  window.API.post = async function (path, body) {
    const isForm = body instanceof FormData;
    const opts = { method: 'POST', body: isForm ? body : JSON.stringify(body) };
    if (!isForm) opts.headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('bayoumiyya_token');
    if (token) opts.headers = { ...(opts.headers||{}), Authorization: `Bearer ${token}` };
    const r = await fetch(`${window.API.BASE}/api${path}`, opts);
    return r.json();
  };
  window.API.put = async function (path, body) {
    const isForm = body instanceof FormData;
    const opts = { method: 'PUT', body: isForm ? body : JSON.stringify(body) };
    if (!isForm) opts.headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('bayoumiyya_token');
    if (token) opts.headers = { ...(opts.headers||{}), Authorization: `Bearer ${token}` };
    const r = await fetch(`${window.API.BASE}/api${path}`, opts);
    return r.json();
  };
  window.API.del = async function (path) {
    const token = localStorage.getItem('bayoumiyya_token');
    const r = await fetch(`${window.API.BASE}/api${path}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return r.json();
  };

  // ── Navigation Pages ──────────────────────────────
  const PAGES = [
    { id: 'home',    label: 'الرئيسية',       icon: 'home',         href: '/' },
    { id: 'awrad',   label: 'الأوراد',         icon: 'menu_book',    href: '/awrad.html' },
    { id: 'audio',   label: 'الصوتيات',        icon: 'audiotrack',   href: '/audio.html' },
    { id: 'videos',  label: 'الفيديوهات',      icon: 'videocam',     href: '/videos.html' },
    { id: 'dalail',  label: 'دلائل الخيرات',   icon: 'auto_stories', href: '/dalail.html' },
  ];

  const ADMIN_PAGES = [
    { id: 'admin-home',    label: 'لوحة التحكم',       icon: 'dashboard',    href: '/admin/' },
    { id: 'admin-awrad',   label: 'الأوراد',            icon: 'menu_book',    href: '/admin/awrad.html' },
    { id: 'admin-audio',   label: 'الصوتيات',           icon: 'audiotrack',   href: '/admin/audio.html' },
    { id: 'admin-videos',  label: 'الفيديوهات',         icon: 'videocam',     href: '/admin/videos.html' },
    { id: 'admin-dalail',  label: 'دلائل الخيرات',      icon: 'auto_stories', href: '/admin/dalail.html' },
    { id: 'admin-settings',label: 'الإعدادات',          icon: 'settings',     href: '/admin/settings.html' },
  ];

  const currentPage = document.body.dataset.page || 'home';
  const isAdmin     = currentPage.startsWith('admin');

  // ── Icon Helper ───────────────────────────────────
  function icon(name, filled = false) {
    const style = filled ? `style="font-variation-settings:'FILL' 1"` : '';
    return `<span class="material-symbols-outlined" ${style}>${name}</span>`;
  }

  // ── Render Public Sidebar ─────────────────────────
  function renderSidebar(container) {
    const navItems = PAGES.map(p => {
      const active = p.id === currentPage;
      const cls = active
        ? 'flex items-center gap-3 bg-secondary-container text-on-secondary-container rounded-xl px-4 py-3 mx-2 gold-glow'
        : 'flex items-center gap-3 text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface rounded-xl px-4 py-3 mx-2 transition-colors';
      return `<a href="${p.href}" class="${cls}" ${active ? 'aria-current="page"' : ''}>
        ${icon(p.icon, active)}
        <span class="font-medium">${p.label}</span>
      </a>`;
    }).join('');

    container.innerHTML = `
      <aside class="hidden md:flex flex-col fixed top-0 right-0 h-full w-64 bg-surface-container border-l border-outline-variant z-40 overflow-y-auto custom-scrollbar">
        <div class="p-6 border-b border-outline-variant flex items-center gap-3">
          <div class="w-12 h-12 rounded-xl bg-secondary/15 border border-secondary/30 flex items-center justify-center gold-glow flex-shrink-0">
            ${icon('mosque', true)}
          </div>
          <div>
            <div class="text-secondary font-semibold font-amiri text-lg leading-tight">آل سلَّام</div>
            <div class="text-on-surface-variant text-xs">الطريقة البيومية الأحمدية</div>
          </div>
        </div>
        <nav class="flex-1 py-4 flex flex-col gap-1">${navItems}</nav>
        <div class="p-4 border-t border-outline-variant text-xs text-on-surface-variant text-center">
          © السادة آل سلَّام
        </div>
      </aside>`;
  }

  // ── Render Admin Sidebar ──────────────────────────
  function renderAdminSidebar(container) {
    const navItems = ADMIN_PAGES.map(p => {
      const active = p.id === currentPage;
      const cls = active
        ? 'flex items-center gap-3 bg-secondary-container text-on-secondary-container rounded-xl px-4 py-3 mx-2 gold-glow'
        : 'flex items-center gap-3 text-on-surface-variant hover:bg-surface-container-high rounded-xl px-4 py-3 mx-2 transition-colors';
      return `<a href="${p.href}" class="${cls}">${icon(p.icon, active)}<span>${p.label}</span></a>`;
    }).join('');

    const adminName = localStorage.getItem('bayoumiyya_name') || 'المدير';
    container.innerHTML = `
      <aside class="hidden md:flex flex-col fixed top-0 right-0 h-full w-64 bg-surface-container border-l border-outline-variant z-40 overflow-y-auto custom-scrollbar">
        <div class="p-6 border-b border-outline-variant">
          <div class="text-secondary font-semibold text-lg font-amiri">آل سلَّام</div>
          <div class="text-on-surface-variant text-xs">لوحة التحكم</div>
          <div class="mt-3 flex items-center gap-2 text-sm text-on-surface-variant">
            ${icon('manage_accounts')} ${adminName}
          </div>
        </div>
        <div class="px-4 py-2 text-xs text-on-surface-variant uppercase tracking-widest mt-2">القوائم</div>
        <nav class="flex-1 flex flex-col gap-1">${navItems}</nav>
        <div class="p-4 border-t border-outline-variant flex flex-col gap-2">
          <a href="/" class="flex items-center gap-2 text-sm text-on-surface-variant hover:text-secondary transition-colors">
            ${icon('open_in_new')} عرض الموقع
          </a>
          <button onclick="adminLogout()" class="flex items-center gap-2 text-sm text-error hover:text-on-error-container transition-colors w-full">
            ${icon('logout')} تسجيل الخروج
          </button>
        </div>
      </aside>`;
  }

  // ── Render Mobile Nav ─────────────────────────────
  function renderMobileNav(container) {
    const pages = isAdmin ? [] : PAGES; // no bottom nav in admin
    if (!pages.length) return;
    const items = pages.map(p => {
      const active = p.id === currentPage;
      const cls = active
        ? 'flex flex-col items-center gap-1 text-secondary text-xs relative'
        : 'flex flex-col items-center gap-1 text-on-surface-variant text-xs';
      return `<a href="${p.href}" class="${cls}">
        ${active ? '<span class="absolute -top-3 w-1.5 h-1.5 bg-secondary rounded-full"></span>' : ''}
        ${icon(p.icon, active)}
        <span>${p.label}</span>
      </a>`;
    }).join('');

    container.innerHTML = `
      <nav class="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-tertiary-container/95 backdrop-blur-xl border-t border-secondary/30 h-20 flex items-center justify-around px-2 pb-safe">
        ${items}
      </nav>`;
  }

  // ── Render Footer ─────────────────────────────────
  function renderFooter(container) {
    if (isAdmin) return;
    container.innerHTML = `
      <footer class="bg-surface-container-lowest border-t border-outline-variant mt-12 py-8 px-8 pb-24 md:pb-8">
        <div class="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div class="text-center md:text-right">
            <div class="text-secondary font-amiri text-xl">الطريقة البيومية الأحمدية</div>
            <div class="text-on-surface-variant text-sm mt-1">© السادة آل سلَّام</div>
          </div>
          <div class="flex gap-6 text-sm text-on-surface-variant">
            <a href="/about.html" class="hover:text-secondary transition-colors">عن الطريقة</a>
            <a href="/contact.html" class="hover:text-secondary transition-colors">تواصل معنا</a>
          </div>
        </div>
      </footer>`;
  }

  // ── Admin logout ──────────────────────────────────
  window.adminLogout = function () {
    localStorage.removeItem('bayoumiyya_token');
    localStorage.removeItem('bayoumiyya_name');
    window.location.href = '/admin/login.html';
  };

  // ── Admin Auth Guard ──────────────────────────────
  function adminAuthGuard() {
    if (!isAdmin) return;
    if (window.location.pathname.includes('login.html')) return;
    const token = localStorage.getItem('bayoumiyya_token');
    if (!token) { window.location.href = '/admin/login.html'; return; }
    // Verify token silently
    fetch(`${window.API.BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(r => { if (!r.ok) window.location.href = '/admin/login.html'; })
      .catch(() => {});
  }

  // ── Boot ──────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    adminAuthGuard();
    const sidebar   = document.getElementById('sidebar-container');
    const mobileNav = document.getElementById('mobile-nav-container');
    const footer    = document.getElementById('footer-container');
    if (sidebar) {
      sidebar.dataset.mode === 'admin' ? renderAdminSidebar(sidebar) : renderSidebar(sidebar);
    }
    if (mobileNav) renderMobileNav(mobileNav);
    if (footer)    renderFooter(footer);
  });

})();
