import { useEffect, useRef } from 'react';

interface Spark { x:number;y:number;size:number;life:number;vx:number;vy:number;hue:number }
interface Snow  { x:number;y:number;size:number;vy:number;vx:number;spin:number }

export default function StarParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparks = useRef<Spark[]>([]);
  const snow   = useRef<Snow[]>([]);
  const mouse  = useRef({ x:-9999, y:-9999 });
  const rafRef = useRef(0);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (reducedMotion) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const spawnSnow = () => {
      if (snow.current.length < 100) {
        snow.current.push({
          x: Math.random() * window.innerWidth,
          y: -12,
          size: Math.random() * 4.5 + 1.5,
          vy: Math.random() * 1.0 + 0.35,
          vx: (Math.random() - 0.5) * 0.5,
          spin: Math.random() * Math.PI * 2,
        });
      }
    };

    const onMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      for (let i = 0; i < 4; i++) {
        sparks.current.push({
          x: e.clientX + (Math.random()-0.5)*12,
          y: e.clientY + (Math.random()-0.5)*12,
          size: Math.random()*3+1, life:1,
          vx:(Math.random()-0.5)*1.8, vy:(Math.random()-0.85)*2.2,
          hue: 300+Math.random()*60,
        });
        if (sparks.current.length > 180) sparks.current.shift();
      }
    };
    window.addEventListener('mousemove', onMove);

    let frame = 0;
    const draw = () => {
      ctx.clearRect(0,0,canvas.width,canvas.height);
      frame++;
      if (frame % 5 === 0) spawnSnow();

      /* cursor sparks */
      sparks.current = sparks.current.filter(p=>p.life>0);
      sparks.current.forEach(p=>{
        p.x+=p.vx; p.y+=p.vy; p.life-=0.038;
        ctx.save(); ctx.globalAlpha=Math.max(0,p.life);
        ctx.fillStyle=`hsl(${p.hue},100%,70%)`;
        ctx.shadowColor='#ff4fa3'; ctx.shadowBlur=8;
        drawStar(ctx,p.x,p.y,p.size); ctx.restore();
      });

      /* ambient snow with repulsion */
      const mx=mouse.current.x, my=mouse.current.y;
      snow.current=snow.current.filter(s=>s.y<window.innerHeight+20);
      snow.current.forEach(s=>{
        const dx=s.x-mx, dy=s.y-my;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<90&&dist>0){
          const f=(90-dist)/90;
          s.vx+=(dx/dist)*f*2.8; s.vy+=(dy/dist)*f*1.2;
        }
        s.vx*=0.97; s.vy=Math.max(s.vy*0.98+0.025, 0.2);
        s.x+=s.vx; s.y+=s.vy; s.spin+=0.04;
        ctx.save(); ctx.globalAlpha=0.65;
        ctx.fillStyle=`hsl(${310+Math.sin(s.spin)*25},100%,${76+Math.sin(s.spin)*8}%)`;
        ctx.shadowColor='#ff4fa3'; ctx.shadowBlur=5;
        drawStar(ctx,s.x,s.y,s.size); ctx.restore();
      });

      rafRef.current=requestAnimationFrame(draw);
    };
    rafRef.current=requestAnimationFrame(draw);

    return ()=>{
      window.removeEventListener('resize',resize);
      window.removeEventListener('mousemove',onMove);
      cancelAnimationFrame(rafRef.current);
    };
  },[reducedMotion]);

  if (reducedMotion) return null;
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position:'fixed', top:0, left:0,
        width:'100%', height:'100%',
        pointerEvents:'none',
        zIndex:1,          /* BEHIND content (z-index:2+), BELOW header (z-index:200) */
      }}
    />
  );
}

function drawStar(ctx:CanvasRenderingContext2D,x:number,y:number,r:number){
  ctx.beginPath();
  for(let i=0;i<5;i++){
    const a1=(i*4*Math.PI/5)-Math.PI/2;
    const a2=((i*4+2)*Math.PI/5)-Math.PI/2;
    if(i===0) ctx.moveTo(x+r*Math.cos(a1),y+r*Math.sin(a1));
    else       ctx.lineTo(x+r*Math.cos(a1),y+r*Math.sin(a1));
    ctx.lineTo(x+r*0.4*Math.cos(a2),y+r*0.4*Math.sin(a2));
  }
  ctx.closePath(); ctx.fill();
}
