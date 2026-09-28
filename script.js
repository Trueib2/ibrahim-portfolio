/**
 * Muhammad Ibrahim - Personal Portfolio Interaction Script
 * Clean, lightweight Vanilla JavaScript (no frameworks)
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileMenu();
    initScrollSpy();
    initScrollFadeIn();
    initEmailCopy();
    initContactForm();
    initBackToTop();
});

/**
 * 1. LIGHT / DARK THEME TOGGLE WITH prefers-color-scheme SUPPORT
 */
function initThemeToggle() {
    const themeToggleBtn = document.getElementById('theme-toggle');
    const root = document.documentElement;

    // Check stored user preference, otherwise default to system color scheme
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    if (storedTheme) {
        root.setAttribute('data-theme', storedTheme);
    } else if (prefersDark.matches) {
        root.setAttribute('data-theme', 'dark');
    } else {
        root.setAttribute('data-theme', 'light');
    }

    // Toggle theme on click
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = root.getAttribute('data-theme') || (prefersDark.matches ? 'dark' : 'light');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            root.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // Listen for OS system theme changes if user hasn't explicitly set preference
    prefersDark.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            const newSystemTheme = e.matches ? 'dark' : 'light';
            root.setAttribute('data-theme', newSystemTheme);
        }
    });
}

/**
 * 2. MOBILE NAVIGATION MENU
 */
function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (!menuBtn || !navMenu) return;

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        navMenu.classList.toggle('open');
    });

    // Close mobile menu on clicking any navigation link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            navMenu.classList.remove('open');
        });
    });

    // Close when clicking outside of the drawer
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuBtn.contains(e.target) && navMenu.classList.contains('open')) {
            menuBtn.classList.remove('active');
            navMenu.classList.remove('open');
        }
    });
}

/**
 * 3. ACTIVE NAVIGATION LINK ON SCROLL (SCROLL SPY)
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollPosition = window.pageYOffset + 120;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { passive: true });
}

/**
 * 4. SUBTLE FADE-IN ON SCROLL
 */
function initScrollFadeIn() {
    const fadeElements = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        fadeElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        fadeElements.forEach(el => el.classList.add('visible'));
    }
}

/**
 * 5. EMAIL COPY & TOAST NOTIFICATION
 */
function initEmailCopy() {
    const email = 'iarman529@gmail.com';
    const heroBtn = document.getElementById('copy-email-hero-btn');
    const contactBtn = document.getElementById('copy-email-contact-btn');

    function copyToClipboard() {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(email)
                .then(() => showToast('Email address copied to clipboard!'))
                .catch(() => showToast(`Email: ${email}`));
        } else {
            // Fallback
            const temp = document.createElement('input');
            temp.value = email;
            document.body.appendChild(temp);
            temp.select();
            document.execCommand('copy');
            document.body.removeChild(temp);
            showToast('Email address copied to clipboard!');
        }
    }

    if (heroBtn) heroBtn.addEventListener('click', copyToClipboard);
    if (contactBtn) contactBtn.addEventListener('click', copyToClipboard);
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // Clear existing toast if any
    container.innerHTML = '';

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i><span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

/**
 * 6. CONTACT FORM HANDLING
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('user-name').value.trim();
        const email = document.getElementById('user-email').value.trim();
        const subject = document.getElementById('user-subject').value.trim();
        const message = document.getElementById('user-message').value.trim();

        if (!name || !email || !message) {
            showToast('Please fill in your name, email, and message.');
            return;
        }

        const submitBtn = document.getElementById('form-submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Preparing...</span> <i class="fas fa-spinner fa-spin"></i>';

        setTimeout(() => {
            const mailtoSubject = encodeURIComponent(subject || `Message from ${name}`);
            const mailtoBody = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            window.location.href = `mailto:iarman529@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

            showToast('Thank you! Opening your email client...');
            form.reset();

            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
        }, 800);
    });
}

/**
 * 7. BACK TO TOP BUTTON
 */
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }, { passive: true });

    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
