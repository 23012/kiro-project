// ── 당일 처방 데이터 ──
const todayDrugs = [
  {id:'betahistine', name:'베타히스틴', gen:'Betahistine HCl', dose:'24mg BID', days:7, atcShort:'N07CA01', atcShortName:'항현훈제', flag:'ok', ftxt:'정상'},
  {id:'metoclopramide', name:'메토클로프라미드', gen:'Metoclopramide HCl', dose:'10mg IV PRN', days:1, atcShort:'A03FA01', atcShortName:'소화기계', flag:'w', ftxt:'주의'},
  {id:'diazepam', name:'디아제팜', gen:'Diazepam', dose:'5mg IV once', days:1, atcShort:'N05BA01', atcShortName:'항불안제', flag:'w', ftxt:'주의'},
];

// ── 과거 내원 데이터 ──
const pastVisits = [
  {
    date:'2025.11.14', dateObj:new Date(2025,10,14),
    dx:'어지럼증·오심 / R42 Dizziness', dept:'응급의학과',
    drugs:[
      {id:'betahistine', name:'베타히스틴', gen:'Betahistine HCl', dose:'24mg BID', days:7, atcShort:'N07CA01', atcShortName:'항현훈제', flag:'ok', ftxt:'정상'},
      {id:'metoclopramide', name:'메토클로프라미드', gen:'Metoclopramide HCl', dose:'10mg IV PRN', days:1, atcShort:'A03FA01', atcShortName:'소화기계', flag:'w', ftxt:'주의'},
      {id:'diazepam', name:'디아제팜', gen:'Diazepam', dose:'5mg IV once', days:1, atcShort:'N05BA01', atcShortName:'항불안제', flag:'w', ftxt:'주의'},
    ]
  },
  {
    date:'2024.07.02', dateObj:new Date(2024,6,2),
    dx:'현훈 / H81.1 Benign paroxysmal vertigo', dept:'신경과',
    drugs:[
      {id:'betahistine', name:'베타히스틴', gen:'Betahistine HCl', dose:'24mg BID', days:14, atcShort:'N07CA01', atcShortName:'항현훈제', flag:'ok', ftxt:'정상'},
      {id:'cinnarizine', name:'시나리진', gen:'Cinnarizine', dose:'25mg TID', days:14, atcShort:'N07CA02', atcShortName:'항현훈제', flag:'w', ftxt:'주의'},
      {id:'ginkgo', name:'징코민', gen:'Ginkgo biloba extract', dose:'40mg TID', days:14, atcShort:'N06DX02', atcShortName:'기타신경계', flag:'ok', ftxt:'정상'},
    ]
  },
];

