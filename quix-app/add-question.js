const API_BASE_URL = 'http://localhost:8080/api';

// Guard: only logged-in admins get to see this form
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

if (!token) {
    alert('You must be logged in to add questions.');
    window.location.href = 'login.html';
} else if (role !== 'ADMIN') {
    alert('Only admins can add questions.');
    window.location.href = 'index.html';
}

async function handleAddQuestion(event) {
    event.preventDefault();

    const messageEl = document.getElementById('add-question-message');
    messageEl.textContent = '';
    messageEl.className = 'auth-message';

    const questionData = {
        questionText: document.getElementById('question-text').value.trim(),
        options: [
            document.getElementById('option-1').value.trim(),
            document.getElementById('option-2').value.trim(),
            document.getElementById('option-3').value.trim(),
            document.getElementById('option-4').value.trim()
        ],
        correctAnswer: document.getElementById('correct-answer').value.trim()
    };

    // Basic client-side sanity check before hitting the API
    if (!questionData.options.includes(questionData.correctAnswer)) {
        messageEl.textContent = 'Correct answer must match one of the four options exactly.';
        messageEl.classList.add('error');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/save`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(questionData)
        });

        if (response.status === 401 || response.status === 403) {
            messageEl.textContent = 'Session expired. Please log in again.';
            messageEl.classList.add('error');
            localStorage.removeItem('token');
            localStorage.removeItem('username');
            setTimeout(() => window.location.href = 'login.html', 1500);
            return;
        }

        if (!response.ok) {
            messageEl.textContent = 'Failed to save question. Please try again.';
            messageEl.classList.add('error');
            return;
        }

        messageEl.textContent = 'Question saved successfully!';
        messageEl.classList.add('success');
        document.getElementById('add-question-form').reset();

    } catch (error) {
        console.error('Add question error:', error);
        messageEl.textContent = 'Could not reach the server. Please try again.';
        messageEl.classList.add('error');
    }
}

document.getElementById('add-question-form').addEventListener('submit', handleAddQuestion);