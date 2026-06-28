// app.jsx — جذر تطبيق أفنان: الحالة، الحفظ المحلي، التنقّل
const { useState, useEffect, useRef } = React;
const STORE_KEY = 'afnan-v2';
const USER_NAME = 'عبدالله';

function todayKey() { return new Date().toISOString().slice(0, 10); }
function hijriToday() {
  try { return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', { day: 'numeric', month: 'long' }).format(new Date()); }
  catch (e) { return '١٤ رمضان'; }
}
function greetingNow() { const h = new Date().getHours(); return h < 12 ? 'صباحُ الخير' : h < 17 ? 'طابَ نهارُك' : 'مساءُ الخير'; }

const DAILY_AYAHS = [
  { text: 'وَمِن دُونِهِمَا جَنَّتَانِ ذَوَاتَا أَفْنَانٍ', ref: 'الرحمن ٤٨', surah: 1 },
  { text: 'فَاذْكُرُونِي أَذْكُرْكُمْ', ref: 'البقرة ١٥٢', surah: 112 },
  { text: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا', ref: 'الشرح ٦', surah: 103 },
  { text: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', ref: 'الكوثر ١', surah: 108 },
];

function seedState() {
  return {
    dateKey: todayKey(),
    seeds: [],
    adhanOn: { all: true, fajr: true, dhuhr: true, asr: true, maghrib: true, isha: true },
    name: USER_NAME,
    city: 'الرياض',
    reciter: 'مصعب إبراهيم',
    qiraah: 'حفص عن عاصم',
    translation: 'none',
    fontScale: 1,
    quranView: 'surah',     // 'surah' = نظام السور · 'pages' = صفحات المصحف
    bookmark: null,
    pageBookmark: null,     // علامة صفحة المصحف (مرتبطة برقم الصفحة)
    saved: [],
    seenQuranIntro: false,
    dontShowQuranIntro: false,
    dontShowWelcome: false,
    khatmat: [],
    dataVersion: 2,
    prefs: { adhkar: true, wird: true, kahf: false, vibrate: false, hijriFirst: true },
  };
}
function loadState() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return seedState();
    const s = JSON.parse(raw);
    const merged = { ...seedState(), ...s, dateKey: todayKey(), prefs: { ...seedState().prefs, ...(s.prefs || {}) } };
    // ترقية لمرّة واحدة: إزالة بيانات العرض القديمة (بذور/ختمات تجريبية) — يبدأ المستخدم بصفحةٍ نظيفة
    if (!s.dataVersion || s.dataVersion < 2) {
      merged.seeds = [];
      merged.khatmat = [];
      merged.dataVersion = 2;
    }
    return merged;
  } catch (e) { return seedState(); }
}

function App() {
  const [tab, setTab] = useState('home');
  const [st, setSt] = useState(loadState);
  const [surah, setSurah] = useState(null);     // open surah number
  const [jumpAyah, setJumpAyah] = useState(null); // optional ayah to scroll to
  const [mushafPage, setMushafPage] = useState(null); // open mushaf page (نظام صفحات المصحف)
  const [cat, setCat] = useState(null);         // open adhkar category
  const [hadithSheet, setHadithSheet] = useState(null); // حديث الشرح المفتوح
  const [showWelcome, setShowWelcome] = useState(() => { try { const s = JSON.parse(localStorage.getItem(STORE_KEY) || '{}'); return !!s.lang && !s.dontShowWelcome; } catch (e) { return false; } });
  // أظهِر لوحَ الترحيب بعد اختيار اللغة (ما لم يُطلب عدمُ العرض)
  useEffect(() => { if (st.lang && !st.dontShowWelcome) setShowWelcome(true); }, [st.lang]);
  const [burst, setBurst] = useState(null);
  const burstId = useRef(0);

  useEffect(() => { try { localStorage.setItem(STORE_KEY, JSON.stringify(st)); } catch (e) {} }, [st]);

  // الإشعارات: اطلب الإذن عند تفعيل أيِّ تنبيه، وابدأ محرّك الجدولة
  const notifWanted = !!(st.adhanOn && st.adhanOn.all) ||
    !!(st.prefs && (st.prefs.adhkar || st.prefs.wird || st.prefs.kahf));
  useEffect(() => {
    if (notifWanted && window.AfnanNotify) {
      window.AfnanNotify.requestPermission().then(() => window.AfnanNotify.start());
    }
  }, [notifWanted]);

  // اللغة الفعّالة للواجهة (يقرؤها بقيّة المكوّنات من window قبل التصيير)
  window.AFN_LANG = st.lang || 'ar';
  const dir = window.afnDir ? window.afnDir() : 'rtl';
  const LangSheet = window.LanguageSheet;

  const hijri = hijriToday();
  const dailyAyah = DAILY_AYAHS[new Date().getDate() % DAILY_AYAHS.length];

  const celebrate = (n) => { burstId.current++; const id = burstId.current; setBurst({ id, n });
    setTimeout(() => setBurst(b => (b && b.id === id ? null : b)), 1100); };

  const setAdhan = (key) => setSt(s => ({ ...s, adhanOn: { ...s.adhanOn, [key]: !s.adhanOn[key] } }));
  const update = (patch) => setSt(s => ({ ...s, ...patch }));
  const openSurah = (num, ayah = null) => { setSurah(num); setJumpAyah(ayah || null); };
  const closeSurah = () => { setSurah(null); setJumpAyah(null); };
  const openMushafPage = (p) => setMushafPage(p || 1);
  const closeMushafPage = () => setMushafPage(null);
  const setKhatmat = (updater) => setSt(s => ({ ...s, khatmat: typeof updater === 'function' ? updater(s.khatmat || []) : updater }));
  const setSaved = (updater) => setSt(s => ({ ...s, saved: typeof updater === 'function' ? updater(s.saved || []) : updater }));

  const pane = (key, node) => (
    <div style={{ position: 'absolute', inset: 0, display: tab === key ? 'block' : 'none' }}>{node}</div>
  );

  return (
    <div dir={dir} style={{ position: 'relative', width: '100%', height: '100%', background: T.bg }}>
      {pane('home', <HomeScreen userName={st.name} hijriFirst={st.prefs ? st.prefs.hijriFirst : true} onNav={setTab} onOpenHadith={setHadithSheet} />)}

      <div style={{ position: 'absolute', inset: 0, display: tab === 'quran' ? 'block' : 'none' }}>
        <QuranScreen active={tab === 'quran'} openSurah={surah} jumpAyah={jumpAyah} onOpenSurah={openSurah} onCloseSurah={closeSurah}
          fontScale={st.fontScale || 1}
          qiraah={st.qiraah || 'حفص عن عاصم'}
          translation={st.translation || 'none'}
          bookmark={st.bookmark} onBookmark={(bm) => update({ bookmark: bm })}
          quranView={st.quranView || 'surah'}
          openPage={mushafPage} onOpenPage={openMushafPage} onClosePage={closeMushafPage}
          pageBookmark={st.pageBookmark || null} onSetPageBookmark={(p) => update({ pageBookmark: p })}
          onGoHome={() => setTab('home')}
          saved={st.saved || []} setSaved={setSaved}
          seenIntro={!!st.dontShowQuranIntro} onSeenIntro={() => update({ dontShowQuranIntro: true })}
          khatmat={st.khatmat || []} setKhatmat={setKhatmat} userName={st.name} />
      </div>

      {pane('prayer', <PrayerScreen hijri={hijri} city={st.city} adhanOn={st.adhanOn} onAdhan={setAdhan} />)}

      <div style={{ position: 'absolute', inset: 0, display: tab === 'adhkar' ? 'block' : 'none' }}>
        {cat ? <AdhkarDetail cat={cat} onBack={() => setCat(null)} /> : <AdhkarScreen onOpenCat={setCat} />}
      </div>

      {pane('settings', <SettingsScreen state={st} onChange={update} onAdhan={setAdhan} />)}

      <Celebrate burst={burst} />

      {/* لوح شرح الحديث وسنده — على مستوى الجذر ليغطّي شريط التبويب ويلتصق بالقاع */}
      {hadithSheet && <HadithSheet hadith={hadithSheet} onClose={() => setHadithSheet(null)} />}

      {/* اختيار لغة التطبيق عند أول تشغيل */}
      {!st.lang && LangSheet && <LangSheet firstRun value="ar"
        onPick={(v) => update({ lang: v })} onClose={() => {}} />}

      {/* لوحُ الترحيب — التجربة الأولى لأفنان (تظهر مرّة واحدة فقط) */}
      {showWelcome && st.lang && window.WelcomeSheet && (
        <window.WelcomeSheet onClose={() => { update({ dontShowWelcome: true }); setShowWelcome(false); }} />
      )}

      {/* hide tab bar inside immersive sub-views (surah reader · mushaf page reader) */}
      {!(tab === 'quran' && (surah || mushafPage)) && (
        <TabBar active={tab} onChange={(t) => { setTab(t);
          if (t !== 'adhkar') setCat(null);
          if (t !== 'quran') { setSurah(null); setMushafPage(null); }
        }} />
      )}
    </div>
  );
}

function Root() {
  // على الهاتف: اعرض التطبيق بملء الشاشة دون إطار الجهاز الوهمي
  const [isPhone, setIsPhone] = useState(() =>
    typeof matchMedia !== 'undefined' && matchMedia('(max-width: 700px)').matches);
  useEffect(() => {
    const mq = matchMedia('(max-width: 700px)');
    const fn = (e) => setIsPhone(e.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);

  if (isPhone) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: T.bg,
        paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)',
        boxSizing: 'border-box' }}>
        <App />
      </div>
    );
  }
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'radial-gradient(circle at 50% 0%, #EAF1E4, #DDE6D5)', padding: 20 }}>
      <IOSDevice><App /></IOSDevice>
    </div>
  );
}
ReactDOM.createRoot(document.getElementById('root')).render(<Root />);
