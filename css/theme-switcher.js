// Theme Switcher - Handles switching between default and black & white themes

const THEME_KEY = 'portfolio-theme';
const THEME_BW = 'theme-bw';
const THEME_DEFAULT = 'theme-default';

class ThemeSwitcher {
    constructor() {
        this.currentTheme = this.loadTheme();
        this.init();
    }

    init() {
        // Apply saved theme immediately (theme-init.js already set it, just sync the button)
        this.applyThemeUI(this.currentTheme);
        
        // Set up theme toggle button
        this.setupThemeToggle();
        
        // Listen for changes in other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === THEME_KEY) {
                this.currentTheme = e.newValue || THEME_DEFAULT;
                this.applyTheme(this.currentTheme);
            }
        });
        
        // Re-apply theme if it's not already applied (safety check)
        if (!document.documentElement.classList.contains(THEME_BW) && 
            !document.documentElement.classList.contains(THEME_DEFAULT)) {
            this.applyTheme(this.currentTheme);
        }
    }
    
    // Apply theme to UI only (button text, etc) - theme class already applied by theme-init.js
    applyThemeUI(theme) {
        try {
            this.updateToggleButton();
        } catch (error) {
            console.error('Error applying theme UI:', error);
        }
    }

    loadTheme() {
        // Check localStorage for saved theme
        const saved = localStorage.getItem(THEME_KEY);
        if (saved) return saved;
        
        // Default to light theme
        return THEME_DEFAULT;
    }

    applyTheme(theme) {
        try {
            const htmlElement = document.documentElement;
            
            // Disable transitions during theme switch to prevent flashing
            htmlElement.style.transition = 'none';
            htmlElement.style.setProperty('--transition-duration', '0s', 'important');
            
            // Remove both theme classes
            htmlElement.classList.remove(THEME_BW, THEME_DEFAULT);
            
            // Set background immediately to prevent flash
            if (theme === THEME_BW) {
                htmlElement.style.backgroundColor = '#1a1a1a';
                htmlElement.classList.add(THEME_BW);
            } else {
                htmlElement.style.backgroundColor = '#ffffff';
                htmlElement.classList.add(THEME_DEFAULT);
            }
            
            // Save to localStorage
            localStorage.setItem(THEME_KEY, theme);
            this.currentTheme = theme;
            
            // Update button text
            this.updateToggleButton();
            
            // Re-enable transitions after theme is applied
            setTimeout(() => {
                htmlElement.style.transition = '';
                htmlElement.style.setProperty('--transition-duration', '0.3s', 'important');
            }, 50);
            
            // Dispatch custom event for other scripts
            window.dispatchEvent(new CustomEvent('themechange', { 
                detail: { theme } 
            }));
            
            console.log('Theme applied:', theme);
        } catch (error) {
            console.error('Error applying theme:', error);
        }
    }

    toggle() {
        const newTheme = this.currentTheme === THEME_DEFAULT ? THEME_BW : THEME_DEFAULT;
        this.applyTheme(newTheme);
    }

    setupThemeToggle() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (toggleBtn) {
            // Add click listener (no need to replace node)
            toggleBtn.addEventListener('click', () => {
                this.toggle();
            });
            
            // Update button immediately
            this.updateToggleButton();
        } else {
            console.warn('Theme toggle button not found');
        }
    }

    updateToggleButton() {
        const toggleBtn = document.getElementById('theme-toggle');
        if (!toggleBtn) return;
        
        if (this.currentTheme === THEME_BW) {
            toggleBtn.innerHTML = '☀️ Light';
            toggleBtn.setAttribute('aria-label', 'Switch to light theme');
            toggleBtn.title = 'Switch to light theme';
        } else {
            toggleBtn.innerHTML = '🌙 Dark';
            toggleBtn.setAttribute('aria-label', 'Switch to dark theme');
            toggleBtn.title = 'Switch to dark theme';
        }
    }

    getCurrentTheme() {
        return this.currentTheme;
    }

    isBlackWhiteTheme() {
        return this.currentTheme === THEME_BW;
    }
}

// Initialize theme switcher when DOM is fully ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.themeSwitcher = new ThemeSwitcher();
    });
} else {
    window.themeSwitcher = new ThemeSwitcher();
}
