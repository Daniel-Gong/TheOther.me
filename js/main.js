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

// Waitlist form with glassmorphism
const waitlistForm = document.getElementById('waitlistForm');
const emailInput = document.getElementById('email');

waitlistForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = emailInput.value.trim();
    if (!email) return;

    try {
        const button = waitlistForm.querySelector('button');
        const originalText = button.innerHTML;
        
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Joining...';
        button.disabled = true;

        // Send email to backend API
        const response = await fetch('http://localhost:3000/api/waitlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email })
        });

        const data = await response.json();
        console.log('Server response:', data);

        if (!response.ok) {
            throw new Error(data.error || 'Failed to join waitlist');
        }

        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <p>${data.message}</p>
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
        console.error('Error submitting form:', error);
        // Show error message
        const errorMessage = document.createElement('div');
        errorMessage.className = 'error-message';
        errorMessage.textContent = error.message || 'Something went wrong. Please try again.';
        
        // Remove any existing error messages
        const existingError = waitlistForm.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        waitlistForm.appendChild(errorMessage);
        
        // Reset button
        const button = waitlistForm.querySelector('button');
        if (button) {
            button.innerHTML = originalText;
            button.disabled = false;
        }
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

// Initialize features
document.addEventListener('DOMContentLoaded', () => {
    initializeParticleSystem();
    initializeDataFlow();
    updateParallax();
    initializeDNAHelix();
    initializeMobileNav();
    initializePullToRefresh();
    initializeTouchCarousel();
    initializeMobileFeatures();
    initializeCustomCursor();
    initializeStatusBar();
    initializeLuxuryFeatures();
});

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