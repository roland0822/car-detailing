import mysql from "mysql2/promise";
import mysql2 from "mysql2"

// POOL = false - egyeszerű kapcsolat
//      = true  - connectionPool

const POOL = false;

let conn = null;

if (!POOL) {
  const getConn = async () => {
    try {
      const conn = await mysql.createConnection({
        host: "localhost",
        user: "detailing",
        database: "detailing",
        password: "alma333",
        dateStrings: true,
      });
      conn.config.namedPlaceholders = true;
      return conn;
    } catch (err) {
      console.log(err.message);
    }
  };

  conn = await getConn();

// connection pool
} else {
  const getPool = async () => {
    try {
      const pool = mysql2.createPool({
        host: "localhost",
        user: "detailing",
        database: "detailing",
        password: "alma333",
        connectionLimit: 10,
        namedPlaceholders: true,
        dateStrings: true,
      });
      const promisePool = pool.promise();
      return promisePool;
    } catch (err) {
      console.log(err.message);
    }
  };

  conn = await getPool();
}


export { conn };
