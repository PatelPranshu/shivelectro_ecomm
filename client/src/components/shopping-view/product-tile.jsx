import { Card, CardContent, CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";
import { getOptimizedImageUrl } from "@/lib/cloudinary-url";

function ShoppingProductTile({
  product,
  handleGetProductDetails,
  handleAddtoCart,
}) {
  const { config: siteConfig } = useSelector((state) => state.siteConfig);
  const { categoryOptionsMap, brandOptionsMap } = useSelector((state) => state.taxonomy);

  return (
    <Card className="w-full max-w-sm mx-auto cursor-pointer overflow-hidden rounded-lg border bg-white shadow-sm transition-colors hover:border-blue-200">
      <div onClick={() => handleGetProductDetails(product?._id)}>
        <div className="relative overflow-hidden bg-slate-50 h-[220px] md:h-[280px] w-full flex items-center justify-center p-6 md:p-4 border-b">
          <img
            src={getOptimizedImageUrl(product?.image, 400)}
            alt={product?.title || "Product image"}
            width={400}
            height={400}
            loading="lazy"
            className="w-full h-full object-contain mix-blend-multiply"
          />
          {product?.totalStock === 0 ? (
            <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 px-2.5 py-0.5 text-xs uppercase tracking-wider font-semibold rounded-md">
              Out Of Stock
            </Badge>
          ) : product?.totalStock < 10 ? (
            <Badge className="absolute top-2 left-2 bg-amber-500 hover:bg-amber-600 px-2.5 py-0.5 text-xs uppercase tracking-wider font-semibold rounded-md">
              {`Only ${product?.totalStock} left`}
            </Badge>
          ) : product?.salePrice > 0 ? (
            <Badge className="absolute top-2 left-2 bg-blue-600 hover:bg-blue-700 px-2.5 py-0.5 text-xs uppercase tracking-wider font-semibold rounded-md">
              Sale
            </Badge>
          ) : null}
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {product?.category && (
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {categoryOptionsMap[product?.category] || product?.category}
              </span>
            )}
            {product?.category && product?.brand && <span className="text-muted-foreground text-[10px]">•</span>}
            {product?.brand && (
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                {brandOptionsMap[product?.brand] || product?.brand}
              </span>
            )}
          </div>
          
          <h2 className="text-[15px] font-semibold text-slate-900 leading-snug mb-3 line-clamp-2 min-h-[40px]">
            {product?.title}
          </h2>
          
          {siteConfig?.showPrice && (
            <div className="flex items-baseline gap-2 mb-1">
              {product?.salePrice > 0 ? (
                <>
                  <span className="text-lg font-bold text-slate-900">
                    ₹{product?.salePrice}
                  </span>
                  <span className="text-sm text-slate-400 line-through">
                    ₹{product?.price}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-slate-900">
                  ₹{product?.price}
                </span>
              )}
            </div>
          )}
        </CardContent>
      </div>
      
      {siteConfig?.showAddToCart && (
        <CardFooter className="px-4 pb-4 pt-0">
          {product?.totalStock === 0 ? (
            <Button className="w-full bg-slate-100 text-slate-400 hover:bg-slate-100 cursor-not-allowed h-9" disabled>
              Out Of Stock
            </Button>
          ) : (
            <Button
              onClick={() => handleAddtoCart(product?._id, product?.totalStock)}
              className="w-full h-9 font-medium"
            >
              Add to cart
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}

export default ShoppingProductTile;
