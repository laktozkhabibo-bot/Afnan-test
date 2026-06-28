// welcome_sheet.jsx — لوحُ ترحيبٍ يظهر عند فتح التطبيق (التجربة الأولى لأفنان)

(function () {
  if (document.getElementById('afn-welcome-kf')) return;
  const s = document.createElement('style'); s.id = 'afn-welcome-kf';
  s.textContent = `@keyframes afn-wel-dim { from { opacity: 0; } to { opacity: 1; } }
    @keyframes afn-wel-rise { from { opacity: 0; transform: translateY(26px) scale(.97); } to { opacity: 1; transform: none; } }`;
  document.head.appendChild(s);
})();

function WelcomeSheet({ onClose, onDontShow }) {
  const T2 = window.T;
  return (
    <div onClick={onClose} style={{ position: 'absolute', inset: 0, zIndex: 130, direction: 'rtl',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      background: 'rgba(16,42,32,.55)', backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)',
      animation: 'afn-wel-dim .3s ease both' }}>
      <div onClick={e => e.stopPropagation()} className="afn-scroll" style={{ width: '100%', maxWidth: 360, maxHeight: '90%', overflowY: 'auto',
        background: T2.bg, borderRadius: 28, boxShadow: '0 24px 70px rgba(10,40,28,.4)',
        animation: 'afn-wel-rise .42s cubic-bezier(.22,1,.36,1) both' }}>

        {/* ترويسة خضراء */}
        <div style={{ position: 'relative', overflow: 'hidden', padding: '30px 24px 24px', textAlign: 'center',
          background: 'linear-gradient(165deg,#1E6F50,#0C4636)', borderTopLeftRadius: 28, borderTopRightRadius: 28 }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.18,
            background: 'radial-gradient(circle at 80% -10%, #BFE2CB, transparent 55%)' }} />
          <div style={{ position: 'relative' }}>
            <div style={{ fontFamily: T2.fDisplay || T2.fHead, fontSize: 40, fontWeight: 700, color: '#fff', lineHeight: 1.1 }}>أفنان</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginTop: 12, padding: '6px 16px',
              borderRadius: 999, background: 'rgba(255,255,255,.16)' }}>
              <span style={{ fontFamily: T2.fBody, fontSize: 13, fontWeight: 700, color: T2.goldSoft || '#E8D9A8' }}>التجربة الأولى 🌿</span>
            </div>
          </div>
        </div>

        {/* المتن */}
        <div style={{ padding: '22px 24px 26px' }}>
          <p style={{ margin: 0, fontFamily: T2.fHead, fontSize: 17, fontWeight: 700, color: T2.ink, lineHeight: 1.9, textAlign: 'center' }}>
            هذه هي التجربةُ الأولى لتطبيق أفنان 🌿
          </p>

          <p style={{ margin: '16px 0 0', fontFamily: T2.fBody, fontSize: 14.5, color: T2.inkSoft, lineHeight: 2, textAlign: 'center', textWrap: 'pretty' }}>
            فكرةُ التطبيقِ الأساسيّةُ هي القرآنُ الكريمُ بالقراءاتِ العشرِ التي نعملُ عليها بإذنِ الله، وقد أضفنا مواقيتَ الصلاةِ والقبلةَ والأذكار.
          </p>
          <p style={{ margin: '12px 0 0', fontFamily: T2.fBody, fontSize: 14.5, color: T2.inkSoft, lineHeight: 2, textAlign: 'center', textWrap: 'pretty' }}>
            وهناك الكثيرُ من الأفكارِ التي تراودُنا ونعملُ عليها، فادعوا لنا بإتمامِه على خير.
          </p>

          <div style={{ margin: '18px 0 0', padding: '14px 16px', borderRadius: 16, background: T2.mint,
            border: `1px solid ${T2.mintEdge}`, textAlign: 'center' }}>
            <p style={{ margin: 0, fontFamily: T2.fScript || T2.fHead, fontSize: 18, fontWeight: 700, color: T2.green, lineHeight: 1.9 }}>
              اللهمَّ اجعلْهُ حُجّةً لنا لا علينا يا ربّ
            </p>
          </div>

          {/* اعتماد */}
          <div style={{ margin: '20px 0 0', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[['المبرمج', 'ميسرة العيساوي'], ['المصمّم', 'ميسرة العيساوي']].map(([role, name], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '11px 14px', borderRadius: 13, background: T2.card, border: `1px solid ${T2.line}` }}>
                <span style={{ fontFamily: T2.fBody, fontSize: 12.5, fontWeight: 600, color: T2.inkMuted }}>{role}</span>
                <span style={{ fontFamily: T2.fHead, fontSize: 15, fontWeight: 700, color: T2.ink }}>{name}</span>
              </div>
            ))}
          </div>

          <button onClick={onClose} className="afn-tap" style={{ width: '100%', marginTop: 22, border: 'none', cursor: 'pointer',
            background: `linear-gradient(180deg,${T2.greenMid},${T2.green})`, color: '#fff', boxShadow: `0 10px 24px ${T2.green}33`,
            fontFamily: T2.fHead, fontSize: 16.5, fontWeight: 700, padding: '14px', borderRadius: 16 }}>
            تبارك الله
          </button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { WelcomeSheet });
