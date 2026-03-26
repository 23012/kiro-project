import { useState } from 'react';

function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 복사 실패 시 무시
    }
  };

  return (
    <div className={`message ${isUser ? 'message-user' : 'message-assistant'}`}>
      {!isUser && <div className="message-avatar">🤖</div>}
      <div className={`message-bubble ${isUser ? 'bubble-user' : 'bubble-assistant'}`}>
        <pre className="message-text">{message.content}</pre>
        {!isUser && (
          <button className="copy-btn" onClick={handleCopy} aria-label="메시지 복사">
            {copied ? '✅ 복사됨' : '📋 복사'}
          </button>
        )}
      </div>
      {isUser && <div className="message-avatar">👤</div>}
    </div>
  );
}

export default MessageBubble;
