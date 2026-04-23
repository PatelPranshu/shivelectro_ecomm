import ProductFilter from "@/components/shopping-view/filter";
import SEO from "@/components/common/SEO";

import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { ArrowUpDownIcon, FilterIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useNavigate } from "react-router-dom";

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }


  return queryParams.join("&");
}

function ShoppingListing() {
  const dispatch = useDispatch();
  const { productList, productDetails, isLoading } = useSelector(
    (state) => state.shopProducts
  );
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const navigate = useNavigate();

  const categorySearchParam = searchParams.get("category");

  function handleSort(value) {
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  function handleGetProductDetails(getCurrentProductId) {
    navigate(`/shop/product/${getCurrentProductId}`);
  }

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
    let getCartItems = cartItems?.items || []; 

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

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, [categorySearchParam]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null)
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);




  return (
    <div className="mx-auto w-full md:px-6 md:py-8 max-w-screen-2xl">
      <SEO
        title="Shop All Products — ELCB, Timers, Overloads & More"
        description="Browse the full range of Samrat® electrical safety products — ELCB, ELCB+MCB, Overload Protectors, Timers, Mobile Operated Switches, Solar Fence Guards & more. Best prices with free shipping."
        canonicalUrl="/shop/listing"
      />
      {/* Mobile Sort and Filter Action Bar (Sticky at top) */}
      <div className="flex md:hidden sticky top-[64px] z-30 bg-background border-b shadow-sm">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex-1 rounded-none border-r h-12 flex items-center justify-center gap-2">
              <ArrowUpDownIcon className="h-4 w-4" />
              <span>Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-screen p-2" align="center" sideOffset={8}>
            <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
              {sortOptions.map((sortItem) => (
                <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id} className="py-3">
                  {sortItem.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="flex-1 rounded-none h-12 flex items-center justify-center gap-2">
              <FilterIcon className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] w-full p-0 flex flex-col" aria-describedby={undefined}>
            <SheetHeader className="p-4 border-b">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto w-full">
              <ProductFilter filters={filters} handleFilter={handleFilter} />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="py-2 md:px-0 md:py-0 grid grid-cols-1 md:grid-cols-[240px_1fr] gap-6 md:gap-8 items-start">
        <div className="hidden md:block">
          <ProductFilter filters={filters} handleFilter={handleFilter} />
        </div>
        <div className="bg-background w-full md:rounded-xl md:shadow-sm md:border">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList?.length} Products
            </span>
            <div className="hidden md:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <ArrowUpDownIcon className="h-4 w-4" />
                    <span>Sort by</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                    {sortOptions.map((sortItem) => (
                      <DropdownMenuRadioItem
                        value={sortItem.id}
                        key={sortItem.id}
                      >
                        {sortItem.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 p-2 md:p-4">
          {isLoading ? (
            <div className="col-span-full flex justify-center items-center h-[50vh]">
              <div className="loader"></div>
            </div>
          ) : (
            // If not loading, render the actual product tiles
            productList && productList.length > 0 ? (
              productList.map((productItem) => (
                <ShoppingProductTile
                  key={productItem._id}
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">
                No products found.
              </p>
            )
          )}
        </div>
      </div>
    </div>
    </div>
  );
}

export default ShoppingListing;
