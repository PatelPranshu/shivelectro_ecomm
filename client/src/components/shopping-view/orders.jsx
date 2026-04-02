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
    <Card className="border-none shadow-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-2xl font-bold tracking-tight">Order History</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        {orderList && orderList.length > 0 ? (
          <>
            {/* Desktop View - Table */}
            <div className="hidden md:block overflow-x-auto rounded-lg border">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="font-semibold text-black">Order ID</TableHead>
                    <TableHead className="font-semibold text-black">Order Date</TableHead>
                    <TableHead className="font-semibold text-black">Order Status</TableHead>
                    <TableHead className="font-semibold text-black">Order Price</TableHead>
                    <TableHead>
                      <span className="sr-only">Details</span>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderList.map((orderItem) => (
                    <TableRow key={orderItem._id} className="cursor-default">
                      <TableCell className="font-medium text-muted-foreground">#{orderItem?._id.slice(-6).toUpperCase()}</TableCell>
                      <TableCell>{new Date(orderItem?.orderDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge
                          className={`py-1 px-3 ${
                            orderItem?.orderStatus === "Confirmed"
                              ? "bg-green-500 hover:bg-green-600"
                              : orderItem?.orderStatus === "Rejected"
                              ? "bg-red-600 hover:bg-red-700"
                              : "bg-black hover:bg-black/80"
                          }`}
                        >
                          {orderItem?.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">₹{orderItem?.totalAmount.toFixed(2)}</TableCell>
                      <TableCell className="text-right">
                        <Dialog
                          open={selectedOrderId === orderItem._id}
                          onOpenChange={() => {
                            setSelectedOrderId(null);
                            dispatch(resetOrderDetails());
                          }}
                        >
                          <Button variant="outline" size="sm" onClick={() => handleFetchOrderDetails(orderItem?._id)}>
                            View Details
                          </Button>
                          <ShoppingOrderDetailsView orderDetails={orderDetails} />
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Mobile View - Cards */}
            <div className="flex md:hidden flex-col gap-4">
              {orderList.map((orderItem) => (
                <Card key={orderItem._id} className="overflow-hidden border shadow-sm">
                  <CardContent className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-center border-b pb-3">
                      <div>
                        <p className="text-sm text-muted-foreground">Order ID</p>
                        <p className="font-bold">#{orderItem?._id.slice(-6).toUpperCase()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="font-bold text-primary">₹{orderItem?.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-medium">{new Date(orderItem?.orderDate).toLocaleDateString()}</p>
                      <Badge
                        className={`py-0.5 px-2 text-xs ${
                          orderItem?.orderStatus === "Confirmed"
                            ? "bg-green-500 border-green-500 text-white"
                            : orderItem?.orderStatus === "Rejected"
                            ? "bg-red-600 border-red-600 text-white"
                            : "bg-black text-white"
                        }`}
                      >
                        {orderItem?.orderStatus}
                      </Badge>
                    </div>
                    <div className="pt-2 mt-1">
                      <Dialog
                          open={selectedOrderId === orderItem._id}
                          onOpenChange={() => {
                            setSelectedOrderId(null);
                            dispatch(resetOrderDetails());
                          }}
                        >
                          <Button variant="outline" className="w-full" onClick={() => handleFetchOrderDetails(orderItem?._id)}>
                            View Order Details
                          </Button>
                          <ShoppingOrderDetailsView orderDetails={orderDetails} />
                        </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4 border rounded-lg bg-muted/10">
            <h3 className="text-lg font-bold mb-2">No Orders Found</h3>
            <p className="text-muted-foreground text-center">You haven't placed any orders yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ShoppingOrders;