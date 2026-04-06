import { useState } from 'react';

function SummaryCards({ data }) {
  const cards = [
    { label: '현재 복용 중', count: data.current.length, color: '#2e7d32' },
    { label: '새로 복용', count: data.newDrugs.length, color: '#1565c0' },
    { label: '중단', count: data.stopped.length, color: '#c62828' },
    { label: '용량·성분 변경', count: data.changed.length, color: '#6b5ce7' },
  ];
  return (
    <div className="dcr-summary">
      {cards.map((c, i) => (
        <div key={i} className="dcr-summary-card" style={{ borderTopColor: c.color }}>
          <span className="dcr-summary-count" style={{ color: c.color }}>{c.count}</span>
          <span className="dcr-summary-label">{c.label}</span>
        </div>
      ))}
    </div>
  );
}

function CurrentDrugsTable({ drugs, dateRange }) {
  return (
    <div className="dcr-section">
      <div className="dcr-section-header dcr-header-current">
        <span className="dcr-section-title">현재 복용 약물</span>
        <span className="dcr-section-date">처방일 {dateRange}</span>
      </div>
      <table className="dcr-table">
        <thead>
          <tr>
            <th>약품명 / 성분</th>
            <th>분류</th>
            <th>복용</th>
            <th>잔여</th>
          </tr>
        </thead>
        <tbody>
          {drugs.map((d, i) => (
            <tr key={i}>
              <td>
                <div className="dcr-drug-name">{d.name}</div>
                <div className="dcr-drug-ingredient">{d.ingredient}</div>
              </td>
              <td><span className="dcr-category-text">{d.category}</span></td>
              <td className="dcr-cell-center">{d.dosage}</td>
              <td className="dcr-cell-center">
                <div className="dcr-remaining">
                  <span className="dcr-remaining-days">{d.remainingDays}일</span>
                  <div className="dcr-remaining-bar">
                    <div className="dcr-remaining-fill" style={{ width: `${d.remainingPercent || 50}%`, background: d.remainingColor || '#4caf50' }} />
                  </div>
                  <span className="dcr-remaining-until">~{d.remainingUntil}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StoppedDrugsSection({ items, date }) {
  return (
    <div className="dcr-section">
      <div className="dcr-section-header dcr-header-stopped">
        <span className="dcr-section-title">중단</span>
        <span className="dcr-section-date">{date}</span>
      </div>
      <div className="dcr-stopped-list">
        {items.map((item, i) => {
          const isSwitch = item.statusType === 'switch';
          return (
            <div key={i} className={`dcr-stopped-card ${isSwitch ? 'dcr-stopped-switch' : 'dcr-stopped-full'}`}>
              <div className="dcr-stopped-body">
                <span className="dcr-dot" style={{ background: isSwitch ? '#e6a817' : '#c62828' }} />
                <div className="dcr-stopped-info">
                  <div className="dcr-stopped-name">{item.name}</div>
                  <div className="dcr-stopped-desc">{item.description}</div>
                  <div className={`dcr-stopped-detail ${isSwitch ? 'dcr-detail-switch' : 'dcr-detail-fullstop'}`}>
                    {isSwitch ? (
                      <>
                        <del>{item.detail.split('→')[0].trim()}</del>
                        {' → '}
                        <span className="dcr-stopped-highlight">{item.detail.split('→')[1].trim()}</span>
                      </>
                    ) : (
                      <span>{item.detail}</span>
                    )}
                  </div>
                </div>
                <div className="dcr-stopped-right">
                  <span className={`dcr-status-badge ${isSwitch ? 'dcr-badge-switch' : 'dcr-badge-fullstop'}`}>
                    {item.statusLabel}
                  </span>
                  <span className="dcr-card-date">{item.date}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DrugChangeCards({ title, date, items, type }) {
  const dotColors = { new: '#1565c0', stopped: '#c62828', changed: '#e65100' };
  const badgeStyles = {
    new: { bg: '#e3f2fd', color: '#1565c0' },
    stopped: { bg: '#ffebee', color: '#c62828' },
    changed: { bg: '#fff3e0', color: '#e65100' },
  };

  return (
    <div className="dcr-section">
      <div className={`dcr-section-header ${type === 'new' ? 'dcr-header-new' : type === 'changed' ? 'dcr-header-changed' : ''}`}>
        <span className="dcr-section-title">{title}</span>
        <span className="dcr-section-date">{date}</span>
      </div>
      <div className={`dcr-card-list ${type === 'new' ? 'dcr-card-list-new' : ''}`}>
        {items.map((item, i) => (
          <div key={i} className={`dcr-card ${type === 'new' ? 'dcr-card-new' : ''}`}>
            <div className="dcr-card-left">
              <span className="dcr-dot" style={{ background: dotColors[type] }} />
              <div className="dcr-card-info">
                <div className="dcr-card-name">{item.name}</div>
                <div className="dcr-card-desc">{item.description}</div>
                {item.reason && <div className="dcr-card-reason">{item.reason}</div>}
                {item.detail && <div className="dcr-card-detail">{item.detail}</div>}
              </div>
            </div>
            <div className="dcr-card-right">
              <span className="dcr-status-badge" style={{ background: badgeStyles[type].bg, color: badgeStyles[type].color }}>
                {item.statusLabel}
              </span>
              <span className="dcr-card-date">{item.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChangedDrugsSection({ items, date }) {
  return (
    <div className="dcr-section">
      <div className="dcr-section-header dcr-header-changed">
        <span className="dcr-section-title">용량 및 성분 변경</span>
        <span className="dcr-section-date">{date}</span>
      </div>
      <div className="dcr-changed-list">
        {items.map((item, i) => (
          <div key={i} className="dcr-changed-card">
            <div className="dcr-changed-body">
              <span className="dcr-dot" style={{ background: '#6b5ce7' }} />
              <div className="dcr-changed-info">
                <div className="dcr-changed-name">{item.name}</div>
                <div className="dcr-changed-desc">{item.description}</div>
                <div className="dcr-changed-detail">
                  <del>{item.detail.split('→')[0].trim()}</del>
                  {' → '}
                  <span className="dcr-changed-highlight">{item.detail.split('→')[1].trim()}</span>
                </div>
              </div>
              <div className="dcr-changed-right">
                <span className="dcr-status-badge dcr-badge-changed">{item.statusLabel}</span>
                <span className="dcr-card-date">{item.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DrugChangeReport({ data }) {
  return (
    <div className="dcr-wrap">
      <SummaryCards data={data} />
      <CurrentDrugsTable drugs={data.current} dateRange={data.currentDateRange} />
      {data.newDrugs.length > 0 && (
        <DrugChangeCards title="새로 복용" date={data.newDrugsDate} items={data.newDrugs} type="new" />
      )}
      {data.stopped.length > 0 && (
        <StoppedDrugsSection items={data.stopped} date={data.stoppedDate} />
      )}
      {data.changed.length > 0 && (
        <ChangedDrugsSection items={data.changed} date={data.changedDateRange} />
      )}
    </div>
  );
}

export default DrugChangeReport;
