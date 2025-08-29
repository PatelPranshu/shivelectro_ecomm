import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import ShoppingOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersByUserId,
  getOrderDetails,
  resetOrderDetails,
} from "@/store/shop/order-slice";
import { Badge } from "../ui/badge";

function ShoppingOrders() {
  // --- FIX 1 ---
  // Changed state to track the ID of the selected order, not just true/false.
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orderList, orderDetails } = useSelector((state) => state.shopOrder);

  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    if (user?.id) {
        dispatch(getAllOrdersByUserId(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    // --- FIX 2 ---
    // When orderDetails are fetched, set the selectedOrderId to open the correct dialog.
    if (orderDetails !== null) {
        setSelectedOrderId(orderDetails._id);
    }
  }, [orderDetails]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                  // --- FIX 3 ---
                  // Added the unique key prop to the TableRow.
                  <TableRow key={orderItem._id}>
                    <TableCell className="font-medium">#{orderItem?._id.slice(-6)}</TableCell>
                    <TableCell>{new Date(orderItem?.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${
                          orderItem?.orderStatus === "Confirmed"
                            ? "bg-green-500"
                            : orderItem?.orderStatus === "Rejected"
                            ? "bg-red-600"
                            : "bg-black"
                        }`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>₹{orderItem?.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Dialog
                        // --- FIX 4 ---
                        // Dialog is now open only if its ID matches the selected order.
                        open={selectedOrderId === orderItem._id}
                        onOpenChange={() => {
                          setSelectedOrderId(null); // Close the dialog
                          dispatch(resetOrderDetails()); // Reset details in Redux
                        }}
                      >
                        <Button
                          onClick={() =>
                            handleFetchOrderDetails(orderItem?._id)
                          }
                        >
                          View Details
                        </Button>
                        <ShoppingOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              : (
                <TableRow>
                    <TableCell colSpan="5" className="text-center">No orders found.</TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;