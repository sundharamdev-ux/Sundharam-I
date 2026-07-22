/**
 * effects.js
 * Cursor glow, ripple, chromatic aberration, Konami code easter egg.
 */
const Effects = (function () {
  // ── Cursor Glow ─────────────────────────────
  function initCursorGlow() {
    const glow  = document.getElementById('cursorGlow');
    if (!glow) return;

    let cx = 0, cy = 0;
    let tx = 0, ty = 0;
    let rafId;

    function lerp(a, b, t) { return a + (b - a) * t; }

    function moveCursor() {
      cx = lerp(cx, tx, 0.18);
      cy = lerp(cy, ty, 0.18);
      glow.style.left = cx + 'px';
      glow.style.top  = cy + 'px';
      rafId = requestAnimationFrame(moveCursor);
    }
    moveCursor();

    window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });

    const hoverSels = '.node-btn,.hub-core,.card,.btn-mini,.back-btn,.download-btn,.submit-btn,.engine-card,.action-btn,.social-link,.proj-nav-btn';
    document.addEventListener('mouseover', e => {
      if (e.target.closest(hoverSels)) glow.classList.add('big');
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest(hoverSels)) glow.classList.remove('big');
    });
  }

  // ── Ripple on click ──────────────────────────
  function initRipple() {
    document.addEventListener('click', e => {
      const r    = document.createElement('div');
      r.className= 'ripple';
      const size = 70;
      r.style.cssText = `width:${size}px;height:${size}px;left:${e.clientX}px;top:${e.clientY}px`;
      document.body.appendChild(r);
      Audio.playClick();
      setTimeout(() => r.remove(), 650);
    });
  }

  // ── Konami Code Easter Egg ───────────────────
  function initKonami() {
    const CODE = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let pos = 0;
    document.addEventListener('keydown', e => {
      pos = (e.key === CODE[pos]) ? pos + 1 : 0;
      if (pos === CODE.length) {
        pos = 0;
        XP.showAchievement('↑↑↓↓←→←→BA — SECRET UNLOCKED!');
        Audio.playAchievement();
        // Rainbow hue rotate flash
        document.body.animate(
          [{ filter: 'hue-rotate(0deg)' }, { filter: 'hue-rotate(360deg)' }],
          { duration: 1400, easing: 'ease-in-out' }
        );
      }
    });
  }

  // ── Panel open sound hook ────────────────────
  function hookPanelSounds() {
    // Intercept Nav.openPanel to play sound
    const _orig = Nav.openPanel.bind(Nav);
    Nav.openPanel = function (id) {
      Audio.playOpen();
      _orig(id);
    };
  }

  function init(siteConfig) {
    const effects = siteConfig?.effects || {};
    if (effects.enableCursorGlow !== false) initCursorGlow();
    initRipple();
    if (effects.enableKonamiCode !== false) initKonami();
    hookPanelSounds();
  }

  return { init };
})();
