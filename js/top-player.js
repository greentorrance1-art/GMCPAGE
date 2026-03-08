// Great Minds Creating - Top Music Player
// Persistent music player bar at top of page

let topPlayerAudio = null;
let currentRelease = null;

// ============================================
// LOAD NEWEST RELEASE
// ============================================

async function loadNewestRelease() {
    if (typeof firebase === 'undefined' || !firebase.firestore) {
        console.log('Firebase not available, using placeholder');
        showPlaceholderPlayer();
        return;
    }

    try {
        const snapshot = await firebase.firestore()
            .collection('songs')
            .orderBy('releaseDate', 'desc')
            .limit(1)
            .get();

        if (snapshot.empty) {
            console.log('No releases found, using placeholder');
            showPlaceholderPlayer();
            return;
        }

        currentRelease = snapshot.docs[0].data();
        updateTopPlayer(currentRelease);

    } catch (error) {
        console.error('Error loading newest release:', error);
        showPlaceholderPlayer();
    }
}

// ============================================
// UPDATE PLAYER UI
// ============================================

function updateTopPlayer(release) {
    document.getElementById('topPlayerTitle').textContent = release.title || 'Latest Release';
    document.getElementById('topPlayerArtist').textContent = release.artist || 'Great Minds Creating';

    // Update cover image
    const coverImg = document.getElementById('topPlayerCover');
    if (release.coverImage) {
        coverImg.src = release.coverImage;
        coverImg.alt = release.title;
    } else {
        coverImg.style.display = 'none';
    }

    // Update Spotify link
    const spotifyLink = document.getElementById('topPlayerSpotifyLink');
    if (release.spotifyLink) {
        spotifyLink.href = release.spotifyLink;
        spotifyLink.style.display = 'flex';
    } else {
        spotifyLink.style.display = 'none';
    }

    // If Spotify link is an embed link, create audio element (simplified)
    // Note: Due to browser restrictions, actual Spotify playback requires Spotify SDK
    // This is a placeholder for the play button functionality
}

function showPlaceholderPlayer() {
    document.getElementById('topPlayerTitle').textContent = 'Latest Release';
    document.getElementById('topPlayerArtist').textContent = 'Great Minds Creating';
    document.getElementById('topPlayerCover').style.display = 'none';
    document.getElementById('topPlayerSpotifyLink').href = 'https://open.spotify.com/artist/placeholder';
}

// ============================================
// PLAY BUTTON
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const playBtn = document.getElementById('topPlayerPlayBtn');

    if (playBtn) {
        playBtn.addEventListener('click', function() {
            // Open Spotify link when play is clicked
            // Real playback requires Spotify SDK integration
            if (currentRelease && currentRelease.spotifyLink) {
                window.open(currentRelease.spotifyLink, '_blank');
            } else {
                const spotifyLink = document.getElementById('topPlayerSpotifyLink');
                if (spotifyLink && spotifyLink.href) {
                    window.open(spotifyLink.href, '_blank');
                }
            }
        });
    }

    // Load newest release on page load
    loadNewestRelease();
});

// ============================================
// NOTES ON SPOTIFY PLAYBACK
// ============================================

/*
For actual Spotify playback (not just linking), you would need to:

1. Register your app at: https://developer.spotify.com/dashboard
2. Include Spotify Web Playback SDK:
   <script src="https://sdk.scdn.co/spotify-player.js"></script>
3. Implement authentication flow
4. Use the Spotify Player API

Example implementation:

window.onSpotifyWebPlaybackSDKReady = () => {
    const player = new Spotify.Player({
        name: 'Great Minds Creating Player',
        getOAuthToken: cb => { cb(access_token); },
        volume: 0.5
    });

    player.connect();
};

Due to Spotify's restrictions, embedded playback requires:
- User to have Spotify Premium
- OAuth authentication
- Active Spotify session

For now, the play button opens the Spotify link in a new tab.
*/
