/**
 * about.js
 * Renders the About Me panel from profile.json.
 * Futuristic retro-game themed layout for Gameplay Programmer "Sundharam".
 */
const About = (function () {
  function init(profile) {
    const body = document.querySelector('#panel-about .panel-body');
    if (!body || !profile) return;

    // Portrait image with pixel frame
    const portraitHTML = profile.avatar
      ? `<img src="${profile.avatar}" alt="${profile.name || 'Sundharam'} photo" onerror="this.onerror=null; this.parentElement.innerHTML='<div class=\\'ph-label\\'><span class=\\'big\\'>☉</span><span>SUNDHARAM</span><span style=\\'font-size:10px;margin-top:4px;color:var(--accent-1);\\'>GAMEPLAY PROGRAMMER</span></div>';">`
      : `<div class="ph-label">
           <span class="big">☉</span>
           <span>SUNDHARAM</span>
           <span style="font-size:10px;margin-top:4px;color:var(--accent-1);">GAMEPLAY PROGRAMMER</span>
         </div>`;

    // Core Skill Tags (Left Column)
    const defaultCoreSkills = [
      "Unreal Engine 5",
      "C++",
      "Blueprint",
      "Unity",
      "Git",
      "Rider",
      "Visual Studio"
    ];
    const coreSkills = profile.coreSkills || defaultCoreSkills;
    const coreSkillsHTML = coreSkills
      .map(skill => `<span class="core-skill-tag">${skill}</span>`)
      .join('');

    // Bio text
    const bioText = Array.isArray(profile.bio) ? profile.bio.join('<br><br>') : (profile.bio || '');

    // Stats Grid
    const defaultStats = [
      { value: "10+", label: "PROJECTS BUILT" },
      { value: "20+", label: "MECHANICS PROTOTYPED" },
      { value: "3", label: "PLATFORMS TARGETED" },
      { value: "2+", label: "YEARS EXPERIENCE" }
    ];
    const statsList = profile.stats && profile.stats.length ? profile.stats : defaultStats;
    const statsHTML = statsList
      .map(s => `
        <div class="hud-stat-card">
          <span class="stat-value">${s.value}</span>
          <span class="stat-label">${s.label}</span>
        </div>
      `).join('');

    // Bottom Info Cards
    const defaultDetails = [
      { label: "ROLE", value: "Gameplay Programmer" },
      { label: "FOCUS", value: ["Player Feel", "Gameplay Systems", "Optimization", "Rapid Prototyping"] },
      { label: "ENGINES", value: ["Unreal Engine 5", "Unity"] },
      { label: "LANGUAGES", value: ["C++", "C#", "Blueprint"] },
      { label: "TOOLS", value: ["Git", "Rider", "Photoshop", "Figma"] }
    ];
    const detailsList = profile.details && profile.details.length ? profile.details : defaultDetails;

    const detailsHTML = detailsList.map(d => {
      let valContent = '';
      if (Array.isArray(d.value)) {
        valContent = `<div class="info-card-pills">${d.value.map(v => `<span class="info-pill">${v}</span>`).join('')}</div>`;
      } else {
        valContent = `<span class="info-card-text">${d.value}</span>`;
      }
      return `
        <div class="hud-info-card">
          <div class="info-card-header">
            <span class="hud-card-dot">◆</span> ${d.label}
          </div>
          ${valContent}
        </div>
      `;
    }).join('');

    // Render Full Layout
    body.innerHTML = `
      <div class="about-hud-layout">
        <!-- LEFT PANEL: Portrait & Core Skills -->
        <aside class="about-left-panel">
          <div class="pixel-frame-container">
            <div class="pixel-frame-header">
              <span class="hud-corner-tl"></span>
              <span class="hud-corner-tr"></span>
              <span class="frame-label">ID: AGENT-01</span>
            </div>
            <div class="about-portrait" id="aboutPhoto">
              ${portraitHTML}
            </div>
            <div class="pixel-frame-footer">
              <span class="hud-corner-bl"></span>
              <span class="hud-corner-br"></span>
              <span class="status-indicator"><span class="blink-dot">●</span> SYSTEM ONLINE</span>
            </div>
          </div>

          <!-- Core Skills Box -->
          <div class="core-skills-box">
            <div class="core-skills-title">
              <span class="icon">⚡</span> CORE SKILLS
            </div>
            <div class="core-skills-grid">
              ${coreSkillsHTML}
            </div>
          </div>
        </aside>

        <!-- CENTER & MAIN SECTION -->
        <main class="about-center-panel">
          <!-- Intro Header -->
          <div class="about-hero-header">
            <div class="eyebrow-tag">${profile.eyebrow || 'GAMEPLAY PROGRAMMER'}</div>
            <h1 class="hero-name">${profile.name || 'Sundharam'}</h1>
            <div class="intro-box">
              <p class="intro-text">
                "${bioText}"
              </p>
            </div>
          </div>

          <!-- Glowing Green Stats Row -->
          <div class="hud-stats-container">
            <div class="section-subheading">◆ OPERATIONAL METRICS</div>
            <div class="hud-stats-grid">
              ${statsHTML}
            </div>
          </div>

          <!-- Bottom Info Cards -->
          <div class="hud-info-container">
            <div class="section-subheading">◆ SYSTEM SPECIFICATIONS</div>
            <div class="hud-info-grid">
              ${detailsHTML}
            </div>
          </div>

          <!-- Bottom Right Action Buttons -->
          <div class="about-actions-footer">
            <button class="hud-action-btn" id="btnAboutResume">
              <span class="btn-bracket">[</span> Resume <span class="btn-bracket">]</span>
            </button>
            <a class="hud-action-btn" id="btnAboutGithub" href="https://github.com/" target="_blank" rel="noopener">
              <span class="btn-bracket">[</span> GitHub <span class="btn-bracket">]</span>
            </a>
            <a class="hud-action-btn" id="btnAboutLinkedin" href="https://www.linkedin.com/in/sundharam-i" target="_blank" rel="noopener">
              <span class="btn-bracket">[</span> LinkedIn <span class="btn-bracket">]</span>
            </a>
            <button class="hud-action-btn btn-highlight" id="btnAboutContact">
              <span class="btn-bracket">[</span> Contact <span class="btn-bracket">]</span>
            </button>
          </div>
        </main>
      </div>
    `;

    // Event listeners for actions
    const btnResume = document.getElementById('btnAboutResume');
    if (btnResume) {
      btnResume.addEventListener('click', () => {
        if (typeof Audio !== 'undefined') Audio.playClick();
        if (typeof Nav !== 'undefined') Nav.openPanel('panel-resume');
      });
    }

    const btnContact = document.getElementById('btnAboutContact');
    if (btnContact) {
      btnContact.addEventListener('click', () => {
        if (typeof Audio !== 'undefined') Audio.playClick();
        if (typeof Nav !== 'undefined') Nav.openPanel('panel-contact');
      });
    }

    const btnGithub = document.getElementById('btnAboutGithub');
    if (btnGithub) {
      btnGithub.addEventListener('click', () => {
        if (typeof Audio !== 'undefined') Audio.playClick();
      });
    }

    const btnLinkedin = document.getElementById('btnAboutLinkedin');
    if (btnLinkedin) {
      btnLinkedin.addEventListener('click', () => {
        if (typeof Audio !== 'undefined') Audio.playClick();
      });
    }
  }

  return { init };
})();
window.About = About;

