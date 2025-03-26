/* filepath: c:\Users\mjhay\Desktop\Programming\Visual Studio Code\HTML-CSS-JavaScript\Simple Chatbot\script.js */
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

// Bot response messages
const botResponses = {
    greetings: [
        'Hello! How can I help you today?',
        'Hi there! What can I do for you?',
        'Hey! How can I assist you?'
    ],
    thanks: [
        'You\'re welcome!',
        'Happy to help!',
        'No problem at all!'
    ],
    unknown: [
        'I\'m not sure I understand. Could you rephrase that?',
        'I don\'t have an answer for that yet.',
        'I\'m still learning. Could you try asking something else?'
    ],
    commands: {
        help: 'Here are some commands you can use...',
        clear: 'Chat history cleared!',
        time: 'The current time is {time}',
        save: 'Conversation saved to downloads!',
        restart: 'Restarting conversation...'
    }
};

// Emojis data structure
const emojis = {
    smileys: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘'],
    animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧'],
    food: ['🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆'],
    travel: ['✈️', '🚗', '🚕', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🏍️', '🚂'],
    activities: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🏒', '🏑', '🥍', '🏏', '⛳']
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateEmojis('smileys');
    applyStoredSettings();
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

// Resize chatbot
let isResizing = false;
let initialHeight;
let initialY;

resizeHandle.addEventListener('mousedown', (e) => {
    isResizing = true;
    initialHeight = parseInt(window.getComputedStyle(chatbot).height);
    initialY = e.clientY;
    
    document.addEventListener('mousemove', handleResize);
    document.addEventListener('mouseup', stopResize);
});

function handleResize(e) {
    if (isResizing) {
        const deltaY = e.clientY - initialY;
        const newHeight = initialHeight + deltaY;
        
        if (newHeight >= 300 && newHeight <= 800) {
            chatbot.style.height = `${newHeight}px`;
        }
    }
}

function stopResize() {
    isResizing = false;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
}

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
    
    if (message.startsWith('/')) {
        handleCommand(message);
        userInput.value = '';
        updateCharacterCount();
        return;
    }
    
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
    const lowerMessage = message.toLowerCase();
    
    // Basic response logic
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
        const greeting = getRandomResponse(botResponses.greetings);
        addBotMessageWithQuickReplies(greeting);
    } 
    else if (lowerMessage.includes('thank')) {
        addBotMessage(getRandomResponse(botResponses.thanks));
    }
    else if (lowerMessage.includes('help')) {
        const helpContent = `
            Here are some things I can help you with:
            • Answering simple questions
            • Providing information
            • Basic calculations
            • Setting reminders

            Type /help to see available commands.
        `;
        addBotMessage(helpContent);
    }
    else if (lowerMessage.includes('feature')) {
        const featuresContent = `
            Here are my features:
            • Multiple themes
            • Voice input
            • Emoji support
            • Quick replies
            • Command system
            
            Try them out!
        `;
        addBotMessage(featuresContent);
    }
    else {
        // Default response for unknown queries
        addBotMessage(getRandomResponse(botResponses.unknown));
    }
}

// Add user message to chat
function addMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', sender);
    
    if (sender === 'user') {
        messageDiv.innerHTML = `
            ${message}
            <div class="message-info">
                <div class="timestamp">${getCurrentTime()}</div>
                <div class="message-actions">
                    <button class="action-btn" title="Copy"><i class="fas fa-copy"></i></button>
                </div>
            </div>
        `;
    }
    
    chatWindow.appendChild(messageDiv);
    scrollToBottom();
    
    // Add click event to copy button
    const copyBtn = messageDiv.querySelector('.action-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(message);
            showNotification('Text copied to clipboard');
        });
    }
}

