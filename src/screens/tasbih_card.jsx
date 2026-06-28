// tasbih_card.jsx — سبحةٌ هادئةٌ تملأ مساحةَ الرئيسية: اضغط لتُسبِّح، تتنقّل بين
// التسبيحِ والحمدِ والتكبير، بحركةٍ ناعمة، وتُحفَظُ محليّاً وتُصفَّرُ كلَّ يوم.

const TASBIH_PHASES = [
  { text: 'سُبْحَانَ اللَّهِ', target: 33 },
  { text: 'الْحَمْدُ لِلَّهِ', target: 33 },
  { text: 'اللَّهُ أَكْبَرُ', target: 34 },
];
const TASBIH_KEY = 'afn-tasbih-v1';

// keyframes هادئة (مرّة واحدة)
(function () {
  if (document.getElementById('afn-tb-kf')) return;
  const s = document.createElement('style'); s.id = 'afn-tb-kf';
  s.textContent = `
    @keyframes afn-tb-ripple { 0% { transform: scale(.82); opacity: .35; } 100% { transform: scale(1.32); opacity: 0; } }
    @keyframes afn-tb-num { from { opacity: .25; transform: translateY(3px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes afn-tb-breathe { 0%,100% { transform: scale(1); opacity: .45; } 50% { transform: scale(1.06); opacity: .75; } }
    @keyframes afn-tb-bloom { 0% { transform: scale(.6); opacity: .5; } 100% { transform: scale(1.6); opacity: 0; } }`;
  document.head.appendChild(s);
})();

function loadTasbih() {
  const today = new Date().toISOString().slice(0, 10);
  try {
    const s = JSON.parse(localStorage.getItem(TASBIH_KEY) || '{}');
    if (s.date === today) return { date: today, phase: s.phase || 0, count: s.count || 0, total: s.total || 0 };
  } catch (e) {}
  return { date: today, phase: 0, count: 0, total: 0 };
}

function TasbihCard() {
  const t = window.t;
  const num = window.tnum;
  const [st, setSt] = React.useState(loadTasbih);
  const [ripple, setRipple] = React.useState(0);
  const [bloom, setBloom] = React.useState(0);
  const [justDone, setJustDone] = React.useState(false);

  React.useEffect(() => { try { localStorage.setItem(TASBIH_KEY, JSON.stringify(st)); } catch (e) {} }, [st]);

  const phase = TASBIH_PHASES[st.phase];
  const value = phase ? st.count / phase.target : 0;

  const tap = () => {
    setRipple(r => r + 1);
    if (navigator.vibrate) { try { navigator.vibrate(8); } catch (e) {} }
    setSt(s => {
      const ph = TASBIH_PHASES[s.phase];
      const nextCount = s.count + 1;
      const total = s.total + 1;
      if (nextCount >= ph.target) {
        const nextPhase = (s.phase + 1) % TASBIH_PHASES.length;
        setBloom(b => b + 1);
        if (nextPhase === 0) { setJustDone(true); setTimeout(() => setJustDone(false), 1800); }
        return { ...s, phase: nextPhase, count: 0, total };
      }
      return { ...s, count: nextCount, total };
    });
  };

  // هندسة الحلقة
  const size = 168, stroke = 8, r = (size - stroke) / 2, c = 2 * Math.PI * r;

  return (
    <Card style={{ padding: '18px 18px 22px', marginTop: 12, marginBottom: 4 }}>
      {/* header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: T.fHead, fontSize: 16, fontWeight: 700, color: T.ink }}>{t('tb_title')}</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Icon name="leaf" size={14} color={T.leaf} />
          <span style={{ fontFamily: T.fBody, fontSize: 12.5, color: T.inkMuted, fontWeight: 600 }}>{window.tf('tb_total', { n: num(st.total) })}</span>
        </div>
      </div>

      {/* progress segments */}
      <div style={{ display: 'flex', gap: 7, marginTop: 15, justifyContent: 'center' }}>
        {TASBIH_PHASES.map((p, i) => (
          <span key={i} style={{ flex: 1, height: 4, borderRadius: 999,
            background: i < st.phase ? T.green2 : i === st.phase ? T.gold : T.mintEdge,
            opacity: i === st.phase ? 1 : i < st.phase ? 0.9 : 0.6,
            transition: 'background .5s ease, opacity .5s ease' }} />
        ))}
      </div>

      {/* dial */}
      <button onClick={tap} className="afn-tap" aria-label="سبّح" style={{
        position: 'relative', display: 'block', margin: '18px auto 0', border: 'none', cursor: 'pointer',
        background: 'transparent', padding: 0, width: size, height: size }}>

        {/* breathing halo */}
        <div style={{ position: 'absolute', inset: 14, borderRadius: '50%',
          background: `radial-gradient(circle at 50% 45%, ${T.mint} 0%, rgba(228,241,232,0) 70%)`,
          animation: 'afn-tb-breathe 5.5s ease-in-out infinite', pointerEvents: 'none' }} />

        {/* tap ripple */}
        {ripple > 0 && (
          <div key={'r' + ripple} style={{ position: 'absolute', inset: stroke, borderRadius: '50%',
            border: `1.5px solid ${T.green2}`, animation: 'afn-tb-ripple .7s ease-out both', pointerEvents: 'none' }} />
        )}
        {/* completion bloom */}
        {bloom > 0 && (
          <div key={'b' + bloom} style={{ position: 'absolute', inset: stroke, borderRadius: '50%',
            background: `radial-gradient(circle, ${T.leafLight}, rgba(169,216,190,0))`,
            animation: 'afn-tb-bloom .9s ease-out both', pointerEvents: 'none' }} />
        )}

        {/* ring */}
        <svg width={size} height={size} style={{ display: 'block', transform: 'rotate(-90deg)', position: 'relative' }}>
          <defs>
            <linearGradient id="afn-tb-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={T.green2} />
              <stop offset="100%" stopColor={T.greenMid} />
            </linearGradient>
          </defs>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.mint} strokeWidth={stroke} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="url(#afn-tb-grad)" strokeWidth={stroke}
            strokeDasharray={c} strokeDashoffset={c * (1 - value)} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset .55s cubic-bezier(.22,1,.36,1)' }} />
        </svg>

        {/* center content */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 5 }}>
          <span style={{ fontFamily: T.fScript, fontSize: 20, fontWeight: 700, color: T.green, lineHeight: 1 }}>{phase.text}</span>
          <span key={st.phase + '-' + st.count} style={{ fontFamily: T.fHead, fontSize: 34, fontWeight: 700,
            color: T.ink, lineHeight: 1, animation: 'afn-tb-num .35s ease both' }}>{num(st.count)}</span>
          <span style={{ fontFamily: T.fBody, fontSize: 12, color: T.inkMuted }}>/ {num(phase.target)}</span>
        </div>
      </button>

      {/* completion message only */}
      <div style={{ textAlign: 'center', marginTop: 16, minHeight: 18 }}>
        {justDone && (
          <span style={{ fontFamily: T.fBody, fontSize: 13, fontWeight: 700, color: T.green,
            animation: 'afn-tb-num .4s ease both' }}>{t('tb_done')}</span>
        )}
      </div>
    </Card>
  );
}

Object.assign(window, { TasbihCard });
