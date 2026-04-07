// Great Minds Creating - Admin Dashboard
// Admin-only content management

// ============================================
// AUTHENTICATION CHECK
// ============================================

let currentUser = null;

// Known admin emails used as fallback when Firestore is unavailable
const KNOWN_ADMINS = [
    'torrancegreen22@yahoo.com',
    'jaybandobaby4@gmail.com',
    'beats4bblazo@gmail.com'
];

// Guard: Firebase must be initialized before any auth call
if (typeof firebase !== 'undefined' && firebase.auth) {
    firebase.auth().onAuthStateChanged(async function(user) {
        if (!user) {
            window.location.href = 'index.html';
            return;
        }

        currentUser = user;

        const isAdmin = await checkAdminStatus(user.email);

        if (!isAdmin) {
            alert('Access denied. Admin privileges required.');
            window.location.href = 'index.html';
            return;
        }

        loadDashboard();
    });
} else {
    // Firebase not configured — show a clear message instead of a blank screen
    document.addEventListener('DOMContentLoaded', function() {
        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = `
                <div style="padding: 3rem; text-align: center; color: var(--text-white, #fff);">
                    <h2 style="color: #FF6B35;">Firebase Not Configured</h2>
                    <p>You need to add your Firebase credentials to <code>config/firebase-config.js</code> before the admin dashboard will work.</p>
                    <p>See the README.txt for setup instructions.</p>
                    <a href="index.html" style="color: #FF6B35;">← Back to Home</a>
                </div>
            `;
        }
    });
}

async function checkAdminStatus(email) {
    const emailLower = email.toLowerCase();

    try {
        if (typeof firebase === 'undefined' || !firebase.firestore) {
            return KNOWN_ADMINS.includes(emailLower);
        }

        const snapshot = await firebase.firestore()
            .collection('admins')
            .where('email', '==', emailLower)
            .get();

        if (!snapshot.empty) return true;

        // Fallback to hardcoded list if collection doesn't exist yet
        return KNOWN_ADMINS.includes(emailLower);

    } catch (error) {
        console.error('Admin check error:', error);
        return KNOWN_ADMINS.includes(emailLower);
    }
}

// ============================================
// LOGOUT
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async function() {
            if (typeof firebase === 'undefined' || !firebase.auth) return;
            try {
                await firebase.auth().signOut();
                window.location.href = 'index.html';
            } catch (error) {
                console.error('Logout error:', error);
            }
        });
    }
});

// ============================================
// LOAD DASHBOARD DATA
// ============================================

async function loadDashboard() {
    await loadStats();
    await loadPollResults();
}

