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
    const lyricsContainer = document.getElementById('lyrics-container');
    const lyricsText = document.getElementById('lyrics-text');
    const themeToggle = document.getElementById('theme-toggle');
    const themeOptions = document.querySelectorAll('.theme-option');
    const playlistButton = document.getElementById('create-playlist');
    const playlistContainer = document.getElementById('playlist-container');

    const apiURL = 'https://api.github.com/repos/SJKkumar/Music/contents/songs';
    let songList = [];
    let currentSongIndex = 0;
    let playlists = {};

    fetch(apiURL)
        .then(response => response.json())
        .then(files => {
            files.forEach(file => {
                if (file.name.endsWith('.mp3')) {
                    const songItem = document.createElement('a');
                    songItem.href = file.download_url;
                    songItem.textContent = decodeSongName(file.name);
                    songItem.addEventListener('click', (e) => {
                        e.preventDefault();
                        updateSong(file.download_url, file.name);
                    });
                    scrollableSongList.appendChild(songItem);
                    songList.push(file.download_url);
                }
            });

            if (songList.length > 0) {
                updateSong(songList[0], songList[0]);
            }
        })
        .catch(error => console.error('Error fetching song list:', error));

    function decodeSongName(name) {
        return decodeURIComponent(name.replace('.mp3', ''));
    }

    function updateSong(songUrl, songTitle) {
        audioPlayer.src = songUrl;
        audioPlayer.play();
        playPauseButton.textContent = '⏸️';
        albumArt.src = 'default-image.jpg'; // Placeholder for album art
        lyricsText.textContent = 'Fetching lyrics...'; // Placeholder for lyrics
        fetchLyrics(songTitle);
    }

    function fetchLyrics(songTitle) {
        const lyricsAPI = `https://api.lyrics.ovh/v1/Artist/${encodeURIComponent(songTitle)}`;
        fetch(lyricsAPI)
            .then(response => response.json())
            .then(data => {
                lyricsText.textContent = data.lyrics || 'No lyrics available';
            })
            .catch(() => {
                lyricsText.textContent = 'No lyrics available';
            });
    }

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
        currentSongIndex = (currentSongIndex > 0) ? currentSongIndex - 1 : songList.length - 1;
        updateSong(songList[currentSongIndex], decodeSongName(songList[currentSongIndex]));
    });

    nextButton.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex < songList.length - 1) ? currentSongIndex + 1 : 0;
        updateSong(songList[currentSongIndex], decodeSongName(songList[currentSongIndex]));
    });

    audioPlayer.addEventListener('timeupdate', () => {
        if (audioPlayer.duration) {
            const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progress.style.width = percent + '%';
            progressBar.style.width = percent + '%';
        }
    });

    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const width = rect.width;
        const percent = (offsetX / width);
        const newTime = percent * audioPlayer.duration;
        audioPlayer.currentTime = newTime;
    });

    volumeControl.addEventListener('input', () => {
        audioPlayer.volume = volumeControl.value;
    });

    menuButton.addEventListener('click', () => {
        songListPopup.style.display = songListPopup.style.display === 'none' ? 'block' : 'none';
    });

    closePopupButton.addEventListener('click', () => {
        songListPopup.style.display = 'none';
    });

    playlistButton.addEventListener('click', () => {
        const playlistName = prompt('Enter playlist name:');
        if (playlistName) {
            createPlaylist(playlistName);
            const playlistItem = document.createElement('div');
            playlistItem.textContent = playlistName;
            playlistItem.className = 'playlist-item';
            playlistContainer.appendChild(playlistItem);
        }
    });

    function createPlaylist(name) {
        playlists[name] = [];
    }

    function addToPlaylist(playlistName, songUrl) {
        if (playlists[playlistName]) {
            playlists[playlistName].push(songUrl);
        }
    }

    function loadPlaylist(playlistName) {
        if (playlists[playlistName]) {
            currentSongIndex = 0;
            audioPlayer.src = playlists[playlistName][currentSongIndex];
            audioPlayer.play();
            playPauseButton.textContent = '⏸️';
        }
    }

    audioPlayer.addEventListener('ended', () => {
        nextButton.click();
    });

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLightTheme = document.body.classList.contains('light-theme');
        themeToggle.textContent = isLightTheme ? '🌙' : '☀️';
    });

    themeOptions.forEach(button => {
        button.addEventListener('click', (e) => {
            const theme = e.target.getAttribute('data-theme');
            document.body.className = theme === 'dark' ? '' : 'light-theme';
        });
    });

    volumeControl.value = audioPlayer.volume;
});
