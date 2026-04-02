// 과거 동일 증상(dizziness) 처방 이력 — 이 환자의 이전 어지러움 내원 기록만 매칭
const pastHistory = [
  {
    visitDate: "2025.08.14",
    dept: "EM",
    doctor: "박성민",
    diagnosis: "Benign paroxysmal positional vertigo (BPPV)",
    diagCode: "H81.1",
    symptom: "dizziness, nausea",
    drugs: [
      {name:"베타히스틴",dose:"12mg TID",days:14,note:"동일 약물 재처방"},
      {name:"디멘히드리네이트",dose:"50mg BID",days:5,note:"이전 용법 BID → 현재 TID 증량"}
    ],
    outcome: "귀가 (증상 호전)"
  },
  {
    visitDate: "2024.11.02",
    dept: "신경과",
    doctor: "이정훈",
    diagnosis: "Vestibular neuritis",
    diagCode: "H81.2",
    symptom: "severe vertigo, vomiting",
    drugs: [
      {name:"메틸프레드니솔론",dose:"48mg QD",days:7,note:"스테로이드 단기 요법"},
      {name:"베타히스틴",dose:"24mg BID",days:21,note:"고용량 장기 처방"},
      {name:"온단세트론",dose:"4mg PRN",days:3,note:"구토 조절"}
    ],
    outcome: "귀가 (7일 후 외래 f/u)"
  }
];
