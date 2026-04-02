import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import { useSelector } from "react-redux";
import { MapPin, Package } from "lucide-react";

function ShoppingAccount() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-primary/5 border-b mt-[60px] md:mt-2">
        <div className="container mx-auto px-4 py-8 max-w-7xl flex items-center gap-5">
          <div className="h-16 w-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold shadow-md">
            {user?.userName?.[0]?.toUpperCase()}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Hello, {user?.userName}</h1>
            <p className="text-muted-foreground font-medium">{user?.email}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Tabs defaultValue="orders" className="flex flex-col md:flex-row gap-8">
          <TabsList className="flex md:flex-col justify-start h-auto bg-transparent p-0 w-full md:w-64 gap-2 border-b md:border-b-0 overflow-x-auto md:overflow-visible flex-nowrap shrink-0">
            <TabsTrigger 
              value="orders" 
              className="px-4 py-3 justify-start text-base data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 md:data-[state=active]:border-b-0 md:data-[state=active]:border-r-2 border-transparent data-[state=active]:border-primary rounded-none font-semibold flex gap-2 items-center whitespace-nowrap transition-colors"
            >
              <Package className="w-5 h-5 shrink-0" />
              Order History
            </TabsTrigger>
            <TabsTrigger 
              value="address" 
              className="px-4 py-3 justify-start text-base data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=active]:border-b-2 md:data-[state=active]:border-b-0 md:data-[state=active]:border-r-2 border-transparent data-[state=active]:border-primary rounded-none font-semibold flex gap-2 items-center whitespace-nowrap transition-colors"
            >
              <MapPin className="w-5 h-5 shrink-0" />
              Shipping Addresses
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 w-full max-w-full overflow-hidden">
            <TabsContent value="orders" className="m-0 border-none outline-none">
              <ShoppingOrders />
            </TabsContent>
            <TabsContent value="address" className="m-0 border-none outline-none">
              <Address />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default ShoppingAccount;