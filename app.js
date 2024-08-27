document.addEventListener('DOMContentLoaded', () => {
    const audio = new Audio();
    let songIndex = 0;

    const songs = [
        // Will be populated dynamically
    ];

    const songListElement = document.getElementById('song-list');
    const songNameElement = document.getElementById('song-name');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeElement = document.getElementById('current-time');
    const durationElement = document.getElementById('duration');

    // Fetch songs from GitHub repository
    fetchSongs();

    function fetchSongs() {
        fetch('https://api.github.com/repos/SJKkumar/Music/contents/songs')
            .then(response => response.json())
            .then(data => {
                data.forEach((file, index) => {
                    if (file.name.endsWith('.mp3')) {
                        songs.push(file.download_url);
                        const li = document.createElement('li');
                        li.textContent = file.name.replace('.mp3', '');
                        li.addEventListener('click', () => loadSong(index));
                        songListElement.appendChild(li);
                    }
                });
                loadSong(songIndex);
            });
    }

    function loadSong(index) {
        songIndex = index;
        audio.src = songs[songIndex];
        songNameElement.textContent = songListElement.children[songIndex].textContent;
        playPauseBtn.innerHTML = '&#9658;';
        audio.play();
        updateProgress();
    }

    function updateProgress() {
        progressBar.value = (audio.currentTime / audio.duration) * 100;
        currentTimeElement.textContent = formatTime(audio.currentTime);
        durationElement.textContent = formatTime(audio.duration);

        if (!audio.paused) {
            requestAnimationFrame(updateProgress);
        }
    }

    function formatTime(time) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            playPauseBtn.innerHTML = '&#10074;&#10074;';
        } else {
            audio.pause();
            playPauseBtn.innerHTML = '&#9658;';
        }
    });

    prevBtn.addEventListener('click', () => {
        songIndex = (songIndex > 0) ? songIndex - 1 : songs.length - 1;
        loadSong(songIndex);
    });

    nextBtn.addEventListener('click', () => {
        songIndex = (songIndex < songs.length - 1) ? songIndex + 1 : 0;
        loadSong(songIndex);
    });

    audio.addEventListener('timeupdate', updateProgress);

    progressBar.addEventListener('input', () => {
        audio.currentTime = (progressBar.value / 100) * audio.duration;
        updateProgress();
    });
});
