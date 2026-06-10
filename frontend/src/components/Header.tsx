import { useEffect, useState } from 'react';
import type { AppMode } from '../types';

interface Props { mode:AppMode; setMode:(m:AppMode)=>void }

const NAV = [
  { id:'dict',       label:'📖 מילון' },
  { id:'learn',      label:'🎯 מסלול' },
  { id:'playground', label:'🧪 Playground' },
  { id:'ai',         label:'🤖 AI' },
  { id:'history',    label:'📂 הקודים' },
] as const;

export default function Header({ mode, setMode }:Props) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(()=>{
    const fn = ()=>setScrolled(window.scrollY>10);
    window.addEventListener('scroll',fn);
    return ()=>window.removeEventListener('scroll',fn);
  },[]);

  if (mode === 'home') return null;

  return (
    <header className="nav-gradient"
      style={{
        position:'sticky', top:0, zIndex:200,
        padding: scrolled?'8px 20px':'12px 20px',
        transition:'padding 0.2s',
      }}>
      <div style={{ maxWidth:'1200px', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'space-between', gap:'12px', flexWrap:'wrap' }}>

        {/* Logo */}
        <button onClick={()=>setMode('home')}
          style={{ background:'none', border:'none', cursor:'inherit',
            fontFamily:'var(--font-display)', fontWeight:900, fontSize:'1.1rem',
            color:'white', letterSpacing:'-0.5px' }}>
          📓 Havtam's Notes
        </button>

        {/* Nav pills */}
        <nav style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
          {NAV.map(n=>(
            <button key={n.id} onClick={()=>setMode(n.id as AppMode)}
              className={`nav-pill ${mode===n.id?'nav-pill-active':''}`}>
              {n.label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
