import { useState } from 'react';
import type { AppMode, DictItem, CodeAttempt } from './types';
import Header       from './components/Header';
import Home         from './components/Home';
import DictView     from './components/Dictionary/DictView';
import Playground   from './components/Playground/Playground';
import LearningPath from './components/LearningPath/LearningPath';
import AIChat       from './components/AIChat/AIChat';
import CodeHistory  from './components/CodeHistory/CodeHistory';
import StarParticles from './components/StarParticles';

export default function App() {
  const [mode, setMode] = useState<AppMode>('home');
  const [pgCode,   setPgCode]   = useState<{html:string;css:string;js:string}|undefined>();
  const [pgSource, setPgSource] = useState<DictItem|undefined>();

  const handleTryPlayground = (item: DictItem) => {
    if (item.cat==='JavaScript') setPgCode({html:'',css:'',js:item.code});
    else if (item.cat==='CSS')   setPgCode({html:'<div class="box">דוגמה</div>',css:item.code,js:''});
    else                         setPgCode({html:item.code,css:'',js:''});
    setPgSource(item); setMode('playground');
    window.scrollTo({top:0,behavior:'smooth'});
  };

  const handleReopenCode = (a:CodeAttempt) => {
    setPgCode({html:a.html,css:a.css,js:a.js});
    setPgSource(undefined); setMode('playground');
    window.scrollTo({top:0,behavior:'smooth'});
  };

  return (
    /* wand-cursor applies CSS cursor globally */
    <div className="wand-cursor" style={{ minHeight:'100vh', direction:'rtl' }}>

      <StarParticles />
      <Header mode={mode} setMode={setMode} />

      {mode === 'home' ? (
        <Home />
      ) : (
        <main style={{
          maxWidth:'1200px', margin:'0 auto',
          padding: mode==='dict' ? '20px 60px 40px 20px' : '20px 20px 40px',
          position:'relative', zIndex:2,
        }}>
          {mode==='dict'       && <DictView onTryPlayground={handleTryPlayground}/>}
          {mode==='playground' && <Playground initialCode={pgCode} sourceItem={pgSource}/>}
          {mode==='learn'      && <LearningPath/>}
          {mode==='ai'         && <AIChat/>}
          {mode==='history'    && <CodeHistory onReopen={handleReopenCode}/>}
        </main>
      )}

      {/* Side tabs */}
      {mode==='dict' && (
        <div style={{position:'fixed',right:0,top:'50%',transform:'translateY(-50%)',zIndex:50}}>
          {(['הכל','HTML','CSS','JavaScript'] as const).map(cat=>{
            const c={הכל:{bg:'#FF4FA3',cl:'white'},HTML:{bg:'#E34F26',cl:'white'},CSS:{bg:'#1572B6',cl:'white'},JavaScript:{bg:'#F7DF1E',cl:'#333'}}[cat];
            return <button key={cat}
              onClick={()=>document.querySelector(`[data-cat="${cat}"]`)?.scrollIntoView({behavior:'smooth',block:'center'})}
              style={{display:'block',marginBottom:'4px',writingMode:'vertical-rl',padding:'12px 8px',
                borderRadius:'10px 0 0 10px',background:c.bg,color:c.cl,fontWeight:700,fontSize:'0.76rem',
                letterSpacing:'1px',boxShadow:'-3px 2px 10px rgba(0,0,0,0.12)',
                border:'none',cursor:'inherit',transition:'transform 0.15s'}}
              onMouseEnter={e=>(e.currentTarget.style.transform='translateX(-4px)')}
              onMouseLeave={e=>(e.currentTarget.style.transform='')}>{cat}</button>;
          })}
        </div>
      )}
    </div>
  );
}
