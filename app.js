document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const playPauseButton = document.getElementById('play-pause');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeElem = document.getElementById('current-time');
    const durationElem = document.getElementById('duration');
    const songTitleElem = document.getElementById('song-title');
    const coverImageElem = document.getElementById('cover-image');
    const songListElem = document.getElementById('song-list');
    const searchInput = document.getElementById('search');

    let songs = [];
    let currentSongIndex = 0;

    // Fetch songs from the GitHub repository
    async function fetchSongs() {
        try {
            const response = await fetch('https://api.github.com/repos/SJKkumar/Music/contents/songs');
            const data = await response.json();
            songs = data.filter(file => file.name.endsWith('.mp3'));
            renderSongList(songs);
            loadSong(songs[currentSongIndex]);
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    }

    // Render song list
    function renderSongList(songs) {
        songListElem.innerHTML = songs.map((song, index) => `<li data-index="${index}">${song.name}</li>`).join('');
    }

    // Load song
    function loadSong(song) {
        audioPlayer.src = song.download_url;
        songTitleElem.textContent = song.name.replace('.mp3', '');
        // Fetch embedded image (if available) or use default
        loadCoverArt(song.download_url);
    }

    // Load cover art from MP3 (embedded image)
    async function loadCoverArt(url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const blob = new Blob([arrayBuffer], { type: 'audio/mpeg' });
        const audio = new Audio(URL.createObjectURL(blob));
        audio.addEventListener('loadedmetadata', () => {
            if (audio.mozGetMetaData && audio.mozGetMetaData('coverArt')) {
                coverImageElem.src = URL.createObjectURL(audio.mozGetMetaData('coverArt')[0]);
            } else {
                coverImageElem.src = 'default-image.jpg';
            }
        });
    }

    // Play/Pause Button Toggle
    playPauseButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseButton.innerHTML = '&#10074;&#10074;'; // Pause icon
        } else {
            audioPlayer.pause();
            playPauseButton.innerHTML = '&#9654;'; // Play icon
        }
    });

    // Next Button
    nextButton.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(songs[currentSongIndex]);
        audioPlayer.play();
    });

    // Previous Button
    prevButton.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(songs[currentSongIndex]);
        audioPlayer.play();
    });

    // Update Progress Bar
    audioPlayer.addEventListener('timeupdate', () => {
        if (audioPlayer.duration) {
            const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progressBar.value = progressPercent;
            currentTimeElem.textContent = formatTime(audioPlayer.currentTime);
            durationElem.textContent = formatTime(audioPlayer.duration);
        }
    });

    // Seek Functionality
    progressBar.addEventListener('input', () => {
        const seekTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    });

    // Format time (MM:SS)
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Click on Song from List
    songListElem.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
            currentSongIndex = parseInt(e.target.getAttribute('data-index'));
            loadSong(songs[currentSongIndex]);
            audioPlayer.play();
        }
    });

    // Filter Songs (Search)
    searchInput.addEventListener('input', () => {
       
