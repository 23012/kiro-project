// ── 상수 ──
const TODAY = new Date(2026, 3, 3); // 2026-04-03

// ── 유틸 ──
function fmt(d) {
  return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}
function fmtISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}
function parseDate(s) {
  const [y,m,d] = s.split('-').map(Number);
  return new Date(y, m-1, d);
}
function diffDays(a, b) {
  return Math.round((a - b) / 86400000);
}
function cleanName(raw) {
  return raw.replace(/_\(.*?\)$/, '').replace(/밀리그램|밀리그람/g, 'mg');
}

// ── 데이터 분석 ──
function analyze() {
  // 각 약품코드별 최신 처방 찾기
  const latestByCode = {};
  DRUG_DATA.forEach(d => {
    if (!latestByCode[d.code] || d.date > latestByCode[d.code].date) {
      latestByCode[d.code] = d;
    }
  });

  const active = [];   // 현재 복용 중
  const expired = [];  // 만료됨

  Object.values(latestByCode).forEach(d => {
    const start = parseDate(d.date);
    const end = new Date(start);
    end.setDate(end.getDate() + d.days);
    const remaining = diffDays(end, TODAY);
    const item = { ...d, startDate: start, endDate: end, remaining };
    if (remaining > 0) {
      active.push(item);
    } else {
      expired.push(item);
    }
  });

  active.sort((a,b) => b.date.localeCompare(a.date));
  expired.sort((a,b) => b.date.localeCompare(a.date));
  return { active, expired, latestByCode };
}

// ── 기간 내 처방 필터 ──
function getRecordsInRange(startDate, endDate) {
  return DRUG_DATA.filter(d => {
    const dt = parseDate(d.date);
    return dt >= startDate && dt <= endDate;
  });
}

// ── 추가/중단/변경 분석 ──
function analyzeChanges(startDate, endDate) {
  const records = getRecordsInRange(startDate, endDate);
  // 기간 이전의 모든 처방 기록
  const beforeRecords = DRUG_DATA.filter(d => parseDate(d.date) < startDate);
  const codesBeforePeriod = new Set(beforeRecords.map(d => d.code));

  // 추가: 기간 내 처음 등장한 약품코드 (이전에 없던 것)
  const added = [];
  const seenAdded = new Set();
  records.forEach(d => {
    if (!codesBeforePeriod.has(d.code) && !seenAdded.has(d.code)) {
      seenAdded.add(d.code);
      added.push(d);
    }
  });

  // 중단: 기간 이전에 있었지만, 기간 내 최신 처방의 종료일이 오늘 이전
  const stopped = [];
  const seenStopped = new Set();
  const { latestByCode } = analyze();
  codesBeforePeriod.forEach(code => {
    if (seenStopped.has(code)) return;
    const latest = latestByCode[code];
    if (!latest) return;
    const end = new Date(parseDate(latest.date));
    end.setDate(end.getDate() + latest.days);
    // 기간 내에 마지막 처방이 있고, 종료일이 지남
    if (diffDays(end, TODAY) <= 0) {
      // 기간 내에 이 약의 처방이 있었는지 확인
      const inRange = records.find(r => r.code === code);
      if (inRange) {
        seenStopped.add(code);
        stopped.push(latest);
      }
    }
  });

  // 변경: 같은 성분코드인데 약품코드가 다른 경우 (제형/제품 변경)
  const changed = [];
  const compCodeMap = {};
  // 기간 이전 성분코드 → 약품코드 매핑
  beforeRecords.forEach(d => {
    if (!compCodeMap[d.componentCode]) compCodeMap[d.componentCode] = new Set();
    compCodeMap[d.componentCode].add(d.code);
  });
  const seenChanged = new Set();
  records.forEach(d => {
    if (seenChanged.has(d.code)) return;
    const prev = compCodeMap[d.componentCode];
    if (prev && !prev.has(d.code)) {
      seenChanged.add(d.code);
      // 이전 약품 찾기
      const prevCode = [...prev][0];
      const prevDrug = beforeRecords.find(r => r.code === prevCode);
      changed.push({ current: d, previous: prevDrug });
    }
  });

  return { added, stopped, changed };
}

// ── 카드 HTML 생성 ──
function drugCardHTML(d, type) {
  const name = cleanName(d.name);
  const dotClass = type === 'active' ? 'dot-active' : type === 'new' ? 'dot-new' : type === 'stopped' ? 'dot-stopped' : 'dot-changed';
  const start = parseDate(d.date);
  const end = new Date(start); end.setDate(end.getDate() + d.days);
  const remaining = diffDays(end, TODAY);
  const elapsed = diffDays(TODAY, start);
  const total = d.days;
  const pct = Math.max(0, Math.min(100, Math.round((elapsed / total) * 100)));

  let metaHTML = '';
  if (type === 'active') {
    const daysClass = 'days-active';
    metaHTML = `
      <div class="drug-meta">
        <div class="drug-days ${daysClass}">${remaining}일 남음</div>
        <div class="progress-bar-wrap">
          <div class="progress-bg"><div class="progress-fill" style="width:${pct}%"></div></div>
        </div>
        <div class="drug-info">~${fmt(end)} 까지</div>
      </div>`;
  } else if (type === 'new') {
    metaHTML = `<div class="drug-meta"><div class="drug-days days-new">신규</div></div>`;
  } else if (type === 'stopped') {
    metaHTML = `<div class="drug-meta"><div class="drug-days days-stopped">중단</div></div>`;
  } else if (type === 'changed') {
    metaHTML = `<div class="drug-meta"><div class="drug-days days-changed">제형변경</div></div>`;
  }

  const rxInfo = type === 'active'
    ? `처방일 ${fmt(start)} · ${d.frequency}일 ${d.dose}${d.unit}`
    : type === 'new'
    ? `추가일 ${fmt(start)}`
    : type === 'stopped'
    ? `마지막 처방 ${fmt(start)} · 종료 추정 ${fmt(end)}`
    : `변경일 ${fmt(start)}`;

  return `
    <div class="drug-card">
      <div class="drug-dot ${dotClass}"></div>
      <div style="flex:1">
        <div class="drug-name">${name}</div>
        <div class="drug-component">${d.component}</div>
        <div class="drug-rx">${rxInfo}</div>
      </div>
      ${metaHTML}
    </div>`;
}

