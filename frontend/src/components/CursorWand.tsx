import { useEffect, useRef } from 'react';

export default function CursorWand() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  useEffect(() => {
    if (reduced) return;
    document.documentElement.style.cursor = 'none';
    const onMove = (e: MouseEvent) => {
      if (!ref.current) return;
      // hotspot = star tip at SVG (10,0) → offset wand div by (-10, 0)
      ref.current.style.left    = (e.clientX - 10) + 'px';
      ref.current.style.top     = e.clientY + 'px';
      ref.current.style.opacity = '1';
    };
    window.addEventListener('mousemove', onMove);
    return () => { document.documentElement.style.cursor=''; window.removeEventListener('mousemove',onMove); };
  }, [reduced]);

  if (reduced) return null;
  return (
    <div ref={ref} style={{ position:'fixed', pointerEvents:'none', zIndex:99999, opacity:0 }} aria-hidden>
      <svg width="38" height="38" viewBox="0 0 38 38"
        style={{ display:'block', filter:'drop-shadow(0 0 4px #FF4FA3)' }}>
        {/* handle — starts exactly at star center (10,12) */}
        <line x1="10" y1="12" x2="35" y2="35"
          stroke="#FF4FA3" strokeWidth="4" strokeLinecap="round"/>
        {/* inner highlight on handle */}
        <line x1="10" y1="12" x2="35" y2="35"
          stroke="#fce4f3" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"/>
        {/* star — same #FF4FA3 color, tip at (10,0), center at (10,12) */}
        <polygon
          points="10,0  12.4,8  20,8  14.1,13  16.5,21  10,16.5  3.5,21  5.9,13  0,8  7.6,8"
          fill="#FF4FA3" stroke="#D63384" strokeWidth="0.7"/>
        {/* star shimmer */}
        <polygon
          points="10,0  12.4,8  20,8  14.1,13  16.5,21  10,16.5  3.5,21  5.9,13  0,8  7.6,8"
          fill="white" opacity="0.2"/>
      </svg>
    </div>
  );
}
