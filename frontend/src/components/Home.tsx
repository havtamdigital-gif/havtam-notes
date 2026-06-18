import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProgress } from '../hooks/useProgress';
import ShaderBg from './ShaderBg';
import ProgressRing3D from './ProgressRing3D';

/* ── Wand trail ── */
function useWandTrail() {
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const dot = document.createElement('div');
      dot.className = 'wand-trail-dot';
      const size = Math.random()*5+3, hue = 300+Math.random()*60;
      dot.style.cssText = `left:${e.clientX}px;top:${e.clientY}px;width:${size}px;height:${size}px;background:hsl(${hue},100%,72%);box-shadow:0 0 6px hsl(${hue},100%,72%);`;
      document.body.appendChild(dot);
      setTimeout(() => dot.remove(), 900);
    };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
}

/* ── Glitter rain ── */
function GlitterRain() {
  const bits = Array.from({length: 28}, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: Math.random() * 7 + 4,
    dur: Math.random() * 8 + 6,
    delay: Math.random() * 8,
    drift: (Math.random() - 0.5) * 70,
    rot: Math.random() * 720 - 360,
    hue: 300 + Math.random() * 60,
  }));
  return (
    <div className="glitter-rain">
      {bits.map(b => (
        <div key={b.id} className="glitter-bit glitter-star"
          style={{
            left: `${b.left}%`, width: `${b.size}px`, height: `${b.size}px`,
            background: `hsl(${b.hue},100%,70%)`,
            filter: `drop-shadow(0 0 3px hsl(${b.hue},100%,70%))`,
            animationDuration: `${b.dur}s, 3s`,
            animationDelay: `${b.delay}s, ${b.delay * 0.4}s`,
            '--drift': `${b.drift}px`, '--rot': `${b.rot}deg`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* ── 3D balloon title with mouse-tracking ── */
function BalloonTitle() {
  const ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const span = el.querySelector('span') as HTMLElement | null;
    if (!span) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      span.style.setProperty('--rx', `${-dy * 8}deg`);
      span.style.setProperty('--ry', `${dx * 10}deg`);
      span.style.setProperty('--sx', `${dx * 3}px`);
      span.style.setProperty('--sy', `${dy * 3}px`);
    };
    const onLeave = () => {
      span.style.setProperty('--rx', '0deg');
      span.style.setProperty('--ry', '0deg');
      span.style.setProperty('--sx', '0px');
      span.style.setProperty('--sy', '0px');
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <h1 ref={ref} className="title-balloon" style={{ direction: 'ltr', textAlign: 'center', margin: 0 }}>
      <span data-text="Havtam's Notes">Havtam's Notes</span>
    </h1>
  );
}

export default function Home() {
  useWandTrail();
  const nav = useNavigate();
  const { progress, streak, getEarnedBadges } = useProgress();
  const badges = getEarnedBadges();
  const lessons = progress.completedLessons.length;

  return (
    <div className="home-invert" style={{
      minHeight: 'calc(100vh - 60px)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px', position: 'relative',
      gap: '16px', overflow: 'hidden',
    }}>
      {/* Animated WebGL shader background */}
      <ShaderBg />

      <GlitterRain />

      {/* Title */}
      <BalloonTitle />

      {/* Subtitle */}
      <p style={{
        fontFamily: 'var(--font-sans)', fontSize: '1rem',
        color: 'var(--muted-foreground)', fontWeight: 500,
        letterSpacing: '0.12em', direction: 'ltr',
        margin: '-20px 0 0',
      }}>
        HTML &nbsp;·&nbsp; CSS &nbsp;·&nbsp; JavaScript
      </p>

      {/* CTA buttons */}
      <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button className="cta-3d" onClick={() => nav('/dictionary')}>
          פתחי את המילון
        </button>
        <button className="cta-ghost-3d" onClick={() => nav('/roadmap')}>
          למסלול הלמידה
        </button>
      </div>

      {/* Progress stats */}
      {(lessons > 0 || streak > 0 || badges.length > 0) && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
          marginTop: '8px',
        }}>
          {/* 3D progress ring (lessons) + streak side by side */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {lessons > 0 && <ProgressRing3D lessons={lessons} />}
            {streak > 0 && (
              <div style={{
                background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,79,163,0.2)', borderRadius: '20px',
                padding: '8px 18px', fontSize: '0.88rem', color: '#D63384',
                display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700,
                boxShadow: '0 4px 12px rgba(214,51,132,0.12)',
              }}>
                <span style={{ fontSize: '1.1rem' }}>⚡</span>
                <span>{streak} {streak === 1 ? 'יום' : 'ימים'} ברצף</span>
              </div>
            )}
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', maxWidth: '420px' }}>
              {badges.map(b => (
                <div key={b.id} title={b.desc} style={{
                  background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,79,163,0.18)', borderRadius: '16px',
                  padding: '4px 12px', fontSize: '0.8rem', color: '#D63384',
                  cursor: 'default', transition: 'transform 0.15s',
                  display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600,
                }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  <span>{b.icon}</span>
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
