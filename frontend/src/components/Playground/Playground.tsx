import { useState, useRef, useCallback } from 'react';
import type { DictItem } from '../../types';
import { useProgress } from '../../hooks/useProgress';

interface Props { initialCode?:{html:string;css:string;js:string}; sourceItem?:DictItem }
interface ErrorInfo { where:string; why:string; fix:string; corrected:{html:string;css:string;js:string} }

/* ── Cheat sheets ── */
const HINTS = {
  html: [
    {tag:'<h1>–<h6>',       desc:'כותרות לפי גודל'},
    {tag:'<p>',              desc:'פסקת טקסט'},
    {tag:'<div>',            desc:'קופסה/מיכל כללי'},
    {tag:'<span>',           desc:'טקסט inline'},
    {tag:'<a href="">',      desc:'קישור'},
    {tag:'<img src="" alt="">',desc:'תמונה'},
    {tag:'<ul><li>',         desc:'רשימת נקודות'},
    {tag:'<ol><li>',         desc:'רשימה ממוספרת'},
    {tag:'<button>',         desc:'כפתור'},
    {tag:'<input type="text">',desc:'שדה טקסט'},
    {tag:'<input type="number">',desc:'שדה מספר'},
    {tag:'<label for="">',   desc:'תווית לשדה'},
    {tag:'<form>',           desc:'טופס'},
    {tag:'<section>',        desc:'קטע סמנטי'},
    {tag:'<header>',         desc:'כותרת עמוד'},
    {tag:'<main>',           desc:'תוכן ראשי'},
    {tag:'<footer>',         desc:'תחתית עמוד'},
    {tag:'<br>',             desc:'שבירת שורה'},
  ],
  css: [
    {tag:'color: ;',            desc:'צבע טקסט'},
    {tag:'background-color: ;', desc:'צבע רקע'},
    {tag:'font-size: px;',      desc:'גודל גופן'},
    {tag:'font-weight: bold;',  desc:'מודגש'},
    {tag:'text-align: center;', desc:'יישור טקסט'},
    {tag:'padding: px;',        desc:'מרווח פנימי'},
    {tag:'margin: px;',         desc:'מרווח חיצוני'},
    {tag:'margin: 0 auto;',     desc:'מרכוז אופקי'},
    {tag:'border: px solid ;',  desc:'מסגרת'},
    {tag:'border-radius: px;',  desc:'פינות מעוגלות'},
    {tag:'width: px;',          desc:'רוחב'},
    {tag:'height: px;',         desc:'גובה'},
    {tag:'display: flex;',      desc:'פלקסבוקס'},
    {tag:'justify-content: center;',desc:'יישור אופקי (flex)'},
    {tag:'align-items: center;',desc:'יישור אנכי (flex)'},
    {tag:'gap: px;',            desc:'מרווח בין ילדים'},
    {tag:'flex-direction: column;',desc:'עמודה (flex)'},
    {tag:'box-shadow: 0 2px 8px rgba(0,0,0,0.1);',desc:'צל'},
    {tag:'transition: all 0.3s;',desc:'אנימציה חלקה'},
    {tag:'cursor: pointer;',    desc:'יד בריחוף'},
  ],
  js: [
    {tag:'let name = "";',                      desc:'משתנה ניתן לשינוי'},
    {tag:'const PI = 3.14;',                    desc:'קבוע'},
    {tag:'function name() { }',                 desc:'הגדרת פונקציה'},
    {tag:'function name(p) { return p; }',      desc:'פונקציה עם פרמטר'},
    {tag:'alert("טקסט");',                       desc:'הודעה קופצת'},
    {tag:'console.log("טקסט");',                desc:'הדפסה לconsole'},
    {tag:'document.getElementById("id")',        desc:'מציאת אלמנט לפי id'},
    {tag:'document.querySelector(".class")',     desc:'מציאת אלמנט לפי selector'},
    {tag:'element.innerHTML = "";',             desc:'שינוי תוכן HTML'},
    {tag:'element.textContent = "";',           desc:'שינוי טקסט בלבד'},
    {tag:'element.style.color = "";',           desc:'שינוי CSS ב-JS'},
    {tag:'input.value',                          desc:'קריאת ערך מ-input (string)'},
    {tag:'Number(input.value)',                  desc:'המרה למספר'},
    {tag:'if (x > 0) { } else { }',            desc:'תנאי'},
    {tag:'element.addEventListener("click", fn)', desc:'מאזין לאירוע'},
    {tag:'`שלום ${name}`',                       desc:'template string'},
  ],
};

