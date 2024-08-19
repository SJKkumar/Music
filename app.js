document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const songList = document.getElementById('song-list');

    // List of music files
    const songs = [
        { title: 'Song 1', url: 'https://raw.githubusercontent.com/username/repository/branch/music/song1.mp3' },
        { title: 'Song 2', url: 'https://raw.githubusercontent.com/username/repository/branch/music/song2.mp3' },
        // Add more songs here
    ];

    // Populate song list
    songs.forEach(song => {
        const li = document.createElement('li');
        li.textContent = song.title;
        li.addEventListener('click', () => {
            audioPlayer.src = song.url;
            audioPlayer.play();
        });
        songList.appendChild(li);
    });
});
