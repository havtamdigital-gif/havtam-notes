import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { BookOpen, Target, Code2, Sparkles, FolderHeart, LogIn, UserPlus, WandSparkles } from "lucide-react";

const items = [
  { to: "/my-code",      label: "הקודים שלי", icon: FolderHeart },
  { to: "/ai",           label: "שואלת AI",   icon: Sparkles },
  { to: "/code-writer",  label: "כותבת קוד",  icon: WandSparkles },
  { to: "/playground",   label: "Playground",  icon: Code2 },
  { to: "/roadmap",      label: "מסלול",       icon: Target },
  { to: "/dictionary",   label: "מילון",       icon: BookOpen },
] as const;

export function TopNav() {
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const ref = useRef<SVGSVGElement>(null);
  const [mx, setMx] = useState(0.5);
  const [t, setT]   = useState(0);

  useEffect(() => {
    if (!isHome) return;
    let raf = 0;
    const loop = () => { setT((v) => v + 0.012); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [isHome]);

  useEffect(() => {
    if (!isHome) return;
    const onMove = (e: PointerEvent) => setMx(e.clientX / window.innerWidth);
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [isHome]);

  const w = 1440, h = 120, baseY = 70;
  const amp = 12 + mx * 16;
  const pts: string[] = [`M0,0`, `L${w},0`];
  for (let i = 12; i >= 0; i--) {
    const x = (w / 12) * i;
    const y = baseY + Math.sin(t * 1.2 + i * 0.7 + mx * 3) * amp;
    pts.push(`L${x},${y}`);
  }
  pts.push(`Z`);
  const wavePath = pts.join(" ");

  const pillClass = ({ isActive }: { isActive: boolean }) =>
    isHome
      ? `nav-pill nav-pill-light${isActive ? " nav-pill-active" : ""}`
      : `nav-pill${isActive ? " nav-pill-active" : ""}`;

  return (
    <header dir="rtl" className={isHome ? "sticky top-0 z-40 nav-glass" : "sticky top-0 z-40 nav-gradient"}>
      {isHome && (
        <svg ref={ref} aria-hidden viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none"
          className="absolute left-0 right-0 -bottom-8 w-full h-[120px] pointer-events-none">
          <defs>
            <linearGradient id="navWave" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%"   stopColor="#ffb6d1" stopOpacity="0.6" />
              <stop offset="50%"  stopColor="#ff7eb6" stopOpacity="0.55"/>
              <stop offset="100%" stopColor="#c084fc" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          <path d={wavePath} fill="url(#navWave)" />
        </svg>
      )}
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        <NavLink to="/"
          className={isHome
            ? "flex items-center gap-2 font-display font-extrabold text-base sm:text-lg text-[#b02670] drop-shadow whitespace-nowrap"
            : "flex items-center gap-2 font-display font-extrabold text-base sm:text-lg text-white drop-shadow-sm whitespace-nowrap"}>
          <span>Havtam's Notes</span>
        </NavLink>

        <nav className="flex items-center gap-2 flex-wrap justify-end">
          {items.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={pillClass}>
              <span>{label}</span>
              <Icon className="size-3.5" />
            </NavLink>
          ))}

          <span className={isHome
            ? "mx-1 h-6 w-px bg-[#b02670]/25 hidden sm:block"
            : "mx-1 h-6 w-px bg-white/30 hidden sm:block"} />

          <NavLink to="/auth?mode=login" className={pillClass}>
            <span>כניסה</span>
            <LogIn className="size-3.5" />
          </NavLink>
          <NavLink to="/auth?mode=signup" className={pillClass}>
            <span>הרשמה</span>
            <UserPlus className="size-3.5" />
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