// ── 약물 상세 데이터 ──
const drugData = {
  betahistine:{
    verdict:'정상', vc:'#0F6E56', vbg:'#E1F5EE', vmsg:'유의한 상호작용 없음 — 어지럼증 1차 선택약',
    atcCode:'N07CA01', atcName:'항현훈제 · 히스타민 유사체', atcGroup:'N · 신경계',
    atcTags:[{t:'내이 혈류 개선',c:'#E6F1FB',tc:'#042C53'},{t:'H1 약작용/H3 길항',c:'#EAF3DE',tc:'#173404'}],
    sameClass:[{name:'시나리진', atc:'N07CA02', dose:'25mg TID', dup:false, note:'N07CA 항현훈제 — 기전 상이(CCB계 전정억제), 병용 시 진정 상가 주의'}],
    timelineDrugs:[{name:'베타히스틴', start:0, end:100, color:'#1D9E75', days:14}],
    overlapNote:'단독 처방 — 다른 항현훈제와 병용 없음 (적절)', overlapLv:null,
    dose:{cur:48, max:48, unit:'mg/일', pct:100, note:'허가 최대 용량(48mg/일). 표준 처방 범위 내'},
    ddis:[],
    poly:{items:['베타히스틴은 DDI 프로파일 낮음. 고령 또는 MAO억제제 복용 시 상호작용 주의','장기 복용(3개월+) 시 효과 재평가 권장']}
  },
  metoclopramide:{
    verdict:'주의', vc:'#854F0B', vbg:'#FAEEDA', vmsg:'디아제팜 병용 시 중추신경 억제 상가 주의',
    atcCode:'A03FA01', atcName:'위장관 운동 촉진제', atcGroup:'A · 소화기 및 대사계',
    atcTags:[{t:'D2 수용체 길항 (위장관+중추)',c:'#FAEEDA',tc:'#412402'},{t:'추체외로 부작용 주의',c:'#FCEBEB',tc:'#A32D2D'}],
    sameClass:[],
    timelineDrugs:[{name:'메토클로프라미드', start:85, end:100, color:'#EF9F27', days:1},{name:'디아제팜 (병용)', start:85, end:100, color:'#E24B4A', days:1}],
    overlapNote:'디아제팜과 동일 날 IV 투여 — 진정·호흡억제 위험 모니터링 필요', overlapLv:'w',
    dose:{cur:10, max:40, unit:'mg/일', pct:25, note:'IV 단회 10mg — 응급 투여 적정 용량. PRN 사용으로 반복 위험 낮음'},
    ddis:[{lv:'lv2', chip:'주의', with:'디아제팜 5mg IV', type:'PD', mech:'두 약 모두 중추신경 억제 효과 → 과도한 진정, 호흡억제 위험 상가. 특히 고령이 아닌 43세에서도 IV 병용 시 주의', act:'투여 후 30분간 활력징후(SpO2, RR) 모니터링. 필요 시 플루마제닐 준비'}],
    poly:{items:['메토클로프라미드의 D2 차단 → 반복 투여 시 추체외로 증상(급성 근긴장이상) 위험','베타히스틴과는 상호작용 없음 — 병용 안전','응급실 단회 투여는 적절, 퇴원 후 경구 지속 처방은 재평가 필요']}
  },
  diazepam:{
    verdict:'주의', vc:'#854F0B', vbg:'#FAEEDA', vmsg:'메토클로프라미드와 중추신경 억제 상가 주의',
    atcCode:'N05BA01', atcName:'벤조디아제핀계 항불안제', atcGroup:'N · 신경계',
    atcTags:[{t:'GABA-A 수용체 양성 조절',c:'#FAEEDA',tc:'#412402'},{t:'전정계 억제 (어지럼증 급성기)',c:'#E6F1FB',tc:'#042C53'}],
    sameClass:[],
    timelineDrugs:[{name:'디아제팜', start:85, end:100, color:'#E24B4A', days:1},{name:'메토클로프라미드 (병용)', start:85, end:100, color:'#EF9F27', days:1}],
    overlapNote:'메토클로프라미드와 동일 날 IV 투여 — 이중 CNS억제 구간', overlapLv:'w',
    dose:{cur:5, max:10, unit:'mg 단회', pct:50, note:'급성 현훈 단회 IV 5mg — 적정. 반복 투여 시 호흡억제 주의'},
    ddis:[{lv:'lv2', chip:'주의', with:'메토클로프라미드 10mg IV', type:'PD', mech:'벤조디아제핀(GABA 증강) + D2 길항제 모두 CNS 억제 작용 → 진정 상가, 호흡억제 위험', act:'병용 투여 후 SpO2 연속 모니터링. 낙상 예방 조치 시행'}],
    poly:{items:['디아제팜 단회 IV는 급성 현훈 조절에 효과적 — 지속 처방은 의존성 위험으로 비권장','알코올·다른 CNS 억제제 병용 여부 문진 필요','퇴원 후 당일 운전 금지 안내 필수']}
  },
  cinnarizine:{
    verdict:'주의', vc:'#854F0B', vbg:'#FAEEDA', vmsg:'베타히스틴 병용 — 진정 효과 상가 주의',
    atcCode:'N07CA02', atcName:'항현훈제 · 칼슘채널차단제(전정계)', atcGroup:'N · 신경계',
    atcTags:[{t:'전정계 선택적 CCB',c:'#FAEEDA',tc:'#412402'},{t:'H1 길항 (항히스타민 작용)',c:'#E6F1FB',tc:'#042C53'}],
    sameClass:[{name:'베타히스틴', atc:'N07CA01', dose:'24mg BID', dup:false, note:'N07CA 항현훈제 — 기전 상이(히스타민계 vs CCB), 병용 시 과도한 전정억제 주의'}],
    timelineDrugs:[{name:'시나리진', start:0, end:100, color:'#EF9F27', days:14},{name:'베타히스틴 (병용)', start:0, end:100, color:'#1D9E75', days:14}],
    overlapNote:'베타히스틴과 14일 전 기간 병용 — 전정계 이중 억제, 진정 위험 구간', overlapLv:'w',
    dose:{cur:75, max:75, unit:'mg/일', pct:100, note:'최대 권장 용량. 졸음·추체외로 부작용 위험 최대'},
    ddis:[{lv:'lv2', chip:'주의', with:'베타히스틴 24mg BID', type:'PD', mech:'N07CA 동일 계통 항현훈제 병용 → 전정 억제 상가. 과도한 진정·균형 불안정 위험', act:'병용 필요성 재검토. 단독 요법 전환 권고'}],
    poly:{items:['시나리진 장기 복용(3개월 이상) 시 파킨슨 유사 증상(지연성 추체외로) 보고','항히스타민 작용으로 졸음·집중력 저하 — 운전·작업 안전 주의','베타히스틴과 기전 중복 — 단독 요법 우선 권장']}
  },
  ginkgo:{
    verdict:'정상', vc:'#0F6E56', vbg:'#E1F5EE', vmsg:'유의한 DDI 없음 — 미세순환 개선 보조',
    atcCode:'N06DX02', atcName:'혈액순환 개선제 · 징코 추출물', atcGroup:'N · 신경계',
    atcTags:[{t:'혈소판 활성인자(PAF) 억제',c:'#E6F1FB',tc:'#042C53'},{t:'내이 미세순환 개선',c:'#EAF3DE',tc:'#173404'}],
    sameClass:[],
    timelineDrugs:[{name:'징코민', start:0, end:100, color:'#1D9E75', days:14}],
    overlapNote:'단독 처방 범위 — 항응고제 병용 없어 출혈 위험 낮음 (현재 방문 기준)', overlapLv:null,
    dose:{cur:120, max:240, unit:'mg/일', pct:50, note:'표준 용량(120mg/일). 효과 미흡 시 240mg까지 증량 가능'},
    ddis:[],
    poly:{items:['항응고제(와파린 등) 병용 시 출혈 위험 — 이번 방문 병용 없어 양호','수술 전 최소 2주 중단 권고 (혈소판 응집 억제)','건강기능식품과 동일 성분 중복 복용 여부 확인 권장']}
  },
};

