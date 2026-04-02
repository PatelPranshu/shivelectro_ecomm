import { useSelector } from "react-redux";
import { Badge } from "../ui/badge";
import {
  DialogContent,
  DialogTitle,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { MapPin, Phone, CreditCard, Calendar, ShoppingBag } from "lucide-react";

function ShoppingOrderDetailsView({ orderDetails }) {
  const { user } = useSelector((state) => state.auth);

  if (!orderDetails) {
    return null;
  }

  return (
    <DialogContent 
      className="sm:max-w-[650px] w-[95vw] h-[90vh] sm:h-auto sm:max-h-[85vh] flex flex-col p-0 overflow-hidden rounded-xl border-0 shadow-2xl"
      onOpenAutoFocus={(e) => e.preventDefault()}
      aria-describedby="order-details-description"
    >
      {/* Sticky Header */}
      <div className="px-6 py-5 border-b bg-primary/5 flex flex-col gap-1 sticky top-0 shrink-0 z-10">
        <div className="flex items-center justify-between">
          <DialogTitle className="text-xl sm:text-2xl font-extrabold flex items-center gap-2">
            Order #{orderDetails?._id.slice(-8).toUpperCase()}
          </DialogTitle>
        </div>
        <p id="order-details-description" className="text-sm text-muted-foreground flex items-center gap-1.5 font-medium mt-1">
          <Calendar className="w-4 h-4" /> 
          Placed on {new Date(orderDetails.orderDate).toLocaleDateString()}
        </p>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-background space-y-6 sm:space-y-8">
        {/* Order Status */}
        <div className="bg-muted/10 border rounded-lg p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">Order Status</span>
          </div>
          <Badge
            className={`py-1 px-4 text-sm shadow-sm ${
              orderDetails?.orderStatus === "Confirmed"
                ? "bg-green-500 hover:bg-green-600"
                : orderDetails?.orderStatus === "Rejected"
                ? "bg-red-600 hover:bg-red-700"
                : "bg-black"
            }`}
          >
            {orderDetails?.orderStatus}
          </Badge>
        </div>

        {/* Order Items */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b">
            <ShoppingBag className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">Purchased Items</h3>
          </div>
          <div className="grid gap-3">
            {orderDetails?.cartItems?.map((item) => (
              <div key={item.productId} className="flex gap-4 p-3 rounded-lg border bg-card transition-all hover:shadow-md">
                {item.image ? (
                  <div className="w-20 h-20 shrink-0 rounded-md border bg-white overflow-hidden flex items-center justify-center p-1">
                    <img src={item.image} alt={item.title} className="max-w-full max-h-full object-contain" />
                  </div>
                ) : (
                  <div className="w-20 h-20 shrink-0 rounded-md border bg-muted flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-muted-foreground opacity-50" />
                  </div>
                )}
                <div className="flex flex-col flex-1 justify-between">
                  <span className="font-semibold text-sm sm:text-base line-clamp-2">{item.title}</span>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-muted-foreground font-medium">Qty: {item.quantity}</span>
                    <span className="font-bold text-base">₹{(Number(item.price) * Number(item.quantity)).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Info Grid (Payment & Shipping) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Shipping Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <MapPin className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">Shipping Info</h3>
            </div>
            <div className="text-sm space-y-1.5 text-muted-foreground">
              <p className="font-bold text-foreground text-base capitalize">{user?.userName}</p>
              <p className="leading-relaxed">{orderDetails?.addressInfo?.address}</p>
              <p>{orderDetails?.addressInfo?.city} - <span className="font-medium text-foreground">{orderDetails?.addressInfo?.pincode}</span></p>
              <p className="flex items-center gap-2 pt-2 font-medium text-foreground">
                <Phone className="w-4 h-4 text-primary" />
                {orderDetails?.addressInfo?.phone}
              </p>
              {orderDetails?.addressInfo?.notes && (
                <div className="mt-3 p-3 bg-muted/30 rounded-md border text-xs">
                  <strong className="text-foreground">Note:</strong> {orderDetails?.addressInfo?.notes}
                </div>
              )}
            </div>
          </div>

          {/* Payment Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b">
              <CreditCard className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-lg">Payment Info</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center bg-muted/10 p-3 rounded border">
                <span className="text-sm text-muted-foreground font-medium">Method</span>
                <span className="font-bold uppercase tracking-wider text-sm">{orderDetails?.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center bg-muted/10 p-3 rounded border">
                <span className="text-sm text-muted-foreground font-medium">Status</span>
                <span className="font-bold uppercase tracking-wider text-sm text-primary">{orderDetails?.paymentStatus}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Sticky Bottom Footer for Total */}
      <div className="p-4 sm:p-6 border-t bg-muted/5 sticky bottom-0 shrink-0 z-10 flex justify-between items-center">
        <span className="font-semibold text-muted-foreground text-base sm:text-lg">Total Amount Paid</span>
        <span className="font-extrabold text-xl sm:text-3xl text-primary drop-shadow-sm">
          ₹{Number(orderDetails?.totalAmount).toFixed(2)}
        </span>
      </div>

    </DialogContent>
  );
}

export default ShoppingOrderDetailsView;