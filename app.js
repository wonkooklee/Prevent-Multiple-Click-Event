/***********************************************************
Get_Image_Background v 1.1.0
Made by Wonkook Lee (oneook)
© All Rights Reserved
************************************************************/



const UIController = (function() {
  // PRIVATE FIELDS

  // 백그라운드 이벤트 함수
  const backgroundStyling = function(event) {
    if (!event.target.classList.contains('btn__layout')) return;
    event.target.classList.toggle('selected');
    document.querySelector('.overlay').classList.toggle(event.target.dataset.type);
  }

  // 스타일 효과 이벤트 리스너
  document.querySelector('.style').addEventListener('click', backgroundStyling);

  // 외부 이미지 GET 버튼 UI 복귀
  const resetBtn = function(target) {
    target.removeAttribute('disabled');
    target.classList.add('hover');
    target.classList.remove('invalid');
    target.textContent = target.dataset.type === 'randomUrl' ? '랜덤 배경 이미지' : '클립보드 주소 붙여넣기';
  };

  // 외부 이미지 GET 버튼 에러 송출 UI
  const errorBtn = function(target) {
    target.classList.remove('hover');
    target.classList.add('invalid');
    target.textContent = '유효하지 않은 주소입니다';
  }

  // 유효성 검사 1 (문자열 검사)
  const validTxt = function(target) {
    const regex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
    navigator.clipboard.readText()
    .then((text) => {
      // let url = (!text.match(regex)) ? false : text;
      if (text.match(regex)) {
        getImage(text, target);
      } else {
        errorBtn(target);
        setTimeout(() => {
          resetBtn(target);
        }, 1000);
      }
    })
  }

  // 유효성 검사 2 (컨텐츠 타입 검사)

  const validType = function(source) {
    const contentType = source?.headers?.get('Content-Type');
    return contentType.includes('image') ? true : false;
  }

  
  document.querySelector('.request').addEventListener('click', function(e) {
    // 이벤트 위임을 위한 Guard Clause
    if (!e.target.classList.contains('btn__layout')) return;

    // 만약 클립보드 URL이라면 유효성 검사 / 랜덤 버튼이라면 즉시 getImage 호출
    if (e.target.dataset.type === 'userUrl') {
      validTxt(e.target);
    } else if (e.target.dataset.type === 'randomUrl') {
      getImage(`https://source.unsplash.com/1600x900/?abstract`, e.target);
    }
  });



  // 이미지 요청하기
  const getImage = function(url, target) {
    target.setAttribute('disabled', true);
    target.classList.remove('hover');
    target.textContent = '이미지 가져오는 중...'
    
    // HTTP 요청
    fetch(url)
    .then((response) => {
      if(!validType(response)) {
        return;
      }
      return response;
    })
    .then((response) => {
      document.body.style.backgroundImage = `url(${response.url})`;
      return response;
    })
    .then(() => {
      setTimeout(() => {
        resetBtn(target);
      }, 600);
    })
    .catch(() => {
      target.removeAttribute('disabled');
      errorBtn(target);
      setTimeout(() => {
        resetBtn(target);
      }, 1000);
    })
  };

  return {
    
    // PUBLIC FIELDS
    init() {
      document.querySelectorAll('.btn__layout').forEach(e => e.classList.remove('selected'));
      document.body.style.backgroundColor = '#000000';
    }

  }
})();

UIController.init();

const msg = "%cWonkook Lee ⓒ oneook";
const css = "font-size: 2em; color: #FEDC45; background-color: #000;font-family: 'Noto Sans KR';";
console.log(msg, css);
