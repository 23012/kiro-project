import MessageBubble from './MessageBubble.jsx';

function ChatWindow({ messages, isLoading, messagesEndRef }) {
  return (
    <div className="chat-window" role="log" aria-label="채팅 메시지 영역">
      {messages.map((msg, index) => (
        <MessageBubble key={index} message={msg} isFirst={index === 0} isError={msg.isError} />
      ))}
      {isLoading && (
        <div className="message message-assistant">
          <div className="message-avatar">🤖</div>
          <div className="message-bubble bubble-assistant">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default ChatWindow;
