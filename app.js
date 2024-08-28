document.addEventListener('DOMContentLoaded', () => {
    const audio = new Audio();
    let currentIndex = 0;
    let songs = [];

    // Fetch songs dynamically from your GitHub repository
    async function fetchSongs() {
        try {
            const response = await fetch('https://api.github.com/repos/SJKkumar/Music/contents/songs');
            const data = await response.json();
            songs = data.filter(item => item.name.endsWith('.mp3')).map(item => ({
                name: item.name,
                path: item.download_url
            }));
            loadSongList();
            if (songs.length > 0) loadSong(0);  // Automatically load the first song
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    }

    function loadSongList() {
        const songList = document.getElementById('song-list');
        songList.innerHTML = '';
        songs.forEach((song, index) => {
            const div = document.createElement('div');
            div.textContent = song.name;
            div.addEventListener('click', () => loadSong(index));
            songList.appendChild(div);
        });
    }

    function loadSong(index) {
        currentIndex = index;
        audio.src = songs[index].path;
        document.getElementById('song-name').textContent = songs[index].name;
        fetchAlbumArt(songs[index].path);
        audio.play();
        document.getElementById('play-pause-button').textContent = '⏸️';
    }

    function fetchAlbumArt(url) {
        jsmediatags.read(url, {
            onSuccess: tag => {
                const picture = tag.tags.picture;
                if (picture) {
                    const base64String = picture.data.reduce((data, byte) => data + String.fromCharCode(byte), '');
                    const imgURL = `data:${picture.format};base64,${window.btoa(base64String)}`;
                    document.getElementById('album-img').src = imgURL;
                } else {
                    document.getElementById('album-img').src = 'default-image.jpg';
                }
            },
            onError: () => {
                document.getElementById('album-img').src = 'default-image.jpg';
            }
        });
    }

    document.getElementById('play-pause-button').addEventListener('click', () => {
        if (audio.paused) {
            audio.play();
            document.getElementById('play-pause-button').textContent = '⏸️';
        } else {
            audio.pause();
            document.getElementById('play-pause-button').textContent = '▶️';
        }
    });

    document.getElementById('next-button').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % songs.length;
        loadSong(currentIndex);
    });

    document.getElementById('prev-button').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + songs.length) % songs.length;
        loadSong(currentIndex);
    });

    audio.addEventListener('timeupdate', () => {
        document.getElementById('progress-bar').value = (audio.currentTime / audio.duration) * 100;
        document.getElementById('current-time').textContent = formatTime(audio.currentTime);
        document.getElementById('duration').textContent = formatTime(audio.duration);
    });

    document.getElementById('progress-bar').addEventListener('input', e => {
        const seekTime = (e.target.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    });

    function formatTime(seconds) {
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    fetchSongs();
});