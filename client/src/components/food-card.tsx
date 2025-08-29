import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { MenuItem } from "@shared/schema";

interface FoodCardProps {
  item: MenuItem;
  index: number;
}

export default function FoodCard({ item, index }: FoodCardProps) {
  const handleAddToCart = () => {
    // TODO: Implement cart functionality
    console.log("Added to cart:", item.name);
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
      className="food-card glass-dark rounded-lg overflow-hidden"
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
        <div className="absolute top-2 right-2">
          <Badge className={item.isVegetarian ? "bg-green-500" : "bg-red-500"}>
            {item.isVegetarian ? "VEG" : "NON-VEG"}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        {/* Item Name and Description */}
        <div className="mb-3">
          <h3 className="font-bold text-lg mb-1" data-testid={`food-name-${index}`}>
            {item.name}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2">
            {item.description}
          </p>
        </div>

        {/* Price and Nutrition */}
        <div className="flex justify-between items-center mb-3">
          <span className="text-primary font-bold text-lg" data-testid={`food-price-${index}`}>
            ₹{item.price}
          </span>
          {item.nutrition && (
            <div className="text-xs text-muted-foreground">
              <span data-testid={`food-nutrition-${index}`}>
                {item.nutrition.calories} kcal | P: {item.nutrition.protein}g | 
                C: {item.nutrition.carbs}g | F: {item.nutrition.fat}g
              </span>
            </div>
          )}
        </div>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {item.tags.slice(0, 3).map((tag, tagIndex) => (
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
                {item.spiceLevel}
              </Badge>
            )}
          </div>
        )}

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
