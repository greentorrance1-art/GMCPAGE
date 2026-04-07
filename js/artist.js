// Great Minds Creating - Artist Pages
// Artist-specific functionality

// ============================================
// LOAD ARTIST DATA
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    loadArtistContent();
});

async function loadArtistContent() {
    // Detect artist from page title — CASSH Create must match exactly
    const pageTitle = document.title;
    let artistName = '';

    if (pageTitle.includes('Jay Bando Baby')) {
        artistName = 'Jay Bando Baby';
    } else if (pageTitle.includes('B Blazo')) {
        artistName = 'B Blazo';
    } else if (pageTitle.includes('CASSH Create')) {
        artistName = 'CASSH Create';
    }

    if (!artistName) return;

    try {
        await loadArtistBio(artistName);
        await loadArtistSongs(artistName);
        await loadArtistVideos(artistName);
    } catch (error) {
        console.error('Error loading artist content:', error);
    }
}

// ============================================
// LOAD ARTIST BIO
// ============================================

async function loadArtistBio(artistName) {
    const bioContainer = document.getElementById('artistBio');
    if (!bioContainer) return;

    if (typeof firebase === 'undefined' || !firebase.firestore) return;

    try {
        const snapshot = await firebase.firestore()
            .collection('artists')
            .where('name', '==', artistName)
            .get();

        if (!snapshot.empty) {
            const artistData = snapshot.docs[0].data();
            if (artistData.bio) {
                bioContainer.innerHTML = `<p>${artistData.bio}</p>`;
            }
        }
    } catch (error) {
        console.error('Error loading bio:', error);
    }
}

// ============================================
// LOAD ARTIST SONGS
// ============================================

async function loadArtistSongs(artistName) {
    const songsContainer = document.getElementById('artistSongs');
    if (!songsContainer) return;

    if (typeof firebase === 'undefined' || !firebase.firestore) return;

    try {
        const snapshot = await firebase.firestore()
            .collection('songs')
            .where('artist', '==', artistName)
            .orderBy('releaseDate', 'desc')
            .limit(6)
            .get();

        if (!snapshot.empty) {
            songsContainer.innerHTML = '';

            snapshot.forEach(doc => {
                const song = doc.data();
                const songCard = createSongCard(song);
                songsContainer.appendChild(songCard);
            });
        }
    } catch (error) {
        console.error('Error loading songs:', error);
    }
}

function createSongCard(song) {
    const card = document.createElement('div');
    card.className = 'music-card';

    if (song.embedUrl) {
        card.innerHTML = `<iframe style="border-radius:12px" src="${song.embedUrl}" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
    } else if (song.spotifyLink) {
        // Convert spotify link to embed if possible
        const spotifyId = song.spotifyLink.split('/').pop().split('?')[0];
        const embedSrc = `https://open.spotify.com/embed/track/${spotifyId}?utm_source=generator`;
        card.innerHTML = `<iframe style="border-radius:12px" src="${embedSrc}" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
    } else {
        card.innerHTML = `
            <div class="video-placeholder">
                <p>${song.title || 'Untitled Track'}</p>
            </div>
        `;
    }

    return card;
}

// ============================================
// LOAD ARTIST VIDEOS
// ============================================

async function loadArtistVideos(artistName) {
    const videosContainer = document.getElementById('artistVideos');
    if (!videosContainer) return;

    if (typeof firebase === 'undefined' || !firebase.firestore) return;

    try {
        const snapshot = await firebase.firestore()
            .collection('videos')
            .where('artist', '==', artistName)
            .orderBy('releaseDate', 'desc')
            .limit(6)
            .get();

        if (!snapshot.empty) {
            videosContainer.innerHTML = '';

            snapshot.forEach(doc => {
                const video = doc.data();
                const videoCard = createVideoCard(video);
                videosContainer.appendChild(videoCard);
            });
        }
    } catch (error) {
        console.error('Error loading videos:', error);
    }
}

function createVideoCard(video) {
    const card = document.createElement('div');
    card.className = 'video-card';

    if (video.youtubeId) {
        card.innerHTML = `
            <iframe width="100%" height="200" src="https://www.youtube.com/embed/${video.youtubeId}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        `;
    } else {
        card.innerHTML = `
            <div class="video-placeholder">
                <p>${video.title || 'Video Coming Soon'}</p>
            </div>
        `;
    }

    return card;
}

