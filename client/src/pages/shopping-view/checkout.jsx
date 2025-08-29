import Address from "@/components/shopping-view/address";
import { useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
// We no longer need the Razorpay logic in this file

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  // This function is now much simpler
  function handleCheckout() {
    if (!cartItems?.items || cartItems.items.length === 0) {
      toast({ title: "Your cart is empty.", variant: "destructive" });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({ title: "Please select an address.", variant: "destructive" });
      return;
    }

    // 1. Create the payload of order details
    const orderPayload = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((item) => ({
        productId: item?.productId,
        title: item?.title,
        image: item?.image,
        price: item?.salePrice > 0 ? item?.salePrice : item?.price,
        quantity: item?.quantity,
      })),
      addressInfo: { ...currentSelectedAddress },
      totalAmount: totalCartAmount,
    };

    // 2. Navigate to the new payment page, passing the data via state
    navigate('/shop/payment', { 
      state: { 
        orderPayload, 
        totalCartAmount 
      } 
    });
  }

  return (
    <div className="flex flex-col">
      <div className="w-full text-center mt-4">
        <h1 className="text-2xl font-bold ml">Checkout</h1>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent key={item.productId} cartItem={item} />
              ))
            : <p>Your cart is empty.</p>}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">₹{totalCartAmount.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            {/* The button text is updated to reflect the next step */}
            <Button onClick={handleCheckout} className="w-full">
              Proceed to Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;