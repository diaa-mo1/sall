// ═══════════════════════════════════════════════════
//  AudioPlayer — HTML5 Audio Module
//  الطريقة البيومية الأحمدية — Noor Al-Tareeq
// ═══════════════════════════════════════════════════

const AudioPlayer = (function () {
  let audio = null;
  let playlist = [];
  let currentIdx = -1;
  let isPlaying = false;
  let volume = 0.8;

  let els = {};

  function init() {
    audio = document.getElementById('app-audio');
    if (!audio) return;

    // إعادة بناء الـ playlist من الصفر (يُستخدم بعد الفلترة)
    playlist = [];

    els = {
      title: document.getElementById('player-title'),
      artist: document.getElementById('player-artist'),
      thumb: document.getElementById('player-thumb'),
      playBtn: document.getElementById('player-play-btn'),
      playIcon: document.getElementById('player-play-icon'),
      prevBtn: document.getElementById('player-prev-btn'),
      nextBtn: document.getElementById('player-next-btn'),
      progressContainer: document.getElementById('player-progress-container'),
      progressFill: document.getElementById('player-progress-fill'),
      currentTime: document.getElementById('player-current-time'),
      totalTime: document.getElementById('player-total-time'),
      volumeContainer: document.getElementById('player-volume-container'),
      volumeFill: document.getElementById('player-volume-fill'),
      playerBar: document.getElementById('audio-player-bar'),
    };

    document.querySelectorAll('[data-track-id]').forEach(card => {
      playlist.push({
        id: card.dataset.trackId,
        title: card.dataset.title || card.querySelector('[data-title]')?.textContent.trim() || '',
        artist: card.dataset.artist || card.querySelector('[data-artist]')?.textContent.trim() || '',
        src: card.dataset.src || '',
        duration: card.dataset.duration || '0:00',
        category: card.dataset.category || '',
        thumbnail: card.dataset.thumbnail || null,
      });
    });

    els.playBtn?.addEventListener('click', togglePlay);
    els.prevBtn?.addEventListener('click', prevTrack);
    els.nextBtn?.addEventListener('click', nextTrack);

    els.progressContainer?.addEventListener('click', function (e) {
      if (!audio.duration) return;
      const rect = this.getBoundingClientRect();
      const ratio = 1 - (e.clientX - rect.left) / rect.width;
      audio.currentTime = Math.max(0, Math.min(1, ratio)) * audio.duration;
    });

    els.volumeContainer?.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ratio = 1 - (e.clientX - rect.left) / rect.width;
      setVolume(Math.max(0, Math.min(1, ratio)));
    });

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', nextTrack);
    audio.addEventListener('loadedmetadata', () => {
      if (els.totalTime) els.totalTime.textContent = formatTime(audio.duration);
    });

    document.querySelectorAll('.play-track-btn').forEach((btn, i) => {
      btn.addEventListener('click', () => playByIndex(i));
    });

    audio.volume = volume;
    updateVolumeUI();
    updatePlayIcon();
  }

  function playByIndex(idx) {
    if (idx < 0 || idx >= playlist.length) return;
    const track = playlist[idx];
    if (!track?.src) {
      showNoSrcMessage(track?.title || 'المقطع');
      return;
    }

    currentIdx = idx;
    audio.src = track.src;
    audio.load();
    audio.play().then(() => {
      isPlaying = true;
      updatePlayIcon();
      updatePlayerBar(track);
    }).catch(err => console.error('AudioPlayer play error:', err));
  }

  function togglePlay() {
    if (currentIdx === -1 && playlist.length > 0) {
      playByIndex(0);
      return;
    }
    if (isPlaying) {
      audio.pause();
      isPlaying = false;
    } else {
      audio.play().then(() => { isPlaying = true; updatePlayIcon(); }).catch(console.error);
    }
    updatePlayIcon();
  }

  function nextTrack() {
    if (playlist.length === 0) return;
    const next = (currentIdx + 1) % playlist.length;
    playByIndex(next);
  }

  function prevTrack() {
    if (!audio) return;
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    const prev = (currentIdx - 1 + playlist.length) % playlist.length;
    playByIndex(prev);
  }

  function setVolume(val) {
    volume = Math.max(0, Math.min(1, val));
    if (audio) audio.volume = volume;
    updateVolumeUI();
  }

  function updateVolumeUI() {
    if (els.volumeFill) els.volumeFill.style.width = (volume * 100) + '%';
  }

  function updateProgress() {
    if (!audio.duration || !els.progressFill) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    els.progressFill.style.width = pct + '%';
    if (els.currentTime) els.currentTime.textContent = formatTime(audio.currentTime);
  }

  function updatePlayerBar(track) {
    if (els.title) els.title.textContent = track.title;
    if (els.artist) els.artist.textContent = track.artist;
    if (els.thumb) {
      if (track.thumbnail) {
        els.thumb.innerHTML = `<img src="${track.thumbnail}" alt="${track.title}" class="w-full h-full object-cover rounded-md" />`;
      } else {
        els.thumb.innerHTML = '<span class="material-symbols-outlined text-secondary">music_note</span>';
      }
    }
    els.playerBar?.classList.remove('hidden');
    document.querySelectorAll('[data-track-id]').forEach((card, i) => {
      card.classList.toggle('border-secondary', i === currentIdx);
      card.classList.toggle('border-secondary/10', i !== currentIdx);
    });
  }

  function updatePlayIcon() {
    if (!els.playIcon) return;
    els.playIcon.textContent = isPlaying ? 'pause' : 'play_arrow';
    els.playIcon.style.fontVariationSettings = `'FILL' 1`;
  }

  function formatTime(seconds) {
    if (Number.isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function showNoSrcMessage(title) {
    const toast = document.createElement('div');
    toast.className = 'fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-surface-container border border-secondary/30 text-on-surface px-6 py-3 rounded-full font-label-sm text-label-sm shadow-lg';
    toast.textContent = `"${title}" — الملف الصوتي غير متاح`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  function playById(id) {
    const idx = playlist.findIndex(item => item.id === id);
    if (idx !== -1) playByIndex(idx);
  }

  function getPlaylist() {
    return playlist;
  }

  function getCurrentTrack() {
    return playlist[currentIdx] || null;
  }

  return { init, playByIndex, playById, getPlaylist, getCurrentTrack };
})();

document.addEventListener('DOMContentLoaded', AudioPlayer.init);

document.addEventListener('DOMContentLoaded', () => {
  try {
    const autoId = localStorage.getItem('nooraltareeq_autoplay');
    if (autoId) {
      localStorage.removeItem('nooraltareeq_autoplay');
      setTimeout(() => AudioPlayer.playById(autoId), 500);
    }
  } catch (err) {
    console.warn('AudioPlayer: localStorage unavailable', err);
  }
});
