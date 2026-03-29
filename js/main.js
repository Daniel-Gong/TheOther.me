// Constants
const REFERRAL_STORAGE_KEY = 'oria_referral_code';
const ORIA_RUNTIME = window.__ORIA_RUNTIME__ || {};
const FUNCTIONS_BASE_URL = ORIA_RUNTIME.functionsBaseUrl || "";

if (!FUNCTIONS_BASE_URL) {
    throw new Error("[waitlist] Missing runtime functionsBaseUrl config.");
}

function sanitizeReferralCode(rawCode) {
    if (!rawCode) return null;
    const normalized = String(rawCode).trim().toUpperCase();
    const safe = normalized.replace(/[^A-Z0-9]/g, '');
    if (safe.length < 4 || safe.length > 16) return null;
    return safe;
}

function getReferralCodeForAttribution() {
    const queryCode = sanitizeReferralCode(new URLSearchParams(window.location.search).get('ref'));
    if (queryCode) return queryCode;

    const pathMatch = window.location.pathname.match(/^\/invite\/([^/?#]+)/i);
    const pathCode = sanitizeReferralCode(pathMatch ? pathMatch[1] : null);
    if (pathCode) return pathCode;

    return sanitizeReferralCode(localStorage.getItem(REFERRAL_STORAGE_KEY));
}

function getAttributionPayload() {
    const params = new URLSearchParams(window.location.search);
    const utm = {
        source: params.get("utm_source") || null,
        medium: params.get("utm_medium") || null,
        campaign: params.get("utm_campaign") || null,
        term: params.get("utm_term") || null,
        content: params.get("utm_content") || null,
    };

    return {
        source: utm.source || "website",
        medium: utm.medium || "organic",
        campaign: utm.campaign || null,
        term: utm.term,
        content: utm.content,
        channel: "web",
        landingPath: window.location.pathname,
        landingUrl: window.location.href,
        referrer: document.referrer || null,
    };
}

async function getAppCheckHeader() {
    if (!window.oriaFirebase || typeof window.oriaFirebase.getAppCheckToken !== "function") {
        return {};
    }
    const token = await window.oriaFirebase.getAppCheckToken();
    if (!token) return {};
    return { "X-Firebase-AppCheck": token };
}

// GSAP Animations (Soft Precision)
function initializeAnimations() {
    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Initial Hero Reveal
        const tl = gsap.timeline();
        
        if (document.querySelector('.hero-title')) {
            tl.fromTo('.hero-title .line-1', 
                { y: 40, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.2 }
            )
            .fromTo('.hero-title .line-2', 
                { y: 40, opacity: 0 }, 
                { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out' }, 
                "-=0.9"
            )
            .fromTo('.hero-subtitle',
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 1, ease: 'power2.out' },
                "-=0.6"
            )
            .fromTo('.hero-actions',
                { opacity: 0 },
                { opacity: 1, duration: 1, ease: 'power2.out' },
                "-=0.4"
            );
        }

        // Subtle parallax for gradient orbs
        gsap.utils.toArray('.gradient-orb').forEach((orb, i) => {
            gsap.to(orb, {
                y: "30%",
                ease: "none",
                scrollTrigger: {
                    trigger: "body",
                    start: "top top",
                    end: "bottom bottom",
                    scrub: 1.5
                }
            });
        });

        // Scroll Reveal Elements
        const revealElements = [
            '.vision-container .section-title',
            '.vision-content p',
            '.ecosystem-container .section-title',
            '.ecosystem-container .section-subtitle',
            '.app-category',
            '.journey-step',
            '.editorial-card',
            '.resolution-title',
            '.resolution-desc',
            '.minimal-form'
        ];

        revealElements.forEach(selector => {
            gsap.utils.toArray(selector).forEach(el => {
                gsap.fromTo(el, 
                    { y: 50, opacity: 0 },
                    {
                        y: 0, 
                        opacity: 1, 
                        duration: 1, 
                        ease: 'power3.out',
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                            toggleActions: "play none none none"
                        }
                    }
                );
            });
        });
    }

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = mobileToggle?.querySelector('i');
    
    if (mobileToggle && menuIcon) {
        mobileToggle.addEventListener('click', () => {
            const isOpen = navLinks.style.display === 'flex';
            if (isOpen) {
                navLinks.style.display = 'none';
                menuIcon.classList.remove('fa-times');
                menuIcon.classList.add('fa-bars');
            } else {
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '100%';
                navLinks.style.left = '0';
                navLinks.style.width = '100%';
                navLinks.style.background = 'var(--bg-canvas)';
                navLinks.style.padding = '2rem';
                navLinks.style.borderBottom = '1px solid rgba(17,17,17,0.05)';
                menuIcon.classList.remove('fa-bars');
                menuIcon.classList.add('fa-times');
            }
        });
    }
}

// Newsletter signup form (Firebase)
function initializeWaitlistForm() {
    const form = document.getElementById('waitlist-form');
    const emailInput = document.getElementById('waitlist-email');
    const submitButton = document.getElementById('waitlist-submit');
    const messageDiv = document.getElementById('waitlist-message');

    if (!form || !emailInput || !submitButton || !messageDiv) {
        console.error('Newsletter form elements not found');
        return;
    }

    async function handleSubmit(e) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        const email = emailInput.value.trim().toLowerCase();

        if (!email) {
            showWaitlistMessage('Please enter a valid email address', 'error');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showWaitlistMessage('Please enter a valid email address', 'error');
            return false;
        }

        submitButton.disabled = true;
        const originalButtonHTML = submitButton.innerHTML;
        submitButton.innerHTML = '<span>Processing...</span>';
        messageDiv.textContent = '';

        try {
            const referralCode = getReferralCodeForAttribution();
            const attribution = getAttributionPayload();
            const appCheckHeader = await getAppCheckHeader();
            const response = await fetch(`${FUNCTIONS_BASE_URL}/publicJoinWaitlist`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...appCheckHeader,
                },
                body: JSON.stringify({
                    email,
                    referralCode: referralCode || null,
                    attribution,
                }),
            });

            const data = await response.json().catch(() => ({}));
            if (!response.ok || !data.success) {
                throw new Error(data.error || "Failed to submit waitlist");
            }

            if (typeof window.gtag === "function") {
                window.gtag("event", "waitlist_joined_web", {
                    status: data.alreadyOnList ? "already_on_list" : "new",
                    source: attribution.source || "website",
                    medium: attribution.medium || "organic",
                    campaign: attribution.campaign || "none",
                });
            }

            showWaitlistMessage("Thanks! You're signed up. Watch your inbox for updates and offers.", 'success');
            emailInput.value = '';

        } catch (error) {
            console.error('Error submitting newsletter signup:', error);
            showWaitlistMessage('A connection error occurred. Please try again.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonHTML;
        }

        return false;
    }

    form.addEventListener('submit', handleSubmit);
    submitButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleSubmit(e);
    });
}

function showWaitlistMessage(message, type) {
    const messageDiv = document.getElementById('waitlist-message');
    if (!messageDiv) return;

    messageDiv.textContent = message;
    messageDiv.className = `waitlist-message ${type}`;

    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                messageDiv.textContent = '';
                messageDiv.className = 'waitlist-message';
                messageDiv.style.opacity = '1';
            }, 300);
        }, 5000);
    }
}

// Initialize features
document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    
    // Initialize newsletter signup
    setTimeout(() => {
        initializeWaitlistForm();
    }, 100);
});