import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

/* 
   Validate Environment Variables
 */

const requiredEnv = [
  "DB_HOST",
  "DB_USER",
  "DB_PASSWORD",
  "DB_NAME",
];

const missing = requiredEnv.filter(
  (key) => !process.env[key]
);

if (missing.length > 0) {
  throw new Error(
    `Missing database environment variables: ${missing.join(", ")}`
  );
}

/* 
   Database Connection Pool
 */

// SSL is required for TiDB Cloud in production, but CI/local Docker Compose
// runs against a plain MySQL container with a self-signed cert that would
// fail strict validation. DB_SSL lets that be controlled explicitly;
// if unset, it falls back to the previous NODE_ENV-based behavior so real
// deployments (Render + TiDB Cloud) are unaffected.
const sslEnabled =
  process.env.DB_SSL !== undefined
    ? process.env.DB_SSL === "true"
    : process.env.NODE_ENV === "production";

const db = mysql.createPool({
  host: process.env.DB_HOST,

  port: Number(process.env.DB_PORT) || 4000,

  user: process.env.DB_USER,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_NAME,

  waitForConnections: true,

  connectionLimit: Number(process.env.DB_CONNECTION_LIMIT) || 10,

  queueLimit: 0,

  connectTimeout: 10000,

  enableKeepAlive: true,

  namedPlaceholders: true,

  ssl: sslEnabled
    ? {
        minVersion: "TLSv1.2",
        rejectUnauthorized: true,
      }
    : undefined,
});

/* 
   Verify Database Connection
 */

export const testDatabaseConnection = async () => {
  try {
    const connection = await db.getConnection();

    await connection.ping();

    console.log("✅ MySQL / TiDB database connected successfully.");

    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed.");
    console.error(error.message);

    throw error;
  }
};

export default db;