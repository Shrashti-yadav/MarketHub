import pkg from "pg";
const { Pool } = pkg;

const database = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }, // required for Render PostgreSQL
      }
    : {
        user: "postgres",
        host: "localhost",
        database: "MarketHub",
        password: "KITKAT265",
        port: 5432,
      }
);

try {
  await database.query("SELECT 1");
  console.log("Connected to the database successfully");
} catch (error) {
  console.error("Database connection failed:", error);
  process.exit(1);
}

export default database;