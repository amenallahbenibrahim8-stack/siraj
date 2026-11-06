(() => {
  const API = 'https://api.alquran.cloud/v1';
  const RECITERS = ['ar.alafasy', 'ar.husary', 'ar.minshawi'];
  const params = new URLSearchParams(location.search);
  const surahNumber = Number(params.get('surah'));
  const requestedAyah = Number(params.get('ayah'));
  const name = document.querySelector('#surah-name');
  const meta = document.querySelector('#surah-meta');
  const ayahs = document.querySelector('#ayahs');
  const count = document.querySelector('#ayah-count');
  const error = document.querySelector('#reader-error');
  const audio = document.querySelector('#surah-audio');
  const status = document.querySelector('#audio-status');
  const ayahPlayer = document.querySelector('#ayah-player');
  const ayahAudio = document.querySelector('#ayah-audio');
  const ayahAudioStatus = document.querySelector('#ayah-audio-status');
  const tafsirButton = document.querySelector('#show-tafsir');
  const tafsir = document.querySelector('#ayah-tafsir');
  const reciter = document.querySelector('#reciter');
  let surahData;
  let selectedAyah;
  let tafsirRequest = 0;

  function showError(message) {
    error.textContent = message;
    error.hidden = false;
  }

  function savedReciter() {
    try {
      const saved = localStorage.getItem('reader');
      return RECITERS.includes(saved) ? saved : RECITERS[0];
    } catch (reason) {
      console.error('Unable to read reciter preference', reason);
      return RECITERS[0];
    }
  }

  function setAudioSource() {
    audio.pause();
    audio.src = `https://cdn.islamic.network/quran/audio-surah/128/${reciter.value}/${surahNumber}.mp3`;
    status.textContent = 'التلاوة تشمل السورة كاملة.';
  }

  async function loadSurah() {
    if (!Number.isInteger(surahNumber) || surahNumber < 1 || surahNumber > 114) {
      showError('رقم السورة غير صحيح. ارجع إلى قائمة السور واختر سورة للقراءة.');
      name.textContent = 'تعذّر فتح السورة';
      ayahs.textContent = '';
      return;
    }

    try {
      const response = await fetch(`${API}/surah/${surahNumber}/quran-uthmani`);
      if (!response.ok) throw new Error(`Quran API returned ${response.status}`);
      const result = await response.json();
      surahData = result.data;
      name.textContent = surahData.name;
      meta.textContent = `${surahData.englishName} · ${surahData.revelationType === 'Meccan' ? 'مكيّة' : 'مدنيّة'}`;
      count.textContent = `${surahData.ayahs.length} آية`;
      document.title = `${surahData.name} · القرآن الكريم | سراج إسلامي`;
      setAudioSource();
      ayahs.textContent = '';

      surahData.ayahs.forEach(ayah => {
        const verse = document.createElement('span');
        verse.dataset.ayah = ayah.numberInSurah;
        verse.dataset.globalAyah = ayah.number;
        verse.id = `ayah-${ayah.numberInSurah}`;
        verse.tabIndex = 0;
        verse.setAttribute('role', 'button');
        verse.setAttribute('aria-pressed', 'false');
        verse.setAttribute('aria-label', `استمع إلى الآية ${ayah.numberInSurah}`);
        verse.title = 'اضغط للاستماع إلى الآية';
        verse.append(document.createTextNode(`${ayah.text} `));
        const marker = document.createElement('span');
        marker.className = 'ayah-number';
        marker.setAttribute('aria-label', `الآية ${ayah.numberInSurah}`);
        marker.textContent = String(ayah.numberInSurah);
        verse.append(marker, document.createTextNode(' '));
        ayahs.append(verse);
      });

      document.querySelector('#previous-surah').disabled = surahNumber === 1;
      document.querySelector('#previous-surah').onclick = () => {
        location.href = `quran.html?surah=${surahNumber - 1}`;
      };
      document.querySelector('#next-surah').disabled = surahNumber === 114;
      document.querySelector('#next-surah').onclick = () => {
        location.href = `quran.html?surah=${surahNumber + 1}`;
      };

      if (Number.isInteger(requestedAyah) && requestedAyah > 0 && requestedAyah <= surahData.ayahs.length) {
        document.querySelector(`#ayah-${requestedAyah}`).scrollIntoView({block: 'center'});
      }

      try {
        localStorage.setItem('last', JSON.stringify({
          s: surahData.number,
          name: surahData.name,
          n: Number.isInteger(requestedAyah) && requestedAyah > 0 ? requestedAyah : 1
        }));
      } catch (reason) {
        console.error('Unable to save Quran reading position', reason);
      }
    } catch (reason) {
      console.error('Unable to load the requested surah', reason);
      showError('تعذّر تحميل آيات السورة. تحقق من اتصال الإنترنت ثم أعد المحاولة.');
      name.textContent = 'تعذّر تحميل السورة';
      ayahs.textContent = '';
    }
  }

  reciter.value = savedReciter();
  reciter.addEventListener('change', () => {
    try {
      localStorage.setItem('reader', reciter.value);
    } catch (reason) {
      console.error('Unable to save reciter preference', reason);
    }
    if (surahData) {
      setAudioSource();
      if (selectedAyah) {
        ayahAudio.pause();
        ayahAudio.src = `https://cdn.islamic.network/quran/audio/128/${reciter.value}/${selectedAyah.global}.mp3`;
        ayahAudioStatus.textContent = 'تم تغيير القارئ. اضغط تشغيل للاستماع إلى الآية.';
      }
    }
  });
  ayahs.addEventListener('click', event => {
    const verse = event.target.closest('[data-global-ayah]');
    if (verse) playAyah(verse);
  });
  ayahs.addEventListener('keydown', event => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-global-ayah]')) {
      event.preventDefault();
      playAyah(event.target);
    }
  });
  function playAyah(verse) {
    selectedAyah = {
      number: Number(verse.dataset.ayah),
      global: Number(verse.dataset.globalAyah)
    };
    ayahs.querySelectorAll('.selected').forEach(item => {
      item.classList.remove('selected');
      item.setAttribute('aria-pressed', 'false');
    });
    verse.classList.add('selected');
    verse.setAttribute('aria-pressed', 'true');
    ayahPlayer.hidden = false;
    document.querySelector('#ayah-player-title').textContent = `استمع إلى الآية ${selectedAyah.number}`;
    tafsir.hidden = true;
    tafsir.textContent = '';
    tafsirButton.setAttribute('aria-expanded', 'false');
    tafsirButton.textContent = 'معنى الآية';
    tafsirRequest++;
    ayahAudio.pause();
    audio.pause();
    ayahAudio.src = `https://cdn.islamic.network/quran/audio/128/${reciter.value}/${selectedAyah.global}.mp3`;
    ayahAudioStatus.textContent = 'جارٍ تحميل الآية المحددة…';
    ayahAudio.play().catch(reason => {
      console.error('Unable to play the selected ayah', reason);
      ayahAudioStatus.textContent = 'تعذّر تشغيل الآية. تحقق من الاتصال أو اختر قارئاً آخر.';
    });
    try {
      localStorage.setItem('last', JSON.stringify({
        s: surahData.number,
        name: surahData.name,
        n: selectedAyah.number
      }));
    } catch (reason) {
      console.error('Unable to save Quran reading position', reason);
    }
  }
  tafsirButton.addEventListener('click', async () => {
    if (!selectedAyah) return;
    const request = ++tafsirRequest;
    tafsir.hidden = false;
    tafsir.textContent = 'جارٍ تحميل تفسير الآية…';
    tafsirButton.setAttribute('aria-expanded', 'true');
    try {
      const response = await fetch(`${API}/ayah/${selectedAyah.global}/ar.muyassar`);
      if (!response.ok) throw new Error(`Tafsir API returned ${response.status}`);
      const result = await response.json();
      if (request === tafsirRequest) tafsir.textContent = result.data.text;
    } catch (reason) {
      console.error('Unable to load ayah tafsir', reason);
      if (request === tafsirRequest) tafsir.textContent = 'تعذّر تحميل معنى الآية. تحقق من الاتصال ثم أعد المحاولة.';
    }
  });
  audio.addEventListener('playing', () => {
    ayahAudio.pause();
    status.textContent = `تُتلى سورة ${surahData.name} كاملة`;
  });
  audio.addEventListener('error', () => {
    status.textContent = 'تعذّر تحميل التلاوة. جرّب قارئاً آخر أو تحقق من الاتصال.';
  });
  ayahAudio.addEventListener('playing', () => {
    ayahAudioStatus.textContent = `تُتلى الآية ${selectedAyah.number} وحدها`;
  });
  ayahAudio.addEventListener('error', () => {
    ayahAudioStatus.textContent = 'تعذّر تحميل الآية. تحقق من الاتصال أو اختر قارئاً آخر.';
  });
  loadSurah();
})();
