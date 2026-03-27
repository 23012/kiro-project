function Sidebar({ conversations, activeId, isOpen, onSelect, onNew, onDelete, onToggle }) {
  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
      <div className="sidebar-header">
        <button className="sidebar-new-btn" onClick={onNew} aria-label="새 대화">
          ＋ 새 대화
        </button>
        <button className="sidebar-close-btn" onClick={onToggle} aria-label="사이드바 닫기">
          ✕
        </button>
      </div>
      <nav className="sidebar-list" aria-label="대화 기록">
        {conversations.map((conv) => (
          <div
            key={conv.id}
            className={`sidebar-item ${conv.id === activeId ? 'sidebar-item-active' : ''}`}
            onClick={() => onSelect(conv.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelect(conv.id)}
          >
            <span className="sidebar-item-icon">💬</span>
            <span className="sidebar-item-title">{conv.title}</span>
            <button
              className="sidebar-item-delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(conv.id);
              }}
              aria-label="대화 삭제"
            >
              🗑
            </button>
          </div>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
