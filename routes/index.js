const express = require("express");
const router = express.Router();
const { getDB } = require("../db/database");

// 테스트 라우트
router.get("/test", (req, res) => {
  res.json({ message: "서버가 정상적으로 작동합니다!", timestamp: new Date() });
});

// 메인 페이지 - 게시판 목록 직접 렌더링
router.get("/", async (req, res) => {
  try {
    const db = getDB();
    const page = parseInt(req.query.page) || 1;
    const perPage = 6;

    const totalPosts = await db.collection("new").countDocuments();
    const totalPages = Math.ceil(totalPosts / perPage);

    let result = await db
      .collection("new")
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .toArray();

    console.log("🎯 메인 페이지 렌더링: list/list.ejs");
    res.render("list/list", {
      posts: result,
      currentPage: page,
      totalPages: totalPages,
      totalPosts: totalPosts,
      user: req.user,
    });
  } catch (error) {
    console.error("메인 페이지 로드 중 에러:", error);
    // DB 연결 실패 시 빈 페이지로 렌더링
    res.render("list/list", {
      posts: [],
      currentPage: 1,
      totalPages: 1,
      totalPosts: 0,
      user: req.user,
    });
  }
});

// 시간 표시 페이지
router.get("/time", async (req, res) => {
  res.render("time.ejs", { data: new Date() });
});

module.exports = router;
