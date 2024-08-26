document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const playPauseButton = document.getElementById('play-pause');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const progressBar = document.getElementById('progress-bar');
    const progress = document.getElementById('progress');
    const progressContainer = document.querySelector('.progress-container');
    const volumeControl = document.getElementById('volume');
    const scrollableSongList = document.getElementById('scrollable-song-list');
    const menuButton = document.getElementById('menu-button');
    const songListPopup = document.getElementById('song-list-popup');
    const closePopupButton = document.getElementById('close-popup');
    const albumArt = document.getElementById('album-art');
    const themeToggle = document.getElementById('theme-toggle');
    const searchInput = document.getElementById('search-input');
    const playlistButton = document.getElementById('playlist-button');
    const playlistPopup = document.getElementById('playlist-popup');
    const closePlaylistPopupButton = document.getElementById('close-playlist-popup');
    const playlist = document.getElementById('playlist');
    const playlistSearchInput = document.getElementById('playlist-search-input');
    const lyricsContent = document.getElementById('lyrics-content');
    const songInfo = document.getElementById('song-info');

    let songList = [];
    let playlistArray = [];
    let currentSongIndex = 0;

    // Fetch songs from the provided API
    const apiURL = 'https://api.github.com/repos/SJKkumar/Music/contents/songs';

    fetch(apiURL)
        .then(response => response.json())
        .then(files => {
            files.forEach(file => {
                if (file.name.endsWith('.mp3')) {
                    const songTitle = decodeURIComponent(file.name.replace('.mp3', ''));
                    const songItem = createSongItem(file.download_url, songTitle);
                    scrollableSongList.appendChild(songItem);
                    songList.push({ url: file.download_url, title: songTitle });
                }
            });
            if (songList.length > 0) {
                updateSong(songList[0].url, songList[0].title);
            }
        })
        .catch(error => console.error('Error fetching song list:', error));

    // Create song list item
    function createSongItem(url, title) {
        const songItem = document.createElement('a');
        songItem.href = '#';
        songItem.textContent = title;
        songItem.addEventListener('click', (e) => {
            e.preventDefault();
            updateSong(url, title);
        });
        return songItem;
    }

    // Update song and metadata
    function updateSong(songUrl, songTitle) {
        audioPlayer.src = songUrl;
        audioPlayer.play();
        playPauseButton.textContent = '⏸️';
        albumArt.src = 'default-image.jpg'; // Placeholder for album art
        songInfo.textContent = songTitle;
        fetchSongData(songUrl);
    }

    // Fetch song metadata and lyrics
    function fetchSongData(songUrl) {
        // Placeholder logic for fetching metadata and lyrics
        lyricsContent.textContent = 'Lyrics are currently unavailable.';
    }

    // Update playlist display
    function updatePlaylist() {
        playlist.innerHTML = playlistArray.map(song => `
            <div class="playlist-item">${song}</div>
        `).join('');
    }

    // Filter and update song list
    function filterSongs(query) {
        const filteredSongs = songList.filter(song => song.title.toLowerCase().includes(query.toLowerCase()));
        scrollableSongList.innerHTML = filteredSongs.map(song => createSongItem(song.url, song.title).outerHTML).join('');
    }

    // Filter and update playlist
    function filterPlaylist(query) {
        const filteredPlaylist = playlistArray.filter(song => song.toLowerCase().includes(query.toLowerCase()));
        playlist.innerHTML = filteredPlaylist.map(song => `<div class="playlist-item">${song}</div>`).join('');
    }

    // Event listeners
    playPauseButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseButton.textContent = '⏸️';
        } else {
            audioPlayer.pause();
            playPauseButton.textContent = '▶️';
        }
    });

    prevButton.addEventListener('click', () => {
        if (songList.length > 0) {
            currentSongIndex = (currentSongIndex - 1 + songList.length) % songList.length;
            updateSong(songList[currentSongIndex].url, songList[currentSongIndex].title);
        }
    });

    nextButton.addEventListener('click', () => {
        if (songList.length > 0) {
            currentSongIndex = (currentSongIndex + 1) % songList.length;
            updateSong(songList[currentSongIndex].url, songList[currentSongIndex].title);
        }
    });

    volumeControl.addEventListener('input', () => {
        audioPlayer.volume = volumeControl.value;
    });

    audioPlayer.addEventListener('timeupdate', () => {
        if (audioPlayer.duration) {
            const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progress.style.width = percentage + '%';
            progressBar.style.width = percentage + '%';
        }
    });

    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const percentage = (offsetX / progressContainer.offsetWidth) * 100;
        progress.style.width = percentage + '%';
        progressBar.style.width = percentage + '%';
        audioPlayer.currentTime = (percentage / 100) * audioPlayer.duration;
    });

    menuButton.addEventListener('click', () => {
        songListPopup.style.display = 'block';
    });

    closePopupButton.addEventListener('click', () => {
        songListPopup.style.display = 'none';
    });

    playlistButton.addEventListener('click', () => {
        playlistPopup.style.display = 'block';
    });

    closePlaylistPopupButton.addEventListener('click', () => {
        playlistPopup.style.display = 'none';
    });

    searchInput.addEventListener('input', () => {
        filterSongs(searchInput.value);
    });

    playlistSearchInput.addEventListener('input', () => {
        filterPlaylist(playlistSearchInput.value);
    });

    // Add song to playlist
    function addToPlaylist(songTitle) {
        if (!playlistArray.includes(songTitle)) {
            playlistArray.push(songTitle);
            updatePlaylist();
        }
    }

    // Example function call to add song to playlist
    // You would need to hook this up to an actual UI event for adding songs to the playlist
    // addToPlaylist('Example Song Title');
});
