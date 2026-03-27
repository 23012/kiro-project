document.getElementById('fillBtn').addEventListener('click', async () => {
  const status = document.getElementById('status');
  const jsonInput = document.getElementById('jsonInput').value.trim();

  if (!jsonInput) {
    status.textContent = 'JSON 데이터를 입력해주세요.';
    status.className = 'status error';
    return;
  }

  let data;
  try {
    data = JSON.parse(jsonInput);
  } catch (e) {
    status.textContent = 'JSON 형식이 올바르지 않습니다.';
    status.className = 'status error';
    return;
  }

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // content script를 통해 페이지에 스크립트 주입
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: injectFillScript,
      args: [data],
      world: 'MAIN',  // 페이지의 메인 월드에서 실행 (Angular 접근 가능)
    });

    status.textContent = '입력 완료! 포털에서 값을 확인하세요.';
    status.className = 'status success';
  } catch (e) {
    console.error(e);
    status.textContent = '오류: ' + e.message;
    status.className = 'status error';
  }
});

// 페이지의 MAIN world에서 실행되는 함수
function injectFillScript(data) {
  const fieldMap = {
    gubun1:       'data.row.gubun1',
    gubun2:       'data.row.gubun2',
    intrCd:       'data.row.intrCd',
    str2:         'data.row.str2',
    str3:         'data.row.str3',
    coopDiv:      'data.row.coopDiv',
    totalCoopCnt: 'data.row.totalCoopCnt',
    roleCd:       'data.row.roleCd',
    totalWriter:  'data.row.totalWriter',
    str7:         'data.row.str7',
    frscCnt:      'data.row.frscCnt',
    str1:         'data.row.str1',
    str5:         'data.row.str5',
    str8:         'data.row.str8',
    str9:         'data.row.str9',
    str4:         'data.row.str4',
    str10:        'data.row.str10',
    dt1:          'data.row.dt1',
    deptGb:       'data.row.deptGb',
    sciCd:        'data.row.sciCd',
    issnNo:       'data.row.issnNo',
    projectFg:    'data.row.projectFg',
    securityFg:   'data.row.securityFg',
    remk:         'data.row.remk',
  };

  let filled = 0;

  for (const [key, ngModel] of Object.entries(fieldMap)) {
    const value = data[key];
    if (value === undefined || value === null || value === '') continue;

    const el = document.querySelector('[ng-model="' + ngModel + '"]');
    if (!el) {
      console.warn('[CAU] 필드 못 찾음:', ngModel);
      continue;
    }

    try {
      // disabled 해제
      el.disabled = false;
      el.removeAttribute('disabled');

      // AngularJS scope에 값 설정
      const scope = angular.element(el).scope();
      const parts = ngModel.split('.');
      let obj = scope;
      for (let i = 0; i < parts.length - 1; i++) {
        if (!obj[parts[i]]) obj[parts[i]] = {};
        obj = obj[parts[i]];
      }

      scope.$apply(function() {
        obj[parts[parts.length - 1]] = value;
      });

      // radio 버튼 처리
      if (el.type === 'radio') {
        const radio = document.querySelector(
          'input[ng-model="' + ngModel + '"][value="' + value + '"]'
        );
        if (radio) {
          radio.disabled = false;
          radio.checked = true;
          const radioScope = angular.element(radio).scope();
          radioScope.$apply(function() {
            const rParts = ngModel.split('.');
            let rObj = radioScope;
            for (let i = 0; i < rParts.length - 1; i++) rObj = rObj[rParts[i]];
            rObj[rParts[rParts.length - 1]] = value;
          });
        }
      }

      filled++;
      console.log('[CAU] ✓', ngModel, '=', value);
    } catch (e) {
      console.error('[CAU] ✗', ngModel, e.message);
    }
  }

  console.log('[CAU 업적 자동입력] 완료:', filled + '개 필드 입력');
  alert('자동 입력 완료! ' + filled + '개 필드가 입력되었습니다.');
}
