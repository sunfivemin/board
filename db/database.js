const { MongoClient } = require("mongodb");
require("dotenv").config();

const url = process.env.DB_URL;
let db;

const connectDB = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
}).connect();

const getDB = () => {
  return db;
};

const setDB = (database) => {
  db = database;
};

module.exports = { connectDB, getDB, setDB };
