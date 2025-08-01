import { convertCurrency } from '../services/exchangeService.js';

export const exchange = async (req, res) => {
  const { amount, from, to } = req.body;

  try {
    const result = await convertCurrency({ amount, from, to });
    res.json({ success: true, ...result });
  } catch (err) {
    console.error('Exchange error:', err.message);
    res.status(400).json({ error: 'Currency conversion failed' });
  }
};