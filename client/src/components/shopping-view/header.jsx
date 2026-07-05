import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { logoutUser } from "@/store/auth-slice";
import UserCartWrapper from "./cart-wrapper";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";

function MenuItems({ closeMenu }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { config: siteConfig } = useSelector((state) => state.siteConfig);

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters");
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "aboutus" &&
      getCurrentMenuItem.id !== "contact" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [getCurrentMenuItem.id],
          }
        : null;

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));

    if (location.pathname.includes("listing") && currentFilter !== null) {
      setSearchParams(new URLSearchParams(`?category=${getCurrentMenuItem.id}`));
    } else {
      navigate(getCurrentMenuItem.path);
    }
    
    if (closeMenu) closeMenu();
  }

  // Filter out search if showSearch is disabled
  const visibleMenuItems = shoppingViewHeaderMenuItems.filter((item) => {
    if (item.id === "search" && !siteConfig?.showSearch) return false;
    return true;
  });

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {visibleMenuItems.map((menuItem) => (
        <Link
          to={menuItem.path}
          onClick={(e) => {
            e.preventDefault();
            handleNavigate(menuItem);
          }}
          className="text-base font-medium hover:text-primary transition-colors"
          key={menuItem.id}
        >
          {menuItem.label}
        </Link>
      ))}
    </nav>
  );
}

function HeaderRightContent({ closeMenu }) {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { config: siteConfig } = useSelector((state) => state.siteConfig);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
    navigate("/shop/home");
    if (closeMenu) closeMenu();
  }

  useEffect(() => {
    if (isAuthenticated && user?.id && siteConfig?.showCart) {
      dispatch(fetchCartItems(user.id));
    }
  }, [dispatch, isAuthenticated, user, siteConfig?.showCart]);


  return (
    <div className="flex items-center flex-row gap-4">
     {isAuthenticated && siteConfig?.showCart && (
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
            {cartItems?.items?.length || 0}
          </span>
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>
     )}
      <div className="hidden lg:flex items-center gap-4">
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="bg-black cursor-pointer">
                <AvatarFallback className="bg-black text-white font-extrabold">
                  {user?.userName?.[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" className="w-56">
              <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => {
                navigate("/shop/account");
                if (closeMenu) closeMenu();
              }}>
                <UserCog className="mr-2 h-4 w-4" />
                Account
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={() => {
            navigate("/auth/login");
            if (closeMenu) closeMenu();
          }}>Login</Button>
        )}
      </div>
    </div>
  );
}

function ShoppingHeader({ hideRightContent = false }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { config: siteConfig } = useSelector((state) => state.siteConfig);
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex lg:flex-1 items-center">
          <Link to="/shop/home" className="flex items-center">
            <img src="/logo.png" alt="Shiv Electronics" className="h-10 w-auto" />
          </Link>
        </div>
        
        <div className="hidden lg:flex lg:flex-1 justify-center">
          <MenuItems />
        </div>

        <div className="flex lg:flex-1 items-center justify-end gap-4">
          {!hideRightContent && <HeaderRightContent />}
          <Sheet open={openSideMenu} onOpenChange={setOpenSideMenu}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle header menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs flex flex-col h-full" aria-describedby={undefined}>
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              
              <div className="flex-1 overflow-y-auto mt-6">
                <MenuItems closeMenu={() => setOpenSideMenu(false)} />
              </div>
              
              {!hideRightContent && (
                <div className="mt-auto border-t pt-4 flex flex-col gap-3 pb-8">
                  {isAuthenticated ? (
                    <>
                      <h3 className="text-xs font-bold uppercase text-muted-foreground px-2">Account Profile</h3>
                      <Button 
                        variant="ghost" 
                        className="justify-start gap-4 h-12"
                        onClick={() => {
                          setOpenSideMenu(false);
                          navigate("/shop/account");
                        }}
                      >
                        <Avatar className="h-7 w-7 bg-black">
                          <AvatarFallback className="bg-black text-white font-extrabold text-xs">
                            {user?.userName?.[0]?.toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span>My Account</span>
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="justify-start gap-4 mt-2 h-12"
                        onClick={() => {
                          dispatch(logoutUser());
                          setOpenSideMenu(false);
                          navigate("/shop/home");
                        }}
                      >
                        <LogOut className="h-5 w-5" />
                        Secure Logout
                      </Button>
                    </>
                  ) : (
                    <Button 
                      className="w-full h-12 mt-4"
                      onClick={() => {
                        setOpenSideMenu(false);
                        navigate("/auth/login");
                      }}
                    >
                      Login / Sign up
                    </Button>
                  )}
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
