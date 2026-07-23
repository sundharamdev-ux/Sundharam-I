/**
 * config-loader.js
 * Fetches all JSON config files in parallel and caches them.
 * Usage: const configs = await ConfigLoader.loadAll();
 */
const ConfigLoader = (function () {
  const CONFIGS = {
    site:    'config/site.json',
    profile: 'config/profile.json',
    projects:'config/projects.json',
    skills:  'config/skills.json',
    resume:  'config/resume.json',
  };

  let _cache = null;

  async function fetchJSON(url) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return await res.json();
    } catch (err) {
      console.error(`[ConfigLoader] Failed to load ${url}:`, err);
      return null;
    }
  }

  async function loadAll() {
    if (_cache) return _cache;
    const entries = Object.entries(CONFIGS);
    const results = await Promise.all(entries.map(([, url]) => fetchJSON(url)));
    _cache = {};
    entries.forEach(([key], i) => {
      _cache[key] = results[i];
    });
    return _cache;
  }

  function get(key) {
    if (!_cache) throw new Error('[ConfigLoader] Configs not loaded yet. Call loadAll() first.');
    return _cache[key];
  }

  return { loadAll, get };
})();
window.ConfigLoader = ConfigLoader;

