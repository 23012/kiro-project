const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk').default;
const dotenv = require('dotenv');
const { SYSTEM_PROMPT } = require('./prompts/paperFormat');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 대화 히스토리를 세션별로 관리 (간단한 인메모리 저장)
const sessions = new Map();

app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId = 'default' } = req.body;

    if (!message) {
      return res.status(400).json({ error: '메시지를 입력해주세요.' });
    }

    // 세션별 대화 히스토리 가져오기
    if (!sessions.has(sessionId)) {
      sessions.set(sessionId, []);
    }
    const history = sessions.get(sessionId);

    // 사용자 메시지 추가
    history.push({ role: 'user', content: message });

    // Claude API 호출
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: history,
    });

    const assistantMessage = response.content[0].text;

    // 어시스턴트 응답을 히스토리에 추가
    history.push({ role: 'assistant', content: assistantMessage });

    // 히스토리가 너무 길어지면 오래된 것 제거 (최근 20개 유지)
    if (history.length > 20) {
      sessions.set(sessionId, history.slice(-20));
    }

    res.json({ reply: assistantMessage });
  } catch (error) {
    console.error('Claude API 오류:', error.message);
    res.status(500).json({
      error: 'AI 응답 생성 중 오류가 발생했습니다. API 키를 확인해주세요.',
    });
  }
});

// 세션 초기화
app.post('/api/reset', (req, res) => {
  const { sessionId = 'default' } = req.body;
  sessions.delete(sessionId);
  res.json({ message: '대화가 초기화되었습니다.' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
