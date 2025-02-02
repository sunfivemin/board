const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { getDB } = require("../db/database");
const { ensureAuthenticated } = require("../middleware/auth");

// 프로필 페이지 보여주기
router.get("/profile", ensureAuthenticated, (req, res) => {
  try {
    res.render("users/profile", { user: req.user });
  } catch (error) {
    console.error("프로필 페이지 로드 에러:", error);
    res.status(500).send("프로필 페이지 로드 중 오류가 발생했습니다.");
  }
});

// 프로필 수정 페이지
router.get("/profile/edit", ensureAuthenticated, (req, res) => {
  try {
    res.render("users/edit-profile", { user: req.user });
  } catch (error) {
    console.error("프로필 수정 페이지 로드 에러:", error);
    res.status(500).send("프로필 수정 페이지 로드 중 오류가 발생했습니다.");
  }
});

// 프로필 수정 처리
router.post("/profile/edit", ensureAuthenticated, async (req, res) => {
  try {
    const db = getDB();
    const { email, currentPassword, newPassword } = req.body;

    // 기존 사용자 정보 업데이트
    const updateData = { email };

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

    await db
      .collection("users")
      .updateOne({ _id: new ObjectId(req.user._id) }, { $set: updateData });

    res.redirect("/users/profile");
  } catch (error) {
    console.error("프로필 수정 에러:", error);
    res.status(500).send("프로필 수정 중 오류가 발생했습니다.");
  }
});

// 내가 쓴 글 목록
router.get("/posts", ensureAuthenticated, async (req, res) => {
  try {
    const db = getDB();
    const posts = await db
      .collection("new")
      .find({ author: req.user._id })
      .sort({ createdAt: -1 })
      .toArray();

    res.render("users/my-posts", { posts });
  } catch (error) {
    console.error("내 게시글 목록 조회 에러:", error);
    res.status(500).send("게시글 목록 조회 중 오류가 발생했습니다.");
  }
});

module.exports = router;
