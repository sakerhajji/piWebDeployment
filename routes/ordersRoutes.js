const express = require("express");
const router = express.Router();
const OrdersController = require("../controller/ordersController");

// Middleware for async error handling
const asyncHandler = (fn) => (req, res, next) =>
Promise.resolve(fn(req, res, next)).catch(next);

// Create an Orders
router.post("/", asyncHandler(OrdersController.createOrders));

// Get all Orderss
router.get("/", asyncHandler(OrdersController.getOrders));

// Get Orderss by user ID
// This route is used to fetch Orderss for a specific user by their user ID
router.get("/user-id/:userid", asyncHandler(OrdersController.getOrdersByUserId)); 
// Get Orderss by user ID with status pending
router.get("/user-id/pending/:userid", asyncHandler(OrdersController.getOrdersPendingByUserId)); 


// Get Orders by ID
router.get("/:id", asyncHandler(OrdersController.getOrdersById));

// Update quantity
router.put("/quantity", asyncHandler(OrdersController.updateQuantity));

// Apply coupon
router.post("/apply-coupon", asyncHandler(OrdersController.applyCoupon));

// Delete Orders
router.delete("/:id", asyncHandler(OrdersController.deleteOrders));

module.exports = router;