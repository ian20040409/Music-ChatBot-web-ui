// static/app.js

// Element references
const questionInput = document.getElementById('questionInput');
const sendButton = document.getElementById('sendButton');
const chatArea = document.getElementById('chatArea');
const suggestedPromptsDiv = document.getElementById('suggestedPrompts');

// Sounds
const clickSound = document.getElementById('clickSound');
const clickSound2 = document.getElementById('clickSound2');
const thinkingSound = document.getElementById('thinkingSound');
clickSound.preload = 'auto';
clickSound2.preload = 'auto';


// 註冊 Service Worker（以 /static 為 scope）
(async () => {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/static/sw.js', { scope: '/static/' });
    } catch (e) {
      // 可選：console.error('SW register failed', e);
    }
  }
})();

// 客製安裝提示
let deferredPrompt = null;
const installBtn = document.getElementById('installBtn');
if (installBtn) installBtn.style.display = 'none';

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  if (installBtn) installBtn.style.display = 'inline-flex';
});

installBtn?.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  installBtn.style.display = 'none';
});




// 建一組 pool
// 全域變數

const click2Pool = Array.from({ length: 5 }, () => {
    const a = new Audio(clickSound2.src);
    a.preload = 'auto';
    a.load();
    return a;
  });
  let click2Idx = 0;
  
  // 2. 靜音解鎖函式
  function silentUnlock(audio) {
    audio.muted = true;               // 全程靜音
    audio.play()                      // play → pause，但聽不到聲音
      .then(() => {
        audio.pause();
        audio.muted = false;          // 解鎖後再打開聲音
      })
      .catch(() => {
        audio.muted = false;
      });
  }
  function playClick2() {
    const a = click2Pool[click2Idx];
    a.currentTime = 0;
    a.play().catch(() => {});
    click2Idx = (click2Idx + 1) % click2Pool.length;
  }
  


  
//  





let recaptchaWidgetId = null;
let siteReady = false;

// 初始禁用 UI
function disableUI() {
  sendButton.disabled = true;
  questionInput.disabled = true;
  [...suggestedPromptsDiv.querySelectorAll('button')].forEach(b => b.disabled = true);
}
function enableUI() {
  sendButton.disabled = false;
  questionInput.disabled = false;
  [...suggestedPromptsDiv.querySelectorAll('button')].forEach(b => b.disabled = false);
}

// reCAPTCHA 載入 callback
function onRecaptchaLoad() {
  recaptchaWidgetId = grecaptcha.render('recaptcha-container', {
    sitekey: '6LdpUUIrAAAAAN0B7l4yFjy9-JHG952f5O2iuleh',
    callback: onRecaptchaSuccess
  });
}

// 驗證成功後啟用網站
function onRecaptchaSuccess(token) {

    [clickSound, clickSound2, thinkingSound, ...click2Pool].forEach(silentUnlock);
    // 先靜音解鎖
    
 // 隱藏 Modal
 const modalEl = document.getElementById('recaptchaModal');
 bootstrap.Modal.getInstance(modalEl).hide();

 // 隱藏「開始驗證」按鈕
 const startBtn = document.getElementById('startVerifyBtn');
 if (startBtn) startBtn.style.display = 'none';

 siteReady = true;
 enableUI();
 addMessageToChat('驗證完成，歡迎使用音樂知識問答精靈！', 'bot');
}

// 顯示 Modal 進行驗證
function showRecaptchaModal() {
  disableUI();
  const modal = new bootstrap.Modal(document.getElementById('recaptchaModal'));
  modal.show();

  // 如果尚未渲染，render
  if (!recaptchaWidgetId) {
    recaptchaWidgetId = grecaptcha.render('recaptcha-container', {
      sitekey: '6LdpUUIrAAAAAN0B7l4yFjy9-JHG952f5O2iuleh',
      callback: onRecaptchaSuccess
    });
  } else {
    grecaptcha.reset(recaptchaWidgetId);
  }
}

