/**
 * skills.js
 * Renders skill categories and animated bars from skills.json.
 * Bars animate when the panel becomes visible (MutationObserver).
 */
const Skills = (function () {
  let _animated = false;

  function animateBars() {
    if (_animated) return;
    const panel = document.getElementById('panel-skills');
    if (!panel?.classList.contains('open')) return;
    _animated = true;
    document.querySelectorAll('.bar-fill[data-val]').forEach(bar => {
      // Stagger each bar slightly
      const idx   = Array.from(document.querySelectorAll('.bar-fill[data-val]')).indexOf(bar);
      const delay = idx * 60;
      setTimeout(() => {
        bar.style.width = bar.dataset.val + '%';
      }, delay);
    });
  }

  function init(skillsConfig) {
    const categories = skillsConfig?.categories || [];
    const body       = document.getElementById('skillsBody');
    body.innerHTML   = '<p class="section-lead">Core engineering competencies across engines, languages, and gameplay systems.</p>';

    categories.forEach(cat => {
      // Category heading
      const heading = document.createElement('div');
      heading.className = 'skills-cat-label';
      heading.innerHTML = `${cat.icon || '◆'} ${cat.label}`;
      body.appendChild(heading);

      // Cards grid
      const grid = document.createElement('div');
      grid.className = 'card-grid';

      cat.skills.forEach(skill => {
        const card = document.createElement('div');
        card.className = 'card skill-card';
        card.innerHTML = `
          <div class="skill-header">
            <span class="skill-name">
              ${skill.name}
              ${skill.tag ? `<span class="skill-tag">${skill.tag}</span>` : ''}
            </span>
            <span class="skill-pct">${skill.level}%</span>
          </div>
          <div class="bar-track">
            <div class="bar-fill" data-val="${skill.level}" style="width:0"></div>
          </div>`;
        grid.appendChild(card);
      });

      body.appendChild(grid);
    });

    // Observe panel open to trigger bar animation
    const observer = new MutationObserver(() => {
      const panel = document.getElementById('panel-skills');
      if (panel.classList.contains('open')) {
        setTimeout(animateBars, 200);
      } else {
        _animated = false; // reset on close so bars re-animate next time
        document.querySelectorAll('.bar-fill[data-val]').forEach(bar => {
          bar.style.width = '0';
        });
      }
    });
    observer.observe(document.getElementById('panel-skills'), {
      attributes: true,
      attributeFilter: ['class'],
    });
  }

  return { init };
})();
