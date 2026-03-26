import { useState } from 'react';

function ChatInput({ onSend, isLoading }) {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onSend(text);
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    // Shift+Enter는 줄바꿈, Enter만 누르면 전송
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="논문 정보를 입력하세요... (Shift+Enter로 줄바꿈)"
        disabled={isLoading}
        rows={3}
        aria-label="논문 정보 입력"
      />
      <button type="submit" disabled={isLoading || !text.trim()} aria-label="메시지 전송">
        {isLoading ? '⏳' : '📤'} 전송
      </button>
    </form>
  );
}

export default ChatInput;
