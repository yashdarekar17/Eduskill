import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrate() {
  try {
    console.log("⚡ Starting Migration...");
    
    // Add google_id column
    await pool.query(`
      ALTER TABLE profiles 
      ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE;
    `);
    console.log("✅ Added google_id column");

    // Make password nullable
    await pool.query(`
      ALTER TABLE profiles 
      ALTER COLUMN password DROP NOT NULL;
    `);
    console.log("✅ Made password column nullable");

    console.log("🎉 Migration Completed Successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration Failed:", err);
    process.exit(1);
  }
}

migrate();
