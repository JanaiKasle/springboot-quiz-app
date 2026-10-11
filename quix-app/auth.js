const API_BASE_URL = 'http://localhost:8080/api';

function showForm(type) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const loginTab = document.getElementById('login-tab');
    const registerTab = document.getElementById('register-tab');

    if (type === 'login') {
        loginForm.classList.remove('hidden');
        registerForm.classList.add('hidden');
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    } else {
        registerForm.classList.remove('hidden');
        loginForm.classList.add('hidden');
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
    }
}

async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('register-username').value.trim();
    const password = document.getElementById('register-password').value;
    const messageEl = document.getElementById('register-message');

    messageEl.textContent = '';
    messageEl.className = 'auth-message';

    try {
        const response = await fetch(`${API_BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            messageEl.textContent = data.message || 'Registration failed';
            messageEl.classList.add('error');
            return;
        }

        messageEl.textContent = 'Registration successful! You can now log in.';
        messageEl.classList.add('success');
        document.getElementById('register-form').reset();

        // Auto-switch to login tab after a short pause
        setTimeout(() => showForm('login'), 1200);

    } catch (error) {
        console.error('Register error:', error);
        messageEl.textContent = 'Could not reach the server. Please try again.';
        messageEl.classList.add('error');
    }
}

async function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('login-username').value.trim();
    const password = document.getElementById('login-password').value;
    const messageEl = document.getElementById('login-message');

    messageEl.textContent = '';
    messageEl.className = 'auth-message';

    try {
        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (!response.ok) {
            messageEl.textContent = data.message || 'Login failed';
            messageEl.classList.add('error');
            return;
        }

        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        localStorage.setItem('token', data.token); // store the JWT for future authenticated requests

        messageEl.textContent = 'Login successful! Redirecting...';
        messageEl.classList.add('success');

        setTimeout(() => {
            window.location.href = 'index.html';
        }, 800);

    } catch (error) {
        console.error('Login error:', error);
        messageEl.textContent = 'Could not reach the server. Please try again.';
        messageEl.classList.add('error');
    }
}

document.getElementById('login-form').addEventListener('submit', handleLogin);
document.getElementById('register-form').addEventListener('submit', handleRegister);