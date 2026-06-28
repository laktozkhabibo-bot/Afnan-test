// screen_adhkar.jsx — مكتبة الأذكار والأدعية حسب المواقف
// كل قسم له ثيمٌ هادئ فاتح خاص (tint + glyph) يصبغ البطاقات بإضاءةٍ خفيفة من الداخل،
// والعدّاد صغيرٌ بسيط بلا أيقونات، وعند الإتمام يُشطب النص شطبًا لطيفًا.
// بطاقات الأذكار بيضاء نظيفة (بلا glow) — التلوين كان يُذيب حافة البطاقة في خلفية الصفحة.

function DhikrCard({ item, theme }) {
  const [n, setN] = React.useState(0);
  const done = n >= item.count;
  const bump = () => setN(v => (v >= item.count ? 0 : v + 1));
  return (
    <Card onClick={bump} style={{ padding: '18px 20px 15px', marginBottom: 13, position: 'relative',
      cursor: 'pointer', opacity: done ? 0.96 : 1 }}>
      {/* small, icon-free counter */}
      <div style={{ position: 'absolute', top: 13, insetInlineStart: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
        {done ? (
          <span style={{ fontFamily: T.fBody, fontSize: 12, fontWeight: 700, color: theme.glyph,
            letterSpacing: '.02em', opacity: .9 }}>{window.t('ad_done_s')}</span>
        ) : item.count > 1 ? (
          <span style={{ fontFamily: T.fHead, fontSize: 12.5, fontWeight: 700, color: theme.glyph,
            background: `${theme.glyph}1A`, borderRadius: 999, padding: '3px 10px', lineHeight: 1.4,
            fontVariantNumeric: 'tabular-nums' }}>
            {window.tnum(n)}<span style={{ opacity: .5, margin: '0 2px' }}>/</span>{window.tnum(item.count)}
          </span>
        ) : (
          <span style={{ width: 14, height: 14, borderRadius: '50%', border: `2px solid ${theme.glyph}59` }} />
        )}
      </div>

      {item.title && (
        <div style={{ textAlign: 'center', margin: '28px 0 -6px', fontFamily: T.fHead, fontSize: 14.5, fontWeight: 700,
          color: theme.glyph, opacity: done ? 0.7 : 1 }}>{item.title}</div>
      )}
      <p style={{ margin: item.title ? '14px 0 0' : '30px 0 0', fontFamily: T.fScript, fontSize: 22, lineHeight: 2.05, textAlign: 'center',
        whiteSpace: 'pre-line',
        color: done ? T.inkMuted : T.ink, opacity: done ? 0.72 : 1,
        textDecorationLine: 'line-through', textDecorationThickness: '1.6px',
        textDecorationColor: done ? `${theme.glyph}C0` : 'transparent', textUnderlineOffset: '2px',
        transition: 'text-decoration-color .55s ease, color .55s ease, opacity .55s ease' }}>
        {item.text}
      </p>
      {(() => { const tr = window.tc(item.text); return tr ? (
        <p dir={window.afnDir()} style={{ margin: '10px 0 0', fontFamily: T.fBody, fontSize: 14.5, lineHeight: 1.7,
          textAlign: 'center', color: done ? T.inkMuted : T.inkSoft, opacity: done ? 0.7 : 1, textWrap: 'pretty' }}>
          {tr}
        </p>
      ) : null; })()}
      {item.note && (
        <div style={{ margin: '13px 0 0', padding: '10px 13px', borderRadius: 12, background: `${theme.glyph}14`,
          fontFamily: T.fBody, fontSize: 13, lineHeight: 1.8, color: T.inkSoft, textAlign: 'center', textWrap: 'pretty',
          opacity: done ? 0.7 : 1 }}>
          <span style={{ fontWeight: 700, color: theme.glyph }}>فضله: </span>{item.note}
        </div>
      )}
      {item.ref && (
        <div style={{ textAlign: 'center', marginTop: 11, fontFamily: T.fBody, fontSize: 12.5,
          color: theme.glyph, fontWeight: 600, opacity: .85 }}>{window.tcRef(item.ref) || item.ref}</div>
      )}
    </Card>
  );
}

function AdhkarDetail({ cat, onBack }) {
  const items = ADHKAR_ITEMS[cat.key] || [];
  const theme = { tint: cat.tint, glyph: cat.glyph };
  return (
    <div className="afn-scroll" style={{ position: 'absolute', inset: 0, overflowY: 'auto', direction: window.afnDir(),
      WebkitOverflowScrolling: 'touch', background: `linear-gradient(180deg, ${cat.tint} 0%, ${cat.tint} 120px, ${T.bg} 280px)` }}>
      <div style={{ padding: '56px 20px 104px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0 20px' }}>
          <div onClick={onBack} className="afn-tap" style={{ width: 40, height: 40, borderRadius: '50%',
            background: 'rgba(255,255,255,.7)', border: `1px solid rgba(38,53,45,.06)`, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer' }}>
            <Icon name="chevronL" size={20} color={T.inkSoft} />
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ margin: 0, fontFamily: T.fHead, fontSize: 25, fontWeight: 700, color: T.ink }}>{window.adhkarCatName(cat.key, cat.title)}</h1>
            <div style={{ fontFamily: T.fBody, fontSize: 13, color: T.inkSoft }}>{window.t('ad_tap')}</div>
          </div>
          <div style={{ width: 56, height: 56, borderRadius: 17, background: 'rgba(255,255,255,.65)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px rgba(38,53,45,.08)' }}>
            <img src={cat.img} alt={cat.title} style={{ width: 38, height: 38, objectFit: 'contain' }} />
          </div>
        </div>
        {items.map((it, i) => <DhikrCard key={i} item={it} theme={theme} />)}
      </div>
    </div>
  );
}

function AdhkarScreen({ onOpenCat }) {
  return (
    <Screen>
      <ScreenTitle sub={window.t('ad_sub')}>{window.t('tab_adhkar')}</ScreenTitle>

      {/* search (visual) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: T.card,
        border: `1px solid ${T.line}`, borderRadius: 15, padding: '12px 15px', marginBottom: 20,
        boxShadow: '0 1px 3px rgba(38,53,45,.04)' }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke={T.inkMuted} strokeWidth="2"/><path d="M20 20l-3.5-3.5" stroke={T.inkMuted} strokeWidth="2" strokeLinecap="round"/></svg>
        <span style={{ fontFamily: T.fBody, fontSize: 15, color: T.inkMuted }}>{window.t('ad_search')}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
        {ADHKAR_CATS.map(c => {
          const count = (ADHKAR_ITEMS[c.key] || []).length;
          return (
            <Card key={c.key} glow={c.glyph} className="afn-tap" onClick={() => onOpenCat(c)} style={{ padding: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 17, background: c.tint,
                display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <img src={c.img} alt={c.title} style={{ width: 36, height: 36, objectFit: 'contain' }} />
              </div>
              <div style={{ fontFamily: T.fHead, fontSize: 16.5, fontWeight: 600, color: T.ink, marginTop: 13 }}>{window.adhkarCatName(c.key, c.title)}</div>
              <div style={{ fontFamily: T.fBody, fontSize: 12.5, color: T.inkMuted, marginTop: 3 }}>
                {window.tf('ad_one', { n: window.tnum(count) })}
              </div>
            </Card>
          );
        })}
      </div>
    </Screen>
  );
}

Object.assign(window, { AdhkarScreen, AdhkarDetail });
