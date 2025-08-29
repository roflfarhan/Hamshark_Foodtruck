import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, Heart, Star, Gift, Share2, Download, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

export default function OrderCompletion() {
  const { orderId } = useParams();
  
  const { data: order, isLoading } = useQuery({
    queryKey: ["/api/orders", orderId],
    enabled: !!orderId,
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

  // Calculate total nutrition (mock data for demo)
  const totalNutrition = {
    calories: 930,
    protein: 46,
    carbs: 104,
    fat: 32,
  };

  const loyaltyProgress = 65; // Mock progress to next tier
  const nextTierPoints = 250;
  const currentPoints = 158;

  return (
    <div className="min-h-screen py-20 px-4">
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
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-dark rounded-lg p-6"
            data-testid="order-summary"
          >
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <div className="w-6 h-6 bg-primary rounded mr-2"></div>
              Order Summary
            </h3>

            <div className="space-y-4 mb-6">
              {order.items?.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-secondary rounded-lg"
                  data-testid={`order-item-${index}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-muted rounded-lg"></div>
                    <div>
                      <h4 className="font-semibold">Menu Item {index + 1}</h4>
                      <p className="text-xs text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-primary">₹{item.price}</span>
                </motion.div>
              ))}
            </div>

            {/* Bill Breakdown */}
            <div className="border-t border-border pt-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{order.subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>GST ({((parseFloat(order.tax) / parseFloat(order.subtotal)) * 100).toFixed(1)}%)</span>
                <span>₹{order.tax}</span>
              </div>
              {parseFloat(order.total) >= 400 && (
                <div className="flex justify-between text-green-500">
                  <span>🎁 Free Lemon Detox (₹400+ order)</span>
                  <span>-₹30</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg border-t border-border pt-2">
                <span>Total</span>
                <span className="text-primary">₹{order.total}</span>
              </div>
            </div>
          </motion.div>

          {/* Nutrition & Rewards */}
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
                Nutrition Summary
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{totalNutrition.calories}</div>
                  <div className="text-sm text-muted-foreground">Calories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{totalNutrition.protein}g</div>
                  <div className="text-sm text-muted-foreground">Protein</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-400">{totalNutrition.carbs}g</div>
                  <div className="text-sm text-muted-foreground">Carbs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{totalNutrition.fat}g</div>
                  <div className="text-sm text-muted-foreground">Fat</div>
                </div>
              </div>

              <Button 
                onClick={handleHealthifyMeIntegration}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 text-white hover:from-blue-600 hover:to-green-600"
                data-testid="button-healthifyme"
              >
                <Heart className="mr-2 h-4 w-4" />
                Add to HealthifyMe
              </Button>
            </motion.div>

            {/* Rewards Earned */}
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
                  +{order.loyaltyPointsEarned}
                </motion.div>
                <div className="text-muted-foreground">HamCoins Earned</div>
                <div className="w-full bg-secondary rounded-full h-2 mt-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${loyaltyProgress}%` }}
                    transition={{ delay: 1, duration: 2 }}
                    className="bg-primary h-2 rounded-full progress-bar"
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {currentPoints}/{nextTierPoints} points to Silver tier
                </div>
              </div>

              {parseFloat(order.total) >= 400 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black p-3 rounded-lg text-center mb-4"
                >
                  <Gift className="inline mr-2 h-4 w-4" />
                  <span className="font-bold">Free Lemon Detox Water Unlocked!</span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
          className="flex flex-col sm:flex-row gap-4 mt-8"
        >
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => handleShareReceipt("whatsapp")}
            data-testid="button-share-whatsapp"
          >
            <Share2 className="mr-2 h-4 w-4" />
            Share Receipt
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            data-testid="button-save-receipt"
          >
            <Download className="mr-2 h-4 w-4" />
            Save Receipt
          </Button>
          <Button
            className="flex-1 ripple"
            data-testid="button-reorder"
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reorder
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
