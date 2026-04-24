// scenes.jsx — Lock/Home screen scenes showing Totodile roaming
// Original, non-branded Android-style shell.

const SPRITE = 'assets/totodile.gif';

// Shared wallpaper: soft dusk sky with layered hills + stars
function Wallpaper({ children, variant = 'dusk' }) {
  const bg = variant === 'dusk'
    ? 'linear-gradient(180deg, #2a2745 0%, #4a3f6b 38%, #7a5a7e 62%, #c88a80 82%, #e8b999 100%)'
    : 'linear-gradient(180deg, #0e1226 0%, #1a1e3f 45%, #2a2a5c 75%, #3d3560 100%)';
  return (
    <div style={{ position: 'absolute', inset: 0, background: bg, overflow: 'hidden' }}>
      {/* Stars (only in night) */}
      {variant === 'night' && [...Array(28)].map((_, i) => {
        const top = (i * 37) % 55;
        const left = (i * 53) % 100;
        const sz = (i % 3 === 0) ? 2 : 1;
        return <div key={i} style={{
          position: 'absolute', top: `${top}%`, left: `${left}%`,
          width: sz, height: sz, borderRadius: sz,
          background: 'rgba(255,255,255,0.85)',
          boxShadow: '0 0 4px rgba(255,255,255,0.5)',
        }}/>;
      })}
      {/* Distant hill silhouette 1 */}
      <svg viewBox="0 0 412 200" preserveAspectRatio="none"
        style={{ position: 'absolute', bottom: '22%', left: 0, width: '100%', height: '28%', opacity: 0.55 }}>
        <path d="M0,140 C60,90 120,110 180,80 C240,50 300,90 360,70 L412,80 L412,200 L0,200 Z"
          fill={variant === 'dusk' ? '#3a2d52' : '#0a0d20'}/>
      </svg>
      {/* Near hill silhouette */}
      <svg viewBox="0 0 412 200" preserveAspectRatio="none"
        style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '26%' }}>
        <path d="M0,110 C80,70 160,100 220,60 C280,20 340,70 412,50 L412,200 L0,200 Z"
          fill={variant === 'dusk' ? '#1e1633' : '#05071a'}/>
      </svg>
      {/* Subtle ground plane where Totodile walks */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 120,
        background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.35) 100%)' }}/>
      {children}
    </div>
  );
}

// ─── Totodile walking sprite with CSS animation ───
function Totodile({ bottom = 64, duration = 18, direction = 'rtl', size = 64, paused = false }) {
  const animName = direction === 'rtl' ? 'toto-walk-rtl' : 'toto-walk-ltr';
  return (
    <>
      <style>{`
        @keyframes toto-walk-rtl {
          0%   { left: 100%; transform: translateX(0) scaleX(1); }
          49%  { left: 0%;   transform: translateX(-100%) scaleX(1); }
          50%  { left: 0%;   transform: translateX(-100%) scaleX(-1); }
          99%  { left: 100%; transform: translateX(0) scaleX(-1); }
          100% { left: 100%; transform: translateX(0) scaleX(1); }
        }
        @keyframes toto-bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
        .toto-shadow {
          animation: toto-bob 0.6s ease-in-out infinite;
        }
      `}</style>
      <div style={{
        position: 'absolute', bottom, left: '100%',
        width: size, height: size,
        animation: `${animName} ${duration}s linear infinite`,
        animationPlayState: paused ? 'paused' : 'running',
        pointerEvents: 'none',
      }}>
        <div className="toto-shadow" style={{ position: 'relative', width: '100%', height: '100%' }}>
          {/* shadow */}
          <div style={{
            position: 'absolute', bottom: -4, left: '50%', transform: 'translateX(-50%)',
            width: size * 0.7, height: 6, borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.45) 0%, transparent 70%)',
          }}/>
          <img src={SPRITE} alt="Totodile" style={{
            width: '100%', height: '100%', imageRendering: 'pixelated',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
          }}/>
        </div>
      </div>
    </>
  );
}

