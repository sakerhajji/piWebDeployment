const Order = require("../models/order");

// Get all orders with only course populated
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate("course"); // only populate 'course'
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


// Get a single order
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate("user course");
        if (!order) return res.status(404).json({ error: "Order not found" });
        res.json(order);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) return res.status(404).json({ error: "Order not found" });
        res.json({ message: "Order deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Get orders by user ID
exports.getOrderByUserId = async (req, res) => {
    try {
        const { userid } = req.params;

        // Log for debugging
        console.log("Fetching orders for user ID:", userid);

        const orders = await Order.find({ user: userid }).populate("course");

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user" });
        }

        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

