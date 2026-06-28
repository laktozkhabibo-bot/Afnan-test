// screen_prayer.jsx — صلاتي: موقع تلقائي + مواقيت محسوبة فلكياً + بوصلة قبلة حقيقية

const AR_D = s => String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);

// ساعة عشرية → نص عربي ١٢-ساعة
function fmtHour(h) {
  if (h == null || isNaN(h)) return '—';
  let H = Math.floor(h), M = Math.round((h - H) * 60);
  if (M === 60) { H = (H + 1) % 24; M = 0; }
  const am = H < 12, h12 = H % 12 || 12;
  return `${window.tnum(h12)}:${window.tnum(String(M).padStart(2, '0'))} ${am ? window.t('u_am') : window.t('u_pm')}`;
}

function usePrayerClock() {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  return now;
}

// ── مشغّل الأذان: تسجيلان حقيقيان — أذان الفجر للفجر، والأذان العام لباقي الصلوات ──
const ADHAN_SRC = {
  fajr:  encodeURI('assets/adhan/أذان الفجر.mp3'),
  other: encodeURI('assets/adhan/الأذان.mp3'),
};
let adhanUnlocked = false;
function useAdhanPlayer() {
  const fajrA = React.useRef(null);
  const otherA = React.useRef(null);
  const [playing, setPlaying] = React.useState(null); // 'fajr' | 'other' | null

  React.useEffect(() => {
    const f = new Audio(ADHAN_SRC.fajr);
    const o = new Audio(ADHAN_SRC.other);
    f.preload = 'auto'; o.preload = 'auto';
    fajrA.current = f; otherA.current = o;
    const onEnd = () => setPlaying(null);
    f.addEventListener('ended', onEnd); o.addEventListener('ended', onEnd);

    // فتح التشغيل التلقائي: أول لمسة من المستخدم تُهيّئ الصوت ليُسمح برفع الأذان لاحقاً دون لمسة
    const unlock = () => {
      if (adhanUnlocked) return;
      [f, o].forEach(a => {
        a.muted = true;
        const p = a.play();
        if (p && p.then) p.then(() => { a.pause(); a.currentTime = 0; a.muted = false; }).catch(() => { a.muted = false; });
        else { a.pause(); a.muted = false; }
      });
      adhanUnlocked = true;
      document.removeEventListener('pointerdown', unlock);
    };
    document.addEventListener('pointerdown', unlock);

    return () => {
      f.removeEventListener('ended', onEnd); o.removeEventListener('ended', onEnd);
      document.removeEventListener('pointerdown', unlock);
      f.pause(); o.pause();
    };
  }, []);

  const stop = React.useCallback(() => {
    [fajrA, otherA].forEach(r => { const a = r.current; if (a) { a.pause(); a.currentTime = 0; } });
    setPlaying(null);
  }, []);

  const play = React.useCallback((which) => {
    const a = (which === 'fajr' ? fajrA : otherA).current;
    const off = (which === 'fajr' ? otherA : fajrA).current;
    if (off) { off.pause(); off.currentTime = 0; }
    if (!a) return;
    a.currentTime = 0;
    const p = a.play();
    if (p && p.then) p.then(() => setPlaying(which)).catch(() => setPlaying(null));
    else setPlaying(which);
  }, []);

  return { play, stop, playing };
}

// ── الموقع الجغرافي (تلقائي عبر GPS + اختيار يدوي لأي مكان + ذاكرة محلية) ──
const GEO_KEY = 'afnan-geo-v2';
const RIYADH = { lat: 24.7136, lng: 46.6753, city: 'الرياض', sub: 'منطقة الرياض' };

function loadPlace() {
  try { const p = JSON.parse(localStorage.getItem(GEO_KEY)); if (p && p.lat != null) return p; } catch (e) {}
  return null;
}
function savePlace(p) { try { localStorage.setItem(GEO_KEY, JSON.stringify(p)); } catch (e) {} }

