import { addTransaction } from '../services/paymentService.js';
import { initiateMomoTransaction } from '../services/momoService.js';

export const pay = async (req, res) => {
  const { amount, currency, phone, description } = req.body;

  try {
    const momoResponse = await initiateMomoTransaction({ amount, currency, phone });
    const tx = await addTransaction(req.user.id, amount, description, currency);

    res.json({
      success: true,
      transactionId: tx.transactionId,
      momo: momoResponse
    });
  } catch (err) {
    console.error('Payment error:', err.message);
    res.status(500).json({ error: 'Payment failed' });
  }
};