const auth = new window.Auth();

async function bootProtectedPage() {
  const ok = await auth.validate();
  if (!ok) {
    return;
  }

  const logoutButton = document.getElementById('logoutBtn');
  if (logoutButton) {
    logoutButton.addEventListener('click', () => auth.logout());
  }

  const userBadge = document.getElementById('userBadge');
  if (userBadge) {
    userBadge.textContent = auth.username();
  }

  document.dispatchEvent(new CustomEvent('auth:ready', { detail: { auth } }));
}

bootProtectedPage();