// Add bot message to chat
function addBotMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', 'bot');
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
        </div>
        <div class="message-info">
            <div class="timestamp">${getCurrentTime()}</div>
            <div class="message-actions">
                <button class="action-btn" title="Copy"><i class="fas fa-copy"></i></button>
                <button class="action-btn" title="Read Aloud"><i class="fas fa-volume-up"></i></button>
            </div>
        </div>
    `;
    
    chatWindow.appendChild(messageDiv);
    scrollToBottom();
    
    // Add event listeners to buttons
    const copyBtn = messageDiv.querySelector('.action-btn:first-child');
    const readBtn = messageDiv.querySelector('.action-btn:last-child');
    
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(message);
        showNotification('Text copied to clipboard');
    });
    
    readBtn.addEventListener('click', () => {
        speakText(message);
    });
}

// Add bot message with quick replies
function addBotMessageWithQuickReplies(message) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('chat-message', 'bot');
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${message}</p>
            <div class="quick-replies">
                <button class="quick-reply-btn">Get Started</button>
                <button class="quick-reply-btn">Features</button>
                <button class="quick-reply-btn">Help</button>
            </div>
        </div>
        <div class="message-info">
            <div class="timestamp">${getCurrentTime()}</div>
            <div class="message-actions">
                <button class="action-btn" title="Copy"><i class="fas fa-copy"></i></button>
                <button class="action-btn" title="Read Aloud"><i class="fas fa-volume-up"></i></button>
            </div>
        </div>
    `;
    
    chatWindow.appendChild(messageDiv);
    scrollToBottom();
    
    // Add event listeners to buttons
    const copyBtn = messageDiv.querySelector('.action-btn:first-child');
    const readBtn = messageDiv.querySelector('.action-btn:last-child');
    const quickReplyBtns = messageDiv.querySelectorAll('.quick-reply-btn');
    
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(message);
        showNotification('Text copied to clipboard');
    });
    
    readBtn.addEventListener('click', () => {
        speakText(message);
    });
    
    quickReplyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const replyText = btn.textContent;
            addMessage('user', replyText);
            showTypingIndicator();
            
            setTimeout(() => {
                hideTypingIndicator();
                if (replyText === 'Get Started') {
                    addBotMessage('Great! I can help you with various tasks. Just type your question or use one of the commands by typing / followed by the command name.');
                } else if (replyText === 'Features') {
                    addBotMessage(`
                        Here are my features:
                        • Multiple themes
                        • Voice input
                        • Emoji support
                        • Quick replies
                        • Command system
                        
                        Try them out!
                    `);
                } else if (replyText === 'Help') {
                    addBotMessage(`
                        Here are some commands you can use:
                        • /help - Show help information
                        • /clear - Clear chat history
                        • /time - Show current time
                        • /save - Save conversation
                        • /restart - Restart conversation
                    `);
                }
            }, 800);
        });
    });
}

// Show typing indicator
function showTypingIndicator() {
    typingIndicator.classList.add('visible');
}

// Hide typing indicator
function hideTypingIndicator() {
    typingIndicator.classList.remove('visible');
}

// Get current time
function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12;
    
    return `${hours}:${minutes < 10 ? '0' + minutes : minutes} ${ampm}`;
}

// Get random response from array
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Scroll chat to bottom
function scrollToBottom() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Handle slash commands
function handleCommand(command) {
    const cmd = command.slice(1).toLowerCase();
    
    switch (cmd) {
        case 'help':
            addBotMessage(`
                Available commands:
                • /help - Show this help information
                • /clear - Clear chat history
                • /time - Show current time
                • /save - Save conversation
                • /restart - Restart conversation
            `);
            break;
        case 'clear':
            clearChat();
            addBotMessage(botResponses.commands.clear);
            break;
        case 'time':
            const now = new Date();
            const timeString = now.toLocaleTimeString();
            addBotMessage(botResponses.commands.time.replace('{time}', timeString));
            break;
        case 'save':
            saveConversation();
            addBotMessage(botResponses.commands.save);
            break;
        case 'restart':
            clearChat();
            addBotMessage(botResponses.commands.restart);
            setTimeout(() => {
                addBotMessageWithQuickReplies('Hi there! How can I help you today?');
            }, 500);
            break;
        default:
            addBotMessage(`Command "${cmd}" not recognized. Type /help to see available commands.`);
    }
}

// Clear chat history
function clearChat() {
    while (chatWindow.firstChild) {
        chatWindow.removeChild(chatWindow.firstChild);
    }
}

