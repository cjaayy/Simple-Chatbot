// This file handles the resizing functionality of the chatbot, enabling users to adjust the size of the chatbot interface.

const chatbot = document.getElementById('chatbot');
const resizeHandle = document.getElementById('resize-handle');

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