// ── 탭 렌더링 ──
function renderCurrentTab() {
  const { active, expired } = analyze();
  const container = document.getElementById('tab-0');
  let html = `
    <div class="summary-bar">
      <span class="summary-chip chip-active">복용 중 ${active.length}종</span>
      <span class="summary-chip chip-stopped">만료됨 ${expired.length}종</span>
    </div>
    <div class="section-label">현재 복용 중인 약물</div>`;
  active.forEach(d => { html += drugCardHTML(d, 'active'); });
  if (active.length === 0) {
    html += '<div class="empty-state">현재 복용 중인 약물이 없습니다.</div>';
  }
  container.innerHTML = html;
}

function renderRangeTab(tabId, type) {
  const container = document.getElementById(tabId);
  const select = container.querySelector('.range-select');
  const display = container.querySelector('.range-display');
  const inputGroup = container.querySelector('.date-input-group');

  let startDate, endDate;
  if (select.value === 'custom') {
    const inputs = inputGroup.querySelectorAll('.date-input');
    startDate = parseDate(inputs[0].value);
    endDate = parseDate(inputs[1].value);
  } else {
    const months = parseInt(select.value);
    endDate = new Date(TODAY);
    startDate = new Date(TODAY);
    startDate.setMonth(startDate.getMonth() - months);
  }

  if (display) display.textContent = fmt(startDate) + ' ~ ' + fmt(endDate);

  const changes = analyzeChanges(startDate, endDate);
  const listContainer = container.querySelector('.tab-list');

  let html = '';
  let items, label, cardType;
  if (type === 'added') {
    items = changes.added; label = '새로 추가된 약물'; cardType = 'new';
  } else if (type === 'stopped') {
    items = changes.stopped; label = '복용 중단된 약물'; cardType = 'stopped';
  } else {
    items = changes.changed; label = '용량 또는 제형 변경된 약물'; cardType = 'changed';
  }

  html += `<div class="section-label">${label}</div>`;
  if (type === 'changed') {
    items.forEach(c => {
      const prev = c.previous;
      const curr = c.current;
      html += `
        <div class="drug-card">
          <div class="drug-dot dot-changed"></div>
          <div style="flex:1">
            <div class="drug-name">${cleanName(prev ? prev.name : '')} → ${cleanName(curr.name)}</div>
            <div class="drug-component">${prev ? prev.component : ''} → ${curr.component}</div>
            <div class="drug-rx">변경일 ${fmt(parseDate(curr.date))}</div>
          </div>
          <div class="drug-meta"><div class="drug-days days-changed">제형변경</div></div>
        </div>`;
    });
  } else {
    items.forEach(d => { html += drugCardHTML(d, cardType); });
  }

  if (items.length === 0) {
    html += `<div class="empty-state">조회 기간 내 해당 항목이 없습니다.</div>`;
  }

  listContainer.innerHTML = html;
}

// ── 탭 전환 ──
function switchTab(idx, el) {
  document.querySelectorAll('.tab-content').forEach((t, i) => {
    t.style.display = i === idx ? 'block' : 'none';
  });
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');

  if (idx === 0) renderCurrentTab();
  else if (idx === 1) renderRangeTab('tab-1', 'added');
  else if (idx === 2) renderRangeTab('tab-2', 'stopped');
  else if (idx === 3) renderRangeTab('tab-3', 'changed');
}

// ── 기간 설정 변경 ──
function handleRangeChange(value, selectEl) {
  const row = selectEl.closest('.date-range-row');
  const inputGroup = row.querySelector('.date-input-group');
  const display = row.querySelector('.range-display');

  if (value === 'custom') {
    inputGroup.style.display = 'flex';
    if (display) display.style.display = 'none';
  } else {
    inputGroup.style.display = 'none';
    if (display) display.style.display = '';
  }

  // 현재 활성 탭 찾아서 다시 렌더링
  const tabContent = selectEl.closest('.tab-content');
  const tabId = tabContent.id;
  const typeMap = { 'tab-1': 'added', 'tab-2': 'stopped', 'tab-3': 'changed' };
  renderRangeTab(tabId, typeMap[tabId]);
}

function handleDateInput(inputEl) {
  const tabContent = inputEl.closest('.tab-content');
  const tabId = tabContent.id;
  const typeMap = { 'tab-1': 'added', 'tab-2': 'stopped', 'tab-3': 'changed' };
  renderRangeTab(tabId, typeMap[tabId]);
}

// ── 초기화 ──
document.addEventListener('DOMContentLoaded', () => {
  renderCurrentTab();
});
