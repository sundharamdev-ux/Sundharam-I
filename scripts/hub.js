/**
 * hub.js
 * Renders the Cyberpunk Game World Map for the portfolio homepage.
 * Connects the glowing central "CORE TERMINAL" to outlying fictional islands.
 */
const Hub = (function () {
  let _resizeObserver = null;

  function init(siteConfig) {
    const mapNodesContainer = document.getElementById('mapNodes');
    const mapSvg = document.getElementById('mapSvg');

    if (!mapNodesContainer || !mapSvg) return;

    // Clear previous elements
    mapNodesContainer.innerHTML = '';
    mapSvg.innerHTML = '';

    // Define the custom fictional world map islands matching mockup
    const islands = [
      {
        id: 'node-about',
        target: 'panel-about',
        label: 'ORIGIN VILLAGE',
        visual: '🌳',
        themeClass: 'theme-green',
        items: ['About Me', 'My Journey', 'Goals & Vision'],
        pos: { x: 18, y: 30 },
        btnLabel: 'EXPLORE ➔',
        achievement: 'Player Profile Viewed'
      },
      {
        id: 'node-skills',
        target: 'panel-skills',
        label: 'SKILL PEAKS',
        visual: '🏔',
        themeClass: 'theme-purple',
        items: ['C++', 'Unreal Engine 5', 'Blueprint', 'Unity'],
        pos: { x: 50, y: 10 },
        btnLabel: 'VIEW SKILLS ➔',
        achievement: 'Skill Tree Unlocked'
      },
      {
        id: 'node-projects',
        target: 'panel-projects',
        label: 'PROJECT KINGDOM',
        visual: '🌇',
        themeClass: 'theme-red',
        items: ['10+ Projects', 'Mechanics', 'Prototypes'],
        pos: { x: 82, y: 30 },
        btnLabel: 'VIEW PROJECTS ➔',
        achievement: 'Browsed Projects'
      },
      {
        id: 'node-resume',
        target: 'panel-resume',
        label: 'MISSION LOG',
        visual: '❄',
        themeClass: 'theme-blue',
        items: ['Resume', 'Experience', 'Timeline'],
        pos: { x: 18, y: 70 },
        btnLabel: 'OPEN LOG ➔',
        achievement: 'Resume Downloaded'
      },
      {
        id: 'node-games',
        target: 'panel-games',
        label: 'PLAYGROUND ZONE',
        visual: '☢',
        themeClass: 'theme-orange',
        items: ['Playable Games', 'Web Demos', 'Experiments'],
        pos: { x: 50, y: 90 },
        btnLabel: 'PLAY NOW ➔',
        achievement: 'Entered the Arcade'
      },
      {
        id: 'node-contact',
        target: 'panel-contact',
        label: 'COMMS TERMINAL',
        visual: '🏙',
        themeClass: 'theme-cyan',
        items: ['Contact', 'GitHub', 'LinkedIn', 'Email'],
        pos: { x: 82, y: 70 },
        btnLabel: 'CONNECT ➔',
        achievement: 'Communication Channel Open'
      }
    ];

    // 1. Render glowing center float island (CORE TERMINAL)
    const centerEl = document.createElement('div');
    centerEl.className = 'map-center-island';
    centerEl.innerHTML = `
      <div class="island-glow-core"></div>
      <div class="core-panel">
        <div class="core-header">CORE TERMINAL</div>
        <div class="core-avatar">SR</div>
        <div class="core-meta">
          <div>PLAYER : SUNDHARAM</div>
          <div class="active-status"><span class="blink-dot">●</span> STATUS : ACTIVE</div>
        </div>
      </div>
    `;
    centerEl.style.left = '50%';
    centerEl.style.top = '50%';
    mapNodesContainer.appendChild(centerEl);

    // 2. Render outer islands
    islands.forEach(island => {
      const nodeEl = document.createElement('div');
      nodeEl.className = `map-island-node ${island.themeClass}`;
      nodeEl.id = island.id;
      nodeEl.tabIndex = 0;
      nodeEl.setAttribute('role', 'button');
      nodeEl.setAttribute('aria-label', island.label);
      nodeEl.style.left = `${island.pos.x}%`;
      nodeEl.style.top = `${island.pos.y}%`;

      const itemsHTML = island.items.map(item => `<li>• ${item}</li>`).join('');

      nodeEl.innerHTML = `
        <div class="island-visual">${island.visual}</div>
        <div class="island-label">${island.label}</div>
        <ul class="island-features-list">${itemsHTML}</ul>
        <div class="island-enter-btn">${island.btnLabel}</div>
      `;

      // Hover
      nodeEl.addEventListener('mouseenter', () => {
        if (typeof Audio !== 'undefined') Audio.playHover();
      });

      // Click
      nodeEl.addEventListener('click', () => {
        document.querySelectorAll('.map-island-node').forEach(n => n.classList.remove('active'));
        nodeEl.classList.add('active');
        if (typeof Nav !== 'undefined') {
          Nav.openPanel(island.target);
        }
        if (typeof XP !== 'undefined') {
          XP.trackExplore(island.target, island.achievement);
        }
      });

      nodeEl.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          nodeEl.click();
        }
      });

      mapNodesContainer.appendChild(nodeEl);
    });

    // 3. Render connection roads (SVG paths)
    function drawIslandsRoads() {
      mapSvg.innerHTML = '';
      const mapRect = mapSvg.getBoundingClientRect();
      const w = mapRect.width;
      const h = mapRect.height;

      const cx = w / 2;
      const cy = h / 2;

      islands.forEach(island => {
        const rx = (island.pos.x / 100) * w;
        const ry = (island.pos.y / 100) * h;

        // Draw curved connections
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        const dx = rx - cx;
        const dy = ry - cy;
        const mx = cx + dx / 2 - dy * 0.04;
        const my = cy + dy / 2 + dx * 0.04;

        path.setAttribute('d', `M ${cx} ${cy} Q ${mx} ${my} ${rx} ${ry}`);
        path.setAttribute('class', `map-island-road ${island.themeClass}`);
        path.setAttribute('fill', 'none');

        const shadowPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        shadowPath.setAttribute('d', `M ${cx} ${cy} Q ${mx} ${my} ${rx} ${ry}`);
        shadowPath.setAttribute('class', 'map-road-shadow');
        shadowPath.setAttribute('fill', 'none');

        mapSvg.appendChild(shadowPath);
        mapSvg.appendChild(path);
      });
    }

    drawIslandsRoads();

    // Resize handling
    if (typeof ResizeObserver !== 'undefined') {
      _resizeObserver = new ResizeObserver(() => {
        drawIslandsRoads();
      });
      _resizeObserver.observe(mapNodesContainer);
    } else {
      window.addEventListener('resize', drawIslandsRoads);
    }

    // 4. Wire Top Right Quick Access click listener panels
    const quickResume = document.getElementById('quickResume');
    if (quickResume) {
      quickResume.addEventListener('click', () => {
        if (typeof Audio !== 'undefined') Audio.playClick();
        if (typeof Nav !== 'undefined') Nav.openPanel('panel-resume');
      });
    }

    const quickContact = document.getElementById('quickContact');
    if (quickContact) {
      quickContact.addEventListener('click', () => {
        if (typeof Audio !== 'undefined') Audio.playClick();
        if (typeof Nav !== 'undefined') Nav.openPanel('panel-contact');
      });
    }

    const quickPlayground = document.getElementById('quickPlayground');
    if (quickPlayground) {
      quickPlayground.addEventListener('click', () => {
        if (typeof Audio !== 'undefined') Audio.playClick();
        if (typeof Nav !== 'undefined') Nav.openPanel('panel-games');
      });
    }

    const quickGithub = document.getElementById('quickGithub');
    if (quickGithub) {
      quickGithub.addEventListener('click', () => {
        if (typeof Audio !== 'undefined') Audio.playClick();
      });
    }

    // View All Achievements
    const btnAch = document.getElementById('btnAchievementsViewAll');
    if (btnAch) {
      btnAch.addEventListener('click', () => {
        if (typeof Audio !== 'undefined') Audio.playAchievement();
        if (typeof XP !== 'undefined') XP.showAchievement("ALL ACHIEVEMENTS ACQUIRED! KEEP PROGRAMMING!");
      });
    }
  }

  function destroy() {
    if (_resizeObserver) {
      _resizeObserver.disconnect();
    }
  }

  return { init, destroy };
})();
