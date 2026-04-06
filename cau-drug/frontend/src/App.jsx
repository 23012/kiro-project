import { useState, useRef, useCallback } from 'react';
import DrugChangeReport from './components/DrugChangeReport.jsx';
import { getMockDrugResponse, MOCK_PREVIEW_DATA } from './mockResponse.js';
import './App.css';

function PreviewTable({ rows }) {
  if (!rows || rows.length === 0) return null;
  return (
    <div className="preview-table-wrap">
      <table className="preview-table">
        <thead>
          <tr>
            <th>조제일자</th>
            <th>약품명</th>
            <th>성분명</th>
            <th>투약량</th>
            <th>횟수</th>
            <th>일수</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td>{r.date}</td>
              <td className="preview-drug-name">{r.name}</td>
              <td>{r.ingredient}</td>
              <td className="preview-center">{r.dose}</td>
              <td className="preview-center">{r.freq}</td>
              <td className="preview-center">{r.days}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function parseTsvToRows(text) {
  const lines = text.trim().split('\n').filter(Boolean);
  return lines.map((line) => {
    const cols = line.split('\t');
    return {
      date: (cols[0] || '').replace(/(\d{4})(\d{2})(\d{2})/, '$1.$2.$3'),
      name: cols[2] || cols[1] || '',
      ingredient: cols[3] || '',
      dose: cols[4] || '',
      freq: cols[6] || '',
      days: cols[7] ? cols[7] + '일' : '',
    };
  });
}

function App() {
  const [state, setState] = useState('idle');
  const [report, setReport] = useState(null);
  const [fileName, setFileName] = useState('');
  const [fileRef, setFileRef] = useState(null);
  const [previewRows, setPreviewRows] = useState(null);
  const [totalCount, setTotalCount] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [pasted, setPasted] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    setFileName(file.name);
    setFileRef(file);
    setPreviewRows(null);
    setState('uploading');
    await new Promise((r) => setTimeout(r, 800 + Math.random() * 500));
    setState('preview');
  }, []);

  const handlePaste = useCallback((e) => {
    const text = e.clipboardData.getData('text/plain');
    if (!text || text.trim().length === 0) return;
    setPasted(true);
  }, []);

  const handleSubmitPaste = useCallback(async () => {
    setFileName('클립보드 붙여넣기');
    setFileRef(null);
    setTotalCount(56);
    setPreviewRows(null);
    setState('uploading');
    await new Promise((r) => setTimeout(r, 1000));
    setState('preview');
  }, []);

  const startAnalysis = useCallback(async () => {
    setState('loading');
    try {
      const data = await getMockDrugResponse('', fileRef);
      setReport(data.drugChangeReport);
      setState('done');
    } catch {
      setState('error');
    }
  }, [fileRef]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setDragging(false), []);

  const handleReset = () => {
    setState('idle');
    setReport(null);
    setFileName('');
    setFileRef(null);
    setPreviewRows(null);
    setTotalCount(0);
    setPasted(false);
  };

  return (
    <div className="app-layout">
      <div className="app-main">
        <div className={`app-content ${['idle','preview','uploading','loading'].includes(state) ? 'app-content-center' : ''}`}>

          {state === 'idle' && (
            <div className="home-hero">
              <div className="home-greeting-row">
                <img src="/logo.svg" alt="로고" className="home-logo" />
                <h2 className="home-greeting">안녕하세요, 김찬웅 교수님!</h2>
              </div>
              <p className="home-sub">
                중앙대학교병원 약물 처방 분석 도우미 입니다.<br />
                처방 내역을 업로드하면 변동 사항을 자동으로 분석합니다.
              </p>
              <div
                className={`home-input-box ${dragging ? 'home-input-box-active' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              >
                <textarea
                  className="home-textarea"
                  placeholder="처방 내역을 여기에 붙여넣으세요 (Ctrl+V)"
                  onPaste={handlePaste}
                />
                <div className="home-input-bottom">
                  <button
                    className="home-attach-btn"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="파일 첨부"
                  >+</button>
                  <span className="home-input-hint">또는 파일 드래그</span>
                  {pasted && (
                    <button className="home-send-btn" onClick={handleSubmitPaste}>
                      분석 요청 →
                    </button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  className="drop-zone-input"
                  onChange={(e) => handleFile(e.target.files[0])}
                />
              </div>
            </div>
          )}

          {state === 'uploading' && (
            <div className="loading-wrap">
              <div className="loading-spinner"></div>
              <div className="loading-text">파일을 읽고 있습니다</div>
            </div>
          )}

          {state === 'preview' && (
            <div className="preview-wrap">
              <div className="preview-header">
                <span className="preview-file">📎 {fileName}</span>
                <span className="preview-count">
                  총 {totalCount || 56}건 중 상위 10건 미리보기
                </span>
              </div>
              <PreviewTable rows={previewRows || MOCK_PREVIEW_DATA} />
              <div className="preview-confirm">
                <p className="preview-question">이 파일의 처방 내역을 분석할까요?</p>
                <div className="preview-actions">
                  <button className="preview-btn preview-btn-yes" onClick={startAnalysis}>
                    네, 분석 시작
                  </button>
                  <button className="preview-btn preview-btn-no" onClick={handleReset}>
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}

          {state === 'loading' && (
            <div className="loading-wrap">
              <div className="loading-spinner"></div>
              <div className="loading-text">처방 변동 사항을 분석하고 있습니다</div>
              <div className="typing-indicator" style={{ marginTop: '12px' }}>
                <span className="typing-text">분석 중</span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
                <span className="typing-dot"></span>
              </div>
            </div>
          )}

          {state === 'done' && report && (
            <div className="result-wrap">
              <div className="result-header">
                <span className="result-file">📎 {fileName}</span>
                <button className="reset-btn" onClick={handleReset}>새 파일 분석</button>
              </div>
              <DrugChangeReport data={report} />
            </div>
          )}

          {state === 'error' && (
            <div className="error-wrap">
              <div className="error-icon">⚠️</div>
              <div className="error-text">분석 중 오류가 발생했습니다</div>
              <button className="reset-btn" onClick={handleReset}>다시 시도</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;