async function loadStats() {
    if (typeof firebase === 'undefined' || !firebase.firestore) return;

    try {
        const fansSnapshot = await firebase.firestore().collection('fans').get();
        const el = document.getElementById('totalFans');
        if (el) el.textContent = fansSnapshot.size;

        const bookingsSnapshot = await firebase.firestore().collection('bookings').get();
        const el2 = document.getElementById('totalBookings');
        if (el2) el2.textContent = bookingsSnapshot.size;

        const ordersSnapshot = await firebase.firestore().collection('orders').get();
        const el3 = document.getElementById('totalOrders');
        if (el3) el3.textContent = ordersSnapshot.size;

        const pollsSnapshot = await firebase.firestore()
            .collection('polls')
            .where('active', '==', true)
            .get();
        const el4 = document.getElementById('activePolls');
        if (el4) el4.textContent = pollsSnapshot.size;

    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

// ============================================
// ADD RELEASE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const addReleaseForm = document.getElementById('addReleaseForm');
    if (addReleaseForm) {
        addReleaseForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (typeof firebase === 'undefined' || !firebase.firestore) {
                alert('Firebase not configured');
                return;
            }

            if (!currentUser) {
                alert('Not authenticated');
                return;
            }

            const releaseData = {
                title: document.getElementById('releaseTitle').value,
                artist: document.getElementById('releaseArtist').value,
                members: document.getElementById('releaseMembers').value.split(',').map(m => m.trim()).filter(Boolean),
                releaseType: document.getElementById('releaseType').value,
                spotifyLink: document.getElementById('releaseSpotify').value,
                appleMusicLink: document.getElementById('releaseAppleMusic').value,
                coverImage: document.getElementById('releaseCoverImage').value,
                releaseDate: document.getElementById('releaseDate').value,
                createdAt: new Date().toISOString(),
                createdBy: currentUser.email
            };

            try {
                await firebase.firestore().collection('songs').add(releaseData);
                alert('Release added successfully!');
                this.reset();
                await loadStats();
            } catch (error) {
                console.error('Error adding release:', error);
                alert('Failed to add release: ' + error.message);
            }
        });
    }

    // ============================================
    // ADD VIDEO
    // ============================================

    const addVideoForm = document.getElementById('addVideoForm');
    if (addVideoForm) {
        addVideoForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (typeof firebase === 'undefined' || !firebase.firestore) {
                alert('Firebase not configured');
                return;
            }

            const youtubeUrl = document.getElementById('videoYouTube').value;
            const youtubeId = extractYouTubeId(youtubeUrl);

            if (!youtubeId) {
                alert('Invalid YouTube URL');
                return;
            }

            const videoData = {
                title: document.getElementById('videoTitle').value,
                artist: document.getElementById('videoArtist').value,
                youtubeUrl: youtubeUrl,
                youtubeId: youtubeId,
                category: document.getElementById('videoCategory').value,
                releaseDate: document.getElementById('videoReleaseDate').value,
                createdAt: new Date().toISOString(),
                createdBy: currentUser.email
            };

            try {
                await firebase.firestore().collection('videos').add(videoData);
                alert('Video added successfully!');
                this.reset();
            } catch (error) {
                console.error('Error adding video:', error);
                alert('Failed to add video: ' + error.message);
            }
        });
    }

    // ============================================
    // ADD EVENT
    // ============================================

    const addEventForm = document.getElementById('addEventForm');
    if (addEventForm) {
        addEventForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (typeof firebase === 'undefined' || !firebase.firestore) {
                alert('Firebase not configured');
                return;
            }

            const eventData = {
                title: document.getElementById('eventTitle').value,
                location: document.getElementById('eventLocation').value,
                date: document.getElementById('eventDate').value,
                ticketLink: document.getElementById('eventTicketLink').value,
                createdAt: new Date().toISOString(),
                createdBy: currentUser.email
            };

            try {
                await firebase.firestore().collection('events').add(eventData);
                alert('Event added successfully!');
                this.reset();
                await loadStats();
            } catch (error) {
                console.error('Error adding event:', error);
                alert('Failed to add event: ' + error.message);
            }
        });
    }

    // ============================================
    // ADD MERCH
    // ============================================

    const addMerchForm = document.getElementById('addMerchForm');
    if (addMerchForm) {
        addMerchForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (typeof firebase === 'undefined' || !firebase.firestore) {
                alert('Firebase not configured');
                return;
            }

            const sizes = document.getElementById('merchSizes').value;

            const merchData = {
                name: document.getElementById('merchName').value,
                price: parseFloat(document.getElementById('merchPrice').value),
                imageURL: document.getElementById('merchImageURL').value,
                sizes: sizes ? sizes.split(',').map(s => s.trim()) : [],
                category: document.getElementById('merchCategory').value,
                createdAt: new Date().toISOString(),
                createdBy: currentUser.email
            };

            try {
                await firebase.firestore().collection('merch').add(merchData);
                alert('Merch added successfully!');
                this.reset();
                await loadStats();
            } catch (error) {
                console.error('Error adding merch:', error);
                alert('Failed to add merch: ' + error.message);
            }
        });
    }

    // ============================================
    // CREATE POLL
    // ============================================

    const createPollForm = document.getElementById('createPollForm');
    if (createPollForm) {
        createPollForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (typeof firebase === 'undefined' || !firebase.firestore) {
                alert('Firebase not configured');
                return;
            }

            const question = document.getElementById('pollQuestion').value;
            const optionInputs = document.querySelectorAll('.poll-option-input');
            const options = Array.from(optionInputs)
                .map(input => input.value.trim())
                .filter(val => val !== '');

            if (options.length < 2) {
                alert('Please provide at least 2 options');
                return;
            }

            const pollData = {
                question: question,
                options: options,
                votes: {},
                active: document.getElementById('pollActive').checked,
                createdAt: new Date().toISOString(),
                createdBy: currentUser.email
            };

            try {
                await firebase.firestore().collection('polls').add(pollData);
                alert('Poll created successfully!');
                this.reset();

                const container = document.getElementById('pollOptionsContainer');
                if (container) {
                    container.innerHTML = `
                        <input type="text" class="poll-option-input" placeholder="Option 1" required>
                        <input type="text" class="poll-option-input" placeholder="Option 2" required>
                    `;
                }

                await loadStats();
                await loadPollResults();
            } catch (error) {
                console.error('Error creating poll:', error);
                alert('Failed to create poll: ' + error.message);
            }
        });
    }
});

