import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Trash2, 
  Calculator,
  Settings,
  Star,
  CreditCard,
  MapPin
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { MenuItem } from "@shared/schema";

interface CartItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  customizations: Record<string, any>;
  price: number;
}

interface CustomMeal {
  id: string;
  name: string;
  ingredients: string[];
  basePrice: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sodium: number;
  };
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customMeals, setCustomMeals] = useState<CustomMeal[]>([]);
  const [activeTab, setActiveTab] = useState("cart");
  const { toast } = useToast();

  // Custom meal builder state
  const [mealName, setMealName] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [mealSize, setMealSize] = useState("medium");

  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu"],
  });

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("hamshark-cart");
    const savedCustomMeals = localStorage.getItem("hamshark-custom-meals");
    
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
    if (savedCustomMeals) {
      setCustomMeals(JSON.parse(savedCustomMeals));
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("hamshark-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("hamshark-custom-meals", JSON.stringify(customMeals));
  }, [customMeals]);

  // Available ingredients for custom meals
  const availableIngredients = [
    { name: "Paneer", price: 30, protein: 8, carbs: 2, fat: 6, calories: 80 },
    { name: "Chicken", price: 50, protein: 12, carbs: 0, fat: 4, calories: 80 },
    { name: "Rice", price: 15, protein: 2, carbs: 25, fat: 1, calories: 115 },
    { name: "Quinoa", price: 25, protein: 4, carbs: 20, fat: 2, calories: 110 },
    { name: "Mixed Vegetables", price: 20, protein: 3, carbs: 8, fat: 1, calories: 50 },
    { name: "Lentils", price: 18, protein: 9, carbs: 20, fat: 1, calories: 115 },
    { name: "Spinach", price: 12, protein: 3, carbs: 4, fat: 0, calories: 25 },
    { name: "Tomatoes", price: 10, protein: 1, carbs: 4, fat: 0, calories: 20 },
    { name: "Onions", price: 8, protein: 1, carbs: 6, fat: 0, calories: 25 },
    { name: "Bell Peppers", price: 15, protein: 1, carbs: 5, fat: 0, calories: 25 },
  ];

  const sizePriceMultiplier = {
    small: 0.8,
    medium: 1.0,
    large: 1.3,
  };

  // Cart manipulation functions
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setCartItems(items =>
      items.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
    });
  };

  const addCustomization = (itemId: string, key: string, value: any) => {
    setCartItems(items =>
      items.map(item =>
        item.id === itemId 
          ? { ...item, customizations: { ...item.customizations, [key]: value } }
          : item
      )
    );
  };

  // Custom meal builder functions
  const toggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev =>
      prev.includes(ingredient)
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const calculateCustomMealNutrition = () => {
    const selectedIngredientData = availableIngredients.filter(ing =>
      selectedIngredients.includes(ing.name)
    );
    
    const multiplier = sizePriceMultiplier[mealSize as keyof typeof sizePriceMultiplier];
    
    return selectedIngredientData.reduce(
      (total, ingredient) => ({
        calories: total.calories + (ingredient.calories * multiplier),
        protein: total.protein + (ingredient.protein * multiplier),
        carbs: total.carbs + (ingredient.carbs * multiplier),
        fat: total.fat + (ingredient.fat * multiplier),
        fiber: total.fiber + 2, // Base fiber per ingredient
        sodium: total.sodium + 200, // Base sodium per ingredient
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, sodium: 0 }
    );
  };

  const calculateCustomMealPrice = () => {
    const selectedIngredientData = availableIngredients.filter(ing =>
      selectedIngredients.includes(ing.name)
    );
    
    const basePrice = selectedIngredientData.reduce((total, ingredient) => 
      total + ingredient.price, 0
    );
    
    return basePrice * sizePriceMultiplier[mealSize as keyof typeof sizePriceMultiplier];
  };

  const createCustomMeal = () => {
    if (!mealName.trim() || selectedIngredients.length === 0) {
      toast({
        title: "Invalid meal",
        description: "Please provide a name and select at least one ingredient",
        variant: "destructive",
      });
      return;
    }

    const newMeal: CustomMeal = {
      id: `custom-${Date.now()}`,
      name: mealName.trim(),
      ingredients: selectedIngredients,
      basePrice: calculateCustomMealPrice(),
      nutrition: calculateCustomMealNutrition(),
    };

    setCustomMeals(prev => [...prev, newMeal]);
    
    // Add to cart
    const cartItem: CartItem = {
      id: `cart-${Date.now()}`,
      menuItem: {
        id: newMeal.id,
        name: `Custom: ${newMeal.name}`,
        description: `Your custom creation with: ${newMeal.ingredients.join(", ")}`,
        price: newMeal.basePrice.toString(),
        category: "Custom",
        cuisine: "Custom",
        isVegetarian: !newMeal.ingredients.includes("Chicken"),
        isVegan: !newMeal.ingredients.includes("Chicken") && !newMeal.ingredients.includes("Paneer"),
        spiceLevel: "mild",
        nutrition: newMeal.nutrition,
        ingredients: newMeal.ingredients,
        allergens: newMeal.ingredients.includes("Paneer") ? ["dairy"] : [],
        imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["custom", "fresh", "personalized"],
        isAvailable: true,
      },
      quantity: 1,
      customizations: { size: mealSize },
      price: newMeal.basePrice,
    };

    setCartItems(prev => [...prev, cartItem]);

    // Reset form
    setMealName("");
    setSelectedIngredients([]);
    setMealSize("medium");
    setActiveTab("cart");

    toast({
      title: "Custom meal created!",
      description: `${newMeal.name} has been added to your cart`,
    });
  };

  // Calculations
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05;
  const deliveryFee = subtotal > 300 ? 0 : 25;
  const total = subtotal + tax + deliveryFee;

  // Total nutrition calculation
  const totalNutrition = cartItems.reduce(
    (total, item) => {
      if (item.menuItem.nutrition) {
        return {
          calories: total.calories + (item.menuItem.nutrition.calories * item.quantity),
          protein: total.protein + (item.menuItem.nutrition.protein * item.quantity),
          carbs: total.carbs + (item.menuItem.nutrition.carbs * item.quantity),
          fat: total.fat + (item.menuItem.nutrition.fat * item.quantity),
        };
      }
      return total;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Checkout mutation
  const checkoutMutation = useMutation({
    mutationFn: async () => {
      const orderData = {
        items: cartItems.map(item => ({
          menuItemId: item.menuItem.id,
          quantity: item.quantity,
          customizations: item.customizations,
          price: item.price
        })),
        subtotal: subtotal.toString(),
        tax: tax.toFixed(2),
        total: total.toFixed(2),
        status: "confirmed",
        truckLocation: "Tech Park - Sector 5",
        userId: null
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create order");
      }
      
      return response.json();
    },
    onSuccess: (order) => {
      // Clear cart
      setCartItems([]);
      localStorage.removeItem("hamshark-cart");
      
      // Navigate to order completion
      window.location.href = `/order-completion/${order.id}`;
    },
    onError: () => {
      toast({
        title: "Checkout failed",
        description: "Please try again",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold gradient-text mb-2" data-testid="cart-title">
            Your Cart
          </h1>
          <p className="text-muted-foreground">
            Review your order, customize your meals, or create something new
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="cart" data-testid="tab-cart">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart ({cartItems.length})
            </TabsTrigger>
            <TabsTrigger value="custom" data-testid="tab-custom">
              <Settings className="mr-2 h-4 w-4" />
              Create Custom Meal
            </TabsTrigger>
          </TabsList>

          {/* Cart Tab */}
          <TabsContent value="cart" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                  {cartItems.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="glass rounded-lg p-4"
                      data-testid={`cart-item-${item.id}`}
                    >
                      <div className="flex gap-4">
                        <img
                          src={item.menuItem.imageUrl || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"}
                          alt={item.menuItem.name}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold">{item.menuItem.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {item.menuItem.description}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id)}
                              data-testid={`remove-item-${item.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                data-testid={`decrease-${item.id}`}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                data-testid={`increase-${item.id}`}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="text-right">
                              <div className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</div>
                              <div className="text-sm text-muted-foreground">₹{item.price} each</div>
                            </div>
                          </div>

                          {/* Customizations */}
                          {Object.keys(item.customizations).length > 0 && (
                            <div className="mt-2 p-2 bg-muted/20 rounded">
                              <h4 className="text-sm font-medium mb-1">Customizations:</h4>
                              {Object.entries(item.customizations).map(([key, value]) => (
                                <div key={key} className="text-xs text-muted-foreground">
                                  {key}: {value}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {cartItems.length === 0 && (
                  <div className="text-center py-12 glass rounded-lg">
                    <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
                    <p className="text-muted-foreground">
                      Add some delicious items from our menu or create a custom meal!
                    </p>
                  </div>
                )}
              </div>

              {/* Order Summary & Nutrition */}
              <div className="space-y-4">
                {/* Nutrition Summary */}
                {cartItems.length > 0 && (
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calculator className="mr-2 h-4 w-4" />
                        Nutrition Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex justify-between">
                          <span>Calories:</span>
                          <span className="font-medium">{Math.round(totalNutrition.calories)} kcal</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Protein:</span>
                          <span className="font-medium">{Math.round(totalNutrition.protein)}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Carbs:</span>
                          <span className="font-medium">{Math.round(totalNutrition.carbs)}g</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Fat:</span>
                          <span className="font-medium">{Math.round(totalNutrition.fat)}g</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Order Summary */}
                {cartItems.length > 0 && (
                  <Card className="glass">
                    <CardHeader>
                      <CardTitle>Order Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (5%):</span>
                        <span>₹{tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Delivery Fee:</span>
                        <span className={deliveryFee === 0 ? "text-green-500" : ""}>
                          {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                        </span>
                      </div>
                      {deliveryFee === 0 && (
                        <div className="text-xs text-green-500">
                          🎉 Free delivery on orders above ₹300!
                        </div>
                      )}
                      <Separator />
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total:</span>
                        <span className="text-primary">₹{total.toFixed(2)}</span>
                      </div>
                      
                      <Button
                        className="w-full mt-4"
                        onClick={() => checkoutMutation.mutate()}
                        disabled={checkoutMutation.isPending}
                        data-testid="checkout-button"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        {checkoutMutation.isPending ? "Processing..." : "Proceed to Checkout"}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Custom Meal Builder Tab */}
          <TabsContent value="custom" className="space-y-6">
            <Card className="glass">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="mr-2 h-4 w-4 text-yellow-500" />
                  Create Your Custom Meal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Meal Name */}
                <div className="space-y-2">
                  <Label htmlFor="meal-name">Meal Name</Label>
                  <Input
                    id="meal-name"
                    placeholder="e.g., My Special Bowl"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    data-testid="meal-name-input"
                  />
                </div>

                {/* Size Selection */}
                <div className="space-y-2">
                  <Label>Meal Size</Label>
                  <Select value={mealSize} onValueChange={setMealSize}>
                    <SelectTrigger data-testid="meal-size-select">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small (20% less)</SelectItem>
                      <SelectItem value="medium">Medium (Standard)</SelectItem>
                      <SelectItem value="large">Large (30% more)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Ingredients Selection */}
                <div className="space-y-4">
                  <Label>Select Ingredients</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableIngredients.map((ingredient) => (
                      <motion.div
                        key={ingredient.name}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedIngredients.includes(ingredient.name)
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                        onClick={() => toggleIngredient(ingredient.name)}
                        data-testid={`ingredient-${ingredient.name.toLowerCase().replace(' ', '-')}`}
                      >
                        <div className="font-medium text-sm">{ingredient.name}</div>
                        <div className="text-xs text-muted-foreground">₹{ingredient.price}</div>
                        <div className="text-xs text-muted-foreground">
                          {ingredient.protein}g protein
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Live Preview */}
                {selectedIngredients.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="border rounded-lg p-4 bg-muted/20"
                  >
                    <h3 className="font-semibold mb-3">Live Preview</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="font-medium">Price: ₹{calculateCustomMealPrice()}</div>
                        <div className="text-muted-foreground">
                          Ingredients: {selectedIngredients.length}
                        </div>
                      </div>
                      <div>
                        <div className="font-medium">
                          Calories: {Math.round(calculateCustomMealNutrition().calories)}
                        </div>
                        <div className="text-muted-foreground">
                          Protein: {Math.round(calculateCustomMealNutrition().protein)}g
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <Button
                  onClick={createCustomMeal}
                  disabled={!mealName.trim() || selectedIngredients.length === 0}
                  className="w-full"
                  data-testid="create-meal-button"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create & Add to Cart
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}