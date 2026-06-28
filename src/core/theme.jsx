// theme.jsx — Afnan design system: light/airy palette, fonts, icons, shared UI
// ألوان طبيعية هادئة وفاتحة · أخضر روحاني، ترابي دافئ، ذهبي خفيف

const T = {
  // grounds — light & airy
  bg:        '#F6F8F2',   // app background, soft warm sage-white
  bgSink:    '#EEF2E8',   // slightly recessed
  card:      '#FFFFFF',
  cardSoft:  '#FBFCF8',

  // greens — primary spiritual
  green:     '#1E6F50',   // brand wordmark green
  greenMid:  '#2E8B66',
  green2:    '#4AA079',
  leaf:      '#7CC09A',
  leafLight: '#A9D8BE',
  mint:      '#E4F1E8',    // tint backgrounds
  mintEdge:  '#D5E8DC',

  // earthy / gold
  gold:      '#C9A24B',
  goldSoft:  '#E7D6A8',
  clay:      '#C98A5E',
  claySoft:  '#F0E0D2',
  bark:      '#8A6F52',

  // text
  ink:       '#26352D',   // deep green-charcoal
  inkSoft:   '#586259',
  inkMuted:  '#94A099',
  line:      '#E7ECE2',

  // fonts
  fDisplay: '"Aref Ruqaa", serif',          // brand / hero name
  fHead:    '"El Messiri", sans-serif',     // headings
  fBody:    '"Tajawal", sans-serif',        // UI body
  fScript:  '"Amiri", serif',               // Quran / dua sacred text
  fQuran:   '"Amiri Quran", "Amiri", serif', // mushaf body — correct mark positioning
};

// inject fonts + global resets + animations once
(function injectFonts() {
  if (document.getElementById('afnan-fonts')) return;
  const link = document.createElement('link');
  link.id = 'afnan-fonts';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Aref+Ruqaa:wght@400;700&family=Amiri:wght@400;700&family=Amiri+Quran&family=El+Messiri:wght@400..700&family=Tajawal:wght@300;400;500;700;800&family=Reem+Kufi:wght@400..700&display=swap';
  document.head.appendChild(link);

  const st = document.createElement('style');
  st.textContent = `
    * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
    .afn-scroll::-webkit-scrollbar { width: 0; height: 0; }
    @keyframes afn-grow { 0% { transform: scale(0) translateY(4px); opacity: 0; }
      60% { transform: scale(1.12); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
    @keyframes afn-sway { 0%,100% { transform: rotate(var(--sw,0deg)); }
      50% { transform: rotate(calc(var(--sw,0deg) + 2.5deg)); } }
    @keyframes afn-rise { from { opacity: 0; transform: translateY(14px); }
      to { opacity: 1; transform: translateY(0); } }
    @keyframes afn-pop { 0% { transform: scale(0.8); opacity: 0; }
      55% { transform: scale(1.06); } 100% { transform: scale(1); opacity: 1; } }
    @keyframes afn-pulse { 0%,100% { opacity: .35; } 50% { opacity: .85; } }
    @keyframes afn-fade { from { opacity: 0; } to { opacity: 1; } }
    @keyframes afn-float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
    @keyframes afn-qpulse { 0%,100% { opacity: .35; transform: scale(1); } 50% { opacity: .6; transform: scale(1.04); } }
    @keyframes afn-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
    .afn-rise { animation: afn-rise .5s cubic-bezier(.22,1,.36,1) both; }
    .afn-tap { transition: transform .14s ease, box-shadow .2s ease, background .2s ease; }
    .afn-tap:active { transform: scale(.97); }
    .afn-fontrange { height: 16px; }
    .afn-fontrange::-webkit-slider-thumb { -webkit-appearance: none; appearance: none;
      width: 14px; height: 14px; border-radius: 50%; background: #fff;
      border: 2px solid #2E8B66; box-shadow: 0 1px 3px rgba(38,53,45,.25); cursor: pointer; }
    .afn-fontrange::-moz-range-thumb { width: 14px; height: 14px; border-radius: 50%; background: #fff;
      border: 2px solid #2E8B66; box-shadow: 0 1px 3px rgba(38,53,45,.25); cursor: pointer; }
    .afn-fontrange::-webkit-slider-runnable-track { background: transparent; height: 16px; }
    .afn-fontrange::-moz-range-track { background: transparent; height: 16px; }
  `;
  document.head.appendChild(st);
})();

