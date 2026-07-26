const songList = document.getElementById('songList');
const statusText = document.getElementById('status');
const reloadBtn = document.getElementById('reloadBtn');
const apiBase = window.APP_CONFIG?.API_BASE || '';

function renderSongs(songs) {
  songList.innerHTML = '';

  songs.forEach((song, index) => {
    const li = document.createElement('li');
    li.className = 'song-item';
    li.style.animationDelay = `${index * 80}ms`;

    li.innerHTML = `
      <span class="song-title">${song.title}</span>
      <span class="song-artist">${song.artist} • added by ${song.username || 'anonymous'}</span>
    `;

    songList.appendChild(li);
  });
}

async function loadSongs() {
  statusText.textContent = 'Loading songs...';

  try {
    const response = await fetch(`${apiBase}/api/songs`);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const songs = await response.json();
    renderSongs(songs);
    statusText.textContent = `${songs.length} songs loaded`;
  } catch (error) {
    songList.innerHTML = '';
    statusText.textContent = 'Could not load songs right now.';
    console.error('Failed to load songs:', error);
  }
}

reloadBtn.addEventListener('click', loadSongs);
loadSongs();
