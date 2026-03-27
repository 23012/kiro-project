import { useState } from 'react';

// AI 응답에서 ```json:portal 블록을 추출
function extractPortalJson(text) {
  const match = text.match(/```json:portal\s*\n([\s\S]*?)\n```/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

// 포털 JSON 블록을 제거한 텍스트 반환
function removePortalJson(text) {
  return text.replace(/```json:portal\s*\n[\s\S]*?\n```/, '').trim();
}

function MessageBubble({ message, isFirst = false, isError = false }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [portalCopied, setPortalCopied] = useState(false);

  const portalData = !isUser ? extractPortalJson(message.content) : null;
  const displayText = !isUser ? removePortalJson(message.content) : message.content;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handlePortalCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(portalData, null, 2));
      setPortalCopied(true);
      setTimeout(() => setPortalCopied(false), 2000);
    } catch {}
  };

  return (
    <div className={`message ${isUser ? 'message-user' : 'message-assistant'}`}>
      {!isUser && <div className="message-avatar">🤖</div>}
      <div className={`message-bubble ${isUser ? 'bubble-user' : 'bubble-assistant'}`}>
        <pre className="message-text">{displayText}</pre>
        {!isUser && !isFirst && !isError && (
          <div className="message-actions">
            <button className="copy-btn" onClick={handleCopy} aria-label="메시지 복사">
              {copied ? '✅ 복사됨' : '📋 복사'}
            </button>
            {portalData && (
              <button className="copy-btn portal-btn" onClick={handlePortalCopy} aria-label="포털 자동입력 JSON 복사">
                {portalCopied ? '✅ JSON 복사됨' : '🏫 포털 자동입력 복사'}
              </button>
            )}
          </div>
        )}
      </div>
      {isUser && <div className="message-avatar">👤</div>}
    </div>
  );
}

export default MessageBubble;
