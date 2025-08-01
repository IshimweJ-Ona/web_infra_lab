import { generateQR } from '../services/qrService.js';

export const createQR = async (req, res) => {
  const { data } = req.body;

  try {
    const qr = await generateQR(data);
    res.json({ success: true, qr });
  } catch (err) {
    console.error('QR generation error:', err.message);
    res.status(500).json({ error: 'QR generation failed' });
  }
};

export const readQR = async (req, res) => {
  // Placeholder: actual QR reading logic would go here
  res.json({ success: true, message: 'QR reading not yet implemented' });
};