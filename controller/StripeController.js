const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const OrdersModel = require('../models/Orders');
const Payment = require('../models/Payment');
const HistoryOrder = require('../models/HistoryOrder');

exports.createCheckoutSession = async (req, res) => {
  try {
    const { items, amount, userid, couponCode = null, discount = 0 } = req.body;

    console.log("📦 Received items from frontend:", items);

    if (!items || items.length === 0) {
      console.warn("⚠ No items received in request");
      return res.status(400).json({ error: "No items to process." });
    }

    // ✅ Save order in DB
    const newOrder = new OrdersModel({
      userid,
      couponCode,
      discount,
      totalAmount: amount, // total with discount
      items: items.map(item => ({
        courseId: item.courseId,
        price: item.price,
        quantity: item.quantity || 1,
      })),
      status: 'pending',
      orderDate: new Date(),
    });

    //await newOrder.save();
    console.log(`✅ Order saved to DB with ID: ${newOrder._id}`);

    const updatedOrder = await OrdersModel.findOneAndUpdate(
      { userid: userid, payment: { $ne: true } }, // optionnel : ne pas modifier si déjà payé
      {
      $set: {
      payment: true,
      status: 'paid', // optionnel : tu peux aussi changer le statut si tu veux
      updatedAt: new Date()
      }
      },
      { new: true } // pour retourner l'objet mis à jour
      );

      if (updatedOrder) {
      console.log('✅ Order updated:', updatedOrder._id);
      } else {
      console.log('⚠️ Aucune commande à mettre à jour pour cet utilisateur.');
      }

    // ✅ Send single line with total amount to Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Cart Total',
            images: [], // you can optionally add your site logo or banner
          },
          unit_amount: Math.round(amount * 100), // total after discount
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart`,
      metadata: {
        orderId: newOrder._id.toString(),
      },
    });

    console.log(`✅ Stripe session created: ${session.id}`);
    res.json({ sessionId: session.id }); // ✅ return correct key
  } catch (error) {
    console.error('❌ Error creating Stripe session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.handleWebhook = async (req, res) => {
  console.log('🔥 Stripe webhook received');

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log(`✅ Stripe event constructed: ${event.type}`);
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;

    console.log(`ℹ️ Processing checkout.session.completed for orderId: ${orderId}`);

    if (!orderId) {
      console.error('❌ Missing orderId in metadata');
      return res.sendStatus(400);
    }

    try {
      const order = await OrdersModel.findById(orderId);
      if (!order) {
        console.error(`❌ Order not found in DB: ${orderId}`);
        return res.sendStatus(404);
      }
      console.log(`✅ Order fetched: ${order._id}`);

      // ✅ Save payment record
      const payment = new Payment({
        userId: order.userid,
        amount: session.amount_total / 100,
        paymentMethod: 'stripe',
        paymentStatus: 'Completed',
        transactionId: session.payment_intent,
        paymentDate: new Date(),
      });
      await payment.save();
      console.log(`✅ Payment saved with ID: ${payment._id}`);

      // ✅ Update order with payment info
      order.payment = payment._id;
      order.status = 'completed';
      await order.save();
      console.log(`✅ Order updated to completed with payment reference`);

      // ✅ Save to history
      const historyOrder = new HistoryOrder({
        userid: order.userid,
        orderId: order._id,
        items: order.items,
        totalAmount: order.totalAmount,
        discount: order.discount,
        couponCode: order.couponCode,
        status: 'completed',
        completedAt: new Date(),
      });

      try {
        await historyOrder.save();
        console.log(`✅ HistoryOrder saved with ID: ${historyOrder._id}`);
      } catch (saveErr) {
        console.error('❌ Error saving HistoryOrder:', saveErr);
      }

      // ✅ Clear pending carts for user
      await OrdersModel.deleteMany({ userid: order.userid, status: 'pending' });
      console.log(`🧹 Cleared pending cart items for user: ${order.userid}`);

      res.sendStatus(200);
    } catch (error) {
      console.error('❌ Error in webhook handler:', error);
      res.sendStatus(500);
    }
  } else {
    console.log(`ℹ️ Unhandled event type: ${event.type}`);
    res.sendStatus(200);
  }
};
