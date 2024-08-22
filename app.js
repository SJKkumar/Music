document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const playPauseButton = document.getElementById('play-pause');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const progressBar = document.getElementById('progress-bar');
    const progress = document.getElementById('progress');
    const progressContainer = document.querySelector('.progress-container');
    const volumeControl = document.getElementById('volume');
    const songSelector = document.getElementById('song-selector');
    const menuButton = document.getElementById('menu-button');
    const songListPopup = document.getElementById('song-list-popup');
    const closePopupButton = document.getElementById('close-popup');

    // GitHub API URL to fetch the list of files in the 'songs' directory
    const apiURL = 'https://api.github.com/repos/SJKkumar/Music/contents/songs';
    let songList = [];
    let currentSongIndex = 0;

    // Fetch the list of songs from the GitHub API
    fetch(apiURL)
        .then(response => response.json())
        .then(files => {
            files.forEach(file => {
                if (file.name.endsWith('.mp3')) { // Only add .mp3 files
                    const option = document.createElement('option');
                    option.value = file.download_url;
                    option.textContent = file.name.replace('.mp3', ''); // Display name without the .mp3 extension
                    songSelector.appendChild(option);
                    songList.push(file.download_url);
                }
            });

            // Set initial song
            if (songList.length > 0) {
                audioPlayer.src = songList[0];
            }
        })
        .catch(error => console.error('Error fetching song list:', error));

    // Play/Pause Button Toggle
    playPauseButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseButton.textContent = '⏸️';
            playPauseButton.classList.add('playing');
        } else {
            audioPlayer.pause();
            playPauseButton.textContent = '▶️';
            playPauseButton.classList.remove('playing');
        }
    });

    // Previous Song
    prevButton.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex > 0) ? currentSongIndex - 1 : songList.length - 1;
        audioPlayer.src = songList[currentSongIndex];
        audioPlayer.play();
        playPauseButton.textContent = '⏸️';
    });

    // Next Song
    nextButton.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex < songList.length - 1) ? currentSongIndex + 1 : 0;
        audioPlayer.src = songList[currentSongIndex];
        audioPlayer.play();
        playPauseButton.textContent = '⏸️';
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
        const rect = progress
