const socket = io('http://localhost:3030');
const messageContainer = document.getElementById('message-container');
const messageForm = document.getElementById('send-container');
const messageInput = document.getElementById('message-input');

const name = prompt('What is your name?');
appendMessage('You joined');

socket.emit('new-user', name);

socket.on('receive-message', (data) => {
  appendMessage(`${data.name}: ${data.message}`);
});

socket.on('user-connected', (name) => {
  appendMessage(`${name} joined`);
});

socket.on('user-disconnected', (name) => {
  appendMessage(`${name} disconnected`);
});

messageForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const message = messageInput.value;
  if (message.trim().length === 0) {
    alert('Please enter some message');
    return;
  }
  appendMessage(`You: ${message}`);
  socket.emit('send-message', message);
  messageInput.value = '';
});

function appendMessage(message) {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}
