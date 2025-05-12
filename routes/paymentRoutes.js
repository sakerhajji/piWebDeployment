const express = require('express');
const router = express.Router();
const PaymentController = require('../controller/StripeController');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// ✅ Checkout Session for one-time payments
router.post('/create-checkout-session', PaymentController.createCheckoutSession);

// ✅ Payment Intent for card form payments (requires frontend integration with Stripe Elements)
router.post('/create-payment-intent', async (req, res) => {
  const { amount, userId } = req.body;

  if (!amount || !userId) {
    return res.status(400).json({ error: 'Missing amount or userId in request body.' });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe expects amounts in cents
      currency: 'usd',
      metadata: { userId },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('❌ Error creating PaymentIntent:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
