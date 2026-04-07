// Great Minds Creating - Main JavaScript
// Mobile Navigation, Slider, and Core Functionality

// ============================================
// MOBILE NAVIGATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

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

    // Initialize bottom music player
    initMusicPlayer();
});

// ============================================
// HERO SLIDER
// ============================================
let currentSlide = 0;

function initSlider() {
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    if (totalSlides === 0) return;

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

    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');

    if (prevBtn) prevBtn.addEventListener('click', () => shiftSlide(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => shiftSlide(1));

    setInterval(() => shiftSlide(1), 5000);
}

function shiftSlide(direction) {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;
    goToSlide((currentSlide + direction + slides.length) % slides.length);
}

function goToSlide(n) {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;

    slides[currentSlide].classList.remove('active');
    currentSlide = n;
    slides[currentSlide].classList.add('active');

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

            categoryBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            filterItems(category);
        });
    });
}

function filterItems(category) {
    document.querySelectorAll('.media-card').forEach(card => {
        card.style.display = (category === 'all' || card.dataset.category === category) ? 'block' : 'none';
    });

    document.querySelectorAll('.product-card').forEach(card => {
        card.style.display = (category === 'all' || card.dataset.category === category) ? 'block' : 'none';
    });
}

// ============================================
// BOTTOM MUSIC PLAYER
// Loads newest release from Firebase.
// Falls back to a placeholder if Firebase isn't ready.
// ============================================

let playerAudio = null;
let playerIsPlaying = false;
let playerSpotifyLink = null;

function initMusicPlayer() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    if (!playPauseBtn) return;

    // Load latest release info into player bar
    loadPlayerRelease();

    playPauseBtn.addEventListener('click', function() {
        if (playerAudio) {
            // Real audio element
            if (playerIsPlaying) {
                playerAudio.pause();
                playerIsPlaying = false;
                this.textContent = '▶';
            } else {
                playerAudio.play().then(() => {
                    playerIsPlaying = true;
                    this.textContent = '⏸';
                }).catch(() => {
                    // Autoplay blocked — open Spotify link instead
                    openSpotifyFallback();
                });
            }
        } else if (playerSpotifyLink) {
            // No direct audio — open Spotify
            openSpotifyFallback();
        } else {
            // Nothing loaded yet — visual feedback only
            playerIsPlaying = !playerIsPlaying;
            this.textContent = playerIsPlaying ? '⏸' : '▶';
            if (playerIsPlaying) animateProgress();
        }
    });
}

function openSpotifyFallback() {
    if (playerSpotifyLink) {
        window.open(playerSpotifyLink, '_blank');
    }
}

async function loadPlayerRelease() {
    const trackTitleEl = document.getElementById('playerTrackTitle') || document.querySelector('.track-title');

    if (typeof firebase === 'undefined' || !firebase.firestore) {
        // Firebase not configured — show default text, player is still clickable
        if (trackTitleEl) trackTitleEl.textContent = 'Great Minds Creating - Latest Drop';
        return;
    }

    try {
        const snapshot = await firebase.firestore()
            .collection('songs')
            .orderBy('releaseDate', 'desc')
            .limit(1)
            .get();

        if (snapshot.empty) {
            if (trackTitleEl) trackTitleEl.textContent = 'Great Minds Creating - Latest Drop';
            return;
        }

        const release = snapshot.docs[0].data();

        if (trackTitleEl) {
            trackTitleEl.textContent = `${release.artist || 'GMC'} - ${release.title || 'Latest Drop'}`;
        }

        // Store Spotify link for the play button fallback
        if (release.spotifyLink) {
            playerSpotifyLink = release.spotifyLink;
        }

        // If there's a direct audio URL, wire it up
        if (release.audioUrl) {
            playerAudio = new Audio(release.audioUrl);
            playerAudio.addEventListener('timeupdate', updateProgressBar);
            playerAudio.addEventListener('ended', function() {
                playerIsPlaying = false;
                const btn = document.getElementById('playPauseBtn');
                if (btn) btn.textContent = '▶';
                resetProgressBar();
            });
        }

    } catch (error) {
        console.error('Player load error:', error);
        const trackTitleEl = document.getElementById('playerTrackTitle') || document.querySelector('.track-title');
        if (trackTitleEl) trackTitleEl.textContent = 'Great Minds Creating - Latest Drop';
    }
}

function updateProgressBar() {
    if (!playerAudio || playerAudio.duration === 0) return;
    const pct = (playerAudio.currentTime / playerAudio.duration) * 100;
    const fill = document.querySelector('.progress-fill');
    if (fill) fill.style.width = pct + '%';
}

function resetProgressBar() {
    const fill = document.querySelector('.progress-fill');
    if (fill) fill.style.width = '0%';
}

function animateProgress() {
    // Visual-only progress animation when no real audio is available
    const progressFill = document.querySelector('.progress-fill');
    if (!progressFill) return;

    let width = parseFloat(progressFill.style.width) || 0;
    const interval = setInterval(() => {
        if (!playerIsPlaying || width >= 100) {
            clearInterval(interval);
            return;
        }
        width += 0.1;
        progressFill.style.width = width + '%';
    }, 100);
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function scrollToBooking(service) {
    const bookingSection = document.getElementById('bookingSection');
    const serviceSelect = document.getElementById('bookingService');

    if (bookingSection) {
        bookingSection.scrollIntoView({ behavior: 'smooth' });
        if (serviceSelect && service) {
            setTimeout(() => {
                serviceSelect.value = service;
                serviceSelect.focus();
            }, 500);
        }
    }
}

function addSong() {
    // Redirect admin to dashboard for song management
    const user = (typeof currentUser !== 'undefined') ? currentUser : null;
    if (!user) {
        alert('Please log in as admin first.');
        return;
    }
    window.location.href = 'admin-dashboard.html';
}

function closeFanModal() {
    const modal = document.getElementById('fanSignupModal');
    if (modal) {
        modal.style.display = 'none';
        document.cookie = "fanSignupSeen=true; max-age=2592000";
    }
}

function checkFanSignup() {
    if (document.cookie.indexOf('fanSignupSeen') === -1) {
        if (window.location.pathname.includes('merch')) {
            setTimeout(() => {
                const modal = document.getElementById('fanSignupModal');
                if (modal) modal.style.display = 'block';
            }, 3000);
        }
    }
}

document.addEventListener('DOMContentLoaded', checkFanSignup);

// ============================================
// MODAL FUNCTIONS
// ============================================

const loginModal = document.getElementById('loginModal');
const loginBtn = document.getElementById('loginBtn');
const closeButtons = document.querySelectorAll('.close');

if (loginBtn) {
    loginBtn.addEventListener('click', function() {
        if (loginModal) loginModal.style.display = 'block';
    });
}

closeButtons.forEach(btn => {
    btn.addEventListener('click', function() {
        const modal = this.closest('.modal');
        if (modal) modal.style.display = 'none';
    });
});

window.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
});

// Make utility functions globally available
window.scrollToBooking = scrollToBooking;
window.addSong = addSong;
window.closeFanModal = closeFanModal;
