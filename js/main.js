// Typing animation
const typingText = document.getElementById('typingText');
const text = "Know yourself. Predict your future.";
let charIndex = 0;

// Screen width threshold for mobile
const MOBILE_WIDTH_THRESHOLD = 768;

function typeText() {
    if (charIndex < text.length) {
        typingText.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeText, 100);
    }
}

// Start typing animation when page loads
window.addEventListener('load', () => {
    typingText.textContent = '';
    typeText();
    initializeAvatarParticles();
    initializeParticleSystem();
    initializeDataFlow();
    if (window.innerWidth > MOBILE_WIDTH_THRESHOLD) {
        initializeDNAHelix();
    } else {
        initializeMobileFeatures();
    }
    resetIdleState();
    initializeLuxuryFeatures();
});

// Particle system
function initializeParticleSystem() {
    const container = document.querySelector('.particle-system');
    if (!container) return;

    for (let i = 0; i < 50; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random size
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random color between primary and accent
    const color = Math.random() > 0.5 ? '#2563EB' : '#10B981';
    particle.style.background = color;
    
    // Random animation duration
    particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
    
    container.appendChild(particle);
    
    // Remove and recreate particle after animation
    setTimeout(() => {
        particle.remove();
        createParticle(container);
    }, 5000);
}

// Data flow visualization
function initializeDataFlow() {
    const container = document.querySelector('.data-flow');
    if (!container) return;

    // Create flowing lines
    for (let i = 0; i < 5; i++) {
        createFlowLine(container, i);
    }
}

function createFlowLine(container, index) {
    const line = document.createElement('div');
    line.className = 'flow-line';
    
    // Random position and angle
    line.style.top = (index * 20 + Math.random() * 10) + '%';
    line.style.transform = `rotate(${Math.random() * 10 - 5}deg)`;
    
    // Random animation delay
    line.style.animationDelay = (index * 0.5) + 's';
    
    container.appendChild(line);
}

// Parallax effect with inertia
let currentX = 0;
let currentY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 20;
    targetY = (e.clientY / window.innerHeight - 0.5) * 20;
});

function updateParallax() {
    // Smooth interpolation with inertia
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;
    
    const particles = document.querySelector('.particles');
    const silhouette = document.querySelector('.human-silhouette');
    
    if (particles && silhouette) {
        particles.style.transform = `translate(${currentX}px, ${currentY}px)`;
        silhouette.style.transform = `translate(-50%, -50%) rotateY(${currentX * 0.5}deg) rotateX(${-currentY * 0.5}deg)`;
    }
    
    requestAnimationFrame(updateParallax);
}

updateParallax();

// Staggered animations for features
const features = [
    {
        icon: 'brain',
        title: 'Behavior Prediction',
        description: 'AI-powered analysis of your patterns to predict future actions'
    },
    {
        icon: 'light-bulb',
        title: 'Smart Insights',
        description: 'Get personalized recommendations based on your behavior'
    },
    {
        icon: 'shield-check',
        title: 'Privacy First',
        description: 'Your data is encrypted and never shared with third parties'
    }
];

// Render features with staggered animations
const featuresGrid = document.querySelector('.features-grid');
features.forEach((feature, index) => {
    const featureCard = document.createElement('div');
    featureCard.className = 'feature-card glass';
    featureCard.style.animationDelay = (index * 0.1) + 's';
    
    featureCard.innerHTML = `
        <svg class="icon icon-${feature.icon}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            ${getIconPath(feature.icon)}
        </svg>
        <h3>${feature.title}</h3>
        <p>${feature.description}</p>
    `;
    
    featuresGrid.appendChild(featureCard);
});

// Icon paths
function getIconPath(icon) {
    const paths = {
        brain: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>',
        'light-bulb': '<path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm0 14h-2v-1h2v1zm0-2h-2v-1h2v1zm0-2h-2v-1h2v1zm0-2h-2V8h2v1z"/>',
        'shield-check': '<path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>'
    };
    return paths[icon] || '';
}

