import { Button } from "@/components/ui/button";
import bannerOne from "../../assets/banner-1.webp";
import bannerTwo from "../../assets/banner-2.webp";
import bannerThree from "../../assets/banner-3.webp";
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
  Mail, // Added for contact icon
  MapPin, // Added for contact icon
  Phone, // Added for contact icon
  Smartphone, // Added for contact icon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useLocation, useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/components/ui/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const { featureImageList } = useSelector((state) => state.commonFeature);

  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

   const location = useLocation();

  function handleNavigateToListingPage(getCurrentItem, section) {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };

    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddtoCart(getCurrentProductId) {
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
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

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

  console.log(productList, "productList");

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  // 4. Add this useEffect hook
  useEffect(() => {
    // Check if the URL has a hash (e.g., #aboutus)
    if (location.hash) {
      // Find the element with the corresponding ID
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        // Scroll to the element smoothly
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]); // This effect runs every time the location changes

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${
                  index === currentSlide ? "opacity-100" : "opacity-0"
                } absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
              />
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      {/* --- ABOUT US SECTION - MODIFIED --- */}
      <section className="py-12 bg-[#f8f8f8]" id="aboutus">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">About Us</h2>
          <div className="max-w-4xl mx-auto text-gray-700 text-base leading-relaxed space-y-6">
            <p>
              SHIV ELECTRONICS has enjoyed high reputation in the Indian market
              for the last 9 years in ELCB & AUTO SWITCH with wide range. SHIV
              ELECTRONICS believe that we are not only interested to develop
              relationship but also like to develop "Devotional Relationship"
              with dealers.
            </p>

            <p>
              The response, company get from all over Gujarat, Maharastra,
              Rajasthan & other places it's show the faith of Dealers &
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
                    competitive prices to its clients. The Company's long term
                    goal is to exceed customer's expectations by providing
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

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem._id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>


      {/* --- CONTACT SECTION - NEW --- */}
      <section className="py-12 bg-[#f8f8f8]" id="contact">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Contact Info
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Contact Details */}
            <div className="space-y-6 text-lg">
              <div className="flex items-center gap-4">
                <Phone className="w-6 h-6 text-primary" />
                <div>
                  <strong>Phone:</strong>{" "}
                  <a
                    href="tel:+9102772228063"
                    className="text-gray-700 hover:text-primary transition"
                  >
                    +91 02772 228063
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

            {/* Contact Map */}
            <div className="w-full h-full min-h-[400px]">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4365.530733452898!2d72.95946043042852!3d23.588664367422975!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395db89314a11cb5%3A0xaff10434d19474df!2sShiv%20Electronics(SAMRAT)!5e1!3m2!1sen!2sin!4v1749811422171!5m2!1sen!2sin"
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

      
      {/* --- FOOTER - NEW --- */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Column */}
            <div>
              <h4 className="text-lg font-semibold mb-4 uppercase">Company</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                    Our Services
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                    Affiliate Program
                  </a>
                </li>
              </ul>
            </div>

            {/* Get Help Column */}
            <div>
              <h4 className="text-lg font-semibold mb-4 uppercase">Get Help</h4>
              <ul className="space-y-2">
                <li>
                  <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                    Warranty
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                    Troubleshoot
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                    Where To Buy
                  </a>
                </li>
              </ul>
            </div>

            {/* Product Column */}
            <div>
              <h4 className="text-lg font-semibold mb-4 uppercase">Product</h4>
              <ul className="space-y-2">
                <li>
                  <a href="/shop/listing" className="text-gray-300 hover:text-white transition-colors">
                    All Products
                  </a>
                </li>
                <li>
                  <a href="/shop/listing" className="text-gray-300 hover:text-white transition-colors">
                    New
                  </a>
                </li>
                <li>
                  <a href="/shop/listing" className="text-gray-300 hover:text-white transition-colors">
                    Popular
                  </a>
                </li>
                <li>
                  <a href="/shop/listing" className="text-gray-300 hover:text-white transition-colors">
                    Certification
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                    Bulk Order
                  </a>
                </li>
              </ul>
            </div>

            {/* Follow Us Column */}
            <div>
              <h4 className="text-lg font-semibold mb-4 uppercase">Follow Us</h4>
              <div className="flex items-center space-x-4">
                <a href="https://www.facebook.com/patel.pranshu.350/" target="_blank" rel="noopener noreferrer">
                  <img src="/images/social logo/Facebook-Logo.png" alt="Facebook" className="h-10 w-10 hover:bg-[#e30045] rounded-full p-1 object-contain transition duration-500" />
                </a>
                <a href="https://www.instagram.com/patelpranshu_/" target="_blank" rel="noopener noreferrer">
                  <img src="/images/social logo/Instagram-logo.png" alt="Instagram" className="h-10 w-10 hover:bg-[#e30045] rounded-full p-1 object-contain transition duration-500 " />
                </a>
                <a href="https://twitter.com/patelpranshu_" target="_blank" rel="noopener noreferrer">
                  <img src="/images/social logo/twitter-logo.png" alt="Twitter" className="h-10 w-10 hover:bg-[#e30045] rounded-full p-1 object-contain transition duration-500" />
                </a>
                <a href="https://www.youtube.com/@patelpranshu_" target="_blank" rel="noopener noreferrer">
                  <img src="/images/social logo/youtube-icon.png" alt="YouTube" className="h-10 w-10 hover:bg-[#e30045] rounded-full p-1 object-contain transition duration-500" />
                </a>
              </div>
            </div>
          </div>
          <div className="text-center text-gray-400 mt-12 border-t border-gray-700 pt-6">
            <p>©2025 Shivelectro | All Rights Reserved</p>
          </div>
        </div>
      </footer>
       


      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
