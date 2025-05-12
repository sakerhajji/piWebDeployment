const express = require("express");
const router = express.Router();
const OrderController = require("../controller/orderController");

// Middleware for async error handling
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// Create an order
router.post("/", asyncHandler(OrderController.createOrder));

// Get all orders
router.get("/", asyncHandler(OrderController.getOrders));

// Get orders by user ID
// This route is used to fetch orders for a specific user by their user ID
router.get("/user-id/:userid", asyncHandler(OrderController.getOrderByUserId));



// Get order by ID
router.get("/:id", asyncHandler(OrderController.getOrderById));

// Update quantity
router.put("/quantity", asyncHandler(OrderController.updateQuantity));

// Apply coupon
router.post("/apply-coupon", asyncHandler(OrderController.applyCoupon));

// Delete order
router.delete("/:id", asyncHandler(OrderController.deleteOrder));

module.exports = router;