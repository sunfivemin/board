const express = require("express");
const router = express.Router();
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { getDB } = require("../db/database");

// 로그인 페이지
router.get("/login", (req, res) => {
  res.render("auth/login", {
    error: req.session.messages && req.session.messages[0],
  });
});

// 로그인 처리
router.post("/login", (req, res, next) => {
  console.log("🔐 로그인 요청 받음:", req.body);

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error("❌ 인증 에러:", err);
      return res.redirect(
        "/auth/login?message=로그인 처리 중 오류가 발생했습니다.&type=error"
      );
    }

    if (!user) {
      console.log("❌ 인증 실패:", info.message);
      return res.redirect(
        "/auth/login?message=아이디 또는 비밀번호가 올바르지 않습니다.&type=error"
      );
    }

    req.logIn(user, (err) => {
      if (err) {
        console.error("❌ 로그인 세션 에러:", err);
        return res.redirect(
          "/auth/login?message=로그인 처리 중 오류가 발생했습니다.&type=error"
        );
      }

      console.log("✅ 로그인 성공 및 세션 생성:", user.username);
      console.log("🔍 세션 정보:", req.session);
      return res.redirect(
        `/?message=${user.username}님, 환영합니다!&type=success`
      );
    });
  })(req, res, next);
});

// 로그아웃
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/?message=로그아웃되었습니다.&type=success");
  });
});

// 회원가입 페이지
router.get("/signup", (req, res) => {
  console.log("회원가입 시도됨:", req.body);
  res.render("auth/signup", { error: null });
});

// 회원가입 처리
router.post("/signup", async (req, res) => {
  try {
    const db = getDB();
    const { username, password, confirmPassword, email } = req.body;

    if (!username || !password || !confirmPassword || !email) {
      return res.redirect(
        "/auth/signup?message=모든 필드를 입력해주세요.&type=error"
      );
    }

    if (password !== confirmPassword) {
      return res.redirect(
        "/auth/signup?message=비밀번호가 일치하지 않습니다.&type=error"
      );
    }

    const existingUser = await db.collection("users").findOne({ username });
    if (existingUser) {
      return res.redirect(
        "/auth/signup?message=이미 사용중인 아이디입니다.&type=error"
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection("users").insertOne({
      username,
      password: hashedPassword,
      email,
      createdAt: new Date(),
    });

    res.redirect(
      "/auth/login?message=회원가입이 완료되었습니다! 로그인해주세요.&type=success"
    );
  } catch (error) {
    console.error("회원가입 에러:", error);
    res.redirect(
      "/auth/signup?message=회원가입 처리 중 오류가 발생했습니다.&type=error"
    );
  }
});

module.exports = router;
