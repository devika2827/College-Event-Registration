const API_BASE = 'http://localhost:5000/api/auth';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });
const form = document.getElementById('signupForm');
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

  const role = document.querySelector('input[name="role"]:checked').value;
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirmPassword').value;

  let valid = true;
  if (!name) {
    document.getElementById('nameError').textContent = 'Name is required';
    valid = false;
  }
  if (!email) {
    document.getElementById('emailError').textContent = 'Email is required';
    valid = false;
  }
  if (!password || password.length < 6) {
    document.getElementById('passwordError').textContent = 'Password must be at least 6 characters';
    valid = false;
  }
  if (confirmPassword !== password) {
    document.getElementById('confirmPasswordError').textContent = 'Passwords do not match';
    valid = false;
  }
  if (!valid) return;

  submitBtn.disabled = true;
  submitBtn.textContent = 'Creating account…';

  try {
    const res = await fetch(`${API_BASE}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      showToast(data.message || 'Could not create account');
      return;
    }

    showToast('Account created — redirecting to login…', 'success');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 900);

  } catch (err) {
    showToast('Could not reach the server. Please try again.');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Create Account';
  }
});