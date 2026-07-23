/**
 * nav.js
 * Panel open/close, home zoom transition, panel history stack.
 */
const Nav = (function () {
  const home = document.getElementById('home');
  let stack  = []; // panel id stack

  function updateHUDVisibility() {
    const xpHud = document.getElementById('xpHud');
    if (!xpHud) return;
    if (stack.length > 0) {
      xpHud.classList.remove('show');
    } else {
      xpHud.classList.add('show');
    }
  }

  function openPanel(id) {
    // Close any currently open panel first
    const current = stack[stack.length - 1];
    if (current) {
      document.getElementById(current)?.classList.remove('open');
    }

    home.classList.add('zoomed');
    stack.push(id);
    updateHUDVisibility();

    setTimeout(() => {
      const panel = document.getElementById(id);
      if (panel) panel.classList.add('open');
    }, 380);
  }

  function closePanel() {
    const id = stack.pop();
    if (id) document.getElementById(id)?.classList.remove('open');

    updateHUDVisibility();

    if (stack.length === 0) {
      home.classList.remove('zoomed');
      document.querySelectorAll('.node-btn').forEach(b => b.classList.remove('active'));
    } else {
      // Re-open the previous panel
      const prev = stack[stack.length - 1];
      document.getElementById(prev)?.classList.add('open');
    }
  }

  function replacePanel(newId) {
    // Replace top of stack without going back home
    const current = stack[stack.length - 1];
    if (current) document.getElementById(current)?.classList.remove('open');
    stack[stack.length - 1] = newId;
    updateHUDVisibility();
    setTimeout(() => {
      document.getElementById(newId)?.classList.add('open');
    }, 120);
  }

  function pushPanel(newId) {
    // Push onto stack — for sub-panels
    const current = stack[stack.length - 1];
    if (current) document.getElementById(current)?.classList.remove('open');
    stack.push(newId);
    updateHUDVisibility();
    setTimeout(() => {
      document.getElementById(newId)?.classList.add('open');
    }, 120);
  }

  function popToId(targetId) {
    // Pop stack until targetId, then open it
    while (stack.length > 0 && stack[stack.length - 1] !== targetId) {
      const id = stack.pop();
      document.getElementById(id)?.classList.remove('open');
    }
    updateHUDVisibility();
    if (stack.length > 0) {
      document.getElementById(targetId)?.classList.add('open');
    } else {
      home.classList.remove('zoomed');
    }
  }

  function goHome() {
    // Close all panels
    stack.forEach(id => document.getElementById(id)?.classList.remove('open'));
    stack = [];
    updateHUDVisibility();
    home.classList.remove('zoomed');
    document.querySelectorAll('.node-btn').forEach(b => b.classList.remove('active'));
  }

  function currentPanel() {
    return stack[stack.length - 1] || null;
  }

  function init() {
    // ESC key to go back
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        if (stack.length > 0) closePanel();
      }
    });
  }

  return { init, openPanel, closePanel, replacePanel, pushPanel, popToId, goHome, currentPanel };
})();
window.Nav = Nav;