// Utility: add a chat message
function addMessageToChat(content, sender) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('message-wrapper', sender === 'user' ? 'user' : 'bot');
  const msg = document.createElement('div');
  msg.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
  const prefix = sender === 'user' ? '<strong>你：</strong> ' : '<strong>音樂精靈：</strong> ';
  msg.innerHTML = prefix + content;
  wrapper.appendChild(msg);
  chatArea.appendChild(wrapper);
  chatArea.scrollTop = chatArea.scrollHeight;
}

// Utility: typing effect
function typeMessage(content, sender, delay = 50) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('message-wrapper', sender === 'user' ? 'user' : 'bot');
  const msg = document.createElement('div');
  msg.classList.add('message', sender === 'user' ? 'user-message' : 'bot-message');
  wrapper.appendChild(msg);
  chatArea.appendChild(wrapper);
  chatArea.scrollTop = chatArea.scrollHeight;

  const prefix = sender === 'user' ? '<strong>你：</strong> ' : '<strong>音樂精靈：</strong> ';
  let i = 0;
  function step() {
    if (i <= content.length) {
      msg.innerHTML = prefix + content.slice(0, i).replace(/\n/g, '<br>');
      chatArea.scrollTop = chatArea.scrollHeight;
      i++;
      setTimeout(step, delay);
    } else if (sender === 'bot') {
      playClick2();
      
     
    }
  }
  step();
}

// 問答流程
async function askQuestion() {
  if (!siteReady) return;

  document.body.classList.add('thinking');
  const question = questionInput.value.trim();
  const selectedQaType = document.querySelector('input[name="qaType"]:checked').value;
  
  // 獲取生成參數
  const temperature = parseFloat(document.getElementById('temperatureRange').value);
  const maxTokens = parseInt(document.getElementById('maxTokensRange').value);
  
  if (!question) return;

  addMessageToChat(question, 'user');
  questionInput.value = '';
  sendButton.disabled = true;
  sendButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status"></span> 發送中...';

  const loading = document.createElement('div');
  loading.innerHTML = `<div class="message-wrapper bot"><div class="message bot-message">
    音樂精靈正在思考... <div class="spinner-grow spinner-grow-sm text-primary" role="status"></div>
  </div></div>`;
  chatArea.appendChild(loading);
  chatArea.scrollTop = chatArea.scrollHeight;

  setTimeout(() => {
    const snd = thinkingSound.cloneNode();
    snd.currentTime = 0;
    snd.play();
  }, 500);
  const interval = setInterval(() => {
    const snd = thinkingSound.cloneNode();
    snd.currentTime = 0;
    snd.play();
  }, 4500);

  try {
    const requestBody = { 
      question, 
      qa_type: selectedQaType,
      temperature: temperature,
      max_tokens: maxTokens
    };
    
    const resp = await fetch('/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody)
    });
    loading.remove();
    if (resp.ok) {
      const data = await resp.json();
      if (data.answer) {
        typeMessage(data.answer, 'bot');
      } else {
        addMessageToChat(`錯誤：${data.error || '未知錯誤'}`, 'bot');
      }
    } else {
      const err = await resp.json();
      addMessageToChat(`請求失敗 ${resp.status} ${err.error || ''}`, 'bot');
    }
  } catch (e) {
    loading.remove();
    addMessageToChat(`網絡錯誤：${e.message}`, 'bot');
  } finally {
    clearInterval(interval);
    document.body.classList.remove('thinking');
    sendButton.disabled = false;
    sendButton.innerHTML = '<i class="fas fa-paper-plane me-1"></i> 發送';
    questionInput.focus();
  }
}

// 初始預設問題按鈕
const defaultPrompts = ['什麼是樂理？','什麼是五線譜？','什麼是和弦？','鋼琴有多少個鍵？'];
defaultPrompts.forEach(text => {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'btn btn-outline-secondary';
  btn.innerHTML = `<i class="bi bi-stars me-1"></i>${text}`;
  btn.addEventListener('click', () => {
    clickSound.currentTime = 0; clickSound.play();
    questionInput.value = text;
    askQuestion();
  });
  suggestedPromptsDiv.appendChild(btn);
});

