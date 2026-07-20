const API_BASE = 'http://localhost:5000/api/auth';

const form = document.getElementById('loginForm');
const submitBtn = document.getElementById('submitBtn');
const toast = document.getElementById('toast');

document.querySelectorAll('.toggle-eye').forEach(btn => {
  btn.addEventListener('click', () => {
    const input = document.getElementById(btn.dataset.target);
    input.type = input.type === 'password' ? 'text' : 'password';
  });
});

document.querySelectorAll('.social-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    showToast('Social login is not connected yet.', 'error');
  });
});

function showToast(message, type = 'error') {
  toast.textContent = message;
  toast.className = `toast ${type}`;
}

function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => el.textContent = '');
  toast.className = 'toast';
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  clearErrors();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;

  let valid = true;
  if (!email) {
    document.getElementById('emailError').textContent = 'Email is required';
    valid = false;
  }
  if (!password || password.length < 6) {
    document.getElementById('passwordError').textContent = 'Password must be at least 6 characters';
    valid = false;
  }
  if (!valid) return;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Logging in…';

  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || 'Invalid email or password');
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);

    showToast('Login successful — redirecting…', 'success');
    setTimeout(() => {
      window.location.href = data.role === 'admin' ? 'dashboard.html' : 'browse.html';
    }, 700);

  } catch (err) {
    showToast('Could not reach the server. Please try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Log In';
  }
});