import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Truck, Menu, X, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  // Update cart count
  const updateCartCount = () => {
    const savedCart = localStorage.getItem("hamshark-cart");
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      const totalItems = cart.reduce((total: number, item: any) => total + item.quantity, 0);
      setCartCount(totalItems);
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    updateCartCount();
    const interval = setInterval(updateCartCount, 1000);
    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 w-full z-50 glass-dark backdrop-blur-lg"
      data-testid="navigation"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center space-x-2"
            data-testid="logo"
          >
            <Truck className="text-primary text-2xl" />
            <h1 className="text-2xl font-bold gradient-text">Hamshark</h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => scrollToSection("menu")}
              className="hover:text-primary transition-colors"
              data-testid="nav-menu"
            >
              Menu
            </button>
            <button
              onClick={() => scrollToSection("locator")}
              className="hover:text-primary transition-colors"
              data-testid="nav-locator"
            >
              Find Truck
            </button>
            <button
              onClick={() => scrollToSection("loyalty")}
              className="hover:text-primary transition-colors"
              data-testid="nav-loyalty"
            >
              Rewards
            </button>
            <Link href="/cart">
              <Button variant="outline" className="relative" data-testid="nav-cart">
                <ShoppingCart className="mr-2 h-4 w-4" />
                View Cart
                {cartCount > 0 && (
                  <Badge className="ml-2 bg-yellow-500 text-black h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
            <Button
              className="ripple"
              onClick={() => scrollToSection("menu")}
              data-testid="button-order-now"
            >
              Order Now
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-primary"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMenuOpen ? <X className="text-xl" /> : <Menu className="text-xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 py-4 border-t border-border"
          >
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection("menu")}
                className="text-left hover:text-primary transition-colors"
                data-testid="mobile-nav-menu"
              >
                Menu
              </button>
              <button
                onClick={() => scrollToSection("locator")}
                className="text-left hover:text-primary transition-colors"
                data-testid="mobile-nav-locator"
              >
                Find Truck
              </button>
              <button
                onClick={() => scrollToSection("loyalty")}
                className="text-left hover:text-primary transition-colors"
                data-testid="mobile-nav-loyalty"
              >
                Rewards
              </button>
              <Link href="/cart">
                <Button variant="outline" className="self-start flex items-center" data-testid="mobile-nav-cart">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  View Cart ({cartCount})
                </Button>
              </Link>
              <Button
                className="self-start"
                onClick={() => scrollToSection("menu")}
                data-testid="mobile-button-order-now"
              >
                Order Now
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
