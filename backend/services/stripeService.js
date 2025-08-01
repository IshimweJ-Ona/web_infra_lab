import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripePayment = async ({ amount, currency }) => {
  if (!amount || !currency) {
    throw new Error('Missing Stripe payment data');
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency
    });

    return paymentIntent.client_secret;
  } catch (err) {
    console.error('Stripe error:', err.message);
    throw new Error('Stripe payment initiation failed');
  }
};