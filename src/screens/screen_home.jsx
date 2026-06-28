// screen_home.jsx — الرئيسية: تحية + التاريخ، الصلاة القادمة/الفائتة، حديث اليوم، قرآني · الأذكار.

const AR_DIGITS = s => String(s).replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[d]);

function fmtDur(mins) {
  const h = Math.floor(mins / 60), m = mins % 60;
  const hr = window.t('u_hr'), mn = window.t('u_min');
  if (h <= 0) return `${window.tnum(m)} ${mn}`;
  if (m === 0) return `${window.tnum(h)} ${hr}`;
  return `${window.tnum(h)} ${hr} ${window.tnum(m)} ${mn}`;
}

// مواقيت اليوم للموقع المختار (تُقرأ من نفس مصدر شاشة "صلاتي") — تتغيّر فور تغيير المدينة
const HOME_RIYADH = { lat: 24.7136, lng: 46.6753, school: 0 };
function homePrayerMinutes(now) {
  let place = null;
  try { place = JSON.parse(localStorage.getItem('afnan-geo-v2')); } catch (e) {}
  if (!place || place.lat == null) place = HOME_RIYADH;
  // إن كانت شاشة "صلاتي" قد حفظت مواقيت موثوقة لليوم لنفس المكان، نستعملها لتطابق تامّ
  try {
    const saved = JSON.parse(localStorage.getItem('afnan-today-v1'));
    if (saved && saved.day === now.toDateString() &&
        Math.abs(saved.lat - place.lat) < 0.01 && Math.abs(saved.lng - place.lng) < 0.01 && saved.times) {
      const tt = saved.times;
      return [['fajr', tt.fajr], ['dhuhr', tt.dhuhr], ['asr', tt.asr], ['maghrib', tt.maghrib], ['isha', tt.isha]]
        .map(([k, h]) => ({ key: k, m: Math.round(h * 60) }));
    }
  } catch (e) {}
  const tt = window.PrayerTimes
    ? window.PrayerTimes.localTimes(place.lat, place.lng, now, place.school || 0)
    : { fajr: 4.7, dhuhr: 12.3, asr: 15.85, maghrib: 18.57, isha: 20.03 };
  return [['fajr', tt.fajr], ['dhuhr', tt.dhuhr], ['asr', tt.asr], ['maghrib', tt.maghrib], ['isha', tt.isha]]
    .map(([k, h]) => ({ key: k, m: Math.round(h * 60) }));
}

function prayerStatus(now) {
  const sched = homePrayerMinutes(now);
  const lastM = sched[sched.length - 1].m;       // العشاء بالدقائق
  const mins = now.getHours() * 60 + now.getMinutes();
  let nx = sched.find(p => p.m > mins) || sched[0];
  let toNext = nx.m - mins; if (toNext < 0) toNext += 1440;
  let pv = null; for (const p of sched) if (p.m <= mins) pv = p;
  let prevKey, since;
  if (pv) { prevKey = pv.key; since = mins - pv.m; }
  else { prevKey = 'isha'; since = mins + (1440 - lastM); }
  return { next: { key: nx.key, left: fmtDur(toNext) }, prev: { key: prevKey, since: fmtDur(since) } };
}

function useMinuteClock() {
  const [now, setNow] = React.useState(new Date());
  React.useEffect(() => { const id = setInterval(() => setNow(new Date()), 20000); return () => clearInterval(id); }, []);
  return now;
}

// صفّ دخولٍ موحّد (قرآني · الأذكار)
function EntryRow({ thumb, title, message, onClick }) {
  return (
    <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 12 }} onClick={onClick}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, flexShrink: 0, overflow: 'hidden',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: thumb.bg }}>
          <img src={thumb.img} alt={title} style={{ width: 34, height: 34, objectFit: 'contain' }} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: T.fHead, fontSize: 17, fontWeight: 600, color: T.ink }}>{title}</div>
          <div style={{ fontFamily: T.fBody, fontSize: 13, color: T.inkMuted, marginTop: 2 }}>{message}</div>
        </div>
        <Icon name="chevron" size={20} color={T.inkMuted} />
      </div>
    </Card>
  );
}

