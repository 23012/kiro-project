const express = require('express');
const cors = require('cors');
const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const dotenv = require('dotenv');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { SYSTEM_PROMPT } = require('./prompts/paperFormat');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf', 'image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('지원하지 않는 파일 형식입니다. (PDF, PNG, JPG, GIF, WEBP만 가능)'));
  },
});

const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const MODEL_ID = process.env.BEDROCK_MODEL_ID || 'us.anthropic.claude-sonnet-4-20250514-v1:0';
const sessions = new Map();

function isImageFile(mimetype) {
  return mimetype.startsWith('image/');
}

async function extractPdfText(buffer) {
  try {
    const data = await pdfParse(buffer);
    return data.text;
  } catch {
    return null;
  }
}

async function buildMessageContent(text, file) {
  const content = [];
  if (file) {
    if (isImageFile(file.mimetype)) {
      const base64 = file.buffer.toString('base64');
      content.push({
        type: 'image',
        source: { type: 'base64', media_type: file.mimetype, data: base64 },
      });
      content.push({
        type: 'text',
        text: text || '이 이미지에서 논문 정보를 추출하여 업적 관리 양식에 맞게 정리해주세요.',
      });
    } else if (file.mimetype === 'application/pdf') {
      const pdfText = await extractPdfText(file.buffer);
      if (pdfText && pdfText.trim().length > 0) {
        content.push({
          type: 'text',
          text: `${text || '아래 PDF에서 추출한 논문 정보를 업적 관리 양식에 맞게 정리해주세요.'}\n\n--- PDF 내용 ---\n${pdfText.substring(0, 15000)}`,
        });
      } else {
        content.push({
          type: 'text',
          text: 'PDF에서 텍스트를 추출할 수 없었습니다. 스캔된 PDF 대신 텍스트 기반 PDF를 업로드하거나, 스크린샷 이미지를 첨부해주세요.',
        });
      }
    }
  } else {
    content.push({ type: 'text', text });
  }
  return content;
}

async function callBedrock(messages) {
  const body = JSON.stringify({
    anthropic_version: 'bedrock-2023-05-31',
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages,
  });

  const command = new InvokeModelCommand({
    modelId: MODEL_ID,
    contentType: 'application/json',
    accept: 'application/json',
    body,
  });

  const response = await bedrockClient.send(command);
  const result = JSON.parse(new TextDecoder().decode(response.body));
  return result.content[0].text;
}

app.post('/api/chat', upload.single('file'), async (req, res) => {
  try {
    const message = req.body.message || '';
    const sessionId = req.body.sessionId || 'default';
    const file = req.file || null;

    if (!message && !file) {
      return res.status(400).json({ error: '메시지 또는 파일을 입력해주세요.' });
    }

    if (!sessions.has(sessionId)) sessions.set(sessionId, []);
    const history = sessions.get(sessionId);

    const userContent = await buildMessageContent(message, file);
    history.push({ role: 'user', content: userContent });

    const assistantMessage = await callBedrock(history);
    history.push({ role: 'assistant', content: assistantMessage });

    if (history.length > 20) sessions.set(sessionId, history.slice(-20));

    res.json({
      reply: assistantMessage,
      fileProcessed: file ? { name: file.originalname, type: file.mimetype } : null,
    });
  } catch (error) {
    console.error('오류:', error.message);
    res.status(500).json({
      error: 'AI 응답 생성 중 오류가 발생했습니다. AWS 자격 증명과 Bedrock 모델 접근 권한을 확인해주세요.',
    });
  }
});

app.post('/api/reset', (req, res) => {
  const { sessionId = 'default' } = req.body;
  sessions.delete(sessionId);
  res.json({ message: '대화가 초기화되었습니다.' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다. (Amazon Bedrock - ${MODEL_ID})`);
});
