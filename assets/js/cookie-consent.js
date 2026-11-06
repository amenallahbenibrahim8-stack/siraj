(() => {
  const consentKey = 'siraj-cookie-consent';
  const banner = document.createElement('section');
  banner.className = 'cookie-consent';
  banner.hidden = true;
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'إعدادات الخصوصية');
  banner.innerHTML = `
    <h2 class="cookie-consent__heading">خصوصيتك تهمّنا</h2>
    <p class="cookie-consent__copy">نستخدم التخزين الضروري لحفظ تفضيلاتك وتقدّمك على هذا الجهاز. لا توجد ملفات إعلانية أو أدوات تحليلات مفعّلة حالياً. اختر إعداداتك؛ يمكنك تغييرها لاحقاً.</p>
    <div class="cookie-consent__actions">
      <button type="button" data-cookie-accept>موافق على الكل</button>
      <button type="button" data-cookie-essential>الضرورية فقط</button>
      <button type="button" data-cookie-settings>الإعدادات</button>
    </div>
    <div class="cookie-consent__settings" hidden>
      <p>الضرورية: حفظ إعدادات الخصوصية وتقدّمك، ولا يمكن تعطيلها من هذه اللوحة.</p>
      <label><input type="checkbox" checked disabled> التخزين الضروري</label>
      <p>لا تُحمّل هذه الصفحة ملفات تحليلات أو إعلانات اختيارية؛ لذلك لا يجري تفعيل أي تتبّع عند اختيار «موافق على الكل».</p>
      <button type="button" data-cookie-save>حفظ الاختيار الضروري</button>
    </div>`;
  const reopen = document.createElement('button');
  reopen.className = 'cookie-consent__reopen';
  reopen.type = 'button';
  reopen.textContent = '⚙';
  reopen.setAttribute('aria-label', 'إعدادات الخصوصية');
  reopen.title = 'إعدادات الخصوصية';
  document.body.append(banner, reopen);
  if (document.querySelector('.site-nav')) document.body.classList.add('has-bottom-nav');

  function readConsent() {
    try {
      const saved = localStorage.getItem(consentKey);
      if (saved) return JSON.parse(saved);
    } catch (error) {
      console.error('Unable to read privacy preferences from local storage', error);
    }
    try {
      const cookie = document.cookie.split('; ').find(item => item.startsWith(`${consentKey}=`));
      return cookie ? JSON.parse(decodeURIComponent(cookie.slice(consentKey.length + 1))) : null;
    } catch (error) {
      console.error('Unable to read privacy preference cookie', error);
      return null;
    }
  }

  function storeConsent(choice) {
    const value = JSON.stringify({necessary: true, optional: choice === 'all', updatedAt: new Date().toISOString()});
    let stored = false;
    try {
      localStorage.setItem(consentKey, value);
      stored = true;
    } catch (error) {
      console.error('Unable to save privacy preferences to local storage', error);
    }
    try {
      const secure = location.protocol === 'https:' ? '; Secure' : '';
      document.cookie = `${consentKey}=${encodeURIComponent(value)}; Max-Age=15552000; Path=/; SameSite=Lax${secure}`;
      stored = stored || document.cookie.split('; ').some(item => item.startsWith(`${consentKey}=`));
    } catch (error) {
      console.error('Unable to save privacy preference cookie', error);
    }
    if (!stored) {
      banner.hidden = false;
      banner.querySelector('.cookie-consent__copy').textContent =
        'تعذّر حفظ اختيارك. قد يمنع إعداد المتصفح التخزين؛ ستبقى هذه الرسالة ظاهرة.';
      return;
    }
    banner.hidden = true;
    reopen.hidden = false;
    banner.querySelector('.cookie-consent__settings').hidden = true;
  }

  banner.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    if (button.hasAttribute('data-cookie-accept')) storeConsent('all');
    else if (button.hasAttribute('data-cookie-essential') || button.hasAttribute('data-cookie-save')) storeConsent('essential');
    else if (button.hasAttribute('data-cookie-settings')) banner.querySelector('.cookie-consent__settings').hidden = false;
  });
  reopen.addEventListener('click', () => {
    banner.hidden = false;
    reopen.hidden = true;
    banner.querySelector('[data-cookie-settings]').focus();
  });

  const consent = readConsent();
  reopen.hidden = !consent;
  banner.hidden = !!consent;
})();
