const Order = require("../../models/Order");

const getAllOrdersOfAllUsers = async (req, res) => {
  try {
    const orders = await Order.find({});

    if (!orders.length) {
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

const getOrderDetailsForAdmin = async (req, res) => {
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

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    const previousStatus = order.orderStatus;

    await Order.findByIdAndUpdate(id, { orderStatus });

    // ENTERPRISE FIX: Stock management based on status change
    const isRestockStatus = (status) => ['rejected', 'cancelled', 'returned'].includes(status.toLowerCase());
    const wasRestocked = isRestockStatus(previousStatus);
    const willBeRestocked = isRestockStatus(orderStatus);

    const Product = require("../../models/Product");

    if (!wasRestocked && willBeRestocked) {
      // Stock needs to be added back
      for (let item of order.cartItems) {
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { totalStock: item.quantity } }
        );
      }
    } else if (wasRestocked && !willBeRestocked) {
      // Stock needs to be deducted again
      for (let item of order.cartItems) {
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { totalStock: -item.quantity } }
        );
      }
    }

    res.status(200).json({
      success: true,
      message: "Order status is updated successfully!",
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
  getAllOrdersOfAllUsers,
  getOrderDetailsForAdmin,
  updateOrderStatus,
};
