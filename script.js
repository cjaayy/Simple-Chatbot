// script.js
const chatbot = document.getElementById('chatbot');
const chatHeader = document.getElementById('chat-header');
const resizeHandle = document.getElementById('resize-handle');
const minimizeBtn = document.getElementById('minimize-btn');
const typingIndicator = document.querySelector('.typing-indicator');
let chatbotHeight = chatbot.offsetHeight;

let isDragging = false;
let isResizing = false;
let isMinimized = false;
let startX, startY, startWidth, startHeight;

// Minimizing functionality
minimizeBtn.addEventListener('click', () => {
    if (isMinimized) {
        chatbot.style.height = `${chatbotHeight}px`;
        minimizeBtn.textContent = '_';
    } else {
        chatbotHeight = chatbot.offsetHeight;
        chatbot.style.height = '50px';
        minimizeBtn.textContent = '□';
    }
    isMinimized = !isMinimized;
});

// Dragging functionality
chatHeader.addEventListener('mousedown', (e) => {
    if (e.target === minimizeBtn) return;
    isDragging = true;
    startX = e.clientX - chatbot.offsetLeft;
    startY = e.clientY - chatbot.offsetTop;
    chatHeader.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const newLeft = e.clientX - startX;
        const newTop = e.clientY - startY;
        
        const maxX = window.innerWidth - chatbot.offsetWidth;
        const maxY = window.innerHeight - chatbot.offsetHeight;
        
        chatbot.style.left = `${Math.min(Math.max(0, newLeft), maxX)}px`;
        chatbot.style.top = `${Math.min(Math.max(0, newTop), maxY)}px`;
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    chatHeader.style.cursor = 'grab';
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
        
        if (newWidth >= 300 && newHeight >= 200) {
            chatbot.style.width = `${newWidth}px`;
            chatbot.style.height = `${newHeight}px`;
        }
    }
});

document.addEventListener('mouseup', () => {
    isResizing = false;
});

// Chat functionality
const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');

// Function to format timestamps
const formatTimestamp = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

// Function to add messages to chat
const addMessage = (message, isBot = false) => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('chat-message', isBot ? 'bot' : 'user');

    const avatar = document.createElement('div');
    avatar.classList.add('avatar');
    avatar.textContent = isBot ? '🤖' : '👤';

    const messageContent = document.createElement('div');
    messageContent.classList.add('message-content');

    const messageText = document.createElement('div');
    messageText.classList.add('message-text');
    messageText.textContent = message;

    const timestamp = document.createElement('div');
    timestamp.classList.add('timestamp');
    timestamp.textContent = formatTimestamp();

    messageContent.appendChild(messageText);
    messageContent.appendChild(timestamp);
    messageElement.appendChild(avatar);
    messageElement.appendChild(messageContent);

    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight;
};

// Function to show and hide typing indicator
const showTypingIndicator = () => {
    typingIndicator.style.display = 'block';
    chatWindow.scrollTop = chatWindow.scrollHeight;
};

const hideTypingIndicator = () => {
    typingIndicator.style.display = 'none';
};

// Bot response function
const getBotResponse = (message) => {
    const responses = {
        "hello": "Hello! How can I assist you today?",
        "how are you": "I'm doing great, thanks for asking! How about you?",
        "bye": "Goodbye! Have a great day!",
        "help": "I can help you with various tasks. Try asking me about the weather, general questions, or just chat!",
        "selin": "I LIKE YOU!",
        "byen": "I MISS YOU!",
        "cebie": "I LOVE YOU!",
    };
    return responses[message.toLowerCase()] || "I'm still learning, but I'd love to help! Could you rephrase that?";
};

// Function to send user message and get bot response
const sendMessage = () => {
    const message = userInput.value.trim();
    if (message) {
        addMessage(message); // Add user's message
        userInput.value = ''; // Clear input field
        
        showTypingIndicator();
        
        setTimeout(() => {
            hideTypingIndicator();
            const botResponse = getBotResponse(message);
            addMessage(botResponse, true); // Add bot's response
        }, Math.random() * 1000 + 500);
    }
};

// Send button click event
document.getElementById('send-btn').addEventListener('click', sendMessage);

// "Enter" key event for sending messages
document.getElementById('user-input').addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});

// Clear chat history but keep the initial bot message
document.getElementById('clear-btn').addEventListener('click', () => {
    const chatWindow = document.getElementById('chat-window');
    const messages = chatWindow.querySelectorAll('.chat-message');

    messages.forEach((msg, index) => {
        if (index > 0) {
            msg.remove();
        }
    });
});

// Get emoji-related elements
const emojiBtn = document.getElementById('emoji-btn');
const emojiPicker = document.querySelector('.emoji-picker');
const emojiGrid = document.querySelector('.emoji-grid');
const emojis = ["😀", "😂", "😊", "😍", "😎", "🤩", "😢", "😡", "😴", "🤔", "🥳", "😭", "👍", "👏", "🙏"];

// Populate the emoji picker with emojis
emojis.forEach(emoji => {
    const emojiItem = document.createElement('div');
    emojiItem.classList.add('emoji-item');
    emojiItem.textContent = emoji;
    emojiItem.addEventListener('click', () => {
        userInput.value += emoji; // Append emoji to input field
        userInput.focus(); // Refocus input field
        emojiPicker.style.display = 'none'; // Hide emoji picker after selection
    });
    emojiGrid.appendChild(emojiItem);
});

// Show/Hide emoji picker when emoji button is clicked
emojiBtn.addEventListener('click', () => {
    emojiPicker.style.display = (emojiPicker.style.display === 'block') ? 'none' : 'block';
});

// Hide emoji picker when clicking outside
document.addEventListener('click', (event) => {
    if (!emojiBtn.contains(event.target) && !emojiPicker.contains(event.target)) {
        emojiPicker.style.display = 'none';
    }
});
