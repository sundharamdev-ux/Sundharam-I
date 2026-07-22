/**
 * audio.js
 * Web Audio API based sound effects: hover beep, click, and BGM toggle.
 * No external audio files needed for SFX — synthesized via oscillator.
 */
const Audio = (function () {
  let ctx       = null;
  let bgm       = null;
  let bgmPlaying= false;
  let enabled   = true;

  function getCtx() {
    if (!ctx) {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return ctx;
  }

  function playTone(freq, type, duration, volume) {
    if (!enabled) return;
    try {
      const ac   = getCtx();
      const osc  = ac.createOscillator();
      const gain = ac.createGain();
      osc.connect(gain);
      gain.connect(ac.destination);
      osc.type = type || 'square';
      osc.frequency.setValueAtTime(freq, ac.currentTime);
      gain.gain.setValueAtTime(volume || 0.06, ac.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
      osc.start(ac.currentTime);
      osc.stop(ac.currentTime + duration);
    } catch { /* silently ignore */ }
  }

  function playHover() {
    playTone(880, 'square', 0.05, 0.04);
  }

  function playClick() {
    playTone(660, 'square', 0.08, 0.07);
    setTimeout(() => playTone(440, 'square', 0.06, 0.04), 40);
  }

  function playOpen() {
    // Ascending arpeggio
    [440, 550, 660, 880].forEach((f, i) => {
      setTimeout(() => playTone(f, 'square', 0.1, 0.05), i * 50);
    });
  }

  function playAchievement() {
    [660, 880, 1100].forEach((f, i) => {
      setTimeout(() => playTone(f, 'square', 0.12, 0.06), i * 70);
    });
  }

  function initBGM(src) {
    if (!src) return;
    bgm     = document.getElementById('bgm');
    if (!bgm) return;
    bgm.src = src;
    bgm.loop= true;
  }

  function toggleBGM() {
    if (!bgm) return;
    if (bgmPlaying) {
      bgm.pause();
    } else {
      bgm.play().catch(() => {});
    }
    bgmPlaying = !bgmPlaying;
    return bgmPlaying;
  }

  function init(siteConfig) {
    const audioSrc = siteConfig?.audio?.bgmSrc || '';
    initBGM(audioSrc);

    const toggle = document.getElementById('soundToggle');
    if (toggle) {
      toggle.addEventListener('click', () => {
        const playing = toggleBGM();
        toggle.textContent = playing ? '♫' : '♪';
        toggle.title = playing ? 'Mute music' : 'Play music';
      });
    }
  }

  function setEnabled(val) { enabled = !!val; }

  return { init, playHover, playClick, playOpen, playAchievement, setEnabled };
})();
