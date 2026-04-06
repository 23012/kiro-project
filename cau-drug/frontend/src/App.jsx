import { useState, useRef, useCallback } from 'react';
import DrugChangeReport from './components/DrugChangeReport.jsx';
import { getMockDrugResponse } from './mockResponse.js';
import './App.css';

function App() {
  const [state, setState] = useState('idle'); // idle | loading | done | error
  const [report, setReport] = useState(null);
  const [fileName, setFileName] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = useCallback(async (file) => {
    if (!file) return;
    setFileName(file.name);
    setState('loading');
    try {
      const data = await getMockDrugResponse('', file);
      setReport(data.drugChangeReport);
      setState('done');
    } catch {
      setState('error');
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragging(false);
  }, []);

  const handleReset = () => {
    setState('idle');
    setReport(null);
    setFileName('');
  };

  return (
    <div className="app-layout">
      <div className="app-main">
        <header className="app-header">
          <div className="header-left">
            <h1>💊 중앙대학교병원 약물 처방 내역 분석</h1>
          </div>
        </header>

        <div className={`app-content ${state === 'idle' ? 'app-content-center' : ''}`}>
          {state === 'idle' && (
            <div
              className={`drop-zone ${dragging ? 'drop-zone-active' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              aria-label="파일 업로드 영역"
            >
              <div className="drop-zone-icon">📂</div>
              <div className="drop-zone-text">
                약품 목록 파일(.xslx 또는 .pdf)을<br />드래그하거나 클릭하여 업로드 해주세요
              </div>
              <div className="drop-zone-hint">환자의 약물 처방 내역을 자동으로 분석합니다</div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls,.csv"
                className="drop-zone-input"
                onChange={(e) => handleFile(e.target.files[0])}
              />
            </div>
          )}

          {state === 'loading' && (
            <div className="loading-wrap">
              <div className="loading-file">📎 {fileName}</div>
              <div className="loading-spinner"></div>
              <div className="loading-text">처방 변경 내역을 분석하고 있습니다</div>
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