// ── Icon set (stroke, currentColor) ───────────────────────────────────
function Icon({ name, size = 24, color = 'currentColor', stroke = 1.8, fill = 'none' }) {
  const p = { fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    tree: <g {...p}><path d="M12 21v-6"/><path d="M12 15c-3.2 0-5.4-2.3-5.4-5.1 0-1 .3-1.9.8-2.7C6.6 6.6 6.4 5.7 6.7 4.8 7.5 5 8.2 5.5 8.6 6.2 9.2 4.7 10.5 3.5 12 3.5s2.8 1.2 3.4 2.7c.4-.7 1.1-1.2 1.9-1.4.3.9.1 1.8-.7 2.4.5.8.8 1.7.8 2.7 0 2.8-2.2 5.1-5.4 5.1Z"/></g>,
    pray: <g {...p}><path d="M12 3v4"/><path d="M8.5 7h7l1.5 7H7l1.5-7Z"/><path d="M6 14h12l1 6.5H5L6 14Z"/></g>,
    book: <g {...p}><path d="M12 6.5C10.5 5.2 8.3 4.8 6 5.2v12c2.3-.4 4.5 0 6 1.3 1.5-1.3 3.7-1.7 6-1.3v-12c-2.3-.4-4.5 0-6 1.3Z"/><path d="M12 6.5v12"/></g>,
    seed: <g {...p}><path d="M12 21c0-4 0-6.5 0-7.5"/><path d="M12 13.5c0-2.8 2-5 4.5-5C16.5 11.3 14.5 13.5 12 13.5Z"/><path d="M12 14.5c0-2.4-1.8-4.3-4-4.3C8 12.6 9.8 14.5 12 14.5Z"/><path d="M9 21h6"/></g>,
    beads: <g {...p}><circle cx="12" cy="5" r="1.6"/><circle cx="6.6" cy="7.2" r="1.6"/><circle cx="4.5" cy="12.4" r="1.6"/><circle cx="6.6" cy="17.6" r="1.6"/><circle cx="12" cy="19.8" r="1.6"/><circle cx="17.4" cy="17.6" r="1.6"/><circle cx="19.5" cy="12.4" r="1.6"/><circle cx="17.4" cy="7.2" r="1.6"/></g>,
    check: <g {...p}><path d="M4 12.5l5 5 11-11"/></g>,
    plus: <g {...p}><path d="M12 5v14M5 12h14"/></g>,
    close: <g {...p}><path d="M6 6l12 12M18 6l-12 12"/></g>,
    camera: <g {...p}><path d="M3 8.5a2 2 0 0 1 2-2h2l1.4-2h7.2L19 6.5h0a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/><circle cx="12" cy="13" r="3.4"/></g>,
    moon: <g {...p}><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z"/></g>,
    sun: <g {...p}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19"/></g>,
    bell: <g {...p}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/></g>,
    chevron: <g {...p}><path d="M15 6l-6 6 6 6"/></g>,
    chevronL: <g {...p}><path d="M9 6l6 6-6 6"/></g>,
    heart: <g {...p}><path d="M12 20s-7-4.5-9.2-8.7C1.3 8.5 2.6 5.5 5.5 5.5c1.8 0 3.2 1.1 4 2.4.8-1.3 2.2-2.4 4-2.4 2.9 0 4.2 3 2.7 5.8C19 15.5 12 20 12 20Z"/></g>,
    leaf: <g {...p}><path d="M5 19c0-8 5-13 14-13 0 9-5 14-13 14"/><path d="M5 19c2.5-4 5-6.5 9-8.5"/></g>,
    water: <g {...p}><path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11Z"/></g>,
    sparkle: <g {...p}><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z"/></g>,
    star: <g {...p}><path d="M12 4l2.3 4.7 5.2.7-3.8 3.6.9 5.1L12 16.8 7.4 18.2l.9-5.1L4.5 9.4l5.2-.7L12 4Z"/></g>,
    quote: <g fill={color} stroke="none"><path d="M10.1 5.4C6.7 6.4 4.3 9.4 4.3 13v4.1c0 .85.7 1.55 1.55 1.55h3.4c.85 0 1.55-.7 1.55-1.55v-3.4c0-.85-.7-1.55-1.55-1.55H7.5c.25-1.85 1.35-3.05 3.2-3.75.55-.2.82-.8.62-1.35l-.02-.05c-.2-.52-.74-.78-1.2-.65Zm9.4 0c-3.4 1-5.8 4-5.8 7.6v4.1c0 .85.7 1.55 1.55 1.55h3.4c.85 0 1.55-.7 1.55-1.55v-3.4c0-.85-.7-1.55-1.55-1.55h-1.75c.25-1.85 1.35-3.05 3.2-3.75.55-.2.82-.8.62-1.35l-.02-.05c-.2-.52-.74-.78-1.2-.65Z"/></g>,
    arrowL: <g {...p}><path d="M5 12h14M12 5l7 7-7 7"/></g>,
    arrowR: <g {...p}><path d="M19 12H5M12 5l-7 7 7 7"/></g>,
    clock: <g {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></g>,
    play: <g {...p}><path d="M8 5.5v13l11-6.5-11-6.5Z"/></g>,
    stop: <g {...p}><rect x="6" y="6" width="12" height="12" rx="2.5"/></g>,
    pin: <g {...p}><path d="M12 21.5s6.5-5.4 6.5-10.5a6.5 6.5 0 1 0-13 0c0 5.1 6.5 10.5 6.5 10.5Z"/><circle cx="12" cy="10.5" r="2.5"/></g>,
    search: <g {...p}><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.4-3.4"/></g>,
    settings: <g {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 13.5a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V20a2 2 0 0 1-4 0v-.1a1.6 1.6 0 0 0-2.7-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H4a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.1-2.7l-.1-.1A2 2 0 1 1 7.9 4.5l.1.1a1.6 1.6 0 0 0 1.8.3 1.6 1.6 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8 1.6 1.6 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z"/></g>,
    flame: <g {...p}><path d="M12 3c1 3-1 4-1 6 0 1 1 1.5 1 1.5S14 9 13.5 6.5C16 8 17 10.5 17 13a5 5 0 0 1-10 0c0-2 1-3.5 2-4.5.2 1.2 1 1.8 1 1.8S9 8 12 3Z"/></g>,
    compass: <g {...p}><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5 5-2Z"/></g>,
    globe: <g {...p}><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.7 2.6 15.3 0 18M12 3c-2.6 2.7-2.6 15.3 0 18"/></g>,
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }} fill={fill}>{paths[name]}</svg>;
}

// ── Shared bits ────────────────────────────────────────────────────────
// glow: a theme color → faint inner light + tinted edge that reflects the card's theme
function Card({ children, style = {}, soft = false, glow = null, onClick, className = '' }) {
  const glowStyle = glow ? {
    background: `radial-gradient(120% 90% at 50% 0%, ${glow}1F 0%, ${glow}0A 38%, ${T.card} 72%)`,
    boxShadow: `inset 0 1px 0 ${glow}33, inset 0 0 26px ${glow}1A, 0 1px 2px rgba(38,53,45,.04), 0 8px 24px ${glow}26`,
    border: `1px solid ${glow}3D`,
  } : {};
  return (
    <div onClick={onClick} className={className + (onClick ? ' afn-tap' : '')} style={{
      background: soft ? T.cardSoft : T.card,
      borderRadius: 22,
      boxShadow: '0 1px 2px rgba(38,53,45,.04), 0 6px 22px rgba(38,53,45,.05)',
      border: `1px solid ${T.line}`,
      ...glowStyle,
      ...style,
    }}>{children}</div>
  );
}

function Ring({ value, size = 54, stroke = 5, color = T.greenMid, track = T.mintEdge, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={track} strokeWidth={stroke} />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={c} strokeDashoffset={c * (1 - value)} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset .8s cubic-bezier(.22,1,.36,1)' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {children}
      </div>
    </div>
  );
}

// pill chip
function Chip({ children, active = false, color = T.green, onClick }) {
  return (
    <button onClick={onClick} className="afn-tap" style={{
      border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
      fontFamily: T.fBody, fontSize: 14.5, fontWeight: 600,
      padding: '9px 16px', borderRadius: 999,
      background: active ? color : T.mint,
      color: active ? '#fff' : T.green,
      boxShadow: active ? `0 4px 12px ${color}40` : 'none',
    }}>{children}</button>
  );
}

Object.assign(window, { T, Icon, Card, Ring, Chip });
