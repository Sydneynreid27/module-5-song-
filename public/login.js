const statusBox = document.getElementById('statusBox');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

function setStatus(message, isError = false) {
  statusBox.textContent = message;
  statusBox.classList.toggle('error-text', isError);
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('loginUsername').value.trim();
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch('/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus(data.message || 'Login failed', true);
      return;
    }

    localStorage.setItem('auth', String(data.auth));
    localStorage.setItem('token', data.token);
    localStorage.setItem('uname', data.username2);

    window.location.href = '/manage.html';
  } catch (error) {
    setStatus('Network issue while logging in.', true);
  }
});

signupForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const username = document.getElementById('signupUsername').value.trim();
  const password = document.getElementById('signupPassword').value;

  try {
    const response = await fetch('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, status: 1 }),
    });

    const data = await response.json();

    if (!response.ok) {
      setStatus(data.message || 'Signup failed', true);
      return;
    }

    setStatus('User created. You can now log in.');
    signupForm.reset();
  } catch (error) {
    setStatus('Network issue while creating user.', true);
  }
});
