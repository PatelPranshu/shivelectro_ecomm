import { Route, Routes, useNavigate, useLocation } from "react-router-dom";
import { lazy, Suspense } from "react";
import ShoppingLayout from "./components/shopping-view/layout";
import CheckAuth from "./components/common/check-auth";
import NotFound from "./pages/not-found";
import UnauthPage from "./pages/unauth-page";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth, logoutUser } from "./store/auth-slice";
import { fetchSiteConfig } from "./store/common-slice/site-config-slice";
import { fetchTaxonomy } from "./store/common-slice/taxonomy-slice";

// ─── Lazy-loaded: Admin pages (never needed for shopping users) ──────────────
const AdminLayout = lazy(() => import("./components/admin-view/layout"));
const AdminDashboard = lazy(() => import("./pages/admin-view/dashboard"));
const AdminProducts = lazy(() => import("./pages/admin-view/products"));
const AdminOrders = lazy(() => import("./pages/admin-view/orders"));
const AdminFeatures = lazy(() => import("./pages/admin-view/features"));
const AdminModes = lazy(() => import("./pages/admin-view/modes"));

// ─── Lazy-loaded: Auth pages (only when logging in) ─────────────────────────
const AuthLayout = lazy(() => import("./components/auth/layout"));
const AuthLogin = lazy(() => import("./pages/auth/login"));
const AuthRegister = lazy(() => import("./pages/auth/register"));

// ─── Lazy-loaded: Secondary shopping pages (not on initial landing) ──────────
const ShoppingCheckout = lazy(() => import("./pages/shopping-view/checkout"));
const PaymentPage = lazy(() => import("./pages/shopping-view/payment-page"));
const ShoppingAccount = lazy(() => import("./pages/shopping-view/account"));
const PaymentSuccessPage = lazy(() => import("./pages/shopping-view/payment-success"));
const SearchProducts = lazy(() => import("./pages/shopping-view/search"));
const ProductDetailsPage = lazy(() => import("./pages/shopping-view/product-details"));
const PrivacyPolicyPage = lazy(() => import("./pages/shopping-view/privacy-policy"));
const TermsConditionsPage = lazy(() => import("./pages/shopping-view/terms-conditions"));

// ─── Shared loading spinner ──────────────────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-white">
      <div className="loader"></div>
    </div>
  );
}

function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const { config: siteConfig } = useSelector((state) => state.siteConfig);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    dispatch(checkAuth());
    dispatch(fetchSiteConfig());
    dispatch(fetchTaxonomy());
  }, [dispatch]);

  // Auto-logout non-admin users if login or registration is disabled
  useEffect(() => {
    if (isAuthenticated && user?.role !== "admin" && siteConfig) {
      if (!siteConfig.showLogin || !siteConfig.showRegistration) {
        dispatch(logoutUser());
      }
    }
  }, [siteConfig, isAuthenticated, user, dispatch]);

  // Route guards based on site config
  useEffect(() => {
    if (siteConfig) {
      const path = location.pathname;
      if (path.includes("/checkout") && !siteConfig.showCheckout) {
        navigate("/shop/home");
      }
      if (path.includes("/search") && !siteConfig.showSearch) {
        navigate("/shop/home");
      }
      if (path.includes("/register") && !siteConfig.showRegistration) {
        navigate("/auth/login");
      }
    }
  }, [siteConfig, location.pathname, navigate]);

  if (isLoading) return <PageLoader />;


  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route
            path="/"
            element={
              <CheckAuth
                isAuthenticated={isAuthenticated}
                user={user}
              ></CheckAuth>
            }
          />
          <Route
            path="/auth"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AuthLayout />
              </CheckAuth>
            }
          >
            <Route path="login" element={<AuthLogin />} />
            <Route path="register" element={<AuthRegister />} />
          </Route>
          <Route
            path="/admin"
            element={
              <CheckAuth isAuthenticated={isAuthenticated} user={user}>
                <AdminLayout />
              </CheckAuth>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="features" element={<AdminFeatures />} />
            <Route path="modes" element={<AdminModes />} />
          </Route>
          <Route
            path="/shop"
            element={
                <ShoppingLayout />
            }
          >
            <Route path="home" element={<ShoppingHome />} />
            <Route path="listing" element={<ShoppingListing />} />
            <Route path="checkout" element={<ShoppingCheckout />} />
            <Route path="account" element={<ShoppingAccount />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="payment-success" element={<PaymentSuccessPage />} />
            <Route path="search" element={<SearchProducts />} />
            <Route path="product/:id" element={<ProductDetailsPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="terms-conditions" element={<TermsConditionsPage />} />
          </Route>
          <Route path="/unauth-page" element={<UnauthPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
