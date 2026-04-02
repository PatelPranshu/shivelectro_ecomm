import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, PackageOpen, HelpCircle } from "lucide-react";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  useEffect(() => {
    if (keyword && keyword.trim() !== "" && keyword.trim().length > 2) {
      const delayDebounceFn = setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        dispatch(getSearchResults(keyword));
      }, 500);

      return () => clearTimeout(delayDebounceFn);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword, dispatch, setSearchParams]);

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    if (!isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to log in to add items to your cart.",
        variant: "destructive",
      });
      navigate('/auth/login');
      return;
    }

    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    navigate(`/shop/product/${getCurrentProductId}`);
  }

  return (
    <div className="container mx-auto md:px-6 px-4 py-10 min-h-screen flex flex-col">
      {/* Search Header */}
      <div className="flex flex-col items-center justify-center mb-10 w-full max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Discover Products</h1>
          <p className="text-muted-foreground text-sm md:text-base">Find precisely what you need across our massive catalog.</p>
        </div>
        
        {/* Search Bar Container */}
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-muted-foreground group-focus-within:text-primary transition-colors">
            <Search className="w-6 h-6" />
          </div>
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="py-7 pl-14 pr-4 w-full text-lg shadow-sm border-2 focus-visible:ring-0 focus-visible:border-primary rounded-full transition-all bg-white"
            placeholder="Search for accessories, devices..."
            autoFocus
          />
        </div>
      </div>

      {/* States */}
      <div className="flex-1 flex flex-col">
        {!keyword || keyword.trim() === "" ? (
          /* Initial State */
          <div className="flex flex-col items-center justify-center flex-1 text-center opacity-60 mt-10">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
              <PackageOpen className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Ready to search</h2>
            <p className="text-muted-foreground mt-2 max-w-sm">Type a keyword above. We'll start fetching the best matches instantly.</p>
          </div>
        ) : !searchResults.length && keyword.trim().length > 2 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center flex-1 text-center mt-10 animate-in fade-in zoom-in-95 duration-300">
            <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
              <HelpCircle className="w-10 h-10 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight">No results found</h2>
            <p className="text-muted-foreground mt-2 max-w-sm">
              We couldn't find anything matching <span className="font-semibold text-foreground">"{keyword}"</span>.
              Try checking your spelling or using more general terms.
            </p>
          </div>
        ) : (
          /* Data State */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 animate-in slide-in-from-bottom-4 fade-in duration-500">
            {searchResults.map((item) => (
              <ShoppingProductTile
                key={item.id || item._id}
                handleAddtoCart={handleAddtoCart}
                product={item}
                handleGetProductDetails={handleGetProductDetails}
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default SearchProducts;
