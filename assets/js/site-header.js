(() => {
  const indexPage = !!document.querySelector('#home');
  const header = document.createElement('header');
  header.className = 'site-header';
  header.innerHTML = `
    <a class="site-header__brand" href="${indexPage ? '#home' : 'index.html#home'}" aria-label="سراج إسلامي - الرئيسية">
      <img class="site-header__logo" src="assets/favicon.svg" alt="" width="48" height="48">
      <span class="site-header__words">
        <span class="site-header__title">سراج إسلامي</span>
        <span class="site-header__tagline">رفيقك للقرآن والذكر والطمأنينة</span>
      </span>
    </a>
    <div class="site-header__actions">
      <button class="site-header__theme" type="button" aria-label="تبديل المظهر" title="تبديل المظهر">◐</button>
    </div>`;
  document.body.prepend(header);

  const root = document.documentElement;
  function applyTheme(theme) {
    const light = theme === 'l';
    root.dataset.t = light ? 'l' : 'd';
    root.dataset.theme = light ? 'light' : 'dark';
    try {
      localStorage.setItem('theme', light ? 'l' : 'd');
    } catch (error) {
      console.error('Unable to save theme preference', error);
    }
  }

  let savedTheme = 'd';
  try {
    savedTheme = localStorage.getItem('theme') === 'l' ? 'l' : 'd';
  } catch (error) {
    console.error('Unable to read theme preference', error);
  }
  root.dataset.t = savedTheme;
  root.dataset.theme = savedTheme === 'l' ? 'light' : 'dark';
  header.querySelector('.site-header__theme').addEventListener('click', () => {
    applyTheme(root.dataset.t === 'l' ? 'd' : 'l');
  });
})();
