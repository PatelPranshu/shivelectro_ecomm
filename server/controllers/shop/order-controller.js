// const paypal = require("../../helpers/paypal"); // --- REMOVED --- No longer need PayPal
const { instance: razorpayInstance } = require('../../helpers/razorpay'); // --- ADDED --- Import Razorpay instance
const crypto = require('crypto'); // --- ADDED --- For signature verification

const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

// --- NEW FUNCTION --- Replaces the old createOrder
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    const options = {
      amount: Number(amount * 100), // amount in the smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${new Date().getTime()}`,
    };
    const order = await razorpayInstance.orders.create(options);
    if (!order) {
        return res.status(500).send("Error creating Razorpay order");
    }
    res.json(order);
  } catch (error) {
    res.status(500).send(error);
  }
};

// --- NEW FUNCTION --- Replaces the old capturePayment
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderPayload } = req.body;
    
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Payment verification failed. Signature mismatch." });
    }

    // --- LOGIC MOVED HERE ---
    // If signature is valid, now we create and save the order, update stock, and clear the cart.
    const { userId, cartItems, addressInfo, totalAmount, cartId } = orderPayload;

    const newOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus: 'Pending',
      paymentMethod: 'Razorpay',
      paymentStatus: 'Paid',
      totalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentDetails: {
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
      }
    });

    await newOrder.save();

    // Update product stock
    for (let item of newOrder.cartItems) {
      await Product.updateOne(
        { _id: item.productId },
        { $inc: { totalStock: -item.quantity } }
      );
    }
    
    // Clear the user's cart
    await Cart.findByIdAndDelete(cartId);
    
    res.status(200).json({ success: true, message: "Order placed successfully." });

  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};


// These functions below do not need to be changed.
const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId }).sort({ orderDate: -1 }); // Added sort for better UX
    if (!orders) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }
    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }
    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occured!",
    });
  }
};


module.exports = {
  createRazorpayOrder, // --- UPDATED ---
  verifyRazorpayPayment, // --- UPDATED ---
  getAllOrdersByUser,
  getOrderDetails,
};