// ============================================
// ADMIN EDIT FUNCTIONS (called from HTML)
// ============================================

async function editBio(artist) {
    if (!isCurrentUserAdmin()) {
        alert('Admin access required.');
        return;
    }

    const bioContainer = document.getElementById('artistBio');
    const currentBio = bioContainer ? bioContainer.innerText : '';
    const newBio = prompt(`Enter new bio for ${artist}:`, currentBio);

    if (newBio === null) return; // cancelled

    if (typeof firebase === 'undefined' || !firebase.firestore) {
        alert('Firebase not configured.');
        return;
    }

    try {
        // Check if artist doc exists
        const snapshot = await firebase.firestore()
            .collection('artists')
            .where('name', '==', artist)
            .get();

        if (snapshot.empty) {
            // Create new artist doc
            await firebase.firestore().collection('artists').add({
                name: artist,
                bio: newBio,
                updatedAt: new Date().toISOString()
            });
        } else {
            await snapshot.docs[0].ref.update({
                bio: newBio,
                updatedAt: new Date().toISOString()
            });
        }

        if (bioContainer) {
            bioContainer.innerHTML = `<p>${newBio}</p>`;
        }

        alert('Bio updated successfully!');
    } catch (error) {
        console.error('Error updating bio:', error);
        alert('Failed to update bio: ' + error.message);
    }
}

async function addArtistSong(artist) {
    if (!isCurrentUserAdmin()) {
        alert('Admin access required.');
        return;
    }

    const spotifyUrl = prompt(`Enter Spotify track URL for ${artist}:\n(e.g. https://open.spotify.com/track/TRACK_ID)`);
    if (!spotifyUrl) return;

    const title = prompt('Enter song title:');
    if (!title) return;

    if (typeof firebase === 'undefined' || !firebase.firestore) {
        alert('Firebase not configured.');
        return;
    }

    try {
        await firebase.firestore().collection('songs').add({
            title: title,
            artist: artist,
            spotifyLink: spotifyUrl,
            releaseDate: new Date().toISOString(),
            createdAt: new Date().toISOString()
        });

        alert('Song added! Reload the page to see it.');
    } catch (error) {
        console.error('Error adding song:', error);
        alert('Failed to add song: ' + error.message);
    }
}

async function addArtistVideo(artist) {
    if (!isCurrentUserAdmin()) {
        alert('Admin access required.');
        return;
    }

    const youtubeUrl = prompt(`Enter YouTube URL for ${artist}:`);
    if (!youtubeUrl) return;

    const title = prompt('Enter video title:');
    if (!title) return;

    const youtubeId = extractYouTubeId(youtubeUrl);
    if (!youtubeId) {
        alert('Invalid YouTube URL');
        return;
    }

    if (typeof firebase === 'undefined' || !firebase.firestore) {
        alert('Firebase not configured.');
        return;
    }

    try {
        await firebase.firestore().collection('videos').add({
            title: title,
            artist: artist,
            youtubeUrl: youtubeUrl,
            youtubeId: youtubeId,
            releaseDate: new Date().toISOString(),
            createdAt: new Date().toISOString()
        });

        alert('Video added! Reload the page to see it.');
    } catch (error) {
        console.error('Error adding video:', error);
        alert('Failed to add video: ' + error.message);
    }
}

function extractYouTubeId(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : null;
}

function isCurrentUserAdmin() {
    if (typeof currentUser === 'undefined' || !currentUser) return false;
    const ADMIN_EMAILS = [
        'torrancegreen22@yahoo.com',
        'jaybandobaby4@gmail.com',
        'beats4bblazo@gmail.com'
    ];
    return ADMIN_EMAILS.includes(currentUser.email.toLowerCase());
}

// Make functions globally available (called from HTML onclick)
window.editBio = editBio;
window.addArtistSong = addArtistSong;
window.addArtistVideo = addArtistVideo;
