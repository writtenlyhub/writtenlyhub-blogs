import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSidePanel, setShowSidePanel] = useState(false);

  const navLinks = [
    { label: "About Us", href: "https://www.writtenlyhub.com/about/" },
    { label: "Services", href: "https://www.writtenlyhub.com/services/" },
    { label: "Case Studies", href: "https://www.writtenlyhub.com/case-studies/" },
    { label: "Blog", href: "/" },
    { label: "Career", href: "https://www.writtenlyhub.com/career/" },
    { label: "Write For Us", href: "https://www.writtenlyhub.com/career/" },
    { label: "Contact", href: "https://www.writtenlyhub.com/contact/" },
  ];

  const toggleSidePanel = () => {
    setShowSidePanel(!showSidePanel);
    setIsOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen);
    setShowSidePanel(false);
  };

  const closeAllMenus = () => {
    setShowSidePanel(false);
    setIsOpen(false);
  };

  // Mobile panel variants with bending effect
  const mobilePanelVariants = {
    hidden: { 
      x: "100%",
      opacity: 0,
      skewX: "-12deg",
      transformOrigin: "right center"
    },
    visible: { 
      x: 0,
      opacity: 1,
      skewX: "0deg",
      transition: { 
        type: "spring",
        stiffness: 400,
        damping: 30,
        duration: 0.35
      }
    },
    exit: { 
      x: "100%",
      opacity: 0,
      skewX: "12deg",
      transition: { 
        ease: "easeIn",
        duration: 0.25
      }
    }
  };

  // Desktop panel variants without bending
  const desktopPanelVariants = {
    hidden: { 
      x: "100%",
      opacity: 0,
    },
    visible: { 
      x: 0,
      opacity: 1,
      transition: { 
        type: "spring",
        stiffness: 300,
        damping: 25,
        duration: 0.4
      }
    },
    exit: { 
      x: "100%",
      opacity: 0,
      transition: { 
        ease: "easeIn",
        duration: 0.3
      }
    }
  };

  const linkVariants = {
    hidden: { 
      x: 30, 
      opacity: 0,
    },
    visible: (i) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05,
        ease: "easeOut",
        duration: 0.2
      }
    })
  };

  return (
    <div className="relative z-40 font-['Roboto_Slab']">
      {/* Top Navbar */}
      <nav className="bg-[#04265C] text-white font-semibold sticky top-0 z-[60]">
        <div className="mx-auto w-[90%] lg:w-[80%] py-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <a href="https://www.writtenlyhub.com" className="flex items-center">
              <img
                src="https://www.writtenlyhub.com/wp-content/themes/twentytwentyone/assets/home/logo-white.svg"
                alt="WrittenlyHub Logo"
                className="h-10 md:h-16 w-auto"
              />
            </a>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8 lg:space-x-10 text-md items-center">
            {navLinks.map(({ label, href }) => (
              <li key={label} className="list-none group cursor-pointer">
                <a href={href} className="relative inline-block py-1 text-white">
                  {label}
                  <span className="absolute left-0 bottom-1/2 h-[1px] w-0 bg-black transform translate-y-1/2 transition-all duration-300 group-hover:w-[85%]"></span>
                </a>
              </li>
            ))}
          </div>

          {/* Desktop Side Panel Toggle */}
          <button
            className="hidden md:flex bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={toggleSidePanel}
            aria-label="Toggle menu"
          >
            {showSidePanel ? (
              <X size={28} className="text-[#04265C]" />
            ) : (
              <Menu size={28} className="text-[#04265C]" />
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            {isOpen ? (
              <X size={24} className="text-[#04265C]" />
            ) : (
              <Menu size={24} className="text-[#04265C]" />
            )}
          </button>
        </div>
      </nav>

      {/* Desktop Fullscreen Side Panel */}
      <AnimatePresence>
        {showSidePanel && (
          <motion.div
            className="hidden md:flex fixed inset-0 z-50 bg-[#04265C] pt-[88px] text-white"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={desktopPanelVariants}
            style={{
              backfaceVisibility: 'hidden',
              overflow: 'hidden'
            }}
          >
            <div className="w-full max-w-6xl px-6 mx-auto flex flex-col lg:flex-row gap-12 items-center justify-center">
              {/* Left - Image */}
              <div className="w-full lg:w-1/2 flex justify-center">
                <img
                  src="https://www.writtenlyhub.com/wp-content/languages/twentytwentyone/assets/Address_1_w979.webp"
                  alt="WrittenlyHub Office"
                  className="w-full max-w-md h-auto"
                />
              </div>

              {/* Right - Address */}
              <div className="w-full lg:w-1/2 text-center lg:text-left space-y-3">
                <p className="text-2xl font-bold">We are in the heart of India's Silicon Valley,</p>
                <p className="text-3xl font-bold italic text-orange-500">Namma Bengaluru</p>
                <address className="not-italic text-lg leading-relaxed">
                  <h2 className="font-bold">Address</h2>
                  172/1, 1st floor, 5th Main, 9th Cross Rd,<br />
                  Opposite to Kairalee Nikethan Education Trust,<br />
                  Indira Nagar 1st Stage,<br />
                  Bengaluru, Karnataka-560038
                </address>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu - Fullscreen */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="md:hidden fixed inset-0 z-50 bg-[#04265C] px-6 h-full flex flex-col"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobilePanelVariants}
            style={{ 
              backfaceVisibility: 'hidden',
              overflow: 'hidden'
            }}
          >
            <div className="flex-1 flex flex-col justify-center items-end space-y-6 pr-4">
              {navLinks.map(({ label, href }, i) => (
                <motion.a
                  key={label}
                  href={href}
                  className="text-right w-full text-3xl font-medium text-white hover:text-gray-300 transition-colors"
                  onClick={closeAllMenus}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={linkVariants}
                >
                  {label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;