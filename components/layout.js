// ═══════════════════════════════════════════════
//  Noor Al-Tareeq — Shared Layout System
//  يُحقن في كل صفحة بـ <script src="/components/layout.js"></script>
// ═══════════════════════════════════════════════

(function() {

  // ─── 1. تعريف صفحات الموقع وروابطها ───────────
  const SITE_PAGES = [
    { id: 'home',    label: 'الرئيسية',       icon: 'home',        href: '/al-bayoumiyya/index.html' },
    { id: 'awrad',   label: 'الأوراد',         icon: 'menu_book',   href: '/al-bayoumiyya/awrad.html' },
    { id: 'audio',   label: 'الصوتيات',        icon: 'audiotrack',  href: '/al-bayoumiyya/audio.html' },
    { id: 'videos',  label: 'الفيديوهات',      icon: 'videocam',    href: '/al-bayoumiyya/videos.html' },
    { id: 'dalail',  label: 'دلائل الخيرات',   icon: 'auto_stories',href: '/al-bayoumiyya/dalail.html' },

  // ─── 2. تحديد الصفحة النشطة من data-page attribute ───
  const currentPage = document.body.dataset.page || 'home';

  // helper to render an icon
  function iconHTML(name, filled) {
    const fillAttr = filled ? "font-variation-settings: 'FILL' 1;" : '';
    return `<span class="material-symbols-outlined" style="${fillAttr}">${name}</span>`;
  }

  // ─── 3. حقن الـ Sidebar (Desktop) ────────────────────
  function renderSidebar() {
    const container = document.getElementById('sidebar-container');
    if (!container) return;

    if (container.dataset.mode === 'admin') {
      renderAdminSidebar(container);
      return;
    }

    const navItems = SITE_PAGES.map(page => {
      const isActive = page.id === currentPage;
      const classes = isActive
        ? 'flex items-center gap-3 bg-secondary-container text-on-secondary-container rounded-lg mx-2 px-4 py-2 transition-colors gold-glow'
        : 'flex items-center gap-3 text-on-surface-variant px-4 py-2 hover:bg-surface-container-high transition-colors rounded-lg mx-2';
      return `
        <a href="${page.href}" class="${classes}" aria-current="${isActive ? 'page' : 'false'}">
          ${iconHTML(page.icon, isActive)}
          <span class="whitespace-nowrap">${page.label}</span>
        </a>`;
    }).join('');

    const html = `
      <aside class="hidden md:block w-64 fixed right-0 top-0 bottom-0 p-6 bg-surface-container"> 
        <div class="mb-6 flex items-center gap-3">
          <div class="w-12 h-12 rounded-md gold-glow bg-secondary flex items-center justify-center">
            ${iconHTML('mosque', false)}
          </div>
          <div>
            <div class="font-medium">آل سلَّام</div>
            <div class="text-sm text-on-surface-variant">الطريقة البيومية الأحمدية</div>
          </div>
        </div>

        <nav aria-label="Main navigation">
          ${navItems}
        </nav>

        <div class="mt-auto text-sm text-on-surface-variant">© السادة آل سلَّام</div>
      </aside>`;

    container.innerHTML = html;
  }

  // ─── Admin sidebar ───────────────────────────────
  function renderAdminSidebar(containerEl) {
    const general = SITE_PAGES.map(page => `
      <a href="${page.href}" class="flex items-center gap-3 text-on-surface-variant px-4 py-2 hover:bg-surface-container-high rounded-lg mx-2">
        ${iconHTML(page.icon, page.id===currentPage)}
        <span class="whitespace-nowrap">${page.label}</span>
      </a>`).join('');

    const adminHtml = `
      <aside class="hidden md:block w-64 fixed right-0 top-0 bottom-0 p-6 bg-surface-container">
        <div class="mb-6 flex items-center gap-3">
          <div class="w-12 h-12 rounded-md gold-glow bg-secondary flex items-center justify-center">
            ${iconHTML('mosque', false)}
          </div>
          <div>
            <div class="font-medium">آل سلَّام</div>
            <div class="text-sm text-on-surface-variant">الطريقة البيومية الأحمدية</div>
          </div>
        </div>

        <nav aria-label="General navigation">${general}</nav>

        <div class="my-4 border-t border-outline"></div>

        <div class="text-sm font-semibold text-on-surface">إدارة خاصة</div>
        <nav class="mt-2">
          <a href="/al-bayoumiyya/admin/index.html#today" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-surface-container-high">${iconHTML('calendar_today',false)}<span>إدارة ورد اليوم</span></a>
          <a href="/al-bayoumiyya/admin/index.html#settings" class="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-surface-container-high">${iconHTML('settings',false)}<span>الإعدادات</span></a>
        </nav>

        <div class="mt-auto">
          <a href="/al-bayoumiyya/" class="flex items-center gap-3 text-error px-4 py-2 rounded-lg">
            ${iconHTML('logout', false)}
            <span>تسجيل الخروج</span>
          </a>
        </div>
      </aside>`;

    containerEl.innerHTML = adminHtml;
  }

  // ─── 4. Mobile Bottom Nav ────────────────────
  function renderMobileNav() {
    const container = document.getElementById('mobile-nav-container');
    if (!container) return;

    const items = SITE_PAGES.map(page => {
      const isActive = page.id === currentPage;
      const classes = isActive ? 'flex flex-col items-center text-secondary' : 'flex flex-col items-center text-on-surface-variant opacity-80';
      return `
        <a href="${page.href}" class="${classes} px-4 py-2">
          ${iconHTML(page.icon, isActive)}
          <span class="text-xs">${page.label}</span>
        </a>`;
    }).join('');

    container.innerHTML = `
      <nav class="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container flex justify-around pb-safe">${items}</nav>
    `;
  }

  // ─── 5. Footer ────────────────────────────────
  function renderFooter() {
    const container = document.getElementById('footer-container');
    if (!container) return;
    container.innerHTML = `
      <div class="w-full p-6 text-center text-sm text-on-surface-variant">
        <div class="font-semibold">الطريقة البيومية الأحمدية</div>
        <div class="mt-2">© السادة آل سلَّام - الطريقة البيومية الأحمدية</div>
        <div class="mt-4 flex justify-center gap-4">
          <a href="/about.html" class="hover:underline">عن الطريقة</a>
          <a href="/contact.html" class="hover:underline">تواصل معنا</a>
          <a href="/privacy.html" class="hover:underline">سياسة الخصوصية</a>
        </div>
      </div>`;
  }

  // ─── 6. تشغيل كل الـ renderers ────────────────────────
  document.addEventListener('DOMContentLoaded', function() {
    renderSidebar();
    renderMobileNav();
    renderFooter();
  });

})();