// ── 테이블 렌더 ──
function renderTable(tbId, drugs) {
  var tb = document.getElementById(tbId);
  if (!tb) return;
  drugs.forEach(function(d) {
    var tr = document.createElement('tr');
    tr.className = 'drug-row';
    tr.id = tbId + '-' + d.id;
    var flagCls = d.flag==='d'?'fl d':d.flag==='w'?'fl w':'fl ok';
    var atcColor = d.atcShort.startsWith('N')?'#E6F1FB':d.atcShort.startsWith('A')?'#EAF3DE':'#FAEEDA';
    var atcTC = d.atcShort.startsWith('N')?'#042C53':d.atcShort.startsWith('A')?'#173404':'#412402';
    tr.innerHTML =
      '<td><span class="drug-nm">'+d.name+'</span><span class="drug-gen">'+d.gen+'</span></td>'+
      '<td style="font-size:13px">'+d.dose+'</td>'+
      '<td style="font-size:13px;color:var(--color-text-secondary)">'+d.days+'일</td>'+
      '<td><span class="atc-badge" style="background:'+atcColor+';color:'+atcTC+';border-color:'+atcTC+'40">'+d.atcShort+' · '+d.atcShortName+'</span></td>'+
      '<td><span class="'+flagCls+'">'+d.ftxt+'</span></td>';
    tr.onclick = (function(rid, nm, ds, gn, did) {
      return function() { openPopup(rid, nm, ds, gn, did); };
    })(tr.id, d.name, d.dose, d.gen, d.id);
    tb.appendChild(tr);
  });
}

// ── 초기 렌더 ──
// (당일 처방 내역 제거됨)

// ── 과거 이력 조회 ──
var historyVisible = false;

function searchHistory() {
  historyVisible = true;
  document.getElementById('historySection').style.display = 'block';
  applyFilter();
}

