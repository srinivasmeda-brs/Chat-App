const socket = io();

const clientTotal = document.getElementById('clientsTotal');
const messageContainer = document.getElementById('msg-container');
const nameInput = document.getElementById('name-input');
const messageForm = document.getElementById('msg-form');
const messageInput = document.getElementById('msg-input');
const feedbackElement = document.getElementById('feedback'); // Feedback element

messageForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
    feedbackElement.textContent = ''; // Clear feedback on message send
});

socket.on('client-total', (data) => {
    console.log(data);
    clientTotal.textContent = `Total clients: ${data}`;
});

function sendMessage() {
    if (messageInput.value === "") return;
    console.log(messageInput.value);
    const data = {
        name: nameInput.value,
        message: messageInput.value,
        date: new Date()
    };
    socket.emit('new-message', data);
    addMessageToUi(true, data);
    messageInput.value = '';
}

socket.on('chat-message', (data) => {
    console.log(data);
    addMessageToUi(false, data);
});

function addMessageToUi(isOwnMessage, data) {
    const messageElement = document.createElement('li');
    messageElement.className = isOwnMessage ? "sender" : "receiver";
    messageElement.innerHTML = `
        <div class="message-content">
            <p>${data.message}</p>
            <span>${data.name} - ${new Date(data.date).toLocaleString()}</span>
        </div>
    `;
    messageContainer.appendChild(messageElement);
    scrollToBottom();
}

function scrollToBottom() {
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

messageInput.addEventListener("focus", () => {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing...`
    });
});

messageInput.addEventListener("keypress", () => {
    socket.emit('feedback', {
        feedback: `${nameInput.value} is typing...`
    });
});

messageInput.addEventListener("blur", () => {
    socket.emit('feedback', {
        feedback: ""
    });
});

// Handle feedback display
socket.on('typing-feedback', (data) => {
    feedbackElement.textContent = data.feedback;
});