// 事件綁定
sendButton.addEventListener('click', () => {
  clickSound.currentTime = 0; clickSound.play();
  askQuestion();
});
questionInput.addEventListener('keypress', e => {
  if (e.key === 'Enter' && !sendButton.disabled) {
    clickSound.currentTime = 0; clickSound.play();
    askQuestion();
  }
});

// 參數控制相關事件監聽器
document.addEventListener('DOMContentLoaded', () => {
  // Temperature slider
  const temperatureRange = document.getElementById('temperatureRange');
  const temperatureValue = document.getElementById('temperatureValue');
  temperatureRange.addEventListener('input', (e) => {
    temperatureValue.textContent = e.target.value;
  });

  // Max tokens slider
  const maxTokensRange = document.getElementById('maxTokensRange');
  const maxTokensValue = document.getElementById('maxTokensValue');
  maxTokensRange.addEventListener('input', (e) => {
    maxTokensValue.textContent = e.target.value;
  });

  // 根據選擇的問答類型調整預設參數
  document.querySelectorAll('input[name="qaType"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'rag') {
        // RAG 模式使用較低的溫度以確保一致性
        temperatureRange.value = '0.6';
        temperatureValue.textContent = '0.6';
        maxTokensRange.value = '320';
        maxTokensValue.textContent = '320';
      } else if (e.target.value === 'local') {
        // 本地模式使用較高的溫度以增加創意
        temperatureRange.value = '0.8';
        temperatureValue.textContent = '0.8';
        maxTokensRange.value = '256';
        maxTokensValue.textContent = '256';
      }
    });
  });

  // 重置按鈕
  document.getElementById('resetParams').addEventListener('click', () => {
    const selectedType = document.querySelector('input[name="qaType"]:checked').value;
    if (selectedType === 'rag') {
      temperatureRange.value = '0.6';
      temperatureValue.textContent = '0.6';
      maxTokensRange.value = '320';
      maxTokensValue.textContent = '320';
    } else {
      temperatureRange.value = '0.8';
      temperatureValue.textContent = '0.8';
      maxTokensRange.value = '256';
      maxTokensValue.textContent = '256';
    }
  });

  // 快速預設配置按鈕
  document.getElementById('conservativePreset').addEventListener('click', () => {
    temperatureRange.value = '0.3';
    temperatureValue.textContent = '0.3';
    maxTokensRange.value = '200';
    maxTokensValue.textContent = '200';
  });

  document.getElementById('balancedPreset').addEventListener('click', () => {
    temperatureRange.value = '0.6';
    temperatureValue.textContent = '0.6';
    maxTokensRange.value = '280';
    maxTokensValue.textContent = '280';
  });

  document.getElementById('creativePreset').addEventListener('click', () => {
    temperatureRange.value = '0.9';
    temperatureValue.textContent = '0.9';
    maxTokensRange.value = '350';
    maxTokensValue.textContent = '350';
  });
});

// DOM ready
document.addEventListener('DOMContentLoaded', () => {
    disableUI();
    addMessageToChat('請先完成驗證以進入系統。', 'bot');
  
    // 新增：插入「開始驗證」按鈕，並給它一個 id
    const startBtnWrapper = document.createElement('div');
    startBtnWrapper.classList.add('message-wrapper', 'bot');
    const startBtn = document.createElement('button');
    startBtn.id = 'startVerifyBtn';
    startBtn.textContent = '開始驗證';
    startBtn.className = 'btn btn-warning';
    startBtn.addEventListener('click', showRecaptchaModal);
    startBtnWrapper.appendChild(startBtn);
    chatArea.appendChild(startBtnWrapper);
    chatArea.scrollTop = chatArea.scrollHeight;
  
    // 一進來就自動彈出 Modal
    showRecaptchaModal();
});
