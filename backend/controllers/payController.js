import { db } from '../models/User.js';

export const pay = async (req, res) => {
  if (!req.session.user) {
    return res.status(403).json({ success: false, error: 'Login required' });
  }

  const { payType, target, amount, userPhone, currency } = req.body;

  if (!payType || !target || !amount || !userPhone || !currency) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }

  try {
    await db.execute(
      'INSERT INTO transactions (user_id, amount, paid_to, date, status, description, currency) VALUES (?, ?, ?, NOW(), ?, ?, ?)',
      [
        req.session.user.id,
        amount,
        target,
        'pending',
        `${payType} from ${userPhone}`,
        currency
      ]
    );

    res.json({ success: true, message: 'Payment created' });
  } catch (err) {
    console.error('Payment error:', err.message);
    res.status(500).json({ success: false, error: 'Payment failed' });
  }
};
