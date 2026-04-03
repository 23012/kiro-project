import { useState, useRef } from 'react';

function ChatInput({ onSend, isLoading }) {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if ((text.trim() || file) && !isLoading) {
      onSend(text, file);
      setText('');
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) setFile(selected);
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="chat-input-wrapper">
      {file && (
        <div className="file-preview">
          <span className="file-preview-name">📎 {file.name}</span>
          <button className="file-remove-btn" onClick={removeFile} aria-label="첨부파일 제거">✕</button>
        </div>
      )}
      <form className="chat-input" onSubmit={handleSubmit}>
        <button
          type="button"
          className="attach-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          aria-label="엑셀 파일 첨부"
        >
          📎
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".xlsx,.xls,.csv"
          hidden
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="약품 엑셀 파일을 첨부하거나 약품명을 입력하세요"
          disabled={isLoading}
          rows={1}
          aria-label="약품 정보 입력"
        />
        <button type="submit" disabled={isLoading || (!text.trim() && !file)} aria-label="메시지 전송">
          전송
        </button>
      </form>
    </div>
  );
}

export default ChatInput;
