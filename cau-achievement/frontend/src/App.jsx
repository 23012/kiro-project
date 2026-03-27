import { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import ChatInput from './components/ChatInput.jsx';
import './App.css';

const WELCOME_MSG = {
  role: 'assistant',
  content:
    '안녕하세요! 중앙대학교 교수 업적 관리 도우미입니다.\n\n논문 정보가 담긴 파일(PDF, 이미지)을 첨부하거나, 텍스트로 직접 입력해주시면 업적 관리 시스템 양식에 맞게 정리해드리겠습니다. 📝',
};

function App() {
  const [conversations, setConversations] = useState([
    { id: Date.now(), title: '새 대화', messages: [WELCOME_MSG] },
  ]);
  const [activeId, setActiveId] = useState(conversations[0].id);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);

  const activeConv = conversations.find((c) => c.id === activeId);
  const messages = activeConv?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const updateMessages = (convId, newMessages) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
        // 제목 자동 설정: 첫 사용자 메시지에서 추출
        let title = c.title;
        if (title === '새 대화') {
          const firstUser = newMessages.find((m) => m.role === 'user');
          if (firstUser) {
            title = firstUser.content.substring(0, 30).replace(/\n/g, ' ');
            if (firstUser.content.length > 30) title += '...';
          }
        }
        return { ...c, messages: newMessages, title };
      })
    );
  };

  const sendMessage = async (text, file) => {
    if ((!text.trim() && !file) || isLoading) return;

    const userDisplay = file
      ? `📎 ${file.name}${text.trim() ? '\n' + text : ''}`
      : text;
    const newMessages = [...messages, { role: 'user', content: userDisplay }];
    updateMessages(activeId, newMessages);
    setIsLoading(true);

    try {
      const formData = new FormData();
      if (text.trim()) formData.append('message', text);
      if (file) formData.append('file', file);

      const response = await fetch('/api/chat', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();

      if (response.ok) {
        updateMessages(activeId, [
          ...newMessages,
          { role: 'assistant', content: data.reply },
        ]);
      } else {
        updateMessages(activeId, [
          ...newMessages,
          { role: 'assistant', content: `오류가 발생했습니다: ${data.error}`, isError: true },
        ]);
      }
    } catch {
      updateMessages(activeId, [
        ...newMessages,
        {
          role: 'assistant',
          content: '서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.',
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const newChat = async () => {
    try {
      await fetch('/api/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
    } catch {}
    const conv = { id: Date.now(), title: '새 대화', messages: [WELCOME_MSG] };
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
  };

  const selectConversation = (id) => {
    setActiveId(id);
  };

  const deleteConversation = (id) => {
    const remaining = conversations.filter((c) => c.id !== id);
    if (remaining.length === 0) {
      newChat();
      return;
    }
    setConversations(remaining);
    if (activeId === id) setActiveId(remaining[0].id);
  };

  return (
    <div className="app-layout">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        isOpen={sidebarOpen}
        onSelect={selectConversation}
        onNew={newChat}
        onDelete={deleteConversation}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="app-main">
        <header className="app-header">
          {!sidebarOpen && (
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="사이드바 열기"
            >
              ☰
            </button>
          )}
          <div className="header-left">
            <h1>🎓 중앙대학교 교수 업적 관리 시스템</h1>
          </div>
        </header>
        <ChatWindow
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
        />
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default App;
