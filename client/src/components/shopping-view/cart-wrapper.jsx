import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { SheetContent, SheetHeader, SheetTitle, SheetDescription } from "../ui/sheet";
import UserCartItemsContent from "./cart-items-content";
import { useSelector } from "react-redux";

function UserCartWrapper({ cartItems, setOpenCartSheet }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handleCheckout() {
    setOpenCartSheet(false); // Close the cart first

    // Check if the user is logged in
    if (isAuthenticated) {
      navigate("/shop/checkout"); // If yes, proceed to checkout
    } else {
      navigate("/auth/login"); // If no, redirect to the login page
    }
  }

  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
                <SheetDescription>
            Review items in your cart. You can checkout when you're ready.
        </SheetDescription>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems && cartItems.length > 0
          ? cartItems.map((item) => <UserCartItemsContent key={item.productId} cartItem={item} />)
          : null}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">₹{totalCartAmount}</span>
        </div>
      </div>
      <Button
        // ✅ 4. USE the new handler function
        onClick={handleCheckout}
        className="w-full mt-6"
        disabled={!cartItems || cartItems.length === 0}
      >
        Checkout
      </Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