function detectErrors(html:string,css:string,js:string):ErrorInfo|null {
  if (js.trim()) {
    try { new Function(js); } catch(e:unknown) {
      const msg = (e as Error).message;
      let fix = js;
      if (msg.includes('Unexpected end') && (js.match(/\(/g)||[]).length>(js.match(/\)/g)||[]).length) {
        fix = js+')'.repeat((js.match(/\(/g)||[]).length-(js.match(/\)/g)||[]).length);
      }
      return { where:`שגיאת JavaScript: ${msg}`, why:'טעות תחבירית בקוד JavaScript.',
        fix:'בדקי סוגריים, גרשיים, נקודה-פסיק.', corrected:{html,css,js:fix} };
    }
  }
  const cssBad = css.match(/([a-z-]+)\s+([a-z#%0-9"'][^;{}\n]*?);/);
  if (cssBad) return { where:`שגיאת CSS: חסרה נקודה-נקודה ליד "${cssBad[0].trim()}"`,
    why:'חסרה : בין שם המאפיין לערך.', fix:'כתבי: color: red; (עם :)',
    corrected:{html,css:css.replace(/([a-z-]+)\s+([a-z#%0-9"'][^;{}\n]*?);/g,'$1: $2;'),js} };
  const tags: string[] = html.match(/<([a-z][a-z0-9]*)[^>]*>/gi) ?? [];
  const selfClose: string[] = ['img','input','br','hr','meta','link'];
  const opened=tags.filter((t: string)=>!selfClose.includes((t.match(/<([a-z]+)/i)?.[1]??'').toLowerCase()));
  const closed=html.match(/<\/([a-z]+)>/gi)||[];
  if (opened.length>closed.length) {
    const last=opened[opened.length-1].match(/<([a-z]+)/i)?.[1]??'div';
    return { where:`חסרה תגית סגירה: </${last}>`, why:'כל תגית HTML חייבת להיסגר.',
      fix:`הוסיפי </${last}> בסוף.`, corrected:{html:html+`</${last}>`,css,js} };
  }
  return null;
}

/* ── Hint panel for one language ── */
function HintPanel({lang,onInsert}:{lang:'html'|'css'|'js';onInsert:(t:string)=>void}) {
  const [q,setQ]=useState('');
  const items=HINTS[lang];
  const filtered=items.filter(i=>!q||i.tag.toLowerCase().includes(q)||i.desc.includes(q));
  const colors={html:'#E34F26',css:'#1572B6',js:'#b8a800'};
  return (
    <div className="rounded-xl mt-2 overflow-hidden" style={{border:`2px solid ${colors[lang]}22`,background:'#fdf8fb'}}>
      <div className="px-3 pt-2 pb-1">
        <input value={q} onChange={e=>setQ(e.target.value)}
          placeholder="🔍 חיפוש..."
          className="w-full text-xs px-2 py-1 rounded-lg border outline-none"
          style={{borderColor:'#F3B6D3',background:'white',direction:'rtl'}}/>
      </div>
      <div className="overflow-y-auto" style={{maxHeight:'180px'}}>
        {filtered.map((item,i)=>(
          <button key={i} onClick={()=>onInsert(item.tag)}
            className="w-full text-right flex items-center gap-2 px-3 py-1.5 text-xs hover:opacity-80 transition-all border-b"
            style={{borderColor:'#f3e8f5',background:i%2===0?'white':'#fff5fb'}}>
            <code className="font-mono shrink-0" style={{color:colors[lang],direction:'ltr',textAlign:'left',fontSize:'0.7rem'}}>{item.tag}</code>
            <span className="text-gray-500 mr-auto">{item.desc}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Playground({initialCode,sourceItem}:Props) {
  const [html,setHtml]=useState(initialCode?.html||'');
  const [css,setCss]  =useState(initialCode?.css||'');
  const [js,setJs]    =useState(initialCode?.js||'');
  const [ran,setRan]=useState(false);
  const [error,setError]=useState<ErrorInfo|null>(null);
  const [saved,setSaved]=useState(false);
  const [aiLoading,setAiLoading]=useState(false);
  const [aiFeedback,setAiFeedback]=useState('');
  const [hints,setHints]=useState<{html:boolean;css:boolean;js:boolean}>({html:false,css:false,js:false});
  const frameRef=useRef<HTMLIFrameElement>(null);
  const {addCodeAttempt,progress}=useProgress();

  const insertSnippet=(lang:'html'|'css'|'js',text:string)=>{
    if (lang==='html') setHtml(h=>h+(h&&!h.endsWith('\n')?'\n':'')+text);
    if (lang==='css')  setCss (c=>c+(c&&!c.endsWith('\n')?'\n':'')+text);
    if (lang==='js')   setJs  (j=>j+(j&&!j.endsWith('\n')?'\n':'')+text);
  };

  const run=useCallback(()=>{
    const err=detectErrors(html,css,js);
    if(err){setError(err);setRan(false);
      addCodeAttempt({id:Date.now().toString(),createdAt:new Date().toISOString(),html,css,js,
        status:'error',errorMessage:err.where,relatedTopics:sourceItem?[sourceItem.cat]:[]});return;}
    setError(null);
    const doc=`<!DOCTYPE html><html dir="rtl"><head><meta charset="UTF-8"/>
      <style>body{font-family:Segoe UI,Arial,sans-serif;direction:rtl;padding:12px}${css}</style>
    </head><body>${html}<script>${js}<\/script></body></html>`;
    if(frameRef.current)frameRef.current.srcdoc=doc;
    setRan(true);
    addCodeAttempt({id:Date.now().toString(),createdAt:new Date().toISOString(),html,css,js,
      status:'success',relatedTopics:sourceItem?[sourceItem.cat]:[]});
  },[html,css,js,sourceItem,addCodeAttempt]);

  const reset=()=>{setHtml(initialCode?.html||'');setCss(initialCode?.css||'');setJs(initialCode?.js||'');setError(null);setRan(false);setAiFeedback('');};
  const clear=()=>{setHtml('');setCss('');setJs('');setError(null);setRan(false);setAiFeedback('');};
  const save=()=>{addCodeAttempt({id:Date.now().toString(),createdAt:new Date().toISOString(),html,css,js,status:'needs_review',relatedTopics:sourceItem?[sourceItem.cat]:[],isFavorite:true});setSaved(true);setTimeout(()=>setSaved(false),2000);};
  const loadLast=()=>{const l=progress.codeAttempts[0];if(l){setHtml(l.html);setCss(l.css);setJs(l.js);}};
  const applyFix=(f:{html:string;css:string;js:string})=>{setHtml(f.html);setCss(f.css);setJs(f.js);setError(null);};

  const askAI=async()=>{
    setAiLoading(true);
    try{
      const r=await fetch('http://localhost:3001/api/ai/review',{method:'POST',
        headers:{'Content-Type':'application/json'},body:JSON.stringify({html,css,js})});
      const d=await r.json();setAiFeedback(d.feedback||'לא קיבלתי תשובה.');
    }catch{
      // Offline fallback — basic local review
      const issues=[];
      if(!html.trim()&&!css.trim()&&!js.trim())issues.push('❌ כל הקופסאות ריקות — כתבי קוד כלשהו!');
      else{
        if(html.includes('<h1>')&&!html.includes('</h1>'))issues.push('⚠️ נראה שחסר </h1>');
        if(css.includes('{')&&!css.includes('}'))issues.push('⚠️ CSS — חסר } סוגר');
        if(html.trim())issues.push('✅ HTML נכתב');
        if(css.trim())issues.push('✅ CSS נכתב');
        if(js.trim())issues.push('✅ JavaScript נכתב');
        issues.push('💡 טיפ: לחצי ▶ הרץ קוד כדי לראות את התוצאה!');
      }
      setAiFeedback(issues.join('\n')+'\\n\\n(לביקורת מעמיקה — הפעילי את ה-backend)');
    }
    setAiLoading(false);
  };

  const edBase={width:'100%',height:'150px',fontFamily:'monospace',fontSize:'0.82rem',
    borderRadius:'8px',padding:'10px',resize:'vertical' as const,outline:'none',
    direction:'ltr' as const,background:'#fdf8fb'};

  const btns=[
    {label:'▶ הרץ קוד',   onClick:run,    primary:true},
    {label:'🔄 Reset',     onClick:reset},
    {label:'🗑 Clear',     onClick:clear},
    {label:saved?'✓ נשמר!':'💾 Save', onClick:save},
    {label:'📂 Load Last', onClick:loadLast},
    {label:aiLoading?'⏳...':'🤖 AI Review', onClick:askAI},
  ];

  return(
    <div style={{background:'white',borderRadius:'16px',padding:'22px',boxShadow:'0 2px 12px rgba(233,30,140,0.10)'}}>
      <h2 className="text-lg font-bold mb-3" style={{color:'#FF4FA3'}}>🧪 Code Playground</h2>
      {sourceItem&&<div className="mb-3 text-sm px-3 py-1.5 rounded-lg" style={{background:'#FFE0F0',color:'#D63384'}}>קוד מ: <b>{sourceItem.term}</b></div>}

      {/* ── BUTTONS ROW (above editors) ── */}
      <div className="flex gap-2 flex-wrap mb-3 pb-3" style={{borderBottom:'2px solid #FFE0F0'}}>
        {btns.map(b=>(
          <button key={b.label} onClick={b.onClick} disabled={aiLoading&&b.label.includes('AI')}
            className="px-3 py-1.5 rounded-full text-sm font-bold transition-opacity hover:opacity-85"
            style={{background:b.primary?'linear-gradient(135deg,#FF4FA3,#9c27b0)':'#FFE0F0',
              color:b.primary?'white':'#D63384'}}>
            {b.label}
          </button>
        ))}
      </div>

      {/* ── EDITORS ── */}
      <div className="grid gap-4" style={{gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))'}}>
        {/* HTML */}
        <div>
          <label className="text-xs font-bold mb-1 block" style={{color:'#E34F26'}}>HTML</label>
          <textarea style={{...edBase,border:'2px solid #E34F26'}} value={html} onChange={e=>setHtml(e.target.value)} placeholder={'<h1>שלום!</h1>'}/>
          <button onClick={()=>setHints(h=>({...h,html:!h.html}))}
            className="mt-1 text-xs px-3 py-1 rounded-full font-bold w-full"
            style={{background:'#fde8e2',color:'#E34F26'}}>
            {hints.html?'▲ סגור רמז':'💡 רמז — HTML elements'}
          </button>
          {hints.html&&<HintPanel lang="html" onInsert={t=>insertSnippet('html',t)}/>}
        </div>

        {/* CSS */}
        <div>
          <label className="text-xs font-bold mb-1 block" style={{color:'#1572B6'}}>CSS</label>
          <textarea style={{...edBase,border:'2px solid #1572B6'}} value={css} onChange={e=>setCss(e.target.value)} placeholder={'h1 { color: hotpink; }'}/>
          <button onClick={()=>setHints(h=>({...h,css:!h.css}))}
            className="mt-1 text-xs px-3 py-1 rounded-full font-bold w-full"
            style={{background:'#dbeafe',color:'#1572B6'}}>
            {hints.css?'▲ סגור רמז':'💡 רמז — CSS properties'}
          </button>
          {hints.css&&<HintPanel lang="css" onInsert={t=>insertSnippet('css',t)}/>}
        </div>

        {/* JavaScript */}
        <div>
          <label className="text-xs font-bold mb-1 block" style={{color:'#b8a800'}}>JavaScript</label>
          <textarea style={{...edBase,border:'2px solid #d4ab00'}} value={js} onChange={e=>setJs(e.target.value)} placeholder={"function hello() {\n  alert('שלום!');\n}"}/>
          <button onClick={()=>setHints(h=>({...h,js:!h.js}))}
            className="mt-1 text-xs px-3 py-1 rounded-full font-bold w-full"
            style={{background:'#fefce8',color:'#b8a800'}}>
            {hints.js?'▲ סגור רמז':'💡 רמז — JavaScript'}
          </button>
          {hints.js&&<HintPanel lang="js" onInsert={t=>insertSnippet('js',t)}/>}
        </div>
      </div>

      {/* ── ERROR ── */}
      {error&&(
        <div className="mt-4 rounded-xl p-4" style={{background:'#fff0f0',border:'2px solid #e53935'}}>
          <div className="font-bold text-lg mb-2" style={{color:'#b71c1c'}}>⚠️ יש טעות בקוד</div>
          <div className="mb-1"><b>📍 איפה:</b> <span style={{color:'#b71c1c'}}>{error.where}</span></div>
          <div className="mb-1"><b>❓ למה:</b> {error.why}</div>
          <div className="mb-3"><b>🔧 תיקון:</b> {error.fix}</div>
          <button onClick={()=>applyFix(error.corrected)}
            className="px-4 py-2 rounded-full text-sm font-bold text-white" style={{background:'#4caf50'}}>
            ✅ הכנסי קוד מתוקן ל-Playground
          </button>
        </div>
      )}

      {/* ── AI Feedback ── */}
      {aiFeedback&&(
        <div className="mt-4 rounded-xl p-4" style={{background:'#FFF0F7',border:'2px solid #FF4FA3'}}>
          <div className="font-bold mb-2" style={{color:'#FF4FA3'}}>🤖 AI Review:</div>
          <div className="text-sm whitespace-pre-wrap">{aiFeedback}</div>
        </div>
      )}

      {/* ── OUTPUT ── */}
      {ran&&(
        <div className="mt-4">
          <div className="text-sm font-bold mb-2 text-gray-500">📺 תוצאה:</div>
          <div className="rounded-xl overflow-hidden" style={{border:'2px solid #F3B6D3'}}>
            <iframe ref={frameRef} sandbox="allow-scripts"
              style={{width:'100%',height:'240px',border:'none',background:'white'}}/>
          </div>
        </div>
      )}
    </div>
  );
}
