const express = require("express");
const paypal = require("../config/paypalConfig");
const Order = require("../models/orders");  // Import the Order model
//const Order = require("../models/order");  // Import the Order model
const router = express.Router();
const Course = require("../models/course");  // Assuming you have a Course model

// 1️⃣ Create Payment Route
router.post("/pay", (req, res) => {
    const { amount, userId, courseId, receiverId } = req.body;

    const paymentJson = {
        intent: "sale",
        payer: {
            payment_method: "paypal",
        },
        redirect_urls: {
            return_url: "http://localhost:3000/api/paypal/success",
            cancel_url: "http://localhost:3000/api/paypal/cancel",
        },
        transactions: [
            {
                amount: {
                    currency: "USD",
                    total: amount, 
                },
                description: "Payment for your order",
            },
        ],
    };

    paypal.payment.create(paymentJson, (error, payment) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Payment creation failed" });
        } else {
            const approvalUrl = payment.links.find(link => link.rel === "approval_url").href;

            // Save order as "pending" before payment completion
            const newOrder = new Order({
                user: userId,
                course: courseId,
                paymentId: payment.id,
                receiverId: receiverId,
                amount: amount,
                currency: "USD",
                status: "Pending"  // Corrected capitalization
            });
            

            newOrder.save()
                .then(() => res.json({ approvalUrl }))
                .catch(err => res.status(500).json({ error: "Order creation failed", details: err }));
        }
    });
});

// 2️⃣ Success Route (Execute Payment & Update Order)
router.get("/success", async (req, res) => {
    const { paymentId, PayerID } = req.query;

    const executePaymentJson = {
        payer_id: PayerID,
    };

    paypal.payment.execute(paymentId, executePaymentJson, async (error, payment) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ error: "Payment execution failed" });
        } else {
            // Find the order and update status to "completed"
            try {
                await Order.findOneAndUpdate({ paymentId }, { status: "completed" });
                res.send("Payment successful! Thank you for your purchase.");
            } catch (err) {
                res.status(500).json({ error: "Failed to update order status" });
            }
        }
    });
});

// 3️⃣ Cancel Route (Update Order to Failed)
router.get("/cancel", async (req, res) => {
    const { paymentId } = req.query;

    try {
        await Order.findOneAndUpdate({ paymentId }, { status: "failed" });
        res.send("Payment was canceled.");
    } catch (err) {
        res.status(500).json({ error: "Failed to update order status" });
    }
});

/*router.get("/purchased-courses/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find all orders where the user has paid (status: "completed")
        const orders = await Order.find({ user: userId, status: "completed" }).populate("course");

        // Extract course details
        const purchasedCourses = orders.map(order => order.course);

        res.json(purchasedCourses);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch purchased courses" });
    }
});*/

router.get("/purchased-courses/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find all orders where the user has paid (status: "completed")
        const orders = await Order.find({ 
            userid: userId
           
        }).populate("items.courseId"); // Changed to populate items.courseId

        // Extract course details from all items in all orders
        const purchasedCourses = orders.reduce((acc, order) => {
            const coursesInOrder = order.items.map(item => item.courseId);
            return [...acc, ...coursesInOrder];
        }, []);

        res.json(purchasedCourses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch purchased courses" });
    }
});

router.get("/purchased-course/:userId/:courseId", async (req, res) => {
    try {
        const { userId, courseId } = req.params;

        // Find the order for the given user and course, ensuring the status is "completed"
        const order = await Order.findOne({ user: userId, course: courseId, status: "completed" }).populate("course");

        if (!order) {
            return res.status(404).json({ error: "No purchased order found for this course" });
        }

        res.json(order.course); // Send only the course details
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch the purchased course" });
    }
});





module.exports = router;