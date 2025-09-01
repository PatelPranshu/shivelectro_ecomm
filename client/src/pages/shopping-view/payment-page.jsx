import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@/components/ui/use-toast";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/store/shop/order-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { Skeleton } from "@/components/ui/skeleton";

function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);

  const [status, setStatus] = useState("Processing...");
  const { orderPayload, totalCartAmount } = location.state || {};

  useEffect(() => {
    if (!orderPayload || !totalCartAmount) {
      navigate("/shop/checkout");
      return;
    }

    setStatus("Creating Razorpay order...");
    dispatch(createRazorpayOrder({ amount: totalCartAmount }))
      .then((action) => {
        if (!action.payload || !action.payload.id) {
          toast({ title: "Server error. Could not create order.", variant: "destructive" });
          navigate("/shop/checkout");
          return;
        }

        const razorpayOrder = action.payload;
        setStatus("Waiting for payment...");

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Shivelectro",
          description: "Final step of your purchase",
          order_id: razorpayOrder.id,
          handler: function (response) {
            setStatus("Verifying payment...");
            dispatch(verifyRazorpayPayment({ ...response, orderPayload }))
              .then((verificationAction) => {
                if (verificationAction?.payload?.success) {
                  toast({ title: "Payment Successful!" });
                  dispatch(fetchCartItems(user?.id));
                  navigate('/shop/payment-success');
                } else {
                  toast({ title: "Payment Verification Failed.", variant: "destructive" });
                  navigate("/shop/checkout");
                }
              });
          },
          modal: {
            ondismiss: function () {
              toast({ title: "Payment Canceled", description: "You can try again from the checkout page.", variant: "destructive" });
              navigate("/shop/checkout");
            }
          },
          prefill: { name: user?.name, email: user?.email },
          theme: { color: "#e30045" }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      });
  }, [dispatch, navigate, toast, orderPayload, totalCartAmount, user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Skeleton className="w-96 h-48" />
      <h2 className="text-2xl font-bold mt-4">Secure Payment Page</h2>
      <p className="text-muted-foreground mt-2">{status}</p>
      <p className="mt-1">Please do not refresh or close this page.</p>
    </div>
  );
}

export default PaymentPage;