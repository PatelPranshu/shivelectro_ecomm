import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Mail,
  MapPin,
  Phone,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useLocation, useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import SEO from "@/components/common/SEO";
import { getFeatureImages } from "@/store/common-slice";
import { getOptimizedImageUrl } from "@/lib/cloudinary-url";

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const { categories } = useSelector((state) => state.taxonomy);

  function handleNavigateToListingPage(filterSection, filterItem) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [filterSection]: [filterItem.value],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate("/shop/listing");
  }


  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

   const location = useLocation();


  function handleGetProductDetails(getCurrentProductId) {
    navigate(`/shop/product/${getCurrentProductId}`);
  }

  function handleAddtoCart(getCurrentProductId) {
    if (!isAuthenticated) {
      toast({
        title: "Please log in",
        description: "You need to log in to add items to your cart.",
        variant: "destructive",
      });
      navigate('/auth/login');
      return;
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
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);

    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);


  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);


  useEffect(() => {

    if (location.hash) {
 
      const element = document.getElementById(location.hash.substring(1));
      if (element) {

        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      <SEO
        title="ELCB, Auto Switch & Electrical Safety Products | Samrat®"
        description="Shiv Electronics (Samrat®) — India's trusted manufacturer of ELCB, Auto Switch, Overload Protectors, Timers & Solar Fence Guards. 9+ years of quality electrical safety products. Shop online."
        canonicalUrl="/shop/home"
      />
      <div className="relative w-full h-[250px] sm:h-[350px] md:h-[500px] lg:h-[600px] overflow-hidden">
  {featureImageList && featureImageList.length > 0
    ? featureImageList.map((slide, index) => (
        <img
          src={getOptimizedImageUrl(slide?.image, 1200)}
          alt={`Shiv Electronics promotional banner ${index + 1}`}
          key={index}
          width={1200}
          height={600}
          loading={index === 0 ? "eager" : "lazy"}
          fetchpriority={index === 0 ? "high" : undefined}
          className={`${
            index === currentSlide ? "opacity-100" : "opacity-0"
          } absolute top-0 left-0 w-full h-full object-contain bg-muted/30 transition-opacity duration-1000`}
        />
      ))
    : null}

  <Button
    variant="outline"
    size="icon"
    onClick={() =>
      setCurrentSlide(
        (prevSlide) =>
          (prevSlide - 1 + featureImageList.length) % featureImageList.length
      )
    }
    className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-white/80 p-1 sm:p-2"
  >
    <ChevronLeftIcon className="w-4 h-4 sm:w-6 sm:h-6" />
  </Button>

  <Button
    variant="outline"
    size="icon"
    onClick={() =>
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length)
    }
    className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-white/80 p-1 sm:p-2"
  >
    <ChevronRightIcon className="w-4 h-4 sm:w-6 sm:h-6" />
  </Button>
</div>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 tracking-tight">Shop by Category</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {categories && categories.length > 0 ? categories.map((categoryItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage("category", categoryItem)
                }
                className="group cursor-pointer border border-border/50 bg-background hover:border-primary/50 hover:shadow-lg hover:-translate-y-1 transition-all w-[160px] sm:w-[200px] lg:w-[220px] rounded-2xl overflow-hidden"
                key={categoryItem.value}
              >
                <CardContent className="flex flex-col items-center justify-center p-6 h-full min-h-[120px] relative">
                  <span className="font-semibold text-center text-lg text-slate-800 group-hover:text-primary transition-colors">{categoryItem.name}</span>
                  <ArrowRight className="w-5 h-5 text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all absolute bottom-4" />
                </CardContent>
              </Card>
            )) : null}
          </div>
        </div>
      </section>

      {/* <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {brands && brands.length > 0 ? brands.map((brandItem) => (
              <Card
                onClick={() => handleNavigateToListingPage("brand", brandItem)}
                className="cursor-pointer hover:shadow-lg transition-shadow w-[160px] sm:w-[200px] lg:w-[220px]"
                key={brandItem.value}
              >
                <CardContent className="flex flex-col items-center justify-center p-6 h-full min-h-[100px]">
                  <span className="font-bold text-center text-lg">{brandItem.name}</span>
                </CardContent>
              </Card>
            )) : null}
          </div>
        </div>
      </section> */}

      
      

      {productList && productList.length > 0 && productList.some((item) => item.isFeature) ? (
        <section className="py-16 md:py-24 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 tracking-tight">
              Featured Products
            </h2>
            <div className="flex flex-wrap justify-center gap-6">
              {productList
                .filter((productItem) => productItem.isFeature)
                .map((productItem) => (
                  <div className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)]" key={productItem._id}>
                    <ShoppingProductTile
                      handleGetProductDetails={handleGetProductDetails}
                      product={productItem}
                      handleAddtoCart={handleAddtoCart}
                    />
                  </div>
                ))}
            </div>
          </div>
        </section>
      ) : null}


      <section className="py-16 md:py-24 bg-muted/20" id="aboutus">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 tracking-tight">About Us</h2>
          <div className="max-w-4xl mx-auto text-gray-700 text-base leading-relaxed space-y-6">
            <p>
              SHIV ELECTRONICS has enjoyed high reputation in the Indian market
              for the last 9 years in ELCB & AUTO SWITCH with wide range. SHIV
              ELECTRONICS believe that we are not only interested to develop
              relationship but also like to develop &quot;Devotional Relationship&quot;
              with dealers.
            </p>

            <p>
              The response, company get from all over Gujarat, Maharastra,
              Rajasthan & other places it&#39;s show the faith of Dealers &
              Distributors. As per the requirements of customers every time
              company came with an improved ideas. Along with the product,
              company also shows great interest for the servicing of the
              products after the sale.
            </p>

            <details className="bg-white p-6 rounded-lg shadow-sm">
              <summary className="font-semibold text-lg cursor-pointer text-gray-800">
                More About Us
              </summary>
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Our Strength:
                  </h3>
                  <p>
                    Most of the time we are ready with stock of Products that
                    can be supplied to the customer at any place and at any
                    point of time.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Our Vision:
                  </h3>
                  <p>
                    Our vision is to provide quality products to ensure
                    customer satisfaction by maintaining high standards of
                    quality and consistency therein.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Our Facilities:
                  </h3>
                  <p>
                    Our infrastructural facility plays an important role in
                    enabling us to meet the exact requirements and standards of
                    the industry. Our modern facilities and specialized
                    equipment under the responsibility of a professional team
                    are the basis of an efficient production system optimizing
                    our capacity for the production of a wide product range
                    with a consistent quality. We have a team of engineers
                    backed up by in-house technical expertise to enable us to
                    cope up with our customers needs.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Quality:
                  </h3>
                  <p>
                    The Company always aims to provide high quality products at
                    competitive prices to its clients. The Company&#39;s long term
                    goal is to exceed customer&#39;s expectations by providing
                    product that lasts longer and gives complete satisfaction
                    to its customers. To achieve this, quality is practiced at
                    every Stage in the manufacturing process. The materials
                    used in our product assemblies are of right quality which
                    ensures reliability, durability and long life. Careful
                    selection of components and strict quality control at
                    various stages of manufacturing, enable us to produce
                    impeccable products in large quantities. All our products
                    are based on the latest technologies available in the
                    market.
                  </p>
                </div>
              </div>
            </details>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background" id="contact">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-12 tracking-tight">
            Contact Info
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

            <div className="space-y-6 text-lg">
              <div className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-primary" />
                <div>
                  <strong>Phone:</strong>{" "}
                  <a
                    href="tel:+919428002163"
                    className="text-gray-700 hover:text-primary transition"
                  >
                    +91 94280 02163
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Smartphone className="w-6 h-6 text-primary" />
                <div>
                  <strong>WhatsApp:</strong>{" "}
                  <a
                    href="https://wa.me/919428002163"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-700 hover:text-primary transition"
                  >
                    +91 94280 02163
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Mail className="w-6 h-6 text-primary" />
                <div>
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:yogeshshiv633@gmail.com"
                    className="text-gray-700 hover:text-primary transition"
                  >
                    yogeshshiv633@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <strong>Address:</strong>
                  <p className="text-gray-700">
                    Mahalaxml ind. Estate,<br /> b/h-Bhagvati CNG pump,<br /> Near-Bij nigam
                    Office, Khed-tasiya road,Motipura,Himatnagar-383001.
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full h-full min-h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4365.530733452898!2d72.95946043042852!3d23.588664367422975!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395db89314a11cb5%3A0xaff10434d19474df!2sShiv%20Electronics(SAMRAT)!5e1!3m2!1sen!2sin!4v1749811422171!5m2!1sen!2sin"
                title="Shiv Electronics Store Location on Google Maps"
                width="100%"
                height="100%"
                className="border-0 rounded-lg"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default ShoppingHome;
