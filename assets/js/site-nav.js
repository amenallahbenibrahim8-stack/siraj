(() => {
  const isHomePage = !!document.querySelector('#home');
  const isQuranReaderPage = location.pathname.endsWith('/quran.html');
  const links = [
    [isHomePage ? '#home' : 'index.html#home', '⌂', 'الرئيسية', 'home'],
    [isHomePage ? '#quran' : 'index.html#quran', '۞', 'القرآن', 'quran'],
    [isHomePage ? '#adhkar' : 'index.html#adhkar', '◉', 'الأذكار', 'adhkar'],
    [isHomePage ? '#qibla' : 'index.html#qibla', '⌖', 'القبلة', 'qibla'],
    [isHomePage ? '#cal' : 'index.html#cal', '▦', 'التقويم', 'cal'],
    [isHomePage ? '#hadith' : 'index.html#hadith', '❝', 'الحديث', 'hadith'],
    ['dashboard.html', '▤', 'لوحة يومي'],
    ['tasbih.html', '◌', 'المسبحة']
  ];
  const nav = document.createElement('nav');
  nav.className = 'site-nav';
  nav.setAttribute('aria-label', 'التنقل الرئيسي');
  const items = document.createElement('div');
  items.className = 'site-nav__items';

  const navLinks = [];
  const normalizePath = path => path.replace(/index\.html$/, '') || '/';
  function syncCurrentPage() {
    for (const [link, href] of navLinks) {
      const target = new URL(href, location.href);
      const sectionMatch = !target.hash || target.hash === location.hash ||
        (!location.hash && target.hash === '#home');
      const readerMatch = isQuranReaderPage && target.hash === '#quran';
      if (readerMatch || (normalizePath(target.pathname) === normalizePath(location.pathname) && sectionMatch)) {
        link.setAttribute('aria-current', 'page');
      } else {
        link.removeAttribute('aria-current');
      }
    }
  }
  for (const [href, icon, label, section] of links) {
    const link = document.createElement('a');
    link.href = href;
    if (section) link.dataset.section = section;
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
  if (isHomePage) {
    window.addEventListener('hashchange', () => {
      const section = location.hash.slice(1);
      const valid = links.some(item => item[3] === section);
      window.dispatchEvent(new CustomEvent('siraj:section', {detail: valid ? section : 'home'}));
    });
  }
})();
