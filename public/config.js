(function bootstrapConfig() {
  const host = window.location.hostname;
  const isGitHubPages = host.endsWith('github.io');

  window.APP_CONFIG = {
    API_BASE: isGitHubPages ? 'https://module-5-song.onrender.com' : '',
  };
})();
