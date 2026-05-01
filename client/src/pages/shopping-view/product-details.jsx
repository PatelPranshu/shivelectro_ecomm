import { StarIcon, ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";
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

function ProductDetailsPage() {
  const { id } = useParams();
  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);
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
      "name": productDetails.title,
      "image": productDetails.image,
      "description": productDetails.description
        ? productDetails.description.substring(0, 300)
        : "",
      "brand": {
        "@type": "Brand",
        "name": "Samrat"
      },
      "offers": {
        "@type": "Offer",
        "url": `https://www.shivelectro.com/shop/product/${id}`,
        "priceCurrency": "INR",
        "price": productDetails.salePrice > 0
          ? productDetails.salePrice.toString()
          : productDetails.price ? productDetails.price.toString() : "0",
        "availability": productDetails.totalStock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        "seller": {
          "@type": "Organization",
          "name": "Shiv Electronics"
        }
      }
    };

    // Only add aggregateRating when reviews exist
    if (reviews && reviews.length > 0) {
      schema.aggregateRating = {
        "@type": "AggregateRating",
        "ratingValue": averageReview.toFixed(1),
        "reviewCount": reviews.length.toString()
      };
    }

    return schema;
  }, [productDetails, reviews, averageReview, id]);

  // Truncate description for meta tag (max 160 chars)
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
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2">
        <ArrowLeft className="w-4 h-4" /> Go Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start">
        {/* Product Image Section */}
        <div className="sticky top-8 relative overflow-hidden rounded-xl bg-[#EDF3FA] flex items-center justify-center p-6 shadow-sm border">
          <img
            src={getOptimizedImageUrl(productDetails?.image, 600)}
            alt={productDetails?.title || "Product image"}
            width={600}
            height={600}
            className="w-full max-w-[500px] object-contain aspect-square mix-blend-multiply"
          />
        </div>

        {/* Product Details Section */}
        <div className="flex flex-col">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground mb-4">
            {productDetails?.title}
          </h1>

          <div className="text-muted-foreground text-sm font-medium mb-4 flex gap-2">
            {productDetails?.category && (
              <span className="bg-muted px-3 py-1 rounded-full border">
                {categoryOptionsMap[productDetails?.category] || productDetails?.category}
              </span>
            )}
            {productDetails?.brand && (
              <span className="bg-muted px-3 py-1 rounded-full border">
                {brandOptionsMap[productDetails?.brand] || productDetails?.brand}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center gap-1">
              <StarRatingComponent rating={averageReview} />
            </div>
            <span className="text-muted-foreground text-sm font-medium pt-1">
              ({averageReview.toFixed(1)} {reviews?.length === 1 ? 'review' : 'reviews'})
            </span>
          </div>

          {siteConfig?.showPrice && (
            <div className="flex items-baseline gap-4 mb-6">
              <p
                className={`text-3xl font-bold text-muted-foreground ${
                  productDetails?.salePrice > 0 ? "line-through text-2xl" : "text-primary"
                }`}
              >
                ₹{productDetails?.price}
              </p>
              {productDetails?.salePrice > 0 ? (
                <p className="text-4xl font-bold text-primary">₹{productDetails?.salePrice}</p>
              ) : null}
            </div>
          )}

          {siteConfig?.showAddToCart && (
            <div className="mb-8">
              {productDetails?.totalStock === 0 ? (
                <Button size="lg" className="w-full opacity-60 cursor-not-allowed text-lg">
                  Out of Stock
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="w-full text-lg shadow-md transition-transform active:scale-[0.98]"
                  onClick={() => handleAddToCart(productDetails?._id, productDetails?.totalStock)}
                >
                  Add to Cart
                </Button>
              )}
            </div>
          )}

          <div className="prose prose-p:mb-4 max-w-none text-muted-foreground text-base mb-8">
            <ReactMarkdown remarkPlugins={[remarkBreaks]}>
              {productDetails?.description}
            </ReactMarkdown>
          </div>

          {siteConfig?.showReviews && (
            <>
              <Separator className="my-8" />

              {/* Reviews Section */}
              <div className="flex flex-col gap-6">
                <h2 className="text-2xl font-bold tracking-tight">Customer Reviews</h2>
                <div className="grid gap-6 max-h-[400px] overflow-y-auto pr-2 rounded-md">
                  {reviews && reviews.length > 0 ? (
                    reviews.map((reviewItem) => (
                      <div className="flex gap-4 p-4 rounded-lg bg-muted/30" key={reviewItem._id}>
                        <Avatar className="w-10 h-10 border shadow-sm">
                          <AvatarFallback className="bg-primary/10 text-primary font-bold">
                            {reviewItem?.userName[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1.5 flex-1">
                          <div className="flex justify-between items-center">
                            <h3 className="font-bold text-base">{reviewItem?.userName}</h3>
                          </div>
                          <div className="flex items-center gap-0.5">
                            <StarRatingComponent rating={reviewItem?.reviewValue} />
                          </div>
                          <p className="text-muted-foreground text-sm mt-1 leading-relaxed">
                            {reviewItem.reviewMessage}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 bg-muted/20 rounded-lg">
                      <p className="text-muted-foreground font-medium">No reviews yet. Be the first!</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex-col flex gap-4 bg-muted/10 p-5 rounded-xl border">
                  <Label className="text-lg font-semibold">Write a review</Label>
                  <div className="flex gap-1">
                    <StarRatingComponent
                      rating={rating}
                      handleRatingChange={handleRatingChange}
                    />
                  </div>
                  <Input
                    name="reviewMsg"
                    value={reviewMsg}
                    onChange={(event) => setReviewMsg(event.target.value)}
                    placeholder="Share your thoughts about this product..."
                    className="bg-background"
                  />
                  <Button
                    onClick={handleAddReview}
                    disabled={reviewMsg.trim() === ""}
                    className="w-full sm:w-auto self-start mt-2"
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
