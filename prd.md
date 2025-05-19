<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <title>SuperLawyer – 법률가를 위한 AI</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background: linear-gradient(to bottom right, #359EFF, #9D6CED);
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }

    .container {
      background-color: #ffffff;
      padding: 30px 25px;
      border-radius: 12px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.15);
      width: 100%;
      max-width: 400px;
    }

    h1 {
      text-align: center;
      color: #359EFF;
      margin-bottom: 10px;
    }

    h2 {
      text-align: center;
      color: #9D6CED;
      margin-top: 0;
      font-size: 16px;
    }

    label {
      display: block;
      margin-top: 15px;
      font-weight: bold;
      color: #333;
    }

    input[type="text"],
    input[type="tel"] {
      width: 100%;
      padding: 10px;
      margin-top: 6px;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 14px;
    }

    .checkbox-group {
      margin-top: 15px;
      display: flex;
      align-items: center;
    }

    .checkbox-group input {
      margin-right: 10px;
    }

    button {
      margin-top: 20px;
      width: 100%;
      padding: 12px;
      background-color: #359EFF;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
    }

    button:hover {
      background-color: #277fcd;
    }

    .message {
      margin-top: 20px;
      text-align: center;
      font-weight: bold;
      color: #359EFF;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>SuperLawyer</h1>
    <h2>법률가를 위한 AI</h2>

    <form id="event-form">
      <label for="name">이름</label>
      <input type="text" id="name" required>

      <label for="phone">핸드폰 번호</label>
      <input type="tel" id="phone" required>

      <label for="userid">SuperLawyer 아이디</label>
      <input type="text" id="userid" required>

      <div class="checkbox-group">
        <input type="checkbox" id="agree" required>
        <label for="agree">개인정보 수집 및 이용에 동의합니다.</label>
      </div>

      <button type="submit">제출하기</button>
    </form>

    <div class="message" id="message"></div>
  </div>

  <script>
    document.getElementById('event-form').addEventListener('submit', function (e) {
      e.preventDefault();

      const name = document.getElementById('name').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const userid = document.getElementById('userid').value.trim();
      const agree = document.getElementById('agree').checked;

      if (!name || !phone || !userid || !agree) {
        alert('모든 항목을 입력하고 동의해주세요.');
        return;
      }

      // 간단한 확인 메시지 (서버 연동 없음)
      document.getElementById('message').textContent = `${name}님, 제출이 완료되었습니다. 감사합니다!`;
      document.getElementById('event-form').reset();
    });
  </script>
</body>
</html>
