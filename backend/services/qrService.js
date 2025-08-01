import QRCode from 'qrcode';

export const generateQR = async (data) => {
  if (!data || typeof data !== 'string') {
    throw new Error('Invalid data for QR generation');
  }

  try {
    const qrCode = await QRCode.toDataURL(data);
    return qrCode;
  } catch (err) {
    console.error('QR generation failed:', err.message);
    throw new Error('QR code generation failed');
  }
};