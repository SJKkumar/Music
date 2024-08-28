document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const playPauseButton = document.getElementById('play-pause-button');
    const nextButton = document.getElementById('next-button');
    const prevButton = document.getElementById('prev-button');
    const songList = document.getElementById('song-list');
    const songTitle = document.getElementById('song-title');
    const coverImage = document.getElementById('cover-image');
    const progressBar = document.getElementById('progress-bar');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const searchInput = document.getElementById('search-input');

    let songs = [];
    let currentSongIndex = 0;

    const fetchSongs = async () => {
        const response = await fetch('https://api.github.com/repos/yourusername/yourrepository/contents/music/songs');
        const data = await response.json();
        songs = data.filter(file => file.name.endsWith('.mp3')).map(file => ({
            name: file.name.replace('.mp3', ''),
            url: file.download_url
        }));
        renderSongList(songs);
        loadSong(currentSongIndex);
    };

    const renderSongList = (songArray) => {
        songList.innerHTML = '';
        songArray.forEach((song, index) => {
            const li = document.createElement('li');
            li.textContent = song.name;
            li.addEventListener('click', () => {
                currentSongIndex = index;
                loadSong(currentSongIndex);
                playSong();
            });
            songList.appendChild(li);
        });
    };

    const loadSong = (index) => {
        const song = songs[index];
        audioPlayer.src = song.url;
        songTitle.textContent = song.name;
        fetchEmbeddedImage(song.url);
    };

    const fetchEmbeddedImage = async (url) => {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const context = new AudioContext();
        const audioBuffer = await context.decodeAudioData(arrayBuffer);
        const embeddedPicture = audioBuffer.getChannelData(0); // Placeholder for actual embedded image extraction

        // Use embedded picture or default image
        coverImage.src = embeddedPicture ? `data:image/jpeg;base64,${btoa(embeddedPicture)}` : 'default-image.jpg';
    };

    const playSong = () => {
        audioPlayer.play();
        playPauseButton.textContent = '⏸️';
    };

    const pauseSong = () => {
        audioPlayer.pause();
        playPauseButton.textContent = '▶️';
    };

    const updateProgressBar = () => {
        const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.value = progressPercent;
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
        durationEl.textContent = formatTime(audioPlayer.duration);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    playPauseButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            playSong();
        } else {
            pauseSong();
        }
    });

    nextButton.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex + 1) % songs.length;
        loadSong(currentSongIndex);
        playSong();
    });

    prevButton.addEventListener('click', () => {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(currentSongIndex);
        playSong();
    });

    audioPlayer.addEventListener('timeupdate', updateProgressBar);

    progressBar.addEventListener('input', () => {
        audioPlayer.currentTime = (progressBar.value / 100) * audioPlayer.duration;
    });

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        const filteredSongs = songs.filter(song => song.name.toLowerCase().includes(query));
        renderSongList(filteredSongs);
    });

    // Fetch and load songs initially
    fetchSongs();
});