import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h4 className="text-lg font-semibold mb-4 uppercase">Company</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop/listing" className="text-gray-300 hover:text-white transition-colors">
                  Our Services
                </Link>
              </li>
              <li>
                <Link to="/shop/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/shop/terms-conditions" className="text-gray-300 hover:text-white transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

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

          <div>
            <h4 className="text-lg font-semibold mb-4 uppercase">Product</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/shop/listing" className="text-gray-300 hover:text-white transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link to="/shop/listing" className="text-gray-300 hover:text-white transition-colors">
                  New
                </Link>
              </li>
              <li>
                <Link to="/shop/listing" className="text-gray-300 hover:text-white transition-colors">
                  Popular
                </Link>
              </li>
              <li>
                <a href="#aboutus" className="text-gray-300 hover:text-white transition-colors">
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

          <div>
            <h4 className="text-lg font-semibold mb-4 uppercase">Follow Us</h4>
            <div className="flex items-center space-x-4">
              <a href="https://www.facebook.com/patel.pranshu.350/" target="_blank" rel="noopener noreferrer">
                <img src="/images/social logo/Facebook-Logo.png" alt="Facebook" className="h-10 w-10 hover:bg-[#e30045] rounded-full p-1 object-contain transition duration-500" />
              </a>
              <a href="https://www.instagram.com/patelpranshu_/" target="_blank" rel="noopener noreferrer">
                <img src="/images/social logo/Instagram-logo.png" alt="Instagram" className="h-10 w-10 hover:bg-[#e30045] rounded-full p-1 object-contain transition duration-500" />
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
          <p>©2025 Shiv Electronics | All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
