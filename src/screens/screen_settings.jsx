// screen_settings.jsx — الإعدادات: ملفّ شخصي قابل للتعديل + تفضيلات حقيقية محفوظة

const RECITERS = ['مصعب إبراهيم', 'حسان الحساني', 'أنس خطيب', 'عبدالله السالم'];

// القراءات العشر المتواترة — كل قارئ وراوياه
const QIRAAT = [
  { imam: 'نافع المدني',     rawis: ['قالون', 'ورش'] },
  { imam: 'ابن كثير المكي',  rawis: ['البزّي', 'قُنبُل'] },
  { imam: 'أبو عمرو البصري', rawis: ['الدُّوري', 'السُّوسي'] },
  { imam: 'ابن عامر الشامي', rawis: ['هشام', 'ابن ذكوان'] },
  { imam: 'عاصم الكوفي',     rawis: ['شعبة', 'حفص'] },
  { imam: 'حمزة الزيّات',    rawis: ['خلف', 'خلّاد'] },
  { imam: 'الكسائي',         rawis: ['أبو الحارث', 'الدُّوري'] },
  { imam: 'أبو جعفر المدني', rawis: ['ابن وردان', 'ابن جمّاز'] },
  { imam: 'يعقوب الحضرمي',   rawis: ['رويس', 'روح'] },
  { imam: 'خلف العاشر',      rawis: ['إسحاق', 'إدريس'] },
];
const QIRAAH_DEFAULT = 'حفص عن عاصم';

function ToggleRow({ icon, tint, glyph, title, sub, value, onToggle, last, img }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 13, padding: '14px 16px',
      borderBottom: last ? 'none' : `1px solid ${T.line}` }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, background: img ? '#F5F3EC' : tint, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {img ? <img src={img} alt="" style={{ width: 30, height: 30, objectFit: 'contain' }} /> : <Icon name={icon} size={19} color={glyph} />}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.fHead, fontSize: 15.5, fontWeight: 600, color: T.ink }}>{title}</div>
        {sub && <div style={{ fontFamily: T.fBody, fontSize: 12, color: T.inkMuted, marginTop: 1 }}>{sub}</div>}
      </div>
      <div onClick={onToggle} className="afn-tap" style={{ width: 46, height: 28, borderRadius: 99, padding: 3,
        cursor: 'pointer', background: value ? T.greenMid : T.mintEdge, transition: 'background .25s',
        display: 'flex', justifyContent: value ? 'flex-start' : 'flex-end' }}>
        <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,.2)' }} />
      </div>
    </div>
  );
}

function SelectRow({ icon, tint, glyph, title, value, onClick, last, stacked, img }) {
  return (
    <div onClick={onClick} className="afn-tap" style={{ display: 'flex', alignItems: 'center', gap: 13,
      padding: '14px 16px', cursor: 'pointer', borderBottom: last ? 'none' : `1px solid ${T.line}` }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, background: img ? '#F5F3EC' : tint, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {img ? <img src={img} alt="" style={{ width: 30, height: 30, objectFit: 'contain' }} /> : <Icon name={icon} size={19} color={glyph} />}
      </div>
      {stacked ? (
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: T.fHead, fontSize: 15.5, fontWeight: 600, color: T.ink }}>{title}</div>
          <div style={{ fontFamily: T.fBody, fontSize: 13, color: T.inkSoft, marginTop: 3, lineHeight: 1.5, textWrap: 'pretty' }}>{value}</div>
        </div>
      ) : (
        <React.Fragment>
          <div style={{ flex: 1, minWidth: 0, fontFamily: T.fHead, fontSize: 15.5, fontWeight: 600, color: T.ink }}>{title}</div>
          <div style={{ fontFamily: T.fBody, fontSize: 13.5, color: T.inkSoft, maxWidth: 150, overflow: 'hidden',
            textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value}</div>
        </React.Fragment>
      )}
      <Icon name="chevron" size={18} color={T.inkMuted} />
    </div>
  );
}

