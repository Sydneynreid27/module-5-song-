class Auth {
  constructor() {
    document.body.style.display = 'none';
  }

  isAuthorized() {
    return localStorage.getItem('auth') === '1';
  }

  token() {
    return localStorage.getItem('token') || '';
  }

  username() {
    return localStorage.getItem('uname') || '';
  }

  status() {
    return Number(localStorage.getItem('ustatus') || 1);
  }

  async validate() {
    if (!this.isAuthorized()) {
      window.location.href = '/login.html';
      return false;
    }

    try {
      const response = await fetch('/status', {
        headers: {
          'x-auth': this.token(),
        },
      });

      if (!response.ok) {
        throw new Error('Token invalid');
      }

      document.body.style.display = 'block';
      return true;
    } catch (error) {
      this.logout();
      return false;
    }
  }

  logout() {
    localStorage.removeItem('auth');
    localStorage.removeItem('token');
    localStorage.removeItem('uname');
    localStorage.removeItem('ustatus');
    window.location.href = '/login.html';
  }
}

window.Auth = Auth;
