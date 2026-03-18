import { Pool } from "pg";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not defined");
}

export const pool = new Pool({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

export const connectDB = async (): Promise<void> => {
  try {
    await pool.connect();
    console.log("✅ PostgreSQL Connected Successfully");
  } catch (error) {
    console.error("❌ PostgreSQL Connection Error:", error);
    process.exit(1);
  }
};
