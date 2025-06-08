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

waitlistForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value;
    if (!email.includes('@')) {
        showToast('Please enter a valid email address');
        return;
    }
    
    try {
        // In a real implementation, this would be an API call
        showToast('Thanks for joining our waitlist!');
        emailInput.value = '';
    } catch (error) {
        showToast('Something went wrong. Please try again.');
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

// Loading Sequence
const funFacts = [
    "Did you know? Humans make about 35,000 decisions every day.",
    "Your brain processes information faster than the fastest supercomputer.",
    "Pattern recognition is one of the most powerful aspects of human intelligence.",
    "The average person spends 6 months of their lifetime waiting for red lights.",
    "Your digital footprint grows by 1.7MB every second."
];

const loadingMessages = [
    "Analyzing your patterns...",
    "Mapping your behavior genome...",
    "Calculating future probabilities...",
    "Building your digital twin...",
    "Almost ready..."
];

let currentProgress = 0;
let isOffline = false;

// Initialize loading sequence
function initializeLoading() {
    const container = document.querySelector('.avatar-container');
    const progressElement = document.querySelector('.loading-progress');
    const messageElement = document.querySelector('.loading-message');
    const funFactElement = document.querySelector('.fun-fact');
    const errorState = document.querySelector('.error-state');
    
    // Create particles
    const particleCount = 100;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        container.appendChild(particle);
        particles.push(particle);
    }
    
    // Animate particles to form silhouette
    gsap.to(particles, {
        opacity: 1,
        duration: 0.5,
        stagger: {
            amount: 1,
            from: "random"
        },
        ease: "power2.out"
    });
    
    // Position particles in silhouette shape
    particles.forEach((particle, index) => {
        const angle = (index / particleCount) * Math.PI * 2;
        const radius = 80;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        gsap.to(particle, {
            x: x,
            y: y,
            duration: 2,
            delay: 0.5,
            ease: "elastic.out(1, 0.5)"
        });
    });
    
    // Update progress
    function updateProgress() {
        if (isOffline) return;
        
        currentProgress += Math.random() * 5;
        if (currentProgress > 100) currentProgress = 100;
        
        progressElement.textContent = `${Math.floor(currentProgress)}%`;
        
        // Update message based on progress
        const messageIndex = Math.floor(currentProgress / 20);
        if (messageIndex < loadingMessages.length) {
            messageElement.textContent = loadingMessages[messageIndex];
            messageElement.classList.add('visible');
        }
        
        // Update fun fact
        const factIndex = Math.floor(currentProgress / 25);
        if (factIndex < funFacts.length) {
            funFactElement.textContent = funFacts[factIndex];
            funFactElement.classList.add('visible');
        }
        
        if (currentProgress < 100) {
            requestAnimationFrame(updateProgress);
        } else {
            // Loading complete
            setTimeout(() => {
                document.querySelector('.loading-overlay').classList.add('hidden');
                // Initialize main content
                initializeMainContent();
            }, 1000);
        }
    }
    
    // Start progress animation
    requestAnimationFrame(updateProgress);
    
    // Handle offline state
    window.addEventListener('offline', () => {
        isOffline = true;
        errorState.classList.add('visible');
    });
    
    // Retry button
    const retryButton = document.querySelector('.retry-button');
    retryButton.addEventListener('click', () => {
        if (navigator.onLine) {
            isOffline = false;
            errorState.classList.remove('visible');
            currentProgress = 0;
            requestAnimationFrame(updateProgress);
        }
    });
}

// Initialize main content after loading
function initializeMainContent() {
    // Initialize existing features
    if (window.innerWidth > 768) {
        initializeDNAHelix();
    } else {
        initializeMobileFeatures();
    }
    
    // Initialize other components
    initializeParticleSystem();
    initializeDataFlow();
    addWaveDividers();
}

// Start loading sequence when page loads
window.addEventListener('load', () => {
    // Check if offline
    if (!navigator.onLine) {
        isOffline = true;
        document.querySelector('.error-state').classList.add('visible');
    } else {
        initializeLoading();
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
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
    let cursorAnimationFrame;
    
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
        
        requestAnimationFrame(updateCursor);
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