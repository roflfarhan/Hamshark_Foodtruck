import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, Heart, Star, Gift, Share2, Download, RotateCcw, Printer, QrCode, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import type { Order, MenuItem } from "@shared/schema";

export default function OrderCompletion() {
  const { orderId } = useParams();
  
  const { data: order, isLoading } = useQuery<Order>({
    queryKey: ["/api/orders", orderId],
    enabled: !!orderId,
  });

  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
  });

  const handleHealthifyMeIntegration = async () => {
    try {
      const response = await fetch("/api/healthifyme/log-meal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          mealType: "lunch",
        }),
      });

      if (response.ok) {
        toast({
          title: "Meal logged successfully!",
          description: "Your nutrition data has been synced with HealthifyMe.",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to sync with HealthifyMe",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleShareReceipt = async (method: "whatsapp" | "email") => {
    try {
      const response = await fetch(`/api/orders/${orderId}/share`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ method }),
      });

      if (response.ok) {
        toast({
          title: "Receipt shared!",
          description: `Receipt shared via ${method}.`,
        });
      }
    } catch (error) {
      toast({
        title: "Failed to share receipt",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Order not found</h1>
          <p className="text-muted-foreground">The order you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  // Get detailed item information
  const orderItemsWithDetails = order.items?.map(orderItem => {
    const menuItem = menuItems.find(item => item.id === orderItem.menuItemId);
    return {
      ...orderItem,
      menuItem,
    };
  }) || [];

  // Calculate total nutrition
  const totalNutrition = orderItemsWithDetails.reduce((total, item) => {
    if (!item.menuItem?.nutrition) return total;
    const quantity = item.quantity;
    return {
      calories: total.calories + (item.menuItem.nutrition.calories * quantity),
      protein: total.protein + (item.menuItem.nutrition.protein * quantity),
      carbs: total.carbs + (item.menuItem.nutrition.carbs * quantity),
      fat: total.fat + (item.menuItem.nutrition.fat * quantity),
    };
  }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const loyaltyProgress = 65;
  const nextTierPoints = 250;
  const currentPoints = 158;
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Calculate surprise gifts based on order total
  const orderTotal = parseFloat(order.total || "0");
  const surpriseGifts = [];
  if (orderTotal >= 200) surpriseGifts.push("🥤 Free Healthy Drink");
  if (orderTotal >= 500) surpriseGifts.push("🎁 Hamshark Goodies");
  if (orderTotal >= 1000) surpriseGifts.push("🍲 Free Meal Coupon");

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-br from-background to-secondary">
      <div className="container mx-auto max-w-4xl">
        {/* Success Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
            <Check className="text-white text-2xl" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-4">Order Confirmed!</h1>
          <p className="text-muted-foreground">Your delicious meal is being prepared with love</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Professional Receipt */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-dark rounded-lg overflow-hidden"
            data-testid="order-receipt"
          >
            {/* Receipt Header */}
            <div className="bg-black/80 p-6 text-center border-b border-primary/20">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="text-primary text-3xl mb-2"
              >
                🚚
              </motion.div>
              <h2 className="text-2xl font-bold text-primary mb-2">HAMSHARK FOOD TRUCK</h2>
              <p className="text-sm text-muted-foreground">Clean Food, Served Fast</p>
              <div className="flex justify-between text-xs text-muted-foreground mt-4">
                <span>ORDER #: {order.id?.slice(-6).toUpperCase()}</span>
                <span>{currentDate} {currentTime}</span>
              </div>
            </div>

            {/* Order Items */}
            <div className="p-6">
              <div className="space-y-3 mb-6">
                {orderItemsWithDetails.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex justify-between items-start text-sm"
                    data-testid={`receipt-item-${index}`}
                  >
                    <div className="flex-1">
                      <div className="font-semibold">{item.quantity} {item.menuItem?.name || "Menu Item"}</div>
                      {item.menuItem?.nutrition && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {item.menuItem.nutrition.calories * item.quantity} kcal | 
                          P: {item.menuItem.nutrition.protein * item.quantity}g | 
                          C: {item.menuItem.nutrition.carbs * item.quantity}g | 
                          F: {item.menuItem.nutrition.fat * item.quantity}g
                        </div>
                      )}
                      {item.customizations && Object.keys(item.customizations).length > 0 && (
                        <div className="text-xs text-primary mt-1">
                          + Customizations: {Object.entries(item.customizations).map(([key, value]) => `${key}: ${value}`).join(", ")}
                        </div>
                      )}
                    </div>
                    <div className="text-right font-mono">
                      ₹ {item.price.toFixed(2)}
                    </div>
                  </motion.div>
                ))}
              </div>

              <Separator className="my-4" />

              {/* Bill Summary */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>SUBTOTAL:</span>
                  <span className="font-mono">₹ {order.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (5%):</span>
                  <span className="font-mono">₹ {order.tax}</span>
                </div>
                {surpriseGifts.map((gift, index) => (
                  <div key={index} className="flex justify-between text-green-400">
                    <span>{gift}</span>
                    <span className="font-mono">FREE</span>
                  </div>
                ))}
                
                <Separator className="my-3" />
                
                <div className="flex justify-between font-bold text-lg">
                  <span>TOTAL:</span>
                  <span className="font-mono text-primary">₹ {order.total}</span>
                </div>
                
                <div className="flex justify-between text-primary text-sm mt-2">
                  <span>HAMCOINS EARNED:</span>
                  <span className="font-mono">+{order.loyaltyPointsEarned}</span>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Contact & Footer */}
              <div className="text-center text-xs text-muted-foreground space-y-1">
                <div className="flex items-center justify-center gap-2">
                  <Phone className="h-3 w-3" />
                  <span>+91 9876543210</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="h-3 w-3" />
                  <span>Mumbai, India</span>
                </div>
                <div className="mt-3 pt-3 border-t border-border">
                  <div className="font-semibold mb-1">CUSTOMER COPY</div>
                  <div>THANKS FOR VISITING</div>
                  <div>HAMSHARK FOOD TRUCK!</div>
                </div>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="bg-black/40 p-4 text-center border-t border-primary/20">
              <div className="flex items-center justify-center gap-4">
                <div className="flex-1">
                  <QrCode className="h-8 w-8 mx-auto text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">Scan for digital receipt</p>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="flex-1">
                  <Star className="h-8 w-8 mx-auto text-primary mb-2" />
                  <p className="text-xs text-muted-foreground">Rate your experience</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Nutrition & Rewards Panel */}
          <div className="space-y-6">
            {/* Nutrition Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="glass-dark rounded-lg p-6"
              data-testid="nutrition-summary"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <div className="w-6 h-6 bg-blue-400 rounded mr-2"></div>
                Nutrition Dashboard
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.6, type: "spring" }}
                    className="text-3xl font-bold text-primary mb-1"
                  >
                    {totalNutrition.calories}
                  </motion.div>
                  <div className="text-sm text-muted-foreground">Calories</div>
                </div>
                <div className="text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: "spring" }}
                    className="text-3xl font-bold text-blue-400 mb-1"
                  >
                    {totalNutrition.protein}g
                  </motion.div>
                  <div className="text-sm text-muted-foreground">Protein</div>
                </div>
                <div className="text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8, type: "spring" }}
                    className="text-3xl font-bold text-orange-400 mb-1"
                  >
                    {totalNutrition.carbs}g
                  </motion.div>
                  <div className="text-sm text-muted-foreground">Carbs</div>
                </div>
                <div className="text-center">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.9, type: "spring" }}
                    className="text-3xl font-bold text-red-400 mb-1"
                  >
                    {totalNutrition.fat}g
                  </motion.div>
                  <div className="text-sm text-muted-foreground">Fat</div>
                </div>
              </div>

              {/* Daily Macro Progress */}
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Daily Calories</span>
                    <span>{Math.round((totalNutrition.calories / 2000) * 100)}%</span>
                  </div>
                  <Progress value={(totalNutrition.calories / 2000) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Daily Protein</span>
                    <span>{Math.round((totalNutrition.protein / 50) * 100)}%</span>
                  </div>
                  <Progress value={(totalNutrition.protein / 50) * 100} className="h-2" />
                </div>
              </div>

              <Button 
                onClick={handleHealthifyMeIntegration}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600"
                data-testid="button-healthifyme"
              >
                <Heart className="mr-2 h-4 w-4" />
                Sync with HealthifyMe
              </Button>
            </motion.div>

            {/* Rewards & Surprise Gifts */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
              className="glass-dark rounded-lg p-6"
              data-testid="rewards-earned"
            >
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Star className="mr-2 h-5 w-5 text-primary" />
                Rewards Earned
              </h3>
              
              <div className="text-center mb-4">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="text-4xl font-bold text-primary mb-2"
                >
                  +{order.loyaltyPointsEarned || 0}
                </motion.div>
                <div className="text-muted-foreground">HamCoins Earned</div>
                <div className="w-full bg-secondary rounded-full h-3 mt-3">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${loyaltyProgress}%` }}
                    transition={{ delay: 1, duration: 2 }}
                    className="bg-gradient-to-r from-primary to-orange-400 h-3 rounded-full"
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {currentPoints}/{nextTierPoints} points to Silver tier
                </div>
              </div>

              {/* Surprise Gifts */}
              {surpriseGifts.length > 0 && (
                <div className="space-y-2 mb-4">
                  {surpriseGifts.map((gift, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1.2 + index * 0.2 }}
                      className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black p-3 rounded-lg text-center"
                    >
                      <Gift className="inline mr-2 h-4 w-4" />
                      <span className="font-bold">{gift} Unlocked!</span>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Gamification Elements */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-secondary p-2 rounded">
                  <div className="text-primary font-bold">🎯</div>
                  <div>Daily Spin</div>
                </div>
                <div className="bg-secondary p-2 rounded">
                  <div className="text-primary font-bold">🔥</div>
                  <div>5 Day Streak</div>
                </div>
                <div className="bg-secondary p-2 rounded">
                  <div className="text-primary font-bold">🏆</div>
                  <div>Top 50 User</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8"
        >
          <Button
            variant="secondary"
            className="glass"
            onClick={() => handleShareReceipt("whatsapp")}
            data-testid="button-share-whatsapp"
          >
            <Share2 className="mr-2 h-4 w-4" />
            WhatsApp
          </Button>
          <Button
            variant="secondary"
            className="glass"
            onClick={() => handleShareReceipt("email")}
            data-testid="button-share-email"
          >
            <Download className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Button
            variant="secondary"
            className="glass"
            onClick={() => window.print()}
            data-testid="button-print-receipt"
          >
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button
            className="ripple neon-glow"
            data-testid="button-reorder"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reorder
          </Button>
        </motion.div>

        {/* Integration Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6 }}
          className="mt-8 text-center"
        >
          <div className="glass-dark rounded-lg p-4">
            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full pulse-glow"></div>
                <span>Payment Verified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full pulse-glow"></div>
                <span>Kitchen Notified</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full pulse-glow"></div>
                <span>Ready in 15-20 mins</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}