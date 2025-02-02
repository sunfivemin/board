function updateTime() {
  const now = new Date();

  // 현재 시간 업데이트
  document.querySelector(".current-time").textContent = now.toLocaleTimeString(
    "ko-KR",
    { hour12: false }
  );

  // 현재 날짜 업데이트
  document.querySelector(".date-info").textContent = now.toLocaleDateString(
    "ko-KR",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }
  );

  // 세계 시간 업데이트
  const cities = {
    "New York": "America/New_York",
    London: "Europe/London",
    Tokyo: "Asia/Tokyo",
    Sydney: "Australia/Sydney",
  };

  Object.entries(cities).forEach(([city, timezone]) => {
    const cityTime = now.toLocaleTimeString("ko-KR", {
      timeZone: timezone,
      hour12: false,
    });
    document.querySelector(`[data-city="${city}"]`).textContent = cityTime;
  });
}

// 스톱워치 기능
let stopwatchInterval;
let stopwatchTime = 0;
let isRunning = false;

function startStopwatch() {
  if (!isRunning) {
    isRunning = true;
    stopwatchInterval = setInterval(() => {
      stopwatchTime += 10;
      updateStopwatch();
    }, 10);
    document.getElementById("startBtn").textContent = "일시정지";
  } else {
    isRunning = false;
    clearInterval(stopwatchInterval);
    document.getElementById("startBtn").textContent = "시작";
  }
}

function resetStopwatch() {
  isRunning = false;
  clearInterval(stopwatchInterval);
  stopwatchTime = 0;
  updateStopwatch();
  document.getElementById("startBtn").textContent = "시작";
}

function updateStopwatch() {
  const minutes = Math.floor(stopwatchTime / 60000);
  const seconds = Math.floor((stopwatchTime % 60000) / 1000);
  const milliseconds = Math.floor((stopwatchTime % 1000) / 10);

  document.querySelector(".stopwatch").textContent = `${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}:${String(
    milliseconds
  ).padStart(2, "0")}`;
}

// 1초마다 시간 업데이트
setInterval(updateTime, 1000);
updateTime(); // 초기 로드시 즉시 업데이트
