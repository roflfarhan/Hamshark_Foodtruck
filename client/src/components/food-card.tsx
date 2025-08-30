import { motion } from "framer-motion";
import { Plus, Star, AlertTriangle, Info, Utensils } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { MenuItem } from "@shared/schema";

interface FoodCardProps {
  item: MenuItem;
  index: number;
}

export default function FoodCard({ item, index }: FoodCardProps) {
  const isChefSpecial = item.tags?.includes("chef-special") || item.tags?.includes("chef's special");
  const isPopular = item.tags?.includes("popular");

  const handleAddToCart = async () => {
    try {
      // Create a sample order for demonstration
      const orderData = {
        items: [{
          menuItemId: item.id,
          quantity: 1,
          customizations: {},
          price: parseFloat(item.price)
        }],
        subtotal: item.price,
        tax: (parseFloat(item.price) * 0.05).toFixed(2),
        total: (parseFloat(item.price) * 1.05).toFixed(2),
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

      if (response.ok) {
        const order = await response.json();
        // Navigate to order completion page
        window.location.href = `/order-completion/${order.id}`;
      }
    } catch (error) {
      console.error("Failed to create order:", error);
    }
  };

  const getSpiceLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "mild":
        return "bg-green-500";
      case "medium":
        return "bg-orange-500";
      case "hot":
      case "spicy":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "vegetarian":
      case "vegan":
        return "bg-green-500";
      case "high-protein":
        return "bg-blue-500";
      case "chef-special":
      case "chef's special":
        return "bg-yellow-500 text-black";
      case "popular":
        return "bg-red-500";
      case "healthy":
        return "bg-green-400";
      case "student-combo":
        return "bg-blue-400";
      case "traditional":
        return "bg-purple-500";
      case "gluten-free":
        return "bg-emerald-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`food-card glass-dark rounded-lg overflow-hidden ${isChefSpecial ? 'ring-2 ring-yellow-500' : ''}`}
      data-testid={`food-card-${index}`}
    >
      {/* Food Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={item.imageUrl || "/api/placeholder/400/300"}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = `https://via.placeholder.com/400x300/1a1a1a/FFD300?text=${encodeURIComponent(item.name)}`;
          }}
        />
        <div className="absolute top-2 right-2 flex gap-2">
          <Badge className={item.isVegetarian ? "bg-green-500" : "bg-red-500"}>
            {item.isVegetarian ? "VEG" : "NON-VEG"}
          </Badge>
          {isChefSpecial && (
            <Badge className="bg-yellow-500 text-black">
              <Star className="mr-1 h-3 w-3" />
              Chef's Choice
            </Badge>
          )}
          {isPopular && (
            <Badge className="bg-red-500">
              <Star className="mr-1 h-3 w-3" />
              Popular
            </Badge>
          )}
        </div>
      </div>

      <div className="p-4 space-y-3">
        {/* Item Name and Description */}
        <div>
          <h3 className="font-bold text-lg mb-1" data-testid={`food-name-${index}`}>
            {item.name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Price and Cuisine */}
        <div className="flex justify-between items-center">
          <span className="text-primary font-bold text-xl" data-testid={`food-price-${index}`}>
            ₹{item.price}
          </span>
          <Badge variant="outline" className="text-xs">
            {item.cuisine}
          </Badge>
        </div>

        {/* Detailed Nutrition Information */}
        {item.nutrition && (
          <div className="bg-muted/20 rounded-lg p-3 space-y-2">
            <h4 className="text-sm font-semibold flex items-center">
              <Info className="mr-1 h-3 w-3" />
              Nutrition per serving
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span>Calories:</span>
                <span className="font-medium" data-testid={`food-calories-${index}`}>{item.nutrition.calories} kcal</span>
              </div>
              <div className="flex justify-between">
                <span>Protein:</span>
                <span className="font-medium">{item.nutrition.protein}g</span>
              </div>
              <div className="flex justify-between">
                <span>Carbs:</span>
                <span className="font-medium">{item.nutrition.carbs}g</span>
              </div>
              <div className="flex justify-between">
                <span>Fat:</span>
                <span className="font-medium">{item.nutrition.fat}g</span>
              </div>
              {item.nutrition.fiber && (
                <div className="flex justify-between">
                  <span>Fiber:</span>
                  <span className="font-medium">{item.nutrition.fiber}g</span>
                </div>
              )}
              {item.nutrition.sodium && (
                <div className="flex justify-between">
                  <span>Sodium:</span>
                  <span className="font-medium">{item.nutrition.sodium}mg</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Ingredients */}
        {item.ingredients && item.ingredients.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center">
              <Utensils className="mr-1 h-3 w-3" />
              Ingredients
            </h4>
            <p className="text-xs text-muted-foreground">
              {item.ingredients.join(", ")}
            </p>
          </div>
        )}

        {/* Allergen Information */}
        {item.allergens && item.allergens.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold flex items-center text-orange-500">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Contains Allergens
            </h4>
            <div className="flex flex-wrap gap-1">
              {item.allergens.map((allergen, allergenIndex) => (
                <Badge
                  key={allergenIndex}
                  variant="destructive"
                  className="text-xs"
                  data-testid={`food-allergen-${index}-${allergenIndex}`}
                >
                  {allergen}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Tags and Spice Level */}
        <div className="flex flex-wrap gap-2">
          {item.tags && item.tags.slice(0, 3).map((tag, tagIndex) => (
            <Badge
              key={tagIndex}
              className={`${getTagColor(tag)} text-white text-xs`}
              data-testid={`food-tag-${index}-${tagIndex}`}
            >
              {tag}
            </Badge>
          ))}
          {item.spiceLevel && (
            <Badge
              className={`${getSpiceLevelColor(item.spiceLevel)} text-white text-xs`}
              data-testid={`food-spice-${index}`}
            >
              🌶️ {item.spiceLevel}
            </Badge>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          className="w-full ripple"
          disabled={!item.isAvailable}
          data-testid={`button-add-to-cart-${index}`}
        >
          {item.isAvailable ? (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          ) : (
            "Currently Unavailable"
          )}
        </Button>
      </div>
    </motion.div>
  );
}
