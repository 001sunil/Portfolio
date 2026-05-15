// Initialize theme IMMEDIATELY before page renders
// This prevents the white flash on page load

(function() {
    const THEME_KEY = 'portfolio-theme';
    const THEME_BW = 'theme-bw';
    const THEME_DEFAULT = 'theme-default';
    
    // Get saved theme synchronously from localStorage
    let savedTheme = null;
    try {
        savedTheme = localStorage.getItem(THEME_KEY);
    } catch (e) {
        // localStorage not available, use default
    }
    
    const themeToApply = savedTheme || THEME_DEFAULT;
    
    // Apply theme class immediately (synchronous, blocks rendering until complete)
    if (themeToApply === THEME_BW) {
        document.documentElement.classList.add(THEME_BW);
        // Also set inline style to prevent any flash
        document.documentElement.style.backgroundColor = '#1a1a1a';
        // Disable transitions initially to prevent animation flicker
        document.documentElement.style.setProperty('--transition-duration', '0s', 'important');
    }
    
    // Store for later use by theme-switcher.js
    window.__initialTheme = themeToApply;
})();
