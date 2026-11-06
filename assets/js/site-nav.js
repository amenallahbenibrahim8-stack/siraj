(() => {
  const links = [
    ['index.html#home', '⌂', 'الرئيسية'],
    ['index.html#quran', '۞', 'القرآن'],
    ['index.html#adhkar', '◉', 'الأذكار'],
    ['index.html#qibla', '⌖', 'القبلة'],
    ['index.html#cal', '▦', 'التقويم'],
    ['index.html#hadith', '❝', 'الحديث'],
    ['dashboard.html', '▤', 'لوحة يومي'],
    ['tasbih.html', '◌', 'المسبحة']
  ];
  const nav = document.createElement('nav');
  nav.className = 'site-nav';
  nav.setAttribute('aria-label', 'التنقل الرئيسي');
  const items = document.createElement('div');
  items.className = 'site-nav__items';

  const navLinks = [];
  function syncCurrentPage() {
    for (const [link, href] of navLinks) {
      const target = new URL(href, location.href);
      const sectionMatch = !target.hash || target.hash === location.hash ||
        (!location.hash && target.hash === '#home');
      if (target.pathname === location.pathname && sectionMatch) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    }
  }
  for (const [href, icon, label] of links) {
    const link = document.createElement('a');
    link.href = href;
    link.innerHTML = `<span class="site-nav__icon" aria-hidden="true">${icon}</span><span>${label}</span>`;
    navLinks.push([link, href]);
    items.append(link);
  }
  nav.append(items);
  document.body.prepend(nav);
  syncCurrentPage();
  window.addEventListener('siraj:navigate', syncCurrentPage);
  window.addEventListener('popstate', syncCurrentPage);
  window.addEventListener('hashchange', syncCurrentPage);
})();
