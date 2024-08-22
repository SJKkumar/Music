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
    const noAlbumArt = document.getElementById('no-album-art');
    const songName = document.getElementById('song-name');
    const themeToggle = document.getElementById('theme-toggle');

    const apiURL = 'https://api.github.com/repos/SJKkumar/Music/contents/songs';
    let songList = [];
    let currentSongIndex = 0;

    // Fetch the list of songs from the GitHub API
    fetch(apiURL)
        .then(response => response.json())
        .then(files => {
            files.forEach(file => {
                if (file.name.endsWith('.mp3')) { // Only add .mp3 files
                    const songItem = document.createElement('a');
                    songItem.href = file.download_url;
                    songItem.textContent = decodeURIComponent(file.name.replace('.mp3', '')); // Decode the URL
                    songItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        audioPlayer.src = file.download_url;
                        audioPlayer.play();
                        playPauseButton.textContent = '⏸️';
                        currentSongIndex = songList.indexOf(file.download_url);
                        songName.textContent = decodeURIComponent(file.name.replace('.mp3', '')); // Decode the URL
                        updateAlbumArt(file.download_url); // Update album art if available
                    });
                    scrollableSongList.appendChild(songItem);
                    songList.push(file.download_url);
                }
            });

            // Set initial song
            if (songList.length > 0) {
                audioPlayer.src = songList[0];
                songName.textContent = decodeURIComponent(songList[0].split('/').pop().replace('.mp3', '')); // Decode the URL
                updateAlbumArt(songList[0]);
            }
        })
        .catch(error => console.error('Error fetching song list:', error));

    // Update Album Art
    function updateAlbumArt(songUrl) {
        jsmediatags.read(songUrl, {
            onSuccess: function(tag) {
                const picture = tag.tags.picture;
                if (picture) {
                    const base64String = arrayBufferToBase64(picture.data);
                    const imageUrl = `data:${picture.format};base64,${base64String}`;
                    albumArt.src = imageUrl;
                    noAlbumArt.style.display = 'none';
                } else {
                    albumArt.src = 'default-image.jpg';
                    noAlbumArt.style.display = 'block';
                }
            },
            onError: function() {
                albumArt.src = 'default-image.jpg';
                noAlbumArt.style.display = 'block';
            }
        });
    }

    function arrayBufferToBase64(buffer) {
        let binary = '';
        let bytes = new Uint8Array(buffer);
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    // Play/Pause Button Toggle
    playPauseButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseButton.textContent = '⏸️';
        } else {
            audioPlayer.pause();
            playPauseButton.textContent = '▶️';
        }
    });

    // Previous Song
    prevButton.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex > 0) ? currentSongIndex - 1 : songList.length - 1;
        audioPlayer.src = songList[currentSongIndex];
        audioPlayer.play();
        playPauseButton.textContent = '⏸️';
        songName.textContent = decodeURIComponent(songList[currentSongIndex].split('/').pop().replace('.mp3', '')); // Decode the URL
        updateAlbumArt(songList[currentSongIndex]);
    });

    // Next Song
    nextButton.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex < songList.length - 1) ? currentSongIndex + 1 : 0;
        audioPlayer.src = songList[currentSongIndex];
        audioPlayer.play();
        playPauseButton.textContent = '⏸️';
        songName.textContent = decodeURIComponent(songList[currentSongIndex].split('/').pop().replace('.mp3', '')); // Decode the URL
        updateAlbumArt(songList[currentSongIndex]);
    });

    // Update Progress Bar
    audioPlayer.addEventListener('timeupdate', () => {
        if (audioPlayer.duration) {
            const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progress.style.width = percent + '%';
            progressBar.style.width = percent + '%';
        }
    });

    // Seek Functionality
    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const width = rect.width;
        const percent = (offsetX / width);
        const newTime = percent * audioPlayer.duration;
        audioPlayer.currentTime = newTime;
    });

    // Volume Control
    volumeControl.addEventListener('input', () => {
        audioPlayer.volume = volumeControl.value;
    });

    // Show/Hide Song List Popup
    menuButton.addEventListener('click', () => {
        songListPopup.style.display = songListPopup.style.display === 'none' ? 'block' : 'none';
    });

    closePopupButton.addEventListener('click', () => {
        songListPopup.style.display = 'none';
    });

    // Handle Audio End
    audioPlayer.addEventListener('ended', () => {
        nextButton.click(); // Automatically play next song when the current song ends
    });

    // Theme Toggle
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLightTheme = document.body.classList.contains('light-theme');
        themeToggle.textContent = isLightTheme ? '🌙' : '☀️';
    });

    // Initialize volume control
    volumeControl.value = audioPlayer.volume;
});