function useLocation() {
  const [place, setPlace] = React.useState(loadPlace);                 // {lat,lng,city,sub,manual,method,school}
  const [status, setStatus] = React.useState(loadPlace() ? 'ok' : 'locating');
  // رمز طلبٍ متزايد: أي اختيار يدويّ أو طلب GPS جديد يُبطل ردود GPS المعلّقة الأقدم
  // (هذا يمنع ردّ تحديد الموقع المتأخّر من الكتابة فوق المدينة التي اختارها المستخدم)
  const reqRef = React.useRef(0);

  // حفظ أي تغيير
  React.useEffect(() => { if (place) savePlace(place); }, [place]);

  // GPS: نحدّد الموقع ثم نحسّن الاسم (مدينة + حيّ) عبر العكس الجغرافي
  const locate = React.useCallback(() => {
    if (!navigator.geolocation) { setStatus('unsupported'); return; }
    const myReq = ++reqRef.current;   // هذا الطلب هو الأحدث
    setStatus('locating');
    navigator.geolocation.getCurrentPosition(pos => {
      if (myReq !== reqRef.current) return;   // تجاوزه اختيارٌ أحدث — لا تكتب فوقه
      const lat = pos.coords.latitude, lng = pos.coords.longitude;
      setPlace(p => ({ lat, lng, city: PrayerCalc.nearestCity(lat, lng), sub: '', manual: false,
        method: p ? p.method : undefined, school: p ? p.school : 0 }));
      setStatus('ok');
      fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=ar`)
        .then(r => r.json())
        .then(j => {
          if (myReq !== reqRef.current) return; // تجاوزه اختيارٌ أحدث
          const city = j.city || j.locality || j.principalSubdivision || PrayerCalc.nearestCity(lat, lng);
          let sub = '';
          [j.locality, j.principalSubdivision].forEach(x => { if (x && x !== city && !sub) sub = x; });
          setPlace(p => ({ ...p, lat, lng, city, sub, manual: false }));
        })
        .catch(() => {});
    }, () => { setStatus(cur => (loadPlace() ? 'ok' : 'denied')); },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 300000 });
  }, []);

  // أول تشغيل: إن لم يختر المستخدم موقعاً يدوياً سابقاً، حدّد تلقائياً
  React.useEffect(() => { const p = loadPlace(); if (!p || !p.manual) locate(); }, []);

  const pickManual = React.useCallback((sel) => {     // sel:{lat,lng,city,sub}
    reqRef.current++;   // أبطِل أيّ ردّ GPS معلّق كي لا يكتب فوق اختيار المستخدم
    setPlace(p => ({ ...(p || {}), ...sel, manual: true, method: p ? p.method : undefined, school: p ? p.school : 0 }));
    setStatus('ok');
  }, []);
  const setMethod = React.useCallback((m) => setPlace(p => ({ ...(p || RIYADH), method: m })), []);
  const setSchool = React.useCallback((s) => setPlace(p => ({ ...(p || RIYADH), school: s })), []);

  const eff = place || RIYADH;
  return { place: eff, real: !!place, status, locate, pickManual, setMethod, setSchool };
}

// ── البوصلة (مستشعرات الجهاز) ──────────────────────────────────────────
function useCompass() {
  const [heading, setHeading] = React.useState(null);   // 0–360 من الشمال
  const [state, setState] = React.useState('init');     // init | prompt | on | unsupported
  const [accuracy, setAccuracy] = React.useState(null); // درجات عدم الدقّة (iOS) — null إن لم تتوفّر
  const gotEvent = React.useRef(false);
  const raf = React.useRef(null);
  const pending = React.useRef(null);
  const pendingAcc = React.useRef(null);
  const timer = React.useRef(null);

  const handler = React.useCallback((e) => {
    let h = null;
    if (typeof e.webkitCompassHeading === 'number' && !isNaN(e.webkitCompassHeading)) {
      h = e.webkitCompassHeading; // iOS: من الشمال مباشرة
      if (typeof e.webkitCompassAccuracy === 'number') pendingAcc.current = e.webkitCompassAccuracy;
    } else if (e.absolute === true && e.alpha != null) {
      h = 360 - e.alpha;          // Android: نأخذ القراءة المطلقة (من الشمال) فقط — نتجاهل النسبية المضلِّلة
    } else if (e.type === 'deviceorientationabsolute' && e.alpha != null) {
      h = 360 - e.alpha;          // بعض أجهزة أندرويد لا تضع absolute=true على الحدث المطلق
    }
    if (h == null) return;
    const so = (screen.orientation && screen.orientation.angle) || window.orientation || 0;
    h = ((h + so) % 360 + 360) % 360;
    gotEvent.current = true;
    pending.current = h;
    if (!raf.current) {
      raf.current = requestAnimationFrame(() => {
        raf.current = null;
        setHeading(pending.current);
        if (pendingAcc.current != null) setAccuracy(pendingAcc.current);
        setState('on');
      });
    }
  }, []);

  // نبقى مستمعين دائماً؛ وإن لم تصل أي قراءة خلال مهلة نطلب لمسة لتفعيلها (لا نستسلم)
  const attach = React.useCallback(() => {
    window.addEventListener('deviceorientationabsolute', handler, true);
    window.addEventListener('deviceorientation', handler, true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      // إن لم تصل أي قراءة من المستشعر، نعرض اتجاه القبلة الثابت (بالدرجات) بدل زرٍّ معطّل
      if (!gotEvent.current) setState(s => (s === 'on' ? s : 'unsupported'));
    }, 2500);
  }, [handler]);

  const enable = React.useCallback(() => {
    gotEvent.current = false;
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS: لمسة المستخدم تطلب الإذن
      DeviceOrientationEvent.requestPermission()
        .then(res => { if (res === 'granted') attach(); else setState('unsupported'); })
        .catch(() => setState('unsupported'));
    } else {
      // أندرويد: لمسة المستخدم تُعيد التفعيل (إيماءة تساعد بعض المتصفّحات)
      attach();
    }
  }, [attach]);

  React.useEffect(() => {
    if (typeof DeviceOrientationEvent === 'undefined' && typeof DeviceMotionEvent === 'undefined') {
      setState('unsupported'); return;
    }
    if (typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function') {
      setState('prompt'); // iOS: يتطلّب لمسة
    } else {
      attach();           // أندرويد: نحاول فوراً
    }
    return () => {
      window.removeEventListener('deviceorientationabsolute', handler, true);
      window.removeEventListener('deviceorientation', handler, true);
      if (raf.current) cancelAnimationFrame(raf.current);
      clearTimeout(timer.current);
    };
  }, []);

  return { heading, state, accuracy, enable };
}

// دوران تراكمي سلس (يتجنّب قفزة ٣٥٩→٠)
function useSmoothRotation(target) {
  const acc = React.useRef(0);
  const last = React.useRef(null);
  if (target != null) {
    if (last.current == null) { acc.current = -target; last.current = target; }
    else {
      let d = target - last.current;
      if (d > 180) d -= 360; if (d < -180) d += 360;
      acc.current -= d; last.current = target;
    }
  }
  return acc.current;
}

// ── المواقيت: مصدر موثوق (Aladhan) فوراً من الحساب المحلي ثم يُحدَّث من المصدر ──
function usePrayerTimes(place, now) {
  const dayKey = now.toDateString();
  const calc = () => ({
    today: PrayerTimes.localTimes(place.lat, place.lng, now, place.school),
    tomorrow: (() => { const d = new Date(now); d.setDate(d.getDate() + 1); return PrayerTimes.localTimes(place.lat, place.lng, d, place.school); })(),
  });
  const [data, setData] = React.useState(() => ({ ...calc(), src: 'calc' }));

  React.useEffect(() => {
    let alive = true;
    const base = calc();
    setData({ ...base, src: 'calc' }); // فوري دون انتظار الشبكة
    const d2 = new Date(now); d2.setDate(d2.getDate() + 1);
    const opt = { method: place.method, school: place.school };
    Promise.all([
      PrayerTimes.fetchTimes(place.lat, place.lng, now, opt),
      PrayerTimes.fetchTimes(place.lat, place.lng, d2, opt),
    ]).then(([a, b]) => { if (alive) setData({ today: a.times, tomorrow: b.times, src: a.src }); })
      .catch(() => {});
    return () => { alive = false; };
  }, [place.lat, place.lng, place.method, place.school, dayKey]);

  // احفظ مواقيت اليوم لتقرأها الشاشة الرئيسية فتطابقها تماماً
  React.useEffect(() => {
    try {
      localStorage.setItem('afnan-today-v1', JSON.stringify({
        day: dayKey, lat: place.lat, lng: place.lng, times: data.today,
      }));
    } catch (e) {}
  }, [data.today, place.lat, place.lng, dayKey]);

  return data;
}

// ── شاشة صلاتي ─────────────────────────────────────────────────────────
function PrayerScreen({ hijri, city = 'الرياض', adhanOn, onAdhan }) {
  const t = window.t;
  const now = usePrayerClock();
  const { place, real, status, locate, pickManual, setMethod, setSchool } = useLocation();
  const compass = useCompass();
  const adhan = useAdhanPlayer();
  const [sheet, setSheet] = React.useState(false);

  // المواقيت لليوم والغد — من مصدر موثوق مع احتياط فلكي
  const ptd = usePrayerTimes(place, now);
  const times = ptd.today;
  const tomorrow = ptd.tomorrow;

  const LIST = [
    { key: 'fajr',    name: t('p_fajr'),    img: 'assets/salati/moon.png',         h: times.fajr },
    { key: 'sunrise', name: t('p_sunrise'), img: 'assets/salati/sunrise.png',      h: times.sunrise, minor: true },
    { key: 'dhuhr',   name: t('p_dhuhr'),   img: 'assets/salati/sun.png',          h: times.dhuhr },
    { key: 'asr',     name: t('p_asr'),     img: 'assets/salati/sun.png',          h: times.asr },
    { key: 'maghrib', name: t('p_maghrib'), img: 'assets/salati/sunsit.png',       h: times.maghrib },
    { key: 'isha',    name: t('p_isha'),    img: 'assets/salati/cloudy-night.png', h: times.isha },
  ];

  // الصلاة القادمة + العد التنازلي الحقيقي
  const nowH = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  const main = LIST.filter(p => !p.minor);
  let next = main.find(p => p.h > nowH);
  let nextH = next ? next.h : tomorrow.fajr + 24;
  if (!next) next = { key: 'fajr', name: t('p_fajr'), h: tomorrow.fajr };
  const diffS = Math.max(0, Math.round((nextH - nowH) * 3600));
  const cd = `${window.tnum(Math.floor(diffS / 3600))}:${window.tnum(String(Math.floor(diffS / 60) % 60).padStart(2, '0'))}:${window.tnum(String(diffS % 60).padStart(2, '0'))}`;

  // رفع الأذان تلقائياً عند دخول الوقت — أذان الفجر للفجر، والأذان العام لباقي الصلوات
  const lastH = React.useRef(null);
  React.useEffect(() => {
    const prev = lastH.current;
    lastH.current = nowH;
    if (prev == null || nowH < prev) return; // أول قراءة أو لفّ منتصف الليل
    main.forEach(p => {
      if (prev < p.h && nowH >= p.h && adhanOn.all && adhanOn[p.key]) {
        adhan.play(p.key === 'fajr' ? 'fajr' : 'other');
      }
    });
  }, [nowH]);

  // القبلة
  const qibla = React.useMemo(() => PrayerCalc.qiblaBearing(place.lat, place.lng), [place.lat, place.lng]);
  const distKm = React.useMemo(() => Math.round(PrayerCalc.kaabaDistance(place.lat, place.lng)), [place.lat, place.lng]);

  // الاتجاه الحيّ من مستشعر الهاتف فقط — تدور الدائرة مع دوران الهاتف
  const liveHeading = compass.state === 'on' ? compass.heading : null;
  const dialRot = useSmoothRotation(liveHeading);

  const delta = liveHeading == null ? null : ((qibla - liveHeading + 540) % 360) - 180; // -180..180
  const aligned = delta != null && Math.abs(delta) <= 5;
  // دقّة منخفضة (iOS فقط يوفّر قيمة) → نعرض تعليمات المعايرة
  const lowAccuracy = compass.state === 'on' && compass.accuracy != null && (compass.accuracy < 0 || compass.accuracy > 22);
  const wasAligned = React.useRef(false);
  React.useEffect(() => {
    if (aligned && !wasAligned.current && navigator.vibrate) navigator.vibrate([18, 40, 60]);
    wasAligned.current = aligned;
  }, [aligned]);

  return (
    <Screen>
      <div style={{ margin: '6px 2px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: T.fHead, fontSize: 30, fontWeight: 700, color: T.ink }}>{t('tab_prayer')}</h1>
          <div style={{ marginTop: 4, fontFamily: T.fBody, fontSize: 14, color: T.inkMuted }}>{hijri}</div>
        </div>
        {/* شارة الموقع — تضغط لتغيير الموقع يدوياً أو إعادة التحديد */}
        <button onClick={() => setSheet(true)} className="afn-tap" style={{
          border: `1px solid ${T.mintEdge}`, cursor: 'pointer', background: T.mint,
          borderRadius: 16, padding: '7px 12px', display: 'flex', alignItems: 'center', gap: 8, maxWidth: 200 }}>
          <Icon name="pin" size={17} color={T.greenMid} />
          <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
            <span style={{ fontFamily: T.fBody, fontSize: 13.5, fontWeight: 700, color: T.green, lineHeight: 1.25,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 150 }}>
              {status === 'locating' ? t('pr_locating') : (place.city || t('pr_loc_title'))}
            </span>
            {status !== 'locating' && (place.sub || place.manual) && (
              <span style={{ fontFamily: T.fBody, fontSize: 11, fontWeight: 500, color: T.inkMuted, lineHeight: 1.25,
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 150 }}>
                {place.sub || t('pr_loc_manual')}
              </span>
            )}
          </span>
        </button>
      </div>

      {(status === 'denied' || status === 'unsupported') && !real && (
        <div style={{ marginBottom: 14, padding: '11px 16px', borderRadius: 16, background: '#FBF3DD',
          border: '1px solid #EEDFB6', fontFamily: T.fBody, fontSize: 13, color: '#7A5E1F', lineHeight: 1.7 }}>
          {t('pr_denied_msg')}
          <span onClick={locate} style={{ textDecoration: 'underline', cursor: 'pointer', marginRight: 6, fontWeight: 700 }}>{t('pr_retry')}</span>
        </div>
      )}

      {/* بطاقة الصلاة القادمة */}
      <div style={{ position: 'relative', borderRadius: 26, padding: '22px 22px 24px', overflow: 'hidden',
        background: 'linear-gradient(165deg,#1E6F50,#0C4636)', boxShadow: '0 14px 34px rgba(14,74,56,.26)' }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.16,
          background: 'radial-gradient(circle at 82% -10%, #BFE2CB, transparent 55%)' }} />
        <div style={{ position: 'relative', textAlign: 'center' }}>
          <div style={{ fontFamily: T.fBody, fontSize: 13.5, color: T.goldSoft, fontWeight: 600 }}>{t('h_next')}</div>
          <div style={{ fontFamily: T.fHead, fontSize: 34, fontWeight: 700, color: '#fff', marginTop: 4 }}>{next.name}</div>
          <div style={{ fontFamily: T.fHead, fontSize: 15, color: 'rgba(255,255,255,.82)', marginTop: 2 }}>{fmtHour(next.h % 24)}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 14,
            background: 'rgba(255,255,255,.14)', padding: '9px 18px', borderRadius: 999 }}>
            <Icon name="clock" size={16} color="#fff" />
            <span style={{ fontFamily: T.fHead, fontSize: 19, fontWeight: 700, color: '#fff', letterSpacing: 1,
              fontVariantNumeric: 'tabular-nums' }}>{cd}</span>
          </div>
        </div>
      </div>

      {/* مواقيت اليوم */}
      <SectionLabel>{t('pr_today')}</SectionLabel>
      <Card style={{ overflow: 'hidden' }}>
        {LIST.map((p, i) => {
          const isNext = !p.minor && p.key === next.key;
          const passed = !p.minor && p.h <= nowH && !isNext;
          return (
            <div key={p.key} style={{ display: 'flex', alignItems: 'center', gap: 13, padding: p.minor ? '10px 16px' : '14px 16px',
              background: isNext ? T.mint : 'transparent',
              borderBottom: i < LIST.length - 1 ? `1px solid ${T.line}` : 'none' }}>
              <div style={{ width: p.minor ? 34 : 40, height: p.minor ? 34 : 40, borderRadius: 12, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isNext ? T.mint : T.bgSink }}>
                <img src={p.img} alt={p.name} draggable="false"
                  style={{ width: p.minor ? 22 : 28, height: p.minor ? 22 : 28, objectFit: 'contain', pointerEvents: 'none' }} />
              </div>
              <div style={{ flex: 1, fontFamily: T.fHead, fontSize: p.minor ? 15 : 17.5,
                fontWeight: p.minor ? 500 : 600, color: p.minor ? T.inkMuted : (passed ? T.inkSoft : T.ink) }}>{p.name}</div>
              <div style={{ fontFamily: T.fBody, fontSize: p.minor ? 14 : 16, fontWeight: 600,
                color: isNext ? T.green : (p.minor || passed ? T.inkMuted : T.inkSoft), fontVariantNumeric: 'tabular-nums' }}>{fmtHour(p.h)}</div>
              {!p.minor && (
                <span onClick={() => onAdhan(p.key)} className="afn-tap" style={{ cursor: 'pointer', display: 'inline-flex', padding: 4 }}>
                  <Icon name="bell" size={17} color={adhanOn[p.key] ? T.gold : T.inkMuted} fill={adhanOn[p.key] ? T.gold : 'none'} stroke={1.8} />
                </span>
              )}
            </div>
          );
        })}
      </Card>
      {ptd.src === 'calc' && (
        <div style={{ fontFamily: T.fBody, fontSize: 11.5, color: T.inkMuted, textAlign: 'center', marginTop: 8, opacity: 0.9 }}>
          {t('pr_src_offline')}
        </div>
      )}

      {/* بوصلة القبلة — لوحة فاخرة هادئة */}
      <SectionLabel>{t('pr_qibla')}</SectionLabel>
      <div style={{ position: 'relative', borderRadius: 28, overflow: 'hidden', padding: '24px 18px 22px',
        background: 'linear-gradient(180deg,#FCFEFA 0%, #F1F7EE 100%)', border: `1px solid ${aligned ? T.green2 : T.line}`,
        boxShadow: aligned ? `0 0 0 1.5px ${T.leaf}, 0 20px 52px rgba(46,139,102,.20)` : '0 1px 2px rgba(38,53,45,.04), 0 14px 40px rgba(38,53,45,.07)',
        transition: 'box-shadow .55s ease, border-color .55s ease' }}>
        {/* توهّج زخرفيّ خفيف من الأعلى */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(125% 75% at 50% -18%, rgba(124,192,154,.20), transparent 62%)' }} />

        {/* واجهة طلب الموقع — تظهر بأناقة إن لم يُمنح إذن الموقع */}
        {!real && (status === 'denied' || status === 'unsupported') && (
          <QiblaLocNeeded onLocate={locate} />
        )}

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <QiblaCompass rot={dialRot} qibla={qibla} aligned={aligned}
            state={compass.state} onEnable={compass.enable} />

          {/* رسالة المحاذاة الأنيقة */}
          <div style={{ minHeight: 34, marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {aligned ? (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 16px', borderRadius: 999,
                background: `linear-gradient(120deg,${T.green},${T.greenMid})`, color: '#fff',
                boxShadow: `0 8px 22px ${T.green}44`, animation: 'afn-pop .4s cubic-bezier(.22,1,.36,1) both' }}>
                <Icon name="check" size={16} color="#fff" stroke={2.6} />
                <span style={{ fontFamily: T.fHead, fontSize: 15, fontWeight: 700 }}>{t('pr_aligned_toast')}</span>
              </div>
            ) : (
              <div style={{ fontFamily: T.fHead, fontSize: 15.5, fontWeight: 700, color: T.ink, textAlign: 'center', opacity: .92 }}>
                {compass.state === 'prompt' || compass.state === 'init' ? t('pr_tap_comp')
                  : compass.state === 'unsupported' ? window.tf('pr_angle', { x: window.tnum(Math.round(qibla)) })
                  : t('pr_qibla_sub')}
              </div>
            )}
          </div>

          {/* المسافة إلى مكّة المكرّمة — بشكل أنيق */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 6, padding: '9px 18px', borderRadius: 999,
            background: '#fff', border: `1px solid ${T.line}`, boxShadow: '0 4px 16px rgba(38,53,45,.06)' }}>
            <KaabaGlyph size={20} />
            <span style={{ fontFamily: T.fHead, fontSize: 17, fontWeight: 700, color: T.green, fontVariantNumeric: 'tabular-nums' }}>
              {window.tnum(distKm.toLocaleString('en-US'))} <span style={{ fontSize: 12.5, fontWeight: 600, color: T.inkMuted }}>{t('pr_unit_km')}</span>
            </span>
            <span style={{ width: 4, height: 4, borderRadius: 99, background: T.goldSoft }} />
            <span style={{ fontFamily: T.fBody, fontSize: 13, fontWeight: 600, color: T.inkSoft }}>{t('pr_to_mecca')}</span>
          </div>

          {/* زاوية القبلة + الاتجاه الحالي — واضحة وغير مزعجة */}
          <div style={{ marginTop: 11, display: 'flex', alignItems: 'center', gap: 9, flexWrap: 'wrap', justifyContent: 'center' }}>
            <span style={{ fontFamily: T.fBody, fontSize: 12.5, color: T.inkMuted }}>
              {window.tf('pr_angle', { x: window.tnum(Math.round(qibla)) })}
            </span>
            {compass.state === 'on' && (
              <React.Fragment>
                <span style={{ width: 3, height: 3, borderRadius: 99, background: T.mintEdge }} />
                <span style={{ fontFamily: T.fBody, fontSize: 12.5, color: T.inkMuted, fontVariantNumeric: 'tabular-nums' }}>
                  {window.tf('pr_heading', { x: window.tnum(Math.round(((liveHeading || 0) % 360 + 360) % 360)) })}
                </span>
              </React.Fragment>
            )}
          </div>

          {/* تعليمات المعايرة عند ضعف الدقّة */}
          {lowAccuracy && (
            <div style={{ marginTop: 13, display: 'flex', alignItems: 'center', gap: 9, padding: '9px 14px', borderRadius: 14,
              background: '#FBF3DD', border: '1px solid #EEDFB6', maxWidth: 320 }}>
              <span style={{ flexShrink: 0, display: 'inline-flex' }}><Icon name="compass" size={16} color="#B58A2E" /></span>
              <span style={{ fontFamily: T.fBody, fontSize: 12, color: '#7A5E1F', lineHeight: 1.6 }}>{t('pr_calibrate')}</span>
            </div>
          )}

          {/* تلميح سطح المكتب */}
          {compass.state === 'unsupported' && (
            <div style={{ fontFamily: T.fBody, fontSize: 11.5, color: T.inkMuted, marginTop: 12, opacity: 0.85, lineHeight: 1.7, textAlign: 'center', maxWidth: 300 }}>
              {t('pr_comp_hint')}
            </div>
          )}
        </div>
      </div>

      {/* صوت الأذان يُرفع تلقائياً عند دخول الوقت — يُتحكّم به لكل صلاة عبر أيقونة الجرس في القائمة */}

      {sheet && (
        <LocationSheet place={place} status={status} onClose={() => setSheet(false)}
          onGPS={locate} onPick={(sel) => { pickManual(sel); }} onMethod={setMethod} onSchool={setSchool} />
      )}
    </Screen>
  );
}

// أيقونة الكعبة المشرّفة (صورة)
function KaabaGlyph({ size = 44 }) {
  return <img src="assets/salati/kaaba.png" alt="" draggable="false"
    style={{ width: size, height: size, objectFit: 'contain', display: 'block', pointerEvents: 'none' }} />;
}

// ── واجهة طلب الموقع الأنيقة (إذن الموقع غير ممنوح) ─────────────────────
function QiblaLocNeeded({ onLocate }) {
  const t = window.t;
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 13, marginBottom: 18,
      padding: '14px 15px', borderRadius: 18, background: '#fff', border: `1px solid ${T.line}`,
      boxShadow: '0 6px 20px rgba(38,53,45,.06)' }}>
      <div style={{ width: 44, height: 44, borderRadius: 13, flexShrink: 0, background: T.mint,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="pin" size={22} color={T.greenMid} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.fHead, fontSize: 15.5, fontWeight: 700, color: T.ink }}>{t('pr_loc_needed_t')}</div>
        <div style={{ fontFamily: T.fBody, fontSize: 12, color: T.inkMuted, marginTop: 2, lineHeight: 1.6 }}>{t('pr_loc_needed_b')}</div>
      </div>
      <button onClick={onLocate} className="afn-tap" style={{ flexShrink: 0, border: 'none', cursor: 'pointer',
        background: T.green, color: '#fff', fontFamily: T.fHead, fontSize: 13, fontWeight: 700,
        padding: '9px 14px', borderRadius: 13, boxShadow: `0 6px 16px ${T.green}33` }}>{t('pr_loc_enable')}</button>
    </div>
  );
}

// ── بوصلة القبلة — قرص فاخر بعمقٍ ناعم، الكعبة هي العنصر المحوريّ ──────────
function QiblaCompass({ rot, qibla, aligned, state, onEnable }) {
  const t = window.t;
  const SIZE = 264, C = SIZE / 2, R = C - 10;
  const needPermission = state !== 'on' && state !== 'unsupported';
  const kaabaAngle = rot + qibla;   // درجات، ٠ = أعلى
  const ease = 'transform .25s cubic-bezier(.22,1,.36,1)';

  // علامات التدرّج (كل ٥°)
  const ticks = [];
  for (let i = 0; i < 72; i++) {
    const ang = i * 5, card = i % 18 === 0, major = i % 6 === 0;
    const rad = ang * Math.PI / 180, ux = Math.sin(rad), uy = -Math.cos(rad);
    const inner = card ? R - 17 : major ? R - 12 : R - 7;
    ticks.push({ x1: C + ux * (R - 2), y1: C + uy * (R - 2), x2: C + ux * inner, y2: C + uy * inner, card, major });
  }
  // الاتجاهات الأصليّة بالعربيّة
  const CARD = [{ l: 'شمال', a: 0, n: true }, { l: 'شرق', a: 90 }, { l: 'جنوب', a: 180 }, { l: 'غرب', a: 270 }];
  const rr = R - 34;       // نصف قطر مدار الاتجاهات
  const km = R - 30;       // مدار الكعبة (قرب الحافة)
  const beamColor = aligned ? T.greenMid : 'url(#qbeam)';

  return (
    <div style={{ position: 'relative', width: SIZE, height: SIZE }}>
      {/* هالة المحاذاة الهادئة (نبض خفيف عند المطابقة) */}
      <div style={{ position: 'absolute', inset: -18, borderRadius: '50%', pointerEvents: 'none',
        background: `radial-gradient(circle, ${T.leaf} 0%, transparent 66%)`,
        opacity: aligned ? 0.55 : 0, transition: 'opacity .5s',
        animation: aligned ? 'afn-qpulse 2.4s ease-in-out infinite' : 'none' }} />

      {/* ظلّ خارجيّ ناعم للعمق */}
      <div style={{ position: 'absolute', inset: 6, borderRadius: '50%', pointerEvents: 'none',
        boxShadow: '0 18px 40px rgba(38,53,45,.18), inset 0 2px 6px rgba(255,255,255,.7)' }} />

      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} style={{ display: 'block', position: 'relative' }}>
        <defs>
          <radialGradient id="qbg" cx="50%" cy="34%" r="74%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="62%" stopColor="#F4F9F0" />
            <stop offset="100%" stopColor="#E3EEDE" />
          </radialGradient>
          <radialGradient id="qinner" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#EFF5EA" />
          </radialGradient>
          <linearGradient id="qbeam" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E0BC68" /><stop offset="55%" stopColor="#C9A24B" /><stop offset="100%" stopColor="#A9802E" />
          </linearGradient>
          <filter id="qsoft" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#26352D" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* القرص الخارجيّ */}
        <circle cx={C} cy={C} r={R} fill="url(#qbg)" stroke={aligned ? T.green2 : T.mintEdge}
          strokeWidth="2" style={{ transition: 'stroke .45s' }} />
        {/* حلقة الاتجاهات الخارجيّة */}
        <circle cx={C} cy={C} r={R - 26} fill="none" stroke={T.line} strokeWidth="1.5" />
        <circle cx={C} cy={C} r={R - 27.5} fill="url(#qinner)" />

        {/* الوردة الدوّارة: العلامات + الاتجاهات الأصليّة */}
        <g style={{ transform: `rotate(${rot}deg)`, transformOrigin: `${C}px ${C}px`, transition: ease }}>
          {ticks.map((tk, i) => (
            <line key={i} x1={tk.x1} y1={tk.y1} x2={tk.x2} y2={tk.y2}
              stroke={tk.card ? T.greenMid : tk.major ? T.inkSoft : T.mintEdge}
              strokeWidth={tk.card ? 3 : tk.major ? 1.8 : 1} strokeLinecap="round" />
          ))}
          {CARD.map((c, i) => {
            const rad = c.a * Math.PI / 180, x = C + Math.sin(rad) * rr, y = C - Math.cos(rad) * rr;
            return (
              <g key={i} style={{ transform: `rotate(${-rot}deg)`, transformOrigin: `${x}px ${y}px` }}>
                <text x={x} y={y} textAnchor="middle" dominantBaseline="central"
                  fontFamily={T.fHead} fontSize={c.n ? 15 : 12.5} fontWeight="700"
                  fill={c.n ? T.green : T.inkMuted}>{c.l}</text>
              </g>
            );
          })}
        </g>

        {/* شعاع القبلة الذهبيّ + الكعبة — يدور باتجاه القبلة */}
        <g style={{ transform: `rotate(${kaabaAngle}deg)`, transformOrigin: `${C}px ${C}px`, transition: ease }}>
          {/* الشعاع المميّز */}
          <path d={`M ${C} ${C - km + 10} L ${C - 9} ${C} L ${C} ${C + 14} L ${C + 9} ${C} Z`}
            fill={beamColor} filter="url(#qsoft)" style={{ transition: 'fill .45s' }} />
          {/* مدار الكعبة دائماً قائم (عكس دوران المجموعة) */}
          <g style={{ transform: `rotate(${-kaabaAngle}deg)`, transformOrigin: `${C}px ${C - km}px` }}>
            {/* ميدالية الكعبة */}
            <circle cx={C} cy={C - km} r="22" fill="#fff" stroke={aligned ? T.green2 : T.goldSoft}
              strokeWidth="2" filter="url(#qsoft)" style={{ transition: 'stroke .45s' }} />
            <image href="assets/salati/kaaba.png" x={C - 16} y={C - km - 15} width="32" height="32" preserveAspectRatio="xMidYMid meet" />
          </g>
        </g>

        {/* مؤشّر ثابت أعلى القرص — حاذِ الكعبة معه */}
        <polygon points={`${C - 9},3 ${C + 9},3 ${C},18`} fill={aligned ? T.greenMid : T.gold}
          style={{ transition: 'fill .45s' }} />

        {/* محور المركز */}
        <circle cx={C} cy={C} r="9" fill="#fff" stroke={aligned ? T.greenMid : T.gold} strokeWidth="2.4" filter="url(#qsoft)" />
        <circle cx={C} cy={C} r="3" fill={aligned ? T.greenMid : T.gold} />
      </svg>

      {/* زر تفعيل البوصلة */}
      {needPermission && (
        <button onClick={onEnable} className="afn-tap" style={{
          position: 'absolute', inset: 0, borderRadius: '50%', border: 'none', cursor: 'pointer', zIndex: 6,
          background: 'rgba(20,40,32,.52)', backdropFilter: 'blur(3px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 9, padding: 18 }}>
          <span style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,.16)',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="compass" size={30} color="#fff" />
          </span>
          <span style={{ fontFamily: T.fHead, fontSize: 15.5, fontWeight: 700, color: '#fff' }}>{t('pr_tap_comp')}</span>
          <span style={{ fontFamily: T.fBody, fontSize: 11.5, color: 'rgba(255,255,255,.82)', textAlign: 'center', lineHeight: 1.6, maxWidth: 200 }}>{t('pr_comp_hint')}</span>
        </button>
      )}
    </div>
  );
}

// الكعبة داخل البوصلة (viewBox 48 — تُحجَّم لميدالية القرص)
function KaabaSVG() { return null; }

// ── ورقة تحديد الموقع: GPS أو بحث عن أي مدينة في العالم + طريقة الحساب ومذهب العصر ──
function LocationSheet({ place, status, onClose, onGPS, onPick, onMethod, onSchool }) {
  const t = window.t;
  const [q, setQ] = React.useState('');
  const [results, setResults] = React.useState(null);
  const [busy, setBusy] = React.useState(false);
  const timer = React.useRef(null);

  React.useEffect(() => {
    clearTimeout(timer.current);
    const query = q.trim();
    if (query.length < 2) { setResults(null); setBusy(false); return; }
    setBusy(true);
    timer.current = setTimeout(() => {
      fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=ar&format=json`)
        .then(r => r.json())
        .then(j => { setResults(j.results || []); setBusy(false); })
        .catch(() => { setResults([]); setBusy(false); });
    }, 350);
    return () => clearTimeout(timer.current);
  }, [q]);

  const METHODS = [
    { code: undefined, label: t('pr_loc_auto') },
    { code: 4, label: 'أم القرى' },
    { code: 3, label: 'رابطة العالم' },
    { code: 5, label: 'الهيئة المصرية' },
    { code: 2, label: 'ISNA' },
    { code: 1, label: 'كراتشي' },
    { code: 13, label: 'ديانت — تركيا' },
    { code: 8, label: 'الخليج' },
  ];

  const pick = (r) => {
    const sub = (r.admin1 && r.admin1 !== r.name) ? r.admin1 : (r.country || '');
    onPick({ lat: r.latitude, lng: r.longitude, city: r.name, sub });
    onClose();
  };
  const pillStyle = (on) => ({ border: `1px solid ${on ? T.greenMid : T.line}`, cursor: 'pointer',
    background: on ? T.mint : '#fff', color: on ? T.green : T.inkSoft, fontFamily: T.fBody,
    fontSize: 13, fontWeight: 600, padding: '8px 13px', borderRadius: 999 });

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(20,30,24,.42)', display: 'flex', alignItems: 'flex-end', animation: 'afn-fade .2s ease both' }}>
      <div onClick={e => e.stopPropagation()} className="afn-scroll" style={{ width: '100%', background: T.bg,
        borderTopLeftRadius: 26, borderTopRightRadius: 26, padding: '10px 18px 26px', maxHeight: '88%',
        overflowY: 'auto', boxShadow: '0 -10px 40px rgba(0,0,0,.22)', animation: 'afn-rise .28s cubic-bezier(.22,1,.36,1) both' }}>
        <div style={{ width: 40, height: 5, borderRadius: 99, background: T.mintEdge, margin: '0 auto 14px' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ margin: 0, fontFamily: T.fHead, fontSize: 21, fontWeight: 700, color: T.ink }}>{t('pr_loc_title')}</h2>
          <button onClick={onClose} className="afn-tap" style={{ border: 'none', background: T.bgSink, borderRadius: 12, padding: 8, cursor: 'pointer' }}>
            <Icon name="close" size={18} color={T.inkSoft} />
          </button>
        </div>

        {/* استخدام موقعي الحالي */}
        <button onClick={() => { onGPS(); onClose(); }} className="afn-tap" style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12,
          border: `1px solid ${T.mintEdge}`, background: T.mint, borderRadius: 16, padding: '13px 15px', cursor: 'pointer', marginBottom: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="compass" size={20} color={T.greenMid} />
          </div>
          <span style={{ fontFamily: T.fBody, fontSize: 15, fontWeight: 700, color: T.green }}>{t('pr_loc_current')}</span>
        </button>

        {/* بحث عن مدينة */}
        <div style={{ position: 'relative', marginBottom: 6 }}>
          <span style={{ position: 'absolute', insetInlineStart: 13, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
            <Icon name="search" size={18} color={T.inkMuted} />
          </span>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder={t('pr_loc_search')}
            style={{ width: '100%', boxSizing: 'border-box', fontFamily: T.fBody, fontSize: 15, color: T.ink,
              paddingBlock: 13, paddingInlineStart: 44, paddingInlineEnd: 15,
              borderRadius: 16, border: `1px solid ${T.line}`, background: '#fff', outline: 'none' }} />
        </div>

        {q.trim().length >= 2 && (
          <div style={{ marginBottom: 6 }}>
            {busy && <div style={{ padding: '10px 4px', fontFamily: T.fBody, fontSize: 13.5, color: T.inkMuted }}>{t('pr_loc_searching')}</div>}
            {!busy && results && results.length === 0 && <div style={{ padding: '10px 4px', fontFamily: T.fBody, fontSize: 13.5, color: T.inkMuted }}>{t('pr_loc_noresult')}</div>}
            {!busy && results && results.map((r, i) => (
              <button key={i} onClick={() => pick(r)} className="afn-tap" style={{ width: '100%', textAlign: 'start', display: 'flex', alignItems: 'center', gap: 11,
                border: 'none', borderBottom: `1px solid ${T.line}`, background: 'transparent', padding: '11px 4px', cursor: 'pointer' }}>
                <Icon name="pin" size={17} color={T.gold} />
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
                  <span style={{ fontFamily: T.fBody, fontSize: 15, fontWeight: 600, color: T.ink }}>{r.name}</span>
                  <span style={{ fontFamily: T.fBody, fontSize: 12, color: T.inkMuted }}>{[r.admin1, r.country].filter(Boolean).join('، ')}</span>
                </span>
              </button>
            ))}
          </div>
        )}

        {/* طريقة الحساب */}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontFamily: T.fBody, fontSize: 12.5, fontWeight: 700, color: T.inkSoft, marginBottom: 8 }}>{t('pr_loc_method')}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {METHODS.map((m, i) => {
              const on = (place.method == null && m.code == null) || place.method === m.code;
              return <button key={i} onClick={() => onMethod(m.code)} className="afn-tap" style={pillStyle(on)}>{m.label}</button>;
            })}
          </div>
        </div>

        <button onClick={onClose} className="afn-tap" style={{ width: '100%', marginTop: 22, border: 'none', cursor: 'pointer',
          background: T.greenMid, color: '#fff', fontFamily: T.fHead, fontSize: 16, fontWeight: 700, padding: '13px', borderRadius: 16 }}>
          {t('pr_loc_done')}
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { PrayerScreen });
