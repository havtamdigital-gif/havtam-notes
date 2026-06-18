/* 3D tilted progress ring — shows lesson completion as a conic disc */

interface Props {
  lessons: number;
  total?: number;
}

export default function ProgressRing3D({ lessons, total = 10 }: Props) {
  const pct = Math.round((lessons / total) * 100);

  return (
    <div
      style={{ perspective: '500px', perspectiveOrigin: '50% 60%' }}
      title={`${lessons} מתוך ${total} שיעורים הושלמו`}
    >
      {/* Outer tilt wrapper — gives the 3D coin look */}
      <div style={{
        width: 82, height: 82,
        borderRadius: '50%',
        transform: 'rotateX(52deg)',
        transformStyle: 'preserve-3d',
        animation: 'ring3d-float 4s ease-in-out infinite',
        filter: 'drop-shadow(0 18px 22px rgba(214,51,132,0.38))',
      }}>
        {/* Ring face — conic gradient fill */}
        <div style={{
          width: '100%', height: '100%',
          borderRadius: '50%',
          background: `conic-gradient(
            #FF4FA3 0% ${pct}%,
            #FFD6EA ${pct}% 100%
          )`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* Hole in the middle */}
          <div style={{
            width: 56, height: 56,
            borderRadius: '50%',
            background: 'white',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: 0,
          }}>
            <span style={{
              fontSize: '1.05rem', fontWeight: 900,
              color: '#FF4FA3', lineHeight: 1,
            }}>{pct}%</span>
            <span style={{
              fontSize: '0.55rem', color: '#D63384',
              fontWeight: 700, letterSpacing: '0.04em',
            }}>השיעורים</span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes ring3d-float {
          0%, 100% { transform: rotateX(52deg) translateY(0px); }
          50%       { transform: rotateX(52deg) translateY(-5px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ring3d-float { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
