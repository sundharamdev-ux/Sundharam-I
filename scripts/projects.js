/**
 * projects.js
 * Renders the Projects panel (engine choice), project list, and full project detail page.
 * All data comes from projects.json — zero hardcoding.
 */
const Projects = (function () {
  let _projects = [];
  let _currentEngine = 'unreal';
  let _currentProjectIndex = 0;

  // ── Helpers ─────────────────────────────────
  function cardArt(project) {
    const hasThumb = project.thumbnail?.trim().length > 0;
    const cls = 'card-art' + (hasThumb ? ' has-thumb' : '');
    const thumbHtml = hasThumb
      ? `<img src="${project.thumbnail}" class="card-thumb-img" alt="${project.title} thumbnail" loading="lazy">
         <div class="card-thumb-overlay"></div>`
      : '';
    return `
      <div class="${cls}">
        ${thumbHtml}
        <div class="card-placeholder">
          <span class="big">▣</span>
          <span>THUMBNAIL</span>
        </div>
        <div class="card-tag">${project.genre || 'GAME'}</div>
        <div class="card-status ${project.status?.toLowerCase() === 'released' ? 'released' : 'prototype'}">
          ${project.status || 'PROTOTYPE'}
        </div>
      </div>`;
  }

  function tagsBadges(arr = [], cls = '') {
    return arr.map(t => `<span class="tag ${cls}">${t}</span>`).join('');
  }

  function videoEmbed(videoUrl, title) {
    if (!videoUrl) return '';

    // Check if it's a direct video file (ends with extension or inside assets/videos)
    const isDirectVideo = /\.(mp4|webm|ogg|mov|m4v)($|\?)/i.test(videoUrl) || videoUrl.startsWith('assets/');
    if (isDirectVideo) {
      return `<video src="${videoUrl}" controls playsinline preload="metadata" title="${title} gameplay video"></video>`;
    }

    let embedUrl = videoUrl;
    // Check YouTube URLs and extract video ID
    const ytMatch = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
    if (ytMatch && ytMatch[1]) {
      embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
    } else {
      // Check Vimeo URLs and extract video ID
      const vimeoMatch = videoUrl.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/i);
      if (vimeoMatch && vimeoMatch[1]) {
        embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;
      }
    }

    return `<iframe src="${embedUrl}" allow="autoplay; fullscreen" allowfullscreen title="${title} gameplay video"></iframe>`;
  }

  // ── Engine Hub (choose engine screen) ───────
  function renderEngineHub() {
    const ueCount = _projects.filter(p => p.engine === 'unreal').length;
    const unCount = _projects.filter(p => p.engine === 'unity').length;

    document.getElementById('ueCount').textContent = ueCount + ' PROJECTS';
    document.getElementById('unCount').textContent = unCount + ' PROJECTS';
  }

  // ── Project List ─────────────────────────────
  function renderProjectList(engine) {
    _currentEngine = engine;
    const grid = document.getElementById('projectsGrid');
    const title = document.getElementById('listTitle');
    const filtered = _projects.filter(p => p.engine === engine);

    title.textContent = engine === 'unreal'
      ? 'UNREAL ENGINE 5 PROJECTS'
      : 'UNITY PROJECTS';

    grid.innerHTML = '';
    filtered.forEach((project, i) => {
      const globalIdx = _projects.indexOf(project);
      const card = document.createElement('div');
      card.className = 'card';
      card.style.animationDelay = (i * 0.06) + 's';
      card.innerHTML = `
        ${cardArt(project)}
        <div class="card-body">
          <h3>${project.title}</h3>
          <p>${project.description?.slice(0, 100)}${project.description?.length > 100 ? '…' : ''}</p>
          <div class="tags">
            ${tagsBadges([project.engineLabel, project.language], 'primary')}
            ${tagsBadges(project.platform || [], '')}
          </div>
          <div class="card-actions">
            <button class="btn-mini" data-open-project="${globalIdx}">◧ VIEW PROJECT</button>
            ${project.itch ? `<button class="btn-mini magenta" data-itch="${project.itch}">▶ PLAY</button>` : ''}
          </div>
        </div>`;
      grid.appendChild(card);
    });

    // (Click listener moved to init to avoid duplicate listeners)
  }

  // ── Games Panel (quick cards for playable games) ─
  function renderGamesPanel() {
    const grid = document.getElementById('gamesGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const playable = _projects.filter(p => p.itch && p.itch.trim().length > 0);

    playable.forEach((project, i) => {
      const globalIdx = _projects.indexOf(project);
      const card = document.createElement('div');
      card.className = 'card play-card';
      card.style.animationDelay = (i * 0.045) + 's';
      card.innerHTML = `
        ${cardArt(project)}
        <div class="card-body">
          <h3>${project.title}</h3>
          <div class="tags">
            <span class="tag">${project.genre}</span>
            <span class="tag primary">${project.engineLabel}</span>
          </div>
          <div class="card-actions">
            <button class="btn-mini" data-itch="${project.itch}">▶ PLAY ON ITCH.IO</button>
            <button class="btn-mini magenta" data-open-project="${globalIdx}">◧ DETAILS</button>
          </div>
        </div>`;
      grid.appendChild(card);
    });
  }

  // ── Full Project Detail Page ──────────────────
  let currentShots = [];
  let currentShotIdx = 0;

  function renderCarousel() {
    const viewport = document.getElementById('carouselViewport');
    if (!viewport) return;

    if (currentShots.length === 0) {
      viewport.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;height:100%;font-family:var(--font-ui);font-size:10px;color:rgba(255,255,255,0.3)">
          NO IMAGES AVAILABLE
        </div>`;
      return;
    }

    viewport.innerHTML = currentShots.map((src, i) => `
      <img src="${src}" class="${i === currentShotIdx ? 'active' : ''}" alt="Screenshot ${i + 1}">
    `).join('');
  }

  function openProjectDetail(idx) {
    _currentProjectIndex = idx;
    const p = _projects[idx];
    _currentEngine = p.engine;

    // Title
    document.getElementById('detailProjectTitle').textContent = p.title;

    // Status tag
    const statusEl = document.getElementById('detailStatusTag');
    if (statusEl) statusEl.textContent = (p.status || 'PROTOTYPE').toUpperCase();

    // Badges
    const badgeContainer = document.getElementById('detailProjectBadges');
    if (badgeContainer) {
      badgeContainer.innerHTML = `
        <span class="detail-badge-item ue5">${p.engineLabel}</span>
        <span class="detail-badge-item cpp">${p.language}</span>
        <span class="detail-badge-item blueprint">${p.genre}</span>
        <span class="detail-badge-item genre">${p.role || 'Solo Developer'}</span>
      `;
    }

    // Video Embed
    const videoContainer = document.getElementById('detailVideoCard');
    if (videoContainer) {
      if (p.video) {
        videoContainer.innerHTML = videoEmbed(p.video, p.title);
      } else {
        videoContainer.innerHTML = `
          <div class="ph-label" style="height:100%; display:flex; flex-direction:column; justify-content:center; align-items:center;">
            <div class="play-btn-circle">▶</div>
            <span>GAMEPLAY VIDEO</span>
            <span style="font-size:9px;opacity:.5">Add video URL to projects.json</span>
          </div>`;
      }
    }

    // Carousel Setup
    currentShots = [...(p.screenshots || [])];
    if (p.thumbnail && !currentShots.includes(p.thumbnail)) {
      currentShots.unshift(p.thumbnail);
    }
    currentShotIdx = 0;
    renderCarousel();

    // Description
    const descEl = document.getElementById('detailDescriptionText');
    if (descEl) descEl.textContent = p.description;

    // Core Mechanics (4 Cards Grid)
    const mechanicsContainer = document.getElementById('detailMechanicsGrid');
    if (mechanicsContainer) {
      const defaultMechanics = [
        { icon: '⏳', title: 'TIME SHIFT', desc: 'Switch between past and present timelines.' },
        { icon: '🔄', title: 'STATE SYNC', desc: 'Objects remember and sync their states.' },
        { icon: '🧩', title: 'PUZZLE SYSTEM', desc: 'Environment based logic challenges.' },
        { icon: '👆', title: 'INTERACTABLES', desc: 'Levers, switches, platforms & more.' }
      ];

      let mechanicsCards = [];
      if (p.mechanics && p.mechanics.length > 0) {
        const icons = ['⏳', '🔄', '🧩', '👆', '⚡', '🎯', '⚙️', '🛡️'];
        mechanicsCards = p.mechanics.slice(0, 4).map((m, i) => {
          const parts = typeof m === 'string' ? m.split(':') : [m];
          return {
            icon: icons[i % icons.length],
            title: parts[0]?.trim().toUpperCase() || 'MECHANIC',
            desc: parts[1]?.trim() || parts[0]?.trim() || 'Core gameplay mechanic.'
          };
        });
      }
      if (mechanicsCards.length === 0) mechanicsCards = defaultMechanics;

      mechanicsContainer.innerHTML = mechanicsCards.map(m => `
        <div class="mechanic-box">
          <div class="mechanic-icon">${m.icon}</div>
          <div class="mechanic-title">${m.title}</div>
          <p class="mechanic-desc">${m.desc}</p>
        </div>
      `).join('');
    }

    // Tech & Tools
    const techContainer = document.getElementById('detailTechToolsRow');
    if (techContainer) {
      const technologies = p.technologies || [p.engineLabel, p.language, 'Blueprint', 'Git', 'Photoshop'];
      techContainer.innerHTML = technologies.map(t => `
        <span class="tech-badge-item">
          <span class="tech-icon">◆</span>
          <span>${t}</span>
        </span>
      `).join('');
    }

    // Developer Notes (Challenge, Solution, Impact)
    const devLog = p.devLog || {
      challenge: p.genre?.toLowerCase().includes('puzzle')
        ? "Designing a unique puzzle mechanic where every intentional player death creates a platform while ensuring levels remain challenging, readable, and progressively more complex without confusing the player."
        : "Creating responsive and smooth rotation controls while ensuring accurate color matching and collision detection across mobile touch and desktop keyboard inputs without affecting gameplay responsiveness.",
      solution: p.genre?.toLowerCase().includes('puzzle')
        ? "Developed a custom death-platform spawning system that records the player's death position, spawns a persistent platform, respawns the player at the level start, and resets the level state when hazards are triggered. Carefully designed handcrafted levels that encourage exploration, strategic sacrifice, and creative puzzle solving.."
        : "Implemented a smooth input-driven rotation system using Unity's Input System, optimized collision detection for precise color validation, and developed a modular gameplay architecture for scoring, health management, UI updates, and game state transitions.",
      impact: "Delivered a responsive and polished arcade experience with accurate color matching, consistent cross-platform controls, optimized gameplay performance, and a scalable codebase for adding new features and gameplay improvements."
    };

    const chalEl = document.getElementById('detailChallengeText');
    const solEl = document.getElementById('detailSolutionText');
    const impEl = document.getElementById('detailImpactText');
    if (chalEl) chalEl.textContent = devLog.challenge;
    if (solEl) solEl.textContent = devLog.solution;
    if (impEl) impEl.textContent = devLog.impact || "Clean code structure, modular system design, and zero performance bottlenecks.";

    // Scroll container to top
    const scrollArea = document.querySelector('.dashboard-scroll-area');
    if (scrollArea) scrollArea.scrollTop = 0;

    // Show detail panel if not already open/on top
    if (Nav.currentPanel() !== 'panel-game-page') {
      Nav.pushPanel('panel-game-page');
    }
  }

  // ── Wire back buttons ────────────────────────
  function wireBackButtons() {
    // Back to list from detail
    document.getElementById('backToList')?.addEventListener('click', () => {
      Nav.closePanel();
    });

    // Wire quick access links on detail page
    document.getElementById('detailQuickResume')?.addEventListener('click', () => {
      if (typeof Audio !== 'undefined') Audio.playClick();
      if (typeof Nav !== 'undefined') Nav.openPanel('panel-resume');
    });
    document.getElementById('detailQuickContact')?.addEventListener('click', () => {
      if (typeof Audio !== 'undefined') Audio.playClick();
      if (typeof Nav !== 'undefined') Nav.openPanel('panel-contact');
    });
    document.getElementById('detailQuickPlayground')?.addEventListener('click', () => {
      if (typeof Audio !== 'undefined') Audio.playClick();
      if (typeof Nav !== 'undefined') Nav.openPanel('panel-games');
    });

    // Carousel navigation
    document.getElementById('carouselPrev')?.addEventListener('click', () => {
      if (currentShots.length <= 1) return;
      currentShotIdx = (currentShotIdx - 1 + currentShots.length) % currentShots.length;
      renderCarousel();
    });
    document.getElementById('carouselNext')?.addEventListener('click', () => {
      if (currentShots.length <= 1) return;
      currentShotIdx = (currentShotIdx + 1) % currentShots.length;
      renderCarousel();
    });

    // Back to engine hub from list
    document.getElementById('backToProjects')?.addEventListener('click', () => {
      Nav.closePanel();
    });

    // Engine choice cards
    document.getElementById('chooseUnreal')?.addEventListener('click', () => {
      renderProjectList('unreal');
      Nav.pushPanel('panel-project-list');
    });
    document.getElementById('chooseUnity')?.addEventListener('click', () => {
      renderProjectList('unity');
      Nav.pushPanel('panel-project-list');
    });
  }

  // ── Public API ───────────────────────────────
  function init(projectsConfig) {
    _projects = projectsConfig?.projects || [];
    renderEngineHub();
    renderGamesPanel();
    wireBackButtons();

    // Wire grid click delegation listeners exactly once
    const projectsGrid = document.getElementById('projectsGrid');
    if (projectsGrid) {
      projectsGrid.addEventListener('click', e => {
        const openBtn = e.target.closest('[data-open-project]');
        if (openBtn) {
          openProjectDetail(parseInt(openBtn.dataset.openProject, 10));
          return;
        }
        const itchBtn = e.target.closest('[data-itch]');
        if (itchBtn) {
          window.open(itchBtn.dataset.itch, '_blank', 'noopener');
        }
      });
    }

    const gamesGrid = document.getElementById('gamesGrid');
    if (gamesGrid) {
      gamesGrid.addEventListener('click', e => {
        const itchBtn = e.target.closest('[data-itch]');
        if (itchBtn) {
          window.open(itchBtn.dataset.itch, '_blank', 'noopener');
          return;
        }
        const openBtn = e.target.closest('[data-open-project]');
        if (openBtn) {
          openProjectDetail(parseInt(openBtn.dataset.openProject, 10));
        }
      });
    }
  }

  return { init, openProjectDetail };
})();
