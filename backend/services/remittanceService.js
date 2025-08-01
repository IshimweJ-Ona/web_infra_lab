import axios from 'axios';

export const sendRemittance = async ({ amount, recipient }) => {
  if (!amount || !recipient) {
    throw new Error('Missing remittance parameters');
  }

  const headers = {
    Authorization: `Bearer ${process.env.REMITTANCE_PRIMARY_KEY}`
  };

  try {
    const response = await axios.post(
      'https://api.remittance.com/send',
      { amount, recipient },
      { headers }
    );

    return response.data;
  } catch (err) {
    console.error('Remittance error:', err.message);
    throw new Error('Remittance request failed');
  }
};