function applyFilter() {
  var periodVal = document.getElementById('filterPeriod').value;
  var customRange = document.getElementById('customDateRange');
  customRange.style.display = periodVal === 'custom' ? 'flex' : 'none';

  if (!historyVisible) return;

  var dept = document.getElementById('filterDept').value;
  var now = new Date(2026, 2, 20);

  var filtered = pastVisits.filter(function(v) {
    if (dept !== 'all' && v.dept !== dept) return false;
    if (periodVal === 'custom') {
      var from = new Date(document.getElementById('filterDateFrom').value);
      var to = new Date(document.getElementById('filterDateTo').value);
      if (v.dateObj < from || v.dateObj > to) return false;
    } else if (periodVal !== 'all') {
      var months = periodVal==='6m'?6:periodVal==='1y'?12:periodVal==='2y'?24:36;
      var cutoff = new Date(now);
      cutoff.setMonth(cutoff.getMonth() - months);
      if (v.dateObj < cutoff) return false;
    }
    return true;
  });

  var container = document.getElementById('historyCards');
  container.innerHTML = '';

  if (filtered.length === 0) {
    container.innerHTML = '<div style="padding:15px;font-size:15px;color:var(--color-text-secondary);background:var(--color-background-primary);border-radius:10px;border:0.5px solid var(--color-border-tertiary);text-align:center">조건에 맞는 과거 처방 이력이 없습니다</div>';
    document.getElementById('resultInfo').textContent = '0건';
    return;
  }

  document.getElementById('resultInfo').textContent = filtered.length + '건 조회되었습니다.';

  filtered.forEach(function(v, i) {
    var tbId = 'ftb' + i;
    var card = document.createElement('div');
    card.className = 'history-card';
    card.innerHTML =
      '<div class="history-header">'+
        '<span class="visit-date">'+v.date+'</span>'+
        '<span class="visit-dx">'+v.dx+'</span>'+
        '<span class="visit-dept">'+v.dept+'</span>'+
      '</div>'+
      '<table class="drug-table">'+
        '<colgroup><col style="width:30%"><col style="width:20%"><col style="width:12%"><col style="width:25%"><col style="width:13%"></colgroup>'+
        '<thead><tr><th>약품명</th><th>용량/용법</th><th>처방기간</th><th>계통</th><th>상태</th></tr></thead>'+
        '<tbody id="'+tbId+'"></tbody>'+
      '</table>';
    container.appendChild(card);
    renderTable(tbId, v.drugs);
  });
}

