/**
 * MUHAMMAD IBRAHIM - PORTFOLIO INTERACTION ENGINE
 * Features: Typewriter, Smooth Scroll Spy, GitHub API Integration, Copy Toast, Form UX
 */

document.addEventListener('DOMContentLoaded', () => {
    initTypewriter();
    initNavbarScroll();
    initMobileNav();
    initCursorSpotlight();
    initScrollReveal();
    initEmailCopy();
    initProjectFilters();
    initContactForm();
    initBackToTop();
    fetchGitHubRepos('Trueib2');
});

/**
 * 1. DYNAMIC TYPEWRITER EFFECT
 */
function initTypewriter() {
    const typewriterElement = document.getElementById('typewriter');
    if (!typewriterElement) return;

    const phrases = [
        'QA Automation Strategist',
        'Lead Quality Architect @ Contour',
        'Full-Stack Software Developer',
        'Multi-Platform Framework Architect',
        'BS Computer Science Student @ GU TECH'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 45;
        } else {
            typewriterElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 85;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2200; // Pause at full phrase
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 400; // Pause before new word
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/**
 * 2. NAVBAR SCROLL STYLING & ACTIVE LINK SPY
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar-wrapper');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        // Navbar blur backdrop toggle
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active section spy
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 120;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

/**
 * 3. MOBILE MENU TOGGLE
 */
function initMobileNav() {
    const toggle = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        toggle.classList.toggle('active');
    });

    // Close on link click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            toggle.classList.remove('active');
        });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !toggle.contains(e.target) && navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
            toggle.classList.remove('active');
        }
    });
}

/**
 * 4. MOUSE CURSOR SPOTLIGHT TRACKING
 */
function initCursorSpotlight() {
    const spotlight = document.getElementById('cursor-spotlight');
    if (!spotlight || window.innerWidth < 1024) return;

    window.addEventListener('mousemove', (e) => {
        spotlight.style.left = e.clientX + 'px';
        spotlight.style.top = e.clientY + 'px';
    });
}

/**
 * 5. SCROLL REVEAL OBSERVER
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        reveals.forEach(el => observer.observe(el));
    } else {
        // Fallback for older browsers
        reveals.forEach(el => el.classList.add('active'));
    }
}

/**
 * 6. EMAIL COPY & TOAST NOTIFICATION
 */
function initEmailCopy() {
    const emailToCopy = 'iarman529@gmail.com';
    const heroCopyBtn = document.getElementById('copy-email-btn');
    const contactCopyBtn = document.getElementById('copy-email-contact-btn');

    function copyEmail() {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(emailToCopy).then(() => {
                showToast('Email address copied to clipboard!');
            }).catch(() => {
                showToast('Email: ' + emailToCopy);
            });
        } else {
            // Fallback for older browsers
            const tempInput = document.createElement('input');
            tempInput.value = emailToCopy;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            showToast('Email address copied to clipboard!');
        }
    }

    if (heroCopyBtn) heroCopyBtn.addEventListener('click', copyEmail);
    if (contactCopyBtn) contactCopyBtn.addEventListener('click', copyEmail);
}

function showToast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

/**
 * 7. PROJECT FILTERING LOGIC
 */
function initProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const githubSection = document.getElementById('github-repos-section');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            if (filterValue === 'github') {
                projectCards.forEach(card => card.style.display = 'none');
                if (githubSection) githubSection.style.display = 'block';
            } else {
                if (githubSection) githubSection.style.display = 'block';
                projectCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }
        });
    });
}

/**
 * 8. LIVE GITHUB REPOSITORIES FETCHER
 */
async function fetchGitHubRepos(username) {
    const reposList = document.getElementById('github-repos-list');
    if (!reposList) return;

    // Repositories fallback in case of rate limit or connection issue
    const fallbackRepos = [
        {
            name: 'QA-Automation-Framework',
            description: 'Comprehensive test automation framework for Web and REST API testing with CI/CD integration.',
            language: 'Python',
            html_url: 'https://github.com/' + username,
            stargazers_count: 5,
            forks_count: 2
        },
        {
            name: 'Portfolio-Website',
            description: 'Modern glassmorphic developer portfolio built with HTML5, CSS3, and dynamic GitHub integration.',
            language: 'JavaScript',
            html_url: 'https://github.com/' + username,
            stargazers_count: 4,
            forks_count: 1
        },
        {
            name: 'Inventory-Management-System',
            description: 'Transactional desktop application built with C# and SQL Server for enterprise resource control.',
            language: 'C#',
            html_url: 'https://github.com/' + username,
            stargazers_count: 3,
            forks_count: 0
        },
        {
            name: 'Data-Validation-Engine',
            description: 'High-throughput data anomaly detection algorithm and report generation tool.',
            language: 'Python',
            html_url: 'https://github.com/' + username,
            stargazers_count: 2,
            forks_count: 0
        }
    ];

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        
        if (!response.ok) {
            throw new Error('GitHub API response not OK');
        }

        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
            renderRepos(data.slice(0, 6));
        } else {
            renderRepos(fallbackRepos);
        }
    } catch (err) {
        console.warn('GitHub API fetch failed or rate-limited. Rendering curated fallback repositories:', err);
        renderRepos(fallbackRepos);
    }

    function renderRepos(repos) {
        reposList.innerHTML = '';
        repos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'repo-card';
            card.innerHTML = `
                <div>
                    <div class="repo-top">
                        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-name">
                            ${repo.name.replace(/[-_]/g, ' ')}
                        </a>
                        <i class="fa-brands fa-github text-muted"></i>
                    </div>
                    <p class="repo-desc">${repo.description || 'Public repository showcasing software engineering & automation solutions.'}</p>
                </div>
                <div class="repo-meta">
                    <span class="repo-lang">
                        <span class="lang-dot"></span>
                        <span>${repo.language || 'Code'}</span>
                    </span>
                    <span>
                        <i class="fas fa-star text-muted"></i> ${repo.stargazers_count || 0}
                    </span>
                </div>
            `;
            reposList.appendChild(card);
        });
    }
}

/**
 * 9. CONTACT FORM INTERACTION
 */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('form-name').value.trim();
        const email = document.getElementById('form-email').value.trim();
        const message = document.getElementById('form-message').value.trim();

        if (!name || !email || !message) {
            showToast('Please fill in all required fields.');
            return;
        }

        const submitBtn = document.getElementById('form-submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Sending...</span>';

        // Simulate successful submission & prompt mailto client
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-check"></i> <span>Message Prepared!</span>';
            showToast('Thank you ' + name + '! Preparing your email client...');

            // Open direct mail client
            const subject = encodeURIComponent(document.getElementById('form-subject').value || 'Portfolio Contact from ' + name);
            const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            window.location.href = `mailto:iarman529@gmail.com?subject=${subject}&body=${body}`;

            form.reset();
            setTimeout(() => {
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> <span>Send Message</span>';
            }, 3000);
        }, 1000);
    });
}

/**
 * 10. BACK TO TOP BUTTON
 */
function initBackToTop() {
    const backBtn = document.getElementById('back-to-top');
    if (!backBtn) return;

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backBtn.classList.add('visible');
        } else {
            backBtn.classList.remove('visible');
        }
    });

    backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
