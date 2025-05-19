document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('pointForm');
  const messageElement = document.getElementById('message');
  const phoneInput = document.getElementById('phone');
  
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
  
  // Format phone number as user types
  if (phoneInput) {
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
  }

  // Form submission handler
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const userid = document.getElementById('userid').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const agree = document.getElementById('agree').checked ? '네. 동의합니다' : '';
      
      // Validate required fields
      if (!name || !userid || !phone || !agree) {
        alert('모든 항목을 입력하고 동의해주세요.');
        return;
      }
      
      // Validate phone number format
      const phonePattern = /^01[0-9]-[0-9]{3,4}-[0-9]{4}$/;
      if (!phonePattern.test(phone)) {
        alert('핸드폰 번호를 올바른 형식으로 입력해주세요.');
        return;
      }
      
      // Show loading message
      messageElement.textContent = '제출 중입니다...';
      messageElement.style.display = 'block';
      
      try {
        // Get form data
        const formData = new FormData(form);
        
        // Submit the form
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData,
          mode: 'no-cors' // This is needed for cross-origin requests
        });
        
        // Show success message
        messageElement.textContent = '신청이 완료되었습니다!';
        messageElement.style.color = '#3a7bfd';
        
        // Reset form
        form.reset();
        
        // Hide message after 3 seconds
        setTimeout(() => {
          messageElement.style.display = 'none';
        }, 3000);
        
        // 폭죽 파티클 추가 효과
        for (let i = 0; i < 30; i++) {
          const particle = new Particle();
          particle.x = Math.random() * canvas.width;
          particle.y = canvas.height;
          particle.speedY = -Math.random() * 10 - 5; // 위로 발사
          particles.push(particle);
        }
      } catch (error) {
        console.error('Error submitting form:', error);
        messageElement.textContent = '오류가 발생했습니다. 다시 시도해주세요.';
        messageElement.style.color = '#ff3b30';
      }
    });
  }
}); 