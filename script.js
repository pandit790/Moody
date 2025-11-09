// script.js (Single Video Logic के लिए केवल फ़ंक्शन्स अपडेट करें)

// ----------------------------------------------------
// ग्लोबल कॉन्फ़िगरेशन (वही रहेगा)
// ----------------------------------------------------
const API_BASE_URL = 'http://127.0.0.1:5000/api';

// ... (बाकी DOM एलिमेंट्स और यूटिलिटी फंक्शन्स वही रहेंगे) ...


// ----------------------------------------------------
// 3. मूड सेलेक्शन और प्लेलिस्ट डिस्प्ले हैंडलर (API Call Update)
// ----------------------------------------------------

// fetchPlaylistFromAPI को बदलें:
async function fetchPlaylistFromAPI(mood) {
    playlistContainer.innerHTML = `<p>Searching for ${mood} music...</p>`;

    try {
        const response = await fetch(`${API_BASE_URL}/get_playlist`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ mood: mood })
        });
        const data = await response.json();
        
        if (response.ok) {
            // data.videoId को पास करें
            displayVideo(data.title, data.videoId); 
        } else {
            playlistContainer.innerHTML = `<p style="color:red;">Error: ${data.error || 'Failed to fetch video.'}</p>`;
        }
    } catch (error) {
        playlistContainer.innerHTML = `<p style="color:red;">Network Error: Could not connect to Flask server (Is app.py running?).</p>`;
    }
}


// ----------------------------------------------------
// 4. यूजर सर्च हैंडलर (API Call Update)
// ----------------------------------------------------

searchForm.addEventListener('submit', async (e) => {
    // ... (लॉगिन चेक और query चेक वही रहेगा) ...
    if (query) {
        moodButtons.forEach(btn => btn.classList.remove('active', 'mood-dim')); 
        fetchSearchVideo(query); // फंक्शन का नाम बदल दिया
        searchInput.value = ''; 
    } else {
        alert('Please enter a search term.');
    }
});

// fetchSearchPlaylist को fetchSearchVideo में बदल दिया
async function fetchSearchVideo(query) {
    playlistContainer.innerHTML = `<p>Searching YouTube for: <b>${query}</b>...</p>`;
    document.querySelector('.search-btn').textContent = 'Searching...';

    try {
        const response = await fetch(`${API_BASE_URL}/search_playlist`, { 
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ query: query })
        });
        const data = await response.json();
        
        if (response.ok) {
            // data.videoId को पास करें
            displayVideo(data.title, data.videoId);
        } else {
            playlistContainer.innerHTML = `<p style="color:red;">Error: ${data.error || 'Failed to fetch search results.'}</p>`;
        }
    } catch (error) {
        playlistContainer.innerHTML = `<p style="color:red;">Network Error: Could not connect to Flask server.</p>`;
    } finally {
        document.querySelector('.search-btn').textContent = 'Search';
    }
}


// ----------------------------------------------------
// 5. वीडियो एम्बेड करने का फ़ंक्शन (नाम बदला और लॉजिक सिंगल वीडियो के लिए)
// ----------------------------------------------------
function displayVideo(title, videoId) {
    // सिंगल वीडियो एम्बेड URL का उपयोग करें
    const embedSrc = `https://www.youtube.com/embed/${videoId}?autoplay=1`;

    const youtubeEmbedCode = `
        <div class="youtube-embed-wrapper">
            <h3>Now Playing: ${title}</h3>
            <iframe 
                width="100%" 
                height="450" 
                src="${embedSrc}" 
                frameborder="0" 
                allow="autoplay; autoplay; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        </div>
    `;
    playlistContainer.innerHTML = youtubeEmbedCode;
}


// ----------------------------------------------------
// 6. इनिशियलाइज़ेशन (वही रहेगा)
// ----------------------------------------------------
// ...