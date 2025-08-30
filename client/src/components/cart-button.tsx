import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function CartButton() {
  const [itemCount, setItemCount] = useState(0);

  // Update cart count from localStorage
  const updateCartCount = () => {
    const savedCart = localStorage.getItem("hamshark-cart");
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      const totalItems = cart.reduce((total: number, item: any) => total + item.quantity, 0);
      setItemCount(totalItems);
    } else {
      setItemCount(0);
    }
  };

  useEffect(() => {
    // Initial count
    updateCartCount();

    // Listen for cart updates
    const handleCartUpdate = () => {
      updateCartCount();
    };

    window.addEventListener('cart-updated', handleCartUpdate);
    window.addEventListener('storage', handleCartUpdate);

    // Check for cart updates every second (for cross-tab sync)
    const interval = setInterval(updateCartCount, 1000);

    return () => {
      window.removeEventListener('cart-updated', handleCartUpdate);
      window.removeEventListener('storage', handleCartUpdate);
      clearInterval(interval);
    };
  }, []);

  return (
    <Link href="/cart">
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        data-testid="cart-button"
      >
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-primary hover:bg-primary/90"
        >
          <div className="relative">
            <ShoppingCart className="h-6 w-6" />
            {itemCount > 0 && (
              <Badge 
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-yellow-500 text-black"
                data-testid="cart-count"
              >
                {itemCount > 99 ? "99+" : itemCount}
              </Badge>
            )}
          </div>
        </Button>
      </motion.div>
    </Link>
  );
}