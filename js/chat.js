// === Smart Chat Widget ===
(function() {
  // Knowledge base
  var KB = [];
  // Load knowledge base from external JSON
  var xhr = new XMLHttpRequest();
  var kbPath = (document.querySelector('script[src*="chat.js"]') || {}).src || '';
  kbPath = kbPath.replace('chat.js', 'chat-kb.json');
  if (!kbPath) kbPath = 'js/chat-kb.json';
  xhr.open('GET', kbPath, true);
  xhr.onload = function() { if (xhr.status === 200) KB = JSON.parse(xhr.responseText); };
  xhr.send();

  function findAnswer(input) {
    var text = input.toLowerCase().trim();
    if (!text) return null;
    var bestMatch = null;
    var bestScore = 0;
    for (var i = 0; i < KB.length; i++) {
      for (var j = 0; j < KB[i].keys.length; j++) {
        if (text.indexOf(KB[i].keys[j]) !== -1) {
          var score = KB[i].keys[j].length;
          if (score > bestScore) { bestScore = score; bestMatch = KB[i]; }
        }
      }
    }
    return bestMatch ? bestMatch.answer : null;
  }

  function createChat() {
    // Chat toggle button (hidden — use hero inline chat instead)
    var toggle = document.createElement('div');
    toggle.id = 'chat-toggle';
    toggle.innerHTML = '💬';
    toggle.title = 'Chat — Fragen Sie uns!';
    toggle.style.display = 'none';
    document.body.appendChild(toggle);

    // Chat window
    var chat = document.createElement('div');
    chat.id = 'chat-window';
    chat.innerHTML =
      '<div id="chat-header">' +
        '<span>🤖 Küchen-Assistent</span>' +
        '<button id="chat-close">&times;</button>' +
      '</div>' +
      '<div id="chat-messages"></div>' +
      '<div id="chat-input-area">' +
        '<input type="text" id="chat-input" placeholder="Ihre Frage..." autocomplete="off">' +
        '<button id="chat-send">➤</button>' +
      '</div>';
    document.body.appendChild(chat);

    // Styles
    var style = document.createElement('style');
    style.textContent =
      '#chat-toggle{position:fixed;bottom:90px;left:20px;z-index:1000;width:56px;height:56px;' +
      'background:linear-gradient(135deg,#1d3557,#457b9d);color:#fff;border-radius:50%;display:flex;' +
      'align-items:center;justify-content:center;font-size:1.5rem;cursor:pointer;box-shadow:0 4px 20px rgba(0,0,0,0.2);transition:0.3s}' +
      '#chat-toggle:hover{transform:scale(1.1)}' +
      '#chat-toggle.has-badge::after{content:"1";position:absolute;top:-2px;right:-2px;background:#e63946;' +
      'color:#fff;font-size:0.7rem;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center}' +
      '#chat-window{position:fixed;bottom:90px;left:20px;z-index:1001;width:340px;max-height:480px;' +
      'background:#fff;border-radius:16px;box-shadow:0 10px 40px rgba(0,0,0,0.15);display:none;flex-direction:column;overflow:hidden}' +
      '#chat-window.open{display:flex}' +
      '#chat-header{background:linear-gradient(135deg,#1d3557,#457b9d);color:#fff;padding:14px 16px;' +
      'display:flex;justify-content:space-between;align-items:center;font-weight:600;font-size:0.95rem}' +
      '#chat-close{background:none;border:none;color:#fff;font-size:1.4rem;cursor:pointer;padding:0 4px}' +
      '#chat-messages{flex:1;overflow-y:auto;padding:16px;max-height:320px;display:flex;flex-direction:column;gap:10px}' +
      '.chat-msg{max-width:85%;padding:10px 14px;border-radius:12px;font-size:0.9rem;line-height:1.5;white-space:pre-wrap;word-wrap:break-word}' +
      '.chat-bot{background:#f1faee;color:#1a1a2e;align-self:flex-start;border-bottom-left-radius:4px}' +
      '.chat-user{background:#1d3557;color:#fff;align-self:flex-end;border-bottom-right-radius:4px}' +
      '.chat-wa{text-align:center;padding:8px}' +
      '.chat-wa a{display:inline-block;background:#25d366;color:#fff;padding:8px 16px;border-radius:50px;font-size:0.85rem;font-weight:600;text-decoration:none}' +
      '#chat-input-area{display:flex;padding:10px;border-top:1px solid #f0f0f0;gap:8px}' +
      '#chat-input{flex:1;padding:10px 14px;border:2px solid #e0e0e0;border-radius:50px;font-size:0.9rem;outline:none;font-family:inherit}' +
      '#chat-input:focus{border-color:#457b9d}' +
      '#chat-send{background:#e63946;color:#fff;border:none;border-radius:50%;width:38px;height:38px;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center}' +
      '#chat-send:hover{background:#c1121f}' +
      '@media(max-width:400px){#chat-window{width:calc(100vw - 40px);left:20px;right:20px;bottom:80px}}' +
      '.typing-dots{display:flex;gap:4px;padding:10px 14px;align-self:flex-start}' +
      '.typing-dots span{width:8px;height:8px;background:#ccc;border-radius:50%;animation:dotPulse 1.2s infinite}' +
      '.typing-dots span:nth-child(2){animation-delay:0.2s}' +
      '.typing-dots span:nth-child(3){animation-delay:0.4s}' +
      '@keyframes dotPulse{0%,80%,100%{opacity:0.3;transform:scale(0.8)}40%{opacity:1;transform:scale(1)}}';
    document.head.appendChild(style);

    var messages = document.getElementById('chat-messages');
    var input = document.getElementById('chat-input');
    var isOpen = false;

    function addMsg(text, type) {
      var div = document.createElement('div');
      div.className = 'chat-msg ' + type;
      div.textContent = text;
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function addWhatsApp() {
      var div = document.createElement('div');
      div.className = 'chat-wa';
      div.innerHTML = '<a href="https://wa.me/4915218547875" target="_blank" rel="noopener">💬 Per WhatsApp schreiben</a>';
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function showTyping() {
      var div = document.createElement('div');
      div.className = 'typing-dots';
      div.id = 'typing';
      div.innerHTML = '<span></span><span></span><span></span>';
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
    }

    function removeTyping() {
      var t = document.getElementById('typing');
      if (t) t.remove();
    }

    function handleSend() {
      var text = input.value.trim();
      if (!text) return;
      addMsg(text, 'chat-user');
      input.value = '';
      showTyping();
      setTimeout(function() {
        removeTyping();
        var answer = findAnswer(text);
        if (answer) {
          addMsg(answer, 'chat-bot');
        } else {
          addMsg('Gute Frage! Dafür brauche ich meinen Chef. Schreiben Sie uns direkt per WhatsApp — wir antworten schnell!', 'chat-bot');
          addWhatsApp();
        }
      }, 600 + Math.random() * 400);
    }

    toggle.addEventListener('click', function() {
      isOpen = !isOpen;
      chat.classList.toggle('open', isOpen);
      toggle.style.display = isOpen ? 'none' : 'flex';
      if (isOpen && messages.children.length === 0) {
        addMsg('Moin! 👋 Ich bin der Küchen-Assistent. Fragen Sie mich nach Preisen, Leistungen oder Terminen!', 'chat-bot');
      }
      if (isOpen) input.focus();
    });

    document.getElementById('chat-close').addEventListener('click', function() {
      isOpen = false;
      chat.classList.remove('open');
      toggle.style.display = 'flex';
    });

    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') handleSend();
    });

    document.getElementById('chat-send').addEventListener('click', handleSend);

    // Auto-show badge after 5 seconds
    setTimeout(function() { toggle.classList.add('has-badge'); }, 5000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createChat);
  } else {
    createChat();
  }
})();
