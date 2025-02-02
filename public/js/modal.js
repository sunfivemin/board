// modal.js
let modalConfirmCallback = null;

// 로그인 페이지로 이동하는 함수 추가
function goToLogin() {
  hideModal();
  window.location.href = "/login";
}

// 일반 로그인 체크 함수 추가
function checkLogin() {
  if (!isLoggedIn) {
    showModal("로그인이 필요한 서비스입니다.", {
      title: "로그인 필요",
      type: "login",
      callback: goToLogin,
    });
    return false;
  }
  return true;
}

function showModal(message, options = {}) {
  const modal = document.getElementById("customModal");
  const modalTitle = modal.querySelector(".modal-title");
  const modalMessage = modal.querySelector(".modal-message");
  const confirmButton = modal.querySelector(".confirm-btn");

  const { title = "알림", type = "default", callback = null } = options;

  modalTitle.textContent = title;
  modalMessage.textContent = message;
  modalConfirmCallback = callback;

  switch (type) {
    case "login":
      confirmButton.textContent = "로그인";
      break;
    case "delete":
      confirmButton.textContent = "삭제";
      break;
    default:
      confirmButton.textContent = "확인";
  }

  setTimeout(() => modal.classList.add("show"), 10);
}

function hideModal() {
  const modal = document.getElementById("customModal");
  modal.classList.remove("show");
}

function handleModalConfirm() {
  if (modalConfirmCallback) {
    modalConfirmCallback();
  }
  hideModal();
}

// ESC 키로 모달 닫기
document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    hideModal();
  }
});

// 모달 외부 클릭시 닫기
document.addEventListener("click", function (e) {
  const modal = document.getElementById("customModal");
  if (e.target === modal) {
    hideModal();
  }
});
