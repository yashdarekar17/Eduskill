import bcrypt from "bcryptjs";
import { pool } from "../config/db";

export async function createUser(data: any) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(data.password, salt);

  const query = `
    INSERT INTO profiles (name, username, branch, email, password)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *;
  `;

  const values = [
    data.name,
    data.username,
    data.branch,
    data.email,
    hashedPassword,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
}

// Compare passwords (standalone function instead of Mongoose method)
export async function comparePassword(enteredPassword: string, storedHash: string): Promise<boolean> {
  return bcrypt.compare(enteredPassword, storedHash);
}
