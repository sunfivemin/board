class Navigation {
  constructor() {
    // 기본 네비게이션 요소
    this.hamburger = document.querySelector(".hamburger");
    this.navLinks = document.querySelector(".nav-links");
    this.links = document.querySelectorAll(".nav-links a");
    this.isMenuOpen = false;

    // 사용자 메뉴 요소
    this.userMenuBtn = document.querySelector(".user-menu-btn");
    this.userDropdown = document.querySelector(".user-dropdown");
    this.isUserMenuOpen = false;

    this.init();
  }

  init() {
    if (this.hamburger) {
      this.hamburger.addEventListener("click", this.toggleMenu.bind(this));
    }
    if (this.links) {
      this.links.forEach((link) => {
        link.addEventListener("click", this.closeMenu.bind(this));
      });
    }

    // 사용자 메뉴 이벤트 리스너
    if (this.userMenuBtn && this.userDropdown) {
      this.userMenuBtn.addEventListener(
        "click",
        this.toggleUserMenu.bind(this)
      );
    }

    // 전역 이벤트 리스너
    window.addEventListener("scroll", this.handleScroll.bind(this));
    window.addEventListener("resize", this.handleResize.bind(this));
    document.addEventListener("keydown", this.handleKeyPress.bind(this));
    document.addEventListener("click", this.handleClickOutside.bind(this));
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.hamburger.classList.toggle("active");
    this.navLinks.classList.toggle("active");

    // 메뉴가 열릴 때 스크롤 방지
    if (this.isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    // 접근성을 위한 aria-expanded 속성 추가
    this.hamburger.setAttribute("aria-expanded", this.isMenuOpen);
  }

  closeMenu() {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
      this.hamburger.classList.remove("active");
      this.navLinks.classList.remove("active");
      document.body.style.overflow = "";
      this.hamburger.setAttribute("aria-expanded", "false");
    }
  }

  toggleUserMenu(e) {
    e.stopPropagation();
    this.isUserMenuOpen = !this.isUserMenuOpen;
    this.userDropdown.classList.toggle("show");
  }

  closeUserMenu() {
    if (this.isUserMenuOpen) {
      this.isUserMenuOpen = false;
      this.userDropdown.classList.remove("show");
    }
  }

  handleScroll() {
    // 스크롤 시 메뉴 닫기
    this.closeMenu();
    this.closeUserMenu();

    // 스크롤 위치에 따른 네비게이션 스타일 변경
    const nav = document.querySelector(".nav");
    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }

  handleResize() {
    // 화면 크기가 모바일 breakpoint보다 커지면 메뉴 초기화
    if (window.innerWidth > 768) {
      this.closeMenu();
      this.closeUserMenu();
    }
  }

  handleKeyPress(e) {
    // ESC 키로 메뉴와 사용자 메뉴 닫기
    if (e.key === "Escape") {
      this.closeMenu();
      this.closeUserMenu();
    }
  }

  handleClickOutside(e) {
    // 메뉴 외부 클릭 시 닫기
    if (
      this.isMenuOpen &&
      !this.navLinks.contains(e.target) &&
      !this.hamburger.contains(e.target)
    ) {
      this.closeMenu();
    }

    // 사용자 메뉴 외부 클릭 시 닫기
    if (
      this.isUserMenuOpen &&
      !this.userDropdown.contains(e.target) &&
      !this.userMenuBtn.contains(e.target)
    ) {
      this.closeUserMenu();
    }
  }
}

// DOM이 로드된 후 네비게이션 초기화
document.addEventListener("DOMContentLoaded", () => {
  const nav = new Navigation();
});
