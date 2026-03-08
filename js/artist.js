// Great Minds Creating - Artist Pages
// Artist-specific functionality

// ============================================
// LOAD ARTIST DATA
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    loadArtistContent();
});

async function loadArtistContent() {
    // Get artist name from page title or URL
    const pageTitle = document.title;
    let artistName = '';

    if (pageTitle.includes('Jay Bando Baby')) {
        artistName = 'Jay Bando Baby';
    } else if (pageTitle.includes('B Blazo')) {
        artistName = 'B Blazo';
    } else if (pageTitle.includes('Cash Create')) {
        artistName = 'Cash Create';
    }

    if (!artistName) return;

    try {
        // Load artist bio
        await loadArtistBio(artistName);

        // Load artist songs
        await loadArtistSongs(artistName);

        // Load artist videos
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

    try {
        if (typeof firebase !== 'undefined' && firebase.firestore) {
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

    try {
        if (typeof firebase !== 'undefined' && firebase.firestore) {
            const snapshot = await firebase.firestore()
                .collection('songs')
                .where('artist', '==', artistName)
                .orderBy('createdAt', 'desc')
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

    try {
        if (typeof firebase !== 'undefined' && firebase.firestore) {
            const snapshot = await firebase.firestore()
                .collection('videos')
                .where('artist', '==', artistName)
                .orderBy('createdAt', 'desc')
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
