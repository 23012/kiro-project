export const MOCK_PREVIEW_DATA = [
  { date: '2026.03.05', name: '아모프렐정 1.67/16.67/4.17mg', ingredient: 'amlodipine 복합제(3성분)', dose: '1정', freq: '1회', days: '60일' },
  { date: '2026.03.05', name: '시그마트정 5mg', ingredient: 'nicorandil', dose: '1정', freq: '1회', days: '60일' },
  { date: '2026.03.05', name: '플라빅스정 75mg', ingredient: 'clopidogrel bisulfate', dose: '1정', freq: '1회', days: '60일' },
  { date: '2026.03.05', name: '토바스틴정 10.85mg', ingredient: 'atorvastatin calcium', dose: '1정', freq: '1회', days: '60일' },
  { date: '2026.01.16', name: '뮤코팩트정 30mg', ingredient: 'ambroxol hydrochloride', dose: '1정', freq: '3회', days: '7일' },
  { date: '2026.01.16', name: '아벨록스정 400mg', ingredient: 'moxifloxacin hydrochloride', dose: '1정', freq: '1회', days: '7일' },
  { date: '2026.01.03', name: '코스카정 25mg', ingredient: 'losartan potassium', dose: '1정', freq: '1회', days: '60일' },
  { date: '2026.01.03', name: '명문암로디핀정 5mg', ingredient: 'amlodipine besylate', dose: '1정', freq: '1회', days: '60일' },
  { date: '2026.01.03', name: '레보틸정 5mg', ingredient: 'levocetirizine dihydrochloride', dose: '1정', freq: '1회', days: '60일' },
  { date: '2026.01.03', name: '플라빅스정 75mg', ingredient: 'clopidogrel bisulfate', dose: '1정', freq: '1회', days: '60일' },
];

const MOCK_DRUG_CHANGE_REPORT = {
  currentDateRange: '2026.03.05 ~ 만료일 2026.05.04',
  current: [
    {
      name: '아모프렐정',
      ingredient: 'amlodipine 1.67 + losartan 16.67 + chlorthalidone 4.17mg',
      category: 'CCB+ARB+이뇨제',
      categoryColor: '#e8f5e9',
      categoryTextColor: '#2e7d32',
      dosage: '1일 1정',
      remainingDays: 28,
      remainingPercent: 47,
      remainingColor: '#4caf50',
      remainingUntil: '05.04',
    },
    {
      name: '시그마트정 5mg',
      ingredient: 'nicorandil',
      category: '협심증치료제',
      categoryColor: '#fce4ec',
      categoryTextColor: '#c62828',
      dosage: '1일 1정',
      remainingDays: 28,
      remainingPercent: 47,
      remainingColor: '#4caf50',
      remainingUntil: '05.04',
    },
    {
      name: '플라빅스정 75mg',
      ingredient: 'clopidogrel bisulfate',
      category: '항혈소판제',
      categoryColor: '#fff3e0',
      categoryTextColor: '#e65100',
      dosage: '1일 1정',
      remainingDays: 28,
      remainingPercent: 47,
      remainingColor: '#4caf50',
      remainingUntil: '05.04',
    },
    {
      name: '토바스틴정 10.85mg',
      ingredient: 'atorvastatin calcium',
      category: '지질강하제 (스타틴)',
      categoryColor: '#e3f2fd',
      categoryTextColor: '#1565c0',
      dosage: '1일 1정',
      remainingDays: 28,
      remainingPercent: 47,
      remainingColor: '#4caf50',
      remainingUntil: '05.04',
    },
  ],
  newDrugsDate: '2026.03.05 기준',
  newDrugs: [
    {
      name: '아모프렐정',
      description: 'amlodipine + losartan + chlorthalidone · 3성분 복합제',
      reason: '기존 단독제 2종 통합 처방',
      statusLabel: '복합제 신규',
      date: '2026.03.05',
    },
    {
      name: 'chlorthalidone 4.17mg',
      description: '클로르탈리돈 (thiazide계 이뇨제) · 아모프렐정 내 포함',
      reason: '신규 성분',
      statusLabel: '성분 신규',
      date: '2026.03.05',
    },
  ],
  stoppedDate: '2026.03.04',
  stopped: [
    {
      name: '코스카정',
      description: 'losartan potassium · ARB 항고혈압제',
      detail: '25mg 단독 → 아모프렐정 내 16.67mg',
      statusLabel: '전환',
      statusType: 'switch',
      date: '2026.03.05',
    },
    {
      name: '명문암로디핀정',
      description: 'amlodipine besylate · CCB 항고혈압제',
      detail: '5mg 단독 → 아모프렐정 내 1.67mg',
      statusLabel: '전환',
      statusType: 'switch',
      date: '2026.03.05',
    },
    {
      name: '레보틸정',
      description: 'levocetirizine dihydrochloride · 항히스타민제',
      detail: '5mg · 재처방 없이 완전 중단',
      statusLabel: '완전 중단',
      statusType: 'fullStop',
      date: '-2026.03.04',
    },
  ],
  changedDateRange: '2026.01.03 → 2026.03.05',
  changed: [
    {
      name: 'amlodipine (암로디핀)',
      description: 'CCB 항고혈압제 · 명문암로디핀정 → 아모프렐 복합제',
      detail: '5mg 단독 → 아모프렐정 내 1.67mg',
      statusLabel: '용량 변경',
      date: '2026.03.05',
    },
    {
      name: 'losartan (로사르탄)',
      description: 'ARB 항고혈압제 · 코스카정 → 아모프렐 복합제',
      detail: '25mg 단독 → 아모프렐정 내 16.67mg',
      statusLabel: '용량 변경',
      date: '2026.03.05',
    },
  ],
};

// mock 응답 — 항상 처방 변경 리포트 반환
export async function getMockDrugResponse(text, file) {
  // 1.5 ~ 2.5초 랜덤 딜레이로 "고민하는 느낌" 연출
  const delay = 1500 + Math.random() * 1000;
  await new Promise((r) => setTimeout(r, delay));

  return {
    reply: '환자의 최근 처방 변경 내역을 분석했습니다.',
    drugChangeReport: MOCK_DRUG_CHANGE_REPORT,
  };
}
