import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#04265C] text-white pt-10 pb-4 text-sm font-['Roboto_Slab']">
      <div className="w-[90%] lg:w-[80%] mx-auto flex flex-col md:flex-row gap-10">
        {/* Left Column: Logo & Description (40% width) */}
        <div className="md:w-[40%] space-y-4">
          <a href="https://www.writtenlyhub.com">
            <img
              src="https://www.writtenlyhub.com/wp-content/themes/twentytwentyone/assets/home/logo-white.svg"
              alt="WrittenlyHub Logo"
              className="h-16 w-auto"
            />
          </a>
          <p className="text-gray-200 leading-relaxed mt-6">
            We are a boutique content marketing  <br /> agency to help
             you add a premium touch<br /> to your  
             brand through our expertise and<br /> creativity.
          </p>
        </div>

        {/* Right Columns: Services, Quick Link, Contact (60% width) */}
        <div className="md:w-[60%] grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Column 2: Services */}
          <div>
            <h3 className="font-bold text-lg mb-3">Services</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="https://www.writtenlyhub.com/seo/" className="hover:text-orange-500">SEO Content Writing</a></li>
              <li><a href="https://www.writtenlyhub.com/smm/" className="hover:text-orange-500">Social Media Marketing</a></li>
              <li><a href="https://www.writtenlyhub.com/automate/" className="hover:text-orange-500">Automate Your Digital Growth</a></li>
              <li><a href="https://www.writtenlyhub.com/content-writing/" className="hover:text-orange-500">Content Writing</a></li>
              <li><a href="https://www.writtenlyhub.com/content-writing-services-in-bangalore/" className="hover:text-orange-500">Content Writing Services in Bangalore</a></li>
              <li><a href="https://www.writtenlyhub.com/social-media-marketing-services/" className="hover:text-orange-500">SMM Services in Bangalore</a></li>
            </ul>
          </div>

          {/* Column 3: Quick Link */}
          <div>
            <h3 className="font-bold text-lg mb-3">Quick Link</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="https://www.writtenlyhub.com/about/" className="hover:text-orange-500">About Us</a></li>
              <li><a href="https://www.writtenlyhub.com/case-studies/" className="hover:text-orange-500">Case Studies</a></li>
              <li><a href="#" className="hover:text-orange-500">Blog</a></li>
              <li><a href="https://www.writtenlyhub.com/contact/" className="hover:text-orange-500">Contact</a></li>
              <li><a href="https://www.writtenlyhub.com/career/" className="hover:text-orange-500">Career</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h3 className="font-bold text-lg mb-3">Get in touch today!</h3>
            <p className="text-gray-300 break-words">services@writtenlyhub.com</p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="w-[90%] lg:w-[80%] mx-auto border-t border-white/20 mt-10 pt-4 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm space-y-3 md:space-y-0">
        <div className="flex space-x-6">
          <a href="https://www.writtenlyhub.com/terms/" className="hover:text-white">Terms and Conditions</a>
          <a href="https://www.writtenlyhub.com/return-policy/" className="hover:text-white">Return Policy</a>
          <a href="https://www.writtenlyhub.com/privacy-policy/" className="hover:text-white">Privacy Policy</a>
        </div>
        <div>
          © 2025 WrittenlyHub Private Limited - All rights Reserved
        </div>
      </div>
    </footer>
  );
};

export default Footer;