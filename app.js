document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const songList = document.getElementById('song-list');

    const songs = [
        { title: 'Makkamishi', url: 'https://raw.githubusercontent.com/SJKkumar/Music/main/songs/Makkamishi.mp3' },
        // Add more songs here
    ];

    songs.forEach(song => {
        const li = document.createElement('li');
        li.textContent = song.title;
        li.addEventListener('click', () => {
            audioPlayer.src = song.url;
            audioPlayer.play().catch(error => {
                console.error('Error playing audio:', error);
            });
        });
        songList.appendChild(li);
    });
});
