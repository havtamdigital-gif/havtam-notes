import { useNavigate } from 'react-router-dom';
import type { DictItem, CodeAttempt } from '../types';
import DictView     from './Dictionary/DictView';
import Playground   from './Playground/Playground';
import LearningPath from './LearningPath/LearningPath';
import AIChat       from './AIChat/AIChat';
import CodeHistory  from './CodeHistory/CodeHistory';
import { useState } from 'react';


interface Props { page: string }

export default function PageWrapper({ page }: Props) {
  const nav = useNavigate();
  const [pgCode,   setPgCode]   = useState<{html:string;css:string;js:string}|undefined>();
  const [pgSource, setPgSource] = useState<DictItem|undefined>();

  const goPlayground = (item: DictItem) => {
    if (item.cat==='JavaScript') setPgCode({html:'',css:'',js:item.code});
    else if (item.cat==='CSS')   setPgCode({html:'<div class="box">דוגמה</div>',css:item.code,js:''});
    else                         setPgCode({html:item.code,css:'',js:''});
    setPgSource(item);
    nav('/playground');
    window.scrollTo({top:0,behavior:'smooth'});
  };

  const reopenCode = (a: CodeAttempt) => {
    setPgCode({html:a.html,css:a.css,js:a.js});
    setPgSource(undefined);
    nav('/playground');
    window.scrollTo({top:0,behavior:'smooth'});
  };

  return (
    <>
      <main style={{
        maxWidth:'1200px', margin:'0 auto',
        padding: page==='dict' ? '20px 60px 40px 20px' : '20px 20px 40px',
        position:'relative', zIndex:2,
      }}>
        {page==='dict'       && <DictView onTryPlayground={goPlayground}/>}
        {page==='playground' && <Playground initialCode={pgCode} sourceItem={pgSource}/>}
        {page==='learn'      && <LearningPath/>}
        {page==='ai'         && <AIChat/>}
        {page==='history'    && <CodeHistory onReopen={reopenCode}/>}
      </main>

      {page==='dict' && (
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
    </>
  );
}
