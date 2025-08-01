import { db } from '../models/User.js';

export const addTransaction = async (userId, amount, description, currency) => {
  const status = 'pending';
  const paid_to = 'API';
  const date = new Date().toISOString();

  try {
    const [result] = await db.execute(
      `INSERT INTO transactions 
       (user_id, amount, paid_to, description, currency, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [userId, amount, paid_to, description, currency, status, date]
    );

    return { success: true, transactionId: result.insertId };
  } catch (err) {
    console.error('Transaction error:', err.message);
    throw new Error('Transaction failed');
  }
};