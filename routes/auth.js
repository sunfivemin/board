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
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureMessage: true,
    badRequestMessage: "아이디와 비밀번호를 입력해주세요",
  })
);

// 로그아웃
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});

// 회원가입 페이지
router.get("/signup", (req, res) => {
  res.render("auth/signup", { error: null });
});

// 회원가입 처리
router.post("/signup", async (req, res) => {
  try {
    const db = getDB();
    const { username, password, confirmPassword, email } = req.body;

    if (!username || !password || !confirmPassword || !email) {
      return res.render("auth/signup", { error: "모든 필드를 입력해주세요." });
    }

    if (password !== confirmPassword) {
      return res.render("auth/signup", {
        error: "비밀번호가 일치하지 않습니다.",
      });
    }

    const existingUser = await db.collection("users").findOne({ username });
    if (existingUser) {
      return res.render("auth/signup", {
        error: "이미 사용중인 아이디입니다.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await db.collection("users").insertOne({
      username,
      password: hashedPassword,
      email,
      createdAt: new Date(),
    });

    res.redirect("/auth/login");
  } catch (error) {
    console.error("회원가입 에러:", error);
    res.render("auth/signup", {
      error: "회원가입 처리 중 오류가 발생했습니다.",
    });
  }
});

module.exports = router;
