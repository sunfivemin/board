const passport = require("passport");
const LocalStrategy = require("passport-local");
const bcrypt = require("bcryptjs");
const { ObjectId } = require("mongodb");
const { getDB } = require("../db/database");

module.exports = function () {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const db = getDB();
      const user = await db
        .collection("users")
        .findOne({ _id: new ObjectId(id) });
      done(null, user);
    } catch (err) {
      done(err);
    }
  });

  // LocalStrategy 설정
  passport.use(
    new LocalStrategy(
      {
        usernameField: "username",
        passwordField: "password",
        session: true, // 세션 사용
        passReqToCallback: false,
      },
      async (username, password, done) => {
        try {
          const db = getDB();
          const user = await db.collection("users").findOne({ username });

          if (!user) {
            return done(null, false, {
              message: "존재하지 않는 아이디입니다.",
            });
          }

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            return done(null, false, {
              message: "비밀번호가 일치하지 않습니다.",
            });
          }

          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );
};
