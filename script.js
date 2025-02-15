// script.js

const chatbot = document.getElementById('chatbot');
const chatHeader = document.getElementById('chat-header');
const resizeHandle = document.getElementById('resize-handle');

let isDragging = false;
let isResizing = false;
let startX, startY, startWidth, startHeight;

// Dragging functionality
chatHeader.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.clientX - chatbot.offsetLeft;
    startY = e.clientY - chatbot.offsetTop;
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        chatbot.style.left = `${e.clientX - startX}px`;
        chatbot.style.top = `${e.clientY - startY}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Resizing functionality
resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
    startWidth = chatbot.offsetWidth;
    startHeight = chatbot.offsetHeight;
    startX = e.clientX;
    startY = e.clientY;
    e.preventDefault();
});

document.addEventListener('mousemove', (e) => {
    if (isResizing) {
        const newWidth = startWidth + (e.clientX - startX);
        const newHeight = startHeight + (e.clientY - startY);
        chatbot.style.width = `${newWidth}px`;
        chatbot.style.height = `${newHeight}px`;
    }
});

document.addEventListener('mouseup', () => {
    isResizing = false;
});

// Chat functionality remains the same
const chatForm = document.getElementById('chat-form');
const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');

const getBotResponse = (message) => {
    const responses = {
        "hello": "Hello! How can I assist you today?",
        "how are you": "I'm just a bot, but I'm here to help you!",
        "bye": "Goodbye! Have a great day!",
    };
    return responses[message.toLowerCase()] || "I'm sorry, I don't understand that.";
};

const addMessage = (message, isBot = false) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message');
    messageElement.classList.add(isBot ? 'bot' : 'user');
    messageElement.textContent = message;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
};

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (message) {
        addMessage(message);
        setTimeout(() => {
            const botResponse = getBotResponse(message);
            addMessage(botResponse, true);
        }, 500);
    }
    userInput.value = '';
});
