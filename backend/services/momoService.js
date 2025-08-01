import axios from 'axios';

export const initiateMomoTransaction = async ({ amount, currency, phone }) => {
  if (!amount || !currency || !phone) {
    throw new Error('Missing transaction details');
  }

  const config = {
    headers: {
      'X-Reference-Id': process.env.MOMO_API_USER,
      'Ocp-Apim-Subscription-Key': process.env.MOMO_API_KEY,
      'X-Target-Environment': 'sandbox'
    }
  };

  const payload = {
    amount,
    currency,
    externalId: phone,
    payer: {
      partyIdType: 'MSISDN',
      partyId: phone
    },
    payerMessage: 'PayRwa payment',
    payeeNote: 'Thank you'
  };

  try {
    const response = await axios.post(process.env.MOMO_CALLBACK_URL, payload, config);
    return response.data;
  } catch (err) {
    console.error('MoMo transaction error:', err.message);
    throw new Error('MoMo transaction failed');
  }
};