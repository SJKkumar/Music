document.addEventListener('DOMContentLoaded', async () => {
    const audioPlayer = new Audio();
    const playPauseButton = document.getElementById('play-pause');
    const nextButton = document.getElementById('next');
    const prevButton = document.getElementById('prev');
    const progressBar = document.getElementById('progress-bar');
    const volumeControl = document.getElementById('volume');
    const playlistElement = document.getElementById('playlist');

    const playPauseFooterButton = document.getElementById('play-pause-footer');
    const nextFooterButton = document.getElementById('next-footer');
    const prevFooterButton = document.getElementById('prev-footer');
    const progressBarFooter = document.getElementById('progress-bar-footer');
    const volumeFooterControl = document.getElementById('volume-footer');
    const songTitleElement = document.getElementById('song-title');
    const songArtistElement = document.getElementById('song-artist');

    let currentSongIndex = 0;
    let songs = [];

    // GitHub API to fetch the list of songs
    const repoOwner = "SJKkumar";
    const repoName = "Music";
    const directoryPath = "songs";

    async function fetchSongs() {
        const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/contents/${directoryPath}`);
        const files = await response.json();
        return files
            .filter(file => file.name.endsWith('.mp3'))
            .map(file => ({
                title: file.name.replace('.mp3', ''),
                artist: 'Unknown Artist', // Default artist name, you can customize it
                src: file.download_url
            }));
    }

    async function loadSongs() {
        songs = await fetchSongs();
        loadSong(songs[currentSongIndex]);
        renderPlaylist();
    }

    function loadSong(song) {
        audioPlayer.src = song.src;
        songTitleElement.textContent = song.title;
        songArtistElement.textContent = song.artist;
    }

    function playSong() {
        audioPlayer.play();
        playPauseButton.textContent = '⏸️';
        playPauseFooterButton.textContent = '⏸️';
    }

    function pauseSong() {
        audioPlayer.pause();
        playPauseButton.textContent = '▶️';
        playPauseFooterButton.textContent = '▶️';
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
        playlistElement.innerHTML = ''; // Clear existing playlist
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

    playPauseButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            playSong();
        } else {
            pauseSong();
        }
    });

    nextButton.addEventListener('click', nextSong);
    prevButton.addEventListener('click', prevSong);

    playPauseFooterButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            playSong();
        } else {
            pauseSong();
        }
    });

    nextFooterButton.addEventListener('click', nextSong);
    prevFooterButton.addEventListener('click', prevSong);

    audioPlayer.addEventListener('timeupdate', () => {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progressPercent;
        progressBarFooter.value = progressPercent;
    });

    progressBar.addEventListener('input', () => {
        const newTime = (progressBar.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = newTime;
    });

    progressBarFooter.addEventListener('input', () => {
        const newTime = (progressBarFooter.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = newTime;
    });

    volumeControl.addEventListener('input', () => {
        audioPlayer.volume = volumeControl.value;
        volumeFooterControl.value = volumeControl.value;
    });

    volumeFooterControl.addEventListener('input', () => {
        audioPlayer.volume = volumeFooterControl.value;
        volumeControl.value = volumeFooterControl.value;
    });

    // Load songs when the page is loaded
    loadSongs();
});
