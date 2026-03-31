/**
 * Mock 응답 모듈 - 백엔드 없이 프론트엔드에서 논문 분석 결과를 시뮬레이션합니다.
 */

const MOCK_DELAY_MS = 2000;

// 파일 첨부 시 mock 응답
function generateFileResponse(fileName) {
  return `PDF에서 논문 정보를 추출했습니다. 업적 관리 시스템 양식으로 정리해 드립니다.

\`\`\`table
[
  ["논문 구분", "국제전문학술지"],
  ["세부 구분", "SCI-E"],
  ["국내외구분", "국외"],
  ["학술지명", "BMJ OPEN"],
  ["발행기관", "BMJ PUBLISHING GROUP"],
  ["공동연구 구분", "공동-수인"],
  ["전체저자수", "2"],
  ["참여구분", "공동(교신)"],
  ["전체저자수(참여)", "6"],
  ["연구보조원수", "0"],
  ["논문명(원어)", "What do patients value? A retrospective study of compliment letters from a single institution"],
  ["논문명(타언어)", ""],
  ["시작페이지", "e101505(1~"],
  ["끝페이지", "e101505(~7)"],
  ["게재권/집", "16"],
  ["발행일자", "2026.03.16"],
  ["게재시소속", "본교"],
  ["학술지구분", "SCI Expanded"],
  ["ISSN", ""],
  ["사업구분", "기관고유"],
  ["보안대상과제", "해당없음"]
]
\`\`\`

⚠️ 확인 필요 항목: 논문명(타언어), ISSN, 평가코드가 PDF에서 확인되지 않았습니다. 해당 항목은 포털에서 직접 입력해 주세요.

\`\`\`json:portal
{
  "gubun1": "R01100",
  "gubun2": "R01104",
  "intrCd": "2",
  "str2": "BMJ OPEN",
  "str3": "BMJ PUBLISHING GROUP",
  "coopDiv": "2",
  "totalCoopCnt": "2",
  "roleCd": "5",
  "totalWriter": "6",
  "str7": "0",
  "frscCnt": "0",
  "str1": "What do patients value? A retrospective study of compliment letters from a single institution",
  "str5": "",
  "str8": "e101505(1~",
  "str9": "e101505(~7)",
  "str4": "16",
  "str10": "",
  "dt1": "20260316",
  "deptGb": "1",
  "sciCd": "04",
  "issnNo": "",
  "projectFg": "1",
  "securityFg": "1"
}
\`\`\``;
}

// 텍스트 메시지에 대한 mock 응답 (ISSN 등 추가 정보 제공 시)
const TEXT_RESPONSES = [
  {
    pattern: /issn/i,
    response: (text) => {
      const issnMatch = text.match(/\d{4}[- ]?\d{3}[\dXx]/);
      const issn = issnMatch ? issnMatch[0] : '0959-8138';
      return `감사합니다! ISSN ${issn}을 반영했습니다. BMJ Open의 공식 ISSN과 일치하여 확인되었습니다. ✓

나머지 항목(평가코드, 논문명 타언어)도 입력해 주시겠어요?`;
    },
  },
  {
    pattern: /평가코드|평가 코드/,
    response: (text) => {
      const codeMatch = text.match(/[A-Z]\d{4,5}/);
      const code = codeMatch ? codeMatch[0] : '';
      return code
        ? `평가코드 ${code}를 반영했습니다. ✓ 모든 필수 항목이 입력되었습니다. 포털 자동입력 JSON을 업데이트했습니다.`
        : `평가코드를 확인할 수 없었습니다. 예시: R01104 형태로 입력해 주세요.`;
    },
  },
];

// 기본 응답
function getDefaultResponse(text) {
  return `입력하신 내용을 확인했습니다.

논문 정보를 분석하려면 PDF 파일을 첨부해 주시거나, 아래 항목들을 포함하여 텍스트로 입력해 주세요:

• 논문 제목
• 학술지명
• 저자 정보
• 발행일자
• 페이지 정보

자유 형식으로 입력하셔도 자동으로 각 항목을 분류해 드립니다. 📝`;
}

export async function getMockResponse(text, file) {
  // 응답 지연 시뮬레이션
  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

  // 파일이 있으면 파일 분석 응답
  if (file) {
    return {
      reply: generateFileResponse(file.name),
      fileProcessed: { name: file.name, type: file.type },
    };
  }

  // 텍스트 패턴 매칭
  for (const { pattern, response } of TEXT_RESPONSES) {
    if (pattern.test(text)) {
      return { reply: response(text), fileProcessed: null };
    }
  }

  // 기본 응답
  return { reply: getDefaultResponse(text), fileProcessed: null };
}
