/**
 * background.js
 * Animated particle canvas, floating pixel squares, glitch bars.
 * Reads particle count from site.json effects config.
 */
const Background = (function () {
  const canvas = document.getElementById('bgCanvas');
  const ctx    = canvas.getContext('2d');

  let W, H, particles = [], animId;
  let mouseX = -9999, mouseY = -9999;
  let PCOUNT = 100;

  // ── Floating retro game shapes ──────────────
  const SHAPES_COUNT = 10;
  const shapes = [];

  function createRetroGameShapes() {
    const container = document.querySelector('.app');
    shapes.forEach(s => s.remove());
    shapes.length = 0;

    const sizes = [18, 22, 28, 36, 16, 24, 20, 32, 14, 30];
    const positions = [
      { top: '12%', left: '8%' },   { top: '68%', left: '6%' },
      { top: '18%', right: '9%' },  { top: '75%', right: '12%' },
      { top: '45%', left: '3%' },   { top: '35%', right: '5%' },
      { top: '85%', left: '42%' },  { top: '8%',  left: '52%' },
      { top: '58%', left: '28%' },  { top: '30%', right: '28%' }
    ];
    const durations = [18, 24, 20, 26, 16, 22, 28, 19, 21, 25];
    const delays    = [0, 2, 5, 1, 7, 3, 9, 4, 6, 8];

    for (let i = 0; i < SHAPES_COUNT; i++) {
      const el = document.createElement('div');
      
      // Alternate shape styles (0: Square, 1: Circle, 2: Triangle, 3: Cross/Plus)
      const shapeType = i % 4;
      if (shapeType === 0) {
        el.className = 'retro-shape shape-square';
      } else if (shapeType === 1) {
        el.className = 'retro-shape shape-circle';
      } else if (shapeType === 2) {
        el.className = 'retro-shape shape-triangle';
      } else {
        el.className = 'retro-shape shape-cross';
        el.textContent = '+';
      }

      const s = sizes[i % sizes.length];
      el.style.cssText = `
        width:${s}px; height:${s}px;
        animation-duration:${durations[i]}s;
        animation-delay:-${delays[i]}s;
        ${Object.entries(positions[i]).map(([k,v])=>`${k}:${v}`).join(';')};
      `;

      // Alternate border/text colors
      const color = i % 3 === 0
        ? '#39ff6a'  // green
        : i % 3 === 1
          ? '#ff2bd6'  // magenta
          : '#00d4ff'; // cyan
      el.style.borderColor = color;
      el.style.color = color;
      
      container.appendChild(el);
      shapes.push(el);
    }
  }

  // ── Particle system ─────────────────────────
  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initParticles(count) {
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x:    Math.random() * W,
        y:    Math.random() * H,
        r:    Math.random() * 1.8 + 0.4,
        vx:   (Math.random() - 0.5) * 0.22,
        vy:   (Math.random() - 0.5) * 0.22,
        hue:  Math.random() > 0.5
                ? [57, 255, 106]    // neon green
                : Math.random() > 0.5
                  ? [255, 43, 214]  // magenta
                  : [0, 212, 255],  // cyan
        a:    Math.random() * 0.55 + 0.15,
      });
    }
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      // Mouse repulsion
      const dx = p.x - mouseX, dy = p.y - mouseY;
      const dist = Math.hypot(dx, dy);
      if (dist < 110 && dist > 0) {
        p.x += (dx / dist) * 0.55;
        p.y += (dy / dist) * 0.55;
      }

      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      const [r, g, b] = p.hue;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle   = `rgba(${r},${g},${b},${p.a})`;
      ctx.shadowColor = `rgba(${r},${g},${b},0.9)`;
      ctx.shadowBlur  = 7;
      ctx.fill();
      ctx.shadowBlur  = 0;
    }

    // Connecting lines
    const N = particles.length;
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const a = particles[i], b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < 90) {
          ctx.strokeStyle = `rgba(57,255,106,${0.07 * (1 - d / 90)})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(tick);
  }

  // ── Occasional glitch bar ───────────────────
  let glitchTimer;
  function scheduleGlitch() {
    const delay = 4000 + Math.random() * 8000;
    glitchTimer = setTimeout(() => {
      const bar = document.querySelector('.glitch-bar');
      if (bar) {
        bar.style.top = (15 + Math.random() * 70) + '%';
        bar.classList.add('active');
        setTimeout(() => bar.classList.remove('active'), 500);
      }
      scheduleGlitch();
    }, delay);
  }

  // ── Public API ──────────────────────────────
  function init(config) {
    const effects = config?.effects || {};
    PCOUNT = window.innerWidth < 700
      ? Math.floor((effects.particleCount || 100) * 0.5)
      : (effects.particleCount || 100);

    resize();
    initParticles(PCOUNT);
    createRetroGameShapes();
    tick();
    scheduleGlitch();

    window.addEventListener('resize', () => {
      resize();
      initParticles(PCOUNT);
    });
    window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
    window.addEventListener('touchmove', e => {
      if (e.touches[0]) { mouseX = e.touches[0].clientX; mouseY = e.touches[0].clientY; }
    }, { passive: true });
  }

  function destroy() {
    cancelAnimationFrame(animId);
    clearTimeout(glitchTimer);
  }

  return { init, destroy };
})();
window.Background = Background;

