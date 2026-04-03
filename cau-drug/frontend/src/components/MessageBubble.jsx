import { useState } from 'react';
import DrugChangeReport from './DrugChangeReport.jsx';

function extractDrugTable(text) {
  const match = text.match(/```drug-table\s*\n([\s\S]*?)\n```/);
  if (!match) return null;
  try { return JSON.parse(match[1]); } catch { return null; }
}

function cleanText(text) {
  return text
    .replace(/```drug-table\s*\n[\s\S]*?\n```/g, '')
    .trim();
}

function DrugTable({ drugs }) {
  return (
    <div className="result-table-wrap">
      <table className="result-table">
        <thead>
          <tr>
            <th>약품명</th>
            <th>성분</th>
            <th>효능·효과</th>
            <th>용법·용량</th>
            <th>주의사항</th>
          </tr>
        </thead>
        <tbody>
          {drugs.map((drug, i) => (
            <tr key={i}>
              <td className="field-name">{drug.name || '-'}</td>
              <td>{drug.ingredient || '-'}</td>
              <td>{drug.effect || '-'}</td>
              <td>{drug.dosage || '-'}</td>
              <td>{drug.caution || '-'}</td>
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

  const drugTable = !isUser ? extractDrugTable(message.content) : null;
  const drugChangeReport = !isUser ? message.drugChangeReport || null : null;
  const displayText = !isUser ? cleanText(message.content) : message.content;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(displayText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const parts = displayText.split(/(\n*⚠️[^\n]*(?:\n(?!⚠️)[^\n]*)*)/g).filter(Boolean);

  return (
    <div className={`message ${isUser ? 'message-user' : 'message-assistant'}`}>
      {!isUser && <div className="message-avatar">💊</div>}
      <div className={`message-bubble ${isUser ? 'bubble-user' : 'bubble-assistant'}`}>
        {parts.map((part, i) => {
          const trimmed = part.trim();
          if (!trimmed) return null;
          if (trimmed.startsWith('⚠️')) {
            return <div key={i} className="result-note">{trimmed}</div>;
          }
          if (i === 0 && drugTable) {
            return (
              <div key={i}>
                <pre className="message-text">{trimmed}</pre>
                <DrugTable drugs={drugTable} />
              </div>
            );
          }
          return <pre key={i} className="message-text">{trimmed}</pre>;
        })}
        {drugChangeReport && <DrugChangeReport data={drugChangeReport} />}
        {!isUser && !isFirst && !isError && (
          <div className="message-actions">
            <button className="copy-btn" onClick={handleCopy} aria-label="메시지 복사">
              {copied ? '✅ 복사됨' : '📋 복사'}
            </button>
          </div>
        )}
      </div>
      {isUser && <div className="message-avatar">👤</div>}
    </div>
  );
}

export default MessageBubble;
