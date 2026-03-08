// Great Minds Creating - Recent Drops
// Load and display recent releases from Firestore

// ============================================
// LOAD RECENT DROPS
// ============================================

async function loadRecentDrops() {
    const container = document.getElementById('latestDrops');

    if (!container) return;

    if (typeof firebase === 'undefined' || !firebase.firestore) {
        console.log('Firebase not available, showing placeholder');
        showPlaceholderDrops(container);
        return;
    }

    try {
        const snapshot = await firebase.firestore()
            .collection('songs')
            .orderBy('releaseDate', 'desc')
            .limit(3)
            .get();

        if (snapshot.empty) {
            console.log('No releases found');
            showPlaceholderDrops(container);
            return;
        }

        // Clear container
        container.innerHTML = '';

        // Add each release
        snapshot.forEach(doc => {
            const release = doc.data();
            const card = createDropCard(release);
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading recent drops:', error);
        showPlaceholderDrops(container);
    }
}

// ============================================
// CREATE DROP CARD
// ============================================

function createDropCard(release) {
    const card = document.createElement('div');
    card.className = 'drop-card';

    // Cover image
    if (release.coverImage) {
        const cover = document.createElement('div');
        cover.className = 'drop-cover';
        cover.style.cssText = 'aspect-ratio: 1; overflow: hidden; border-radius: 10px; margin-bottom: 1rem;';

        const img = document.createElement('img');
        img.src = release.coverImage;
        img.alt = release.title;
        img.style.cssText = 'width: 100%; height: 100%; object-fit: cover;';

        cover.appendChild(img);
        card.appendChild(cover);
    }

    // Release info
    const info = document.createElement('div');
    info.className = 'drop-info';
    info.style.cssText = 'padding: 1rem;';

    const title = document.createElement('h3');
    title.textContent = release.title;
    title.style.cssText = 'color: var(--text-white); margin-bottom: 0.5rem; font-size: 1.1rem;';

    const artist = document.createElement('p');
    artist.textContent = release.artist;
    artist.style.cssText = 'color: var(--text-gray); margin-bottom: 0.5rem;';

    const type = document.createElement('p');
    type.textContent = release.releaseType || 'Release';
    type.style.cssText = 'color: var(--primary-orange); font-size: 0.9rem; margin-bottom: 1rem;';

    info.appendChild(title);
    info.appendChild(artist);
    info.appendChild(type);

    // Links
    const linksDiv = document.createElement('div');
    linksDiv.style.cssText = 'display: flex; gap: 0.5rem; flex-wrap: wrap;';

    if (release.spotifyLink) {
        const spotifyBtn = document.createElement('a');
        spotifyBtn.href = release.spotifyLink;
        spotifyBtn.target = '_blank';
        spotifyBtn.className = 'btn-primary';
        spotifyBtn.style.cssText = 'padding: 0.5rem 1rem; font-size: 0.9rem; text-decoration: none; display: inline-block;';
        spotifyBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style="vertical-align: middle; margin-right: 5px;">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Spotify
        `;
        linksDiv.appendChild(spotifyBtn);
    }

    if (release.appleMusicLink) {
        const appleBtn = document.createElement('a');
        appleBtn.href = release.appleMusicLink;
        appleBtn.target = '_blank';
        appleBtn.className = 'btn-secondary';
        appleBtn.style.cssText = 'padding: 0.5rem 1rem; font-size: 0.9rem; text-decoration: none; display: inline-block; background: var(--mid-gray); color: var(--text-white);';
        appleBtn.textContent = 'Apple Music';
        linksDiv.appendChild(appleBtn);
    }

    info.appendChild(linksDiv);
    card.appendChild(info);

    return card;
}

// ============================================
// PLACEHOLDER DROPS
// ============================================

function showPlaceholderDrops(container) {
    container.innerHTML = `
        <div class="drop-card">
            <div class="drop-embed">
                <iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/4iV5W9uYEdYUVa79Axb7Rh?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
            </div>
            <div class="drop-info">
                <h3>Latest Track</h3>
                <p>Great Minds Creating</p>
            </div>
        </div>
    `;
}

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    loadRecentDrops();
});
