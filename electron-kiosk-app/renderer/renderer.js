const chatArea = document.getElementById('chatArea');
const questionForm = document.getElementById('questionForm');
const questionInput = document.getElementById('questionInput');
const suggestedPrompts = document.getElementById('suggestedPrompts');
const electronVersion = document.getElementById('electronVersion');

const prompts = [
  '請介紹莫札特的生平',
  '有什麼適合放鬆的爵士樂？',
  '我想了解古典音樂的常見樂器',
];

function appendMessage(role, text) {
  const wrapper = document.createElement('div');
  wrapper.className = `message-wrapper ${role}`;

  const bubble = document.createElement('div');
  bubble.className = `message ${role}-message`;
  bubble.innerHTML = text;

  wrapper.appendChild(bubble);
  chatArea.appendChild(wrapper);
  chatArea.scrollTop = chatArea.scrollHeight;
}

function createPromptButtons() {
  prompts.forEach((prompt) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = prompt;
    button.addEventListener('click', () => {
      questionInput.value = prompt;
      questionInput.focus();
    });
    suggestedPrompts.appendChild(button);
  });
}

questionForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const question = questionInput.value.trim();
  if (!question) {
    return;
  }

  appendMessage('user', `<strong>您：</strong> ${question}`);
  questionInput.value = '';

  setTimeout(() => {
    appendMessage(
      'bot',
      '<strong>音樂精靈：</strong> 感謝提問，現場展示模式僅提供靜態示範。'
    );
  }, 400);
});

createPromptButtons();

if (window.kiosk?.version) {
  electronVersion.textContent = window.kiosk.version;
}
