document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = new Audio();
    const playButton = document.getElementById('play');
    const nextButton = document.getElementById('next');
    const prevButton = document.getElementById('prev');
    const progressBar = document.getElementById('progress-bar');
    const playlistElement = document.getElementById('playlist');
    const titleElement = document.getElementById('title');
    const artistElement = document.getElementById('artist');
    const coverElement = document.getElementById('cover');

    let currentSongIndex = 0;
    let songs = [
        { title: 'Song 1', artist: 'Artist 1', src: 'songs/song1.mp3', cover: 'covers/cover1.jpg' },
        { title: 'Song 2', artist: 'Artist 2', src: 'songs/song2.mp3', cover: 'covers/cover2.jpg' },
        { title: 'Song 3', artist: 'Artist 3', src: 'songs/song3.mp3', cover: 'covers/cover3.jpg' },
    ];

    function loadSong(song) {
        audioPlayer.src = song.src;
        titleElement.textContent = song.title;
        artistElement.textContent = song.artist;
        coverElement.src = song.cover;
    }

    function playSong() {
        audioPlayer.play();
        playButton.innerHTML = '<i class="fas fa-pause"></i>Pause';
    }

    function pauseSong() {
        audioPlayer.pause();
        playButton.innerHTML = '<i class="fas fa-play"></i>Play';
    }

    function nextSong() {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(songs[currentSongIndex]);
        playSong();
    }

    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(songs[currentSongIndex]);
        playSong();
    }

    function renderPlaylist() {
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.textContent = `${song.title} - ${song.artist}`;
            li.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(song);
                playSong();
            });
            playlistElement.appendChild(li);
        });
    }

    playButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            playSong();
        } else {
            pauseSong();
        }
    });

    nextButton.addEventListener('click', nextSong);
    prevButton.addEventListener('click', prevSong);

    audioPlayer.addEventListener('timeupdate', () => {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progressPercent;
    });

    progressBar.addEventListener('input', () => {
        const newTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = newTime;
    });

    loadSong(songs[currentSongIndex]);
    renderPlaylist();
});
