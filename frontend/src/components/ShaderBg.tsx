import { useEffect, useRef } from 'react';

/* Animated WebGL noise shader — matches the site's pink/cream palette */

const VERT = `
attribute vec2 a_pos;
void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform float u_time;
uniform vec2 u_res;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i),          hash(i + vec2(1,0)), f.x),
    mix(hash(i+vec2(0,1)), hash(i + vec2(1,1)), f.x),
    f.y
  );
}

float fbm(vec2 p, float t) {
  float v = 0.0;
  v += noise(p * 2.0 + vec2(t * 0.10,  t * 0.07)) * 0.50;
  v += noise(p * 4.0 + vec2(-t * 0.06, t * 0.14)) * 0.30;
  v += noise(p * 8.0 + vec2(t * 0.18, -t * 0.09)) * 0.20;
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float n = fbm(uv, u_time);

  /* #fff5fa → #ffedf5 → #ffd6ea — all within the existing site palette */
  vec3 base  = vec3(1.000, 0.961, 0.980); /* #fff5fa */
  vec3 mid   = vec3(1.000, 0.880, 0.930); /* #ffe0ee */
  vec3 deep  = vec3(0.990, 0.800, 0.880); /* #fccce0 */

  vec3 col = mix(base, mid, n);
  col = mix(col, deep, n * n * 0.45);

  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
}

export default function ShaderBg() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer()!;
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    const posLoc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes  = gl.getUniformLocation(prog, 'u_res');

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener('resize', resize);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf: number;
    const draw = (ms: number) => {
      gl.uniform1f(uTime, ms * 0.001);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      if (!reduced) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        zIndex: 0, display: 'block',
        pointerEvents: 'none',
      }}
    />
  );
}