// ============================================
// POLL OPTION HELPER
// ============================================

function addPollOption() {
    const container = document.getElementById('pollOptionsContainer');
    if (!container) return;
    const optionCount = container.querySelectorAll('.poll-option-input').length + 1;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'poll-option-input';
    input.placeholder = `Option ${optionCount}`;
    input.required = true;
    container.appendChild(input);
}

window.addPollOption = addPollOption;

// ============================================
// LOAD POLL RESULTS
// ============================================

async function loadPollResults() {
    if (typeof firebase === 'undefined' || !firebase.firestore) return;

    const container = document.getElementById('pollResultsContainer');
    if (!container) return;

    try {
        const snapshot = await firebase.firestore()
            .collection('polls')
            .orderBy('createdAt', 'desc')
            .limit(5)
            .get();

        if (snapshot.empty) {
            container.innerHTML = '<p style="color: var(--text-gray);">No polls found</p>';
            return;
        }

        container.innerHTML = '';

        snapshot.forEach(doc => {
            const poll = doc.data();
            const pollCard = createPollResultCard(doc.id, poll);
            container.appendChild(pollCard);
        });

    } catch (error) {
        console.error('Error loading poll results:', error);
        container.innerHTML = '<p style="color: #ff3860;">Error loading poll results</p>';
    }
}

function createPollResultCard(pollId, poll) {
    const card = document.createElement('div');
    card.className = 'poll-result-card';
    card.style.cssText = 'background: var(--light-gray); padding: 1.5rem; border-radius: 10px; margin-bottom: 1rem;';

    const title = document.createElement('h3');
    title.textContent = poll.question;
    title.style.cssText = 'color: var(--primary-orange); margin-bottom: 1rem;';
    card.appendChild(title);

    const status = document.createElement('p');
    status.textContent = poll.active ? 'Status: Active' : 'Status: Closed';
    status.style.cssText = `color: ${poll.active ? '#48c774' : '#ff3860'}; margin-bottom: 1rem; font-weight: bold;`;
    card.appendChild(status);

    const votes = poll.votes || {};
    const totalVotes = Object.values(votes).reduce((sum, count) => sum + (count || 0), 0);

    const resultsDiv = document.createElement('div');
    resultsDiv.style.cssText = 'margin-top: 1rem;';

    (poll.options || []).forEach(option => {
        const optionVotes = votes[option] || 0;
        const percentage = totalVotes > 0 ? ((optionVotes / totalVotes) * 100).toFixed(1) : 0;

        const optionDiv = document.createElement('div');
        optionDiv.style.cssText = 'margin-bottom: 0.5rem;';

        const optionText = document.createElement('div');
        optionText.textContent = `${option}: ${optionVotes} votes (${percentage}%)`;
        optionText.style.cssText = 'color: var(--text-white); margin-bottom: 0.25rem;';

        const progressBar = document.createElement('div');
        progressBar.style.cssText = 'height: 8px; background: var(--mid-gray); border-radius: 4px; overflow: hidden;';

        const progressFill = document.createElement('div');
        progressFill.style.cssText = `width: ${percentage}%; height: 100%; background: var(--primary-orange); transition: width 0.3s ease;`;

        progressBar.appendChild(progressFill);
        optionDiv.appendChild(optionText);
        optionDiv.appendChild(progressBar);
        resultsDiv.appendChild(optionDiv);
    });

    const totalText = document.createElement('p');
    totalText.textContent = `Total Votes: ${totalVotes}`;
    totalText.style.cssText = 'color: var(--text-gray); margin-top: 1rem; font-size: 0.9rem;';

    card.appendChild(resultsDiv);
    card.appendChild(totalText);

    return card;
}

// ============================================
// HELPERS
// ============================================

function extractYouTubeId(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
}
