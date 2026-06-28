// hadith_sheet.jsx — لوحٌ منزلِقٌ يعرض شرحَ الحديثِ وتخريجَه وسندَه عند الضغط على بطاقة "حديثُ اليوم".

// keyframes خاصّة باللوح (مرّة واحدة)
(function () {
  if (document.getElementById('afn-sheet-kf')) return;
  const s = document.createElement('style'); s.id = 'afn-sheet-kf';
  s.textContent = `@keyframes afn-sheet-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes afn-sheet-dim { from { opacity: 0; } to { opacity: 1; } }`;
  document.head.appendChild(s);
})();

function HadithSheet({ hadith, onClose }) {
  const t = window.t;
  const [closing, setClosing] = React.useState(false);
  const d = hadith ? (window.hadithDetail ? window.hadithDetail(hadith.text) : null) : null;
  const tr = hadith ? window.tc(hadith.text) : '';

  const close = () => { setClosing(true); setTimeout(onClose, 240); };

  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!hadith) return null;

  const grade = d ? d.grade : (hadith.ref || '');

  const Field = ({ label, children, accent = T.green }) => (
    <div style={{ marginTop: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 7 }}>
        <span style={{ width: 4, height: 15, borderRadius: 4, background: accent }} />
        <span style={{ fontFamily: T.fHead, fontSize: 14.5, fontWeight: 700, color: accent }}>{label}</span>
      </div>
      <div style={{ paddingInlineStart: 12 }}>{children}</div>
    </div>
  );

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 80, direction: window.afnDir(),
      display: 'flex', alignItems: 'flex-end' }}>
      {/* backdrop */}
      <div onClick={close} style={{ position: 'absolute', inset: 0, background: 'rgba(20,33,27,.42)',
        backdropFilter: 'blur(2px)', WebkitBackdropFilter: 'blur(2px)',
        animation: closing ? 'afn-sheet-dim .24s reverse both' : 'afn-sheet-dim .28s both' }} />

      {/* sheet */}
      <div style={{ position: 'relative', width: '100%', maxHeight: '88%', overflowY: 'auto',
        background: T.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28,
        boxShadow: '0 -12px 40px rgba(20,33,27,.22)',
        animation: closing ? 'afn-sheet-up .24s reverse both' : 'afn-sheet-up .32s cubic-bezier(.22,1,.36,1) both',
        paddingBottom: 'calc(28px + env(safe-area-inset-bottom))' }}
        className="afn-scroll">

        {/* grab handle + close */}
        <div style={{ position: 'sticky', top: 0, zIndex: 2, background: T.bg,
          padding: '12px 18px 6px', borderTopLeftRadius: 28, borderTopRightRadius: 28 }}>
          <div style={{ width: 42, height: 5, borderRadius: 999, background: T.mintEdge, margin: '0 auto 12px' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <Icon name="quote" size={20} color={T.gold} />
              <span style={{ fontFamily: T.fHead, fontSize: 17, fontWeight: 700, color: T.ink }}>{t('hd_title')}</span>
            </div>
            <button onClick={close} className="afn-tap" aria-label="إغلاق" style={{ border: 'none', cursor: 'pointer',
              width: 34, height: 34, borderRadius: '50%', background: T.bgSink,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="close" size={17} color={T.inkSoft} stroke={2.2} />
            </button>
          </div>
        </div>

        <div style={{ padding: '6px 22px 0' }}>
          {/* hadith text */}
          <Card glow={T.gold} style={{ padding: '20px 20px 18px', marginTop: 6 }}>
            <p dir="rtl" style={{ margin: 0, fontFamily: T.fScript, fontSize: 22, lineHeight: 2.1,
              color: T.ink, textAlign: 'center', fontWeight: 700 }}>«{hadith.text}»</p>
            {tr ? (
              <p dir={window.afnDir()} style={{ margin: '12px 0 0', fontFamily: T.fBody, fontSize: 14.5,
                lineHeight: 1.7, color: T.inkSoft, textAlign: 'center', textWrap: 'pretty' }}>{tr}</p>
            ) : null}
          </Card>

          {d ? (
            <>
              <Field label={t('hd_rawi')} accent={T.greenMid}>
                <span style={{ fontFamily: T.fBody, fontSize: 16, fontWeight: 600, color: T.ink }}>{window.tc(d.rawi) || d.rawi}</span>
              </Field>

              <Field label={t('hd_takhrij')} accent={T.gold}>
                <p style={{ margin: 0, fontFamily: T.fBody, fontSize: 15, lineHeight: 1.85, color: T.inkSoft, textWrap: 'pretty' }}>{window.tc(d.takhrij) || d.takhrij}</p>
                <span style={{ display: 'inline-block', marginTop: 10, fontFamily: T.fBody, fontSize: 13, fontWeight: 700,
                  color: T.green, background: T.mint, padding: '6px 14px', borderRadius: 999 }}>{window.tc(d.grade) || d.grade}</span>
              </Field>

              <Field label={t('hd_sharh')} accent={T.clay}>
                <p dir={window.afnDir()} style={{ margin: 0, fontFamily: T.fBody, fontSize: 16, lineHeight: 1.95, color: T.ink, textWrap: 'pretty' }}>{window.tc(d.sharh) || d.sharh}</p>
              </Field>
            </>
          ) : (
            <Field label={t('hd_takhrij')} accent={T.gold}>
              <span style={{ display: 'inline-block', fontFamily: T.fBody, fontSize: 13, fontWeight: 700,
                color: T.green, background: T.mint, padding: '6px 14px', borderRadius: 999 }}>{window.tcRef(hadith.ref) || hadith.ref}</span>
            </Field>
          )}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HadithSheet });
