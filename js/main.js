// Constants
const REFERRAL_STORAGE_KEY = 'oria_referral_code';

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
            )
            .fromTo('.scroll-indicator',
                { opacity: 0 },
                { opacity: 0.5, duration: 1, ease: 'power2.out' },
                "-=0.2"
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
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            if (navLinks.style.display === 'flex') {
                navLinks.style.display = 'none';
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
            }
        });
    }
}

// Waitlist form submission with Firebase
function initializeWaitlistForm() {
    const form = document.getElementById('waitlist-form');
    const emailInput = document.getElementById('waitlist-email');
    const submitButton = document.getElementById('waitlist-submit');
    const messageDiv = document.getElementById('waitlist-message');

    if (!form || !emailInput || !submitButton || !messageDiv) {
        console.error('Waitlist form elements not found');
        return;
    }

    // Wait for Firebase to be ready
    function waitForFirebase() {
        return new Promise((resolve, reject) => {
            if (window.firestoreDb) {
                resolve(window.firestoreDb);
                return;
            }

            let attempts = 0;
            const maxAttempts = 50;
            const checkInterval = setInterval(() => {
                attempts++;
                if (window.firestoreDb) {
                    clearInterval(checkInterval);
                    resolve(window.firestoreDb);
                } else if (attempts >= maxAttempts) {
                    clearInterval(checkInterval);
                    reject(new Error('Firebase initialization timeout. Please check your configuration.'));
                }
            }, 100);
        });
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
            await waitForFirebase();
            const { collection, addDoc, serverTimestamp, query, where, getDocs } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

            const waitlistRef = collection(window.firestoreDb, 'waitlist');
            const q = query(waitlistRef, where('email', '==', email));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                showWaitlistMessage('You are already on the waitlist.', 'success');
                emailInput.value = '';
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonHTML;
                return false;
            }

            const referralCode = getReferralCodeForAttribution();
            await addDoc(waitlistRef, {
                email: email,
                createdAt: serverTimestamp(),
                source: 'website',
                referralCode: referralCode || null
            });

            showWaitlistMessage('Access requested over secure channel.', 'success');
            emailInput.value = '';

        } catch (error) {
            console.error('Error adding to waitlist:', error);
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
    
    // Initialize waitlist
    setTimeout(() => {
        initializeWaitlistForm();
    }, 100);
});