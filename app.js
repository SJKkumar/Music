document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = new Audio();
    const playPauseButton = document.getElementById('play-pause');
    const nextButton = document.getElementById('next');
    const prevButton = document.getElementById('prev');
    const progressBar = document.getElementById('progress-bar');
    const volumeControl = document.getElementById('volume');
    const playlistPopup = document.getElementById('playlist-popup');
    const playlistElement = document.getElementById('playlist');

    let currentSongIndex = 0;

    const songs = [
        // List of songs
        'https://raw.githubusercontent.com/SJKkumar/Music/main/songs/Makkamishi.mp3',
        'https://raw.githubusercontent.com/SJKkumar/Music/main/songs/Aasa%20Kooda.mp3',
        'https://raw.githubusercontent.com/SJKkumar/Music/main/songs/Kanave%20Kanave.mp3'
        // Add more songs here
    ];

    // Populate the playlist
    songs.forEach((song, index) => {
        const songName = song.split('/').pop(); // Extracts song name from URL
        const li = document.createElement('li');
        li.textContent = songName.replace(/%20/g, ' '); // Replace '%20' with space
        li.addEventListener('click', () => {
            currentSongIndex = index;
            loadSong(songs[currentSongIndex]);
            playSong();
        });
        playlistElement.appendChild(li);
    });

    function loadSong(song) {
        audioPlayer.src = song;
    }

    function playSong() {
        audioPlayer.play();
        playPauseButton.textContent = '⏸️';
    }

    function pauseSong() {
        audioPlayer.pause();
        playPauseButton.textContent = '▶️';
    }

    playPauseButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            playSong();
        } else {
            pauseSong();
        }
    });

    nextButton.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(songs[currentSongIndex]);
        playSong();
    });

    prevButton.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(songs[currentSongIndex]);
        playSong();
    });

    audioPlayer.addEventListener('timeupdate', () => {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progress;
    });

    progressBar.addEventListener('input', () => {
        const seekTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = seekTime;
    });

    volumeControl.addEventListener('input', () => {
        audioPlayer.volume = volumeControl.value;
    });

    document.querySelector('.hamburger-menu').addEventListener('click', () => {
        playlistPopup.classList.toggle('visible');
        playlistPopup.classList.toggle('hidden');
    });

    // Load the first song initially
    loadSong(songs[currentSongIndex]);
});