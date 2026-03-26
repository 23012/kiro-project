# 🎓 중앙대학교 교수 업적 관리 시스템

## 📌 이 프로젝트는 무엇인가요?

중앙대학교 교수님들의 **논문 업적을 쉽게 정리**해주는 챗봇 시스템입니다.

논문 정보(제목, 저널명, 저자 수, 페이지 등)를 채팅창에 입력하면,
AI가 자동으로 **중앙대학교 업적 관리 양식에 맞는 포맷**으로 변환해줍니다.

### 💡 쉽게 말하면?

1. 채팅창에 논문 원문을 입력합니다 (자유 형식으로 적어도 됩니다)
2. AI가 분석합니다
3. 중앙대학교 포털 연구마당 논문 입력 창에 바로 붙여넣을 수 있는 형태로 결과를 돌려줍니다

---

## 🛠 기술 스택 (어떤 기술로 만들었나요?)

| 구분 | 기술 | 설명 |
|------|------|------|
| 프론트엔드 (화면) | React | 사용자가 보는 채팅 화면을 만드는 기술 |
| 백엔드 (서버) | Node.js + Express | 사용자의 요청을 받아 AI에게 전달하는 중간 역할 |
| AI 엔진 | Claude API (Anthropic) | 논문 정보를 분석하고 포맷을 만들어주는 인공지능 |
| 스타일링 | CSS | 화면을 예쁘게 꾸미는 기술 |

---

## 📁 프로젝트 구조

```
cau-achievement/
├── backend/                 ← 서버 (AI와 통신)
│   ├── server.js            ← 서버 메인 파일
│   ├── prompts/
│   │   └── paperFormat.js   ← AI에게 보내는 프롬프트 (지시문)
│   ├── package.json
│   └── .env                 ← API 키 설정 파일 (비공개)
├── frontend/                ← 화면 (채팅 인터페이스)
│   ├── src/
│   │   ├── App.jsx          ← 메인 화면
│   │   ├── App.css          ← 메인 스타일
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx   ← 채팅 메시지 표시 영역
│   │   │   ├── ChatInput.jsx    ← 메시지 입력창
│   │   │   └── MessageBubble.jsx ← 개별 메시지 말풍선
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md                ← 이 파일
```

---

## 🚀 설치 및 실행 방법

### 1단계: 사전 준비

- **Node.js**가 설치되어 있어야 합니다 (https://nodejs.org)
- **Claude API 키**가 필요합니다 (https://console.anthropic.com)

### 2단계: API 키 설정

`backend/.env` 파일을 만들고 아래 내용을 입력하세요:

```
ANTHROPIC_API_KEY=여기에_본인의_API_키를_입력하세요
PORT=3001
```

### 3단계: 백엔드 실행

```bash
cd cau-achievement/backend
npm install
npm start
```

### 4단계: 프론트엔드 실행

```bash
cd cau-achievement/frontend
npm install
npm run dev
```

### 5단계: 브라우저에서 접속

`http://localhost:5173` 으로 접속하면 채팅 화면이 나타납니다.

---

## 📝 사용 예시

### 입력 (채팅창에 이렇게 적으면 됩니다)

```
논문 제목: What do patients value? A retrospective study of compliment letters from a single institution
학술지명: BMJ OPEN
발행기관: BMJ PUBLISHING GROUP
국내외구분: 국외
공동연구 구분: 공동-수인
전체저자수: 2
전체저자수(참여구분): 6
시작페이지: e101505(1~
끝페이지: e101505(~7)
게재권/집: 16
발행일자: 2026.03.16
학술지구분: SCI Expanded
사업구분: 기관고유
```

### 출력 (AI가 이런 형태로 정리해줍니다)

업적 관리 시스템 양식에 맞춰 정리된 표 형태의 결과가 나옵니다.

---

## ⚙️ 주요 기능

| 기능 | 설명 |
|------|------|
| 논문 정보 파싱 | 자유 형식으로 입력해도 AI가 알아서 각 항목을 분류합니다 |
| 업적 포맷 변환 | 중앙대학교 업적 관리 시스템 양식에 맞게 변환합니다 |
| 챗봇 대화 | 채팅 형태로 편하게 사용할 수 있습니다 |
| 대화 기록 유지 | 이전 대화 내용이 화면에 남아있어 확인이 쉽습니다 |

---

## ❓ 자주 묻는 질문

**Q: API 키는 어디서 받나요?**
A: https://console.anthropic.com 에서 회원가입 후 발급받을 수 있습니다.

**Q: 비용이 드나요?**
A: Claude API는 사용량에 따라 소액의 비용이 발생합니다. 논문 1건 처리 시 약 $0.01 미만입니다.

**Q: 논문 정보를 정확한 형식으로 입력해야 하나요?**
A: 아닙니다. 자유롭게 입력해도 AI가 알아서 분석합니다. 다만, 정보가 많을수록 더 정확한 결과를 얻을 수 있습니다.
