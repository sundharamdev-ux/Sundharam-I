/**
 * xp.js
 * Gamification: XP bar, level counter, achievement toasts.
 * Tracks which modules have been explored.
 */
const XP = (function () {
  const explored = new Set(['panel-about', 'panel-projects', 'panel-skills']);
  let achTimer   = null;
  let totalModules = 6;

  function trackExplore(panelId, achievementText) {
    if (!panelId || explored.has(panelId)) return;
    explored.add(panelId);

    // Update XP bar
    const fill  = document.getElementById('xpFill');
    const label = document.getElementById('xpLabel');
    const level = document.getElementById('xpLevel');

    const pct = (explored.size / totalModules) * 100;
    if (fill)  fill.style.width  = pct + '%';
    if (label) label.textContent = explored.size + ' / ' + totalModules + ' MODULES EXPLORED';
    if (level) level.textContent = explored.size + 1;

    // Show achievement toast
    if (achievementText) showAchievement(achievementText);

    // Master achievement
    if (explored.size >= totalModules) {
      setTimeout(() => showAchievement('FULL STACK EXPLORER — ALL MODULES VISITED'), 1200);
    }
  }

  function showAchievement(text) {
    const toast = document.getElementById('achToast');
    const desc  = document.getElementById('achDesc');
    if (!toast || !desc) return;

    desc.textContent = text;
    toast.classList.add('show');
    clearTimeout(achTimer);
    achTimer = setTimeout(() => toast.classList.remove('show'), 3500);
  }

  function setTotalModules(n) { totalModules = n; }

  function init(navNodes) {
    setTotalModules((navNodes || []).length || 6);

    const fill  = document.getElementById('xpFill');
    const label = document.getElementById('xpLabel');
    const level = document.getElementById('xpLevel');

    const pct = (explored.size / totalModules) * 100;
    if (fill)  fill.style.width  = pct + '%';
    if (label) label.textContent = explored.size + ' / ' + totalModules + ' MODULES EXPLORED';
    if (level) level.textContent = explored.size + 1;
  }

  function showHUD() {
    document.getElementById('xpHud')?.classList.add('show');
  }

  return { init, trackExplore, showAchievement, showHUD };
})();
