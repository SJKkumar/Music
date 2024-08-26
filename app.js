document.addEventListener('DOMContentLoaded', () => {
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

    const songs = [
        {
            title: 'Makkamishi',
            artist: 'Artist Name',
            src: 'https://raw.githubusercontent.com/SJKkumar/Music/main/songs/Makkamishi.mp3'
        },
        {
            title: 'Aasa Kooda',
            artist: 'Artist Name',
            src: 'https://raw.githubusercontent.com/SJKkumar/Music/main/songs/Aasa%20Kooda