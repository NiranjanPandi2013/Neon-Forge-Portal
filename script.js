document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('page-loader');
  const buttons = document.querySelectorAll('.download-button');
  const aiTabs = document.querySelectorAll('.tab-button');
  const aiContents = document.querySelectorAll('.ai-tab-content');
  const aiChat = document.getElementById('ai-chat');
  const aiPrompt = document.getElementById('ai-prompt');
  const aiSend = document.getElementById('ai-send-button');

  setTimeout(() => {
    if (loader) loader.classList.add('hidden');
  }, 1200);

  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 2200);
  };

  const conversationHistory = [];

  const buildAiResponse = async (prompt) => {
    try {
      const requestBody = {
        messages: [...conversationHistory, { role: 'user', content: prompt }],
      };

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Chat API failed');
      }
      return data.reply;
    } catch (error) {
      const baseMessage = 'Real AI service unavailable.';
      if (window.location.protocol === 'file:') {
        return `${baseMessage} You are opening the page from file://, not from the local server. Run server.py and open http://127.0.0.1:5000 instead.`;
      }
      return `${baseMessage} ${error.message}. Make sure server.py is running and you opened the site through http://127.0.0.1:5000.`;
    }
  };

  let typingBubble = null;
  const showTypingIndicator = () => {
    if (!aiChat) return;
    hideTypingIndicator();
    typingBubble = document.createElement('div');
    typingBubble.className = 'ai-message typing';
    typingBubble.innerText = 'Typing a thoughtful response...';
    aiChat.appendChild(typingBubble);
    aiChat.scrollTop = aiChat.scrollHeight;
  };

  const hideTypingIndicator = () => {
    if (typingBubble) {
      typingBubble.remove();
      typingBubble = null;
    }
  };

  const appendAiMessage = (text, sender = 'user') => {
    if (!aiChat) return;
    const message = document.createElement('div');
    message.className = `ai-message ${sender}`;
    message.innerText = text;
    aiChat.appendChild(message);
    aiChat.scrollTop = aiChat.scrollHeight;
  };

  buttons.forEach((button) => {
    button.addEventListener('click', (event) => {
      if (button.target === '_blank') {
        showToast(`${button.dataset.software || 'Software'} download page opened.`);
        return;
      }

      event.preventDefault();
      const software = button.dataset.software || 'Software';
      button.classList.add('downloading');
      button.textContent = 'Downloading...';

      setTimeout(() => {
        button.classList.remove('downloading');
        button.textContent = 'Download';
        showToast(`${software} download started!`);
      }, 1800);
    });
  });

  aiTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      aiTabs.forEach((btn) => btn.classList.toggle('active', btn === tab));
      aiContents.forEach((panel) => panel.classList.toggle('active', panel.id === tab.dataset.tab));
    });
  });

  if (aiSend && aiPrompt) {
    const sendQuery = async () => {
      const prompt = aiPrompt.value.trim();
      if (!prompt) {
        showToast('Type a question for NeonForge AI.');
        return;
      }
      appendAiMessage(prompt, 'user');
      conversationHistory.push({ role: 'user', content: prompt });
      aiPrompt.value = '';
      aiSend.disabled = true;
      aiSend.textContent = 'Thinking...';
      showTypingIndicator();

      const reply = await buildAiResponse(prompt);
      hideTypingIndicator();
      appendAiMessage(reply, 'system');
      conversationHistory.push({ role: 'assistant', content: reply });
      aiSend.disabled = false;
      aiSend.textContent = 'Send';
    };

    aiSend.addEventListener('click', sendQuery);
    aiPrompt.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendQuery();
      }
    });
  }
});
