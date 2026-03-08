// Great Minds Creating - Main JavaScript
// Mobile Navigation, Slider, and Core Functionality

// ============================================
// MOBILE NAVIGATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    // Initialize slider if on home page
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        initSlider();
    }

    // Initialize category filters
    initCategoryFilters();

    // Initialize music player
    initMusicPlayer();
});

// ============================================
// HERO SLIDER
// ============================================
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

function initSlider() {
    // Create dots
    const dotsContainer = document.getElementById('sliderDots');
    if (dotsContainer) {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    // Next/Prev buttons
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Auto-advance slider every 5 seconds
    setInterval(nextSlide, 5000);
}

function nextSlide() {
    goToSlide((currentSlide + 1) % totalSlides);
}

function prevSlide() {
    goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
}

function goToSlide(n) {
    slides[currentSlide].classList.remove('active');
    currentSlide = n;
    slides[currentSlide].classList.add('active');

    // Update dots
    const dots = document.querySelectorAll('.slider-dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// ============================================
// CATEGORY FILTERS
// ============================================
function initCategoryFilters() {
    const categoryBtns = document.querySelectorAll('.category-btn');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;

            // Update active button
            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Filter items
            filterItems(category);
        });
    });
}

function filterItems(category) {
    // For media library
    const mediaCards = document.querySelectorAll('.media-card');
    mediaCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });

    // For products
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// ============================================
// MUSIC PLAYER
// ============================================
function initMusicPlayer() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    let isPlaying = false;

    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', function() {
            isPlaying = !isPlaying;
            this.textContent = isPlaying ? '⏸' : '▶';

            // In production, this would control actual audio playback
            if (isPlaying) {
                simulateProgress();
            }
        });
    }
}

function simulateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    if (!progressFill) return;

    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
        } else {
            width++;
            progressFill.style.width = width + '%';
        }
    }, 100);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Scroll to section
function scrollToBooking(service) {
    const bookingSection = document.getElementById('bookingSection');
    const serviceSelect = document.getElementById('bookingService');

    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
        if (serviceSelect && service) {
            serviceSelect.value = service;
        }
    }
}

// Add song (admin function)
function addSong() {
    const songUrl = prompt('Enter Spotify embed URL:');
    if (songUrl) {
        alert('Song will be added. This requires admin authentication.');
        // In production, this would save to Firestore
    }
}

// Add video (admin function)
function addArtistVideo(artist) {
    const videoUrl = prompt(`Enter YouTube video URL for ${artist}:`);
    if (videoUrl) {
        alert('Video will be added. This requires admin authentication.');
        // In production, this would save to Firestore
    }
}

// Add artist song (admin function)
function addArtistSong(artist) {
    const songUrl = prompt(`Enter song embed URL for ${artist}:`);
    if (songUrl) {
        alert('Song will be added. This requires admin authentication.');
        // In production, this would save to Firestore
    }
}

// Edit bio (admin function)
function editBio(artist) {
    const newBio = prompt(`Enter new bio for ${artist}:`);
    if (newBio) {
        alert('Bio will be updated. This requires admin authentication.');
        // In production, this would save to Firestore
    }
}

// Close fan signup modal
function closeFanModal() {
    const modal = document.getElementById('fanSignupModal');
    if (modal) {
        modal.style.display = 'none';
        // Set cookie so it doesn't show again
        document.cookie = "fanSignupSeen=true; max-age=2592000"; // 30 days
    }
}

// Check if fan signup should be shown
function checkFanSignup() {
    if (document.cookie.indexOf('fanSignupSeen') === -1) {
        // Only show on merch page
        if (window.location.pathname.includes('merch')) {
            setTimeout(() => {
                const modal = document.getElementById('fanSignupModal');
                if (modal) modal.style.display = 'block';
            }, 3000); // Show after 3 seconds
        }
    }
}

// Call on page load
document.addEventListener('DOMContentLoaded', checkFanSignup);

// ============================================
// MODAL FUNCTIONS
// ============================================

// Get modal elements
const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const closeButtons = document.querySelectorAll('.close');

// Open login modal
if (loginBtn) {
    loginBtn.addEventListener('click', function() {
        loginModal.style.display = 'block';
    });
}

// Close modals
closeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const modal = this.closest('.modal');
        if (modal) modal.style.display = 'none';
    });
});

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});