// Testimonials with glassmorphism
const testimonials = [
    {
        text: "TheOther.me has completely changed how I understand my daily habits and patterns.",
        author: "Sarah Johnson",
        title: "Product Manager",
        avatar: "assets/avatar1.jpg"
    },
    {
        text: "I've never seen such accurate predictions about my behavior. It's like having a personal AI coach.",
        author: "Michael Chen",
        title: "Software Engineer",
        avatar: "assets/avatar2.jpg"
    },
    {
        text: "The insights I've gained have helped me make better decisions in both my personal and professional life.",
        author: "Emma Davis",
        title: "Marketing Director",
        avatar: "assets/avatar3.jpg"
    }
];

// Testimonial carousel with glassmorphism
let currentTestimonial = 0;
const testimonialCarousel = document.querySelector('.testimonial-carousel');

function renderTestimonial(index) {
    const testimonial = testimonials[index];
    testimonialCarousel.innerHTML = `
        <div class="testimonial glass">
            <div class="testimonial-avatar"></div>
            <p class="testimonial-text">${testimonial.text}</p>
            <div class="testimonial-author">
                <strong>${testimonial.author}</strong>
                <span>${testimonial.title}</span>
            </div>
        </div>
        <div class="testimonial-dots">
            ${testimonials.map((_, i) => `
                <button class="dot ${i === index ? 'active' : ''}" onclick="showTestimonial(${i})"></button>
            `).join('')}
        </div>
    `;
}

function showTestimonial(index) {
    currentTestimonial = index;
    renderTestimonial(index);
}

// Auto-rotate testimonials with smooth transitions
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}, 5000);

// Initialize first testimonial
renderTestimonial(0);

// Waitlist form with glassmorphism
const waitlistForm = document.getElementById('waitlistForm');
const emailInput = document.getElementById('email');

waitlistForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    if (!email) return;

    try {
        // Here you would typically send the email to your backend
        // For now, we'll just show a success message
        const button = waitlistForm.querySelector('button');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Joining...';
        button.disabled = true;

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>Thanks for joining! We'll keep you updated.</p>
        `;
        
        waitlistForm.innerHTML = '';
        waitlistForm.appendChild(successMessage);

        // Animate success message
        gsap.from(successMessage, {
            duration: 0.5,
            scale: 0.8,
            opacity: 0,
            ease: 'back.out(1.7)'
        });

    } catch (error) {
        console.error('Error:', error);
        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = 'Something went wrong. Please try again.';
        waitlistForm.appendChild(errorMessage);
    }
});

// Toast notification with glassmorphism
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast glass';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Add wave dividers between sections
function addWaveDividers() {
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        if (index < sections.length - 1) {
            const divider = document.createElement('div');
            divider.className = 'wave-divider';
            divider.innerHTML = `
                <svg viewBox="0 0 1440 100" preserveAspectRatio="none">
                    <path class="wave-path" d="M0,50 C150,100 350,0 500,50 C650,100 850,0 1000,50 C1150,100 1350,0 1440,50 L1440,100 L0,100 Z"></path>
                </svg>
            `;
            section.appendChild(divider);
        }
    });
}

// Initialize wave dividers
addWaveDividers();

// DNA Helix Visualization
function initializeDNAHelix() {
    const orbs = document.querySelectorAll('.feature-orb');
    const descriptions = document.querySelectorAll('.feature-description');
    const helixPaths = document.querySelectorAll('.helix-path');
    
    // Initialize GSAP animations
    gsap.set(helixPaths, {
        strokeDasharray: 1000,
        strokeDashoffset: 1000
    });
    
    gsap.to(helixPaths, {
        strokeDashoffset: 0,
        duration: 20,
        ease: "none",
        repeat: -1
    });
    
    // Orb hover animations
    orbs.forEach((orb, index) => {
        const description = descriptions[index];
        
        orb.addEventListener('mouseenter', () => {
            // Animate orb
            gsap.to(orb.querySelector('.orb-circle'), {
                scale: 1.2,
                duration: 0.3,
                ease: "power2.out"
            });
            
            // Show description
            gsap.to(description, {
                opacity: 1,
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
            
            // Animate connected paths
            const connectedPaths = Array.from(helixPaths).filter(path => {
                const pathElement = path.getBoundingClientRect();
                const orbElement = orb.getBoundingClientRect();
                return (
                    pathElement.left <= orbElement.right &&
                    pathElement.right >= orbElement.left
                );
            });
            
            gsap.to(connectedPaths, {
                stroke: "#2563EB",
                filter: "drop-shadow(0 0 10px rgba(37, 99, 235, 0.2))",
                duration: 0.3,
                ease: "power2.out"
            });
        });
        
        orb.addEventListener('mouseleave', () => {
            // Reset orb
            gsap.to(orb.querySelector('.orb-circle'), {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
            });
            
            // Hide description
            gsap.to(description, {
                opacity: 0,
                scale: 0.9,
                duration: 0.3,
                ease: "power2.out"
            });
            
            // Reset paths
            gsap.to(helixPaths, {
                stroke: "rgba(255, 255, 255, 0.2)",
                filter: "none",
                duration: 0.3,
                ease: "power2.out"
            });
        });
    });
    
    // Initialize feature animations
    initializeFeatureAnimations();
}

function initializeFeatureAnimations() {
    // DNA Animation
    const dnaAnimation = document.querySelector('.dna-animation');
    if (dnaAnimation) {
        gsap.to(dnaAnimation, {
            backgroundPosition: "-200% 0",
            duration: 3,
            ease: "power2.inOut",
            repeat: -1
        });
    }
    
    // Hourglass Animation
    const hourglassAnimation = document.querySelector('.hourglass-animation');
    if (hourglassAnimation) {
        gsap.to(hourglassAnimation, {
            scaleY: 0.5,
            duration: 1.5,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1
        });
    }
    
    // Fractal Animation
    const fractalAnimation = document.querySelector('.fractal-animation');
    if (fractalAnimation) {
        gsap.to(fractalAnimation, {
            scale: 1.2,
            opacity: 0.8,
            duration: 1.5,
            ease: "power2.inOut",
            yoyo: true,
            repeat: -1
        });
    }
}

// Mobile Navigation
function initializeMobileNav() {
    if (window.innerWidth > MOBILE_WIDTH_THRESHOLD) return;
    
    const nav = document.createElement('nav');
    nav.className = 'mobile-nav';
    
    const navItems = [
        { icon: 'home', label: 'Home', href: '#hero' },
        { icon: 'features', label: 'Features', href: '#features' },
        { icon: 'demo', label: 'Demo', href: '#demo' },
        { icon: 'waitlist', label: 'Join', href: '#waitlist' }
    ];
    
    navItems.forEach(item => {
        const link = document.createElement('a');
        link.href = item.href;
        link.className = 'nav-item touch-target';
        link.innerHTML = `
            <svg class="nav-icon" viewBox="0 0 24 24">
                ${getNavIcon(item.icon)}
            </svg>
            <span class="nav-label">${item.label}</span>
        `;
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(item.href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                // Haptic feedback
                if (navigator.vibrate) {
                    navigator.vibrate(50);
                }
            }
        });
        
        nav.appendChild(link);
    });
    
    document.body.appendChild(nav);
}

// Navigation icons
function getNavIcon(icon) {
    const icons = {
        home: '<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" fill="none" stroke-width="2"/>',
        features: '<path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" fill="none" stroke-width="2"/>',
        demo: '<path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" stroke="currentColor" fill="none" stroke-width="2"/>',
        waitlist: '<path d="M12 4v16m8-8H4" stroke="currentColor" fill="none" stroke-width="2"/>'
    };
    return icons[icon] || '';
}

// Pull to refresh
function initializePullToRefresh() {
    if (window.innerWidth > 768) return;
    
    const pullToRefresh = document.createElement('div');
    pullToRefresh.className = 'pull-to-refresh';
    pullToRefresh.innerHTML = '<div class="pull-to-refresh-icon"></div>';
    document.body.insertBefore(pullToRefresh, document.body.firstChild);
    
    let startY = 0;
    let currentY = 0;
    let isPulling = false;
    
    document.addEventListener('touchstart', (e) => {
        if (window.scrollY === 0) {
            startY = e.touches[0].clientY;
            isPulling = true;
        }
    });
    
    document.addEventListener('touchmove', (e) => {
        if (!isPulling) return;
        
        currentY = e.touches[0].clientY;
        const pull = currentY - startY;
        
        if (pull > 0) {
            e.preventDefault();
            pullToRefresh.style.transform = `translateY(${Math.min(pull * 0.5, 60)}px)`;
            
            if (pull > 100) {
                pullToRefresh.classList.add('active');
            }
        }
    });
    
    document.addEventListener('touchend', () => {
        if (!isPulling) return;
        
        isPulling = false;
        pullToRefresh.style.transform = '';
        
        if (currentY - startY > 100) {
            // Trigger refresh
            if (navigator.vibrate) {
                navigator.vibrate([50, 50, 50]);
            }
            location.reload();
        }
    });
}

// Touch carousel
function initializeTouchCarousel() {
    if (window.innerWidth > 768) return;
    
    const carousel = document.querySelector('.testimonial-carousel');
    if (!carousel) return;
    
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });
    
    carousel.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        currentX = e.touches[0].clientX;
        const diff = currentX - startX;
        
        carousel.style.transform = `translateX(${diff}px)`;
    });
    
    carousel.addEventListener('touchend', () => {
        if (!isDragging) return;
        
        isDragging = false;
        const diff = currentX - startX;
        
        if (Math.abs(diff) > 100) {
            // Change testimonial
            if (diff > 0) {
                showTestimonial((currentTestimonial - 1 + testimonials.length) % testimonials.length);
            } else {
                showTestimonial((currentTestimonial + 1) % testimonials.length);
            }
            
            // Haptic feedback
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }
        
        carousel.style.transform = '';
    });
}

// Initialize mobile features
function initializeMobileFeatures() {
    initializeMobileNav();
    initializePullToRefresh();
    initializeTouchCarousel();
}

// Performance optimization
let isIdle = true;
let idleTimeout;

function resetIdleState() {
    isIdle = true;
    clearTimeout(idleTimeout);
    idleTimeout = setTimeout(() => {
        if (isIdle) {
            // Pause heavy animations when idle
            gsap.globalTimeline.pause();
        }
    }, 5000);
}

document.addEventListener('mousemove', () => {
    if (isIdle) {
        isIdle = false;
        gsap.globalTimeline.play();
    }
    resetIdleState();
});

// Handle resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        initializeDNAHelix();
    } else {
        initializeMobileFeatures();
    }
});

// Custom cursor with trailing particles
function initializeCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);
    
    const trails = [];
    const trailCount = 5;
    
    for (let i = 0; i < trailCount; i++) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        document.body.appendChild(trail);
        trails.push({
            element: trail,
            x: 0,
            y: 0
        });
    }
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    let cursorAnimationFrame;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function updateCursor() {
        // Smooth cursor movement
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
        
        // Update trails
        trails.forEach((trail, index) => {
            const delay = index * 2;
            const trailX = cursorX - (mouseX - cursorX) * (delay / 100);
            const trailY = cursorY - (mouseY - cursorY) * (delay / 100);
            
            trail.style.transform = `translate(${trailX}px, ${trailY}px)`;
            trail.style.opacity = 1 - (index / trailCount);
        });
        
        cursorAnimationFrame = requestAnimationFrame(updateCursor);
    }
    
    function cancelCursorAnimation() {
        if (cursorAnimationFrame) {
            cancelAnimationFrame(cursorAnimationFrame);
        }
    }
    
    updateCursor();
}

// Status bar
function initializeStatusBar() {
    const statusBar = document.createElement('div');
    statusBar.className = 'status-bar';
    
    const statusContent = document.createElement('div');
    statusContent.innerHTML = `
        <span class="status-indicator"></span>
        <span class="status-text">System nominal</span>
    `;
    
    const timestamp = document.createElement('div');
    timestamp.className = 'status-timestamp';
    
    function updateTimestamp() {
        const now = new Date();
        timestamp.textContent = now.toLocaleTimeString();
    }
    
    updateTimestamp();
    setInterval(updateTimestamp, 1000);
    
    statusBar.appendChild(statusContent);
    statusBar.appendChild(timestamp);
    document.body.appendChild(statusBar);
}

// Initialize luxury features
function initializeLuxuryFeatures() {
    initializeCustomCursor();
    initializeStatusBar();
}

function initializeAvatarParticles() {
    const container = document.querySelector('.avatar-particles');
    if (!container) return;
    container.innerHTML = '';
    const particleCount = 90;
    const centerX = 50; // SVG coordinate system
    const centerY = 90;
    const headRadius = 22;
    const bodyRadiusX = 30;
    const bodyRadiusY = 55;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        let x, y;
        if (i < 30) { // Head
            const angle = (i / 30) * Math.PI * 2;
            x = centerX + Math.cos(angle) * headRadius + (Math.random() - 0.5) * 2;
            y = centerY + Math.sin(angle) * headRadius - 30 + (Math.random() - 0.5) * 2;
        } else { // Body/shoulders
            const t = (i - 30) / 60;
            const angle = Math.PI * (0.15 + 0.7 * t); // arc for shoulders/body
            x = centerX + Math.cos(angle) * bodyRadiusX + (Math.random() - 0.5) * 3;
            y = centerY + 30 + Math.sin(angle) * bodyRadiusY + (Math.random() - 0.5) * 3;
        }
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.opacity = 0.7 + Math.random() * 0.3;
        particle.style.width = particle.style.height = (Math.random() * 3 + 2) + 'px';
        // Animate scale/opacity for subtle movement
        particle.animate([
            { transform: 'scale(1)', opacity: particle.style.opacity },
            { transform: 'scale(1.2)', opacity: 1 },
            { transform: 'scale(1)', opacity: particle.style.opacity }
        ], {
            duration: 2200 + Math.random() * 1200,
            iterations: Infinity,
            direction: 'alternate',
            easing: 'ease-in-out',
            delay: Math.random() * 1000
        });
        container.appendChild(particle);
    }
}

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Mobile menu toggle
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            navLinks.classList.remove('active');
        }
    });
});

// Hero section animations
gsap.from('.hero-text', {
    duration: 1,
    y: 50,
    opacity: 0,
    ease: 'power3.out'
});

gsap.from('.hero-visual', {
    duration: 1,
    x: 50,
    opacity: 0,
    delay: 0.3,
    ease: 'power3.out'
});

// Features section animations
gsap.utils.toArray('.feature-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        delay: i * 0.2,
        ease: 'power3.out'
    });
});

// How it works section animations
gsap.utils.toArray('.step').forEach((step, i) => {
    gsap.from(step, {
        scrollTrigger: {
            trigger: step,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        y: 30,
        opacity: 0,
        delay: i * 0.2,
        ease: 'power3.out'
    });
});

// Testimonials section animations
gsap.utils.toArray('.testimonial-card').forEach((card, i) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top bottom-=100',
            toggleActions: 'play none none reverse'
        },
        duration: 0.8,
        y: 30,
        opacity: 0,
        delay: i * 0.2,
        ease: 'power3.out'
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        // Scroll down
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        // Scroll up
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// AI Avatar animation
const avatarContainer = document.querySelector('.avatar-container');
if (avatarContainer) {
    // Create particles
    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        avatarContainer.appendChild(particle);
        
        // Random position and animation
        gsap.set(particle, {
            x: gsap.utils.random(-50, 50),
            y: gsap.utils.random(-50, 50),
            scale: gsap.utils.random(0.5, 1.5)
        });
        
        gsap.to(particle, {
            duration: gsap.utils.random(2, 4),
            x: gsap.utils.random(-50, 50),
            y: gsap.utils.random(-50, 50),
            scale: gsap.utils.random(0.5, 1.5),
            opacity: gsap.utils.random(0.3, 0.7),
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
    }
}

// Data stream animation
const dataStream = document.querySelector('.data-stream');
if (dataStream) {
    // Create data points
    for (let i = 0; i < 10; i++) {
        const point = document.createElement('div');
        point.className = 'data-point';
        dataStream.appendChild(point);
        
        // Animate data points
        gsap.to(point, {
            duration: gsap.utils.random(1, 3),
            y: -100,
            opacity: 0,
            repeat: -1,
            delay: i * 0.2,
            ease: 'power1.inOut'
        });
    }
}

// Add CSS classes for animations
document.addEventListener('DOMContentLoaded', () => {
    // Add animation classes to elements
    document.querySelectorAll('.feature-card, .step, .testimonial-card').forEach(el => {
        el.classList.add('animate-on-scroll');
    });
});

// === Particle Swarm Avatar Silhouette ===
function createAvatarSilhouettePoints(width, height) {
    // Returns an array of points (x, y) forming a simple human silhouette
    // Head (circle), body (ellipse), arms (lines), legs (lines)
    const points = [];
    const cx = width / 2;
    const cy = height / 2 + 20;
    // Head
    const headRadius = 38;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 24) {
        points.push({
            x: cx + Math.cos(a) * headRadius,
            y: cy - 90 + Math.sin(a) * headRadius
        });
    }
    // Body (ellipse)
    for (let a = Math.PI * 0.9; a < Math.PI * 2.1; a += Math.PI / 32) {
        points.push({
            x: cx + Math.cos(a) * 30,
            y: cy - 50 + Math.sin(a) * 60
        });
    }
    // Arms (lines)
    for (let t = 0; t <= 1; t += 0.05) {
        // Left arm
        points.push({
            x: cx - 30 - t * 60,
            y: cy - 50 + t * 40
        });
        // Right arm
        points.push({
            x: cx + 30 + t * 60,
            y: cy - 50 + t * 40
        });
    }
    // Legs (lines)
    for (let t = 0; t <= 1; t += 0.05) {
        // Left leg
        points.push({
            x: cx - 15 - t * 20,
            y: cy + 10 + t * 80
        });
        // Right leg
        points.push({
            x: cx + 15 + t * 20,
            y: cy + 10 + t * 80
        });
    }
    return points;
}

function startAvatarParticleSwarm() {
    console.log('Swarm running');
    const canvas = document.getElementById('avatar-particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width;
    let height = canvas.height;

    // Responsive resize
    function resizeCanvas() {
        const parent = canvas.parentElement;
        width = parent.offsetWidth;
        height = parent.offsetHeight;
        canvas.width = width;
        canvas.height = height;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Silhouette points
    let silhouette = createAvatarSilhouettePoints(width, height);

    // Particle swarm
    const PARTICLE_COUNT = 120;
    const particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const target = silhouette[i % silhouette.length];
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            tx: target.x,
            ty: target.y,
            vx: 0,
            vy: 0,
            color: `rgba(${100+Math.random()*100},${120+Math.random()*100},255,0.85)`
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        // Animate silhouette points on resize
        silhouette = createAvatarSilhouettePoints(width, height);
        // Animate particles
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const p = particles[i];
            const target = silhouette[i % silhouette.length];
            // Swarm movement toward target
            const dx = target.x - p.x;
            const dy = target.y - p.y;
            p.vx += dx * 0.02 + (Math.random() - 0.5) * 0.2;
            p.vy += dy * 0.02 + (Math.random() - 0.5) * 0.2;
            p.vx *= 0.85;
            p.vy *= 0.85;
            p.x += p.vx;
            p.y += p.vy;
            // Draw particle
            ctx.beginPath();
            ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// Start the avatar particle swarm animation on DOMContentLoaded
window.addEventListener('DOMContentLoaded', startAvatarParticleSwarm); 