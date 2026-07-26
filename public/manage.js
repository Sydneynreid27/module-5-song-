let currentAuth = null;
const songSelect = document.getElementById('songSelect');
const songMessage = document.getElementById('songMessage');
const addForm = document.getElementById('addSongForm');
const deleteForm = document.getElementById('deleteSongForm');

function showSongMessage(message, isError = false) {
  songMessage.textContent = message;
  songMessage.classList.toggle('error-text', isError);
}

function getSelectedSongId() {
  const selected = document.querySelector('#songSelect option:checked');
  return selected ? selected.value : '';
}

async function loadSongs() {
  const response = await fetch('/api/songs');
  const songs = await response.json();

  songSelect.innerHTML = '';
  songs.forEach((song) => {
    const option = document.createElement('option');
    option.value = song._id;
    option.textContent = `${song.title} - ${song.artist} (${song.username || 'anonymous'})`;
    songSelect.appendChild(option);
  });

  showSongMessage(`${songs.length} songs available`);
}

addForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const title = document.getElementById('songTitle').value.trim();
  const artist = document.getElementById('songArtist').value.trim();

  const response = await fetch('/api/songs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-auth': currentAuth.token(),
    },
    body: JSON.stringify({
      title,
      artist,
      username: currentAuth.username(),
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    showSongMessage(data.message || 'Could not create song', true);
    return;
  }

  addForm.reset();
  await loadSongs();
  showSongMessage(`Added ${data.title}`);
});

deleteForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const songId = getSelectedSongId();
  if (!songId) {
    showSongMessage('Select a song first.', true);
    return;
  }

  const response = await fetch(`/api/songs/${songId}`, {
    method: 'DELETE',
    headers: {
      'x-auth': currentAuth.token(),
    },
  });

  const data = await response.json();

  if (!response.ok) {
    showSongMessage(data.message || 'Delete failed', true);
    return;
  }

  await loadSongs();
  showSongMessage('Song deleted.');
});

document.addEventListener('auth:ready', async (event) => {
  currentAuth = event.detail.auth;
  await loadSongs();
});
