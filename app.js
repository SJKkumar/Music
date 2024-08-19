document.addEventListener('DOMContentLoaded', () => {
    const audioPlayer = document.getElementById('audio-player');
    const playPauseButton = document.getElementById('play-pause');
    const progressBar = document.getElementById('progress-bar');
    const progress = document.getElementById('progress');
    const progressContainer = document.querySelector('.progress-container');

    // Play/Pause Button Toggle
    playPauseButton.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseButton.textContent = 'Pause';
        } else {
            audioPlayer.pause();
            playPauseButton.textContent = 'Play';
        }
    });

    // Update Progress Bar
    audioPlayer.addEventListener('timeupdate', () => {
        if (audioPlayer.duration) {
            const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
            progress.style.width = percent + '%';
            progressBar.style.width = percent + '%';
        }
    });

    // Seek Functionality
    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = x / progressContainer.offsetWidth;
        audioPlayer.currentTime = percent * audioPlayer.duration;
    });
});