// ── 팝업 ──
function openPopup(rowId, name, dose, gen, id) {
  document.querySelectorAll('.drug-row').forEach(function(r){ r.classList.remove('sel'); });
  var row = document.getElementById(rowId);
  if (row) row.classList.add('sel');
  var d = drugData[id];
  if (!d) return;

  var vi = d.verdict==='금기'?'✕':d.verdict==='주의'?'!':'✓';
  var tagHtml = d.atcTags.map(function(t){ return '<span class="atc-tag" style="background:'+t.c+';color:'+t.tc+';border-color:'+t.tc+'40">'+t.t+'</span>'; }).join('');

  var scHtml = d.sameClass && d.sameClass.length
    ? d.sameClass.map(function(s){
        return '<div class="sc-row '+(s.dup?'dup':'')+'">'+
          '<div style="display:flex;align-items:center;gap:7px">'+
            '<div class="sc-dot" style="background:'+(s.dup?'#E24B4A':'#1D9E75')+'"></div>'+
            '<span class="sc-nm">'+s.name+'</span>'+
            '<span class="sc-atc">'+s.atc+'</span>'+
            '<span class="sc-atc">'+s.dose+'</span>'+
            '<span class="sc-badge '+(s.dup?'dup':'ok')+'">'+(s.dup?'중복처방':'병용 중')+'</span>'+
          '</div>'+
          '<div class="sc-note">'+s.note+'</div>'+
        '</div>';
      }).join('')
    : '<div class="empty-sc">동일 계통 중복 처방 없음</div>';

  var tlHtml = d.timelineDrugs.map(function(t){
    var w = t.end - t.start;
    var txtColor = t.color==='#EF9F27'?'#412402':'#fff';
    return '<div class="tl-row">'+
      '<div class="tl-lbl">'+(t.name.length>6?t.name.slice(0,6)+'..':t.name)+'</div>'+
      '<div class="tl-bg"><div class="tl-fill" style="left:'+t.start+'%;width:'+w+'%;background:'+t.color+'">'+
        '<span class="tl-txt" style="color:'+txtColor+'">'+(w>=15?t.days+'일':'')+'</span>'+
      '</div></div>'+
      '<div class="tl-day">'+t.days+'일</div>'+
    '</div>';
  }).join('');

  var olBg = d.overlapLv==='d'?'#FCEBEB':d.overlapLv==='w'?'#FAEEDA':'var(--color-background-secondary)';
  var olBd = d.overlapLv==='d'?'#F09595':d.overlapLv==='w'?'#FAC775':'var(--color-border-tertiary)';
  var olTc = d.overlapLv==='d'?'#501313':d.overlapLv==='w'?'#412402':'var(--color-text-secondary)';
  var dColor = d.dose.pct>=100?'#E24B4A':d.dose.pct>=75?'#EF9F27':'#1D9E75';

  var ddiHtml = d.ddis.length
    ? d.ddis.map(function(x){
        return '<div class="ddi-card '+x.lv+'">'+
          '<div class="ddi-top"><span class="lv-chip">'+x.chip+'</span><span class="ddi-with">'+x.with+'</span><span class="ddi-type">'+x.type+'</span></div>'+
          '<div class="ddi-mech">'+x.mech+'</div>'+
          '<div class="ddi-act">'+x.act+'</div>'+
        '</div>';
      }).join('')
    : '<div style="font-size:14px;color:var(--color-text-secondary);padding:4px 0">현재 처방 내 유의한 상호작용 없음</div>';

  var polyHtml = '<div class="poly-box">'+d.poly.items.map(function(item){
    return '<div class="poly-item"><div class="poly-dot"></div><span>'+item+'</span></div>';
  }).join('')+'</div>';

  document.getElementById('pop').innerHTML =
    '<div class="ph">'+
      '<div><div class="ph-drug">'+name+' · '+dose+'</div><div class="ph-sub">'+gen+' · '+d.atcCode+'</div></div>'+
      '<div class="ph-x" onclick="closeP()">✕</div>'+
    '</div>'+
    '<div class="verdict" style="background:'+d.vbg+'">'+
      '<div class="vi" style="background:'+d.vc+'">'+vi+'</div>'+
      '<div><div class="vt" style="color:'+d.vc+'">'+d.verdict+'</div><div class="vs">'+d.vmsg+'</div></div>'+
    '</div>'+
    '<div class="pb">'+
      '<div class="sec">'+
        '<div class="sec-hd"><div class="sec-ic" style="background:#E6F1FB"></div><span class="sec-lb">계통 분류</span></div>'+
        '<div class="atc-box"><div class="atc-code">'+d.atcCode+' · '+d.atcName+'</div><div class="atc-eng">'+d.atcGroup+'</div><div class="atc-tags">'+tagHtml+'</div></div>'+
        '<div class="sc-label">이 처방 내 동일 계통 약물</div>'+scHtml+
      '</div>'+
      '<div class="sec">'+
        '<div class="sec-hd"><div class="sec-ic" style="background:#E1F5EE"></div><span class="sec-lb">기간 · 병용 현황</span></div>'+
        '<div class="tl-axis"><div class="tl-tick">처방 시작</div><div class="tl-tick"></div><div class="tl-tick">종료</div></div>'+
        tlHtml+
        '<div class="ol-note" style="background:'+olBg+';border:0.5px solid '+olBd+';color:'+olTc+'">'+d.overlapNote+'</div>'+
      '</div>'+
      '<div class="sec">'+
        '<div class="sec-hd"><div class="sec-ic" style="background:#FAEEDA"></div><span class="sec-lb">용량 분석</span></div>'+
        '<div class="dose-block"><div class="dose-nm">'+name+'</div><div class="dose-bg"><div class="dose-fill" style="width:'+d.dose.pct+'%;background:'+dColor+'"></div></div><div class="dose-val">'+d.dose.cur+' / '+d.dose.max+' '+d.dose.unit+'</div></div>'+
        '<div class="dose-note-box">'+d.dose.note+'</div>'+
      '</div>'+
      '<div class="sec">'+
        '<div class="sec-hd"><div class="sec-ic" style="background:#FCEBEB"></div><span class="sec-lb">약물 상호작용</span></div>'+
        ddiHtml+
      '</div>'+
      '<div class="sec">'+
        '<div class="sec-hd"><div class="sec-ic" style="background:#F1EFE8"></div><span class="sec-lb">다제약물 주의사항</span></div>'+
        polyHtml+
      '</div>'+
    '</div>'+
    '<div class="pf">'+
      '<div class="pf-note">처방의: 김찬웅 (응급의학과) · 2026.03.20</div>'+
      '<button class="pf-btn">처방 검토 메모</button>'+
    '</div>';

  document.getElementById('ov').classList.add('show');
}

function closeP() {
  document.getElementById('ov').classList.remove('show');
  document.querySelectorAll('.drug-row').forEach(function(r){ r.classList.remove('sel'); });
}

document.getElementById('ov').addEventListener('click', function(e) {
  if (e.target === e.currentTarget) closeP();
});
