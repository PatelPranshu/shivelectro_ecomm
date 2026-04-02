import Address from "@/components/shopping-view/address";
import { useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

    navigate('/shop/payment', { 
      state: { 
        orderPayload, 
        totalCartAmount 
      } 
    });
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-col mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Checkout</h1>
        <p className="text-muted-foreground">Complete your order details below to securely finalize your purchase.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column - Main Flow */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-8">
          
          {/* Step 1: Items */}
          <Card className="shadow-sm border-muted">
            <CardHeader className="bg-muted/10 border-b pb-4">
              <CardTitle className="text-xl">1. Review Your Items</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col gap-5">
                {cartItems && cartItems.items && cartItems.items.length > 0
                  ? cartItems.items.map((item) => (
                      <UserCartItemsContent key={item.productId} cartItem={item} />
                    ))
                  : (
                    <div className="text-center py-8 bg-muted/20 rounded-lg">
                      <p className="text-muted-foreground font-medium">Your cart is empty.</p>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>

          {/* Step 2: Address */}
          <div>
            <h2 className="text-xl font-bold mb-4">2. Shipping Address</h2>
            <Address
              selectedId={currentSelectedAddress}
              setCurrentSelectedAddress={setCurrentSelectedAddress}
            />
          </div>
        </div>
        
        {/* Right Column - Order Summary Block */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-24">
          <Card className="shadow-md border-muted">
            <CardHeader className="bg-muted/10 border-b pb-4">
              <CardTitle className="text-xl">3. Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              
              <div className="space-y-4 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-muted-foreground text-lg">Total Amount</span>
                  <span className="font-extrabold text-2xl text-primary">₹{totalCartAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-8 w-full">
                <Button 
                  onClick={handleCheckout} 
                  className="w-full shadow-md transition-transform active:scale-[0.98] text-lg py-6"
                >
                  Proceed to Secure Payment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;