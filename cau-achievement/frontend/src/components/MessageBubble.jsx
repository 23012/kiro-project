import { useState } from 'react';

// ```json:portal 블록 추출
function extractPortalJson(text) {
  const match = text.match(/```json:portal\s*\n([\s\S]*?)\n```/);
  if (!match) return null;
  try { return JSON.parse(match[1]); } catch { return null; }
}

// ```table 블록 추출
function extractTable(text) {
  const match = text.match(/```table\s*\n([\s\S]*?)\n```/);
  if (!match) return null;
  try { return JSON.parse(match[1]); } catch { return null; }
}

// 특수 블록 제거 후 텍스트 반환
function cleanText(text) {
  return text
    .replace(/```json:portal\s*\n[\s\S]*?\n```/g, '')
    .replace(/```table\s*\n[\s\S]*?\n```/g, '')
    .trim();
}

function ResultTable({ rows }) {
  return (
    <div className="result-table-wrap">
      <table className="result-table">
        <thead>
          <tr>
            <th>필드명</th>
            <th>값</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([field, value], i) => (
            <tr key={i}>
              <td className="field-name">{field}</td>
              <td className={!value ? 'missing' : ''}>{value || '정보 없음'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function MessageBubble({ message, isFirst = false, isError = false }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [portalCopied, setPortalCopied] = useState(false);

  const portalData = !isUser ? extractPortalJson(message.content) : null;
  const tableData = !isUser ? extractTable(message.content) : null;
  const displayText = !isUser ? cleanText(message.content) : message.content;

  // 텍스트를 ⚠️ 경고 블록과 일반 텍스트로 분리
  const parts = displayText.split(/(\n*⚠️[^\n]*(?:\n(?!⚠️)[^\n]*)*)/g).filter(Boolean);

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
        {parts.map((part, i) => {
          const trimmed = part.trim();
          if (!trimmed) return null;
          if (trimmed.startsWith('⚠️')) {
            return <div key={i} className="result-note">{trimmed}</div>;
          }
          // 테이블 삽입 위치: 첫 번째 일반 텍스트 뒤
          if (i === 0 && tableData) {
            return (
              <div key={i}>
                <pre className="message-text">{trimmed}</pre>
                <ResultTable rows={tableData} />
              </div>
            );
          }
          return <pre key={i} className="message-text">{trimmed}</pre>;
        })}
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
