document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('event-form');
  const messageElement = document.getElementById('message');
  const phoneInput = document.getElementById('phone');
  const useridInput = document.getElementById('userid');
  
  // ===== 폭죽 파티클 애니메이션 설정 =====
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  
  // 캔버스 크기 설정
  function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  
  setCanvasSize();
  window.addEventListener('resize', setCanvasSize);
  
  // 파티클 클래스 정의
  class Particle {
    constructor() {
      this.reset();
    }
    
    reset() {
      // 시작 위치 (상단에서 랜덤한 위치)
      this.x = Math.random() * canvas.width;
      this.y = -20;
      
      // 크기
      this.size = Math.random() * 12 + 5;
      
      // 속도
      this.speedY = Math.random() * 2 + 1;
      this.speedX = Math.random() * 2 - 1;
      
      // 색상 (밝고 다양한 색상)
      const colors = ['#3a7bfd', '#9D6CED', '#FF9F43', '#FF6B6B', '#1DD1A1', '#54a0ff'];
      this.color = colors[Math.floor(Math.random() * colors.length)];
      
      // 모양
      const shapes = ['circle', 'triangle', 'square', 'star'];
      this.shape = shapes[Math.floor(Math.random() * shapes.length)];
      
      // 회전
      this.rotation = 0;
      this.rotationSpeed = Math.random() * 0.1 - 0.05;
      
      // 투명도
      this.alpha = 1;
      
      // 페이드 아웃 속도
      this.fadeSpeed = 0.01;
    }
    
    update() {
      // 위치 업데이트
      this.y += this.speedY;
      this.x += this.speedX;
      
      // 회전
      this.rotation += this.rotationSpeed;
      
      // 하단에 닿으면 리셋
      if (this.y > canvas.height) {
        this.reset();
      }
      
      // 일정 높이 이하로 내려오면 서서히 투명해짐
      if (this.y > canvas.height * 0.7) {
        this.alpha -= this.fadeSpeed;
        if (this.alpha < 0) this.alpha = 0;
      }
    }
    
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rotation);
      
      ctx.fillStyle = this.color;
      ctx.beginPath();
      
      switch(this.shape) {
        case 'circle':
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
          break;
        case 'square':
          ctx.rect(-this.size / 2, -this.size / 2, this.size, this.size);
          break;
        case 'triangle':
          ctx.moveTo(0, -this.size / 2);
          ctx.lineTo(this.size / 2, this.size / 2);
          ctx.lineTo(-this.size / 2, this.size / 2);
          break;
        case 'star':
          for (let i = 0; i < 5; i++) {
            ctx.lineTo(
              Math.cos((i * 2 * Math.PI / 5) - Math.PI / 2) * this.size / 2,
              Math.sin((i * 2 * Math.PI / 5) - Math.PI / 2) * this.size / 2
            );
            ctx.lineTo(
              Math.cos(((i + 0.5) * 2 * Math.PI / 5) - Math.PI / 2) * this.size / 4,
              Math.sin(((i + 0.5) * 2 * Math.PI / 5) - Math.PI / 2) * this.size / 4
            );
          }
          break;
      }
      
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }
  
  // 파티클 생성
  const particles = [];
  const particleCount = 30;
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
    // 초기 위치를 랜덤하게 분포
    particles[i].y = Math.random() * canvas.height;
  }
  
  // 애니메이션 루프
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
  
  // ===== 폼 유효성 검사 및 제출 =====
  // 폼 초기화 함수
  function resetForm() {
    form.reset();
    messageElement.textContent = "";
  }

  // Google Sheet에 직접 데이터 전송 (no-cors 사용)
  async function submitToGoogleSheet(data) {
    try {
      // Google 스프레드시트와 연동할 Google Apps Script URL - 반드시 최신 URL로 업데이트하세요
      // 새롭게 배포할 때마다 URL이 변경됩니다
      const scriptURL = 'https://script.google.com/macros/s/AKfycbyMrfPxPLSxzXBgSRnDDW12BsWvXuLlrJ5GsaZDwAXxdJ7Fh25WO_-_IYXZ3c91O0GI/exec';
      
      // 데이터 직렬화
      const queryString = new URLSearchParams();
      Object.keys(data).forEach(key => {
        queryString.append(key, data[key]);
      });
      
      // 디버깅용 콘솔 로그
      console.log('데이터 전송 시도:', data);
      
      // 첫 번째 방법: no-cors 모드로 GET 요청 보내기
      const fetchPromise = fetch(`${scriptURL}?${queryString.toString()}`, {
        method: 'GET',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });
      
      await fetchPromise;
      console.log('데이터 전송 완료');
      
      // no-cors 모드에서는 응답을 읽을 수 없으므로 성공으로 간주
      return true;
    } catch (error) {
      console.error('데이터 전송 오류:', error);
      return false;
    }
  }

  // 폼 제출 직후 이미지 미리 로드 (CORS 캐시)
  function pingScriptUrl(data) {
    const img = new Image();
    const scriptURL = 'https://script.google.com/macros/s/AKfycbyMrfPxPLSxzXBgSRnDDW12BsWvXuLlrJ5GsaZDwAXxdJ7Fh25WO_-_IYXZ3c91O0GI/exec';
    const queryString = new URLSearchParams();
    
    Object.keys(data).forEach(key => {
      queryString.append(key, data[key]);
    });
    
    img.src = `${scriptURL}?${queryString.toString()}`;
    console.log('이미지 방식으로 데이터 전송:', img.src);
  }

  // Format phone number as user types
  phoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length > 11) value = value.substring(0, 11); // Limit to 11 digits
    
    // Format with hyphens
    if (value.length > 7) {
      value = value.substring(0, 3) + '-' + value.substring(3, 7) + '-' + value.substring(7);
    } else if (value.length > 3) {
      value = value.substring(0, 3) + '-' + value.substring(3);
    }
    
    e.target.value = value;
  });

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = phoneInput.value.trim();
    const userid = useridInput.value.trim();
    const agree = document.getElementById('agree').checked;

    // Validate phone number format
    const phonePattern = /^[0-9]{3}-[0-9]{4}-[0-9]{4}$/;
    if (!phonePattern.test(phone)) {
      alert('핸드폰 번호를 010-0000-0000 형식으로 입력해주세요.');
      phoneInput.focus();
      return;
    }

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userid)) {
      alert('슈퍼로이어 아이디는 이메일 형식으로 입력해주세요.');
      useridInput.focus();
      return;
    }

    if (!name || !phone || !userid || !agree) {
      alert('모든 항목을 입력하고 동의해주세요.');
      return;
    }

    // 폭죽 파티클 추가 효과
    for (let i = 0; i < 30; i++) {
      const particle = new Particle();
      particle.x = Math.random() * canvas.width;
      particle.y = canvas.height;
      particle.speedY = -Math.random() * 10 - 5; // 위로 발사
      particles.push(particle);
    }

    // 로딩 메시지 표시
    messageElement.textContent = "제출 중입니다...";
    
    // Google Sheet에 데이터 전송
    const formData = {
      name: name,
      userid: userid,
      phone: phone,
      agree: agree ? "동의함" : "",
      timestamp: new Date().toISOString()
    };

    try {
      // 두 가지 방식으로 데이터 전송 시도
      await submitToGoogleSheet(formData);
      pingScriptUrl(formData); // 이미지 방식으로도 전송
      
      // 성공 메시지 표시
      messageElement.textContent = "변호사님, 포인트 신청이 완료되었습니다. 감사합니다!";
      
      // 폼 초기화
      form.reset();
      
      // 3초 후 메시지 숨기기
      setTimeout(() => {
        messageElement.textContent = "";
      }, 3000);
    } catch (error) {
      console.error('제출 오류:', error);
      messageElement.textContent = "제출 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    }
    
    // 스크롤 메시지 위치로 이동
    messageElement.scrollIntoView({ behavior: 'smooth' });
  });
}); 