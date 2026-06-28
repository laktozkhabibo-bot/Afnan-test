// ui.jsx — shared app chrome: scaffold, header, tab bar, task rows, celebration

// screen scaffold: scrollable body with safe paddings
function Screen({ children, pad = 20 }) {
  return (
    <div className="afn-scroll" style={{
      position: 'absolute', inset: 0, overflowY: 'auto',
      paddingTop: 56, paddingBottom: 104, direction: window.afnDir(),
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{ padding: `0 ${pad}px` }}>{children}</div>
    </div>
  );
}

// big screen title (matches each tab)
function ScreenTitle({ children, sub }) {
  return (
    <div style={{ margin: '6px 2px 18px' }}>
      <h1 style={{ margin: 0, fontFamily: T.fHead, fontSize: 30, fontWeight: 700, color: T.ink, letterSpacing: -0.2 }}>{children}</h1>
      {sub && <div style={{ marginTop: 4, fontFamily: T.fBody, fontSize: 14.5, color: T.inkMuted }}>{sub}</div>}
    </div>
  );
}

function SectionLabel({ children, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '22px 4px 12px' }}>
      <span style={{ fontFamily: T.fHead, fontSize: 18, fontWeight: 600, color: T.ink }}>{children}</span>
      {action}
    </div>
  );
}

// brand wordmark (Aref Ruqaa green) — the chosen logo
function Wordmark({ size = 30, color = T.green }) {
  return <span style={{ fontFamily: T.fDisplay, fontWeight: 700, fontSize: size, color, lineHeight: 1, direction: 'rtl' }}>أفنان</span>;
}

// ── Tappable task row with leaf reward ────────────────────────────────
function TaskRow({ icon, name, hint, time, done, leaves, onToggle, accent = T.greenMid }) {
  return (
    <div onClick={onToggle} className="afn-tap" style={{
      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
      cursor: 'pointer',
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 13, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: done ? accent : T.mint,
        color: done ? '#fff' : accent,
        transition: 'background .25s, color .25s',
      }}>
        <Icon name={icon} size={22} stroke={1.9} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: T.fBody, fontSize: 16.5, fontWeight: 600, color: T.ink }}>{name}</div>
        {(hint || time) && (
          <div style={{ fontFamily: T.fBody, fontSize: 13, color: T.inkMuted, marginTop: 1 }}>
            {time ? window.tf('adhan_at', { t: time }) : hint}
          </div>
        )}
      </div>
      {/* leaf reward hint */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: done ? 0 : 0.55,
        transition: 'opacity .2s', marginLeft: 2 }}>
        <Icon name="leaf" size={14} color={T.leaf} />
        <span style={{ fontFamily: T.fBody, fontSize: 12.5, color: T.inkMuted, fontWeight: 600 }}>{leaves}</span>
      </div>
      {/* check */}
      <div style={{
        width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
        border: done ? 'none' : `2px solid ${T.mintEdge}`,
        background: done ? accent : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all .25s',
      }}>
        {done && <Icon name="check" size={16} color="#fff" stroke={2.6} />}
      </div>
    </div>
  );
}

// ── Bottom tab bar (RTL) ──────────────────────────────────────────────
const TABS = [
  { key: 'home',     label: 'الرئيسية', img: 'assets/icons/home.png' },
  { key: 'quran',    label: 'قرآني',    img: 'assets/icons/qurani.png' },
  { key: 'prayer',   label: 'صلاتي',    img: 'assets/icons/salati.png' },
  { key: 'adhkar',   label: 'الأذكار',  img: 'assets/icons/adhkar.png' },
  { key: 'settings', label: 'الإعدادات', img: 'assets/icons/settings.png', size: 22 },
];

function TabBar({ active, onChange }) {
  const tr = window.t;
  return (
    <div style={{
      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 40,
      direction: window.afnDir(),
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      padding: '9px 8px 26px',
      background: 'rgba(246,248,242,0.86)',
      backdropFilter: 'blur(18px) saturate(160%)', WebkitBackdropFilter: 'blur(18px) saturate(160%)',
      borderTop: `1px solid ${T.line}`,
    }}>
      {TABS.map(t => {
        const on = active === t.key;
        const label = tr('tab_' + t.key);
        return (
          <button key={t.key} onClick={() => onChange(t.key)} className="afn-tap" style={{
            border: 'none', background: 'transparent', cursor: 'pointer',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5,
            padding: '2px 2px', flex: 1, minWidth: 0,
          }}>
            <div style={{ height: 27, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img src={t.img} alt={label} style={{ width: t.size || 27, height: t.size || 27, objectFit: 'contain',
                filter: on ? 'none' : 'grayscale(0.9)',
                opacity: on ? 1 : 0.45, transform: on ? 'translateY(-1px)' : 'none',
                transition: 'opacity .2s, filter .2s, transform .2s' }} />
            </div>
            <span style={{ fontFamily: T.fBody, fontSize: 10, fontWeight: on ? 700 : 500, whiteSpace: 'nowrap',
              color: on ? T.green : T.inkMuted }}>{label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Celebration: rising leaves + "+N ورقة" ────────────────────────────
function Celebrate({ burst }) {
  if (!burst) return null;
  const items = Array.from({ length: 7 });
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 70, pointerEvents: 'none',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div key={burst.id} style={{
        fontFamily: T.fHead, fontSize: 22, fontWeight: 700, color: T.green,
        background: '#fff', padding: '12px 22px', borderRadius: 999,
        boxShadow: '0 10px 30px rgba(30,111,80,.22)',
        display: 'flex', alignItems: 'center', gap: 8,
        animation: 'afn-pop .4s cubic-bezier(.34,1.56,.64,1) both',
      }}>
        <Icon name="leaf" size={20} color={T.leaf} />
        <span>+{window.tnum(burst.n)} {window.t('unit_leaf')}</span>
      </div>
      {items.map((_, i) => {
        const a = (i / items.length) * Math.PI - Math.PI / 2;
        return (
          <div key={burst.id + '-' + i} style={{
            position: 'absolute', color: ['#7CC096','#5EA87C','#9AD2AE'][i % 3],
            animation: `afn-leaf-fly .9s ease-out ${i * 0.03}s both`,
            ['--dx']: `${Math.cos(a) * 120}px`, ['--dy']: `${-90 - Math.random() * 80}px`,
          }}>
            <Icon name="leaf" size={18} />
          </div>
        );
      })}
    </div>
  );
}

// inject celebrate keyframe
(function () {
  if (document.getElementById('afn-celebrate-kf')) return;
  const s = document.createElement('style'); s.id = 'afn-celebrate-kf';
  s.textContent = `@keyframes afn-leaf-fly { 0% { transform: translate(0,0) scale(.4); opacity: 0; }
    20% { opacity: 1; } 100% { transform: translate(var(--dx),var(--dy)) scale(1) rotate(40deg); opacity: 0; } }`;
  document.head.appendChild(s);
})();

Object.assign(window, { Screen, ScreenTitle, SectionLabel, Wordmark, TaskRow, TabBar, Celebrate, TABS });
