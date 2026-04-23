import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminSiteConfig,
  updateAdminSiteConfig,
} from "@/store/admin/modes-slice";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  CreditCard,
  Star,
  LogIn,
  UserPlus,
  Search,
  Tag,
  ShoppingBag,
} from "lucide-react";

// Toggle definitions with metadata
const FEATURE_TOGGLES = [
  {
    key: "showPrice",
    label: "Show Product Prices",
    description:
      "Display prices on product tiles, product details page, and cart. When disabled, prices are also hidden from API responses for security.",
    icon: Tag,
    category: "Products",
  },
  {
    key: "showAddToCart",
    label: "Add to Cart Button",
    description:
      'Show "Add to Cart" buttons on product tiles and product details page. When disabled, the server also blocks cart addition API calls.',
    icon: ShoppingBag,
    category: "Products",
  },
  {
    key: "showCart",
    label: "Shopping Cart",
    description:
      "Show the cart icon in the header and allow cart operations. When disabled, all cart API endpoints are blocked by the server.",
    icon: ShoppingCart,
    category: "Shopping",
  },
  {
    key: "showCheckout",
    label: "Checkout & Payment",
    description:
      'Show the "Checkout" button in the cart drawer. When disabled, users can still browse and add to cart but cannot proceed to checkout.',
    icon: CreditCard,
    category: "Shopping",
  },
  {
    key: "showReviews",
    label: "Customer Reviews",
    description:
      "Show the reviews section on product detail pages and allow users to submit reviews. When disabled, the review submission API is also blocked.",
    icon: Star,
    category: "Engagement",
  },
  {
    key: "showLogin",
    label: "Login Button",
    description:
      "Show the Login button in the header for non-authenticated users. Admin login is not affected.",
    icon: LogIn,
    category: "Authentication",
  },
  {
    key: "showRegistration",
    label: "User Registration",
    description:
      'Show the "Register" link on the login page. When disabled, the registration API is also blocked by the server.',
    icon: UserPlus,
    category: "Authentication",
  },
  {
    key: "showSearch",
    label: "Search",
    description:
      "Show the Search link in the navigation menu.",
    icon: Search,
    category: "Navigation",
  },
];

// Group toggles by category
const categories = [...new Set(FEATURE_TOGGLES.map((t) => t.category))];

function AdminModes() {
  const dispatch = useDispatch();
  const { siteConfig, isLoading } = useSelector((state) => state.adminModes);
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchAdminSiteConfig());
  }, [dispatch]);

  function handleToggle(key) {
    if (!siteConfig) return;

    const newValue = !siteConfig[key];
    const updatedConfig = { ...siteConfig, [key]: newValue };

    dispatch(updateAdminSiteConfig(updatedConfig)).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: newValue ? "Feature Enabled" : "Feature Disabled",
          description: data.payload.message,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update configuration.",
          variant: "destructive",
        });
      }
    });
  }

  if (isLoading && !siteConfig) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Site Modes</h1>
        <p className="text-muted-foreground mt-2">
          Control which features are visible and accessible on the storefront.
          Changes take effect immediately. All toggles are enforced on the
          server, so disabled features cannot be accessed even if the frontend
          is modified.
        </p>
      </div>

      <div className="space-y-8">
        {categories.map((category) => (
          <div key={category}>
            <h2 className="text-lg font-bold text-muted-foreground uppercase tracking-wide mb-4">
              {category}
            </h2>
            <Card className="shadow-sm">
              <CardContent className="p-0">
                {FEATURE_TOGGLES.filter((t) => t.category === category).map(
                  (toggle, index, arr) => {
                    const Icon = toggle.icon;
                    const isEnabled = siteConfig?.[toggle.key] ?? true;

                    return (
                      <div key={toggle.key}>
                        <div className="flex items-center justify-between p-5 hover:bg-muted/30 transition-colors">
                          <div className="flex items-start gap-4 flex-1 mr-4">
                            <div
                              className={`p-2.5 rounded-lg mt-0.5 ${
                                isEnabled
                                  ? "bg-primary/10 text-primary"
                                  : "bg-muted text-muted-foreground"
                              } transition-colors`}
                            >
                              <Icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-base">
                                {toggle.label}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                {toggle.description}
                              </p>
                            </div>
                          </div>

                          {/* Custom toggle switch */}
                          <button
                            onClick={() => handleToggle(toggle.key)}
                            disabled={isLoading}
                            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex-shrink-0 ${
                              isEnabled ? "bg-primary" : "bg-gray-300"
                            } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                            role="switch"
                            aria-checked={isEnabled}
                            aria-label={toggle.label}
                          >
                            <span
                              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                                isEnabled ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </div>
                        {index < arr.length - 1 && <Separator />}
                      </div>
                    );
                  }
                )}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-muted/30 rounded-lg border">
        <p className="text-sm text-muted-foreground">
          <strong>🔒 Security Note:</strong> All feature toggles are enforced
          at the server level. Even if someone modifies the frontend code, the
          backend will reject API requests for disabled features with a{" "}
          <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">
            403 Forbidden
          </code>{" "}
          response.
        </p>
      </div>
    </div>
  );
}

export default AdminModes;
