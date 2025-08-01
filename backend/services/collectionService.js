import axios from 'axios';

export const initiateCollection = async ({ referenceId, amount }) => {
  if (!referenceId || !amount) {
    throw new Error('Missing collection parameters');
  }

  const headers = {
    'Collection-Primary': process.env.COLLECTION_PRIMARY_KEY,
    'Collection-Secondary': process.env.COLLECTION_SECONDARY_KEY
  };

  try {
    const response = await axios.post(
      'https://api.collection-widget.com/initiate',
      { referenceId, amount },
      { headers }
    );

    return response.data;
  } catch (err) {
    console.error('Collection API error:', err.message);
    throw new Error('Failed to initiate collection');
  }
};