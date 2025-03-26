// This file contains core functionalities and utilities for the chatbot, such as message processing and response generation.

const chatbotCore = (() => {
    // Process user messages and generate responses
    function processMessage(message) {
        const lowerMessage = message.toLowerCase();
        
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
            return getRandomResponse(['Hello! How can I assist you?', 'Hi there! What can I do for you?']);
        } else if (lowerMessage.includes('thank')) {
            return getRandomResponse(['You\'re welcome!', 'Happy to help!']);
        } else {
            return getRandomResponse(['I\'m not sure I understand. Could you rephrase that?', 'I don\'t have an answer for that yet.']);
        }
    }

    // Get a random response from an array
    function getRandomResponse(responses) {
        return responses[Math.floor(Math.random() * responses.length)];
    }

    return {
        processMessage,
    };
})();