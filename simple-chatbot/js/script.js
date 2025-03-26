// filepath: simple-chatbot/js/script.js
// Main JavaScript logic for the chatbot

// DOM Elements
const chatbot = document.getElementById('chatbot');
const chatWindow = document.getElementById('chat-window');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const emojiBtn = document.getElementById('emoji-btn');
const emojiPicker = document.querySelector('.emoji-picker');
const typingIndicator = document.querySelector('.typing-indicator');
const minimizeBtn = document.getElementById('minimize-btn');
const themeBtn = document.getElementById('theme-btn');
const clearBtn = document.getElementById('clear-btn');
const helpBtn = document.getElementById('help-btn');
const settingsBtn = document.getElementById('settings-btn');
const voiceBtn = document.getElementById('voice-btn');
const attachmentBtn = document.getElementById('attachment-btn');
const characterCount = document.querySelector('.character-count');
const settingsPanel = document.getElementById('settings-panel');
const helpPanel = document.getElementById('help-panel');
const closeButtons = document.querySelectorAll('.close-panel');
const resizeHandle = document.getElementById('resize-handle');
const themeOptions = document.querySelectorAll('.theme-option');
const textSizeSlider = document.getElementById('text-size');
const sliderValue = document.querySelector('.slider-value');
const languageSelect = document.getElementById('language-select');
const saveSettingsBtn = document.querySelector('.save-settings-btn');
const emojiCategories = document.querySelectorAll('.emoji-category');
const emojiSearch = document.querySelector('.emoji-search input');
const emojiGrid = document.querySelector('.emoji-grid');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    applyStoredSettings();
    makeChatbotDraggable();
    makeChatbotResizable();
});

// Event Listeners
sendBtn.addEventListener('click', handleUserMessage);
userInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleUserMessage();
    }
    updateCharacterCount();
});
userInput.addEventListener('input', updateCharacterCount);
emojiBtn.addEventListener('click', toggleEmojiPicker);
minimizeBtn.addEventListener('click', toggleMinimizeChatbot);
themeBtn.addEventListener('click', toggleThemePanel);
clearBtn.addEventListener('click', clearChat);
helpBtn.addEventListener('click', toggleHelpPanel);
settingsBtn.addEventListener('click', toggleSettingsPanel);
voiceBtn.addEventListener('click', startVoiceInput);
attachmentBtn.addEventListener('click', handleAttachment);

closeButtons.forEach(button => {
    button.addEventListener('click', () => {
        settingsPanel.classList.remove('visible');
        helpPanel.classList.remove('visible');
    });
});

// Close panels when clicking outside
document.addEventListener('click', (e) => {
    if (!emojiPicker.contains(e.target) && e.target !== emojiBtn) {
        emojiPicker.classList.remove('visible');
    }
    
    if (!settingsPanel.contains(e.target) && e.target !== settingsBtn) {
        settingsPanel.classList.remove('visible');
    }
    
    if (!helpPanel.contains(e.target) && e.target !== helpBtn) {
        helpPanel.classList.remove('visible');
    }
});

// Character counter
function updateCharacterCount() {
    const length = userInput.value.length;
    characterCount.textContent = `${length}/500`;
    
    if (length > 450) {
        characterCount.classList.add('limit');
    } else {
        characterCount.classList.remove('limit');
    }
}

// Handle user message
function handleUserMessage() {
    const message = userInput.value.trim();
    
    if (message.length === 0) return;
    
    addMessage('user', message);
    userInput.value = '';
    updateCharacterCount();
    showTypingIndicator();
    
    // Simulate bot response delay
    setTimeout(() => {
        hideTypingIndicator();
        processUserMessage(message);
    }, 1000 + Math.random() * 1000);
}

// Process user message and generate response
function processUserMessage(message) {
    // Basic response logic
    // ... (existing logic)
}

// Add user message to chat
function addMessage(sender, message) {
    // ... (existing logic)
}

// Add bot message to chat
function addBotMessage(message) {
    // ... (existing logic)
}

// Show typing indicator
function showTypingIndicator() {
    typingIndicator.classList.add('visible');
}

// Hide typing indicator
function hideTypingIndicator() {
    typingIndicator.classList.remove('visible');
}

// Toggle minimize/maximize chatbot
function toggleMinimizeChatbot() {
    // ... (existing logic)
}

// Toggle theme panel
function toggleThemePanel() {
    // ... (existing logic)
}

// Toggle help panel
function toggleHelpPanel() {
    // ... (existing logic)
}

// Toggle settings panel
function toggleSettingsPanel() {
    // ... (existing logic)
}

// Save settings
saveSettingsBtn.addEventListener('click', () => {
    showNotification('Settings saved');
    settingsPanel.classList.remove('visible');
});

// Apply stored settings
function applyStoredSettings() {
    // ... (existing logic)
}

// Make chatbot draggable
function makeChatbotDraggable() {
    let isDragging = false;
    let offsetX, offsetY;

    chatbot.addEventListener('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - chatbot.getBoundingClientRect().left;
        offsetY = e.clientY - chatbot.getBoundingClientRect().top;
        document.addEventListener('mousemove', dragChatbot);
        document.addEventListener('mouseup', stopDragging);
    });

    function dragChatbot(e) {
        if (isDragging) {
            chatbot.style.left = `${e.clientX - offsetX}px`;
            chatbot.style.top = `${e.clientY - offsetY}px`;
        }
    }

    function stopDragging() {
        isDragging = false;
        document.removeEventListener('mousemove', dragChatbot);
        document.removeEventListener('mouseup', stopDragging);
    }
}

// Make chatbot resizable
function makeChatbotResizable() {
    let isResizing = false;
    let initialWidth, initialHeight, initialX, initialY;

    resizeHandle.addEventListener('mousedown', (e) => {
        isResizing = true;
        initialWidth = chatbot.offsetWidth;
        initialHeight = chatbot.offsetHeight;
        initialX = e.clientX;
        initialY = e.clientY;
        document.addEventListener('mousemove', resizeChatbot);
        document.addEventListener('mouseup', stopResizing);
    });

    function resizeChatbot(e) {
        if (isResizing) {
            const newWidth = initialWidth + (e.clientX - initialX);
            const newHeight = initialHeight + (e.clientY - initialY);
            if (newWidth > 300 && newHeight > 200) {
                chatbot.style.width = `${newWidth}px`;
                chatbot.style.height = `${newHeight}px`;
            }
        }
    }

    function stopResizing() {
        isResizing = false;
        document.removeEventListener('mousemove', resizeChatbot);
        document.removeEventListener('mouseup', stopResizing);
    }
}

// Show notification
function showNotification(message) {
    // ... (existing logic)
}

// Voice input
function startVoiceInput() {
    // ... (existing logic)
}

// File attachment
function handleAttachment() {
    // ... (existing logic)
}

// Initial greeting
window.addEventListener('load', () => {
    setTimeout(() => {
        addBotMessageWithQuickReplies('Hi there! How can I help you today?');
    }, 500);
});