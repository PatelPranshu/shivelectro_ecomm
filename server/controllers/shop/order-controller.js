// const paypal = require("../../helpers/paypal"); // --- REMOVED --- No longer need PayPal
const { instance: razorpayInstance } = require('../../helpers/razorpay'); // --- ADDED --- Import Razorpay instance
const crypto = require('crypto'); // --- ADDED --- For signature verification

const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

// --- NEW FUNCTION --- Replaces the old createOrder
const createRazorpayOrder = async (req, res) => {
  try {
    const { cartId } = req.body;
    
    // ENTERPRISE FIX: Fetch cart from DB instead of trusting client
    const cart = await Cart.findById(cartId);
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ success: false, message: "Cart not found or empty" });
    }
    
    if (cart.userId.toString() !== req.user.id) {
       return res.status(403).json({ success: false, message: "Unauthorized cart access." });
    }

    let serverTotalAmount = 0;
    
    // Validate stock and calculate total amount on server
    for (let item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });
      }
      if (product.totalStock < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          message: `Not enough stock for product: ${product.title}. Only ${product.totalStock} left.` 
        });
      }
      const price = product.salePrice > 0 ? product.salePrice : product.price;
      serverTotalAmount += price * item.quantity;
    }

    const options = {
      amount: Number(serverTotalAmount * 100), // amount calculated securely on server
      currency: "INR",
      receipt: `receipt_order_${new Date().getTime()}`,
    };
    
    const order = await razorpayInstance.orders.create(options);
    if (!order) {
        return res.status(500).send("Error creating Razorpay order");
    }
    res.json(order);
  } catch (error) {
    console.error("Razorpay Create Error:", error);
    res.status(500).send(error);
  }
};

// --- NEW FUNCTION --- Replaces the old capturePayment
const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderPayload } = req.body;
    
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing Razorpay payment details." });
    }
    
    const secret = process.env.RAZORPAY_KEY_SECRET;
    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(body.toString())
      .digest('hex');

    const expectedBuffer = Buffer.from(expectedSignature, 'utf-8');
    const signatureBuffer = Buffer.from(razorpay_signature, 'utf-8');

    if (expectedBuffer.length !== signatureBuffer.length || !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)) {
      return res.status(400).json({ success: false, message: "Payment verification failed. Signature mismatch." });
    }

    // ENTERPRISE FIX: Trust database and token, not client payload.
    const { addressInfo, cartId } = orderPayload;
    const userId = req.user.id; // Use authenticated user ID
    
    const cart = await Cart.findById(cartId);
    if (!cart || cart.items.length === 0) {
      return res.status(404).json({ success: false, message: "Cart not found or empty." });
    }
    
    if (cart.userId.toString() !== userId) {
       return res.status(403).json({ success: false, message: "Unauthorized cart access." });
    }

    // Calculate expected amount on server
    let expectedTotalAmount = 0;
    for (let item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.productId}` });
      }
      const price = product.salePrice > 0 ? product.salePrice : product.price;
      expectedTotalAmount += price * item.quantity;
    }

    // CRITICAL SECURITY FIX: Verify the Razorpay order itself
    const razorpayOrder = await razorpayInstance.orders.fetch(razorpay_order_id);
    if (!razorpayOrder) {
      return res.status(400).json({ success: false, message: "Razorpay order not found." });
    }
    
    if (razorpayOrder.amount !== expectedTotalAmount * 100) {
      return res.status(400).json({ success: false, message: "Payment verification failed. Amount mismatch with Razorpay." });
    }

    // Deduct stock atomically with verification and rollback
    const successfullyDeducted = [];
    let outOfStockError = null;

    for (let item of cart.items) {
      const updateResult = await Product.updateOne(
        { _id: item.productId, totalStock: { $gte: item.quantity } },
        { $inc: { totalStock: -item.quantity } }
      );
      if (updateResult.modifiedCount === 0) {
        // Stock went out exactly between order creation and payment
        outOfStockError = `Product out of stock during payment: ${item.productId}`;
        break; // Stop deducting!
      } else {
        successfullyDeducted.push(item);
      }
    }

    if (outOfStockError) {
       // Rollback the previously deducted stock
       for (let item of successfullyDeducted) {
           await Product.updateOne(
              { _id: item.productId },
              { $inc: { totalStock: item.quantity } }
           );
       }
       return res.status(400).json({ success: false, message: outOfStockError });
    }

    // Map cart items for the order document
    const cartItemsData = await Promise.all(cart.items.map(async (item) => {
       const product = await Product.findById(item.productId);
       return {
         productId: item.productId,
         title: product.title,
         image: product.image,
         price: (product.salePrice > 0 ? product.salePrice : product.price).toString(),
         quantity: item.quantity
       };
    }));

    const newOrder = new Order({
      userId,
      cartId,
      cartItems: cartItemsData,
      addressInfo,
      orderStatus: 'Pending',
      paymentMethod: 'Razorpay',
      paymentStatus: 'Paid',
      totalAmount: expectedTotalAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: razorpay_payment_id,
      payerId: razorpay_order_id,
    });

    await newOrder.save();
    
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