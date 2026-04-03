const patientInfo = {
  no: 1,
  bed: "C2",
  triage: 2,
  pid: "00000000",
  name: "김원태",
  age: 43,
  sex: "M",
  chief: "dizziness",
  diagnosis: "Dizziness",
  dept: "EM",
  visitDate: "2026.03.20 23:40",
  onsetDate: "2026.03.20 23:00",
  decisionDate: "2026.03.21 00:40",
  dischargeDate: "2026.03.21 00:45",
  doctor: "김찬웅",
  doctorTime: "2026.03.20 23:50",
  transport: "기타 자동차",
  visitReason: "질병",
  dispType: "귀가",
  dispDetail: "증상이 호전되어 귀가",
  symptomCode: "C0012833",
  allergy: null
};

// 어지러움(dizziness) 관련 처방 약물 — 실제 응급실 어지러움 처방 패턴
const patientRows = [
  {"id":"betahistine","name":"베타히스틴","gen":"Betahistine mesilate","dose":"12mg TID","date":"2026.03.20","days":14,"atcCode":"N07CA01","atcGroup":"N · 신경계","flag":null},
  {"id":"dimenhydrinate","name":"디멘히드리네이트","gen":"Dimenhydrinate","dose":"50mg TID","date":"2026.03.20","days":7,"atcCode":"R06AA02","atcGroup":"R · 호흡기계","flag":"w","ftxt":"주의"},
  {"id":"metoclopramide","name":"메토클로프라미드","gen":"Metoclopramide HCl","dose":"10mg PRN","date":"2026.03.20","days":3,"atcCode":"A03FA01","atcGroup":"A · 소화기계","flag":null},
];
