const { MongoClient } = require("mongodb");
require("dotenv").config();

const url = process.env.DB_URL;

if (!url) {
  console.error("❌ DB_URL 환경 변수가 설정되지 않았습니다!");
  throw new Error("DB_URL environment variable is not set");
}

console.log("🔗 MongoDB 연결 시도 (Render 서버)");

let db;
let client;

// Render 서버에 최적화된 연결 설정
const connectDB = async () => {
  try {
    if (client && client.topology && client.topology.isConnected()) {
      console.log("✅ 기존 연결 재사용");
      return client;
    }

    console.log("🔄 새로운 MongoDB 연결 생성...");

    client = new MongoClient(url, {
      // Render 서버 최적화 설정 (더 빠른 연결)
      serverSelectionTimeoutMS: 3000, // 3초로 단축
      connectTimeoutMS: 5000, // 5초로 단축
      maxPoolSize: 5, // 연결 풀 크기 줄임
      minPoolSize: 0, // 최소 연결 수 줄임
      maxIdleTimeMS: 60000, // 1분으로 연장
      retryWrites: true,
      retryReads: true, // 읽기 재시도 추가
      w: "majority", // 쓰기 확인 레벨
    });

    await client.connect();
    console.log("✅ MongoDB 연결 성공!");
    return client;
  } catch (error) {
    console.error("❌ MongoDB 연결 실패:", error.message);
    // 연결 실패 시에도 서버는 계속 실행
    console.log("⚠️ DB 연결 없이 서버를 계속 실행합니다.");
    return null;
  }
};

const getDB = () => {
  if (!db) {
    console.error("❌ 데이터베이스가 초기화되지 않았습니다!");
    throw new Error("Database not initialized");
  }
  return db;
};

const setDB = (database) => {
  db = database;
  console.log("✅ 데이터베이스 설정 완료");
};

module.exports = { connectDB, getDB, setDB };