// Save conversation as text file
function saveConversation() {
    const messages = document.querySelectorAll('.chat-message');
    let conversation = '';
    
    messages.forEach(message => {
        const isBot = message.classList.contains('bot');
        const text = message.querySelector('p')?.textContent || message.textContent.trim();
        const time = message.querySelector('.timestamp')?.textContent || '';
        
        conversation += `${isBot ? 'Bot' : 'You'} (${time}): ${text}\n\n`;
    });
    
    const blob = new Blob([conversation], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    
    a.href = url;
    a.download = `chat_${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    
    URL.revokeObjectURL(url);
}

// Toggle emoji picker
function toggleEmojiPicker() {
    emojiPicker.classList.toggle('visible');
}

// Populate emojis in the grid
function populateEmojis(category) {
    emojiGrid.innerHTML = '';
    
    emojis[category].forEach(emoji => {
        const emojiSpan = document.createElement('div');
        emojiSpan.classList.add('emoji');
        emojiSpan.textContent = emoji;
        
        emojiSpan.addEventListener('click', () => {
            userInput.value += emoji;
            updateCharacterCount();
            emojiPicker.classList.remove('visible');
            userInput.focus();
        });
        
        emojiGrid.appendChild(emojiSpan);
    });
    
    // Update active category
    emojiCategories.forEach(cat => {
        cat.classList.remove('active');
        if (cat.dataset.category === category) {
            cat.classList.add('active');
        }
    });
}

// Set up emoji category selection
emojiCategories.forEach(category => {
    category.addEventListener('click', () => {
        const categoryName = category.dataset.category;
        populateEmojis(categoryName);
    });
});

// Search emojis
emojiSearch.addEventListener('input', () => {
    const searchTerm = emojiSearch.value.toLowerCase();
    
    if (searchTerm === '') {
        // If search is empty, show current category
        const activeCategory = document.querySelector('.emoji-category.active');
        populateEmojis(activeCategory.dataset.category);
        return;
    }
    
    emojiGrid.innerHTML = '';
    
    // Search across all categories
    Object.values(emojis).flat().forEach(emoji => {
        // This is a simple search - in a real app, you'd use emoji names/descriptions
        if (emoji.includes(searchTerm)) {
            const emojiSpan = document.createElement('div');
            emojiSpan.classList.add('emoji');
            emojiSpan.textContent = emoji;
            
            emojiSpan.addEventListener('click', () => {
                userInput.value += emoji;
                updateCharacterCount();
                emojiPicker.classList.remove('visible');
                userInput.focus();
            });
            
            emojiGrid.appendChild(emojiSpan);
        }
    });
});

// Minimize/Maximize chatbot
function toggleMinimizeChatbot() {
    chatbot.classList.toggle('minimized');
    
    if (chatbot.classList.contains('minimized')) {
        const oldHeight = chatbot.style.height;
        chatbot.dataset.oldHeight = oldHeight || '600px';
        chatbot.style.height = '60px';
        minimizeBtn.innerHTML = '<i class="fas fa-expand-alt"></i>';
    } else {
        chatbot.style.height = chatbot.dataset.oldHeight;
        minimizeBtn.innerHTML = '<i class="fas fa-minus"></i>';
    }
}

// Toggle theme panel
function toggleThemePanel() {
    settingsPanel.classList.toggle('visible');
    helpPanel.classList.remove('visible');
}

// Toggle help panel
function toggleHelpPanel() {
    helpPanel.classList.toggle('visible');
    settingsPanel.classList.remove('visible');
}

// Toggle settings panel
function toggleSettingsPanel() {
    settingsPanel.classList.toggle('visible');
    helpPanel.classList.remove('visible');
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 2000);
}

// Voice input
function startVoiceInput() {
    if (!('webkitSpeechRecognition' in window)) {
        showNotification('Speech recognition is not supported in your browser');
        return;
    }
    
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    voiceBtn.innerHTML = '<i class="fas fa-microphone-slash"></i>';
    voiceBtn.classList.add('recording');
    showNotification('Listening...');
    
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        updateCharacterCount();
    };
    
    recognition.onend = () => {
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceBtn.classList.remove('recording');
    };
    
    recognition.onerror = () => {
        showNotification('Error occurred in recognition');
        voiceBtn.innerHTML = '<i class="fas fa-microphone"></i>';
        voiceBtn.classList.remove('recording');
    };
    
    recognition.start();
}

// Text-to-Speech
function speakText(text) {
    if (!('speechSynthesis' in window)) {
        showNotification('Text-to-speech is not supported in your browser');
        return;
    }
    
    // Stop any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    
    // Use selected language
    const langCode = languageSelect.value;
    if (langCode !== 'en') {
        utterance.lang = langCode;
    }
    
    window.speechSynthesis.speak(utterance);
}

// File attachment
function handleAttachment() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf,.doc,.docx,.txt';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // In a real app, you would upload the file to a server
            // For this demo, we'll just show the file name
            addMessage('user', `[Attached file: ${file.name}]`);
            showTypingIndicator();
            
            setTimeout(() => {
                hideTypingIndicator();
                addBotMessage(`I received your file: ${file.name}`);
            }, 1000);
        }
    };
    
    input.click();
}

// Theme options
themeOptions.forEach(option => {
    option.addEventListener('click', () => {
        const theme = option.dataset.theme;
        applyTheme(theme);
        
        // Update active state
        themeOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        // Save to localStorage
        localStorage.setItem('chatbot-theme', theme);
    });
});

// Apply theme
function applyTheme(theme) {
    document.body.className = '';
    document.body.classList.add(`${theme}-theme`);
}

// Text size slider
textSizeSlider.addEventListener('input', () => {
    const size = textSizeSlider.value;
    sliderValue.textContent = `${size}px`;
    document.documentElement.style.setProperty('--font-size', `${size}px`);
    
    // Save to localStorage
    localStorage.setItem('chatbot-font-size', size);
});

// Language selection
languageSelect.addEventListener('change', () => {
    localStorage.setItem('chatbot-language', languageSelect.value);
});

// Save settings
saveSettingsBtn.addEventListener('click', () => {
    showNotification('Settings saved');
    settingsPanel.classList.remove('visible');
});

// Apply stored settings
function applyStoredSettings() {
    const theme = localStorage.getItem('chatbot-theme') || 'light';
    const fontSize = localStorage.getItem('chatbot-font-size') || '14';
    const language = localStorage.getItem('chatbot-language') || 'en';
    
    // Apply theme
    applyTheme(theme);
    
    // Update theme option active state
    themeOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.theme === theme) {
            option.classList.add('active');
        }
    });
    
    // Apply font size
    textSizeSlider.value = fontSize;
    sliderValue.textContent = `${fontSize}px`;
    document.documentElement.style.setProperty('--font-size', `${fontSize}px`);
    
    // Apply language
    languageSelect.value = language;
}

// Initial greeting
window.addEventListener('load', () => {
    setTimeout(() => {
        addBotMessageWithQuickReplies('Hi there! How can I help you today?');
    }, 500);
});