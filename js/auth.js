// Great Minds Creating - Authentication
// Firebase Authentication and User Management

// Admin email addresses and their permissions
const ADMIN_USERS = {
    'torrancegreen22@yahoo.com': {
        role: 'super_admin',
        access: ['all']
    },
    'jaybandobaby4@gmail.com': {
        role: 'artist_admin',
        access: ['Jay Bando Baby']
    },
    'beats4bblazo@gmail.com': {
        role: 'artist_admin',
        access: ['B Blazo']
    }
};

let currentUser = null;
let userPermissions = null;

// ============================================
// AUTHENTICATION STATE
// ============================================

if (typeof firebase !== 'undefined' && firebase.auth) {
    firebase.auth().onAuthStateChanged(function(user) {
        currentUser = user;

        if (user) {
            handleUserLogin(user);
        } else {
            handleUserLogout();
        }
    });
} else {
    console.warn('Firebase not initialized. Admin features unavailable.');
}

// ============================================
// LOGIN HANDLING
// ============================================

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (typeof firebase === 'undefined' || !firebase.auth) {
            alert('Firebase is not configured yet. Please add your Firebase credentials to config/firebase-config.js');
            return;
        }

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        try {
            const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
            console.log('Login successful:', userCredential.user.email);

            const loginModal = document.getElementById('loginModal');
            if (loginModal) loginModal.style.display = 'none';

            loginForm.reset();

        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed: ' + error.message);
        }
    });
}

// Logout button
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async function() {
        if (typeof firebase === 'undefined' || !firebase.auth) return;
        try {
            await firebase.auth().signOut();
            console.log('Logout successful');
        } catch (error) {
            console.error('Logout error:', error);
        }
    });
}

// ============================================
// USER LOGIN HANDLER
// ============================================

function handleUserLogin(user) {
    console.log('User logged in:', user.email);

    const adminData = ADMIN_USERS[user.email.toLowerCase()];

    if (adminData) {
        userPermissions = adminData;
        showAdminControls(adminData);
    } else {
        userPermissions = { role: 'fan', access: [] };
    }

    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginBtn) loginBtn.style.display = 'none';
    if (logoutBtn) {
        logoutBtn.style.display = 'block';
        logoutBtn.textContent = adminData ? 'Logout (Admin)' : 'Logout';
    }
}

// ============================================
// USER LOGOUT HANDLER
// ============================================

function handleUserLogout() {
    console.log('User logged out');

    currentUser = null;
    userPermissions = null;

    const adminControls = document.querySelectorAll('.admin-controls');
    adminControls.forEach(control => {
        control.style.display = 'none';
    });

    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    if (loginBtn) loginBtn.style.display = 'block';
    if (logoutBtn) logoutBtn.style.display = 'none';
}

// ============================================
// ADMIN CONTROLS
// ============================================

function showAdminControls(adminData) {
    const adminControls = document.querySelectorAll('.admin-controls');

    adminControls.forEach(control => {
        if (!control.classList.contains('artist-admin')) {
            if (adminData.role === 'super_admin') {
                control.style.display = 'flex';
            }
        } else {
            const artist = control.dataset.artist;
            if (adminData.role === 'super_admin' || adminData.access.includes(artist)) {
                control.style.display = 'flex';
            }
        }
    });
}

// Make showAdminControls globally available for admin-dashboard
window.showAdminControls = showAdminControls;

// ============================================
// FAN SIGNUP
// ============================================

const fanSignupForm = document.getElementById('fanSignupForm');
if (fanSignupForm) {
    fanSignupForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const fanData = {
            name: document.getElementById('fanName').value,
            username: document.getElementById('fanUsername').value,
            phone: document.getElementById('fanPhone').value,
            city: document.getElementById('fanCity').value,
            favoriteArtist: document.getElementById('fanFavoriteArtist').value,
            signupDate: new Date().toISOString(),
            type: 'fan'
        };

        try {
            if (typeof firebase !== 'undefined' && firebase.firestore) {
                await firebase.firestore().collection('fans').add(fanData);
                console.log('Fan signup successful');
                alert('Welcome to Great Minds Creating! Check your phone for exclusive updates.');
            } else {
                alert('Signup system is not connected yet. Please try again later.');
                return;
            }

            closeFanModal();
            fanSignupForm.reset();

        } catch (error) {
            console.error('Fan signup error:', error);
            alert('Signup failed. Please try again.');
        }
    });
}

// ============================================
// FOLLOW ARTIST
// ============================================

const followBtns = document.querySelectorAll('.btn-follow');
followBtns.forEach(btn => {
    btn.addEventListener('click', async function() {
        const artist = this.dataset.artist;

        if (!currentUser) {
            alert('Please log in to follow artists');
            const loginModal = document.getElementById('loginModal');
            if (loginModal) loginModal.style.display = 'block';
            return;
        }

        try {
            const isFollowing = this.classList.contains('following');

            if (isFollowing) {
                await unfollowArtist(currentUser.uid, artist);
                this.classList.remove('following');
                this.textContent = 'Follow';
            } else {
                await followArtist(currentUser.uid, artist);
                this.classList.add('following');
                this.textContent = 'Following';
            }

        } catch (error) {
            console.error('Follow error:', error);
            alert('Failed to update follow status');
        }
    });
});

async function followArtist(userId, artist) {
    if (typeof firebase !== 'undefined' && firebase.firestore) {
        await firebase.firestore().collection('follows').add({
            userId: userId,
            artist: artist,
            followedAt: new Date().toISOString()
        });
    }
}

async function unfollowArtist(userId, artist) {
    if (typeof firebase !== 'undefined' && firebase.firestore) {
        const snapshot = await firebase.firestore()
            .collection('follows')
            .where('userId', '==', userId)
            .where('artist', '==', artist)
            .get();

        snapshot.forEach(doc => {
            doc.ref.delete();
        });
    }
}

// ============================================
// CHECK FOLLOW STATUS
// ============================================

async function checkFollowStatus() {
    if (!currentUser) return;
    if (typeof firebase === 'undefined' || !firebase.firestore) return;

    const followBtns = document.querySelectorAll('.btn-follow');

    for (const btn of followBtns) {
        const artist = btn.dataset.artist;

        const snapshot = await firebase.firestore()
            .collection('follows')
            .where('userId', '==', currentUser.uid)
            .where('artist', '==', artist)
            .get();

        if (!snapshot.empty) {
            btn.classList.add('following');
            btn.textContent = 'Following';
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setTimeout(checkFollowStatus, 1000);
});
