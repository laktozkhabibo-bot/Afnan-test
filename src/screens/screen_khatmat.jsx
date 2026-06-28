// screen_khatmat.jsx — نظام الختمات: فردية (تلاوة/حفظ) + جماعية (غرفة بأجزاء وشات)
// يعتمد على الحالة المحفوظة في app.jsx عبر khatmat + setKhatmat

const KH_JUZ = ['', 'الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس', 'السابع', 'الثامن', 'التاسع', 'العاشر',
  'الحادي عشر', 'الثاني عشر', 'الثالث عشر', 'الرابع عشر', 'الخامس عشر', 'السادس عشر', 'السابع عشر', 'الثامن عشر', 'التاسع عشر', 'العشرون',
  'الحادي والعشرون', 'الثاني والعشرون', 'الثالث والعشرون', 'الرابع والعشرون', 'الخامس والعشرون', 'السادس والعشرون', 'السابع والعشرون', 'الثامن والعشرون', 'التاسع والعشرون', 'الثلاثون'];
const khNum = (n) => Number(n).toLocaleString('ar-EG');

// بداية كل جزء (سورة، آية) لفتح المصحف عند موضع الجزء
const JUZ_START = {
  1: [1, 1], 2: [2, 142], 3: [2, 253], 4: [3, 93], 5: [4, 24], 6: [4, 148], 7: [5, 82], 8: [6, 111], 9: [7, 88], 10: [8, 41],
  11: [9, 93], 12: [11, 6], 13: [12, 53], 14: [15, 1], 15: [17, 1], 16: [18, 75], 17: [21, 1], 18: [23, 1], 19: [25, 21], 20: [27, 56],
  21: [29, 46], 22: [33, 31], 23: [36, 28], 24: [39, 32], 25: [41, 47], 26: [46, 1], 27: [51, 31], 28: [58, 1], 29: [67, 1], 30: [78, 1],
};

// الجزء الذي تقع فيه (سورة، آية) — يعتمد على بدايات الأجزاء بترتيب المصحف
function juzOf(surah, ayah) {
  let res = 1;
  for (let j = 1; j <= 30; j++) {
    const st = JUZ_START[j]; if (!st) continue;
    const [s, a] = st;
    if (surah > s || (surah === s && ayah >= a)) res = j; else break;
  }
  return res;
}
const surahMeta = (n) => (typeof SURAH_INDEX !== 'undefined' && SURAH_INDEX[n - 1]) || ['سورة ' + n, 286];

const KH_COLORS = ['#1E6F50', '#C9A24B', '#C98A5E', '#5C7CA6', '#7A6BA6', '#7A9A3C', '#2E8B66', '#B5654A'];
const KH_NAMES_POOL = ['أحمد', 'فاطمة', 'يوسف', 'مريم', 'خالد', 'نورة', 'سعد', 'هدى', 'عمر', 'ليلى', 'بلال', 'سارة'];

