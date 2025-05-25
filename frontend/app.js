// Konfigurasi API endpoint
const API_BASE_URL = '/api';

// Element references (lebih spesifik dengan ID)
const messageInput = document.getElementById('messageInput');
const messagesDiv = document.getElementById('messages');
const sendButton = document.getElementById('sendButton'); // Gunakan ID yang spesifik
const errorDiv = document.getElementById('error-message');

// Fungsi untuk menampilkan error
function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(() => errorDiv.style.display = 'none', 5000);
}

async function loadMessages() {
    try {
        const response = await fetch(`${API_BASE_URL}/messages`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const messages = await response.json();
        
        messagesDiv.innerHTML = messages.map(msg => 
            `<div class="message">
                <p>${msg.text} 
                <small>${new Date(msg.timestamp).toLocaleString()}</small>
                </p>
            </div>`
        ).join('');
        
    } catch (error) {
        console.error('Error loading messages:', error);
        showError('Gagal memuat pesan. Silakan refresh halaman.');
    }
}

async function sendMessage(event) {
    event.preventDefault(); // Mencegah form submission default
    
    const text = messageInput.value.trim();
    
    if (!text) {
        showError('Pesan tidak boleh kosong');
        return;
    }

    sendButton.disabled = true;
    
    try {
        const response = await fetch(`${API_BASE_URL}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Gagal mengirim pesan');
        }

        messageInput.value = '';
        await loadMessages(); // Memuat ulang pesan setelah mengirim
        
    } catch (error) {
        console.error('Error sending message:', error);
        showError(error.message);
    } finally {
        sendButton.disabled = false;
    }
}

// Optimasi polling dengan exponential backoff
let retryCount = 0;
const MAX_RETRIES = 5;

async function pollMessages() {
    try {
        await loadMessages();
        retryCount = 0;
    } catch (error) {
        if (retryCount < MAX_RETRIES) {
            retryCount++;
            const delay = Math.min(1000 * 2 ** retryCount, 30000);
            setTimeout(pollMessages, delay);
        }
    }
}

// Handler event terpisah
function initializeApp() {
    // Hapus event listener lama jika ada
    sendButton.removeEventListener('click', sendMessage);
    messageInput.removeEventListener('keypress', handleEnter);
    
    // Tambahkan event listener baru
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', handleEnter);
}

// Handler untuk tombol Enter
function handleEnter(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage(event);
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    pollMessages();
    // Jalankan polling pertama langsung
    setInterval(pollMessages, 2000);
});

// Cleanup
window.addEventListener('beforeunload', () => {
    clearInterval(pollingInterval);
});