import { useState, useRef, useEffect } from 'react';
import ChatWindow from './components/ChatWindow.jsx';
import ChatInput from './components/ChatInput.jsx';
import './App.css';

function App() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        '안녕하세요! 중앙대학교 교수 업적 관리 도우미입니다.\n\n논문 정보를 자유롭게 입력해주시면, 업적 관리 시스템 양식에 맞게 정리해드리겠습니다. 📝',
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text) => {
    if (!text.trim() || isLoading) return;

    const userMessage = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages((prev) => [
          ...prev,
          { role: 'assistant', content: data.reply },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `오류가 발생했습니다: ${data.error}`,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            '서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = async () => {
    try {
      await fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
    } catch {
      // 리셋 실패해도 프론트 초기화는 진행
    }
    setMessages([
      {
        role: 'assistant',
        content:
          '대화가 초기화되었습니다. 새로운 논문 정보를 입력해주세요! 📝',
      },
    ]);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>🎓 중앙대학교 교수 업적 관리 시스템</h1>
          <span className="header-subtitle">논문 정보 포맷 변환 도우미</span>
        </div>
        <button className="reset-btn" onClick={resetChat} aria-label="대화 초기화">
          🔄 새 대화
        </button>
      </header>
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        messagesEndRef={messagesEndRef}
      />
      <ChatInput onSend={sendMessage} isLoading={isLoading} />
    </div>
  );
}

export default App;
