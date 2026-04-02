const patientData = {
  "betahistine": {
    "verdict":"정상","vc":"#0F6E56","vbg":"#E1F5EE","vmsg":"어지러움 1차 치료제 — 현 처방 적절",
    "atcCode":"N07CA01","atcName":"항현훈제 · 히스타민 유사체","atcGroup":"N · 신경계",
    "atcTags":[{"t":"내이 미세순환 개선","c":"#E6F1FB","tc":"#042C53"},{"t":"전정기능 보상 촉진","c":"#EAF3DE","tc":"#173404"}],
    "timelineDrugs":[
      {"name":"베타히스틴","start":92,"end":100,"color":"#378ADD","days":14}
    ],
    "overlapNote":"단독 처방 — 병용 약물 간 유의한 중복 없음",
    "overlapLv":null,
    "dose":{"cur":36,"max":48,"unit":"mg/일","pct":75,"note":"표준 용량 범위. 증상 지속 시 48mg/일까지 증량 가능"},
    "ddis":[],
    "poly":{"title":"다제약물 참고 (현재 3종 처방)","items":["3종 단기 처방으로 다제약물 위험 낮음","베타히스틴은 DDI 위험이 매우 낮은 약물","위장관 불편 시 식후 복용 권고"]}
  },
  "dimenhydrinate": {
    "verdict":"주의","vc":"#854F0B","vbg":"#FAEEDA","vmsg":"졸음·진정 작용 — 운전·기계 조작 주의 안내 필요",
    "atcCode":"R06AA02","atcName":"항히스타민제 · 1세대","atcGroup":"R · 호흡기계",
    "atcTags":[{"t":"H1 수용체 차단","c":"#FAEEDA","tc":"#412402"},{"t":"항콜린 작용 (진정)","c":"#FCEBEB","tc":"#A32D2D"}],
    "timelineDrugs":[
      {"name":"디멘히드리네이트","start":95,"end":100,"color":"#EF9F27","days":7},
      {"name":"메토클로프라미드 (병용)","start":97,"end":100,"color":"#378ADD","days":3}
    ],
    "overlapNote":"메토클로프라미드와 단기 병용 중 — 진정 작용 상가 가능성 낮으나 모니터링",
    "overlapLv":"w",
    "dose":{"cur":150,"max":300,"unit":"mg/일","pct":50,"note":"표준 용량. 7일 이내 단기 사용 권장"},
    "ddis":[
      {"lv":"lv2","chip":"주의","with":"메토클로프라미드 10mg","type":"PD","mech":"디멘히드리네이트의 항콜린 작용이 메토클로프라미드의 위장관 운동 촉진 효과를 일부 상쇄할 수 있음","act":"동시 투여보다 시간 간격 두고 투여 권고. 오심 조절 우선 시 메토클로프라미드 선투여"}
    ],
    "poly":{"title":"다제약물 참고 (현재 3종 처방)","items":["1세대 항히스타민제: 졸음 유발 — 귀가 시 운전 금지 안내 필수","7일 초과 사용 시 내성 발생 가능 — 단기 사용 후 재평가","구갈·변비 등 항콜린 부작용 모니터링"]}
  },
  "metoclopramide": {
    "verdict":"정상","vc":"#0F6E56","vbg":"#E1F5EE","vmsg":"오심·구토 대증 치료 — 단기 사용 적절",
    "atcCode":"A03FA01","atcName":"위장관 운동 촉진제 · D2 차단","atcGroup":"A · 소화기계",
    "atcTags":[{"t":"도파민 D2 수용체 차단","c":"#E6F1FB","tc":"#042C53"},{"t":"CTZ 구토 억제","c":"#EAF3DE","tc":"#173404"}],
    "timelineDrugs":[
      {"name":"메토클로프라미드","start":97,"end":100,"color":"#1D9E75","days":3},
      {"name":"디멘히드리네이트 (병용)","start":95,"end":100,"color":"#EF9F27","days":7}
    ],
    "overlapNote":"디멘히드리네이트와 단기 병용 — 3일 PRN 처방으로 위험 낮음",
    "overlapLv":null,
    "dose":{"cur":10,"max":30,"unit":"mg/일","pct":33,"note":"PRN 처방. 1일 최대 30mg (10mg × 3회). 5일 초과 사용 지양"},
    "ddis":[
      {"lv":"lv2","chip":"주의","with":"디멘히드리네이트 50mg","type":"PD","mech":"항콜린 작용(디멘히드리네이트)이 위장관 운동 촉진 효과를 일부 감소시킬 수 있음","act":"증상 기반 PRN 사용으로 임상적 영향 경미. 오심 심할 때 우선 투여"}
    ],
    "poly":{"title":"다제약물 참고 (현재 3종 처방)","items":["메토클로프라미드 장기 사용 시 추체외로 증상(EPS) 위험 — 현재 3일 PRN으로 안전","43세 성인에서 단기 사용 시 부작용 위험 매우 낮음","반복 어지러움 시 중추성 원인 감별 위해 신경과 협진 고려"]}
  }
};
