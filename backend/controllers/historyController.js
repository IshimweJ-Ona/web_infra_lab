import { db } from '../models/User.js';

export const getHistory = async (userId) => {
  const [rows] = await db.execute(
    'SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  );
  return rows;
};

export const getHistoryHandler = async (req, res) => {
  try {
    const status = req.query.status;
    const transactions = await getHistory(req.user.id);

    const filtered = status
      ? transactions.filter(tx => tx.status === status)
      : transactions;

    res.json({ success: true, transactions: filtered });
  } catch (err) {
    console.error('History route error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch history' });
  }
};