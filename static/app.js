const questionInput = document.getElementById('questionInput');
const sendButton = document.getElementById('sendButton');
const chatArea = document.getElementById('chatArea');
//sound
const clickSound = document.getElementById('clickSound');
clickSound.preload = 'auto';

function getCurrentTimestamp() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function addMessageToChat(messageContent, sender) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message');
    let strongPrefix = '';
    if (sender === 'user') {
        wrapper.classList.add('user');
        messageDiv.classList.add('user-message');
        strongPrefix = '<strong>你：</strong> ';
    } else {
        wrapper.classList.add('bot');
        messageDiv.classList.add('bot-message');
        strongPrefix = '<strong>音樂精靈：</strong> ';
    }
    messageDiv.innerHTML = `${strongPrefix}${messageContent}`;
    wrapper.appendChild(messageDiv);
    chatArea.appendChild(wrapper);
    chatArea.scrollTop = chatArea.scrollHeight;
}

// 新增：逐字打字機效果
function typeMessage(messageContent, sender, delay = 50) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('message-wrapper', sender === 'user' ? 'user' : 'bot');
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
    wrapper.appendChild(messageDiv);
    chatArea.appendChild(wrapper);
    chatArea.scrollTop = chatArea.scrollHeight;
    const strongPrefix = sender === 'user'
        ? '<strong>你：</strong> '
        : '<strong>音樂精靈：</strong> ';
    let i = 0;
    function typeChar() {
        if (i <= messageContent.length) {
            // 將換行轉 <br>
            const text = messageContent.slice(0, i).replace(/\n/g, '<br>');
            messageDiv.innerHTML = strongPrefix + text;
            chatArea.scrollTop = chatArea.scrollHeight;
            i++;
            setTimeout(typeChar, delay);
        }
    }
    typeChar();
}

async function askQuestion() {
    // 在背景顯示動態邊框
    document.body.classList.add('thinking');

    const question = questionInput.value.trim();
    const selectedQaType = document.querySelector('input[name="qaType"]:checked').value;
    if (!question) return;
    addMessageToChat(question, 'user');
    questionInput.value = '';
    sendButton.disabled = true;
    sendButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> 發送中...';
    const loadingMessageHTML = `<div class="message-wrapper bot"><div class="message bot-message loading-message">音樂精靈正在思考中... <div class="spinner-grow spinner-grow-sm text-primary ms-1" role="status"><span class="visually-hidden">Loading...</span></div></div></div>`;
    const loadingPlaceholder = document.createElement('div');
    loadingPlaceholder.innerHTML = loadingMessageHTML;
    chatArea.appendChild(loadingPlaceholder);
    chatArea.scrollTop = chatArea.scrollHeight;
    try {
        const response = await fetch('/ask', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ question: question, qa_type: selectedQaType }),
        });
        loadingPlaceholder.remove();
        if (response.ok) {
            const data = await response.json();
            if (data.answer) {
                // 使用逐字輸出效果
                typeMessage(data.answer, 'bot');
            } else if (data.error) {
                addMessageToChat(`<span class="error-message"><i class="fas fa-exclamation-triangle me-1"></i>錯誤：${data.error}</span>`, 'bot');
            }
        } else {
            const errorData = await response.json();
            addMessageToChat(`<span class="error-message"><i class="fas fa-exclamation-triangle me-1"></i>請求失敗：${response.status} ${errorData.error || ''}</span>`, 'bot');
        }
    } catch (error) {
        loadingPlaceholder.remove();
        addMessageToChat(`<span class="error-message"><i class="fas fa-network-wired me-1"></i>網絡錯誤：${error.message}</span>`, 'bot');
        console.error('Error:', error);
    } finally {
        // 移除背景邊框
        document.body.classList.remove('thinking');

        sendButton.disabled = false;
        sendButton.innerHTML = '<i class="fas fa-paper-plane me-1"></i> 發送';
        questionInput.focus();
    }
}
 document.addEventListener('DOMContentLoaded', function() {
    const questionForm = document.getElementById('questionForm');
    const questionInput = document.getElementById('questionInput');
    const chatArea = document.getElementById('chatArea');

    questionForm.addEventListener('submit', function(event) {
        if (!questionForm.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault(); // 阻止表單的預設送出行為
            const question = questionInput.value.trim();
            if (question) {
                addUserMessage(question);
                questionInput.value = ''; // 清空輸入框
                // 在這裡可以加入呼叫後端 API 或處理問題的邏輯
                // 模擬機器人回覆
                setTimeout(() => {
                    addBotMessage(`您問了：「${question}」，這是一個非常有趣的問題！讓我想想...`);
                }, 1000);
                setTimeout(() => {
                    addBotMessage(`(模擬回覆) 關於 "${question}"，根據我的知識庫... [這裡會是實際的答案]`);
                }, 3000);
            }
        }
        questionForm.classList.add('was-validated');
    });

    function addUserMessage(message) {
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('message-wrapper', 'user');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'user-message');
        messageDiv.innerHTML = `<strong>您：</strong> ${message}`;
        messageWrapper.appendChild(messageDiv);
        chatArea.appendChild(messageWrapper);
        scrollToBottom();
    }

    function addBotMessage(message) {
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('message-wrapper', 'bot');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'bot-message');
        messageDiv.innerHTML = `<strong>音樂精靈：</strong> ${message}`;
        messageWrapper.appendChild(messageDiv);
        chatArea.appendChild(messageWrapper);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatArea.scrollTop = chatArea.scrollHeight;
    }
});

sendButton.addEventListener('click', () => {
    clickSound.currentTime = 0;
    clickSound.play();
    askQuestion();
});

questionInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !sendButton.disabled) {
        clickSound.currentTime = 0;
        clickSound.play();
        askQuestion();
    }
});
// 1. 定義一組預設問題
const defaultPrompts = [
    '什麼是樂理？',
    '什麼是五線譜？',
    '什麼是和弦？',
    '鋼琴有多少個鍵？'
  ];
  
  // 2. 取得容器
  const suggestedPromptsDiv = document.getElementById('suggestedPrompts');
  
  // 3. 產生按鈕並插入
  defaultPrompts.forEach(promptText => {
    const btn = document.createElement('button');
    btn.type = 'button';
    // 使用 Bootstrap Icons 的 stars
    btn.innerHTML = '<i class="bi bi-stars me-1"></i>' + promptText;
    btn.addEventListener('click', () => {
    clickSound.currentTime = 0;
    clickSound.play();
      questionInput.value = promptText;
      questionInput.focus();
      askQuestion();
    });
    suggestedPromptsDiv.appendChild(btn);
  });
  