// ── overlay sheets ────────────────────────────────────────────────────
function Backdrop({ children, onClose }) {
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 80, display: 'flex',
      alignItems: 'flex-end', background: 'rgba(20,30,25,.34)', animation: 'afn-fade .2s ease both' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%',
        animation: 'afn-rise .26s cubic-bezier(.22,1,.36,1) both' }}>
        {children}
      </div>
    </div>
  );
}

function NameSheet({ initial, onSave, onClose }) {
  const [v, setV] = React.useState(initial);
  const ref = React.useRef(null);
  React.useEffect(() => { const t = setTimeout(() => ref.current && ref.current.focus(), 120); return () => clearTimeout(t); }, []);
  return (
    <Backdrop onClose={onClose}>
      <div style={{ background: T.bg, borderRadius: '26px 26px 0 0', padding: '22px 20px 30px', direction: window.afnDir() }}>
        <div style={{ width: 42, height: 5, borderRadius: 99, background: T.mintEdge, margin: '0 auto 18px' }} />
        <div style={{ fontFamily: T.fHead, fontSize: 20, fontWeight: 700, color: T.ink, textAlign: 'center' }}>{window.t('nm_title')}</div>
        <div style={{ fontFamily: T.fBody, fontSize: 13, color: T.inkMuted, textAlign: 'center', marginTop: 4 }}>
          {window.t('nm_sub')}
        </div>
        <input ref={ref} value={v} onChange={e => setV(e.target.value)} maxLength={10}
          onKeyDown={e => { if (e.key === 'Enter') onSave(v.trim()); }}
          style={{ width: '100%', marginTop: 18, padding: '14px 16px', borderRadius: 15, direction: window.afnDir(),
            border: `1.5px solid ${T.mintEdge}`, background: T.card, outline: 'none',
            fontFamily: T.fHead, fontSize: 18, fontWeight: 600, color: T.ink, textAlign: 'center' }} />
        <div style={{ marginTop: 7, fontFamily: T.fBody, fontSize: 12, color: T.inkMuted, textAlign: 'center' }}>
          {window.tf('nm_chars', { n: window.tnum(v.length) })}
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
          <button onClick={onClose} className="afn-tap" style={{ flex: 1, border: `1.5px solid ${T.line}`,
            background: T.card, cursor: 'pointer', padding: '13px', borderRadius: 14,
            fontFamily: T.fHead, fontSize: 15.5, fontWeight: 700, color: T.inkSoft }}>{window.t('btn_cancel')}</button>
          <button onClick={() => onSave(v.trim())} className="afn-tap" style={{ flex: 2, border: 'none',
            background: T.green, cursor: 'pointer', padding: '13px', borderRadius: 14,
            fontFamily: T.fHead, fontSize: 15.5, fontWeight: 700, color: '#fff' }}>{window.t('btn_save')}</button>
        </div>
      </div>
    </Backdrop>
  );
}

