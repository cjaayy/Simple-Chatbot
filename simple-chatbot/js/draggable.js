// draggable.js

const chatbot = document.getElementById('chatbot');
let isDragging = false;
let offsetX, offsetY;

chatbot.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - chatbot.getBoundingClientRect().left;
    offsetY = e.clientY - chatbot.getBoundingClientRect().top;

    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
});

function handleDrag(e) {
    if (isDragging) {
        chatbot.style.left = `${e.clientX - offsetX}px`;
        chatbot.style.top = `${e.clientY - offsetY}px`;
    }
}

function stopDrag() {
    isDragging = false;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
}

// Ensure the chatbot is positioned correctly on load
window.addEventListener('load', () => {
    chatbot.style.position = 'absolute';
    chatbot.style.left = '50px'; // Default position
    chatbot.style.top = '50px'; // Default position
});