// ─── Status bar (original, simple) ───
function StatusBar({ light = true }) {
  const c = light ? 'rgba(255,255,255,0.95)' : '#1a1a1a';
  return (
    <div style={{
      height: 34, padding: '0 20px', display: 'flex',
      alignItems: 'center', justifyContent: 'space-between',
      color: c, fontSize: 13, fontWeight: 600,
      fontFamily: 'ui-rounded, -apple-system, system-ui, sans-serif',
      position: 'relative', zIndex: 5,
    }}>
      <span style={{ letterSpacing: 0.3 }}>21:04</span>
      <div style={{
        position: 'absolute', left: '50%', top: 10, transform: 'translateX(-50%)',
        width: 18, height: 18, borderRadius: '50%', background: '#0a0a0a',
      }}/>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        {/* signal */}
        <svg width="14" height="10" viewBox="0 0 14 10"><path d="M0 8h2v2H0zm3-2h2v4H3zm3-2h2v6H6zm3-2h2v8H9zm3-2h2v10h-2z" fill={c}/></svg>
        {/* wifi */}
        <svg width="14" height="10" viewBox="0 0 14 10"><path d="M7 10l2-2-1-1a2 2 0 00-2 0l-1 1 2 2zm-4-4l1 1a4 4 0 016 0l1-1a6 6 0 00-8 0zm-2-2l1 1a7 7 0 0110 0l1-1a9 9 0 00-12 0z" fill={c}/></svg>
        {/* battery */}
        <div style={{ width: 22, height: 11, border: `1.3px solid ${c}`, borderRadius: 2.5, position: 'relative', padding: 1.2 }}>
          <div style={{ width: '78%', height: '100%', background: c, borderRadius: 1 }}/>
          <div style={{ position: 'absolute', right: -3, top: 3, width: 2, height: 5, background: c, borderRadius: 1 }}/>
        </div>
      </div>
    </div>
  );
}

