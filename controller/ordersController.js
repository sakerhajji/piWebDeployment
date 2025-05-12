const mongoose = require("mongoose");
const OrdersModel = require("../models/Orders");
const Payment = require("../models/Payment");
const Course = require("../models/course");

/**
 * Create a new Order
 */
exports.createOrders = async (req, res) => {
  try {
    const { items, couponCode, userid, discount } = req.body;

    // Validate and fetch course details
    const courseIds = items.map(item => new mongoose.Types.ObjectId(item.courseId));
    const courses = await Course.find({ _id: { $in: courseIds } });

    if (courses.length !== courseIds.length) {
      return res.status(400).json({ message: "One or more courses not found" });
    }

    // Create validated items
    const validatedItems = items.map(item => {
      const course = courses.find(c => c._id.toString() === item.courseId);
      return {
        courseId: course._id,
        quantity: item.quantity,
        price: course.price
      };
    });

    // Calculate total amount
    let totalAmount = validatedItems.reduce((total, item) => total + item.price * item.quantity, 0);

    if (discount && !isNaN(discount)) {
      totalAmount = totalAmount - (totalAmount * discount / 100);
    }

    // Create and save order
    const newOrder = new OrdersModel({
      userid,
      items: validatedItems,
      couponCode,
      discount,
      totalAmount,
      status: "pending",
      orderDate: new Date()
    });

    await newOrder.save();

    // Populate course details
    await newOrder.populate({
      path: 'items.courseId',
      select: 'title description courseImage price'
    });

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder
    });

  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * Get all orders
 */
exports.getOrders = async (req, res) => {
  try {
    const orders = await OrdersModel.find()
      .populate({
        path: 'items.courseId',
        select: 'title description courseImage price'
      })
      .populate({
        path: 'payment',
        select: 'amount paymentMethod paymentStatus transactionId'
      });

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * Get a single order by ID
 */
exports.getOrdersById = async (req, res) => {
  try {
    const order = await OrdersModel.findById(req.params.id)
      .populate({
        path: 'items.courseId',
        select: 'title description courseImage price'
      })
      .populate({
        path: 'payment',
        select: 'amount paymentMethod paymentStatus transactionId'
      });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * Get orders by user ID
 */
exports.getOrdersByUserId = async (req, res) => {
  try {
    const query = { userid: req.params.userid };
    const orders = await OrdersModel.find(query)
      .populate({
        path: 'items.courseId',
        select: 'title description courseImage price'
      });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by user ID:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
exports.getOrdersPendingByUserId = async (req, res) => {
  try {
    const query = { userid: req.params.userid,status: 'pending' };
    const orders = await OrdersModel.find(query)
      .populate({
        path: 'items.courseId',
        select: 'title description courseImage price'
      });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders by user ID:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * Update order quantity
 */
exports.updateQuantity = async (req, res) => {
  try {
    const { orderId, courseId, quantity } = req.body;

    const order = await OrdersModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const itemIndex = order.items.findIndex(
      item => item.courseId.toString() === courseId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Course not found in order" });
    }

    order.items[itemIndex].quantity = quantity;

    order.totalAmount = order.items.reduce(
      (total, item) => total + item.price * item.quantity, 0
    );

    await order.save();

    await order.populate({
      path: 'items.courseId',
      select: 'title description courseImage price'
    });

    res.status(200).json({
      message: "Quantity updated successfully",
      order
    });

  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/**
 * Delete an order
 */
exports.deleteOrders = async (req, res) => {
  try {
    const order = await OrdersModel.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    await OrdersModel.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Order deleted successfully" });

  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
