import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-50 border-t border-slate-800 mt-auto">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand & Description */}
          <div className="space-y-6">
            <Link to="/shop/home" className="flex items-center">
              <img src="/logo.png" alt="Shiv Electronics" className="h-10 w-auto bg-white p-1 rounded" />
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              India's trusted manufacturer and online store for electrical safety products, delivering premium protection and reliability since 2017.
            </p>
            <div className="flex items-center space-x-4">
              <a href="https://www.facebook.com/patel.pranshu.350/" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors group">
                <img src="/images/social logo/Facebook-Logo.png" alt="Facebook" className="h-5 w-5 object-contain opacity-70 group-hover:opacity-100 transition-all duration-300" />
              </a>
              <a href="https://www.instagram.com/patelpranshu_/" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors group">
                <img src="/images/social logo/Instagram-logo.png" alt="Instagram" className="h-5 w-5 object-contain opacity-70 group-hover:opacity-100 transition-all duration-300" />
              </a>
              <a href="https://twitter.com/patelpranshu_" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors group">
                <img src="/images/social logo/twitter-logo.png" alt="Twitter" className="h-5 w-5 object-contain opacity-70 group-hover:opacity-100 transition-all duration-300" />
              </a>
              <a href="https://www.youtube.com/@patelpranshu_" target="_blank" rel="noopener noreferrer" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-full transition-colors group">
                <img src="/images/social logo/youtube-icon.png" alt="YouTube" className="h-5 w-5 object-contain opacity-70 group-hover:opacity-100 transition-all duration-300" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase mb-6 text-white">Company</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li>
                <Link to="/shop/listing" className="hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2"></span> Our Services
                </Link>
              </li>
              <li>
                <Link to="/shop/privacy-policy" className="hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2"></span> Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/shop/terms-conditions" className="hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2"></span> Terms &amp; Conditions
                </Link>
              </li>
              <li>
                <a href="#aboutus" className="hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2"></span> About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase mb-6 text-white">Support</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li>
                <a href="#contact" className="hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2"></span> Warranty Information
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2"></span> Troubleshoot
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2"></span> Where To Buy
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition-colors flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mr-2"></span> Bulk Orders
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-bold tracking-wider uppercase mb-6 text-white">Contact Us</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-3 text-white flex-shrink-0 mt-0.5" />
                <span className="hover:text-white transition-colors">Mahalaxmi Ind. Estate, B/H Bhagvati CNG Pump, Himatnagar, Gujarat 383001</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-white flex-shrink-0" />
                <span className="hover:text-white transition-colors">+91 9428002163</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-white flex-shrink-0" />
                <span className="hover:text-white transition-colors">info@shivelectro.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center border-t border-slate-800 mt-12 pt-8 text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Shiv Electronics (Samrat®). All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link to="/shop/privacy-policy" className="hover:text-white cursor-pointer transition-colors">Security</Link>
            <Link to="/shop/privacy-policy" className="hover:text-white cursor-pointer transition-colors">Privacy</Link>
            <Link to="/shop/terms-conditions" className="hover:text-white cursor-pointer transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
