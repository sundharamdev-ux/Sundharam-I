/**
 * main.js
 * Entry point — loads all configs in parallel, then initializes all modules in order.
 * This is the ONLY file that coordinates the other modules.
 */
(async function () {
  // 1. Load all JSON configs in parallel
  const configs = await ConfigLoader.loadAll();
  const { site, profile, projects, skills, resume } = configs;

  if (!site) {
    console.error('[main] Failed to load site.json — check your config/ folder');
  }

  // 2. Initialize background (can start immediately, no config dependency)
  Background.init(site);

  // 3. Initialize audio module
  Audio.init(site);

  // 4. Initialize XP/gamification
  XP.init(site?.nav);

  // 5. Boot sequence — after boot completes, initialize rest of the UI
  Boot.init(site, function onBootComplete() {
    // Show HUD
    XP.showHUD();

    // Initialize navigation
    Nav.init();

    // Build hub nodes from config
    Hub.init(site);

    // Wire back buttons for all panels
    document.querySelectorAll('[data-back]').forEach(btn => {
      btn.addEventListener('click', () => Nav.closePanel());
    });

    // Initialize all section renderers
    Projects.init(projects);
    Skills.init(skills);
    About.init(profile);
    Resume.init(resume);
    Contact.init(site);

    // Initialize effects (cursor, ripple, Konami, etc.)
    Effects.init(site);

    // Update page title and meta from config
    if (site?.site?.title) {
      document.title = site.site.title;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && site?.site?.description) {
      metaDesc.content = site.site.description;
    }
  });
})();
