const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');

// Create Coupon
router.post('/', async (req, res) => {
  try {
    const coupon = new Coupon(req.body);
    await coupon.save();
    res.status(201).json(coupon);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Read All Coupons
router.get('/', async (req, res) => {
  const coupons = await Coupon.find();
  res.json(coupons);
});

// Read One Coupon
router.get('/:id', async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) return res.status(404).json({ error: 'Not found' });
  res.json(coupon);
});

// Update Coupon
router.put('/:id', async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!coupon) return res.status(404).json({ error: 'Not found' });
  res.json(coupon);
});

// Delete Coupon
router.delete('/:id', async (req, res) => {
  await Coupon.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted successfully' });
});

// Coupon Validation Route
router.post('/validate', async (req, res) => {
  const { couponCode } = req.body;

  if (!couponCode) {
    return res.status(400).json({ message: 'Coupon code is required' });
  }

  try {
    const coupon = await Coupon.findOne({ code: couponCode });

    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }

    // Check if coupon is active
    if (!coupon.isActive) {
      return res.status(400).json({ message: 'Coupon is inactive' });
    }

    // Check if coupon is expired
    const currentDate = new Date();
    if (new Date(coupon.expirationDate) < currentDate) {
      return res.status(400).json({ message: 'Coupon has expired' });
    }

    // If the coupon is valid, return the discount percentage
    return res.status(200).json({
      valid: true,
      discount: coupon.discount,
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
