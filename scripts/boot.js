/**
 * boot.js
 * Handles the cyberpunk retro game boot screen sequence.
 * Animates the custom block loading bar, cycles terminal status logs,
 * and reveals the interactive "PRESS START" prompt.
 */
const Boot = (function () {
  function init(siteConfig, onComplete) {
    const elPct = document.getElementById('bootPct');
    const elMsg = document.getElementById('bootMsg');
    const elPress = document.getElementById('bootPress');
    const elScreen = document.getElementById('bootScreen');
    const elBarBlocks = document.getElementById('bootBarBlocks');
    const elLogs = document.getElementById('bootTerminalLogs');

    if (!elScreen) return;

    // Loading sequence messages
    const sequence = [
      { pct: 0, msg: "Initializing DevVerse..." },
      { pct: 15, msg: "Loading Unreal Engine 5 modules..." },
      { pct: 30, msg: "Loading Unity systems..." },
      { pct: 50, msg: "Compiling C++ gameplay code..." },
      { pct: 68, msg: "Initializing Blueprint systems..." },
      { pct: 82, msg: "Generating mechanics..." },
      { pct: 92, msg: "Building experience..." },
      { pct: 100, msg: "READY" }
    ];

    // Terminal status logs to print at specific points
    const terminalLogs = [
      { triggerPct: 25, text: "[OK] Unreal Engine 5 initialized" },
      { triggerPct: 45, text: "[OK] Unity engine initialized" },
      { triggerPct: 65, text: "[OK] C++ systems loaded" },
      { triggerPct: 85, text: "[OK] Blueprint modules loaded" },
      { triggerPct: 100, text: "[OK] Gameplay mechanics ready" }
    ];

    let pct = 0;
    const maxBlocks = 18; // [██████████████████]
    const logsPrinted = new Set();

    const barInterval = setInterval(() => {
      // Increment progress
      pct += Math.floor(Math.random() * 8) + 3;
      if (pct >= 100) {
        pct = 100;
        clearInterval(barInterval);
        if (elPress) elPress.classList.add('show');
      }

      // 1. Update Percentage
      if (elPct) elPct.textContent = pct + '%';

      // 2. Update Loading Bar Blocks
      if (elBarBlocks) {
        const numBlocks = Math.floor((pct / 100) * maxBlocks);
        elBarBlocks.textContent = "█".repeat(numBlocks);
      }

      // 3. Update Sequence Messages
      const currentStep = [...sequence].reverse().find(step => pct >= step.pct);
      if (currentStep && elMsg && elMsg.textContent !== currentStep.msg) {
        elMsg.textContent = currentStep.msg;
      }

      // 4. Print Terminal Logs
      terminalLogs.forEach(log => {
        if (pct >= log.triggerPct && !logsPrinted.has(log.text)) {
          logsPrinted.add(log.text);
          const logItem = document.createElement('div');
          logItem.className = 'log-item';
          logItem.textContent = log.text;
          if (elLogs) {
            elLogs.appendChild(logItem);
            elLogs.scrollTop = elLogs.scrollHeight;
          }
        }
      });
    }, 120);

    // Enter logic
    function enter() {
      if (pct < 100) return;
      elScreen.classList.add('hide');
      document.removeEventListener('keydown', onKey);
      if (typeof onComplete === 'function') {
        setTimeout(onComplete, 700);
      }
    }

    function onKey(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        enter();
      }
    }

    if (elPress) elPress.addEventListener('click', enter);
    document.addEventListener('keydown', onKey);
  }

  return { init };
})();
