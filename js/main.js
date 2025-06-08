// Typing animation
const typingText = document.getElementById('typingText');
const text = "Know yourself. Predict your future.";
let charIndex = 0;

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
});

// Features data
const features = [
    {
        icon: 'chart-bar',
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

// Render features
const featuresGrid = document.querySelector('.features-grid');
features.forEach(feature => {
    const featureCard = document.createElement('div');
    featureCard.className = 'feature-card';
    featureCard.innerHTML = `
        <svg class="feature-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
        <h3>${feature.title}</h3>
        <p>${feature.description}</p>
    `;
    featuresGrid.appendChild(featureCard);
});

// Testimonials data
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

// Testimonial carousel
let currentTestimonial = 0;
const testimonialCarousel = document.querySelector('.testimonial-carousel');

function renderTestimonial(index) {
    const testimonial = testimonials[index];
    testimonialCarousel.innerHTML = `
        <div class="testimonial">
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

// Auto-rotate testimonials
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}, 5000);

// Initialize first testimonial
renderTestimonial(0);

// Waitlist form handling
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
        // For now, we'll just show a success message
        showToast('Thanks for joining our waitlist!');
        emailInput.value = '';
    } catch (error) {
        showToast('Something went wrong. Please try again.');
    }
});

// Toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
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