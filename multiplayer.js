// New file: multiplayer.js
// Assumes that WebsimSocket is available globally.
const room = new WebsimSocket();

async function initMultiplayer() {
  await room.initialize();
  updateMultiplayerInfo();
  // Update (or re‐render) when presence updates occur.
  room.subscribePresence(() => {
    updateMultiplayerInfo();
  });
}

function updateMultiplayerInfo() {
  const infoEl = document.getElementById('multiplayer-info');
  if (!infoEl) return;
  const peer = room.peers[room.clientId];
  if (!peer) return;
  // The library automatically provides peer.username and peer.avatarUrl.
  infoEl.innerHTML = `<img src="${peer.avatarUrl}" alt="avatar"/> ${peer.username}`;
}

initMultiplayer();