function khCount(map) { return Object.values(map || {}).filter(Boolean).length; }
function khGenCode() {
  const a = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'; let s = '';
  for (let i = 0; i < 6; i++) s += a[Math.floor(Math.random() * a.length)];
  return s;
}
function khHash(str) { let h = 1779033703; for (let i = 0; i < str.length; i++) { h = Math.imul(h ^ str.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); } return h >>> 0; }
function khRng(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

// ينشئ غرفة جماعية فارغة — المنشئ وحده، حتى يدعو الآخرين عبر الرابط
function khBuildRoom(code, meName, title) {
  return {
    code, meName, meColor: KH_COLORS[0], title: title || 'ختمة جماعية',
    members: [{ name: meName, color: KH_COLORS[0], me: true }],
    claims: {}, groupDone: {}, chat: [],
  };
}

// ── أدوات واجهة ───────────────────────────────────────────────────────
function KhSheet({ children, onClose }) {
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 90, display: 'flex', alignItems: 'flex-end',
      background: 'rgba(20,30,25,.4)', animation: 'afn-fade .2s ease both' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', background: T.bg, borderRadius: '26px 26px 0 0',
        padding: '20px 18px 28px', direction: 'rtl', animation: 'afn-rise .26s cubic-bezier(.22,1,.36,1) both' }}>
        <div style={{ width: 42, height: 5, borderRadius: 99, background: T.mintEdge, margin: '0 auto 16px' }} />
        {children}
      </div>
    </div>
  );
}
function KhToast({ msg }) {
  if (!msg) return null;
  return (
    <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', zIndex: 95,
      background: 'rgba(17,83,62,.95)', color: '#fff', padding: '11px 20px', borderRadius: 999, whiteSpace: 'nowrap',
      fontFamily: T.fBody, fontSize: 13.5, fontWeight: 600, boxShadow: '0 8px 24px rgba(17,83,62,.34)',
      animation: 'afn-pop .3s cubic-bezier(.34,1.56,.64,1) both', pointerEvents: 'none' }}>{msg}</div>
  );
}
function Avatar({ name, color, size = 30 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', flexShrink: 0, background: color,
      display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 6px ${color}44` }}>
      <span style={{ fontFamily: T.fHead, fontSize: size * 0.42, fontWeight: 700, color: '#fff' }}>{(name || '؟').slice(0, 1)}</span>
    </div>
  );
}
function KhHeader({ title, sub, onBack, right }) {
  return (
    <div style={{ flexShrink: 0, paddingTop: 50, paddingBottom: 16, padding: '50px 16px 16px',
      background: 'linear-gradient(180deg,#16614A,#11533E)', color: '#fff', position: 'relative',
      display: 'flex', alignItems: 'center', gap: 12 }}>
      <div onClick={onBack} className="afn-tap" style={{ width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
        background: 'rgba(255,255,255,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
        <Icon name="chevronL" size={21} color="#fff" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.fHead, fontSize: 19, fontWeight: 700, lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{title}</div>
        {sub && <div style={{ fontFamily: T.fBody, fontSize: 12.5, opacity: 0.85, marginTop: 2 }}>{sub}</div>}
      </div>
      {right}
    </div>
  );
}

// أيقونات صغيرة خاصّة بالختمات
function KhIcon({ name, size = 22, color = 'currentColor', stroke = 1.8 }) {
  const p = { fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    person: <g {...p}><circle cx="12" cy="8" r="3.4" /><path d="M5.5 20c.6-3.6 3.2-5.5 6.5-5.5S18 16.4 18.5 20" /></g>,
    group: <g {...p}><circle cx="9" cy="8.5" r="3" /><path d="M3.5 19c.5-3.1 2.7-4.8 5.5-4.8S14 15.9 14.5 19" /><path d="M16 5.6a3 3 0 0 1 0 5.8" /><path d="M17.5 14.4c2.3.5 3.7 2.1 4 4.6" /></g>,
    link: <g {...p}><path d="M9 13a4 4 0 0 0 5.7.4l2.6-2.6a4 4 0 1 0-5.7-5.7L10.5 6.4" /><path d="M15 11a4 4 0 0 0-5.7-.4L6.7 13.2a4 4 0 1 0 5.7 5.7l1.1-1.1" /></g>,
    chat: <g {...p}><path d="M20 11.5a7.5 7.5 0 0 1-10.6 6.8L4 19.5l1.3-4.1A7.5 7.5 0 1 1 20 11.5Z" /></g>,
    send: <g {...p}><path d="M19 4 L4 11l6 2 2 6 7-15Z" /><path d="M10 13l3.5-3.5" /></g>,
    copy: <g {...p}><rect x="9" y="9" width="11" height="11" rx="2.5" /><path d="M5 15V6a2 2 0 0 1 2-2h9" /></g>,
    plus: <g {...p}><path d="M12 5v14M5 12h14" /></g>,
    grid: <g {...p}><rect x="4" y="4" width="6" height="6" rx="1.5" /><rect x="14" y="4" width="6" height="6" rx="1.5" /><rect x="4" y="14" width="6" height="6" rx="1.5" /><rect x="14" y="14" width="6" height="6" rx="1.5" /></g>,
    ribbon: <g {...p}><path d="M7 4h10v15l-5-3.2L7 19V4Z" /></g>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }} fill="none">{paths[name]}</svg>;
}

// ── بطاقة ختمة في القائمة ─────────────────────────────────────────────
function KhCard({ kh, onOpen }) {
  const isGroup = kh.kind === 'group';
  const total = 30;
  const done = isGroup ? khCount(kh.groupDone) : khCount(kh.done);
  const pct = done / total;
  const tint = kh.kind === 'hifz' ? T.gold : isGroup ? '#5C7CA6' : T.green;
  const label = isGroup ? 'ختمة جماعية' : kh.kind === 'hifz' ? 'ختمة حفظ' : 'ختمة تلاوة';
  return (
    <Card onClick={onOpen} style={{ padding: 16, display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
      <Ring value={pct} size={56} stroke={5} color={tint}>
        <span style={{ fontFamily: T.fHead, fontSize: 14, fontWeight: 700, color: tint }}>{khNum(Math.round(pct * 100))}٪</span>
      </Ring>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.fHead, fontSize: 17, fontWeight: 700, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{kh.title}</div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 5 }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: tint + '18', color: tint,
            padding: '3px 10px', borderRadius: 999, fontFamily: T.fBody, fontSize: 11.5, fontWeight: 700 }}>
            <KhIcon name={isGroup ? 'group' : kh.kind === 'hifz' ? 'star' : 'person'} size={13} color={tint} />
            {label}
          </span>
          <span style={{ fontFamily: T.fBody, fontSize: 12, color: T.inkMuted }}>{khNum(done)} / {khNum(total)} جزء</span>
        </div>
      </div>
      <Icon name="chevronL" size={18} color={T.inkMuted} />
    </Card>
  );
}

// ── ورقة تحديد الموضع: تستشعر آخر موضع قراءة وتسأل عن الآية ──────────────
function KhMarkSheet({ kh, bookmark, onClose, onSave }) {
  const init = kh.mark || bookmark || { surah: 1, ayah: 1 };
  const [surah, setSurah] = React.useState(init.surah || 1);
  const [ayah, setAyah] = React.useState(init.ayah || 1);
  const meta = surahMeta(surah);
  const maxAyah = meta[1];
  const clamped = Math.min(Math.max(1, parseInt(ayah, 10) || 1), maxAyah);
  const juz = juzOf(surah, clamped);
  const tint = kh.kind === 'hifz' ? T.gold : T.green;
  return (
    <KhSheet onClose={onClose}>
      <div style={{ fontFamily: T.fHead, fontSize: 20, fontWeight: 700, color: T.ink, textAlign: 'center' }}>أين وصلتَ؟</div>
      <div style={{ fontFamily: T.fBody, fontSize: 12.5, color: T.inkMuted, textAlign: 'center', marginTop: 4 }}>
        حدِّد الآية التي بلغتَها لتُسجَّل علامتك ويتقدّم عدّ الأجزاء
      </div>

      {bookmark ? (
        <button onClick={() => { setSurah(bookmark.surah); setAyah(bookmark.ayah); }} className="afn-tap" style={{ width: '100%',
          marginTop: 16, cursor: 'pointer', textAlign: 'right', border: `1.5px solid ${T.mintEdge}`, background: T.mint,
          borderRadius: 14, padding: '13px 15px', display: 'flex', alignItems: 'center', gap: 11 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0, background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="book" size={19} color={T.green} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: T.fBody, fontSize: 11.5, fontWeight: 700, color: T.greenMid }}>آخر موضع قراءةٍ لك</div>
            <div style={{ fontFamily: T.fHead, fontSize: 15, fontWeight: 700, color: T.ink }}>
              سورة {surahMeta(bookmark.surah)[0]} · الآية {khNum(bookmark.ayah)}
            </div>
          </div>
          <span style={{ fontFamily: T.fBody, fontSize: 12, fontWeight: 700, color: T.green, whiteSpace: 'nowrap' }}>استخدمه</span>
        </button>
      ) : (
        <div style={{ marginTop: 16, padding: '12px 14px', borderRadius: 13, background: '#FBF3DD',
          border: '1px solid #EEDFB6', fontFamily: T.fBody, fontSize: 12.5, color: '#7A5E1F', lineHeight: 1.7 }}>
          لم تضع علامةً في المصحف بعد — اقرأ ثم احفظ موضعك، أو حدِّد السورة والآية يدويًّا أدناه.
        </div>
      )}

      <div style={{ marginTop: 14 }}>
        <div style={{ fontFamily: T.fBody, fontSize: 12.5, fontWeight: 700, color: T.inkSoft, marginBottom: 7 }}>السورة</div>
        <select value={surah} onChange={e => { setSurah(+e.target.value); setAyah(1); }} dir="rtl"
          style={{ width: '100%', padding: '13px 15px', borderRadius: 14, border: `1.5px solid ${T.mintEdge}`, outline: 'none',
            background: T.card, fontFamily: T.fHead, fontSize: 15.5, fontWeight: 600, color: T.ink, appearance: 'none' }}>
          {Array.from({ length: 114 }, (_, i) => i + 1).map(n => (
            <option key={n} value={n}>{khNum(n)} · {surahMeta(n)[0]}</option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: 14 }}>
        <div style={{ fontFamily: T.fBody, fontSize: 12.5, fontWeight: 700, color: T.inkSoft, marginBottom: 7 }}>
          الآية <span style={{ color: T.inkMuted, fontWeight: 600 }}>(١ – {khNum(maxAyah)})</span>
        </div>
        <input type="number" min="1" max={maxAyah} value={ayah} onChange={e => setAyah(e.target.value)} dir="rtl"
          style={{ width: '100%', padding: '13px 15px', borderRadius: 14, border: `1.5px solid ${T.mintEdge}`, outline: 'none',
            background: T.card, fontFamily: T.fHead, fontSize: 16, fontWeight: 600, color: T.ink, textAlign: 'center' }} />
      </div>

      <div style={{ marginTop: 14, padding: '12px 14px', borderRadius: 13, background: tint + '12',
        display: 'flex', alignItems: 'center', gap: 9 }}>
        <Icon name="book" size={17} color={tint} />
        <span style={{ fontFamily: T.fBody, fontSize: 13, color: T.inkSoft }}>
          يقع هذا الموضع في <b style={{ color: tint }}>الجزء {KH_JUZ[juz]}</b> — سيُحتسَب ما قبله مكتملًا
        </span>
      </div>

      <KhPrimary onClick={() => onSave({ surah, ayah: clamped, juz })} onBack={onClose}>حفظ العلامة</KhPrimary>
    </KhSheet>
  );
}

// ── الفردية: شبكة الأجزاء ─────────────────────────────────────────────
function KhIndividual({ kh, patch, onRead, onReadAt, bookmark }) {
  const done = kh.done || {};
  const count = khCount(done);
  const tint = kh.kind === 'hifz' ? T.gold : T.green;
  const nextJuz = Array.from({ length: 30 }, (_, i) => i + 1).find(j => !done[j]) || null;
  const toggle = (j) => patch(k => ({ ...k, done: { ...(k.done || {}), [j]: !(k.done || {})[j] } }));
  const [marking, setMarking] = React.useState(false);
  const mark = kh.mark || null;
  const saveMark = ({ surah, ayah, juz }) => {
    patch(k => {
      const d = { ...(k.done || {}) };
      for (let j = 1; j < juz; j++) d[j] = true;   // ما قبل موضعك يُحتسَب مكتملًا
      return { ...k, mark: { surah, ayah }, done: d };
    });
    setMarking(false);
  };
  return (
    <div className="afn-scroll" style={{ flex: 1, overflowY: 'auto', padding: '18px 18px 28px', direction: 'rtl' }}>
      {/* تقدّم */}
      <Card style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18 }}>
        <Ring value={count / 30} size={70} stroke={6} color={tint}>
          <span style={{ fontFamily: T.fHead, fontSize: 17, fontWeight: 700, color: tint }}>{khNum(Math.round(count / 30 * 100))}٪</span>
        </Ring>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: T.fHead, fontSize: 16, fontWeight: 700, color: T.ink }}>
            أكملتَ {khNum(count)} من ٣٠ جزءًا
          </div>
          <div style={{ fontFamily: T.fBody, fontSize: 13, color: T.inkMuted, marginTop: 3 }}>
            {count === 30 ? 'تمّت الختمة، تقبّل الله 🌿' : `بقي ${khNum(30 - count)} جزءًا · ${kh.kind === 'hifz' ? 'حفظًا' : 'تلاوةً'}`}
          </div>
        </div>
      </Card>

      {/* علامة الموضع الحالي */}
      <Card style={{ padding: 16, marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: mark ? tint + '18' : T.bgSink,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="book" size={21} color={mark ? tint : T.inkMuted} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: T.fBody, fontSize: 11.5, fontWeight: 700, color: T.inkMuted }}>علامتك الحالية</div>
            <div style={{ fontFamily: T.fHead, fontSize: 15.5, fontWeight: 700, color: T.ink }}>
              {mark ? `سورة ${surahMeta(mark.surah)[0]} · الآية ${khNum(mark.ayah)}` : 'لم تُحدَّد بعد'}
            </div>
          </div>
          {mark && (
            <button onClick={() => onReadAt && onReadAt(mark.surah, mark.ayah)} className="afn-tap" title="تابع من هنا"
              style={{ border: `1.5px solid ${T.mintEdge}`, cursor: 'pointer', background: T.card, color: T.green,
                borderRadius: 11, padding: '9px 13px', fontFamily: T.fHead, fontSize: 13, fontWeight: 700 }}>تابِع</button>
          )}
        </div>
        <button onClick={() => setMarking(true)} className="afn-tap" style={{ width: '100%', marginTop: 12, border: 'none', cursor: 'pointer',
          padding: '12px', borderRadius: 13, fontFamily: T.fHead, fontSize: 14.5, fontWeight: 700, color: tint,
          background: tint + '14', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <KhIcon name="ribbon" size={17} color={tint} /> {mark ? 'حدِّث موضعك' : 'أين وصلتَ؟ ضَع علامة'}
        </button>
      </Card>

      {nextJuz && (
        <button onClick={() => onRead(nextJuz)} className="afn-tap" style={{ width: '100%', border: 'none', cursor: 'pointer',
          padding: '14px', borderRadius: 16, marginBottom: 18, fontFamily: T.fHead, fontSize: 15.5, fontWeight: 700, color: '#fff',
          background: `linear-gradient(180deg,${T.greenMid},${T.green})`, boxShadow: `0 8px 20px ${T.green}33`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9 }}>
          <Icon name="book" size={19} color="#fff" />
          اقرأ الجزء {KH_JUZ[nextJuz]}
        </button>
      )}

      <div style={{ fontFamily: T.fHead, fontSize: 14.5, fontWeight: 700, color: T.inkSoft, margin: '0 2px 12px' }}>الأجزاء — اضغط لتسجيل الإتمام</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 9 }}>
        {Array.from({ length: 30 }, (_, i) => i + 1).map(j => {
          const on = !!done[j];
          return (
            <button key={j} onClick={() => toggle(j)} className="afn-tap" style={{ aspectRatio: '1', border: on ? 'none' : `1.5px solid ${T.mintEdge}`,
              cursor: 'pointer', borderRadius: 14, background: on ? `linear-gradient(180deg,${tint},${tint}cc)` : T.card,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
              boxShadow: on ? `0 4px 12px ${tint}33` : 'none', transition: 'all .2s' }}>
              <span style={{ fontFamily: T.fHead, fontSize: 17, fontWeight: 700, color: on ? '#fff' : T.ink }}>{khNum(j)}</span>
              {on
                ? <Icon name="check" size={13} color="#fff" stroke={2.6} />
                : <span style={{ fontFamily: T.fBody, fontSize: 8.5, color: T.inkMuted }}>جزء</span>}
            </button>
          );
        })}
      </div>
      {marking && <KhMarkSheet kh={kh} bookmark={bookmark} onClose={() => setMarking(false)} onSave={saveMark} />}
    </div>
  );
}
// ── الجماعية: غرفة بأجزاء + شات ───────────────────────────────────────
function KhGroup({ kh, patch, onRead, toast }) {
  const [view, setView] = React.useState('juz');  // juz | chat
  const claims = kh.claims || {}, groupDone = kh.groupDone || {};
  const done = khCount(groupDone), claimed = Object.keys(claims).length;
  const memberByName = (n) => kh.members.find(m => m.name === n) || { name: n, color: '#999' };

  const claim = (j) => patch(k => ({ ...k, claims: { ...k.claims, [j]: k.meName } }));
  const release = (j) => patch(k => { const c = { ...k.claims }; delete c[j]; const g = { ...k.groupDone }; delete g[j]; return { ...k, claims: c, groupDone: g }; });
  const toggleDone = (j) => patch(k => ({ ...k, groupDone: { ...k.groupDone, [j]: !k.groupDone[j] } }));

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, direction: 'rtl' }}>
      {/* شريط المشاركين + التقدّم */}
      <div style={{ flexShrink: 0, padding: '14px 16px', borderBottom: `1px solid ${T.line}`, background: T.card }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Ring value={done / 30} size={50} stroke={5} color="#5C7CA6">
            <span style={{ fontFamily: T.fHead, fontSize: 12.5, fontWeight: 700, color: '#5C7CA6' }}>{khNum(done)}/٣٠</span>
          </Ring>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: T.fBody, fontSize: 12.5, color: T.inkSoft, fontWeight: 600 }}>
              {khNum(claimed)} جزءًا محجوزًا · {khNum(done)} مكتمل
            </div>
            <div style={{ display: 'flex', marginTop: 6 }}>
              {kh.members.map((m, i) => (
                <div key={i} style={{ marginInlineStart: i ? -8 : 0, border: '2px solid ' + T.card, borderRadius: '50%' }}>
                  <Avatar name={m.name} color={m.color} size={26} />
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => { khCopy(khShareText(kh)); toast('نُسخ رابط الدعوة'); }} className="afn-tap" style={{ border: 'none',
            cursor: 'pointer', background: T.mint, color: T.green, borderRadius: 12, padding: '9px 12px',
            display: 'flex', alignItems: 'center', gap: 6, fontFamily: T.fBody, fontSize: 12.5, fontWeight: 700 }}>
            <KhIcon name="link" size={15} color={T.green} /> دعوة
          </button>
        </div>
      </div>

      {/* تبويب */}
      <div style={{ flexShrink: 0, display: 'flex', gap: 8, padding: '12px 16px 4px' }}>
        {[['juz', 'الأجزاء', 'grid'], ['chat', 'المحادثة', 'chat']].map(([k, lbl, ic]) => {
          const on = view === k;
          return (
            <button key={k} onClick={() => setView(k)} className="afn-tap" style={{ flex: 1, border: 'none', cursor: 'pointer',
              padding: '10px', borderRadius: 12, background: on ? T.green : T.mint, color: on ? '#fff' : T.green,
              fontFamily: T.fHead, fontSize: 14.5, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
              <KhIcon name={ic} size={16} color={on ? '#fff' : T.green} /> {lbl}
            </button>
          );
        })}
      </div>

      {view === 'juz' ? (
        <div className="afn-scroll" style={{ flex: 1, overflowY: 'auto', padding: '8px 16px 24px', minHeight: 0 }}>
          {Array.from({ length: 30 }, (_, i) => i + 1).map(j => {
            const owner = claims[j];
            const mine = owner === kh.meName;
            const isDone = !!groupDone[j];
            const m = owner ? memberByName(owner) : null;
            return (
              <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '11px 13px', marginBottom: 8,
                borderRadius: 14, background: T.card, border: `1px solid ${mine ? T.greenMid + '55' : T.line}`,
                boxShadow: '0 1px 2px rgba(38,53,45,.03)' }}>
                <div style={{ width: 38, height: 38, borderRadius: 11, flexShrink: 0, background: isDone ? T.green : T.mint,
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontFamily: T.fHead, fontSize: 15, fontWeight: 700, color: isDone ? '#fff' : T.green }}>{khNum(j)}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: T.fHead, fontSize: 15, fontWeight: 600, color: T.ink }}>الجزء {KH_JUZ[j]}</div>
                  <div style={{ fontFamily: T.fBody, fontSize: 12, color: owner ? (mine ? T.greenMid : T.inkSoft) : T.inkMuted, marginTop: 1 }}>
                    {owner ? (mine ? 'مُكفَّلٌ بك' + (isDone ? ' · تمّت ✓' : '') : `${owner}${isDone ? ' · تمّت' : ''}`) : 'متاحٌ للحجز'}
                  </div>
                </div>
                {owner && !mine && <Avatar name={m.name} color={m.color} size={28} />}
                {!owner && (
                  <button onClick={() => claim(j)} className="afn-tap" style={{ border: 'none', cursor: 'pointer', background: T.green,
                    color: '#fff', borderRadius: 11, padding: '8px 16px', fontFamily: T.fHead, fontSize: 13.5, fontWeight: 700 }}>احجز</button>
                )}
                {mine && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <button onClick={() => onRead(j)} className="afn-tap" title="اقرأ" style={{ border: `1.5px solid ${T.mintEdge}`, cursor: 'pointer',
                      background: T.card, color: T.green, borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="book" size={17} color={T.green} />
                    </button>
                    <button onClick={() => toggleDone(j)} className="afn-tap" title="تمّت" style={{ border: isDone ? 'none' : `1.5px solid ${T.mintEdge}`,
                      cursor: 'pointer', background: isDone ? T.green : T.card, borderRadius: 10, width: 36, height: 36,
                      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="check" size={17} color={isDone ? '#fff' : T.inkMuted} stroke={2.4} />
                    </button>
                    <button onClick={() => release(j)} className="afn-tap" title="إلغاء الحجز" style={{ border: 'none', cursor: 'pointer',
                      background: 'transparent', borderRadius: 10, width: 30, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="close" size={15} color={T.inkMuted} stroke={2} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <KhChat kh={kh} patch={patch} />
      )}
    </div>
  );
}

function KhChat({ kh, patch }) {
  const [text, setText] = React.useState('');
  const scrollRef = React.useRef(null);
  const chat = kh.chat || [];
  React.useEffect(() => { const el = scrollRef.current; if (el) el.scrollTop = el.scrollHeight; }, [chat.length]);
  const send = () => {
    const t = text.trim(); if (!t) return;
    patch(k => ({ ...k, chat: [...(k.chat || []), { id: 'c-' + Date.now(), name: k.meName, color: k.meColor, text: t, at: Date.now() }] }));
    setText('');
  };
  const fmt = (at) => { try { return new Date(at).toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }); } catch (e) { return ''; } };
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <div ref={scrollRef} className="afn-scroll" style={{ flex: 1, overflowY: 'auto', padding: '12px 16px 8px', minHeight: 0 }}>
        {chat.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: T.inkMuted, fontFamily: T.fBody, fontSize: 13.5 }}>
            لا رسائل بعد — ابدأ المحادثة مع المشاركين 🌿
          </div>
        )}
        {chat.map(msg => {
          const mine = msg.name === kh.meName;
          return (
            <div key={msg.id} style={{ display: 'flex', flexDirection: mine ? 'row-reverse' : 'row', gap: 9, marginBottom: 12, alignItems: 'flex-end' }}>
              <Avatar name={msg.name} color={msg.color} size={30} />
              <div style={{ maxWidth: '74%', display: 'flex', flexDirection: 'column', alignItems: mine ? 'flex-end' : 'flex-start' }}>
                <div style={{ fontFamily: T.fBody, fontSize: 11, fontWeight: 700, color: msg.color, marginBottom: 3, padding: '0 4px' }}>{msg.name}</div>
                <div style={{ background: mine ? T.green : T.card, color: mine ? '#fff' : T.ink, padding: '9px 13px',
                  borderRadius: 16, borderBottomRightRadius: mine ? 4 : 16, borderBottomLeftRadius: mine ? 16 : 4,
                  border: mine ? 'none' : `1px solid ${T.line}`, fontFamily: T.fBody, fontSize: 14.5, lineHeight: 1.6, textWrap: 'pretty' }}>{msg.text}</div>
                <div style={{ fontFamily: T.fBody, fontSize: 9.5, color: T.inkMuted, marginTop: 3, padding: '0 4px' }}>{fmt(msg.at)}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ flexShrink: 0, display: 'flex', gap: 9, padding: '10px 14px 14px', borderTop: `1px solid ${T.line}`, background: T.card }}>
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(); }}
          dir="rtl" placeholder="اكتب رسالة…" style={{ flex: 1, border: `1.5px solid ${T.mintEdge}`, borderRadius: 14, padding: '11px 15px',
            outline: 'none', background: T.bg, fontFamily: T.fBody, fontSize: 14.5, color: T.ink, minWidth: 0 }} />
        <button onClick={send} className="afn-tap" style={{ border: 'none', cursor: 'pointer', background: T.green, borderRadius: 13,
          width: 46, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <KhIcon name="send" size={20} color="#fff" />
        </button>
      </div>
    </div>
  );
}

// مشاركة
function khShareText(kh) {
  const base = (typeof location !== 'undefined' ? location.href.split('?')[0] : 'https://afnan.app');
  return `انضمّ إلى ختمتنا الجماعية «${kh.title}» في تطبيق أفنان — رمز الغرفة: ${kh.code}\n${base}?khatmah=${kh.code}`;
}
function khCopy(text) {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text); return; }
  } catch (e) {}
  try {
    const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta);
  } catch (e) {}
}

// ── تفاصيل ختمة ───────────────────────────────────────────────────────
function KhDetail({ kh, setKhatmat, onBack, onRead, onReadAt, bookmark }) {
  const [toast, setToast] = React.useState(null);
  const showToast = (m) => { setToast(m); setTimeout(() => setToast(t => (t === m ? null : t)), 1800); };
  const patch = (fn) => setKhatmat(list => list.map(k => (k.id === kh.id ? fn(k) : k)));
  const isGroup = kh.kind === 'group';
  const sub = isGroup ? `غرفة جماعية · رمز ${kh.code}` : kh.kind === 'hifz' ? 'ختمة حفظ فردية' : 'ختمة تلاوة فردية';
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 55, display: 'flex', flexDirection: 'column', background: T.bg }}>
      <KhHeader title={kh.title} sub={sub} onBack={onBack}
        right={isGroup ? (
          <div onClick={() => { khCopy(khShareText(kh)); showToast('نُسخ رابط الدعوة'); }} className="afn-tap" style={{ width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <KhIcon name="link" size={19} color="#fff" />
          </div>
        ) : null} />
      {isGroup
        ? <KhGroup kh={kh} patch={patch} onRead={onRead} toast={showToast} />
        : <KhIndividual kh={kh} patch={patch} onRead={onRead} onReadAt={onReadAt} bookmark={bookmark} />}
      <KhToast msg={toast} />
    </div>
  );
}

// ── إنشاء ختمة ────────────────────────────────────────────────────────
function KhField({ label, value, onChange, placeholder, maxLength }) {
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontFamily: T.fBody, fontSize: 12.5, fontWeight: 700, color: T.inkSoft, marginBottom: 7 }}>{label}</div>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} maxLength={maxLength} dir="rtl"
        style={{ width: '100%', padding: '13px 15px', borderRadius: 14, border: `1.5px solid ${T.mintEdge}`, outline: 'none',
          background: T.card, fontFamily: T.fHead, fontSize: 16, fontWeight: 600, color: T.ink }} />
    </div>
  );
}
function KhCreate({ onClose, onCreate, userName }) {
  const [step, setStep] = React.useState('menu');   // menu | individual | group | join
  const [kind, setKind] = React.useState('tilawah');
  const [title, setTitle] = React.useState('');
  const [name, setName] = React.useState(userName || 'عبدالله');
  const [code, setCode] = React.useState('');

  const makeIndividual = () => {
    onCreate({ id: 'k-' + Date.now(), kind, title: title.trim() || (kind === 'hifz' ? 'ختمة الحفظ' : 'ختمة التلاوة'), createdAt: Date.now(), done: {} });
  };
  const makeGroup = () => {
    const c = khGenCode();
    const room = khBuildRoom(c, (name.trim() || 'عبدالله'), title.trim() || 'ختمتنا الجماعية');
    onCreate({ id: 'k-' + Date.now(), kind: 'group', createdAt: Date.now(), ...room });
  };
  const joinGroup = () => {
    const c = code.trim().toUpperCase(); if (c.length < 4) return;
    const room = khBuildRoom(c, (name.trim() || 'عبدالله'), 'ختمة جماعية');
    onCreate({ id: 'k-' + Date.now(), kind: 'group', createdAt: Date.now(), ...room });
  };

  return (
    <KhSheet onClose={onClose}>
      {step === 'menu' && (
        <React.Fragment>
          <div style={{ fontFamily: T.fHead, fontSize: 20, fontWeight: 700, color: T.ink, textAlign: 'center' }}>ختمةٌ جديدة</div>
          <div style={{ fontFamily: T.fBody, fontSize: 13, color: T.inkMuted, textAlign: 'center', marginTop: 4, marginBottom: 16 }}>اختر نوع الختمة</div>
          {[
            { k: 'individual', ic: 'person', t: 'ختمة فردية', s: 'تلاوة أو حفظ — تتبّع تقدّمك جزءًا جزءًا', tint: T.green },
            { k: 'group', ic: 'group', t: 'ختمة جماعية', s: 'أنشئ غرفةً وشارك رابطها — وزّعوا الأجزاء بينكم', tint: '#5C7CA6' },
            { k: 'join', ic: 'link', t: 'انضمّ برمز', s: 'لديك رمز غرفة؟ ادخل إلى ختمة أصدقائك', tint: T.gold },
          ].map(o => (
            <button key={o.k} onClick={() => setStep(o.k === 'individual' ? 'individual' : o.k === 'group' ? 'group' : 'join')}
              className="afn-tap" style={{ width: '100%', border: `1px solid ${T.line}`, cursor: 'pointer', background: T.card,
                borderRadius: 16, padding: '14px', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 13, textAlign: 'right' }}>
              <div style={{ width: 46, height: 46, borderRadius: 13, flexShrink: 0, background: o.tint + '18',
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <KhIcon name={o.ic} size={23} color={o.tint} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: T.fHead, fontSize: 16.5, fontWeight: 700, color: T.ink }}>{o.t}</div>
                <div style={{ fontFamily: T.fBody, fontSize: 12.5, color: T.inkMuted, marginTop: 2, lineHeight: 1.5 }}>{o.s}</div>
              </div>
              <Icon name="chevronL" size={18} color={T.inkMuted} />
            </button>
          ))}
        </React.Fragment>
      )}

      {step === 'individual' && (
        <React.Fragment>
          <div style={{ fontFamily: T.fHead, fontSize: 20, fontWeight: 700, color: T.ink, textAlign: 'center' }}>ختمة فردية</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            {[['tilawah', 'تلاوة', 'book', T.green], ['hifz', 'حفظ', 'star', T.gold]].map(([k, lbl, ic, tint]) => {
              const on = kind === k;
              return (
                <button key={k} onClick={() => setKind(k)} className="afn-tap" style={{ flex: 1, cursor: 'pointer', borderRadius: 16,
                  border: on ? `2px solid ${tint}` : `1.5px solid ${T.mintEdge}`, background: on ? tint + '12' : T.card, padding: '16px 10px',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 13, background: on ? tint : T.mint, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={ic} size={22} color={on ? '#fff' : tint} />
                  </div>
                  <span style={{ fontFamily: T.fHead, fontSize: 16, fontWeight: 700, color: on ? tint : T.ink }}>ختمة {lbl}</span>
                </button>
              );
            })}
          </div>
          <KhField label="اسم الختمة (اختياري)" value={title} onChange={setTitle} placeholder={kind === 'hifz' ? 'ختمة الحفظ' : 'ختمة التلاوة'} maxLength={28} />
          <KhPrimary onClick={makeIndividual} onBack={() => setStep('menu')}>إنشاء الختمة</KhPrimary>
        </React.Fragment>
      )}

      {step === 'group' && (
        <React.Fragment>
          <div style={{ fontFamily: T.fHead, fontSize: 20, fontWeight: 700, color: T.ink, textAlign: 'center' }}>ختمة جماعية</div>
          <div style={{ fontFamily: T.fBody, fontSize: 12.5, color: T.inkMuted, textAlign: 'center', marginTop: 4 }}>أنشئ غرفةً ثم شارك رابطها مع أصدقائك</div>
          <KhField label="اسم الختمة" value={title} onChange={setTitle} placeholder="ختمتنا الجماعية" maxLength={28} />
          <KhField label="اسمك في الغرفة" value={name} onChange={setName} placeholder="اسمك" maxLength={12} />
          <KhPrimary onClick={makeGroup} onBack={() => setStep('menu')}>إنشاء الغرفة ومشاركتها</KhPrimary>
        </React.Fragment>
      )}

      {step === 'join' && (
        <React.Fragment>
          <div style={{ fontFamily: T.fHead, fontSize: 20, fontWeight: 700, color: T.ink, textAlign: 'center' }}>الانضمام برمز</div>
          <div style={{ fontFamily: T.fBody, fontSize: 12.5, color: T.inkMuted, textAlign: 'center', marginTop: 4 }}>أدخل رمز الغرفة الذي وصلك</div>
          <div style={{ marginTop: 14 }}>
            <div style={{ fontFamily: T.fBody, fontSize: 12.5, fontWeight: 700, color: T.inkSoft, marginBottom: 7 }}>رمز الغرفة</div>
            <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="ABC123" maxLength={6} dir="ltr"
              style={{ width: '100%', padding: '14px', borderRadius: 14, border: `1.5px solid ${T.mintEdge}`, outline: 'none', textAlign: 'center',
                background: T.card, fontFamily: T.fHead, fontSize: 24, fontWeight: 700, letterSpacing: '.3em', color: T.green }} />
          </div>
          <KhField label="اسمك في الغرفة" value={name} onChange={setName} placeholder="اسمك" maxLength={12} />
          <KhPrimary onClick={joinGroup} onBack={() => setStep('menu')} disabled={code.trim().length < 4}>دخول الغرفة</KhPrimary>
        </React.Fragment>
      )}
    </KhSheet>
  );
}
function KhPrimary({ children, onClick, onBack, disabled }) {
  return (
    <div style={{ display: 'flex', gap: 11, marginTop: 20 }}>
      <button onClick={onBack} className="afn-tap" style={{ flex: 1, border: `1.5px solid ${T.line}`, background: T.card, cursor: 'pointer',
        padding: '14px', borderRadius: 14, fontFamily: T.fHead, fontSize: 15, fontWeight: 700, color: T.inkSoft }}>رجوع</button>
      <button onClick={disabled ? undefined : onClick} className="afn-tap" disabled={disabled} style={{ flex: 2, border: 'none',
        background: disabled ? T.mintEdge : T.green, cursor: disabled ? 'default' : 'pointer', padding: '14px', borderRadius: 14,
        fontFamily: T.fHead, fontSize: 15.5, fontWeight: 700, color: disabled ? T.inkMuted : '#fff' }}>{children}</button>
    </div>
  );
}

// ── الشاشة الرئيسية للختمات ───────────────────────────────────────────
function KhatmatScreen({ khatmat, setKhatmat, userName, onExit, onOpenSurah, bookmark }) {
  // قسم الختمات قيد التطوير — يُعرض «قريباً» مؤقّتاً
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 52, display: 'flex', flexDirection: 'column', background: T.bg }}>
      <KhHeader title="الختمات" sub="" onBack={onExit} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '24px', direction: 'rtl', textAlign: 'center' }}>
        <div style={{ width: 96, height: 96, borderRadius: '50%', background: T.mint, marginBottom: 22,
          display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="book" size={44} color={T.greenMid} />
        </div>
        <div style={{ fontFamily: T.fDisplay || T.fHead, fontSize: 34, fontWeight: 700, color: T.green }}>قريباً</div>
        <div style={{ fontFamily: T.fBody, fontSize: 15, color: T.inkMuted, marginTop: 10, lineHeight: 1.8, maxWidth: 280 }}>
          نعمل على هذا القسم بعناية ليكون بين يديك قريباً بإذن الله.
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { KhatmatScreen });