function OptionSheet({ title, options, value, onPick, onClose }) {
  return (
    <Backdrop onClose={onClose}>
      <div style={{ background: T.bg, borderRadius: '26px 26px 0 0', padding: '22px 16px 28px', direction: window.afnDir(), maxHeight: 460 }}>
        <div style={{ width: 42, height: 5, borderRadius: 99, background: T.mintEdge, margin: '0 auto 16px' }} />
        <div style={{ fontFamily: T.fHead, fontSize: 19, fontWeight: 700, color: T.ink, textAlign: 'center', marginBottom: 12 }}>{title}</div>
        <div className="afn-scroll" style={{ overflowY: 'auto', maxHeight: 330 }}>
          {options.map(opt => {
            const on = opt === value;
            return (
              <div key={opt} onClick={() => onPick(opt)} className="afn-tap" style={{ display: 'flex', alignItems: 'center',
                gap: 10, padding: '14px 14px', cursor: 'pointer', borderRadius: 14, marginBottom: 2,
                background: on ? T.mint : 'transparent' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  border: on ? 'none' : `2px solid ${T.mintEdge}`, background: on ? T.green : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {on && <Icon name="check" size={14} color="#fff" stroke={2.6} />}
                </div>
                <span style={{ flex: 1, fontFamily: T.fHead, fontSize: 16, fontWeight: on ? 700 : 500,
                  color: on ? T.green : T.ink }}>{opt}</span>
              </div>
            );
          })}
        </div>
      </div>
    </Backdrop>
  );
}

// ورقة اختيار القراءة (القراءات العشر برواتها)
function QiraahSheet({ value, onPick, onClose }) {
  return (
    <Backdrop onClose={onClose}>
      <div style={{ background: T.bg, borderRadius: '26px 26px 0 0', padding: '22px 16px 28px', direction: 'rtl', maxHeight: 560 }}>
        <div style={{ width: 42, height: 5, borderRadius: 99, background: T.mintEdge, margin: '0 auto 14px' }} />
        <div style={{ fontFamily: T.fHead, fontSize: 19, fontWeight: 700, color: T.ink, textAlign: 'center' }}>{window.t('st_qiraat')}</div>
        <div style={{ fontFamily: T.fBody, fontSize: 12.5, color: T.inkMuted, textAlign: 'center', marginTop: 4, marginBottom: 14 }}>
          اختر القراءة وروايتها — القرّاء العشرة كاملين
        </div>
        <div className="afn-scroll" style={{ overflowY: 'auto', maxHeight: 410 }}>
          {QIRAAT.map((q, i) => (
            <div key={q.imam} style={{ marginBottom: 15 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ width: 22, height: 22, borderRadius: '50%', background: T.mint, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: T.fHead, fontSize: 11.5, fontWeight: 700, color: T.green }}>{(i + 1).toLocaleString('ar-EG')}</span>
                <span style={{ fontFamily: T.fHead, fontSize: 15, fontWeight: 700, color: T.ink }}>{q.imam}</span>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                {q.rawis.map(r => {
                  const val = `${r} عن ${q.imam}`;
                  const on = val === value;
                  return (
                    <button key={r} onClick={() => onPick(val)} className="afn-tap" style={{ flex: 1, cursor: 'pointer',
                      borderRadius: 13, padding: '11px 10px', border: on ? 'none' : `1.5px solid ${T.mintEdge}`,
                      background: on ? T.green : T.card, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                      <span style={{ fontFamily: T.fHead, fontSize: 14.5, fontWeight: on ? 700 : 600, color: on ? '#fff' : T.ink }}>{r}</span>
                      {on && <Icon name="check" size={14} color="#fff" stroke={2.6} />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Backdrop>
  );
}

// ورقة اختيار الترجمة — تُجلب لحظيًّا من Quran.com API (مصادر نصوصها من Tanzil.net)
const TRANSLATIONS = (typeof window !== 'undefined' && window.AFNAN_TRANSLATIONS) || [
  { key: 'none', id: null, ar: 'بدون ترجمة',  native: 'العربية فقط',      by: 'النصّ العربيّ وحده',                     dir: 'rtl' },
  { key: 'en',   id: 20,   ar: 'الإنجليزية',  native: 'English',          by: 'Saheeh International',                   dir: 'ltr' },
  { key: 'tr',   id: 77,   ar: 'التركية',     native: 'Türkçe',           by: 'Diyanet İşleri',                        dir: 'ltr' },
  { key: 'ur',   id: 97,   ar: 'الأوردية',    native: 'اردو',             by: 'سید ابو الاعلیٰ مودودی · تفہیم القرآن',  dir: 'rtl' },
  { key: 'id',   id: 33,   ar: 'الإندونيسية', native: 'Bahasa Indonesia', by: 'Kementerian Agama RI',                  dir: 'ltr' },
];
const transLabel = (key) => { const e = TRANSLATIONS.find(t => t.key === key) || TRANSLATIONS[0]; return e.key === 'none' ? window.t('tr_off') : e.native; };

function TranslationSheet({ value, onPick, onClose }) {
  return (
    <Backdrop onClose={onClose}>
      <div style={{ background: T.bg, borderRadius: '26px 26px 0 0', padding: '22px 16px 26px', direction: window.afnDir(), maxHeight: 560 }}>
        <div style={{ width: 42, height: 5, borderRadius: 99, background: T.mintEdge, margin: '0 auto 14px' }} />
        <div style={{ fontFamily: T.fHead, fontSize: 19, fontWeight: 700, color: T.ink, textAlign: 'center' }}>{window.t('tr_title')}</div>
        <div style={{ fontFamily: T.fBody, fontSize: 12.5, color: T.inkMuted, textAlign: 'center', marginTop: 4, marginBottom: 14 }}>
          {window.t('tr_sub')}
        </div>
        {/* شرح: يجب الضغط على الآية */}
        <div style={{ margin: '0 0 14px', padding: '11px 14px', borderRadius: 14, background: T.mint,
          border: `1px solid ${T.mintEdge}`, display: 'flex', gap: 9, alignItems: 'flex-start' }}>
          <Icon name="book" size={16} color={T.green} />
          <div style={{ fontFamily: T.fBody, fontSize: 12, lineHeight: 1.7, color: T.green, fontWeight: 600 }}>{window.t('tr_tap')}</div>
        </div>
        <div className="afn-scroll" style={{ overflowY: 'auto', maxHeight: 360 }}>
          {TRANSLATIONS.map(t => {
            const on = t.key === (value || 'none');
            return (
              <div key={t.key} onClick={() => onPick(t.key)} className="afn-tap" style={{ display: 'flex', alignItems: 'center',
                gap: 11, padding: '13px 13px', cursor: 'pointer', borderRadius: 14, marginBottom: 3,
                background: on ? T.mint : 'transparent' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  border: on ? 'none' : `2px solid ${T.mintEdge}`, background: on ? T.green : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {on && <Icon name="check" size={14} color="#fff" stroke={2.6} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: T.fHead, fontSize: 15.5, fontWeight: on ? 700 : 600, color: on ? T.green : T.ink }}>{t.ar}</div>
                  <div style={{ fontFamily: T.fBody, fontSize: 11.5, color: T.inkMuted, marginTop: 1, overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.by}</div>
                </div>
                {t.key !== 'none' && (
                  <span dir={t.dir} style={{ fontFamily: t.dir === 'rtl' ? T.fHead : "'Georgia',serif",
                    fontSize: 15, fontWeight: 600, color: T.inkSoft, flexShrink: 0, maxWidth: 120, overflow: 'hidden',
                    textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.native}</span>
                )}
              </div>
            );
          })}
        </div>
        {/* مصدر التراجم */}
        <div style={{ marginTop: 12, padding: '12px 14px', borderRadius: 14, background: T.card,
          border: `1px solid ${T.line}`, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ width: 28, height: 28, borderRadius: 9, background: '#E2EAF4', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="globe" size={16} color="#5C7CA6" />
          </span>
          <div style={{ fontFamily: T.fBody, fontSize: 11.5, lineHeight: 1.75, color: T.inkMuted }}>{window.t('tr_src')}</div>
        </div>
      </div>
    </Backdrop>
  );
}

// ورقة لغة التطبيق — تغيّر واجهة التطبيق بالكامل (عدا نصّ القرآن)
function LanguageSheet({ value, onPick, onClose, firstRun }) {
  const dir = window.afnDir();
  const [sel, setSel] = React.useState(value || 'ar');
  const current = firstRun ? sel : (value || 'ar');
  const onRow = (k) => { if (firstRun) setSel(k); else onPick(k); };
  return (
    <Backdrop onClose={firstRun ? () => {} : onClose}>
      <div style={{ background: T.bg, borderRadius: '26px 26px 0 0', padding: '22px 16px 26px', direction: dir, maxHeight: 620 }}>
        <div style={{ width: 42, height: 5, borderRadius: 99, background: T.mintEdge, margin: '0 auto 14px' }} />
        <div style={{ fontFamily: T.fHead, fontSize: 19, fontWeight: 700, color: T.ink, textAlign: 'center' }}>{window.t('lang_title')}</div>
        <div style={{ fontFamily: T.fBody, fontSize: 12.5, color: T.inkMuted, textAlign: 'center', marginTop: 4, marginBottom: 14 }}>
          {window.t('lang_sub')}
        </div>
        <div className="afn-scroll" style={{ overflowY: 'auto', maxHeight: 320 }}>
          {window.AFN_LANGS.map(l => {
            const on = l.key === current;
            return (
              <div key={l.key} onClick={() => onRow(l.key)} className="afn-tap" style={{ display: 'flex', alignItems: 'center',
                gap: 11, padding: '13px 13px', cursor: 'pointer', borderRadius: 14, marginBottom: 3,
                background: on ? T.mint : 'transparent' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  border: on ? 'none' : `2px solid ${T.mintEdge}`, background: on ? T.green : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {on && <Icon name="check" size={14} color="#fff" stroke={2.6} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div dir={l.dir} style={{ fontFamily: T.fHead, fontSize: 16, fontWeight: on ? 700 : 600, color: on ? T.green : T.ink }}>{l.native}</div>
                  <div style={{ fontFamily: T.fBody, fontSize: 11.5, color: T.inkMuted, marginTop: 1 }}>{l.ar}</div>
                </div>
              </div>
            );
          })}
        </div>
        {/* تنبيه: نصّ القرآن لا يتغيّر */}
        <div style={{ marginTop: 12, padding: '12px 14px', borderRadius: 14, background: T.card,
          border: `1px solid ${T.line}`, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
          <span style={{ width: 28, height: 28, borderRadius: 9, background: T.mint, flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="book" size={16} color={T.green} />
          </span>
          <div style={{ fontFamily: T.fBody, fontSize: 11.5, lineHeight: 1.75, color: T.inkMuted }}>{window.t('lang_note')}</div>
        </div>
        {firstRun && (
          <button onClick={() => onPick(sel)} className="afn-tap" style={{ width: '100%', marginTop: 14, border: 'none',
            background: T.green, cursor: 'pointer', padding: '14px', borderRadius: 15,
            fontFamily: T.fHead, fontSize: 16, fontWeight: 700, color: '#fff' }}>{window.t('btn_continue')}</button>
        )}
      </div>
    </Backdrop>
  );
}
Object.assign(window, { LanguageSheet });

// ── main ──────────────────────────────────────────────────────────────
function SettingsScreen({ state, onChange, onAdhan }) {
  const t = window.t;
  const [editName, setEditName] = React.useState(false);
  const [sheet, setSheet] = React.useState(null);
  const [qSheet, setQSheet] = React.useState(false);
  const [tSheet, setTSheet] = React.useState(false);
  const [langSheet, setLangSheet] = React.useState(false);
  const [showGuide, setShowGuide] = React.useState(false);
  const [showColors, setShowColors] = React.useState(false);
  const Guide = window.QuranGuide;
  const ColorsGuide = window.TajweedColorsGuide;
  const name = state.name || 'عبدالله';
  const prefs = state.prefs || {};
  const adhanOn = state.adhanOn || {};
  const fontScale = state.fontScale || 1;
  const togglePref = (k) => onChange({ prefs: { ...prefs, [k]: !prefs[k] } });
  const avatar = state.avatar || null;
  const fileRef = React.useRef(null);
  const pickAvatar = (e) => {
    e.stopPropagation();
    fileRef.current && fileRef.current.click();
  };
  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => onChange({ avatar: r.result });
    r.readAsDataURL(f);
    e.target.value = '';
  };
  const clearAvatar = (e) => { e.stopPropagation(); onChange({ avatar: null }); };

  return (
    <React.Fragment>
      <Screen>
        <ScreenTitle sub={t('st_sub')}>{t('tab_settings')}</ScreenTitle>

        {/* profile */}
        <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
        <Card style={{ padding: 18, display: 'flex', alignItems: 'center', gap: 14 }} onClick={() => setEditName(true)}>
          <div onClick={pickAvatar} className="afn-tap" style={{ position: 'relative', width: 58, height: 58, flexShrink: 0, cursor: 'pointer' }}>
            <div style={{ width: 58, height: 58, borderRadius: '50%', overflow: 'hidden',
              background: avatar ? '#fff' : 'linear-gradient(160deg,#2E8B66,#1E6F50)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 6px 16px rgba(30,111,80,.28)' }}>
              {avatar
                ? <img src={avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontFamily: T.fHead, fontSize: 26, fontWeight: 700, color: '#fff' }}>{name.slice(0, 1)}</span>}
            </div>
            {/* شارة الكاميرا */}
            <div style={{ position: 'absolute', bottom: -2, insetInlineEnd: -2, width: 22, height: 22, borderRadius: '50%',
              background: T.green, border: `2.5px solid ${T.card}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="camera" size={11} color="#fff" stroke={2.2} />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: T.fHead, fontSize: 19, fontWeight: 700, color: T.ink }}>{name}</div>
            <div style={{ fontFamily: T.fBody, fontSize: 13, color: T.greenMid, marginTop: 2, fontWeight: 600 }}>{t('st_change_name')}</div>
            <div onClick={avatar ? clearAvatar : pickAvatar} className="afn-tap" style={{ display: 'inline-flex', alignItems: 'center', gap: 5,
              marginTop: 7, cursor: 'pointer', padding: '4px 10px', borderRadius: 99,
              background: T.mint, border: `1px solid ${T.mintEdge}` }}>
              <Icon name={avatar ? 'close' : 'camera'} size={12} color={T.green} stroke={2.2} />
              <span style={{ fontFamily: T.fHead, fontSize: 11.5, fontWeight: 700, color: T.green }}>{avatar ? t('st_remove_photo') : t('st_add_photo')}</span>
            </div>
          </div>
          <Icon name="chevron" size={20} color={T.inkMuted} />
        </Card>

        {/* general · app language */}
        <SectionLabel>{t('st_general')}</SectionLabel>
        <Card style={{ overflow: 'hidden' }}>
          <SelectRow icon="globe" tint="#EAF0DB" glyph="#7A9A3C" img="assets/settings/languages.png" title={t('st_language')}
            value={(window.AFN_LANGS.find(l => l.key === (state.lang || 'ar')) || window.AFN_LANGS[0]).native}
            onClick={() => setLangSheet(true)} last />
        </Card>

        {/* notifications */}
        <SectionLabel>{t('st_notif')}</SectionLabel>
        <Card style={{ overflow: 'hidden' }}>
          <ToggleRow icon="bell"  tint="#FBEFD2" glyph={T.gold}  img="assets/settings/bell.png" title={t('pr_adhan')}   sub={t('st_adhan_sub2')} value={!!adhanOn.all} onToggle={() => onAdhan('all')} />
          <ToggleRow icon="beads" tint="#E6E3F2" glyph="#7A6BA6" img="assets/settings/adhkar.png" title={t('st_adhkar')} sub={t('st_morn_eve')}        value={!!prefs.adhkar} onToggle={() => togglePref('adhkar')} />
          <ToggleRow icon="book"  tint={T.mint}  glyph={T.greenMid} img="assets/settings/quran.png" title={t('st_wird')} sub={t('st_wird_sub')}   value={!!prefs.wird}   onToggle={() => togglePref('wird')} />
          <ToggleRow icon="star"  tint="#EAF0DB" glyph="#7A9A3C" img="assets/settings/friday.png" title={t('st_kahf')}    sub={t('st_friday')}           value={!!prefs.kahf}   onToggle={() => togglePref('kahf')} />
          <ToggleRow icon="water" tint="#E2EAF4" glyph="#5C7CA6" img="assets/settings/vibration.png" title={t('st_vibrate')}      sub={t('st_vibrate_sub')}          value={!!prefs.vibrate} onToggle={() => togglePref('vibrate')} last />
        </Card>

        {/* recitation */}
        <SectionLabel>{t('st_qurani')}</SectionLabel>
        <Card style={{ overflow: 'hidden' }}>
          <SelectRow icon="book" tint="#E0EFE6" glyph={T.green} img="assets/settings/qiraat.png" title={t('st_qiraat')} value={state.qiraah || QIRAAH_DEFAULT}
            stacked onClick={() => setQSheet(true)} />
          <SelectRow icon="quote" tint="#F0E0D2" glyph={T.clay} img="assets/settings/qari.png" title={t('st_reciter')} value={state.reciter || RECITERS[0]}
            onClick={() => setSheet({ title: t('st_choose_rec'), options: RECITERS, value: state.reciter,
              onPick: (v) => { onChange({ reciter: v }); setSheet(null); } })} />
          <SelectRow icon="globe" tint="#E2EAF4" glyph="#5C7CA6" img="assets/settings/languages.png" title={t('st_translation')} value={transLabel(state.translation)}
            onClick={() => setTSheet(true)} />
          <div style={{ padding: '16px 16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontFamily: T.fHead, fontSize: 15.5, fontWeight: 600, color: T.ink }}>{t('st_font')}</span>
              <span style={{ fontFamily: T.fBody, fontSize: 12.5, color: T.inkMuted }}>{window.tnum(Math.round(fontScale * 100))}٪</span>
            </div>
            {/* live preview */}
            <p dir="rtl" style={{ margin: '12px 0 0', fontFamily: T.fQuran, fontSize: 22 * fontScale, lineHeight: 2,
              color: T.green, textAlign: 'center', fontWeight: 700, transition: 'font-size .15s ease' }}>
              ﴿ إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ ﴾
            </p>
            <input type="range" min="0.6" max="1.4" step="0.05" value={fontScale} className="afn-fontrange"
              onChange={e => onChange({ fontScale: +e.target.value })}
              style={{ width: '100%', marginTop: 14, accentColor: T.greenMid,
                background: `linear-gradient(${T.mintEdge},${T.mintEdge})`, borderRadius: 99 }} />
          </div>
        </Card>

        {/* تعليمات */}
        <SectionLabel>{t('st_instr')}</SectionLabel>
        <Card style={{ overflow: 'hidden' }}>
          <SelectRow icon="book" tint={T.mint} glyph={T.greenMid} img="assets/settings/click.png" title={t('st_mushaf_g')} value={t('st_view')} onClick={() => setShowGuide(true)} />
          <SelectRow icon="quote" tint="#E0EFE6" glyph={T.green} img="assets/settings/colors.png" title={t('st_tajweed')} value={t('st_view')} onClick={() => setShowColors(true)} last />
        </Card>

        <div style={{ textAlign: 'center', marginTop: 24, fontFamily: T.fBody, fontSize: 12.5, color: T.inkMuted }}>
          <Wordmark size={22} />
        </div>
      </Screen>

      {editName && <NameSheet initial={name}
        onSave={(v) => { onChange({ name: v || 'عبدالله' }); setEditName(false); }}
        onClose={() => setEditName(false)} />}
      {sheet && <OptionSheet {...sheet} onClose={() => setSheet(null)} />}
      {qSheet && <QiraahSheet value={state.qiraah || QIRAAH_DEFAULT}
        onPick={(v) => { onChange({ qiraah: v }); setQSheet(false); }} onClose={() => setQSheet(false)} />}
      {tSheet && <TranslationSheet value={state.translation || 'none'}
        onPick={(v) => { onChange({ translation: v }); setTSheet(false); }} onClose={() => setTSheet(false)} />}
      {langSheet && <LanguageSheet value={state.lang || 'ar'}
        onPick={(v) => { onChange({ lang: v }); setLangSheet(false); }} onClose={() => setLangSheet(false)} />}
      {showGuide && Guide && <Guide onClose={() => setShowGuide(false)} />}
      {showColors && ColorsGuide && <ColorsGuide onClose={() => setShowColors(false)} />}
    </React.Fragment>
  );
}

Object.assign(window, { SettingsScreen });
