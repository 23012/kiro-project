import { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar.jsx';
import ChatWindow from './components/ChatWindow.jsx';
import ChatInput from './components/ChatInput.jsx';
import { getMockDrugResponse } from './mockResponse.js';
import './App.css';

const WELCOME_MSG = {
  role: 'assistant',
  content:
    '안녕하세요! 약 처방 정보 도우미입니다.\n\n약품 목록이 담긴 엑셀 파일(.xlsx)을 첨부하시면, 각 약품의 효능·용법·주의사항 등을 요약해드립니다.',
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

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const updateMessages = (convId, newMessages) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c;
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
      const data = await getMockDrugResponse(text, file);
      updateMessages(activeId, [
        ...newMessages,
        {
          role: 'assistant',
          content: data.reply,
          ...(data.drugChangeReport && { drugChangeReport: data.drugChangeReport }),
        },
      ]);
    } catch {
      updateMessages(activeId, [
        ...newMessages,
        { role: 'assistant', content: '응답 생성 중 오류가 발생했습니다.', isError: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const newChat = () => {
    const conv = { id: Date.now(), title: '새 대화', messages: [WELCOME_MSG] };
    setConversations((prev) => [conv, ...prev]);
    setActiveId(conv.id);
  };

  const selectConversation = (id) => setActiveId(id);

  const deleteConversation = (id) => {
    const remaining = conversations.filter((c) => c.id !== id);
    if (remaining.length === 0) { newChat(); return; }
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
            <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)} aria-label="사이드바 열기">
              ☰
            </button>
          )}
          <div className="header-left">
            <h1>💊 중앙대학교 약 처방 정보 챗봇</h1>
          </div>
        </header>
        <ChatWindow messages={messages} isLoading={isLoading} messagesEndRef={messagesEndRef} />
        <ChatInput onSend={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}

export default App;
