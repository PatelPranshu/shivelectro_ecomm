import { StarIcon, ArrowLeft, Minus, Plus, ShoppingCart, Heart, Truck, ShieldCheck, Banknote, RefreshCcw, Lock } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProductDetails, setProductDetails } from "@/store/shop/products-slice";
import StarRatingComponent from "@/components/common/star-rating";
import { useEffect, useMemo, useState } from "react";
import { addReview, getReviews } from "@/store/shop/review-slice";
import { Skeleton } from "@/components/ui/skeleton";
import SEO from "@/components/common/SEO";
import { getOptimizedImageUrl } from "@/lib/cloudinary-url";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Helper to unescape HTML entities if the server mistakenly escaped them
const unescapeHTML = (str) => {
  if (!str) return "";
  return str
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&amp;/g, "&");
};

function ProductDetailsPage() {
  const { id } = useParams();
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { productDetails, isLoading } = useSelector((state) => state.shopProducts);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { reviews } = useSelector((state) => state.shopReview);
  const { config: siteConfig } = useSelector((state) => state.siteConfig);
  const { categoryOptionsMap, brandOptionsMap } = useSelector((state) => state.taxonomy);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
    // Cleanup on unmount
    return () => {
      dispatch(setProductDetails());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (productDetails && productDetails._id) {
      dispatch(getReviews(productDetails._id));
    }
  }, [productDetails, dispatch]);

  function handleRatingChange(getRating) {
    setRating(getRating);
  }

  function handleAddToCart(getCurrentProductId, getTotalStock) {
    if (!isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to log in to add items to your cart.",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }
    let getCartItems = cartItems?.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getExistingQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getExistingQuantity + quantity > getTotalStock) {
          toast({
            title: `Only ${getTotalStock - getExistingQuantity} more can be added for this item`,
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
        quantity: quantity,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
        setQuantity(1); // Reset after adding
      }
    });
  }

  function handleAddReview() {
    dispatch(
      addReview({
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        setRating(0);
        setReviewMsg("");
        dispatch(getReviews(productDetails?._id));
        toast({
          title: "Review added successfully!",
        });
      } else {
        toast({
          title: "Could not add review",
          description: data?.payload?.message || "You may need to purchase this item first.",
          variant: "destructive",
        });
      }
    });
  }

  function handleFilterClick(filterType, filterValue) {
    const filterObj = { [filterType]: [filterValue] };
    sessionStorage.setItem("filters", JSON.stringify(filterObj));
    navigate("/shop/listing");
  }

  const averageReview =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  // Build Product JSON-LD schema for Rich Snippets
  const productJsonLd = useMemo(() => {
    if (!productDetails) return null;

    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: productDetails.title,
      image: productDetails.image,
      description: productDetails.description
        ? productDetails.description.substring(0, 300)
        : "",
      brand: {
        "@type": "Brand",
        name: "Samrat",
      },
      offers: {
        "@type": "Offer",
        url: `https://www.shivelectro.com/shop/product/${id}`,
        priceCurrency: "INR",
        price: productDetails.salePrice > 0
          ? productDetails.salePrice.toString()
          : productDetails.price
          ? productDetails.price.toString()
          : "0",
        availability:
          productDetails.totalStock > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        seller: {
          "@type": "Organization",
          name: "Shiv Electronics",
        },
      },
    };

    if (reviews && reviews.length > 0) {
      schema.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: averageReview.toFixed(1),
        reviewCount: reviews.length.toString(),
      };
    }

    return schema;
  }, [productDetails, reviews, averageReview, id]);

  const metaDescription = productDetails?.description
    ? productDetails.description.replace(/[#*_`]/g, "").substring(0, 155) + "..."
    : "Shop premium electrical safety products from Shiv Electronics (Samrat®).";

  if (isLoading || !productDetails) {
    return (
      <div className="flex items-center justify-center min-h-[70vh] w-full">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <SEO
        title={productDetails?.title}
        description={metaDescription}
        canonicalUrl={`/shop/product/${id}`}
        ogImage={productDetails?.image}
        ogType="product"
        jsonLd={productJsonLd}
      />
      
      {/* Breadcrumb / Back button */}
      <div className="mb-6 flex flex-wrap items-center gap-y-2 text-sm text-muted-foreground">
        <Button variant="link" onClick={() => navigate(-1)} className="px-0 h-auto text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <span className="mx-2">/</span>
        <span>{categoryOptionsMap[productDetails?.category] || "Category"}</span>
        <span className="mx-2">/</span>
        <span className="text-foreground font-medium truncate">{productDetails?.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 items-start mb-16">
        {/* Left: Product Image Section */}
        <div className="sticky top-24 flex flex-col gap-4">
          <div className="relative overflow-hidden rounded-xl bg-[#f4f7fa] flex items-center justify-center p-0 sm:p-2 aspect-square border">
            <img
              src={getOptimizedImageUrl(productDetails?.image, 800)}
              alt={productDetails?.title || "Product image"}
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>
          {/* Optional thumbnails row can go here if multiple images are added later */}
        </div>

        {/* Right: Product Details Section */}
        <div className="flex flex-col pt-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground mb-3">
            {productDetails?.title}
          </h1>

          <div className="flex flex-wrap gap-2 mb-6 mt-1">
            {productDetails?.category && (
              <span
                onClick={() => handleFilterClick('category', productDetails.category)}
                className="cursor-pointer bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold hover:bg-primary hover:text-primary-foreground transition-colors border border-primary/20"
              >
                {categoryOptionsMap[productDetails?.category] || productDetails?.category}
              </span>
            )}
            {productDetails?.brand && (
              <span
                onClick={() => handleFilterClick('brand', productDetails.brand)}
                className="cursor-pointer bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-semibold hover:bg-secondary/80 transition-colors border"
              >
                {brandOptionsMap[productDetails?.brand] || productDetails?.brand}
              </span>
            )}
          </div>

          {siteConfig?.showPrice && (
            <div className="flex items-end gap-3 mb-4">
              {productDetails?.salePrice > 0 ? (
                <>
                  <p className="text-3xl font-bold text-foreground">₹{productDetails?.salePrice}</p>
                  <p className="text-xl font-medium text-muted-foreground line-through mb-1">
                    ₹{productDetails?.price}
                  </p>
                </>
              ) : (
                <p className="text-3xl font-bold text-foreground">₹{productDetails?.price}</p>
              )}
            </div>
          )}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-8 border-b">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <StarRatingComponent rating={averageReview} />
              </div>
              <span className="text-muted-foreground text-sm font-medium">
                ({reviews?.length || 0} Reviews)
              </span>
            </div>
            {siteConfig?.showAddToCart && (
              <div className="text-sm font-semibold bg-muted/50 px-3 py-1 rounded-full w-fit">
                Stock Available: <span className={productDetails?.totalStock > 0 ? "text-green-600" : "text-destructive"}>{productDetails?.totalStock}</span>
              </div>
            )}
          </div>

          {/* Quantity Selector */}
          {siteConfig?.showAddToCart && (
            <div className="mb-8">
              <h3 className="text-sm font-semibold mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md h-11">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-full rounded-none rounded-l-md px-3 hover:bg-muted"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <div className="w-12 text-center font-medium text-sm flex items-center justify-center">
                    {quantity}
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-full rounded-none rounded-r-md px-3 hover:bg-muted"
                    disabled={quantity >= (productDetails?.totalStock || 1)}
                    onClick={() => setQuantity(q => Math.min(productDetails?.totalStock, q + 1))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {siteConfig?.showAddToCart && (
              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <Button
                  variant="outline"
                  size="lg"
                  className="flex-1 h-12 text-base font-medium"
                  disabled={productDetails?.totalStock === 0}
                  onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}
                >
                  Add to Cart <ShoppingCart className="w-4 h-4 ml-2" />
                </Button>
                {siteConfig?.showCheckout && (
                  <Button
                    size="lg"
                    className="flex-1 h-12 text-base font-bold shadow-md"
                    disabled={productDetails?.totalStock === 0}
                    onClick={() => {
                      handleAddToCart(productDetails?._id, productDetails?.totalStock);
                      if (productDetails?.totalStock > 0 && isAuthenticated) {
                        navigate("/shop/checkout");
                      }
                    }}
                  >
                    {productDetails?.totalStock === 0 ? "Out of Stock" : "Buy Now"}
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Feature Badges */}
          {siteConfig?.showProductFeatures !== false && (productDetails?.freeDelivery || productDetails?.warranty || productDetails?.cashOnDelivery || productDetails?.returnPolicy || productDetails?.secureTransaction) && (
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-8 mt-8 py-6 border-t border-b">
              {productDetails?.freeDelivery && (
                <div className="flex flex-col items-center justify-start text-center gap-2 max-w-[80px]">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                    <Truck className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium leading-tight text-muted-foreground">Free Delivery</span>
                </div>
              )}
              {productDetails?.warranty && (
                <div className="flex flex-col items-center justify-start text-center gap-2 max-w-[80px]">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                    <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium leading-tight text-muted-foreground">
                    {/^\d+$/.test(productDetails.warranty.trim()) ? `${productDetails.warranty.trim()} Year Warranty` : productDetails.warranty}
                  </span>
                </div>
              )}
              {productDetails?.cashOnDelivery && (
                <div className="flex flex-col items-center justify-start text-center gap-2 max-w-[80px]">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                    <Banknote className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium leading-tight text-muted-foreground">Cash on Delivery</span>
                </div>
              )}
              {productDetails?.returnPolicy && (
                <div className="flex flex-col items-center justify-start text-center gap-2 max-w-[80px]">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                    <RefreshCcw className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium leading-tight text-muted-foreground">
                    {/^\d+$/.test(productDetails.returnPolicy.trim()) ? `${productDetails.returnPolicy.trim()} Days Return` : productDetails.returnPolicy}
                  </span>
                </div>
              )}
              {productDetails?.secureTransaction && (
                <div className="flex flex-col items-center justify-start text-center gap-2 max-w-[80px]">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary">
                    <Lock className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <span className="text-[10px] sm:text-xs font-medium leading-tight text-muted-foreground">Secure Transaction</span>
                </div>
              )}
            </div>
          )}

          <p className="text-center text-xs text-muted-foreground mt-6">
            Any problem with this product? <a href="#contact" className="font-semibold text-foreground underline hover:text-primary">Report Product</a>
          </p>
        </div>
      </div>

      {/* Tabs Section for Description, Specification, Reviews */}
      <div className="mt-12 pt-8 border-t">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="w-full justify-start border-b h-auto p-0 bg-transparent rounded-none gap-8 overflow-x-auto flex-nowrap">
            <TabsTrigger 
              value="description" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent px-0 py-3 font-semibold text-base"
            >
              Description
            </TabsTrigger>
            <TabsTrigger 
              value="specification" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent px-0 py-3 font-semibold text-base"
            >
              Product Specification
            </TabsTrigger>
            <TabsTrigger 
              value="otherDetails" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent px-0 py-3 font-semibold text-base"
            >
              Other Details
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:shadow-none data-[state=active]:bg-transparent px-0 py-3 font-semibold text-base"
            >
              Reviews ({reviews?.length || 0})
            </TabsTrigger>
          </TabsList>
          
          <div className="py-8">
            <TabsContent value="description" className="mt-0 outline-none">
              <div
                className="prose prose-sm sm:prose-base max-w-none break-words whitespace-pre-wrap overflow-hidden text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-foreground [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-primary [&_a]:underline"
                dangerouslySetInnerHTML={{
                  __html: unescapeHTML(productDetails?.description),
                }}
              />
            </TabsContent>
            
            <TabsContent value="specification" className="mt-0 outline-none">
              {productDetails?.specifications ? (
                <div
                  className="prose prose-sm sm:prose-base max-w-none break-words whitespace-pre-wrap overflow-hidden text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-foreground [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-primary [&_a]:underline"
                  dangerouslySetInnerHTML={{
                    __html: unescapeHTML(productDetails.specifications),
                  }}
                />
              ) : (
                <p className="text-muted-foreground italic">No specifications provided.</p>
              )}
            </TabsContent>
            
            <TabsContent value="otherDetails" className="mt-0 outline-none">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mb-8">
                <div>
                  <h3 className="font-bold text-lg mb-4">Key Features</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Model: {productDetails?.title}</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Category: {categoryOptionsMap[productDetails?.category] || "General"}</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Brand: {brandOptionsMap[productDetails?.brand] || "Samrat"}</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Reliable performance and durability</li>
                  </ul>
                </div>
              </div>
              
              {productDetails?.otherDetails && (
                <div
                  className="prose prose-sm sm:prose-base max-w-none break-words whitespace-pre-wrap overflow-hidden text-muted-foreground [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:mb-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-foreground [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-foreground [&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-foreground [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-primary [&_a]:underline"
                  dangerouslySetInnerHTML={{
                    __html: unescapeHTML(productDetails.otherDetails),
                  }}
                />
              )}
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-0 outline-none">
              {siteConfig?.showReviews ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2">
                    <h3 className="font-bold text-xl mb-6">Customer Reviews</h3>
                    <div className="flex flex-col gap-6">
                      {reviews && reviews.length > 0 ? (
                        reviews.map((reviewItem) => (
                          <div className="flex gap-4 border-b pb-6 last:border-0" key={reviewItem._id}>
                            <Avatar className="w-12 h-12 border">
                              <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                {reviewItem?.userName[0].toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1.5 flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold">{reviewItem?.userName}</h4>
                                <span className="text-xs text-muted-foreground">Verified Purchase</span>
                              </div>
                              <div className="flex items-center gap-0.5 mb-1">
                                <StarRatingComponent rating={reviewItem?.reviewValue} />
                              </div>
                              <p className="text-muted-foreground text-sm leading-relaxed">
                                {reviewItem.reviewMessage}
                              </p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 rounded-xl p-6 border h-fit">
                    <h3 className="font-bold text-lg mb-4">Write a review</h3>
                    <div className="flex-col flex gap-4">
                      <div>
                        <Label className="mb-2 block text-sm text-muted-foreground">Rating</Label>
                        <div className="flex gap-1">
                          <StarRatingComponent
                            rating={rating}
                            handleRatingChange={handleRatingChange}
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="mb-2 block text-sm text-muted-foreground">Review</Label>
                        <Input
                          name="reviewMsg"
                          value={reviewMsg}
                          onChange={(event) => setReviewMsg(event.target.value)}
                          placeholder="What did you like or dislike?"
                          className="bg-white"
                        />
                      </div>
                      <Button
                        onClick={handleAddReview}
                        disabled={reviewMsg.trim() === "" || rating === 0}
                        className="w-full mt-2"
                      >
                        Submit Review
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Reviews are currently disabled.</p>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
