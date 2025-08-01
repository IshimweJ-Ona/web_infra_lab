export const convertCurrency = async ({ amount, from, to }) => {
  if (!amount || typeof amount !== 'number' || !from || !to) {
    throw new Error('Invalid conversion parameters');
  }

  const rateMap = {
    'USD->RWF': 1200,
    'RWF->USD': 1 / 1200
  };

  const key = `${from}->${to}`;
  const rate = rateMap[key] || 1;

  return { converted: amount * rate, rate };
};