function HomeScreen({ userName = 'عبدالله', hijriFirst = true, onNav, onOpenHadith }) {
  const t = window.t;
  const now = useMinuteClock();
  const ps = prayerStatus(now);
  const had = window.hadithOfDay ? window.hadithOfDay() : { text: '', ref: '' };
  const LOC = { ar: 'ar-SA', en: 'en-US', tr: 'tr-TR', ur: 'ur-PK', id: 'id-ID' }[window.AFN_LANG] || 'ar-SA';
  const isAr = window.AFN_LANG === 'ar';

  const hijri = (() => {
    try { return new Intl.DateTimeFormat(LOC + '-u-ca-islamic-umalqura',
      { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(now); }
    catch (e) { return 'الأربعاء ١٤ رمضان ١٤٤٧ هـ'; }
  })();
  const greg = (() => {
    try { return new Intl.DateTimeFormat(LOC, { day: 'numeric', month: 'long', year: 'numeric' }).format(now) + (isAr ? ' م' : ''); }
    catch (e) { return '١٠ يونيو ٢٠٢٦ م'; }
  })();

  return (
    <Screen pad={16}>
      {/* greeting + date */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', margin: '26px 2px 18px', gap: 12 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: T.fHead, fontSize: 23, fontWeight: 700, color: T.ink }}>{window.tf('h_salam', { name: userName })}</div>
          <div style={{ fontFamily: T.fBody, fontSize: 13, color: T.inkSoft, marginTop: 6 }}>{hijri}</div>
        </div>
      </div>

      {/* next + missed prayer side by side */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        {/* next (filled) */}
        <div onClick={() => onNav('prayer')} className="afn-tap" style={{ position: 'relative', borderRadius: 20,
          padding: '16px 16px 17px', overflow: 'hidden', cursor: 'pointer',
          background: 'linear-gradient(160deg,#1E6F50,#0E4A38)', boxShadow: '0 10px 24px rgba(14,74,56,.22)' }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.15, background: 'radial-gradient(circle at 85% -20%, #BFE2CB, transparent 55%)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: T.fBody, fontSize: 11.5, color: T.goldSoft, fontWeight: 600 }}>{t('h_next')}</div>
            <div style={{ fontFamily: T.fHead, fontSize: 22, fontWeight: 700, color: '#fff', marginTop: 3 }}>{t('p_' + ps.next.key)}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 9 }}>
              <Icon name="clock" size={13} color="rgba(255,255,255,.7)" />
              <span style={{ fontFamily: T.fBody, fontSize: 13, color: 'rgba(255,255,255,.82)' }}>{window.tf('h_after', { x: ps.next.left })}</span>
            </div>
          </div>
        </div>
        {/* missed (light) */}
        <div onClick={() => onNav('prayer')} className="afn-tap" style={{ position: 'relative', borderRadius: 20,
          padding: '16px 16px 17px', overflow: 'hidden', cursor: 'pointer',
          background: T.card, border: `1px solid ${T.line}`, boxShadow: '0 1px 2px rgba(38,53,45,.04), 0 6px 22px rgba(38,53,45,.05)' }}>
          <div style={{ fontFamily: T.fBody, fontSize: 11.5, color: T.clay, fontWeight: 700 }}>{t('h_missed')}</div>
          <div style={{ fontFamily: T.fHead, fontSize: 22, fontWeight: 700, color: T.ink, marginTop: 3 }}>{t('p_' + ps.prev.key)}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 9 }}>
            <Icon name="clock" size={13} color={T.inkMuted} />
            <span style={{ fontFamily: T.fBody, fontSize: 13, color: T.inkSoft }}>{window.tf('h_since', { x: ps.prev.since })}</span>
          </div>
        </div>
      </div>

      {/* hadith of the day — tap to open explanation & sanad */}
      <Card glow={T.gold} onClick={() => onOpenHadith && onOpenHadith(had)} style={{ padding: '18px 20px 15px', marginTop: 14, position: 'relative', overflow: 'hidden' }}>
        {/* decorative quote ornament in the corner */}
        <Icon name="quote" size={30} color={T.gold} />
        <div style={{ position: 'absolute', top: 16, insetInlineEnd: 20 }}>
          <span style={{ fontFamily: T.fBody, fontSize: 12.5, fontWeight: 700, color: T.gold }}>{t('h_hadith')}</span>
        </div>
        <p dir="rtl" style={{ margin: '6px 0 0', fontFamily: T.fScript, fontSize: 21, lineHeight: 2.05, color: T.ink, textAlign: 'center', fontWeight: 700 }}>
          «{had.text}»
        </p>
        {(() => { const tr = window.tc(had.text); return tr ? (
          <p dir={window.afnDir()} style={{ margin: '11px 0 0', fontFamily: T.fBody, fontSize: 14.5, lineHeight: 1.7,
            color: T.inkSoft, textAlign: 'center', textWrap: 'pretty' }}>{tr}</p>
        ) : null; })()}
        <div style={{ textAlign: 'center', marginTop: 11, fontFamily: T.fBody, fontSize: 12.5, color: T.inkMuted }}>{window.tcRef(had.ref) || had.ref}</div>
        {/* tap affordance */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          marginTop: 13, paddingTop: 12, borderTop: `1px solid ${T.gold}26` }}>
          <span style={{ fontFamily: T.fBody, fontSize: 12.5, fontWeight: 600, color: T.green }}>{t('h_tap_hadith')}</span>
          <Icon name="chevron" size={16} color={T.green} />
        </div>
      </Card>

      {/* entry rows */}
      <div style={{ height: 26 }} />
      <EntryRow onClick={() => onNav('quran')}
        thumb={{ img: 'assets/icons/qurani.png', bg: T.mint }}
        title={t('tab_quran')} message={t('h_quran_msg')} />

      <EntryRow onClick={() => onNav('adhkar')}
        thumb={{ img: 'assets/icons/adhkar.png', bg: '#E6E3F2' }}
        title={t('tab_adhkar')} message={t('h_adhkar_msg')} />

      {/* quick tasbih — fills the home footer */}
      <TasbihCard />
    </Screen>
  );
}

Object.assign(window, { HomeScreen });
