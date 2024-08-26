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
    const lyricsContent = document.getElementById('lyrics-content');
    const addToPlaylistButton = document.getElementById('add-to-playlist');
    const playlistPopup = document.getElementById('playlist-popup');
    const closePlaylistPopupButton = document.getElementById('close-playlist-popup');
    const playlist = document.getElementById('playlist');

    const playlistArray = []; // Array to hold playlist items

    const apiURL = 'https://api.github.com/repos/SJKkumar/MusicPlayer';

    // Theme toggling
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        themeToggle.textContent = document.body.classList.contains('light-theme') ? '🌞' : '🌙';
    });

    // Open/close song list popup
    menuButton.addEventListener('click', () => {
        songListPopup.style.display = 'block';
        populateSongList();
    });

    closePopupButton.addEventListener('click', () => {
        songListPopup.style.display = 'none';
    });

    // Open/close playlist popup
    addToPlaylistButton.addEventListener('click', () => {
        playlistPopup.style.display = 'block';
        populatePlaylist();
    });

    closePlaylistPopupButton.addEventListener('click', () => {
        playlistPopup.style.display = 'none';
    });

    // Play/pause button functionality
    playPauseButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseButton.textContent = '⏸️';
        } else {
            audioPlayer.pause();
            playPauseButton.textContent = '▶️';
        }
    });

    // Previous and Next buttons
    prevButton.addEventListener('click', () => {
        // Handle previous track
    });

    nextButton.addEventListener('click', () => {
        // Handle next track
    });

    // Volume control
    volumeControl.addEventListener('input', () => {
        audioPlayer.volume = volumeControl.value;
    });

    // Update progress bar
    audioPlayer.addEventListener('timeupdate', () => {
        const percentage = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progress.style.width = percentage + '%';
        progressBar.style.width = percentage + '%';
    });

    // Click on progress bar to seek
    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const percentage = (offsetX / progressContainer.offsetWidth) * 100;
        progress.style.width = percentage + '%';
        progressBar.style.width = percentage + '%';
        audioPlayer.currentTime = (percentage / 100) * audioPlayer.duration;
    });

    // Populate song list
    function populateSongList() {
        // Fetch and display song list from API or local data
    }

    // Populate playlist
    function populatePlaylist() {
        playlist.innerHTML = playlistArray.map(song => `
            <div class="playlist-item">${song}</div>
        `).join('');
    }

    // Fetch MP3 metadata and lyrics
    function fetchSongData() {
        // Use an API or library to extract song metadata and lyrics
    }
});
