// 데이터베이스 연결하기
import mysql from "mysql";
export const db = mysql.createPool({
  host: "192.168.100.146",
  user: "root",
  password: "1234",
  database: "picshare",
  connectionLimit: 10,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection error:", err);
    return;
  }
  console.log("Connected to the database.");
  connection.release();
});