// ─── Gesture nav pill ───
function NavPill({ light = true }) {
  return (
    <div style={{ height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', zIndex: 5 }}>
      <div style={{ width: 122, height: 4.5, borderRadius: 3, background: light ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.45)' }}/>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SCENE 1 — Lock screen with Totodile walking past
// ═══════════════════════════════════════════════════════════
function LockScreen() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#000',
      fontFamily: 'ui-rounded, -apple-system, system-ui, sans-serif' }}>
      <Wallpaper variant="dusk">
        <StatusBar light/>

        {/* Clock */}
        <div style={{ position: 'absolute', top: 88, left: 0, right: 0, textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: 2, opacity: 0.85, textTransform: 'uppercase' }}>
            Tue · 21 Apr
          </div>
          <div style={{ fontSize: 96, fontWeight: 200, letterSpacing: -4, lineHeight: 1, marginTop: 4,
            textShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
            21:04
          </div>
        </div>

        {/* Pokémon Screen HUD nugget (shows level + XP bar) */}
        <div style={{ position: 'absolute', top: 238, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.22)', borderRadius: 18,
          padding: '10px 16px', color: '#fff', display: 'flex', alignItems: 'center', gap: 12, minWidth: 240,
        }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg, #6ec7e8 0%, #3a8fbf 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, letterSpacing: 0.3 }}>
            Lv8
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600, opacity: 0.95 }}>Totodile · Caimán</div>
            <div style={{ marginTop: 4, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.22)', overflow: 'hidden' }}>
              <div style={{ width: '62%', height: '100%', background: 'linear-gradient(90deg, #6ec7e8, #a8e4f0)' }}/>
            </div>
            <div style={{ fontSize: 10, opacity: 0.7, marginTop: 3, letterSpacing: 0.2, fontVariantNumeric: 'tabular-nums' }}>
              1 247 / 2 000 XP · evolves at Lv 18
            </div>
          </div>
        </div>

        {/* notification stack */}
        <div style={{ position: 'absolute', top: 360, left: 20, right: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { app: 'Pokémon Screen', title: 'Totodile walked 2 341 steps with you today', time: 'now', color: '#6ec7e8' },
            { app: 'Messages', title: 'Mom', body: '¿Cenas en casa?', time: '19:42', color: '#7bd88f' },
          ].map((n, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.2)', borderRadius: 16,
              padding: '10px 14px', color: '#fff',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, opacity: 0.8 }}>
                <div style={{ width: 14, height: 14, borderRadius: 4, background: n.color }}/>
                <span style={{ fontWeight: 600 }}>{n.app.toUpperCase()}</span>
                <span style={{ marginLeft: 'auto', opacity: 0.7 }}>{n.time}</span>
              </div>
              <div style={{ marginTop: 4, fontSize: 13, fontWeight: 600 }}>{n.title}</div>
              {n.body && <div style={{ fontSize: 12, opacity: 0.85, marginTop: 1 }}>{n.body}</div>}
            </div>
          ))}
        </div>

        {/* Totodile walking along the base */}
        <Totodile bottom={56} duration={22} size={70}/>

        {/* bottom shortcuts + pill */}
        <div style={{ position: 'absolute', bottom: 48, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 36px' }}>
          <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a4 4 0 00-4 4v4a4 4 0 008 0V6a4 4 0 00-4-4zM5 10a7 7 0 0014 0M12 17v4"/>
            </svg>
          </div>
          <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(14px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
        </div>
        <NavPill light/>
      </Wallpaper>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SCENE 2 — Home screen with Totodile peeking between apps
// ═══════════════════════════════════════════════════════════
function HomeScreen() {
  // Generic, non-branded app icon placeholders (colored rounded squares + single glyph)
  const apps = [
    { name: 'Mail',     bg: 'linear-gradient(135deg,#ff9a56,#ff5e62)', glyph: '✉' },
    { name: 'Calendar', bg: 'linear-gradient(135deg,#fafafa,#e2e2e2)', glyph: '21', dark: true },
    { name: 'Notes',    bg: 'linear-gradient(135deg,#ffe16e,#ffc54a)', glyph: '✎', dark: true },
    { name: 'Maps',     bg: 'linear-gradient(135deg,#7bd88f,#3aa963)', glyph: '◉' },
    { name: 'Music',    bg: 'linear-gradient(135deg,#ff6b9d,#c23674)', glyph: '♪' },
    { name: 'Camera',   bg: 'linear-gradient(135deg,#555,#222)',      glyph: '◎' },
    { name: 'Steps',    bg: 'linear-gradient(135deg,#5bc0be,#0b8793)', glyph: '↑' },
    { name: 'Weather',  bg: 'linear-gradient(135deg,#6ec7e8,#3a8fbf)', glyph: '☁', dark: false },
    { name: 'Gallery',  bg: 'linear-gradient(135deg,#b07aff,#6a3fbf)', glyph: '▣' },
    { name: 'Clock',    bg: 'linear-gradient(135deg,#111,#333)',      glyph: '◴' },
    { name: 'Pokémon',  bg: 'linear-gradient(135deg,#6ec7e8,#2a5a8f)', glyph: '●' },
    { name: 'Settings', bg: 'linear-gradient(135deg,#aaa,#666)',      glyph: '⚙' },
  ];

  const dock = [
    { name: 'Phone',   bg: '#2ecc71', glyph: '☎' },
    { name: 'Msgs',    bg: '#3aa0ff', glyph: '✎' },
    { name: 'Browser', bg: '#ff7a59', glyph: '◐' },
    { name: 'Photos',  bg: '#c23674', glyph: '▣' },
  ];

  const Icon = ({ a, size = 54 }) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: size + 14 }}>
      <div style={{
        width: size, height: size, borderRadius: 16, background: a.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: a.dark ? '#222' : '#fff', fontSize: 22, fontWeight: 700,
        boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
        fontFamily: 'ui-rounded, system-ui, sans-serif',
      }}>{a.glyph}</div>
      <div style={{ fontSize: 11, color: '#fff', fontWeight: 500, textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>{a.name}</div>
    </div>
  );

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#000',
      fontFamily: 'ui-rounded, -apple-system, system-ui, sans-serif' }}>
      <Wallpaper variant="dusk">
        <StatusBar light/>

        {/* Search pill */}
        <div style={{ position: 'absolute', top: 54, left: 20, right: 20, height: 42,
          background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.22)', borderRadius: 21,
          display: 'flex', alignItems: 'center', padding: '0 16px', gap: 10, color: 'rgba(255,255,255,0.85)' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>
          </svg>
          <span style={{ fontSize: 13 }}>Search</span>
        </div>

        {/* App grid — 3 rows of 4, leaving vertical space for Totodile */}
        <div style={{ position: 'absolute', top: 116, left: 16, right: 16, display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)', rowGap: 18, justifyItems: 'center' }}>
          {apps.map((a, i) => <Icon key={i} a={a}/>)}
        </div>

        {/* Widget: step counter w/ Totodile note */}
        <div style={{ position: 'absolute', top: 404, left: 20, right: 20,
          background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20,
          padding: '14px 16px', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#6ec7e8,#3a8fbf)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>●</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, opacity: 0.75, fontWeight: 600, letterSpacing: 0.4, textTransform: 'uppercase' }}>Today together</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginTop: 1 }}>2 341 steps · +47 XP</div>
            </div>
            <div style={{ fontSize: 11, opacity: 0.7 }}>Lv 8 · 62%</div>
          </div>
          <div style={{ marginTop: 10, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
            <div style={{ width: '62%', height: '100%', background: 'linear-gradient(90deg,#6ec7e8,#a8e4f0)' }}/>
          </div>
        </div>

        {/* Totodile walking — between widget and dock */}
        <Totodile bottom={136} duration={20} size={64}/>

        {/* Dock */}
        <div style={{ position: 'absolute', bottom: 52, left: 14, right: 14, height: 76,
          background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)', borderRadius: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '0 8px' }}>
          {dock.map((a, i) => (
            <div key={i} style={{
              width: 48, height: 48, borderRadius: 14, background: a.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 20, fontWeight: 700,
              boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
            }}>{a.glyph}</div>
          ))}
        </div>
        <NavPill light/>
      </Wallpaper>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SCENE 3 — Tap-to-cry moment (night variant)
// ═══════════════════════════════════════════════════════════
function CryScreen() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#000',
      fontFamily: 'ui-rounded, -apple-system, system-ui, sans-serif' }}>
      <style>{`
        @keyframes cry-ripple {
          0% { transform: translateX(-50%) scale(0.4); opacity: 0.7; }
          100% { transform: translateX(-50%) scale(2.2); opacity: 0; }
        }
        @keyframes cry-pop {
          0% { transform: translate(-50%, 10px) scale(0.6); opacity: 0; }
          20% { transform: translate(-50%, -4px) scale(1.1); opacity: 1; }
          100% { transform: translate(-50%, -20px) scale(1); opacity: 0; }
        }
        @keyframes xp-float {
          0% { transform: translateY(0); opacity: 0; }
          20% { transform: translateY(-8px); opacity: 1; }
          100% { transform: translateY(-48px); opacity: 0; }
        }
      `}</style>
      <Wallpaper variant="night">
        <StatusBar light/>
        <div style={{ position: 'absolute', top: 88, left: 0, right: 0, textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: 2, opacity: 0.85, textTransform: 'uppercase' }}>
            Tue · 21 Apr
          </div>
          <div style={{ fontSize: 96, fontWeight: 200, letterSpacing: -4, lineHeight: 1, marginTop: 4 }}>
            23:47
          </div>
        </div>

        {/* HUD */}
        <div style={{ position: 'absolute', top: 238, left: '50%', transform: 'translateX(-50%)',
          background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.18)', borderRadius: 18,
          padding: '10px 16px', color: '#fff', display: 'flex', alignItems: 'center', gap: 12, minWidth: 240 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%',
            background: 'linear-gradient(135deg,#6ec7e8 0%,#3a8fbf 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700 }}>Lv8</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 600 }}>Totodile · Caimán</div>
            <div style={{ marginTop: 4, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.22)', overflow: 'hidden' }}>
              <div style={{ width: '63%', height: '100%', background: 'linear-gradient(90deg,#6ec7e8,#a8e4f0)' }}/>
            </div>
            <div style={{ fontSize: 10, opacity: 0.7, marginTop: 3, fontVariantNumeric: 'tabular-nums' }}>
              1 252 / 2 000 XP
            </div>
          </div>
        </div>

        {/* The cry moment — Totodile standing still with speech bubble + ripple */}
        <div style={{ position: 'absolute', bottom: 140, left: '50%', transform: 'translateX(-50%)',
          width: 180, height: 120, display: 'flex', justifyContent: 'center', alignItems: 'flex-end' }}>

          {/* ripple rings */}
          {[0, 0.7, 1.4].map((d, i) => (
            <div key={i} style={{
              position: 'absolute', bottom: 12, left: '50%',
              width: 80, height: 80, borderRadius: '50%',
              border: '2px solid rgba(110, 199, 232, 0.7)',
              animation: `cry-ripple 2.1s ease-out ${d}s infinite`,
            }}/>
          ))}

          {/* speech bubble */}
          <div style={{ position: 'absolute', top: -6, left: '50%',
            animation: 'cry-pop 1.4s ease-out infinite',
            background: 'rgba(255,255,255,0.96)', color: '#2a5a8f',
            padding: '6px 12px', borderRadius: 14, fontWeight: 700, fontSize: 13,
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            ¡Toto! ✨
            <div style={{ position: 'absolute', bottom: -5, left: '50%', marginLeft: -4,
              width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
              borderTop: '6px solid rgba(255,255,255,0.96)' }}/>
          </div>

          {/* XP +1 floating */}
          <div style={{ position: 'absolute', top: 30, left: '72%',
            animation: 'xp-float 1.6s ease-out infinite',
            color: '#a8e4f0', fontSize: 14, fontWeight: 700,
            textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>+1 XP</div>

          {/* Shadow */}
          <div style={{ position: 'absolute', bottom: 6, width: 50, height: 8, borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(0,0,0,0.5) 0%, transparent 70%)' }}/>

          <img src={SPRITE} alt="Totodile" style={{
            width: 78, height: 78, imageRendering: 'pixelated', position: 'relative', zIndex: 2,
            filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.5))',
          }}/>
        </div>

        {/* Tap hint */}
        <div style={{ position: 'absolute', bottom: 96, left: '50%', transform: 'translateX(-50%)',
          color: 'rgba(255,255,255,0.65)', fontSize: 11, letterSpacing: 1, textTransform: 'uppercase' }}>
          Tap to play · Long-press for menu
        </div>

        <NavPill light/>
      </Wallpaper>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// SCENE 4 — Ambient walk path (behaviour diagram)
// ═══════════════════════════════════════════════════════════
function BehaviourScreen() {
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', background: '#000',
      fontFamily: 'ui-rounded, -apple-system, system-ui, sans-serif' }}>
      <Wallpaper variant="dusk">
        <StatusBar light/>
        <div style={{ position: 'absolute', top: 88, left: 0, right: 0, textAlign: 'center', color: '#fff' }}>
          <div style={{ fontSize: 13, fontWeight: 500, letterSpacing: 2, opacity: 0.85, textTransform: 'uppercase' }}>
            Behaviour preview
          </div>
          <div style={{ fontSize: 40, fontWeight: 300, letterSpacing: -1, marginTop: 6 }}>
            How it roams
          </div>
        </div>

        {/* Path overlay — dashed walk route across the screen */}
        <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          <defs>
            <linearGradient id="pathG" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#6ec7e8" stopOpacity="0"/>
              <stop offset="20%" stopColor="#6ec7e8" stopOpacity="0.8"/>
              <stop offset="80%" stopColor="#a8e4f0" stopOpacity="0.8"/>
              <stop offset="100%" stopColor="#a8e4f0" stopOpacity="0"/>
            </linearGradient>
          </defs>
          <path d="M 20 520 Q 100 505, 180 520 T 350 515 T 450 525"
            stroke="url(#pathG)" strokeWidth="2" strokeDasharray="4 6" fill="none"/>
        </svg>

        {/* Annotated dots along the path */}
        {[
          { x: 60, y: 490, label: 'Idle · 8s', note: 'sits & looks around' },
          { x: 200, y: 490, label: 'Walk →', note: '0.4 px/frame' },
          { x: 330, y: 490, label: 'Cry (rare)', note: 'every ~5 min' },
        ].map((p, i) => (
          <div key={i} style={{ position: 'absolute', left: p.x, top: p.y,
            color: '#fff', fontSize: 10, textAlign: 'center', transform: 'translate(-50%, -100%)' }}>
            <div style={{ fontWeight: 700, letterSpacing: 0.3 }}>{p.label}</div>
            <div style={{ opacity: 0.65, fontSize: 9 }}>{p.note}</div>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#a8e4f0',
              margin: '6px auto 0', boxShadow: '0 0 8px #6ec7e8' }}/>
          </div>
        ))}

        {/* Two Totodile sprites at different points to show the path */}
        <div style={{ position: 'absolute', bottom: 60, left: 50, width: 54, height: 54 }}>
          <img src={SPRITE} style={{ width: '100%', height: '100%', imageRendering: 'pixelated',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5)) opacity(0.55)' }}/>
        </div>
        <Totodile bottom={60} duration={16} size={64}/>

        {/* Spec list */}
        <div style={{ position: 'absolute', top: 200, left: 20, right: 20,
          background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.14)', borderRadius: 18,
          padding: 14, color: '#fff' }}>
          {[
            ['Render surface', 'WallpaperService + Canvas @ 30 fps'],
            ['Sprite size', '64×64 dp · pixelated scaling'],
            ['Walk speed', '24 dp/s · bob every 0.6 s'],
            ['Cry trigger', 'tap · or random (5–15 min)'],
            ['Sleep hours', '00:00 → 07:00 (idle only)'],
          ].map(([k, v], i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between',
              padding: '7px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              fontSize: 12 }}>
              <span style={{ opacity: 0.65 }}>{k}</span>
              <span style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{v}</span>
            </div>
          ))}
        </div>

        <NavPill light/>
      </Wallpaper>
    </div>
  );
}

Object.assign(window, { LockScreen, HomeScreen, CryScreen, BehaviourScreen });
